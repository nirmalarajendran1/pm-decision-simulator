# PM Decision Simulator

A prototype exploring an idea: what if a PM course's case studies weren't just
static write-ups, but let you make the actual decision and then see a
**quantitative simulation** of how that choice plays out — compared to what
really happened?

Most PM courses (especially in India) teach cases as narrative write-ups.
Simulation-driven tools like GoPractice exist for product/growth mechanics
in general, but none of the Indian PM course providers pair their own case
studies with an interactive, counterfactual simulation. This is a working
demo of what that could look like, built on one real, publicly documented
case so it's IP-safe and independently verifiable.

**[Live demo](#)** — *(enable GitHub Pages on this repo, then swap this
link for `https://nirmalarajendran1.github.io/pm-decision-simulator/`)*

## The demo case: Netflix's 2023 password-sharing playbook

Real product decisions rarely come as a single fork — this case has **two
sequential, interacting decisions**, the way Netflix actually faced them:

1. **Enforcement** — how hard to push on password sharing at all (enforce it / a soft nudge / do nothing).
2. **Pricing** — once you enforce, how much to charge for the extra-member seat ($9.99 / $7.99 / $4.99).

That's 9 combined outcomes, not 3 — and they genuinely interact: the model
makes the pricing decision have *zero* effect if enforcement never happened,
which is itself a useful thing to notice. Within "enforce," the pricing tiers
create a real trade-off rather than one dominating the others: $4.99 wins on
total subscribers, but $7.99 — what Netflix actually charged — wins on total
revenue, ahead of both the cheaper and the pricier option. The simulator
projects subscribers and revenue forward quarter by quarter for whichever
combination you pick, using a small transparent formula — not a black box —
so you can see *why* the numbers move.

Pick the combination Netflix actually chose (Enforce + $7.99) and the
simulated curve is calibrated to track Netflix's real reported quarterly
results closely. Pick any other combination and the simulator overlays "what
actually happened" so you can see the gap.

All figures are sourced from Netflix's public quarterly earnings coverage
(linked in-app). Anything beyond the real reported numbers — i.e. the 8
combinations Netflix didn't take — is this project's own reasoned, clearly
labeled estimate, not verified Netflix data.

## How it works

- Static site, no backend: plain HTML/CSS/JS + [Chart.js](https://www.chartjs.org/) via CDN. Deployable directly on GitHub Pages.
- `js/engine/simulation.js` — the reusable simulation engine. Pure function: case definition + a chosen combo of decisions in, a subscriber/revenue time series out. Knows nothing about Netflix specifically.
- `js/engine/renderChart.js` — renders the time series (plus the "actual outcome" overlay) with Chart.js.
- `js/cases/netflix-password-sharing.js` — the case content: background, sources, both decision points and their model parameters, and the real reported figures.
- `js/main.js` — wires the case through a two-step decision UI.

## Adding a new case

Because the engine is generic, a new case is a single new file under
`js/cases/`, shaped like `netflix-password-sharing.js`:

- `startingState`: subscribers/revenue (or whatever metrics fit the case) at the decision point.
- `model`: the shared formula parameters (growth rate, ARPU growth, the per-quarter "boost" a full-strength decision would produce).
- `decisionPoints`: an array (1, 2, or more sequential decisions), each with a `prompt` and `options`. An option carries whatever parameters the model formula needs (e.g. `effectiveness`, `conversionYield`, `arpuBonus`) plus a short narrative.
- `actualOutcome`: the real reported time series and the `combo` of option ids Netflix (or whoever) actually chose, for the comparison overlay.

Then add a `<script src="js/cases/your-case.js">` tag in `index.html` and wire
a case switcher in `main.js` (the current MVP hardcodes the one case for
simplicity).

## Status

MVP / portfolio prototype, built to demonstrate the concept — not affiliated
with or endorsed by Netflix or any PM course provider.
