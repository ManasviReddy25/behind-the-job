// Writes the v7 scenario text to a markdown file. Run: node scripts/export-md.mjs out.md
import fs from 'node:fs'
import { SCENARIOS } from '../src/content/scenarios.js'
import { PARTS } from '../src/content/shared.js'

const out = ['# Behind the Job: scenarios (v7)', '', 'Twelve different people or cases, twelve different techniques. Generated from src/content/scenarios.js.', '']
const CUE_NEW = ['C23 Impersonates a professor, school office or campus program (free or lookalike address).', 'C24 Asked to pay with gift cards or buy gift cards.', 'C25 Asked for SSN, ID photo or bank details before a real, verified offer.', 'C26 Asked to receive packages and forward them, or handle payments, for an employer.']
out.push('## New cues in v7 (C1 to C22 are unchanged from the persona doc)', '', ...CUE_NEW.map((c) => `- ${c}`), '')
for (const part of ['victim', 'offender', 'guardian']) {
  out.push(`## Part ${PARTS[part].number}: ${PARTS[part].name}`, '', ...PARTS[part].points.map((p) => `- ${p}`), '')
  for (const s of SCENARIOS.filter((x) => x.part === part)) {
    out.push(`### ${s.id}. ${s.story.name} (${s.kind ?? 'case'}) ${s.technique}`, '', `Channel: ${s.channel}`, `Facts: ${s.story.facts.join('; ')}`, '', `Story: ${s.story.text}`, '', `Context: ${s.context}`, '')
    for (const b of s.message.blocks) {
      if (b.kind === 'email') out.push(`Email from ${b.from.name} <${b.from.addr}>, ${b.date}`, `Subject: ${b.subject}`, ...b.body.map((t) => `> ${t}`), b.signature ? `> ${b.signature.join(' / ')}` : '', b.attachments ? `Attachment: ${b.attachments.map((a) => a.name).join(', ')}` : '', '')
      else if (b.kind === 'thread') out.push(`${b.app} chat with ${b.contact.name}`, ...b.messages.map((m) => `> ${m.who === 'me' ? 'Me' : m.name ?? 'Them'}: ${m.text}`), '')
      else if (b.kind === 'linkedin') out.push(`LinkedIn: ${b.profile.name}, ${b.profile.headline} (${b.profile.meta})`, ...b.message.map((t) => `> ${t}`), '')
      else if (b.kind === 'jobpost') out.push(`Job post on ${b.board}: ${b.title}, ${b.company}, ${b.pay}`, ...b.desc.map((t) => `> ${t}`), '')
      else if (b.kind === 'form') out.push(`Form at ${b.url}: ${b.fields.join(', ')}`, '')
      else if (b.kind === 'appscreen') out.push(`App screen (${b.name}): ${b.lines.join(' / ')}`, '')
      else if (b.kind === 'notes') out.push(`${b.heading}:`, ...b.items.map((t) => `- ${t}`), '')
      else if (b.kind === 'profiles') out.push(...b.profiles.map((p) => `- ${p.name}: ${p.text}`), '')
      else if (b.kind === 'caption') out.push(`(${b.text})`, '')
    }
    for (const st of s.steps) {
      out.push(`**${st.key} (${st.type}): ${st.prompt}**`)
      if (st.type === 'action') out.push(...Object.entries(st.feedback).map(([k, v]) => `- ${k}: ${v}`))
      if (st.type === 'classify') out.push(`- Right answers: ${st.right.join(', ')}`)
      if (st.type === 'choice') out.push(...st.options.map((o) => `- ${o.best ? '(best) ' : ''}${o.text} Note: ${o.note}${o.cues ? ` [${o.cues.join(' ')}]` : ''}`))
      if (st.type === 'chips') out.push(...st.chips.map((c) => `- [${c.kind}] ${c.label}${c.reason ? ` Reason: ${c.reason}` : ''}${c.cues ? ` [${c.cues.join(' ')}]` : ''}`))
      out.push('')
    }
    if (s.plan) out.push(`Scammer's plan: Goal ${s.plan.goal} Tactic ${s.plan.tactic} ${s.plan.why.label}: ${s.plan.why.text} Lever ${s.plan.lever} ${s.plan.pushback.label}: ${s.plan.pushback.text}`, '')
    out.push(`Takeaway: ${s.takeaway}`)
    if (s.rule) out.push(`Rule to remember: ${s.rule}`, `Connects to: ${s.connects}`)
    out.push('')
  }
}
fs.writeFileSync(process.argv[2] ?? 'scenarios_v7.md', out.join('\n'))
