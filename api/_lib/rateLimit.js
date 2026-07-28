// Sliding-window rate limiter backed by Upstash Redis (REST API).
//
// Limits follow common practice for low-volume contact forms: a short burst
// window stops rapid-fire submissions, and a daily cap stops slow drip abuse.
// If Redis is not configured the limiter fails OPEN (allows the request) so a
// misconfigured store never silently blocks real mail -- Turnstile still gates.

export const LIMITS = [
  { id: 'burst', max: 3, windowSeconds: 60 * 60 }, // 3 per hour
  { id: 'daily', max: 10, windowSeconds: 60 * 60 * 24 }, // 10 per day
]

function redisConfig(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL
  const token = env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ''), token }
}

// Vercel sets x-forwarded-for; the left-most entry is the client. Everything
// downstream is appended by proxies, so trusting index 0 is correct here.
export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

async function redisCommand(config, command, fetchImpl = fetch) {
  const response = await fetchImpl(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!response.ok) throw new Error(`Upstash error ${response.status}`)
  const payload = await response.json()
  return payload.result
}

/**
 * Consumes one token per configured window for `identifier`.
 * Returns { allowed, limit, remaining, retryAfterSeconds }.
 */
export async function checkRateLimit(identifier, options = {}) {
  const { env = process.env, fetchImpl = fetch, limits = LIMITS, now = Date.now() } = options
  const config = redisConfig(env)

  // Fail open: no store configured means no limiting, not a hard failure.
  if (!config) return { allowed: true, skipped: true, remaining: Infinity }

  const bucket = Math.floor(now / 1000)

  for (const limit of limits) {
    const window = Math.floor(bucket / limit.windowSeconds)
    const key = `contact:${limit.id}:${identifier}:${window}`

    let count
    try {
      count = Number(await redisCommand(config, ['INCR', key], fetchImpl))
      // Only set TTL on first hit; re-setting would extend the window forever.
      if (count === 1) {
        await redisCommand(config, ['EXPIRE', key, String(limit.windowSeconds)], fetchImpl)
      }
    } catch (error) {
      // Store unreachable -> fail open rather than dropping a real message.
      console.error('Rate limit store unavailable:', error.message)
      return { allowed: true, degraded: true, remaining: Infinity }
    }

    if (count > limit.max) {
      const windowEnd = (window + 1) * limit.windowSeconds
      return {
        allowed: false,
        limit: limit.id,
        max: limit.max,
        remaining: 0,
        retryAfterSeconds: Math.max(1, windowEnd - bucket),
      }
    }
  }

  return { allowed: true, remaining: Math.max(0, LIMITS[0].max - 1) }
}
