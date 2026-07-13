// Role: the nutrition domain store for the eggs case. The dietary-cholesterol and lipid
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
  { ref: "n.individual-unknown", kind: "forum", declared_grade: "supported", source_id: "src:katan-1986", contributor_id: "inference:individual",
    statement: "eggs.nutrition: whether an individual's cholesterol response to eggs predicts their own CVD risk is unknown, an inference from population variance, never directly tested; the population mean does not transfer because the transfer bottoms out in absorption kinetics, synthesis feedback, and responder variance, not in a single effect size" },

  // ==== the three coupled subsystems, each grounding to its floor ====
  // ---- Cluster 1: choline and one-carbon metabolism (the settled benefit routing) ----
  { ref: "chol.adequacy", kind: "measurement", declared_grade: "checked", source_id: "src:wallace-2016", contributor_id: "nhanes:wallace",
    statement: "eggs.nutrition (choline): whole eggs are the densest common source of bioavailable phosphatidylcholine (one large egg ~147-169 mg), yet only ~10.8% of the US population meets the Adequate Intake (550 mg/day men, 425 women), so the AI is hard to reach without eggs", checking_records: chk("wallace-nhanes", "data-audit", "NHANES 2009-2014, n=16,809") },
  { ref: "chol.hepatic", kind: "measurement", declared_grade: "checked", source_id: "src:zeisel-2006", contributor_id: "mech:zeisel",
    statement: "eggs.nutrition (choline): choline is an obligatory component of the VLDL envelope, so it is required to export hepatic triglyceride; a defined choline-deficient diet (<50 mg/day) drives 77% of men and 80% of postmenopausal women into NAFLD or muscle damage within 3-5 weeks, reversibly", checking_records: chk("zeisel-ward", "replication", "metabolic-ward depletion-repletion") },
  { ref: "chol.neurodev", kind: "measurement", declared_grade: "checked", source_id: "src:caudill-2018", contributor_id: "rct:caudill",
    statement: "eggs.nutrition (choline): maternal choline supplementation in late pregnancy improves offspring sustained attention and processing speed into mid-childhood (Caudill 2018, 930 vs 480 mg/day; Bahnfleth 2022 7-year follow-up, p=0.02)", checking_records: chk("bahnfleth-followup", "replication", "double-blind RCT with 7-yr follow-up") },

  // ---- Cluster 2: metabolic regulation (protein quality settled; behavior the noisier layer) ----
  { ref: "prot.diaas", kind: "measurement", declared_grade: "checked", source_id: "src:fanelli-2024", contributor_id: "diaas:fanelli",
    statement: "eggs.nutrition (protein): the whole egg's Digestible Indispensable Amino Acid Score (true ileal, growing-pig model) exceeds 100 (~1.13) across boiled, fried, and scrambled, with no limiting amino acid above age 3, and additively rescues grain meals (toast DIAAS 25-31) to >75", checking_records: chk("fanelli-ileal", "direct-measurement", "ileal-cannulated pig DIAAS") },
  { ref: "prot.leucine", kind: "measurement", declared_grade: "checked", source_id: "src:layman-2003", contributor_id: "aa:layman",
    statement: "eggs.nutrition (protein): a 50 g egg provides ~543 mg leucine (~8.6% of its protein), above the mTORC1 threshold that drives muscle protein synthesis, unhindered by plant anti-nutrients, clinically salient against age-related anabolic resistance", checking_records: chk("aa-hydrolysis", "direct-measurement", "acid hydrolysis / chromatography") },
  { ref: "sat.hormone", kind: "measurement", declared_grade: "checked", source_id: "src:ratliff-2010", contributor_id: "endo:ratliff",
    statement: "eggs.nutrition (satiety): an egg breakfast suppresses the orexigenic hormone ghrelin (lower AUC) and raises the anorexigenic hormone PYY (e.g. p=0.0001 in adolescents), a direct measured endocrine shift", checking_records: chk("hormone-auc", "direct-measurement", "venous peptide AUC") },
  { ref: "sat.behavioral", kind: "forum", declared_grade: "asserted", source_id: "src:vanderwal-2005", contributor_id: "behav:vanderwal",
    statement: "eggs.nutrition (satiety): the behavioral layer is noisier than the hormonal one: an egg breakfast cuts next-meal intake ~164 kcal in overweight adults (Vander Wal 2005), but in adolescents the PYY surge fails to change intake at all (Liu 2015), so the endocrine signal does not reliably transfer to eating behavior" },
  { ref: "gly.load", kind: "measurement", declared_grade: "checked", source_id: "src:maki-2017", contributor_id: "gly:maki",
    statement: "eggs.nutrition (glycemic): the egg carries ~0.36 g carbohydrate, so its glycemic index and load are effectively zero; substituting egg protein and unsaturated fat for refined starch lowers HOMA-IR (p=0.028) in overweight adults", checking_records: chk("maki-homair", "replication", "randomized crossover, HOMA-IR") },
  { ref: "gly.hba1c", kind: "measurement", declared_grade: "checked", source_id: "src:fuller-2015", contributor_id: "diabegg:fuller",
    statement: "eggs.nutrition (glycemic): a high-egg diet (>=12/week) does not worsen long-term glycemic control versus a low-egg diet (<2/week) in prediabetes/T2D over 3-12 months (DIABEGG: no HbA1c, fasting glucose, or inflammation difference)", checking_records: chk("diabegg-hba1c", "replication", "RCT, HbA1c 12-month") },

  // ---- Cluster 3: the lipid mechanistic floor (grounds the population-to-individual refusal) ----
  { ref: "lip.absorption", kind: "measurement", declared_grade: "checked", source_id: "src:brown-yu-2010", contributor_id: "mech:absorption",
    statement: "eggs.nutrition (lipid floor): fractional cholesterol absorption is highly individual (20-80%, mean ~55%), governed by the opposing NPC1L1 uptake transporter (the ezetimibe target) and the ABCG5/ABCG8 efflux pump, independent of the absolute dietary load", checking_records: chk("sterol-balance", "replication", "sterol-balance / ezetimibe inhibition") },
  { ref: "lip.synthesis", kind: "measurement", declared_grade: "checked", source_id: "src:kratky-2018", contributor_id: "mech:synthesis",
    statement: "eggs.nutrition (lipid floor): increased dietary cholesterol compensatorily downregulates endogenous synthesis via SCAP-SREBP2 (HMG-CoA reductase suppression); endogenous synthesis (~70-80%, ~850 mg/day) buffers dietary intake (26-650 mg) in a graded fashion", checking_records: chk("srebp-feedback", "replication", "tracer / feeding studies") },
  { ref: "lip.responder", kind: "measurement", declared_grade: "checked", source_id: "src:herron-2006", contributor_id: "pheno:herron",
    statement: "eggs.nutrition (lipid floor): the population splits into ~66-75% hypo-responders (<0.05 mmol/L rise per 100 mg) and ~25-33% hyper-responders (>0.06 mmol/L), set by baseline synthesis, absorption efficiency, and APOE E4 (~13.7-20%); both keep the LDL:HDL ratio, so the variance is in magnitude, not ratio", checking_records: chk("responder-ward", "replication", "metabolic-ward responder classification") },

  // ==== fork 1: the choline good-versus-bad split, routed by the microbiome ====
  // the mechanism and matrix effect ground to the floor; whole eggs do not spike fasting TMAO.
  { ref: "tmao.pathway", kind: "measurement", declared_grade: "checked", source_id: "src:wilcox-2021", contributor_id: "mech:tmao",
    statement: "eggs.nutrition (TMAO): unabsorbed choline is cleaved to TMA by gut cutC bacteria and oxidized to TMAO by hepatic FMO3; the magnitude is matrix-dictated, and four whole eggs/day did NOT raise fasting TMAO (Wilcox 2021, p=0.28) while an equivalent choline-bitartrate supplement did (p<0.0001)", checking_records: chk("wilcox-rct", "replication", "randomized clinical trial, n=82") },
  // the association is settled; the CAUSAL link is held at the association grade, no higher (a finding).
  { ref: "tmao.assoc", kind: "measurement", declared_grade: "checked", source_id: "src:tang-2013", contributor_id: "epi:tang",
    statement: "eggs.nutrition (TMAO): fasting plasma TMAO is dose-dependently associated with major adverse cardiovascular events (Tang 2013, adjusted HR 2.54, 95% CI 1.96-3.28; meta HR 1.41), a settled statistical association in sick populations", checking_records: chk("tang-cohort", "data-audit", "4,007-patient cohort + meta-analysis") },
  { ref: "tmao.causal", kind: "forum", declared_grade: "supported", source_id: "src:tang-2013", contributor_id: "causal:tmao",
    statement: "eggs.nutrition (TMAO): that TMAO is the causal atherogenic agent driving that association (rather than a proxy) is a leap the gate holds at the association grade at most; the report proposes settled risk for the association but needs-refinement for causation, so the causal claim earns no floor" },
  // the fork itself: the same choline grounds the benefits AND feeds TMAO; averaging destroys it.
  { ref: "chol.fork", kind: "forum", declared_grade: "supported", source_id: "src:wilcox-2021", contributor_id: "fork:choline",
    statement: "eggs.nutrition (fork): the same choline that grounds fetal neurodevelopment and hepatic fat export also feeds the TMAO pathway, so the net effect is a structural split dynamically routed by host microbiome and renal clearance, not a scalar to average; the food is constant, the host body is the router" },
  // the undercuts to the TMAO causal claim (undercut edges, wired below): each lowers its confidence.
  { ref: "uc.fishparadox", kind: "forum", declared_grade: "asserted", source_id: "src:cho-2017", contributor_id: "undercut:fish",
    statement: "eggs.nutrition (undercut): oily fish and seafood raise circulating TMAO 46-62x more than eggs (Cho 2017), yet fish is cardioprotective, so TMAO cannot be a universal intrinsic cardiovascular toxin (discovery grade: confirmed the paradox shatters the causal assumption)" },
  { ref: "uc.renal", kind: "forum", declared_grade: "asserted", source_id: "src:sanchez-2022", contributor_id: "undercut:renal",
    statement: "eggs.nutrition (undercut): TMAO tracks inversely with eGFR, and the TMAO-MACE association is nullified after adjusting for renal function (Sanchez-Gimenez 2022, eGFR mediates 58%), so TMAO reads as a proxy for failing kidneys (discovery grade: confirmed)" },
  { ref: "uc.mendelian", kind: "forum", declared_grade: "asserted", source_id: "src:jia-2019", contributor_id: "undercut:mr",
    statement: "eggs.nutrition (undercut): bidirectional Mendelian randomization finds genetically predicted TMAO does NOT cause CAD, MI, stroke, or T2DM; the reverse holds, T2DM and CKD causally raise TMAO (Jia 2019), reverse causality (discovery grade: confirmed)" },

  // ==== fork 2: the cardiovascular crux, the confounding-adjustment choice ====
  // the two adjustment stances the harm and null cohorts diverge on (the crux frontier).
  { ref: "adj.uscohort", kind: "forum", declared_grade: "asserted", source_id: "src:zhong-2019", contributor_id: "adj:us",
    statement: "eggs.nutrition (adjustment): the US harm cohorts (Zhong 2019, +0.5 egg/day HR 1.06 CVD; +300 mg cholesterol HR 1.17) rest on a single baseline food-frequency questionnaire and do not adjust away the collinearity of heavy egg intake with the atherogenic Western pattern (higher BMI, smoking, processed red meat)" },
  { ref: "adj.global", kind: "forum", declared_grade: "asserted", source_id: "src:dehghan-2020", contributor_id: "adj:global",
    statement: "eggs.nutrition (adjustment): the global/updated cohorts (Drouin-Chartier BMJ 2020 pooled RR 0.98; PURE Dehghan 2020 HR 0.96 across 50 countries) use repeated dietary measures and substitution analysis, in which eggs are not a Western-pattern proxy, yielding a null" },
  // the crux itself, named as an explicit node: the residual confounding / collinearity choice.
  { ref: "cv.confounding", kind: "forum", declared_grade: "asserted", source_id: "src:drouin-2020", contributor_id: "crux:confounding",
    statement: "eggs.nutrition (crux): the harm-null contradiction resolves not to the egg's biology but to the confounding-adjustment choice: substituting one egg/day with processed red meat raises CVD risk 15% (HR 1.15) while substituting with fish/poultry is null, so the US harm signal tracks the dietary matrix, not the egg" },
  // Hu 1999 adds the male diabetic estimate to the diabetic-agreement region.
  { ref: "n.cv-diab-hu", kind: "measurement", declared_grade: "checked", source_id: "src:hu-1999", contributor_id: "cohort:hu",
    statement: "eggs.nutrition: in diabetic men, >=1 egg/day doubled coronary heart disease risk (Hu 1999, HR 2.02, 95% CI 1.05-3.87) while healthy men saw no association (HR 1.08), the effect-modification both camps agree on", checking_records: chk("hu-cohort", "data-audit", "Harvard cohort diabetic subgroup") },

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
  // the population-to-individual refusal rests on the mechanistic floor, not a single
  // effect size: absorption kinetics, synthesis feedback, and responder variance each ground it.
  // Three disjoint-source support groups, so the refusal earns corroborated by independence lift.
  { link_kind: "supports", from: "lip.absorption", to: "n.individual-unknown", support_group: "g:absorb", source_id: "src:brown-yu-2010", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "supports", from: "lip.synthesis", to: "n.individual-unknown", support_group: "g:synth", source_id: "src:kratky-2018", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "supports", from: "n.responder-var", to: "n.individual-unknown", support_group: "g:variance", source_id: "src:katan-1986", contributor_id: "wire", declared_grade: "supported" },
  // the responder-distribution phenotypes refine the continuous-spectrum claim rather than supersede it
  // (n.unimodal: the response is continuous; lip.responder: the cutpoints and their population fractions).
  { link_kind: "refines", from: "lip.responder", to: "n.unimodal", source_id: "src:herron-2006", contributor_id: "wire", declared_grade: "asserted" },

  // the cardiovascular contradiction: the population null and the population harm stand in tension.
  { link_kind: "contradicts", from: "n.cv-null", to: "n.cv-harm", source_id: "src:drouin-2020", contributor_id: "cohort:drouin", declared_grade: "asserted" },
  // the diabetic-interaction claim grounds on disjoint observational subgroup analyses (independence lift).
  { link_kind: "supports", from: "n.cv-diab-godos", to: "n.cv-diabetic", support_group: "g:godos", source_id: "src:godos-2021", contributor_id: "meta:godos", declared_grade: "supported" },
  { link_kind: "supports", from: "n.cv-diab-shin", to: "n.cv-diabetic", support_group: "g:shin", source_id: "src:shin-2013", contributor_id: "meta:shin", declared_grade: "supported" },
  { link_kind: "supports", from: "n.cv-diab-hu", to: "n.cv-diabetic", support_group: "g:hu", source_id: "src:hu-1999", contributor_id: "cohort:hu", declared_grade: "supported" },

  // ---- fork 1: the choline split ----
  // the TMAO causal claim rests only on the association, so it earns the association grade, no floor.
  { link_kind: "supports", from: "tmao.assoc", to: "tmao.causal", support_group: "g:tmao-assoc", source_id: "src:tang-2013", contributor_id: "epi:tang", declared_grade: "supported" },
  // the fork rests on both routings, the benefit and the risk, held as a split rather than averaged.
  { link_kind: "supports", from: "chol.neurodev", to: "chol.fork", support_group: "g:benefit", source_id: "src:caudill-2018", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "supports", from: "tmao.pathway", to: "chol.fork", support_group: "g:risk", source_id: "src:wilcox-2021", contributor_id: "wire", declared_grade: "supported" },
  // the three undercuts on the TMAO causal claim (undercut edges lower the confidence it transmits).
  { link_kind: "undercut", from: "uc.fishparadox", to: "tmao.causal", source_id: "src:cho-2017", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "undercut", from: "uc.renal", to: "tmao.causal", source_id: "src:sanchez-2022", contributor_id: "wire", declared_grade: "supported" },
  { link_kind: "undercut", from: "uc.mendelian", to: "tmao.causal", source_id: "src:jia-2019", contributor_id: "wire", declared_grade: "supported" },

  // ---- fork 2: the cardiovascular crux ----
  // each cohort rests on its own confounding-adjustment stance (the divergence frontier), at low link
  // grade so the contested conclusions stay contested; the crux computation reads the edges, not grades.
  { link_kind: "supports", from: "adj.uscohort", to: "n.cv-harm", support_group: "g:adj-us", source_id: "src:zhong-2019", contributor_id: "adj:us", declared_grade: "asserted" },
  { link_kind: "supports", from: "adj.global", to: "n.cv-null", support_group: "g:adj-global", source_id: "src:dehghan-2020", contributor_id: "adj:global", declared_grade: "asserted" },
  // both cohorts rest on the SHARED resolved region: the diabetic agreement and the mechanistic-floor
  // parallel-rise both camps accept. This is what keeps the crux from coming back shallow.
  { link_kind: "supports", from: "n.cv-diabetic", to: "n.cv-harm", support_group: "g:shared-diab-h", source_id: "src:godos-2021", contributor_id: "wire", declared_grade: "asserted" },
  { link_kind: "supports", from: "n.cv-diabetic", to: "n.cv-null", support_group: "g:shared-diab-n", source_id: "src:godos-2021", contributor_id: "wire", declared_grade: "asserted" },
  { link_kind: "supports", from: "n.ratio", to: "n.cv-harm", support_group: "g:shared-floor-h", source_id: "src:berger-2015", contributor_id: "wire", declared_grade: "asserted" },
  { link_kind: "supports", from: "n.ratio", to: "n.cv-null", support_group: "g:shared-floor-n", source_id: "src:berger-2015", contributor_id: "wire", declared_grade: "asserted" },
  // the crux is named as an explicit node: the confounding-adjustment choice, resting on the substitution.
  { link_kind: "supports", from: "adj.global", to: "cv.confounding", support_group: "g:crux", source_id: "src:drouin-2020", contributor_id: "wire", declared_grade: "supported" },
];

module.exports = { NUTRITION: { store_id: "S-nutrition", claims, links } };
