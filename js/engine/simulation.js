/**
 * Generic simulation engine: given a case definition (see js/cases/*.js)
 * and a chosen combo of decisions (one option id per decision point),
 * projects subscribers + revenue forward quarter by quarter.
 *
 * The engine only knows the *shape* of a case (startingState, model,
 * decisionPoints, actualOutcome) — nothing here is Netflix-specific, so a
 * new case with a different number of decision points still works as long
 * as it defines the same model fields its options rely on.
 */
function findOption(caseDef, decisionId, optionId) {
  const decision = caseDef.decisionPoints.find((d) => d.id === decisionId);
  const option = decision.options.find((o) => o.id === optionId);
  return option;
}

function runSimulation(caseDef, combo) {
  const enforcement = findOption(caseDef, "enforcement", combo.enforcement);
  const pricing = findOption(caseDef, "pricing", combo.pricing);

  const { organicGrowthRate, baseArpuGrowthRate, maxBoostM } = caseDef.model;
  const quarters = caseDef.quarterLabels.length;

  // Pricing only has an effect if enforcement is actually happening — both
  // the subscriber boost and the ARPU bonus from the pricing choice are
  // scaled by enforcement's effectiveness.
  const boostSchedule = maxBoostM.map(
    (b) => b * enforcement.effectiveness * pricing.conversionYield
  );
  const arpuGrowthRate =
    baseArpuGrowthRate + enforcement.effectiveness * pricing.arpuBonus;

  const subscribersM = new Array(quarters);
  const revenueM = new Array(quarters);
  let arpu = caseDef.startingState.quarterlyRevenueM / caseDef.startingState.subscribersM;

  subscribersM[0] = caseDef.startingState.subscribersM;
  revenueM[0] = caseDef.startingState.quarterlyRevenueM;

  for (let q = 1; q < quarters; q++) {
    subscribersM[q] = subscribersM[q - 1] * (1 + organicGrowthRate) + boostSchedule[q];
    arpu = arpu * (1 + arpuGrowthRate);
    revenueM[q] = subscribersM[q] * arpu;
  }

  return {
    combo,
    quarterLabels: caseDef.quarterLabels,
    subscribersM: subscribersM.map((v) => Math.round(v * 10) / 10),
    revenueM: revenueM.map((v) => Math.round(v)),
  };
}

function isActualCombo(caseDef, combo) {
  const actual = caseDef.actualOutcome.combo;
  return combo.enforcement === actual.enforcement && combo.pricing === actual.pricing;
}
