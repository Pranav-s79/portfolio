import { useRef, useState } from 'react'
import { profile } from '../data/portfolio.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX = { name: 80, email: 120, company: 100, message: 2000 }
const COOLDOWN_MS = 8000
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || ''

function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const EMPTY_FORM = { name: '', email: '', company: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [invalid, setInvalid] = useState({})
  const [status, setStatus] = useState('idle')
  const [cooling, setCooling] = useState(false)
  const honeypot = useRef('')
  const lastSent = useRef(0)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value.slice(0, MAX[k]) }))
    if (invalid[k]) setInvalid((v) => ({ ...v, [k]: false }))
    setStatus('idle')
  }

  const openMailto = ({ name, company, message }) => {
    const signoff = company ? `- ${name}\n- ${company}` : `- ${name}`
    const body = encodeURIComponent(`${message}\n\n${signoff}`)
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `Portfolio message from ${name}`,
    )}&body=${body}`
    window.location.href = href
  }

  const submit = async (e) => {
    e.preventDefault()

    if (honeypot.current) {
      setStatus('sent')
      setForm(EMPTY_FORM)
      return
    }

    const now = Date.now()
    if (cooling || now - lastSent.current < COOLDOWN_MS) return

    const name = form.name.trim()
    const email = form.email.trim()
    const company = form.company.trim()
    const message = form.message.trim()
    const next = {
      name: name === '',
      email: !EMAIL_RE.test(email),
      message: message === '',
    }
    setInvalid(next)
    if (next.name || next.email || next.message) return

    setCooling(true)
    setStatus('sending')

    if (CONTACT_API_URL) {
      try {
        const response = await fetch(CONTACT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            company,
            message,
            website: honeypot.current,
          }),
        })
        if (!response.ok) throw new Error('Contact send failed')
      } catch {
        setStatus('error')
        setCooling(false)
        return
      }
    } else {
      openMailto({ name, company, message })
    }

    lastSent.current = now
    setStatus('sent')
    setForm(EMPTY_FORM)
    window.setTimeout(() => setCooling(false), COOLDOWN_MS)
  }

  const fieldCls = (k) => (invalid[k] ? 'field field--invalid' : 'field')

  return (
    <div className="page fade-in">
      <header className="page-head">
        <p className="eyebrow rise" style={{ animationDelay: '40ms' }}>
          05 - contact
        </p>
        <h1 className="page__title rise" style={{ animationDelay: '110ms' }}>
          Contact
        </h1>
        <p className="page__lead rise" style={{ animationDelay: '180ms' }}>
          Open to opportunities.
        </p>
      </header>

      <div className="contact-stage">
        <form
          className="contact-form pane rise"
          style={{ animationDelay: '260ms' }}
          onSubmit={submit}
          noValidate
        >
          <div className={fieldCls('name')}>
            <label htmlFor="c-name">name</label>
            <input
              id="c-name"
              type="text"
              autoComplete="name"
              maxLength={MAX.name}
              value={form.name}
              onChange={set('name')}
            />
          </div>
          <div className={fieldCls('email')}>
            <label htmlFor="c-email">email</label>
            <input
              id="c-email"
              type="email"
              autoComplete="email"
              maxLength={MAX.email}
              value={form.email}
              onChange={set('email')}
            />
          </div>
          <div className={fieldCls('company')}>
            <label htmlFor="c-company">
              company <span className="field__optional">(optional)</span>
            </label>
            <input
              id="c-company"
              type="text"
              autoComplete="organization"
              maxLength={MAX.company}
              value={form.company}
              onChange={set('company')}
            />
          </div>
          <div className={fieldCls('message')}>
            <label htmlFor="c-message">message</label>
            <textarea
              id="c-message"
              rows={4}
              maxLength={MAX.message}
              value={form.message}
              onChange={set('message')}
            />
          </div>

          <div className="hp-field" aria-hidden="true">
            <label htmlFor="c-website">website</label>
            <input
              id="c-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              onChange={(e) => {
                honeypot.current = e.target.value
              }}
            />
          </div>

          <div className="contact-actions">
            <button type="submit" className="send-btn" disabled={cooling}>
              {status === 'sending' ? 'sending...' : cooling ? 'sent' : 'send ->'}
            </button>
            {status === 'sent' && <span className="send-status">Sent.</span>}
            {status === 'error' && <span className="send-status">Could not send.</span>}
          </div>

          <div className="contact-socials">
            <a
              className="social-link"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <IconGitHub />
            </a>
            <a
              className="social-link"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <IconLinkedIn />
            </a>
            <a
              className="social-link"
              href={`mailto:${profile.email}`}
              aria-label={`Email ${profile.email}`}
              title="Email"
            >
              <IconEmail />
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
