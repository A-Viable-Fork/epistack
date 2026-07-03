// Role: the environment domain store for the eggs case (Prompt 20), ingested from the farming and the
//   regenerative documents. Per-unit measurements (emissions, land, welfare, antibiotics, runoff, soil,
//   biodiversity) ground to the measurement floor; cross-cutting trade-offs rest in the forum. The
//   regenerative soil-carbon claims are authored as CHARACTERIZED GAPS: each is a transfer from a
//   system that is not a regenerative laying-hen operation, so it earns only the grade its transfer
//   support delivers and carries a closing condition naming the one measurement that would ground it.
// Contract: exports ENVIRONMENT = { store_id, claims:[spec], links:[spec] }. Pure data; imports nothing.
// Invariant: where the two documents overlap on regenerative claims, the regenerative (axis-clean)
//   document wins: the soil-carbon claims enter as characterized gaps sourced to the axis-clean
//   measurement they transfer from, and the farming document's contested regenerative-carbon line is
//   dropped, its measured proxy redirected to the specific grazing/litter system it actually measured.
"use strict";

const chk = (checker, method_class, method) => ([{ checker_id: checker, method_class, method: method || "measured", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);

const claims = [
  // ---- per-unit measurements (measurement floor) ----
  { ref: "e.ghg", kind: "measurement", declared_grade: "checked", source_id: "src:leinonen-2012", contributor_id: "lca:leinonen",
    statement: "eggs.environment: conventional caged eggs emit less GHG per kg than free-range or organic (cage 2.92 vs free-range 3.38 vs organic 3.42 kg CO2-eq/kg), the feed-conversion advantage driving it", checking_records: chk("wiedemann-2011", "data-audit", "independent egg LCA") },
  { ref: "e.land", kind: "measurement", declared_grade: "checked", source_id: "src:wur-eggs", contributor_id: "lca:wur",
    statement: "eggs.environment: pasture and organic egg systems require more land per kg than caged (organic 4.9 to 16.9 vs caged 2.82 to 6.3 m2/kg), up to about 2.7 times more", checking_records: chk("devries-2010", "data-audit", "independent land-use LCA") },
  { ref: "e.welfare", kind: "measurement", declared_grade: "checked", source_id: "src:efsa-2023", contributor_id: "welfare:efsa",
    statement: "eggs.environment: cage systems restrict foraging, dustbathing, and wing-flapping relative to cage-free systems, EFSA concluding the cage should not be used", checking_records: chk("ciwf-2024", "direct-measurement", "behavioural observation") },
  { ref: "e.keel", kind: "measurement", declared_grade: "checked", source_id: "src:thofner-2021", contributor_id: "welfare:thofner",
    statement: "eggs.environment: keel-bone fractures are ubiquitous across all commercial laying-hen housing (50 to 100 percent by necropsy), the housing ranking confounded by assessment method", checking_records: chk("rufener-2020", "data-audit", "large-scale necropsy") },
  { ref: "e.antibiotics", kind: "measurement", declared_grade: "checked", source_id: "src:ager-2023", contributor_id: "amr:ager",
    statement: "eggs.environment: confined systems use more antibiotics and carry higher antimicrobial resistance than organic (AMR prevalence 28 vs 18 percent), the least-contested advantage of extensive systems", checking_records: chk("rahman-2025", "data-audit", "independent AMR meta-analysis") },
  { ref: "e.soil-health", kind: "measurement", declared_grade: "checked", source_id: "src:panagos-2024", contributor_id: "soil:panagos",
    statement: "eggs.environment: perennial pasture outperforms annual feed cropland on soil-health metrics (aggregate stability, bulk density, infiltration), well-managed grazing required", checking_records: chk("franzluebbers-2024", "data-audit", "continental-scale soil survey") },
  { ref: "e.biodiversity", kind: "measurement", declared_grade: "checked", source_id: "src:outhwaite-2022", contributor_id: "bio:outhwaite",
    statement: "eggs.environment: diverse pasture and organic systems support higher species richness per hectare than intensive feed monoculture, high-intensity agriculture cutting insect abundance about 49 percent", checking_records: chk("tuck-2014", "data-audit", "global biodiversity meta-analysis") },
  { ref: "e.runoff", kind: "measurement", declared_grade: "checked", source_id: "src:epa-2011", contributor_id: "water:epa",
    statement: "eggs.environment: concentrated confined manure drives nitrate leaching, groundwater under lagoons reaching 64 to 167 mg/L against a 10 mg/L standard", checking_records: chk("baram-2014", "direct-measurement", "aquifer nitrate sampling") },

  // ---- cross-cutting trade-offs (forum) ----
  { ref: "e.trilemma", kind: "forum", declared_grade: "asserted", source_id: "src:van-wagenberg-2017", contributor_id: "review:vanwagenberg",
    statement: "eggs.environment: the emissions-land-welfare trilemma has no dominant solution, intensive systems winning per-kg emissions and land while extensive systems win welfare and per-hectare soil and biodiversity" },
  { ref: "e.water-metric", kind: "forum", declared_grade: "asserted", source_id: "src:mekonnen-2012", contributor_id: "review:mekonnen",
    statement: "eggs.environment: whether the total water footprint favors confined or pasture systems depends on the water metric chosen, blue-plus-gray favoring grazing and total favoring intensive" },
  { ref: "e.scale", kind: "forum", declared_grade: "asserted", source_id: "src:leip-2015", contributor_id: "review:leip",
    statement: "eggs.environment: a farm-scale assessment may favor pasture while a global-scale assessment favors intensification, since regenerative benefits are local and costs are often global" },

  // ---- the transfer sources: real measurements on related but different systems ----
  { ref: "e.pasture-soc-proxy", kind: "measurement", declared_grade: "checked", source_id: "src:raposo-2025", contributor_id: "soc:raposo",
    statement: "eggs.environment: improved grazing and dairy pasture sequesters soil carbon at about 0.84 to 1.05 t C/ha/yr (IPCC Tier 1, 7,092 agricultural sites)", checking_records: chk("ipcc-tier1", "data-audit", "IPCC Tier 1 synthesis") },
  { ref: "e.litter-corn-proxy", kind: "measurement", declared_grade: "checked", source_id: "src:yang-2019", contributor_id: "soc:yang",
    statement: "eggs.environment: poultry-litter application to corn cropland retains about 41 percent of applied carbon, adding roughly 1.88 t C/ha/yr over three years", checking_records: chk("yang-audit", "data-audit", "field carbon accounting") },

  // ---- the regenerative soil-carbon claims, as characterized gaps (the axis-clean document wins) ----
  { ref: "e.regen-soc", kind: "measurement", declared_grade: "supported", source_id: "src:axis-r48610", contributor_id: "regen:soc-leap",
    statement: "eggs.environment: a regenerative laying-hen pasture sequesters soil carbon at roughly 0.8 to 1.05 t C/ha/yr, provisionally, transferred from grazing and dairy pasture with no direct laying-hen measurement",
    closing_condition: { condition_kind: "measurement-on-the-system", target: "a direct multi-year soil-organic-carbon measurement under laying hens on pasture", system: "a regenerative laying-hen operation" } },
  { ref: "e.regen-litter", kind: "measurement", declared_grade: "supported", source_id: "src:soares-2022", contributor_id: "regen:litter-leap",
    statement: "eggs.environment: integrating laying hens on pasture builds stable soil carbon at the litter-retention rate, provisionally, transferred from poultry litter measured on corn cropland, not pasture",
    closing_condition: { condition_kind: "direct-study", target: "a direct soil-carbon study of laying-hen integration on pasture rather than litter applied to corn", system: "a pasture-integrated laying-hen operation" } },

  // ---- a bare advocacy assertion, for contrast with the characterized gaps ----
  { ref: "e.regen-advocacy", kind: "measurement", declared_grade: "asserted", source_id: "src:savory-advocacy", contributor_id: "regen:advocacy",
    statement: "eggs.environment: regenerative grazing sequesters 2.5 to 9 t C/ha/yr, an advocacy figure 7 to 70 times the measured meta-analytic rate, with no supporting measurement or closing condition" },
];

const links = [
  // the transfer that carries each leap: an ordinary supports edge whose grade caps the claim below
  // its measurement floor, so the regenerative claim earns only what the cross-system transfer delivers.
  { link_kind: "supports", from: "e.pasture-soc-proxy", to: "e.regen-soc", support_group: "g:soc-transfer", source_id: "src:raposo-2025", contributor_id: "soc:raposo", declared_grade: "supported" },
  { link_kind: "supports", from: "e.litter-corn-proxy", to: "e.regen-litter", support_group: "g:litter-transfer", source_id: "src:yang-2019", contributor_id: "soc:yang", declared_grade: "supported" },
];

module.exports = { ENVIRONMENT: { store_id: "S-environment", claims, links } };
