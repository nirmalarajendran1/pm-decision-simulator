(function () {
  const caseDef = NETFLIX_PASSWORD_SHARING_CASE;
  const state = { enforcement: null, pricing: null };

  function findOptionLocal(decisionId, optionId) {
    const decision = caseDef.decisionPoints.find((d) => d.id === decisionId);
    return decision.options.find((o) => o.id === optionId);
  }

  function renderBackground() {
    const el = document.getElementById("case-background");
    el.innerHTML = `
      <h2>${caseDef.title}</h2>
      ${caseDef.background.map((p) => `<p>${p}</p>`).join("")}
    `;
  }

  function renderSources() {
    const el = document.getElementById("sources");
    el.innerHTML = `
      <h3>Sources</h3>
      <ul class="source-list">
        ${caseDef.sourceLinks
          .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`)
          .join("")}
      </ul>
    `;
  }

  function optionCardHtml(decisionId, option, selectedId) {
    return `
      <button class="option-card${option.id === selectedId ? " selected" : ""}" data-decision="${decisionId}" data-option="${option.id}">
        <strong>${option.label}</strong>
        <p>${option.description}</p>
      </button>`;
  }

  function renderStep(decision, selectedId, stepNumber) {
    return `
      <div class="decision-step">
        <div class="step-label">${decision.stepLabel}</div>
        <h2>${decision.prompt}</h2>
        <div class="option-list">
          ${decision.options.map((o) => optionCardHtml(decision.id, o, selectedId)).join("")}
        </div>
      </div>`;
  }

  function renderDecisionPoints() {
    const el = document.getElementById("decision-point");
    const [step1, step2] = caseDef.decisionPoints;

    let html = renderStep(step1, state.enforcement, 1);
    if (state.enforcement) {
      html += renderStep(step2, state.pricing, 2);
    }
    el.innerHTML = html;

    el.querySelectorAll(".option-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const decisionId = btn.getAttribute("data-decision");
        const optionId = btn.getAttribute("data-option");
        state[decisionId] = optionId;
        if (decisionId === "enforcement") {
          state.pricing = null; // changing decision 1 resets decision 2
          document.getElementById("results").classList.add("hidden");
        }
        renderDecisionPoints();
        if (state.enforcement && state.pricing) {
          showResults();
        } else {
          document.getElementById(decisionId === "enforcement" ? "decision-point" : "results")
            .scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  function formatDelta(simValue, actualValue, unit) {
    const diff = simValue - actualValue;
    const sign = diff >= 0 ? "+" : "-";
    return `${sign}${unit}${Math.abs(diff).toFixed(1)}`;
  }

  function renderStats(simResult) {
    const el = document.getElementById("stat-row");
    const lastQ = simResult.subscribersM.length - 1;
    const subs = simResult.subscribersM[lastQ];
    const rev = simResult.revenueM[lastQ];
    const actualSubs = caseDef.actualOutcome.subscribersM[lastQ];
    const actualRev = caseDef.actualOutcome.quarterlyRevenueM[lastQ];
    const actual = isActualCombo(caseDef, simResult.combo);

    el.innerHTML = `
      <div class="stat">
        <div class="label">Subscribers, ${caseDef.quarterLabels[lastQ]}</div>
        <div class="value">${subs}M</div>
      </div>
      <div class="stat">
        <div class="label">Quarterly revenue, ${caseDef.quarterLabels[lastQ]}</div>
        <div class="value">$${rev}M</div>
      </div>
      ${
        actual
          ? ""
          : `<div class="stat">
              <div class="label">vs. what actually happened</div>
              <div class="value">${formatDelta(subs, actualSubs, "")}M subs / ${formatDelta(rev, actualRev, "$")}M rev</div>
            </div>`
      }
    `;
  }

  function showResults() {
    const enforcementOpt = findOptionLocal("enforcement", state.enforcement);
    const pricingOpt = findOptionLocal("pricing", state.pricing);
    const simResult = runSimulation(caseDef, { enforcement: state.enforcement, pricing: state.pricing });
    const overlayToggle = document.getElementById("overlayToggle");
    const actual = isActualCombo(caseDef, simResult.combo);

    document.getElementById("results").classList.remove("hidden");

    const pricingNote = enforcementOpt.effectiveness === 0
      ? "Since enforcement never happened, the pricing choice barely moves anything — there's nothing to price."
      : pricingOpt.narrative;

    document.getElementById("results-narrative").innerHTML = `
      <p>${enforcementOpt.narrative}</p>
      <p>${pricingNote}</p>
      ${actual ? '<p><strong>This is the exact combination Netflix chose.</strong></p>' : ""}
    `;

    renderStats(simResult);
    renderCharts(caseDef, simResult, overlayToggle.checked);

    overlayToggle.onchange = () => {
      renderCharts(caseDef, simResult, overlayToggle.checked);
    };

    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  renderBackground();
  renderSources();
  renderDecisionPoints();
})();
