(function () {
  const caseDef = NETFLIX_PASSWORD_SHARING_CASE;

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

  function renderDecisionPoint(selectedOptionId) {
    const el = document.getElementById("decision-point");
    const { prompt, options } = caseDef.decisionPoint;
    el.innerHTML = `
      <h2>Your call</h2>
      <p>${prompt}</p>
      <div class="option-list">
        ${options
          .map(
            (o) => `
          <button class="option-card${o.id === selectedOptionId ? " selected" : ""}" data-option="${o.id}">
            <strong>${o.label}</strong>
            <p>${o.description}</p>
          </button>`
          )
          .join("")}
      </div>
    `;

    el.querySelectorAll(".option-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const optionId = btn.getAttribute("data-option");
        renderDecisionPoint(optionId);
        showResults(optionId);
      });
    });
  }

  function formatDelta(simValue, actualValue) {
    const diff = simValue - actualValue;
    const sign = diff >= 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}`;
  }

  function renderStats(option, simResult) {
    const el = document.getElementById("stat-row");
    const lastQ = simResult.subscribersM.length - 1;
    const subs = simResult.subscribersM[lastQ];
    const rev = simResult.revenueM[lastQ];
    const actualSubs = caseDef.actualOutcome.subscribersM[lastQ];
    const actualRev = caseDef.actualOutcome.quarterlyRevenueM[lastQ];

    const isActual = option.id === caseDef.actualOutcome.optionId;

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
        isActual
          ? ""
          : `<div class="stat">
              <div class="label">vs. what actually happened</div>
              <div class="value">${formatDelta(subs, actualSubs)}M subs / $${formatDelta(rev, actualRev)}M rev</div>
            </div>`
      }
    `;
  }

  function showResults(optionId) {
    const option = caseDef.decisionPoint.options.find((o) => o.id === optionId);
    const simResult = runSimulation(caseDef, optionId);
    const overlayToggle = document.getElementById("overlayToggle");

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("results-narrative").textContent = option.narrative;
    renderStats(option, simResult);
    renderCharts(caseDef, simResult, overlayToggle.checked);

    overlayToggle.onchange = () => {
      renderCharts(caseDef, simResult, overlayToggle.checked);
    };

    document.getElementById("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  renderBackground();
  renderSources();
  renderDecisionPoint(null);
})();
