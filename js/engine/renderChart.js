/**
 * Thin wrapper around Chart.js: renders a metric time series for the chosen
 * option, with an optional dashed overlay of the real reported outcome.
 */
let subscribersChart = null;
let revenueChart = null;

function buildDatasets(caseDef, simResult, showActualOverlay) {
  const chosenOption = caseDef.decisionPoint.options.find(
    (o) => o.id === simResult.optionId
  );

  const subscribersDatasets = [
    {
      label: `${chosenOption.label.split(" — ")[0]} (simulated)`,
      data: simResult.subscribersM,
      borderColor: "#2563eb",
      backgroundColor: "rgba(37, 99, 235, 0.12)",
      tension: 0.25,
      fill: true,
    },
  ];
  const revenueDatasets = [
    {
      label: `${chosenOption.label.split(" — ")[0]} (simulated)`,
      data: simResult.revenueM,
      borderColor: "#0891b2",
      backgroundColor: "rgba(8, 145, 178, 0.12)",
      tension: 0.25,
      fill: true,
    },
  ];

  if (showActualOverlay && simResult.optionId !== caseDef.actualOutcome.optionId) {
    subscribersDatasets.push({
      label: "What actually happened",
      data: caseDef.actualOutcome.subscribersM,
      borderColor: "#111827",
      borderDash: [6, 4],
      backgroundColor: "transparent",
      tension: 0.25,
      fill: false,
    });
    revenueDatasets.push({
      label: "What actually happened",
      data: caseDef.actualOutcome.quarterlyRevenueM,
      borderColor: "#111827",
      borderDash: [6, 4],
      backgroundColor: "transparent",
      tension: 0.25,
      fill: false,
    });
  }

  return { subscribersDatasets, revenueDatasets };
}

function renderCharts(caseDef, simResult, showActualOverlay) {
  const { subscribersDatasets, revenueDatasets } = buildDatasets(
    caseDef,
    simResult,
    showActualOverlay
  );

  const commonOptions = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { position: "bottom" } },
    scales: { y: { beginAtZero: false } },
  };

  if (subscribersChart) subscribersChart.destroy();
  if (revenueChart) revenueChart.destroy();

  subscribersChart = new Chart(document.getElementById("subscribersChart"), {
    type: "line",
    data: { labels: caseDef.quarterLabels, datasets: subscribersDatasets },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: { display: true, text: "Paid subscribers (millions)" },
      },
    },
  });

  revenueChart = new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: { labels: caseDef.quarterLabels, datasets: revenueDatasets },
    options: {
      ...commonOptions,
      plugins: {
        ...commonOptions.plugins,
        title: { display: true, text: "Quarterly revenue ($M)" },
      },
    },
  });
}
