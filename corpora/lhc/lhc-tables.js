// Role: the densified LHC-safety case reference tables (intake data model v3, Section 10), for the
//   three-leg cascade ingested from the production-leg report (A), the Hawking-evaporation report (B),
//   the omissions survey, and the framework-conditionality report (Prompt 25). A source row per cited
//   study/report carries its citation as provenance; the kind table gives the three ceilings the case
//   uses: a derivation floor (constitutive, a formal result settled by construction within its regime),
//   a measurement floor (checked, the empirical bounds and the survival fact), and the forum band
//   (corroborated, the framework choices, the legs, and the meta-claims).
// Contract: exports SOURCES (source-table rows) and KINDS (kind-table rows). Pure data; imports nothing.
// Invariant: every claim's source_id resolves here, so every claim carries the provenance a report
//   names. The reports are canonical for what the claims and sources are, never for the grade the gate
//   grants; where a proposed mode and the gate disagree, the disagreement is a listed finding.
"use strict";

const KINDS = [
  // a formal derivation is settled by its own construction WITHIN its stated regime: the constitutive
  // mode, the only settled-tier position reached without an empirical checking record.
  { kind: "derivation", ceiling: "constitutive" },
  // the empirical bounds (collider exclusions) and the astrophysical survival fact ground to the
  // measurement floor.
  { kind: "measurement", ceiling: "checked" },
  // the framework choices, the leg conclusions, and the conditionality/closure meta-claims are forum.
  { kind: "forum", ceiling: "corroborated" },
];

const SOURCES = [
  // ---- report A: the production leg ----
  { source_id: "src:production-report", source_class: "institutional-report", description: "The Production Leg of the LHC Safety Argument (2026), sourced-claims analysis, 250+ sources cross-verified against PDG 2024" },
  { source_id: "src:add-1998", source_class: "peer-reviewed", description: "Arkani-Hamed, Dimopoulos & Dvali (1998), Phys. Lett. B 429:263 (ADD large extra dimensions)" },
  { source_id: "src:giddings-thomas-2002", source_class: "peer-reviewed", description: "Giddings & Thomas (2002), Phys. Rev. D 65:056010 (colliders as black-hole factories; geometric cross-section)" },
  { source_id: "src:dimopoulos-landsberg-2001", source_class: "peer-reviewed", description: "Dimopoulos & Landsberg (2001), Phys. Rev. Lett. 87:161602 (black holes at the LHC)" },
  { source_id: "src:giddings-mangano-2008", source_class: "peer-reviewed", description: "Giddings & Mangano (2008), Phys. Rev. D 78:035009, arXiv:0806.3381 (astrophysical constraints; accretion)" },
  { source_id: "src:meade-randall-2008", source_class: "peer-reviewed", description: "Meade & Randall (2008), JHEP 05:003 (semiclassical thermality criteria; RS thresholds)" },

  // ---- report B: the Hawking evaporation leg ----
  { source_id: "src:hawking-report", source_class: "institutional-report", description: "The Hawking Evaporation Leg of the LHC Safety Argument (2026), sourced-claims analysis separating computed behaviour from the semiclassical premise" },
  { source_id: "src:argyres-1998", source_class: "peer-reviewed", description: "Argyres, Dimopoulos & March-Russell (1998), Phys. Lett. B 441:96 (higher-dimensional Hawking temperature, lifetime, coefficients)" },
  { source_id: "src:kanti-2004", source_class: "peer-reviewed", description: "Kanti (2004), Int. J. Mod. Phys. A 19:4899 (Hawking radiation from (4+n)-dimensional black holes)" },
  { source_id: "src:harris-kanti-2003", source_class: "peer-reviewed", description: "Harris & Kanti (2003), JHEP 10:014 (greybody factors; horizon radius)" },
  { source_id: "src:gryb-2019", source_class: "preprint", description: "Gryb, Wallace & Inguglia (2019), arXiv:1812.07078 (universality arguments for Hawking radiation assessed)" },
  { source_id: "src:calmet-2008", source_class: "peer-reviewed", description: "Calmet, Gong & Hsu (2008), Phys. Lett. B 668:20 (colorful quantum black holes; non-thermal decay near threshold)" },

  // ---- the omissions survey ----
  { source_id: "src:survey", source_class: "institutional-report", description: "Survey: What the Three-Leg LHC Safety Model Omits (2026), 60+ wide searches and 12 deep-dives, cross-verified" },
  { source_id: "src:plaga-2008", source_class: "preprint", description: "Plaga (2008, v3 2009), arXiv:0808.1415 (metastable quantum black holes; catastrophic-risk scenario)" },
  { source_id: "src:casadio-2009", source_class: "peer-reviewed", description: "Casadio, Fabi & Harms (2009), Phys. Rev. D 80:084036 (catastrophic growth in the warped brane-world)" },
  { source_id: "src:unruh-2014", source_class: "peer-reviewed", description: "Unruh (2014), Found. Phys. 44:532; Helfer (2003), Rep. Prog. Phys. 66:943 (trans-Planckian problem)" },
  { source_id: "src:vilkovisky", source_class: "peer-reviewed", description: "Vilkovisky, quantum back-reaction trilogy; Rovelli & Vidotto (2014), Phys. Rev. Lett. 111:091303 (partial evaporation, remnants)" },
  { source_id: "src:amps-2013", source_class: "peer-reviewed", description: "Almheiri, Marolf, Polchinski & Sully (2013), JHEP 02:062, arXiv:1207.3123 (firewall paradox)" },

  // ---- the framework-conditionality report ----
  { source_id: "src:conditionality-report", source_class: "institutional-report", description: "The LHC Safety Verdict as a Function of the Physics Framework (2026), mapping the framework-choice conditional" },
  { source_id: "src:conditional-robustness", source_class: "institutional-report", description: "Conditional Robustness and the Isomorphism Test (2026), on the additive framing of the LHC safety layers" },
  { source_id: "src:cms-exo-24-028", source_class: "peer-reviewed", description: "CMS Collaboration, CMS-EXO-24-028, arXiv:2604.10732 (2026) (semiclassical BH and string-ball exclusions, 138 fb-1)" },
  { source_id: "src:atlas-monojet-2021", source_class: "peer-reviewed", description: "ATLAS Collaboration (2021), Phys. Rev. D 103:112006, arXiv:2102.10874 (monojet ADD M_D exclusions, 139 fb-1)" },
  { source_id: "src:pdg-2024", source_class: "institutional-report", description: "PDG 2024 Review, 'Models with Extra Dimensions'; Fermi-LAT and astrophysical M_D bounds" },
  { source_id: "src:lsag-2008", source_class: "institutional-report", description: "Ellis, Giudice, Mangano, Tkachev & Wiedemann (LSAG, 2008), J. Phys. G 35:115004 ('no basis for any conceivable threat')" },
  { source_id: "src:spc-2008", source_class: "institutional-report", description: "CERN SPC Report on the LSAG documents (2008), arXiv:0806.3414 (the three-level conditionality acknowledgment)" },
];

module.exports = { KINDS, SOURCES };
