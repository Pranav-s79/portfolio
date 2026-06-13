const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX = { name: 80, email: 120, company: 100, message: 2000 }

const json = (res, status, body, origin) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Origin', origin || '*')
  res.end(JSON.stringify(body))
}

const clean = (value, limit) => String(value || '').trim().slice(0, limit)

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const allowedOrigin = (req) => {
  const configured = process.env.CONTACT_ALLOWED_ORIGIN
  if (!configured) return '*'
  const origin = req.headers.origin || ''
  return origin === configured ? configured : null
}

export default async function handler(req, res) {
  const origin = allowedOrigin(req)
  if (!origin) return json(res, 403, { ok: false, error: 'Origin not allowed.' }, 'null')
  if (req.method === 'OPTIONS') return json(res, 204, {}, origin)
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Use POST.' }, origin)

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL || 'pranav.senthilkumar79@gmail.com'
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'

  if (!apiKey) {
    return json(res, 500, { ok: false, error: 'Email service is not configured.' }, origin)
  }

  const body = req.body || {}
  if (body.website) return json(res, 200, { ok: true }, origin)

  const name = clean(body.name, MAX.name)
  const email = clean(body.email, MAX.email)
  const company = clean(body.company, MAX.company)
  const message = clean(body.message, MAX.message)

  if (!name || !EMAIL_RE.test(email) || !message) {
    return json(res, 400, { ok: false, error: 'Name, valid email, and message are required.' }, origin)
  }

  const subject = `Portfolio message from ${name}`
  const rows = [
    ['Name', name],
    ['Email', email],
    ['Company', company || 'Not provided'],
  ]
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#6f6b63;">${label}</td><td style="padding:6px 0;color:#1b1b1e;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#1b1b1e;">
      <h2 style="margin:0 0 16px;">New portfolio message</h2>
      <table style="border-collapse:collapse;margin:0 0 18px;">${htmlRows}</table>
      <div style="white-space:pre-wrap;border-top:1px solid #d8d3c9;padding-top:16px;">${escapeHtml(message)}</div>
    </div>
  `

  const text = [
    'New portfolio message',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || 'Not provided'}`,
    '',
    message,
  ].join('\n')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject,
      html,
      text,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error('Resend send failed:', detail)
    return json(res, 502, { ok: false, error: 'Email could not be sent.' }, origin)
  }

  return json(res, 200, { ok: true }, origin)
}
