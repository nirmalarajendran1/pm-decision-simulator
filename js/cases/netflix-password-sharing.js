/**
 * Case: Netflix's 2023 password-sharing crackdown.
 *
 * Two sequential, interacting decisions:
 *   1. Enforcement  — how hard to push on password sharing at all.
 *   2. Pricing       — how much to charge for the extra-member add-on.
 * Pricing only matters if enforcement is actually happening — the model
 * makes that interaction explicit (see js/engine/simulation.js).
 *
 * Real, publicly reported figures (subscribers in millions, revenue in $M)
 * are used as the starting point and as the "actual outcome" reference line
 * for the real combo Netflix chose (Enforce + $7.99 fee). Every other
 * combination is this project's own illustrative estimate, not Netflix data.
 */
const NETFLIX_PASSWORD_SHARING_CASE = {
  id: "netflix-password-sharing",
  title: "Netflix: the 2023 password-sharing playbook",
  quarterLabels: ["Q1 2023", "Q2 2023", "Q3 2023", "Q4 2023"],

  background: [
    "Heading into 2023, Netflix estimated over 100 million households were watching using an account they didn't pay for — password sharing was eating into growth just as the streaming market got more competitive.",
    "Two separate calls faced the team. First: how hard to push on enforcement at all — go too soft and you leave revenue on the table; go too hard and you risk a subscriber backlash. Second, and only relevant once you enforce: how much to charge for the extra-member seat — price it too high and people balk instead of paying; too low and you leave money on the table on every conversion.",
    "Netflix's actual playbook: enforce fully (household verification, global rollout by end of May 2023) and price the extra-member add-on at $7.99/month in the US.",
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

  // Shared assumptions, combined by js/engine/simulation.js:
  model: {
    organicGrowthRate: 0.0075, // quarterly organic subscriber growth, pre-crackdown trend
    baseArpuGrowthRate: 0.001, // minimal ARPU drift from routine catalog/price changes, regardless of decisions
    // Full-enforcement, full-conversion boost figures (extra subs/quarter on
    // top of organic growth), back-solved from Netflix's actual reported
    // adds. Each combo scales this by enforcement.effectiveness * pricing.conversionYield.
    maxBoostM: [0, 4.16, 7.01, 11.25], // Q1..Q4 (Q1 is the baseline quarter)
  },

  decisionPoints: [
    {
      id: "enforcement",
      stepLabel: "Decision 1 of 2",
      prompt: "First call: how hard does Netflix push on password sharing?",
      options: [
        {
          id: "crackdown",
          label: "A — Enforce it now (what Netflix actually did)",
          description: "Roll out household verification globally within the year. Force the conversion, accept some backlash risk.",
          effectiveness: 1.0,
          isActual: true,
          narrative: "Enforcement was real and loud — it drew public complaints when it hit the US in May 2023. But the backlash never turned into a subscriber exodus.",
        },
        {
          id: "soft-nudge",
          label: "B — Gradual, soft nudge (hypothetical)",
          description: "In-app messaging and gentle reminders, but never a hard household check or paywall.",
          effectiveness: 0.4,
          isActual: false,
          narrative: "Without a real deadline, most freeloaders have no reason to convert — a nudge catches only the willing-but-unaware households.",
        },
        {
          id: "do-nothing",
          label: "C — Do nothing (hypothetical)",
          description: "Leave password sharing as-is. Zero backlash risk, zero acceleration.",
          effectiveness: 0.0,
          isActual: false,
          narrative: "No backlash, no bad press — and no conversion at all. Whatever gets picked in the next decision, it won't have anything to work with.",
        },
      ],
    },
    {
      id: "pricing",
      stepLabel: "Decision 2 of 2",
      prompt: "Second call: how much does the extra-member seat cost?",
      options: [
        {
          id: "high-fee",
          label: "High — $9.99/month",
          description: "Price it close to a standalone plan. Higher revenue per seat, but noticeably fewer households agree to pay it.",
          conversionYield: 0.70,
          arpuBonus: 0.006,
          isActual: false,
          narrative: "Pricing it this high squeezes more out of every household that does convert — but enough of them balk and drop the extra seat instead of paying that total conversions fall well short.",
        },
        {
          id: "medium-fee",
          label: "Medium — $7.99/month (what Netflix actually charged)",
          description: "The price point Netflix actually launched with in the US.",
          conversionYield: 1.0,
          arpuBonus: 0.002,
          isActual: true,
          narrative: "This is the price Netflix actually picked — high enough per seat, low enough friction, that it ends up capturing more total revenue than either extreme.",
        },
        {
          id: "low-fee",
          label: "Low — $4.99/month",
          description: "Undercut the friction almost entirely. More households say yes, but each seat brings in so little it drags down the blended average revenue per member.",
          conversionYield: 1.05,
          arpuBonus: -0.004,
          isActual: false,
          narrative: "At this price almost nobody says no, and it actually wins on total subscriber count — but each seat is worth so little that overall revenue ends up lower than the medium price, despite the extra volume.",
        },
      ],
    },
  ],

  // What actually happened, per Netflix's quarterly reports — the combo is
  // enforcement=crackdown + pricing=medium-fee, the real path Netflix took.
  actualOutcome: {
    combo: { enforcement: "crackdown", pricing: "medium-fee" },
    subscribersM: [232.5, 238.4, 247.2, 260.3],
    quarterlyRevenueM: [8160, 8192, 8542, 8833],
  },
};
