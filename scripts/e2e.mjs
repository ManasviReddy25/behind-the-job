// End-to-end walk through the whole site in headless Chrome. Run: node scripts/e2e.mjs [mode]
// mode: first (always click the first listed option), best (always the best answer), mixed
import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs'
import { SCENARIOS } from '../src/content/scenarios.js'
import { PARTS, PART_ORDER } from '../src/content/shared.js'

const mode = process.argv[2] || 'first'
const shotDir = process.argv[3] || ''
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 420, height: 900 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`) })
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

let problems = 0
const fail = (m) => { problems++; console.log('PROBLEM:', m) }
const BASE = 'http://localhost:4173/#'

await page.goto(BASE + '/')
await page.waitForSelector('h1')
{ const t = await page.textContent('h1'); if (!t.includes('BEHIND') || !t.includes('JOB')) fail('home h1') }
await page.click('[data-action=start]')
await page.waitForSelector('[data-action=start-part-card]')
if ((await page.locator('.part-card').count()) !== 3) fail('parts page should show 3 cards')
if ((await page.locator('.part-card.is-link').count()) !== 1) fail('only Part 1 should open from the parts page')
await page.click('[data-action=start-part-card]')
let step = 0

for (const part of PART_ORDER) {
  await page.waitForSelector('[data-action=start-part]')
  const introText = await page.textContent('main')
  for (const t of PARTS[part].points) if (!introText.includes(t)) fail(`intro point missing for ${part}`)
  await page.click('[data-action=start-part]')

  for (const s of SCENARIOS.filter((x) => x.part === part)) {
    await page.waitForSelector(`[data-scenario-page=${s.id}]`)
    const before = await page.textContent('main')
    if (s.part !== 'offender' && before.includes(s.title)) fail(`${s.id}: title shown before answering (gives the answer away)`)
    if (s.part === 'offender' && !before.includes(s.title)) fail(`${s.id}: title missing`)
    if (!before.includes(s.story.name)) fail(`${s.id}: story missing`)
    if (!before.includes(s.story.text)) fail(`${s.id}: story text missing`)
    if (before.includes(s.context) || (await page.locator('.msg-stack').count())) fail(`${s.id}: message shown before it is opened`)
    if (await page.locator('section.step').count()) fail(`${s.id}: steps shown before the message is opened`)
    await page.click('[data-action=open-message]')
    await page.waitForSelector('.msg-stack')
    if (!(await page.textContent('main')).includes(s.context)) fail(`${s.id}: context missing`)
    if (await page.locator('[data-action=next]').count()) fail(`${s.id}: Next visible before finishing`)

    for (let i = 0; i < s.steps.length; i++) {
      const st = s.steps[i]
      const scope = `[data-scenario=${s.id}][data-step=${st.key}]`
      await page.waitForSelector(`section${scope}`)
      // later steps must not be visible yet
      if (i + 1 < s.steps.length && (await page.locator(`section[data-scenario=${s.id}][data-step=${s.steps[i + 1].key}]`).count())) fail(`${s.id}: step ${i + 2} visible early`)

      if (st.type === 'chips') {
        // zero taps allowed? tap two chips: one correct, one neutral
        const correct = st.chips.find((c) => c.kind === 'correct')
        const neutral = st.chips.find((c) => c.kind === 'neutral')
        const picks = mode === 'best' ? st.chips.filter((c) => c.kind === 'correct') : [correct, neutral]
        for (const c of picks) await page.click(`button[data-chip=${c.id}][data-scenario=${s.id}]`)
        await page.click('[data-action=check]')
        await page.waitForSelector('.feedback')
        const fbText = await page.locator('.feedback').last().textContent()
        for (const c of picks) if (!fbText.includes(c.label)) fail(`${s.id}: tapped chip ${c.label} not in feedback`)
        const wantMissed = st.chips.filter((c) => c.kind === 'correct' && !picks.includes(c)).length
        const hasMissed = fbText.includes('You missed')
        if (!!wantMissed !== hasMissed) fail(`${s.id}: 'You missed' group wrong`)
        if (mode !== 'best' && !fbText.includes('Not a sign on its own')) fail(`${s.id}: neutral group missing`)
        // chips locked
        await page.click(`button[data-chip=${picks[0].id}][data-scenario=${s.id}]`, { force: true })
        const stillOn = await page.getAttribute(`button[data-chip=${picks[0].id}][data-scenario=${s.id}]`, 'aria-pressed')
        if (stillOn !== 'true') fail(`${s.id}: chip changed after check`)
      } else {
        const btns = page.locator(`button.option${scope.replace(/\]\[/g, '][')}`)
        const n = await btns.count()
        let idx = 0
        if (mode === 'best' && st.type === 'choice') {
          const best = st.options.find((o) => o.best)
          idx = await page.locator(`button.option[data-scenario=${s.id}][data-step=${st.key}][data-option=${best.id}]`).getAttribute('data-position').then((p) => Number(p) - 1)
        } else if (mode === 'mixed') idx = (step + i) % n
        step++
        if (st.type === 'classify' && n !== 5) fail(`${s.id}: classification has ${n} options`)
        if (st.type === 'action' && n !== 5) fail(`${s.id}: action has ${n} options`)
        await btns.nth(idx).click()
        await page.waitForSelector('.feedback')
        // second click on another option must not change the answer
        await btns.nth((idx + 1) % n).click({ force: true })
        const selected = await page.locator(`button.option.is-selected${scope.replace(/\]\[/g, '][')}`).count()
        if (selected !== 1) fail(`${s.id} ${st.key}: ${selected} selected after second click`)
        if (st.type === 'choice') {
          const fbText = await page.locator('.feedback').last().textContent()
          if (!fbText.includes('Best answer')) fail(`${s.id} ${st.key}: feedback lacks best answer`)
          if ((await page.locator(`button.option.is-best[data-scenario=${s.id}][data-step=${st.key}]`).count()) !== 1) fail(`${s.id} ${st.key}: best option not marked`)
        }
      }
      if (shotDir && ['V1', 'V3', 'V4', 'O2', 'O4', 'G1', 'G4'].includes(s.id) && i === s.steps.length - 1) {
        await page.screenshot({ path: `${shotDir}/${s.id}-${mode}.png`, fullPage: true })
      }
      if (i < s.steps.length - 1) {
        await page.click('[data-action=continue]')
      }
    }

    // pause button (V4 and O4 only)
    if (s.pause) {
      await page.click('[data-action=pause]')
      const t = await page.textContent('.pause-text')
      if (!t.includes('A real employer will wait')) fail(`${s.id}: pause text`)
    } else if (await page.locator('[data-action=pause]').count()) fail(`${s.id}: unexpected pause button`)

    // wrap-up pop-up
    await page.waitForSelector('[data-action=show-takeaway]')
    if (await page.locator('[data-action=next]').count()) fail(`${s.id}: Next visible before the takeaway was opened`)
    await page.click('[data-action=show-takeaway]')
    await page.waitForSelector('.modal .wrapup')
    if (shotDir && ['V1', 'V3', 'O2', 'G4'].includes(s.id)) await page.screenshot({ path: `${shotDir}/${s.id}-modal-${mode}.png` })
    const wrap = await page.textContent('.wrapup')
    if (!wrap.includes(s.technique)) fail(`${s.id}: technique missing`)
    const stampWord = s.part === 'offender' ? 'THE PLAYBOOK' : s.kind === 'scam' ? 'SCAM' : 'REAL'
    if ((await page.getAttribute('.stamp', 'aria-label')) !== stampWord) fail(`${s.id}: stamp should say ${stampWord}`)
    if (s.id === 'V1') {
      await page.keyboard.press('Escape')
      await page.waitForSelector('.modal', { state: 'detached' })
      await page.waitForSelector('[data-action=next]')
      await page.click('[data-action=show-takeaway]')
      await page.waitForSelector('.modal .wrapup')
    }
    if (!wrap.includes(s.takeaway)) fail(`${s.id}: takeaway missing`)
    if (wrap.includes('RAT link') || wrap.includes('What is RAT')) fail(`${s.id}: RAT text should not show`)
    if (s.part === 'offender' && !wrap.includes("Scammer's plan")) fail(`${s.id}: plan box missing`)
    if (s.part === 'guardian' && !(wrap.includes('Rule to remember') && wrap.includes('Connects to'))) fail(`${s.id}: rule/connects missing`)
    if (s.part !== 'offender' && wrap.includes(s.title)) fail(`${s.id}: title should not be shown`)
    await page.click('.modal [data-action=next]')
  }
}
await page.waitForSelector('.end')
const endText = await page.textContent('.end')
if (!endText.includes('You finished all 12 scenarios')) fail('end page')

const log = await page.evaluate(() => window.__btj.get())
const types = {}
log.events.forEach((e) => (types[e.type] = (types[e.type] || 0) + 1))
console.log('events by type:', JSON.stringify(types))
console.log('cues shown:', log.cueExposure.map((c) => `${c.cue}@${c.scenario}.${c.step}`).join(' '))
const answers = log.events.filter((e) => e.type === 'answer')
console.log('answers logged:', answers.length, '(expected 12 scenarios: 3+... =', SCENARIOS.reduce((a, s) => a + s.steps.length, 0) + ')')
if (answers.length !== SCENARIOS.reduce((a, s) => a + s.steps.length, 0)) fail('answer count')
if (!answers.every((a) => a.position || a.stepType === 'chips')) fail('answer missing position')
const dwell = log.events.filter((e) => e.type === 'next_clicked' || e.type === 'continue_clicked').every((e) => Number.isFinite(e.feedbackDwellMs))
if (!dwell) fail('dwell time missing')

// debug and menu pages
await page.goto(BASE + '/menu')
await page.waitForSelector('.menu')
await page.goto(BASE + '/debug')
await page.waitForSelector('.debug')

if (errors.length) { console.log('console issues:'); errors.forEach((e) => console.log('  ', e)); problems += errors.length }
console.log(problems ? `\n${problems} problem(s)` : `\nE2E (${mode}) passed`)
await browser.close()
process.exit(problems ? 1 : 0)
