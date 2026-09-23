/**
 * Generic simulation engine: given a case definition (see js/cases/*.js)
 * and a chosen decision option, projects subscribers + revenue forward
 * quarter by quarter. Any case following the same shape can reuse this
 * unchanged — the model logic doesn't know anything about Netflix specifically.
 */
function runSimulation(caseDef, optionId) {
  const option = caseDef.decisionPoint.options.find((o) => o.id === optionId);
  if (!option) throw new Error(`Unknown option: ${optionId}`);

  const { organicGrowthRate, arpuGrowthRate, maxBoostM } = caseDef.model;
  const quarters = caseDef.quarterLabels.length;

  const subscribersM = new Array(quarters);
  const revenueM = new Array(quarters);
  let arpu =
    caseDef.startingState.quarterlyRevenueM / caseDef.startingState.subscribersM;

  subscribersM[0] = caseDef.startingState.subscribersM;
  revenueM[0] = caseDef.startingState.quarterlyRevenueM;

  for (let q = 1; q < quarters; q++) {
    const boost = option.effectiveness * maxBoostM[q];
    subscribersM[q] = subscribersM[q - 1] * (1 + organicGrowthRate) + boost;
    arpu = arpu * (1 + arpuGrowthRate);
    revenueM[q] = subscribersM[q] * arpu;
  }

  return {
    optionId,
    quarterLabels: caseDef.quarterLabels,
    subscribersM: subscribersM.map((v) => Math.round(v * 10) / 10),
    revenueM: revenueM.map((v) => Math.round(v)),
  };
}
