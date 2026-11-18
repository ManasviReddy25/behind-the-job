// Shared content (v7). Interface text is written for the site.

export const ACTIONS = [
  { id: 'respond', label: 'Respond and engage with the message', icon: '\u{1F4AC}' },
  { id: 'take', label: 'Take the specific action requested', icon: '\u{1F449}' },
  { id: 'ignore', label: 'Ignore or delete it', icon: '\u{1F5D1}️' },
  { id: 'verify', label: 'Verify before doing anything', icon: '\u{1F50D}' },
  { id: 'report', label: 'Report it as suspicious or spam', icon: '\u{1F6A9}' },
]

export const CLASSIFICATIONS = [
  { id: 'def_legit', label: 'Definitely legitimate', icon: '\u{1F60A}' },
  { id: 'prob_legit', label: 'Probably legitimate', icon: '\u{1F642}' },
  { id: 'not_sure', label: 'Not sure', icon: '\u{1F914}' },
  { id: 'prob_scam', label: 'Probably scam', icon: '\u{1F928}' },
  { id: 'def_scam', label: 'Definitely scam', icon: '\u{1F6A8}' },
]

// Classification feedback (same in every Victim and Guardian scenario)
export const CLASSIFICATION_FEEDBACK = {
  def_scam: {
    scam: `Right. Strong call.`,
    legit: `This one was real. Being very sure it is a scam can cost you a real chance.`,
  },
  prob_scam: {
    scam: `Right. A quick check would confirm it.`,
    legit: `This one was real. Your caution is fine, but check before you decide.`,
  },
  not_sure: {
    scam: `Honest answer. When unsure, verify before you do anything.`,
    legit: `Honest answer. A quick check would have settled it.`,
  },
  prob_legit: {
    scam: `This one was a scam. See the signs in the next step.`,
    legit: `Right. A quick check can still confirm it.`,
  },
  def_legit: {
    scam: `This one was a scam. Being very sure is risky, so verify first.`,
    legit: `Right. Strong call.`,
  },
}

export const NEUTRAL_CHIP_LINE = `Real messages can say this too, so it proves nothing.`

export const PAUSE_PROMPT = `A real employer will wait for your answer. Take a minute before you choose.`

export const PART_ORDER = ['victim', 'offender', 'guardian']

export const PARTS = {
  victim: {
    id: 'victim',
    number: 1,
    name: 'Victim',
    title: 'Would you reply?',
    points: [
      `Four job seekers. Four different messages. For each one, decide what that person should do.`,
      `Each message has three steps: (1) What would you do? (2) How would you classify it? (3) Tap what you notice. Feedback follows each step.`,
    ],
    unit: 'Message',
    end: `That was four job seekers. Next: how scams like these are built.`,
  },
  offender: {
    id: 'offender',
    number: 2,
    name: 'Scammer tactics',
    title: 'Behind the curtain',
    points: [
      `This shows how job scams are built, step by step, in four different cases. It teaches you to spot and stop them. It does not teach you to run one.`,
      `Each step also shows how a job seeker can break it.`,
      `Each scenario has two questions. Question 1 asks what scammers usually rely on or do. Question 2 asks how a job seeker breaks the step.`,
      `Feedback follows each question. After question 2, a "Scammer's plan" box shows the goal, the tactic, why here and now, the psychological lever, and what the scammer does if the target pushes back.`,
    ],
    unit: 'Scenario',
    end: `That is how the playbook works. Now you will be the check.`,
  },
  guardian: {
    id: 'guardian',
    number: 3,
    name: 'Guardian',
    title: 'You are the check',
    points: [
      `Four people you know ask for your help. Each time, classify it first, then decide what to check or do.`,
      `Each scenario has two steps: classification (5 options), then what you check or do. Feedback follows each step.`,
    ],
    unit: 'Scenario',
    end: `You helped four people.`,
  },
}

export const PART_CARDS = {
  victim: {
    emoji: '\u{1F469}‍\u{1F4BB}',
    hint: `Four job seekers get four different messages. What would you do?`,
    bullets: [`Decide what to do`, `Classify the message`, `Tap what you notice`],
  },
  offender: {
    emoji: '\u{1F9B9}',
    hint: `See how four different scams are built, from the scammer's side.`,
    bullets: [`Four cases, four tactics`, `Learn how to break each step`, `Read the "Scammer's plan" box`],
  },
  guardian: {
    emoji: '\u{1F6E1}️',
    hint: `Four people you know ask for your help.`,
    bullets: [`Classify it first`, `Decide what to check or do`, `Learn a "Rule to remember"`],
  },
}

export const PARTS_PAGE = {
  tag: `The three parts`,
  title: [`One scam world,`, `three views`],
  sub: `Do the parts in order: Victim, then Scammer tactics, then Guardian.`,
}

// Decorative cards on the home page (blurred). Short pieces of the scenario messages.
export const HOME_CARDS = [
  { tag: 'email', from: `e.whitford.research@gmail.com`, subject: `Paid Research Assistant, Biology Dept. (Remote, $42/hour)`, body: `Your name came to me from the department's student employment list.` },
  { tag: 'linkedin', from: `Rebecca Torres, Recruiter`, subject: `Message`, body: `Hi Amara, your profile fits our Associate Claims Analyst opening.` },
  { tag: 'text', from: `+1 (555) 010-0148`, subject: `Text message`, body: `Hi Priya! We are hiring online assistants to boost product ratings.` },
  { tag: 'email', from: `jcole@brightlinehealth.org`, subject: `Brightline Health: schedule your phone screen`, body: `Thank you for applying for the Billing Analyst role on our careers page.` },
  { tag: 'app', from: `Brightcart`, subject: `Tasks done today: 40 of 40`, body: `To withdraw, deposit 150 USDT to unlock your account.` },
  { tag: 'email', from: `onboarding@cresthaven-careers.com`, subject: `Offer of Employment. Action required within 2 hours`, body: `Congratulations Kai! You were our top choice.` },
  { tag: 'notes', from: `What you find`, subject: `The posting`, body: `The same job title and pay are on the college's own jobs page.` },
  { tag: 'text', from: `Chloe (NovaLabel Talent)`, subject: `Chat`, body: `You passed the test with a top score!` },
]
