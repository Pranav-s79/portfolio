// Cloudflare Turnstile server-side verification.
// Turnstile is the privacy-friendly CAPTCHA alternative; the client widget
// produces a single-use token that must be verified here before we send mail.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * Verifies a Turnstile token.
 * Returns { ok, skipped?, error? }.
 *
 * When TURNSTILE_SECRET_KEY is unset the check is skipped so local development
 * and preview deploys work without CAPTCHA keys. Production sets the key.
 */
export async function verifyTurnstile(token, options = {}) {
  const { env = process.env, fetchImpl = fetch, remoteIp } = options
  const secret = env.TURNSTILE_SECRET_KEY

  if (!secret) return { ok: true, skipped: true }
  if (!token) return { ok: false, error: 'Captcha verification is required.' }

  const form = new URLSearchParams({ secret, response: token })
  if (remoteIp && remoteIp !== 'unknown') form.set('remoteip', remoteIp)

  try {
    const response = await fetchImpl(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    })
    const payload = await response.json()
    if (payload.success) return { ok: true }
    return { ok: false, error: 'Captcha verification failed.', codes: payload['error-codes'] }
  } catch (error) {
    // Fail CLOSED: an unverifiable token is exactly the case CAPTCHA defends.
    console.error('Turnstile verification error:', error.message)
    return { ok: false, error: 'Captcha verification unavailable.' }
  }
}
