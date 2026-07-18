// Role: the covid-origins case reference tables (trusted inputs, intake data model v3, Section 10),
//   for the densified covid case ingested from the Rootclaim-debate write-up. A source
//   row per cited study/document carries its citation as provenance; the kind table gives the two
//   ceilings the case uses: a measurement floor and a forum band.
// Contract: exports SOURCES (source-table rows) and KINDS (kind-table rows). Pure data; imports nothing.
// Invariant: every claim's source_id resolves here, so every claim carries the provenance the
//   write-up names. The write-up is canonical for what the claims and sources are, never for the grade.
"use strict";

const KINDS = [
  { kind: "measurement", ceiling: "checked" },
  { kind: "forum", ceiling: "corroborated" },
];

const SOURCES = [
  // ---- evidence and interpretation ----
  { source_id: "src:worobey-2022", source_class: "peer-reviewed", description: "Worobey et al. (2022), Science 377(6609):951-959 (Huanan market epicenter)" },
  { source_id: "src:liu-2023", source_class: "peer-reviewed", description: "Liu et al. (2023), Nature 618:640-646 (environmental surveillance of the market)" },
  { source_id: "src:crits-2024", source_class: "peer-reviewed", description: "Crits-Christoph et al. (2024), Cell 187(18):5318-5329 (market wildlife genetic tracing)" },
  { source_id: "src:pekar-2022", source_class: "peer-reviewed", description: "Pekar et al. (2022), Science 377(6609):960-966 (two lineages; erratum 2023)" },
  { source_id: "src:weissman-2026", source_class: "peer-reviewed", description: "Weissman (2026), Econ Journal Watch 23(1); McCowan arXiv:2510.01484 (two-spillover reanalysis)" },
  { source_id: "src:segreto-2020", source_class: "peer-reviewed", description: "Segreto & Deigin (2020), BioEssays 42(12):e2000240 (furin cleavage site structure)" },
  { source_id: "src:romeu-2023", source_class: "peer-reviewed", description: "Romeu (2023), BMC Genomic Data 24:57; Holmes et al. (2021), Cell 184(19):4848 (CGG codons)" },
  { source_id: "src:defuse-2021", source_class: "institutional-report", description: "The Intercept (2021), DEFUSE leaked proposal; US House Oversight letter (2024)" },
  { source_id: "src:holmes-2021", source_class: "peer-reviewed", description: "Holmes et al. (2021), Cell 184(19):4848-4856 (FCS suboptimality critical review)" },
  { source_id: "src:weissman-2024", source_class: "peer-reviewed", description: "Weissman (2024), JRSS-A 187(3):720 (proximity ascertainment bias); Debarre/Worobey reply" },
  { source_id: "src:bloom-2023", source_class: "peer-reviewed", description: "Bloom (2023), Virus Evolution 9(2):vead050 (metagenomic reanalysis); Debarre rebuttal" },
  { source_id: "src:stoyan-2024", source_class: "peer-reviewed", description: "Stoyan & Chiu (2024), JRSS-A; Debarre & Worobey arXiv:2403.05859 (centroid critique)" },
  // ---- conclusions, priors, and the debate record ----
  { source_id: "src:acx-2024", source_class: "institutional-report", description: "Scott Alexander (2024), Astral Codex Ten, 'Practically-A-Book-Review: Rootclaim Lab Leak Debate'" },
  { source_id: "src:yong-2024", source_class: "institutional-report", description: "Shin Jie Yong (2024), Medium, 'My Friend Won the US$100,000 Debate' (Miller's priors)" },
  { source_id: "src:rootclaim-2024", source_class: "institutional-report", description: "Rootclaim Blog (2024), debate results and response to Scott Alexander (Rootclaim's priors)" },
  { source_id: "src:vantreuren-2024", source_class: "institutional-report", description: "Judge Will Van Treuren, written decision (Feb 2024): ~1 in 300 lab leak" },
  { source_id: "src:stansifer-2024", source_class: "institutional-report", description: "Judge Eric Stansifer, final decision (Feb 17 2024): ~1 in 3000 lab leak" },
  { source_id: "src:who-sago-2025", source_class: "institutional-report", description: "WHO SAGO report (2025); ODNI declassified assessment; Gelman (2025) (unresolved)" },
  // ---- the deep extraction: the debate walked several nodes deep per line, and the
  // weightings of three careful readers over the same evidence ----
  { source_id: "src:deep-extraction", source_class: "institutional-report", description: "Extraction and Evaluation of the SARS-CoV-2 Origins Debate: A Comprehensive Synthesis (2024), the deep argument sets, nested cruxes, and reader weightings of Scott Alexander, Will Van Treuren, and Eric Stansifer over the Rootclaim debate; the deep pass now also incorporates the debate's primary written record (Rootclaim's blog, Miller's Medium, the judges' written decisions, and named post-debate reconstructions)" },
];

module.exports = { KINDS, SOURCES };
