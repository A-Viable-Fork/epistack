// Role: the small economics domain store for the eggs case, ingested from the net-energy
//   document. The cost-and-energy per-unit measurements (feed conversion, cumulative energy demand,
//   energy return, production cost) ground to the measurement floor; the commensuration choices (the
//   discount rate, the objective function) rest in the forum, since no measurement settles them.
// Contract: exports ECONOMICS = { store_id, claims:[spec], links:[spec] }. Pure data; imports nothing.
// Invariant: a cost is a measurement on its own system; which cost to weight against which benefit is
//   a value choice, held in the forum and carried into the composite weighings, never onto a floor.
"use strict";

const chk = (checker, method_class, method) => ([{ checker_id: checker, method_class, method: method || "measured", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);

const claims = [
  { ref: "ec.fcr", kind: "measurement", declared_grade: "checked", source_id: "src:wiedemann-2011", contributor_id: "lca:wiedemann",
    statement: "eggs.economics: feed conversion is about 1.95 to 2.20 kg feed/kg egg for caged systems against 2.5 to 5.3 for organic, feed being 76 to 91 percent of cumulative energy demand", checking_records: chk("leinonen-2012", "data-audit", "independent egg LCA") },
  { ref: "ec.ced", kind: "measurement", declared_grade: "checked", source_id: "src:syc-2022", contributor_id: "lca:syc",
    statement: "eggs.economics: cage non-renewable cumulative energy demand is about 10.7 to 16.9 MJ/kg egg against 20.3 to 26.4 for organic, a 50 to 100 percent premium driven by feed conversion", checking_records: chk("turner-2022", "data-audit", "independent egg LCA") },
  { ref: "ec.eroi", kind: "measurement", declared_grade: "checked", source_id: "src:pelletier-2016", contributor_id: "lca:pelletier",
    statement: "eggs.economics: both systems are net energy sinks, with an edible-to-input energy return of about 0.41 to 0.51 for caged and 0.27 to 0.42 for organic", checking_records: chk("pelletier-audit", "data-audit", "energy return accounting") },
  { ref: "ec.cost", kind: "measurement", declared_grade: "checked", source_id: "src:elson-costs", contributor_id: "cost:elson",
    statement: "eggs.economics: free-range organic eggs cost about twice as much to produce as caged (about $1.32 against $0.66 per dozen)", checking_records: chk("tserveni-audit", "data-audit", "production-cost accounting") },
  { ref: "ec.discount", kind: "forum", declared_grade: "asserted", source_id: "src:nordhaus-stern", contributor_id: "value:discount",
    statement: "eggs.economics: the intergenerational discount rate is a value choice, Stern's 1.4 percent against Nordhaus's 4.3 percent giving present values that differ about seventeen-fold" },
  { ref: "ec.objective", kind: "forum", declared_grade: "asserted", source_id: "src:franzese-2009", contributor_id: "value:objective",
    statement: "eggs.economics: which objective to maximize, energy return, economic welfare, biodiversity, or resilience, is itself contested and incommensurable, so no single netted verdict follows" },
];

module.exports = { ECONOMICS: { store_id: "S-economics", claims, links: [] } };
