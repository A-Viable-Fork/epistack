// Role: the nutrition domain store for the eggs case (Prompt 20). The dietary-cholesterol and lipid
//   claims and the responder-heterogeneity claims ground to the measurement floor; the guidelines
//   claims rest in the forum; the cardiovascular block is authored as the contested structure it is:
//   a population null and a population harm claim joined by a contradicts link, agreeing only in the
//   diabetic subgroup, so the diabetic-interaction claim grounds while the population claims stay in
//   tension. Each claim carries its provenance (source_id into corpora/eggs/tables.js).
// Contract: exports NUTRITION = { store_id, claims:[spec], links:[spec] }; claim/link specs use local
//   refs, resolved to identities by build/check-eggs.mjs. Pure data; corpora imports nothing.
// Invariant: a claim's declared_grade is what the document's stated mode supports; the gate computes
//   the earned grade, and where they conflict the oracle reports it rather than forcing the grade.
"use strict";

// a distinct-party checking record: the independent replication/audit that lifts a measurement claim
// to its own floor. checked_at_state is a label; the gate reads independence and method_class.
const chk = (checker, method_class, method) => ([{ checker_id: checker, method_class, method: method || "audited", checked_at_state: "genesis", outcome: "confirms", independence: "distinct-party" }]);

const claims = [
  // ---- Topic 1: dietary cholesterol and serum lipids (measurement floor) ----
  { ref: "n.chol-serum", kind: "measurement", declared_grade: "checked", source_id: "src:weggemans-2001", contributor_id: "meta:weggemans",
    statement: "eggs.nutrition: each 100 mg/day of dietary cholesterol raises serum total cholesterol by about 2.2 mg/dL (meta-analyses of controlled feeding trials)", checking_records: chk("howell-1997", "replication", "independent meta-analysis") },
  { ref: "n.nonlinear", kind: "measurement", declared_grade: "checked", source_id: "src:hopkins-1992", contributor_id: "meta:hopkins",
    statement: "eggs.nutrition: the dietary-cholesterol serum response is nonlinear with diminishing returns, little further change above about 400 to 500 mg/day baseline", checking_records: chk("hegsted-1986", "replication", "independent meta-analytic model") },
  { ref: "n.ratio", kind: "measurement", declared_grade: "checked", source_id: "src:berger-2015", contributor_id: "meta:berger",
    statement: "eggs.nutrition: the LDL-C rise from dietary cholesterol is partly offset by an HDL-C rise, so the LDL:HDL ratio changes negligibly (about +0.02 units per 100 mg/day)", checking_records: chk("weggemans-2001", "replication", "independent meta-analysis") },
  { ref: "n.metsyn-rct", kind: "measurement", declared_grade: "checked", source_id: "src:blesso-2013", contributor_id: "rct:blesso",
    statement: "eggs.nutrition: in RCTs, whole eggs in metabolic-syndrome or type-2-diabetes populations do not raise LDL-C or total cholesterol and may raise HDL-C", checking_records: chk("fuller-2015", "replication", "independent RCT (DIABEGG)") },
  // ---- Topic 4.1: nutritional content (measurement floor) ----
  { ref: "n.content", kind: "measurement", declared_grade: "checked", source_id: "src:usda-fdc", contributor_id: "dataset:usda",
    statement: "eggs.nutrition: one 50 g whole egg contains about 72 kcal, 6.3 g high-quality protein, 186 mg cholesterol, and choline plus B12, riboflavin, selenium, and lutein", checking_records: chk("rehault-2019", "direct-measurement", "analytical food composition") },
  // ---- Topic 3: responder heterogeneity (measurement floor) ----
  { ref: "n.unimodal", kind: "measurement", declared_grade: "checked", source_id: "src:griffin-2021", contributor_id: "meta:griffin",
    statement: "eggs.nutrition: the serum-cholesterol response to dietary cholesterol is continuous and unimodal, so hyper- and hypo-responder are cutpoints on a spectrum, not distinct biological subgroups", checking_records: chk("katan-1988", "replication", "independent metabolic-ward studies") },
  { ref: "n.responder-var", kind: "measurement", declared_grade: "checked", source_id: "src:katan-1986", contributor_id: "meta:katan",
    statement: "eggs.nutrition: the between-person SD of cholesterol responsiveness is about 0.29 mmol/L, roughly half the mean, and within-person variation is as large, so one dietary challenge cannot classify an individual", checking_records: chk("beynen-1985", "replication", "repeated metabolic-ward challenge") },
  { ref: "n.heritable", kind: "measurement", declared_grade: "checked", source_id: "src:williams-2005", contributor_id: "twin:williams",
    statement: "eggs.nutrition: the LDL-C response to dietary cholesterol is moderately heritable (h2 about 0.59), with identical-twin correlation r about 0.70", checking_records: chk("goode-2007", "data-audit", "independent twin cohort") },
  { ref: "n.individual-unknown", kind: "forum", declared_grade: "asserted", source_id: "src:katan-1986", contributor_id: "inference:individual",
    statement: "eggs.nutrition: whether an individual's cholesterol response to eggs predicts their own CVD risk is unknown, an inference from population variance, never directly tested" },

  // ---- Topic 2: cardiovascular outcomes, the contested block ----
  // the population null and the population harm claim, in tension: both forum, neither at a floor.
  { ref: "n.cv-null", kind: "forum", declared_grade: "asserted", source_id: "src:drouin-2020", contributor_id: "cohort:drouin",
    statement: "eggs.nutrition: at up to one egg per day, egg consumption is not associated with incident cardiovascular disease in large US cohorts (pooled HR 0.93)" },
  { ref: "n.cv-harm", kind: "forum", declared_grade: "asserted", source_id: "src:tran-2022", contributor_id: "cohort:tran",
    statement: "eggs.nutrition: higher dietary cholesterol is associated with higher CVD mortality (HR 1.13 per +300 mg/day), and the egg-CVD association attenuates after adjusting for dietary cholesterol" },
  // the subgroup where the observational lines converge: the diabetic-interaction claim grounds.
  { ref: "n.cv-diab-godos", kind: "measurement", declared_grade: "checked", source_id: "src:godos-2021", contributor_id: "meta:godos",
    statement: "eggs.nutrition: in the diabetic subgroup, egg consumption carries a CVD SRR of 1.22 (1.08 to 1.39) at one egg per day (Godos 2021 dose-response meta-analysis)", checking_records: chk("godos-audit", "data-audit", "subgroup meta-analysis") },
  { ref: "n.cv-diab-shin", kind: "measurement", declared_grade: "checked", source_id: "src:shin-2013", contributor_id: "meta:shin",
    statement: "eggs.nutrition: in diabetics, the pooled CVD HR is 1.69 (1.09 to 2.62) for the highest versus lowest egg intake (Shin 2013 meta-analysis)", checking_records: chk("shin-audit", "data-audit", "subgroup meta-analysis") },
  { ref: "n.cv-diabetic", kind: "forum", declared_grade: "corroborated", source_id: "src:godos-2021", contributor_id: "inference:diabetic-interaction",
    statement: "eggs.nutrition: in diabetic individuals the egg-CVD association is inverted toward harm, the one place the observational lines agree while the population-level estimate stays in tension" },

  // ---- Topic 4: guidelines history (forum) ----
  { ref: "n.guidelines", kind: "forum", declared_grade: "asserted", source_id: "src:dga-2015", contributor_id: "policy:dga",
    statement: "eggs.nutrition: the 2015-2020 US Dietary Guidelines removed the 300 mg/day dietary-cholesterol limit, while the final policy still urged eating as little dietary cholesterol as practical" },
  { ref: "n.aha", kind: "forum", declared_grade: "asserted", source_id: "src:aha-2020", contributor_id: "policy:aha",
    statement: "eggs.nutrition: the AHA 2020 advisory allows up to one egg per day for healthy adults and two for older normocholesterolemic patients, with caution in dyslipidemia, diabetes, or heart-failure risk" },
];

const links = [
  // the cardiovascular contradiction: the population null and the population harm stand in tension.
  { link_kind: "contradicts", from: "n.cv-null", to: "n.cv-harm", source_id: "src:drouin-2020", contributor_id: "cohort:drouin", declared_grade: "asserted" },
  // the diabetic-interaction claim grounds on two disjoint observational subgroup analyses (independence lift).
  { link_kind: "supports", from: "n.cv-diab-godos", to: "n.cv-diabetic", support_group: "g:godos", source_id: "src:godos-2021", contributor_id: "meta:godos", declared_grade: "supported" },
  { link_kind: "supports", from: "n.cv-diab-shin", to: "n.cv-diabetic", support_group: "g:shin", source_id: "src:shin-2013", contributor_id: "meta:shin", declared_grade: "supported" },
];

module.exports = { NUTRITION: { store_id: "S-nutrition", claims, links } };
