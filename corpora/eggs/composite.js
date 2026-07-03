// Role: the eggs composite store (Prompt 20). It cites domain claims across the boundary and carries
//   the cross-domain weighings, whether to eat eggs and which farming system is better, each composing
//   claims from more than one domain and therefore sitting at the structured-forum ceiling. The
//   denominator framing record (product-throughput against net-capital) names the alternatives; each
//   per-unit farming measurement carries a presupposition edge up to it, so the measurement keeps its
//   floor grade while the unit choice becomes visible and swappable.
// Contract: exports COMPOSITE = { store_id, terms, weighings, framing, successor, presupposes }.
//   Citations are named by (store, claim ref, term); build/check-eggs.mjs resolves refs to identities,
//   copies each domain grade across the boundary, and computes the composite grades. Pure data.
// Invariant: a weighing is no more grounded than its weakest necessary citation, and its ceiling is
//   structured-forum because the quantities it weighs share no unit. The denominator swap reframes the
//   weighings while every cited per-unit measurement keeps the grade its own floor gave it.
"use strict";

// the shared vocabulary: units and quantity-types held once at the layer, referenced by identity.
const terms = [
  { term_id: "T-health", kind: "quantity-type", name: "cardiovascular-risk outcome", definition: "incident cardiovascular disease risk from egg consumption", version: "1" },
  { term_id: "T-co2", kind: "unit", name: "kg CO2-equivalent per kg egg", definition: "greenhouse-gas emissions per kilogram of egg product", version: "1" },
  { term_id: "T-land", kind: "unit", name: "square metres per kg egg", definition: "land occupied per kilogram of egg product", version: "1" },
  { term_id: "T-welfare", kind: "quantity-type", name: "hen welfare", definition: "behavioural and health welfare of the laying hen", version: "1" },
  { term_id: "T-dollar", kind: "unit", name: "US dollars per dozen", definition: "production cost per dozen eggs", version: "1" },
  { term_id: "T-soil", kind: "unit", name: "t C per hectare per year", definition: "soil-organic-carbon sequestration rate on the production land", version: "1" },
];

// the two cross-domain weighings. Each cites domain claims by (store, claim ref, term); the citation's
// role decides whether it enters the grade. A weighing spans more than one domain, so its cited terms
// differ and its ceiling is structured-forum.
const weighings = [
  {
    ref: "w.eat", statement: "eggs.composite: whether to eat eggs, weighing the cardiovascular evidence against hen welfare and environmental cost",
    weighting: { kind: "priority", ordering: ["S-nutrition/n.cv-diabetic", "S-environment/e.welfare", "S-environment/e.ghg"], rationale: "a stated value choice: personal health weighed first, then animal welfare, then climate; it measures nothing" },
    cites: [
      { store: "S-nutrition", claim: "n.cv-diabetic", term: "T-health", role: "necessary" },
      { store: "S-environment", claim: "e.welfare", term: "T-welfare", role: "necessary" },
      { store: "S-environment", claim: "e.ghg", term: "T-co2", role: "corroborating" },
    ],
  },
  {
    ref: "w.system", statement: "eggs.composite: which farming system is better, weighing emissions and land against welfare, cost, and regenerative soil carbon",
    weighting: { kind: "priority", ordering: ["S-environment/e.welfare", "S-environment/e.ghg", "S-economics/ec.cost", "S-environment/e.regen-soc"], rationale: "a stated value choice weighing welfare and soil against per-kg emissions and cost; the ranking is the value, not a measurement" },
    cites: [
      { store: "S-environment", claim: "e.ghg", term: "T-co2", role: "necessary" },
      { store: "S-environment", claim: "e.welfare", term: "T-welfare", role: "necessary" },
      { store: "S-economics", claim: "ec.cost", term: "T-dollar", role: "necessary" },
      { store: "S-environment", claim: "e.regen-soc", term: "T-soil", role: "necessary" },
    ],
  },
];

// the denominator framing record and its successor, and the per-unit farming measurements that
// presuppose it. Swapping product-throughput for net-capital reframes the weighings while every
// per-unit measurement keeps its floor grade (the presupposition edge is checked, never graded).
const framing = {
  framing_id: "F-throughput", status: "in-force",
  statement: "the denominator is product throughput: every impact is counted per kilogram of egg produced",
  alternatives: ["net capital: impacts counted per unit of soil and ecosystem stock maintained", "per hen housed", "per hectare farmed"],
};
const successor = {
  framing_id: "F-netcapital", status: "in-force",
  statement: "the denominator is net capital: every impact is counted per unit of soil and ecosystem stock maintained",
  alternatives: ["product throughput: impacts counted per kilogram of egg produced", "per hen housed", "per hectare farmed"],
};
const presupposes = [
  { store: "S-environment", claim: "e.ghg" },
  { store: "S-environment", claim: "e.land" },
  { store: "S-environment", claim: "e.runoff" },
  { store: "S-environment", claim: "e.soil-health" },
  { store: "S-environment", claim: "e.pasture-soc-proxy" },
];

module.exports = { COMPOSITE: { store_id: "C-eggs", terms, weighings, framing, successor, presupposes } };
