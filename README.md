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

## The demo case: Netflix's 2023 password-sharing crackdown

Netflix faced a real, hard PM trade-off in early 2023: enforce household
verification and extra-member fees (risking a subscriber backlash), or leave
password sharing alone and keep growing more slowly but with zero backlash
risk. You make the call, and the simulator projects subscribers and revenue
forward quarter by quarter, using a small transparent formula — not a black
box — so you can see *why* the numbers move the way they do.

Pick "what Netflix actually did" and the simulated curve is calibrated to
track Netflix's real reported quarterly results closely. Pick either
hypothetical alternative and the simulator overlays "what actually happened"
so you can see the gap.

All figures are sourced from Netflix's public quarterly earnings coverage
(linked in-app). Anything beyond the real reported numbers — i.e. the two
options Netflix didn't take — is this project's own reasoned, clearly
labeled estimate, not verified Netflix data.

## How it works

- Static site, no backend: plain HTML/CSS/JS + [Chart.js](https://www.chartjs.org/) via CDN. Deployable directly on GitHub Pages.
- `js/engine/simulation.js` — the reusable simulation engine. Pure function: case definition + chosen option in, a subscriber/revenue time series out. Knows nothing about Netflix specifically.
- `js/engine/renderChart.js` — renders the time series (plus the "actual outcome" overlay) with Chart.js.
- `js/cases/netflix-password-sharing.js` — the case content: background, sources, decision options and their model parameters, and the real reported figures.
- `js/main.js` — wires the case through the UI.

## Adding a new case

Because the engine is generic, a new case is a single new file under
`js/cases/`, shaped like `netflix-password-sharing.js`:

- `startingState`: subscribers/revenue (or whatever metrics fit the case) at the decision point.
- `model`: the shared formula parameters (growth rate, ARPU growth, the per-quarter "boost" a full-strength decision would produce).
- `decisionPoint.options`: each option's description, an `effectiveness` (0–1) scaling how much of the boost it captures, and a short narrative.
- `actualOutcome`: the real reported time series, for the comparison overlay.

Then add a `<script src="js/cases/your-case.js">` tag in `index.html` and wire
a case switcher in `main.js` (the current MVP hardcodes the one case for
simplicity).

## Status

MVP / portfolio prototype, built to demonstrate the concept — not affiliated
with or endorsed by Netflix or any PM course provider.
