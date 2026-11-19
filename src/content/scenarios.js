// All 12 scenarios (v7). Twelve different people, twelve different stories.
// Each scenario has its own story, message and technique. Step types and the step order are the same as v6.
// Options are listed best answer first. The site shows them in a fixed, different order (see lib/order.js).
// `cues` are persona cue IDs (C1 to C26) named by that block. They feed the cue exposure log only.
//
// message.blocks is a list. Block kinds: email, thread (sms | whatsapp | telegram), linkedin, jobpost, form,
// appscreen, caption, notes, profiles.

const NEUTRAL = 'neutral'
const CORRECT = 'correct'

const CLASSIFY = (scam, key = 's2') => ({ key, type: 'classify', prompt: `How would you classify it?`, right: scam ? ['prob_scam', 'def_scam'] : ['prob_legit', 'def_legit'] })

export const SCENARIOS = [
  // ---------------------------------------------------------------- PART 1: VICTIM
  {
    id: 'V1',
    part: 'victim',
    index: 1,
    title: `A professor needs a hand`,
    channel: `Email, campus job`,
    kind: 'scam',
    technique: `Fake professor and gift cards`,
    caseId: 'V-gift',
    story: {
      name: `Samantha Reyes`,
      avatar: `\u{1F469}\u{1F3FD}‍\u{1F393}`,
      color: `#f472b6`,
      facts: [`20`, `Junior, Biology`, `Rent is two weeks late`],
      text: `Samantha works weekends at a campus café, but it is not enough. Her rent is late and her roommate is getting tired of covering it. She has been checking her student email between classes, hoping for any part-time job that fits her schedule.`,
    },
    context: `Tuesday, 8:41 AM. A new email lands in Samantha's inbox.`,
    message: {
      blocks: [
        {
          kind: 'email',
          client: 'gmail',
          from: { name: `Dr. Elaine Whitford`, addr: `e.whitford.research@gmail.com` },
          to: `me`,
          date: `Tue, Nov 3, 8:41 AM`,
          subject: `Paid Research Assistant, Biology Dept. (Remote, $42/hour)`,
          body: [
            `Dear Samantha,`,
            `I am a professor in the Biology Department at Northbridge State University. Your name came to me from the department's student employment list. I need one student to help with a grant-funded data project. The work is remote, 6 hours a week, at $42 per hour, paid weekly.`,
            `No interview is needed because your student record already qualifies you. To get started, please buy four $100 gift cards for the project's participant rewards. Reply with a photo of each card's code. I will repay you with your first paycheck.`,
            `Please reply by 5 PM today. Another student is waiting for this spot.`,
          ],
          signature: [`Kind regards,`, `Dr. Elaine Whitford`, `Associate Professor, Department of Biology`, `Northbridge State University`],
        },
      ],
    },
    steps: [
      {
        key: 's1',
        type: 'action',
        prompt: `What would you do?`,
        feedback: {
          respond: `Replying tells the sender your address is active, and the next message will push for the gift cards. Check who this really is first.`,
          take: `Buying gift cards and sending the codes is the same as handing over cash. No real professor or employer asks for it.`,
          ignore: `Safe. Verifying or reporting is stronger, because it can protect other students.`,
          verify: `Strong choice. Look the professor up on the department's own page, or ask your career office.`,
          report: `Strong choice. Tell the school's career office or IT team, and report at ReportFraud.ftc.gov.`,
        },
        cues: { take: ['C24'] },
      },
      CLASSIFY(true),
      {
        key: 's3',
        type: 'chips',
        prompt: `Tap what you notice`,
        chips: [
          { id: 'gmail', label: `A professor writing from a free Gmail address`, kind: CORRECT, reason: `University staff write from the university's own address.`, cues: ['C1', 'C23'] },
          { id: 'gift', label: `Asked to buy gift cards and send the codes`, kind: CORRECT, reason: `Gift card codes work like cash. Real employers never ask for them.`, cues: ['C24'] },
          { id: 'pay', label: `$42 an hour for simple data work`, kind: CORRECT, reason: `Pay far above the work is a hook.`, cues: ['C2'] },
          { id: 'nointerview', label: `No interview needed`, kind: CORRECT, reason: `Offers usually follow an interview.`, cues: ['C3'] },
          { id: 'rush', label: `"Reply by 5 PM" because another student is waiting`, kind: CORRECT, reason: `A rush leaves no time to check.`, cues: ['C4'] },
          { id: 'qualifies', label: `"Your student record already qualifies you"`, kind: CORRECT, reason: `Praise is bait. Nobody has checked you yet.`, cues: ['C15'] },
          { id: 'remote', label: `The job is remote`, kind: NEUTRAL },
          { id: 'hours', label: `Only 6 hours a week`, kind: NEUTRAL },
          { id: 'signature', label: `A signature with a department and university name`, kind: NEUTRAL },
        ],
      },
    ],
    takeaway: `A real professor does not write from a free Gmail address, and no real job asks you to buy gift cards. Check any campus job on the department's own page or with your career office.`,
    takeawayCues: ['C17'],
  },

  {
    id: 'V2',
    part: 'victim',
    index: 2,
    title: `The recruiter reply`,
    channel: `Email, reply to an application`,
    kind: 'legit',
    technique: `A real interview invitation`,
    caseId: 'V-real',
    story: {
      name: `Marcus Bell`,
      avatar: `\u{1F468}\u{1F3FF}‍\u{1F4BC}`,
      color: `#60a5fa`,
      facts: [`24`, `Accounting graduate`, `Applied to 11 jobs`],
      text: `Marcus graduated in May and has sent out eleven applications. Most went quiet. Last Thursday he applied for a billing analyst role at a regional hospital group, on its own careers page. He is checking his phone on the bus when a new email arrives.`,
    },
    context: `Monday, 10:15 AM. Marcus opens his inbox.`,
    message: {
      blocks: [
        {
          kind: 'email',
          client: 'outlook',
          from: { name: `Jasmine Cole`, addr: `jcole@brightlinehealth.org` },
          to: `Marcus Bell`,
          date: `Mon 11/9/2026 10:15 AM`,
          subject: `Brightline Health: schedule your phone screen (Billing Analyst, Req 4471)`,
          body: [
            `Hello Marcus,`,
            `Thank you for applying for the Billing Analyst role on our careers page last Thursday. We would like to set up a 20-minute phone screen with our team.`,
            `You can pick a time at brightlinehealth.org/careers/schedule. If none of the times work for you, reply with your availability and I will find a slot.`,
          ],
          signature: [`Best regards,`, `Jasmine Cole`, `Talent Acquisition, Brightline Health`],
          footer: `Brightline Health is an equal opportunity employer.`,
        },
      ],
    },
    steps: [
      {
        key: 's1',
        type: 'action',
        prompt: `What would you do?`,
        feedback: {
          respond: `Good. Replying to confirm a time is a normal next step after you apply.`,
          take: `Good. Picking a time on the company's own scheduling page matches the application Marcus made.`,
          ignore: `This one was real. Ignoring it could cost Marcus a real interview.`,
          verify: `Good habit. A one-minute check is worth it, even for real messages.`,
          report: `This one was real. Reporting a real recruiter can cost you a chance.`,
        },
      },
      CLASSIFY(false),
      {
        key: 's3',
        type: 'chips',
        prompt: `Tap what you notice`,
        chips: [
          { id: 'applied', label: `Marcus applied on the careers page first`, kind: CORRECT, reason: `Marcus started the contact.`, cues: ['C14'] },
          { id: 'domain', label: `The sender's address matches the scheduling link's website`, kind: CORRECT, reason: `Both use brightlinehealth.org, the company's own site.`, cues: ['C14'] },
          { id: 'time', label: `It only asks him to pick a time`, kind: CORRECT, reason: `The ask is small and safe.`, cues: ['C14'] },
          { id: 'nopay', label: `No payment, no ID, no rush`, kind: CORRECT, reason: `These are the usual scam asks, and none appear.`, cues: ['C14'] },
          { id: 'monday', label: `It arrives on a Monday morning`, kind: NEUTRAL },
          { id: 'role', label: `The job is a billing analyst role`, kind: NEUTRAL },
          { id: 'signature', label: `A professional signature and footer`, kind: NEUTRAL },
        ],
      },
    ],
    takeaway: `Not every message is a scam. Check it, but do not assume the worst. A polished signature proves nothing alone. What helps is that you applied first, the address matches the company, and the ask is small.`,
  },

  {
    id: 'V3',
    part: 'victim',
    index: 3,
    title: `The easy app job`,
    channel: `Text message and chat app, task scam`,
    kind: 'scam',
    technique: `Task scam with a crypto deposit`,
    caseId: 'V-task',
    story: {
      name: `Priya Nair`,
      avatar: `\u{1F9D1}\u{1F3FD}‍\u{1F3EB}`,
      color: `#a78bfa`,
      facts: [`26`, `Substitute teacher`, `Saving for a certificate course`],
      text: `Priya finished her teaching degree but only gets substitute shifts a few days a week. She is saving for a certificate course and checks her phone between classes. Today a text arrives from a number she does not know.`,
    },
    context: `Wednesday. A text arrives, then two days pass.`,
    message: {
      blocks: [
        {
          kind: 'thread',
          app: 'sms',
          contact: { name: `+1 (555) 010-0148` },
          day: `Today 12:26 PM`,
          messages: [
            { who: 'them', text: `Hi Priya! This is Jade from Brightcart Digital. We are hiring online assistants to boost product ratings. Earn $200 to $400 a day, 30 minutes a day. No experience needed. Message our manager on WhatsApp to start today.` },
          ],
        },
        { kind: 'caption', text: `Two days later, in the Brightcart app:` },
        { kind: 'appscreen', name: `Brightcart`, lines: [`Tasks done today: 40 of 40`, `Balance: $312`, `To withdraw, deposit 150 USDT to unlock your account.`] },
        {
          kind: 'thread',
          app: 'whatsapp',
          contact: { name: `Brightcart Team`, sub: `24 members` },
          day: `Today`,
          messages: [
            { who: 'them', name: `Mia`, text: `Just withdrew $900! Thank you Brightcart!`, time: `2:02 PM` },
            { who: 'them', name: `Tom`, text: `Same here, paid in 10 minutes. Do the deposit and it unlocks.`, time: `2:04 PM` },
          ],
        },
      ],
    },
    steps: [
      {
        key: 's1',
        type: 'action',
        prompt: `What would you do?`,
        feedback: {
          respond: `Replying or messaging on WhatsApp tells the sender your number is active. The FTC says to ignore unexpected job texts.`,
          take: `Paying to unlock earnings is the core of this scam. The balance is not real, and a deposit is not returned.`,
          ignore: `Safe. Reporting is stronger because it can protect others.`,
          verify: `Good. Look the company up yourself, not through the text or the app.`,
          report: `Strong choice. Report at ReportFraud.ftc.gov and ic3.gov.`,
        },
        cues: { respond: ['C18'], take: ['C20'] },
      },
      CLASSIFY(true),
      {
        key: 's3',
        type: 'chips',
        prompt: `Tap what you notice`,
        chips: [
          { id: 'unexpected', label: `Unexpected text from an unknown number`, kind: CORRECT, reason: `Real employers do not usually start this way. The FTC says to ignore these.`, cues: ['C18'] },
          { id: 'tasks', label: `Simple repeated tasks like boosting ratings`, kind: CORRECT, reason: `This is how task scams usually work.`, cues: ['C19'] },
          { id: 'pay', label: `$200 to $400 a day for 30 minutes of work`, kind: CORRECT, reason: `Pay far above the work is a hook.`, cues: ['C2'] },
          { id: 'unlock', label: `A balance you must pay to unlock`, kind: CORRECT, reason: `The earnings on the screen are not real.`, cues: ['C20'] },
          { id: 'crypto', label: `Asked to deposit crypto to withdraw`, kind: CORRECT, reason: `Never pay anyone to get paid.`, cues: ['C21'] },
          { id: 'group', label: `A group chat full of people who "got paid"`, kind: CORRECT, reason: `Success stories in the chat are part of the scam.`, cues: ['C22'] },
          { id: 'greeting', label: `A friendly greeting with her name`, kind: NEUTRAL },
          { id: 'noexp', label: `No experience needed`, kind: NEUTRAL },
          { id: 'online', label: `The work is online`, kind: NEUTRAL },
        ],
      },
    ],
    takeaway: `Never pay anyone to get paid. If a job asks you to deposit money to unlock your earnings, it is a scam. The group chat and the balance are part of the act.`,
    takeawayCues: ['C22'],
  },

  {
    id: 'V4',
    part: 'victim',
    index: 4,
    title: `An offer with a deadline`,
    channel: `Email and onboarding form`,
    kind: 'scam',
    technique: `Fake offer that collects identity data`,
    caseId: 'V-identity',
    pause: true,
    story: {
      name: `Kai Nakamura`,
      avatar: `\u{1F9D1}\u{1F3FB}‍\u{1F4BB}`,
      color: `#34d399`,
      facts: [`22`, `Final-semester Computer Science`, `Has not heard back from anyone`],
      text: `Kai has sent forty applications and had two interviews, and neither went anywhere. Graduation is five weeks away. At 6 PM an email arrives with the words "Offer of Employment" in the subject line, and Kai's heart jumps.`,
    },
    context: `Thursday, 6:02 PM. An email from a company Kai applied to.`,
    message: {
      blocks: [
        {
          kind: 'email',
          client: 'gmail',
          from: { name: `Olivia Grant, Cresthaven Systems`, addr: `onboarding@cresthaven-careers.com` },
          to: `me`,
          date: `Thu, Nov 5, 6:02 PM`,
          subject: `Offer of Employment: Junior Support Analyst. Action required within 2 hours`,
          logo: `Cresthaven Systems`,
          body: [
            `Congratulations Kai! After reviewing your resume, we are pleased to offer you the position of Junior Support Analyst. You were our top choice.`,
            `To issue your payroll and start date, complete the secure onboarding form below with your legal name, Social Security number, date of birth, a photo of your driver's license and your bank details for direct deposit.`,
            `If we do not receive the form within 2 hours, the offer will go to the next candidate.`,
          ],
          signature: [`Olivia Grant`, `People Operations, Cresthaven Systems`],
          attachments: [{ name: `Offer_Letter_Kai_Nakamura.pdf`, size: `212 KB` }],
        },
        {
          kind: 'form',
          title: `Secure Onboarding Portal`,
          url: `cresthaven-onboard.net/start`,
          fields: [`Full legal name`, `Social Security number`, `Date of birth`, `Driver's license photo`, `Bank routing and account number`],
        },
      ],
    },
    steps: [
      {
        key: 's1',
        type: 'action',
        prompt: `What would you do?`,
        feedback: {
          respond: `Replying under a deadline is what the sender wants. Pause first.`,
          take: `Sending your Social Security number, license photo and bank details to a stranger can lead to stolen accounts and loans in your name. If you already sent them, go to IdentityTheft.gov for a recovery plan.`,
          ignore: `Safe. Verifying or reporting is stronger.`,
          verify: `Strong choice. Call the company using a number from its official website and ask if the offer is real.`,
          report: `Strong choice. Report at ReportFraud.ftc.gov. If you shared anything, tell your bank and go to IdentityTheft.gov for a recovery plan.`,
        },
        cues: { take: ['C25'] },
      },
      CLASSIFY(true),
      {
        key: 's3',
        type: 'chips',
        prompt: `Tap what you notice`,
        chips: [
          { id: 'ssn', label: `Asked for your SSN, ID photo and bank details before you start`, kind: CORRECT, reason: `Real employers collect tax and bank details after you accept, through their own secure system.`, cues: ['C25'] },
          { id: 'deadline', label: `"Within 2 hours" or the offer goes to the next candidate`, kind: CORRECT, reason: `Pressure that stops you from checking.`, cues: ['C4'] },
          { id: 'nointerview', label: `No interview, only a resume review`, kind: CORRECT, reason: `Offers usually follow an interview.`, cues: ['C3'] },
          { id: 'domain', label: `The sender's domain (cresthaven-careers.com) and the form's website (cresthaven-onboard.net) are not the company's own site`, kind: CORRECT, reason: `Compare them with the company's real website.`, cues: ['C10'] },
          { id: 'top', label: `Praise before any check: "You were our top choice"`, kind: CORRECT, reason: `Praise is bait. Nobody has checked you yet.`, cues: ['C15'] },
          { id: 'congrats', label: `The email is addressed to Kai by name`, kind: NEUTRAL },
          { id: 'professional', label: `A signature with a name and a company`, kind: NEUTRAL },
          { id: 'email', label: `It comes by email`, kind: NEUTRAL },
        ],
      },
    ],
    takeaway: `A real offer does not need your Social Security number and bank details in the first email. A polished letter and a logo do not make it real, and a short deadline is a reason to slow down.`,
    takeawayCues: ['C17'],
  },

  // ---------------------------------------------------------------- PART 2: SCAMMER TACTICS (internal ID: Offender)
  {
    id: 'O1',
    part: 'offender',
    index: 1,
    title: `Designing the message`,
    channel: `Preparation`,
    technique: `A copied company and a lookalike website`,
    caseId: 'O-clone',
    story: {
      name: `Case file 1: The copied bank`,
      avatar: `\u{1F9B9}`,
      color: `#ef4444`,
      facts: [`Seen from the scammer's side`, `Target: Nina Okafor, graduating senior`],
      text: `A small scam crew wants to look like Halbrook Credit Union. They copy its logo, its job titles and its friendly tone, buy a web address that looks almost the same, and post a "Member Service Representative" job on a popular job board. Nina is a graduating senior who scrolls the board at midnight. She sees the posting and thinks it is perfect.`,
    },
    context: `The posting Nina sees on the job board.`,
    message: {
      blocks: [
        {
          kind: 'jobpost',
          board: `JobTrail`,
          title: `Member Service Representative`,
          company: `Halbrook Credit Union`,
          location: `Remote, United States`,
          pay: `$31 an hour`,
          type: `Full time, no experience needed`,
          posted: `Posted 2 hours ago`,
          desc: [`Help our members by chat and phone. Paid training. Weekly pay.`, `Apply now at halbrookcu-careers.com`],
        },
      ],
    },
    steps: [
      {
        key: 'q1',
        type: 'choice',
        prompt: `What do scammers usually rely on to make a fake posting believable?`,
        options: [
          { id: 'a', text: `A real company's name, logo and polished wording, posted where job seekers already look.`, best: true, note: `These are trust signals. People trust a known brand and rarely check where a posting came from.`, cues: ['C17'] },
          { id: 'b', text: `A company name nobody has heard of.`, note: `Less common. Unknown names earn less trust.` },
          { id: 'c', text: `Asking for payment in the first line.`, note: `Rare. It scares people off.` },
          { id: 'd', text: `Many spelling mistakes.`, note: `Some scams have them, but many look polished.` },
        ],
      },
      {
        key: 'q2',
        type: 'choice',
        prompt: `How can a job seeker break this step?`,
        options: [
          { id: 'a', text: `Find the company's own website yourself, check its careers page for the job, and compare the web address in the posting.`, best: true, note: `If the job or the web address does not match, treat it with care.`, cues: ['C10'] },
          { id: 'b', text: `Trust the logo.`, note: `Logos are easy to copy.`, cues: ['C17'] },
          { id: 'c', text: `Apply fast before the job is gone.`, note: `Speed is what the scammer wants.` },
        ],
      },
    ],
    plan: {
      goal: `be believed.`,
      tactic: `borrow a real company's name and look professional.`,
      why: { label: `Why here`, text: `a job board is where job seekers already trust what they see.` },
      lever: `trust-transfer (borrowing a known brand's trust).`,
      pushback: { label: `If the target pushes back`, text: `the scammer says "yes, it is real" and sends more polished paperwork. (Our reasoning.)` },
    },
    takeaway: `A brand name, a logo and good writing are easy to copy. Compare the web address and the job with the company's own site.`,
  },

  {
    id: 'O2',
    part: 'offender',
    index: 2,
    title: `Choosing who to reach`,
    channel: `Target selection`,
    technique: `Picking targets from public profiles`,
    caseId: 'O-scrape',
    story: {
      name: `Case file 2: The list`,
      avatar: `\u{1F9B9}`,
      color: `#ef4444`,
      facts: [`Seen from the scammer's side`, `Goal: find people to message`],
      text: `A scam operator is building a list. He does not write to everyone. He browses public resume sites and social profiles, looking for people who are easy to find and easy to reach. Three profiles come up on his screen tonight.`,
    },
    context: `The three profiles on the list.`,
    message: {
      blocks: [
        {
          kind: 'profiles',
          profiles: [
            { name: `Profile A`, who: `Imani Brooks`, text: `Resume public on a job site. "Open to work" is on. Graduates in May. Personal email and phone number are shown.`, tone: `#34d399` },
            { name: `Profile B`, who: `Private profile`, text: `Profile set to private. No email or phone is shown.`, tone: `#60a5fa` },
            { name: `Profile C`, who: `Sofia Marin`, text: `Already employed. Profile is public. No contact details are shown.`, tone: `#f59e0b` },
          ],
        },
      ],
    },
    steps: [
      {
        key: 'q1',
        type: 'choice',
        fixedOrder: true, // options are named Profile A, B, C, so they keep this order and show no letters
        noLetters: true,
        prompt: `Which profile would a scammer most likely message first, and why?`,
        options: [
          { id: 'a', text: `Profile A. It is easy to find and easy to reach.`, best: true, note: `A scammer needs someone they can find and contact. Almost every job seeker has details worth stealing, so being findable and reachable often decides who gets the message.` },
          { id: 'b', text: `Profile B.`, note: `Hard to find and reach. Less likely.` },
          { id: 'c', text: `Profile C.`, note: `Findable, but there is no way to reach them and they are not looking. Less likely.` },
          { id: 'd', text: `All three are the same.`, note: `Not quite. They differ in how visible and reachable they are.` },
        ],
      },
      {
        key: 'q2',
        type: 'choice',
        prompt: `Which step makes a job seeker harder to reach?`,
        options: [
          { id: 'a', text: `Be careful which contact details you make public, and use the platform's own messages.`, best: true, note: `A scammer cannot message what they cannot find.` },
          { id: 'b', text: `Reply quickly so you do not lose the chance.`, note: `This is what the scammer wants.` },
          { id: 'c', text: `Accept any offer that reaches your student email.`, note: `Student email is a known route for scams.` },
        ],
      },
    ],
    plan: {
      goal: `find people to message.`,
      tactic: `pick people who are easy to find and easy to reach.`,
      why: { label: `Why here`, text: `public resume sites and profiles are where job seekers are.` },
      lever: `none yet. This step is about reach. The levers start in the next scenarios.`,
      pushback: { label: `If the target is not reachable`, text: `the scammer moves on to the next profile. (Our reasoning.)` },
    },
    takeaway: `Scammers go where job seekers are easy to find and easy to reach. When an offer feels perfect and fast, slow down and ask someone.`,
  },

  {
    id: 'O3',
    part: 'offender',
    index: 3,
    title: `Moving the conversation`,
    channel: `Escalation`,
    technique: `A chat-only interview and a fee`,
    caseId: 'O-chat',
    story: {
      name: `Case file 3: The chat interview`,
      avatar: `\u{1F9B9}`,
      color: `#ef4444`,
      facts: [`Seen from the scammer's side`, `Target: Devon Price, recent graduate`],
      text: `Devon applied for a customer success job on a job board. A "recruiter" replies within minutes and says the next step is a quick interview on Telegram with the company's "AI hiring assistant". Devon is happy to be moving fast. The chat goes well, and then a message arrives.`,
    },
    context: `The chat Devon sees on his phone.`,
    message: {
      blocks: [
        {
          kind: 'thread',
          app: 'telegram',
          contact: { name: `Hiring Assistant`, sub: `bot` },
          day: `Today`,
          messages: [
            { who: 'them', text: `Welcome Devon! I am the AI hiring assistant for Northgate Customer Success. Let's begin your interview. Why do you want this role?`, time: `4:10 PM` },
            { who: 'me', text: `I like helping people solve problems, and I have retail experience.`, time: `4:11 PM` },
            { who: 'them', text: `Great answer! You passed the interview. To receive your contract, please pay the $89 background check fee today.`, time: `4:14 PM` },
          ],
        },
      ],
    },
    steps: [
      {
        key: 'q1',
        type: 'choice',
        prompt: `After a reply, what do scammers often do next?`,
        options: [
          { id: 'a', text: `Move to a private chat app, run a chat-only interview, say you passed, then ask for a fee.`, best: true, note: `Leaving the job platform removes its reporting and review tools. Saying "you passed" builds trust before the ask.`, cues: ['C11', 'C5', 'C13', 'C15'] },
          { id: 'b', text: `Keep everything on the job platform.`, note: `Less likely. The platform may flag it.` },
          { id: 'c', text: `Ask for a video interview with a real person.`, note: `Scammers avoid this, because a real face can be checked.` },
          { id: 'd', text: `Go silent.`, note: `Unlikely.` },
        ],
      },
      {
        key: 'q2',
        type: 'choice',
        prompt: `How can a job seeker break this step?`,
        options: [
          { id: 'a', text: `Stay on the platform you applied through, ask for a video call with a named person, and never pay a fee to get hired.`, best: true, note: `Honest employers do not charge you to hire you.`, cues: ['C13'] },
          { id: 'b', text: `Move to the chat app if the recruiter says it is faster.`, note: `This is the tactic.` },
          { id: 'c', text: `Pay the small fee. It is only $89.`, note: `A small fee is still a fee to get a job.` },
        ],
      },
    ],
    plan: {
      goal: `keep the target engaged and away from checks.`,
      tactic: `a private chat, a chat-only interview, and a "you passed" message.`,
      why: { label: `Why here`, text: `off the platform, nobody can flag or review the conversation.` },
      lever: `flattery (a quick "you passed") and trust-transfer.`,
      pushback: { label: `If the target pushes back`, text: `the scammer moves on to the next person. (Our reasoning.)` },
    },
    takeaway: `A chat-only interview, a quick "you passed", and a fee to be hired are all warning signs. Stay on the platform and ask for a video call.`,
  },

  {
    id: 'O4',
    part: 'offender',
    index: 4,
    title: `Applying pressure`,
    channel: `Pressure`,
    technique: `A fake check and a short deadline`,
    caseId: 'O-check',
    pause: true,
    story: {
      name: `Case file 4: The overpayment`,
      avatar: `\u{1F9B9}`,
      color: `#ef4444`,
      facts: [`Seen from the scammer's side`, `Target: Rosa Delgado, design student`],
      text: `Rosa is a design student who answered an ad for a "personal assistant" to a busy executive. Over two days the executive has been warm and chatty. Now he sends a check in the mail and a message with a clock on it.`,
    },
    context: `The message Rosa gets after the check arrives.`,
    message: {
      blocks: [
        {
          kind: 'email',
          client: 'gmail',
          from: { name: `Mr. Grant`, addr: `grant.assistant.hire@gmail.com` },
          to: `me`,
          date: `Fri, Nov 6, 3:48 PM`,
          subject: `Your check has arrived. Please act before 6 PM`,
          body: [
            `Hi Rosa, your first check is for $2,800. Deposit it today, keep $300 as your first week's pay, and send the rest to our equipment vendor by bank transfer.`,
            `The vendor needs payment before 6 PM or your equipment order will be cancelled and I will have to pick another assistant.`,
          ],
          signature: [`Thank you,`, `Mr. Grant`],
        },
      ],
    },
    steps: [
      {
        key: 'q1',
        type: 'choice',
        prompt: `Why does the scammer add a short deadline?`,
        options: [
          { id: 'a', text: `Pressure leaves no time to check. The bank may show the money before it finds the check is fake.`, best: true, note: `A fake check can look real and take days or weeks to be found out. By then the money you sent is gone.`, cues: ['C4', 'C8'] },
          { id: 'b', text: `The vendor really does close at 6 PM.`, note: `The vendor is part of the scam.` },
          { id: 'c', text: `To be fair to other candidates.`, note: `There are no other candidates.` },
          { id: 'd', text: `It does not matter. People ignore deadlines.`, note: `Not true. Pressure makes people skip checks.` },
        ],
      },
      {
        key: 'q2',
        type: 'choice',
        prompt: `How can a job seeker break this step?`,
        options: [
          { id: 'a', text: `Pause. Do not send money from a check. Call your bank, and call the company using a number from its official website.`, best: true, note: `A real employer will wait for your answer. Never send money onward from a check.`, cues: ['C8', 'C9'] },
          { id: 'b', text: `Send the money fast. The bank showed the funds.`, note: `Funds showing does not mean the check is good.` },
          { id: 'c', text: `Ask Mr. Grant by email if the check is real.`, note: `He will say yes.` },
        ],
      },
    ],
    plan: {
      goal: `get money sent before the check is found to be fake.`,
      tactic: `an official-looking check, an equipment story and a deadline.`,
      why: { label: `Why now`, text: `trust has been built over two days, so a rush feels normal.` },
      lever: `scarcity and urgency (the job will go to someone else).`,
      pushback: { label: `If the target pushes back`, text: `the scammer says the deadline is firm and sends a "reminder". (Our reasoning.)` },
    },
    takeaway: `If a check arrives and you are asked to send money on, stop. It is a scam. A short deadline is built to stop you from checking.`,
    takeawayCues: ['C17'],
  },

  // ---------------------------------------------------------------- PART 3: GUARDIAN
  {
    id: 'G1',
    part: 'guardian',
    index: 1,
    title: `Packages at the door`,
    channel: `Protective action`,
    kind: 'scam',
    technique: `A reshipping job`,
    caseId: 'G-reship',
    story: {
      name: `Hannah Cole`,
      avatar: `\u{1F469}\u{1F3FC}`,
      color: `#fb923c`,
      facts: [`Your roommate`, `Works nights`, `Needs a day job`],
      text: `Hannah is your roommate. She wants a day job and found a remote "logistics assistant" role on a job site. She just got a reply and shows you her screen. "It pays $25 an hour just to handle boxes," she says. "Should I take it?"`,
    },
    context: `Hannah holds out her phone and asks what you think.`,
    message: {
      blocks: [
        {
          kind: 'email',
          client: 'gmail',
          from: { name: `Northline Freight Solutions`, addr: `hiring@northline-freight-hr.com` },
          to: `me`,
          date: `Mon, Nov 9, 7:20 PM`,
          subject: `Home-Based Logistics Assistant: You're hired`,
          body: [
            `Hi Hannah, you have the job! Our clients ship goods to our staff, who inspect each item and send it on to our overseas customers.`,
            `Packages will be delivered to your home address. Print the labels we email you, repack each item, and drop it at the post office. You earn $25 an hour. Your first payment will be a check, sent after your first week.`,
          ],
          signature: [`Warm regards,`, `Northline Freight Solutions, Recruiting`],
        },
      ],
    },
    steps: [
      CLASSIFY(true, 's1'),
      {
        key: 's2',
        type: 'choice',
        prompt: `What do you tell Hannah?`,
        options: [
          { id: 'a', text: `Do not take it. Receiving and forwarding packages is a known scam, and the goods are often bought with stolen cards. Stop replying and report it at ReportFraud.ftc.gov.`, best: true, note: `Reshipping can make you part of the crime without knowing. The FTC says handling packages for an employer is never a real job.`, cues: ['C26'] },
          { id: 'b', text: `Try one package to see if the pay comes.`, note: `A single package can still involve stolen goods, and you could be questioned by the police.` },
          { id: 'c', text: `Ask Northline in the same email if the job is real.`, note: `They will say yes.` },
          { id: 'd', text: `Take it. The company has a website.`, note: `A website is easy to make. The pay is also far above the work.` },
        ],
      },
    ],
    takeaway: `A job that asks you to receive packages and send them on is not a real job. You can be pulled into fraud even if you did not know. Stop, do not ship anything, and report it.`,
    takeawayCues: ['C26'],
    rule: `Never receive and forward packages or payments for an employer.`,
    connects: `V1 and O4 (an easy job that hides the real ask).`,
  },

  {
    id: 'G2',
    part: 'guardian',
    index: 2,
    title: `A recruiter reaches out`,
    channel: `Verify the recruiter`,
    kind: 'legit',
    technique: `A real recruiter on LinkedIn`,
    caseId: 'G-real-recruiter',
    story: {
      name: `Amara Johnson`,
      avatar: `\u{1F469}\u{1F3FE}`,
      color: `#2dd4bf`,
      facts: [`Your classmate`, `Statistics major`, `Cautious about scams`],
      text: `Amara is in your statistics class. After last week's scam talk she is nervous about every message. A recruiter just wrote to her out of the blue. "It could be nothing," she says. "Or it could be a trap. Can you look with me?"`,
    },
    context: `Amara shows you the message and asks you to look with her.`,
    message: {
      blocks: [
        {
          kind: 'linkedin',
          profile: { name: `Rebecca Torres`, headline: `Senior Technical Recruiter at Calloway Insurance Group`, meta: `Joined 6 years ago, 500+ connections`, color: `#0a66c2` },
          message: [
            `Hi Amara, I am a recruiter at Calloway Insurance Group. Your profile fits our Associate Claims Analyst opening. You can read the role and apply at calloway-group.com/careers. I am happy to answer questions here.`,
          ],
        },
        {
          kind: 'notes',
          heading: `What you find`,
          items: [`Her profile is 6 years old with 500+ connections.`, `She is listed as a recruiter on the company's official careers page.`, `The link goes to the company's own website, which has the same role.`],
        },
      ],
    },
    steps: [
      CLASSIFY(false, 's1'),
      {
        key: 's2',
        type: 'choice',
        prompt: `What do you tell Amara?`,
        options: [
          { id: 'a', text: `It looks real. Read the role on the company's own site and apply there.`, best: true, note: `The profile, the company page and the link all agree.`, cues: ['C12', 'C14'] },
          { id: 'b', text: `Move to WhatsApp for faster details.`, note: `Not needed. A real recruiter can answer on the platform.` },
          { id: 'c', text: `Ignore it. All recruiter messages are scams.`, note: `Not supported. The checks show this one is real.` },
          { id: 'd', text: `Send your ID to hold the spot.`, note: `Personal details come after a real offer.` },
        ],
      },
    ],
    takeaway: `A message can be real even if it arrives unprompted. Check the profile, the company page and the link, then apply on the company's own site.`,
    rule: `Check the profile, the company page and the link, then apply on the company's own site.`,
    connects: `V2 (a real message that checks out).`,
  },

  {
    id: 'G3',
    part: 'guardian',
    index: 3,
    title: `A posting on the campus portal`,
    channel: `Verify the job`,
    kind: 'legit',
    technique: `A real campus job posting`,
    caseId: 'G-real-posting',
    story: {
      name: `Diego Alvarez`,
      avatar: `\u{1F9D1}\u{1F3FD}`,
      color: `#fbbf24`,
      facts: [`Your lab partner`, `Sophomore`, `Wants a library job`],
      text: `Diego is your lab partner. He found a library job on his college's job portal and wants to apply tonight. Because of all the talk about scams, he is not sure he should trust it. "Can you check it with me?" he asks.`,
    },
    context: `Diego shows you the posting and what you both find after a few checks.`,
    message: {
      blocks: [
        {
          kind: 'jobpost',
          board: `Lakeshore Career Portal`,
          title: `Library Technology Assistant`,
          company: `Lakeshore Community College Library`,
          location: `On campus`,
          pay: `$16.50 an hour`,
          type: `Part time, 10 hours a week`,
          posted: `Posted 4 days ago`,
          desc: [`Help students with printers, scanners and laptops at the library desk.`, `Apply on the college's student employment page.`],
        },
        {
          kind: 'notes',
          heading: `What you find`,
          items: [`The same job title and pay are on the college's own jobs page.`, `The application link goes to the college's own website.`, `The posting asks for no fee and no ID.`],
        },
      ],
    },
    steps: [
      CLASSIFY(false, 's1'),
      {
        key: 's2',
        type: 'choice',
        prompt: `What do you tell Diego?`,
        options: [
          { id: 'a', text: `It looks real. Apply on the college's own jobs page, not through a message link.`, best: true, note: `Independent checks agree.`, cues: ['C14'] },
          { id: 'b', text: `It is probably a scam. Ignore it.`, note: `Not supported by what you found.` },
          { id: 'c', text: `Pay a small fee to hold the spot.`, note: `Honest employers do not ask you to pay to get a job.` },
          { id: 'd', text: `I cannot tell. Skip it.`, note: `You found enough to decide.` },
        ],
      },
    ],
    takeaway: `Checking can show that a job is real. Apply on the organization's own site.`,
    rule: `Compare the job on the board with the organization's own site.`,
    connects: `V1 and O1 (a posting can be copied; here it matches).`,
  },

  {
    id: 'G4',
    part: 'guardian',
    index: 4,
    title: `The AI trainer gig`,
    channel: `Respond and report`,
    kind: 'scam',
    technique: `A paid certification for an AI-training gig`,
    caseId: 'G-cert',
    story: {
      name: `Fatima Hassan`,
      avatar: `\u{1F9D5}\u{1F3FD}`,
      color: `#c084fc`,
      facts: [`Your cousin`, `Linguistics student`, `Wants flexible work`],
      text: `Your cousin Fatima speaks three languages and wants flexible work. A new contact messaged her about "AI training" gigs for linguists. She sends you a screenshot and a worried voice note. "I think I passed the test," she says. "They need me to pay a fee now. Is that normal?"`,
    },
    context: `Fatima sends you the chat and what she found about the company.`,
    message: {
      blocks: [
        {
          kind: 'thread',
          app: 'whatsapp',
          contact: { name: `Chloe (NovaLabel Talent)`, sub: `online` },
          day: `Today`,
          messages: [
            { who: 'them', text: `Hi Fatima! We are hiring remote AI language trainers at $38 an hour. You passed the test with a top score!`, time: `1:12 PM` },
            { who: 'them', text: `To unlock your first projects you need the NovaLabel certification. It is a refundable $120, paid by Zelle or crypto today.`, time: `1:13 PM` },
          ],
        },
        {
          kind: 'notes',
          heading: `What you find`,
          items: [`The company's website was created three weeks ago.`, `There are no reviews or employees you can find online.`, `The fee is "refundable", but only if you pay first.`],
        },
      ],
    },
    steps: [
      CLASSIFY(true, 's1'),
      {
        key: 's2',
        type: 'choice',
        prompt: `What do you do?`,
        options: [
          { id: 'a', text: `Tell Fatima not to pay. Stop replying, then report to the platform and at ReportFraud.ftc.gov.`, best: true, note: `A real company does not charge you to start work. Being told the fee is refundable does not change that. If Fatima already paid, call her bank or payment app right away.`, cues: ['C13'] },
          { id: 'b', text: `Pay it. It is refundable.`, note: `Scammers say "refundable" to make a fee feel safe.`, cues: ['C13'] },
          { id: 'c', text: `Ask Chloe in the same chat to prove it is real.`, note: `This gives the scammer more chances.` },
          { id: 'd', text: `Pay half now and half later.`, note: `Any payment is money lost.` },
        ],
      },
    ],
    takeaway: `Never pay to get a job, even a "refundable" fee. If money was sent, act right away: for a bank transfer or Zelle, call your bank; for a card, the card issuer; for crypto, the exchange or ATM operator; for a gift card, the issuer. Report to the FTC and to ic3.gov. Support your friend without blame.`,
    takeawayCues: ['C13'],
    rule: `Never pay to get a job, even a refundable fee.`,
    connects: `O3 (a "you passed" message, then a fee in a chat app) and V3 (a payment demanded to unlock earnings).`,
  },
]

export const byId = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]))
export const byPart = (part) => SCENARIOS.filter((s) => s.part === part)