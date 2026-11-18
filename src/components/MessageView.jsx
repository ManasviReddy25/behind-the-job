import { useEffect, useState } from 'react'

// Renders the message a learner is looking at, in the look of the real app. All text comes from content/scenarios.js.
// Nothing here is highlighted. Red flags stay unmarked.

function parseInitials(name) {
  return name
    .replace(/\(.*?\)/g, '')
    .replace(/\b(Dr|Mr|Mrs|Ms)\.?\s/g, '')
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

const AVATAR_COLORS = ['#6d28d9', '#0e7490', '#b45309', '#be123c', '#4d7c0f', '#1d4ed8', '#9d174d']
function colorFor(name) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 997
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function Avatar({ name, size = 44, color }) {
  return (
    <span className="avatar" aria-hidden="true" style={{ width: size, height: size, background: color ?? colorFor(name), fontSize: size * 0.34 }}>
      {parseInitials(name)}
    </span>
  )
}

function Chrome({ title, children }) {
  return (
    <div className="chrome" aria-hidden="true">
      <span className="lights">
        <i />
        <i />
        <i />
      </span>
      <span className="chrome-title">{title}</span>
      {children}
    </div>
  )
}

function Email({ b }) {
  const gmail = b.client !== 'outlook'
  return (
    <article className={`msg msg-email ${gmail ? 'is-gmail' : 'is-outlook'}`} aria-label="Email">
      <Chrome title={gmail ? 'Inbox' : 'Mail'}>
        <span className="chrome-tools">
          <span title="Archive">▭</span>
          <span title="Delete">🗑</span>
          <span title="Mark unread">✉</span>
        </span>
      </Chrome>
      <div className="email-top">
        <h2>
          <span className="visually-hidden">Subject: </span>
          {b.subject}
        </h2>
        <div className="sender-row">
          <Avatar name={b.from.name} />
          <div className="sender-main">
            <div className="sender-line">
              <span className="visually-hidden">From: </span>
              <span className="sender-name">{b.from.name}</span>
              <span className="email-date">{b.date}</span>
            </div>
            <div className="sender-addr">&lt;{b.from.addr}&gt;</div>
            <div className="sender-to">to {b.to}</div>
          </div>
        </div>
      </div>
      <div className="email-body">
        {b.logo && (
          <div className="fake-logo" aria-label={`${b.logo} logo`}>
            {b.logo}
          </div>
        )}
        {b.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {b.signature && (
          <p className="signoff">
            {b.signature.map((l, j) => (
              <span key={j}>{l}</span>
            ))}
          </p>
        )}
        {b.attachments && (
          <div className="attachments">
            {b.attachments.map((a) => (
              <span key={a.name} className="attachment">
                <span className="pdf-icon">PDF</span>
                <span>
                  {a.name}
                  <small>{a.size}</small>
                </span>
              </span>
            ))}
          </div>
        )}
        {b.footer && <p className="email-footer">{b.footer}</p>}
      </div>
      <div className="email-actions" aria-hidden="true">
        <span>↩ Reply</span>
        <span>↪ Forward</span>
      </div>
    </article>
  )
}

const APP_LOOK = {
  sms: { title: 'Messages', cls: 'is-sms' },
  whatsapp: { title: 'Chat', cls: 'is-wa' },
  telegram: { title: 'Chat', cls: 'is-tg' },
}

function Thread({ b }) {
  const look = APP_LOOK[b.app] ?? APP_LOOK.sms
  const [shown, setShown] = useState(0)
  // Messages appear one by one with a typing dot, like a real chat.
  useEffect(() => {
    if (shown >= b.messages.length) return undefined
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 350 : 750)
    return () => clearTimeout(t)
  }, [shown, b.messages.length])
  const typing = shown < b.messages.length
  return (
    <article className={`msg msg-phone ${look.cls}`} aria-label={`${look.title} thread`}>
      <div className="phone-head">
        <Avatar name={b.contact.name} size={38} />
        <div>
          <div className="phone-name">{b.contact.name}</div>
          {b.contact.sub && <div className="phone-sub">{b.contact.sub}</div>}
        </div>
      </div>
      <div className="phone-body">
        <div className="sms-from">{b.day}</div>
        {b.messages.slice(0, shown).map((m, i) => (
          <div key={i} className={`bubble-row ${m.who === 'me' ? 'is-me' : 'is-them'}`}>
            <div className="bubble-wrap">
              {m.name && <div className="bubble-name">{m.name}</div>}
              <div className="bubble">{m.text}</div>
              {m.time && <div className="bubble-time">{m.time}</div>}
            </div>
          </div>
        ))}
        {typing && (
          <div className="bubble-row is-them" aria-hidden="true">
            <div className="bubble typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function AppScreen({ b }) {
  return (
    <div className="app-card" aria-label={`${b.name} app`}>
      <div className="app-name">{b.name}</div>
      {b.lines.map((l, i) => (
        <p key={i} className={i === 0 ? 'app-big' : ''}>
          {l}
        </p>
      ))}
    </div>
  )
}

function LinkedIn({ b }) {
  return (
    <article className="msg msg-linkedin" aria-label="Recruiter message">
      <div className="li-bar" aria-hidden="true">
        <span className="li-in">in</span>
        <span>Messaging</span>
      </div>
      <div className="li-profile">
        <Avatar name={b.profile.name} size={56} color="#0a66c2" />
        <div>
          <div className="li-name">{b.profile.name}</div>
          <div className="li-headline">{b.profile.headline}</div>
          <div className="li-meta">{b.profile.meta}</div>
        </div>
      </div>
      <div className="li-message">
        {b.message.map((p, i) => (
          <div key={i} className="li-bubble">
            {p}
          </div>
        ))}
      </div>
    </article>
  )
}

function JobPost({ b }) {
  return (
    <article className="msg msg-job" aria-label="Job posting">
      <div className="job-board" aria-hidden="true">
        <span className="job-logo">◆</span> {b.board}
      </div>
      <div className="job-body">
        <div className="job-head">
          <span className="job-co" aria-hidden="true">
            {parseInitials(b.company)}
          </span>
          <div>
            <h2>{b.title}</h2>
            <div className="job-company">{b.company}</div>
            <div className="job-loc">{b.location}</div>
          </div>
        </div>
        <div className="job-tags">
          <span>{b.pay}</span>
          <span>{b.type}</span>
        </div>
        {b.desc.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div className="job-foot">
          <span className="job-apply" aria-hidden="true">
            Apply
          </span>
          <span className="small">{b.posted}</span>
        </div>
      </div>
    </article>
  )
}

function FormBlock({ b }) {
  return (
    <article className="msg msg-form" aria-label="Online form">
      <div className="url-bar" aria-hidden="true">
        <span className="lock">🔒</span> {b.url}
      </div>
      <div className="form-body">
        <h2>{b.title}</h2>
        {b.fields.map((f) => (
          <div key={f} className="form-field">
            <span className="form-label">{f}</span>
            <span className="form-input" aria-hidden="true" />
          </div>
        ))}
      </div>
    </article>
  )
}

function Notes({ b }) {
  return (
    <article className="msg msg-notes" aria-label="What you find">
      <div className="notes-label">{b.heading}</div>
      <div className="stickies">
        {b.items.map((it, i) => (
          <div key={i} className={`sticky sticky-${i % 3}`}>
            {it}
          </div>
        ))}
      </div>
    </article>
  )
}

function Profiles({ b }) {
  return (
    <div className="profiles" aria-label="Three profiles">
      {b.profiles.map((p) => (
        <article className="profile-card" key={p.name} style={{ '--tone': p.tone }}>
          <div className="profile-name">{p.name}</div>
          <p className="profile-who">{p.who}</p>
          <p>{p.text}</p>
        </article>
      ))}
    </div>
  )
}

function Block({ b }) {
  switch (b.kind) {
    case 'email':
      return <Email b={b} />
    case 'thread':
      return <Thread b={b} />
    case 'appscreen':
      return <AppScreen b={b} />
    case 'linkedin':
      return <LinkedIn b={b} />
    case 'jobpost':
      return <JobPost b={b} />
    case 'form':
      return <FormBlock b={b} />
    case 'notes':
      return <Notes b={b} />
    case 'profiles':
      return <Profiles b={b} />
    case 'caption':
      return <p className="msg-between">{b.text}</p>
    default:
      return null
  }
}

export default function MessageView({ message }) {
  if (!message) return null
  return (
    <div className="msg-stack">
      {message.blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
    </div>
  )
}
