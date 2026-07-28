// Contact endpoint: validate -> CAPTCHA -> rate limit -> send.
//
// Defense layers, cheapest first so abuse is rejected before it costs anything:
//   1. Origin allowlist (CORS)
//   2. Honeypot field
//   3. Field validation, control-char stripping, header-injection guard
//   4. Cloudflare Turnstile CAPTCHA
//   5. Upstash Redis sliding-window rate limit (per IP)
//   6. Resend delivery with reply-to set to the sender

import { checkRateLimit, clientIp } from './_lib/rateLimit.js'
import { escapeHtml, validateContact } from './_lib/validate.js'
import { verifyTurnstile } from './_lib/turnstile.js'

const MAX_BODY_BYTES = 16 * 1024

function send(res, status, body, origin, extraHeaders = {}) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Vary', 'Origin')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'no-store')
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin)
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value)
  res.end(JSON.stringify(body))
}

// Comma-separated allowlist. Unset => allow any origin (useful for local dev).
function resolveOrigin(req) {
  const configured = process.env.CONTACT_ALLOWED_ORIGIN
  if (!configured) return req.headers.origin || '*'
  const allowed = configured.split(',').map((o) => o.trim()).filter(Boolean)
  const origin = req.headers.origin || ''
  // Same-origin browser POSTs may omit Origin; allow them through.
  if (!origin) return allowed[0]
  return allowed.includes(origin) ? origin : null
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    if (req.body.length > MAX_BODY_BYTES) return null
    try {
      return JSON.parse(req.body)
    } catch {
      return null
    }
  }
  return {}
}

function buildEmail({ name, email, company, message }) {
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Company', company || 'Not provided'],
  ]
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6f6b63;">${label}</td>` +
        `<td style="padding:6px 0;color:#1b1b1e;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  return {
    html: `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#1b1b1e;">
      <h2 style="margin:0 0 16px;">New portfolio message</h2>
      <table style="border-collapse:collapse;margin:0 0 18px;">${htmlRows}</table>
      <div style="white-space:pre-wrap;border-top:1px solid #d8d3c9;padding-top:16px;">${escapeHtml(
        message,
      )}</div>
    </div>`,
    text: [
      'New portfolio message',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      '',
      message,
    ].join('\n'),
  }
}

export default async function handler(req, res) {
  const origin = resolveOrigin(req)
  if (!origin) return send(res, 403, { ok: false, error: 'Origin not allowed.' }, null)
  if (req.method === 'OPTIONS') return send(res, 204, {}, origin)
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'Use POST.' }, origin)

  const body = parseBody(req)
  if (body === null) return send(res, 400, { ok: false, error: 'Malformed request.' }, origin)

  const result = validateContact(body)
  if (!result.ok) {
    // Honeypot and spam hits get a 200 so bots cannot probe the filter.
    if (result.honeypot || result.spam) return send(res, 200, { ok: true }, origin)
    return send(res, 400, { ok: false, error: result.error }, origin)
  }

  const ip = clientIp(req)

  const captcha = await verifyTurnstile(body.turnstileToken, { remoteIp: ip })
  if (!captcha.ok) return send(res, 403, { ok: false, error: captcha.error }, origin)

  const limit = await checkRateLimit(ip)
  if (!limit.allowed) {
    return send(
      res,
      429,
      { ok: false, error: 'Too many messages. Please try again later.' },
      origin,
      { 'Retry-After': String(limit.retryAfterSeconds) },
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured.')
    return send(res, 500, { ok: false, error: 'Email service is not configured.' }, origin)
  }

  const { name, email, company, message } = result.data
  const { html, text } = buildEmail(result.data)

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.CONTACT_TO_EMAIL || 'pranav.senthilkumar79@gmail.com',
        reply_to: email,
        subject: `Portfolio message from ${name}${company ? ` (${company})` : ''}`,
        html,
        text,
      }),
    })

    if (!response.ok) {
      console.error('Resend send failed:', response.status, await response.text())
      return send(res, 502, { ok: false, error: 'Email could not be sent.' }, origin)
    }
  } catch (error) {
    console.error('Resend request error:', error.message)
    return send(res, 502, { ok: false, error: 'Email could not be sent.' }, origin)
  }

  return send(res, 200, { ok: true }, origin)
}
