/**
 * Case: Netflix's 2023 password-sharing crackdown.
 *
 * Real, publicly reported figures (subscribers in millions, revenue in $M)
 * are used as the starting point and as the "actual outcome" reference line.
 * Sources are listed below; anything beyond the reported quarterly totals
 * (i.e. the outcomes of the two options Netflix did NOT take) is this
 * project's own illustrative model, not Netflix data.
 */
const NETFLIX_PASSWORD_SHARING_CASE = {
  id: "netflix-password-sharing",
  title: "Netflix: crack down on password sharing?",
  quarterLabels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023"],

  background: [
    "Heading into 2023, Netflix estimated over 100 million households were watching using an account they didn't pay for — password sharing was eating into growth just as the streaming market got more competitive.",
    "The decision in front of the team: how hard to push on password sharing. Go too soft and you leave revenue on the table; go too hard and you risk a subscriber backlash in a market with plenty of alternatives.",
    "Netflix chose to enforce it: starting in a few smaller markets in early 2023, then a broad global rollout — including the US — by the end of May 2023. Account holders had to set a primary “household,” and sharing outside it required paying an extra-member fee (or the borrower signing up on their own).",
  ],

  sourceLinks: [
    { label: "CNN — Netflix adds nearly 6M subscribers amid crackdown", url: "https://www.cnn.com/2023/07/19/tech/netflix-earnings-subscriber-growth/index.html" },
    { label: "CNBC — Netflix subscriptions rise as crackdown takes effect", url: "https://www.cnbc.com/2023/06/09/netflix-subscriptions-rise-password-sharing-crackdown.html" },
    { label: "TIME — Netflix's risky move pays off", url: "https://time.com/6581204/netflix-password-sharing-subscriptions-rise/" },
    { label: "Forbes — The crackdown is working", url: "https://www.forbes.com/sites/kateoflahertyuk/2023/10/25/the-netflix-password-sharing-crackdown-is-working-and-others-will-certainly-follow/" },
  ],

  startingState: {
    subscribersM: 232.5, // global paid subscribers, end of Q1 2023
    quarterlyRevenueM: 8160, // global revenue, Q1 2023 ($8.16B)
  },

  // Shared assumptions used by every option (see js/engine/simulation.js):
  model: {
    organicGrowthRate: 0.0075, // ~quarterly organic subscriber growth, pre-crackdown trend
    arpuGrowthRate: 0.003, // ~quarterly blended-ARPU growth from routine price increases
    // "boost" = extra subscriber adds per quarter, on top of organic growth,
    // from converting password-sharing freeloaders into paying members.
    // These are the full-enforcement boost figures, back-solved from Netflix's
    // actual reported adds (see actualOutcome below); each option scales them
    // by its own "effectiveness" (how much of that conversion it actually captures).
    maxBoostM: [0, 4.16, 7.01, 11.25], // Q1, Q2, Q3, Q4 (Q1 is the baseline quarter, no boost)
  },

  decisionPoint: {
    prompt: "It's early 2023. What does Netflix do about password sharing?",
    options: [
      {
        id: "crackdown",
        label: "A — Enforce it now (what Netflix actually did)",
        description:
          "Roll out household verification and extra-member fees globally within the year. Force the conversion, accept some short-term backlash risk.",
        effectiveness: 1.0,
        isActual: true,
        narrative:
          "This is the path Netflix took. The rollout was loud and drew public complaints when it hit the US in May 2023 — but the backlash didn't translate into a subscriber exodus. Instead, freeloaders converted into paying accounts faster than expected, and Netflix's own CFO called paid sharing the company's \"primary revenue accelerator\" for the year. Growth accelerated every quarter through Q4 2023, the strongest quarter for adds since 2020.",
      },
      {
        id: "soft-nudge",
        label: "B — Gradual, soft nudge (hypothetical)",
        description:
          "Encourage upgrading with in-app messaging and gentle reminders, but never hard-enforce household checks or force a paywall.",
        effectiveness: 0.4,
        isActual: false,
        narrative:
          "Without a hard enforcement deadline, most freeloaders have no real reason to convert — a soft nudge captures some of the willing-but-unaware households, but the majority keep sharing for free. Growth and revenue tick up modestly versus doing nothing, but Netflix leaves most of the upside on the table, and never gets the clear “before vs. after” moment that made the real rollout easy to point to internally.",
      },
      {
        id: "do-nothing",
        label: "C — Do nothing (hypothetical)",
        description:
          "Leave password sharing as-is. Compete purely on content and price increases, and avoid any user backlash risk entirely.",
        effectiveness: 0.0,
        isActual: false,
        narrative:
          "No backlash, no bad press — but also no acceleration. Subscriber growth continues at its pre-crackdown organic pace only, missing the double-digit-million quarterly adds Netflix actually posted. Over a full year, this is the option that leaves the most money on the table, and competitors (several of whom copied Netflix's move later in 2023) start closing the gap.",
      },
    ],
  },

  // What actually happened, per Netflix's quarterly reports — used as the
  // comparison overlay when the user picks anything other than option A.
  actualOutcome: {
    optionId: "crackdown",
    subscribersM: [232.5, 238.4, 247.2, 260.3],
    quarterlyRevenueM: [8160, 8192, 8542, 8833],
  },
};
