import { useState } from 'react'
import { profile } from '../data/portfolio.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [invalid, setInvalid] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (invalid[k]) setInvalid((v) => ({ ...v, [k]: false }))
    setSent(false)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {
      name: form.name.trim() === '',
      email: !EMAIL_RE.test(form.email),
      message: form.message.trim() === '',
    }
    setInvalid(next)
    if (next.name || next.email || next.message) return

    const body = encodeURIComponent(`${form.message}\n\n- ${form.name}`)
    const href = `mailto:${profile.email}?subject=${encodeURIComponent(
      `Portfolio message from ${form.name}`
    )}&body=${body}`

    window.location.href = href
    setSent(true)
    setForm({ name: '', email: '', message: '' })
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
          Open to Summer 2026 internships.
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
              value={form.name}
              onChange={set('name')}
            />
          </div>
          <div className={fieldCls('email')}>
            <label htmlFor="c-email">email</label>
            <input
              id="c-email"
              type="email"
              value={form.email}
              onChange={set('email')}
            />
          </div>
          <div className={fieldCls('message')}>
            <label htmlFor="c-message">message</label>
            <textarea
              id="c-message"
              rows={4}
              value={form.message}
              onChange={set('message')}
            />
          </div>

          <div className="contact-actions">
            <button type="submit" className="send-btn">
              send →
            </button>
            {sent && <span className="send-status">Sent.</span>}
          </div>

          <p className="contact-fallback">
            or directly -{' '}
            <a className="link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <br />
            <a className="link" href={profile.github} target="_blank" rel="noopener noreferrer">
              github
            </a>
            {' · '}
            <a className="link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
