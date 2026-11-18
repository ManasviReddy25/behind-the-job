// Structure checks for the v7 content. Run: node scripts/check-structure.mjs
import { SCENARIOS } from '../src/content/scenarios.js'
import * as shared from '../src/content/shared.js'

let bad = 0
const fail = (m) => { console.log('PROBLEM:', m); bad++ }
const strings = []
const walk = (v, path) => {
  if (typeof v === 'string') strings.push([path, v])
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`))
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`))
}
SCENARIOS.forEach((s) => walk(s, s.id))
walk(shared.PARTS, 'PARTS'); walk(shared.PART_CARDS, 'PART_CARDS'); walk(shared.HOME_CARDS, 'HOME_CARDS')

for (const [p, t] of strings) if (/[–—]/.test(t)) fail(`dash character in ${p}`)

if (SCENARIOS.length !== 12) fail('need 12 scenarios')
for (const part of ['victim', 'offender', 'guardian']) if (SCENARIOS.filter((s) => s.part === part).length !== 4) fail(`${part} needs 4`)
const vg = SCENARIOS.filter((s) => s.part !== 'offender')
if (vg.filter((s) => s.kind === 'legit').length !== 3) fail('need exactly 3 legitimate scenarios')
if (vg.filter((s) => s.kind === 'scam').length !== 5) fail('need exactly 5 scam scenarios')
for (const k of ['technique', 'caseId']) if (new Set(SCENARIOS.map((s) => s[k])).size !== 12) fail(`${k} must be unique across all 12`)
if (new Set(SCENARIOS.map((s) => s.story.name)).size !== 12) fail('story names must be unique')
const people = SCENARIOS.filter((s) => s.part !== 'offender').map((s) => s.story.name)
if (new Set(people).size !== 8) fail('the 8 Victim and Guardian people must all differ')

const CUE = /^C([1-9]|1\d|2[0-6])$/
const expect = { victim: ['action', 'classify', 'chips'], offender: ['choice', 'choice'], guardian: ['classify', 'choice'] }
for (const s of SCENARIOS) {
  const types = s.steps.map((x) => x.type)
  if (JSON.stringify(types) !== JSON.stringify(expect[s.part])) fail(`${s.id}: step types ${types}`)
  if (!s.story?.text || s.story.text.length < 150) fail(`${s.id}: story too short`)
  if (!s.takeaway) fail(`${s.id}: takeaway missing`)
  if (s.part === 'offender' && !s.plan) fail(`${s.id}: plan missing`)
  if (s.part === 'guardian' && !(s.rule && s.connects)) fail(`${s.id}: rule or connects missing`)
  if (!!s.pause !== ['V4', 'O4'].includes(s.id)) fail(`${s.id}: pause button on wrong scenario`)
  const keys = s.steps.map((x) => x.key)
  if (new Set(keys).size !== keys.length) fail(`${s.id}: duplicate step keys`)
  for (const st of s.steps) {
    if (st.type === 'classify') {
      const want = s.kind === 'scam' ? 'prob_scam,def_scam' : 'prob_legit,def_legit'
      if (st.right.join(',') !== want) fail(`${s.id}: classify answer does not match kind`)
    }
    if (st.type === 'choice') {
      if (st.options.filter((o) => o.best).length !== 1) fail(`${s.id} ${st.key}: need exactly one best option`)
      if (st.options.length < 3) fail(`${s.id} ${st.key}: too few options`)
    }
    if (st.type === 'chips') {
      const c = st.chips.filter((x) => x.kind === 'correct').length
      const n = st.chips.filter((x) => x.kind === 'neutral').length
      if (c < 4 || n < 3) fail(`${s.id}: chips ${c} correct, ${n} neutral`)
      if (new Set(st.chips.map((x) => x.id)).size !== st.chips.length) fail(`${s.id}: duplicate chip id`)
    }
    if (st.type === 'action') for (const id of ['respond', 'take', 'ignore', 'verify', 'report']) if (!st.feedback[id]) fail(`${s.id}: action feedback ${id}`)
    const cues = [...(st.options ?? []).flatMap((o) => o.cues ?? []), ...(st.chips ?? []).flatMap((c) => c.cues ?? []), ...Object.values(st.cues ?? {}).flat()]
    for (const c of cues) if (!CUE.test(c)) fail(`${s.id}: bad cue ${c}`)
  }
  for (const c of s.takeawayCues ?? []) if (!CUE.test(c)) fail(`${s.id}: bad takeaway cue ${c}`)
  if (!s.message?.blocks?.length) fail(`${s.id}: no message blocks`)
}
console.log(bad ? `${bad} problem(s)` : 'All structure checks passed (12 scenarios, 12 people or cases, 12 techniques, 3 legitimate, 5 scam in Victim and Guardian)')
process.exit(bad ? 1 : 0)
