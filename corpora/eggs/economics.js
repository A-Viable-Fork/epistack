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

  // ==== deep-research merge: the supply-system cost structure, welfare mandates, and HPAI shocks ====
  // the reports are same-party research passes, so their measurements land at the grade the gate prices
  // without checking records, the honesty carried in a statement parenthetical.
  { ref: "ec.feed-share", kind: "measurement", declared_grade: "asserted", source_id: "src:usda-ers-poultry", contributor_id: "ers:feed",
    statement: "eggs.economics: feed is more than 60 percent of egg production cost, so a $10 per ton rise in corn shifts production cost about 0.45 cents per dozen and a $10 per ton rise in soybean meal about 0.35 cents per dozen (same-party research pass, no distinct-party replication)" },
  { ref: "ec.welfare-cost", kind: "measurement", declared_grade: "asserted", source_id: "src:matthews-sumner-2015", contributor_id: "econ:matthews-sumner",
    statement: "eggs.economics: relative to conventional cages, enriched cages carry about 13 percent higher total cost and cage-free aviary systems about 36 percent higher total cost, driven heavily by pullet and labor costs (same-party research pass, no distinct-party replication)" },
  { ref: "ec.prop12", kind: "measurement", declared_grade: "asserted", source_id: "src:prop12", contributor_id: "econ:prop12",
    statement: "eggs.economics: after California Proposition 12, the retail premium rose by about $0.25 to $0.73 per dozen with an estimated annual consumer-surplus loss of $223 to $664 million, the direct pass-through of a welfare mandate to price (same-party research pass, no distinct-party replication)" },
  { ref: "ec.hpai-shock", kind: "measurement", declared_grade: "asserted", source_id: "src:usda-ers-poultry", contributor_id: "ers:hpai",
    statement: "eggs.economics: highly pathogenic avian influenza forces immediate flock depopulation, and with a roughly six-month biological lag to rebuild layer inventory the short-run supply is inelastic, so retail prices peaked at $4.82 per dozen in January 2023 (same-party research pass, no distinct-party replication)" },
  { ref: "ec.demand-elasticity", kind: "measurement", declared_grade: "asserted", source_id: "src:caputo-2023", contributor_id: "econ:caputo",
    statement: "eggs.economics: the own-price elasticity of demand is about -0.321 for conventional eggs and -1.065 for cage-free eggs, so conventional demand is inelastic (a price shock is largely borne by consumers) while cage-free demand is elastic (same-party research pass, no distinct-party replication)" },
  { ref: "ec.protein-cost-inversion", kind: "measurement", declared_grade: "asserted", source_id: "src:usda-ers-poultry", contributor_id: "ers:protein-cost",
    statement: "eggs.economics: under the HPAI shock eggs lost their status as the cheapest complete protein, rising from about 3.0 to 6.4 cents per gram of protein, so the highest-quality common protein (hard-boiled DIAAS about 1.13) became one of the most expensive by retail price per gram (same-party research pass, no distinct-party replication)" },
  // the report's central normative claim, at the forum floor, supported by the measurement claims above.
  { ref: "ec.distributional", kind: "forum", declared_grade: "asserted", source_id: "src:usda-ers-poultry", contributor_id: "value:distributional",
    statement: "eggs.economics: because a price shock on an inelastic staple falls hardest on low-income households, a welfare mandate that raises the floor price of complete protein trades animal welfare against food security, a distributional value choice no measurement settles" },

  // ---- three characterized gaps the economics report names, each floor with a closing condition ----
  { ref: "ec.gap-mandate-elasticity", kind: "measurement", declared_grade: "asserted", source_id: "src:matthews-sumner-2015", contributor_id: "gap:mandate-elasticity",
    statement: "eggs.economics: the long-run supply elasticity under a permanent nationwide cage-free mandate is unmeasured, so whether the Prop-12-style premium persists or erodes as producers amortize conversion is not settled",
    closing_condition: { condition_kind: "direct-study", target: "a long-run supply-elasticity estimate under a stabilized nationwide cage-free mandate", system: "the US shell-egg supply system" } },
  { ref: "ec.gap-snap-substitution", kind: "measurement", declared_grade: "asserted", source_id: "src:usda-ers-poultry", contributor_id: "gap:snap-substitution",
    statement: "eggs.economics: how SNAP and low-income households substitute away from eggs toward other complete proteins during a price shock is not disaggregated, so the welfare incidence of an egg shock on food-assistance households is unmeasured",
    closing_condition: { condition_kind: "direct-study", target: "a disaggregated study of SNAP-household protein substitution during an egg price shock", system: "SNAP-participating households" } },
  { ref: "ec.gap-hpai-capital", kind: "measurement", declared_grade: "asserted", source_id: "src:usda-ers-poultry", contributor_id: "gap:hpai-capital",
    statement: "eggs.economics: whether repeated HPAI depopulation drives long-run capital flight from the layer sector, raising the equilibrium price beyond the short-run shock, is unmeasured",
    closing_condition: { condition_kind: "direct-study", target: "a study of long-run capital investment and exit in the layer sector across repeated HPAI cycles", system: "the US layer-production sector" } },
];

const links = [
  // the price-shock measurements ground the distributional weighing, each in its own group so convergence is visible.
  { link_kind: "supports", from: "ec.protein-cost-inversion", to: "ec.distributional", support_group: "g:protein-cost", source_id: "src:usda-ers-poultry", contributor_id: "ers:protein-cost", declared_grade: "asserted" },
  { link_kind: "supports", from: "ec.demand-elasticity", to: "ec.distributional", support_group: "g:elasticity", source_id: "src:caputo-2023", contributor_id: "econ:caputo", declared_grade: "asserted" },
  { link_kind: "supports", from: "ec.welfare-cost", to: "ec.distributional", support_group: "g:welfare-cost", source_id: "src:matthews-sumner-2015", contributor_id: "econ:matthews-sumner", declared_grade: "asserted" },
  // Prop 12 is the concrete instance of the welfare-cost pass-through.
  { link_kind: "supports", from: "ec.prop12", to: "ec.welfare-cost", support_group: "g:prop12", source_id: "src:prop12", contributor_id: "econ:prop12", declared_grade: "asserted" },
  // feed share and the HPAI shock refine the base production-cost measurement.
  { link_kind: "refines", from: "ec.feed-share", to: "ec.cost", source_id: "src:usda-ers-poultry", contributor_id: "ers:feed", declared_grade: "asserted" },
  { link_kind: "refines", from: "ec.hpai-shock", to: "ec.cost", source_id: "src:usda-ers-poultry", contributor_id: "ers:hpai", declared_grade: "asserted" },
];

module.exports = { ECONOMICS: { store_id: "S-economics", claims, links } };
