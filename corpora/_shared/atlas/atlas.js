// Role: the atlas, the meta-index that shows the three cases are clones of reusable structure. Two
//   registers with distinct admission tests: the transformation BASIS (coordinates of the decomposition
//   basis, admitted solo on type-correctness) and the DISCRIMINATION patterns (cases held against each
//   other, admitted in pairs on a real departure). ATLAS is the pre-existing discrimination map that
//   case nodes point into via atlas_ref.
// Contract: exports { ATLAS, BASIS, DISCRIMINATORS }. A BASIS entry is { id, terminal_type, signature,
//   exemplar, admitted }; a DISCRIMINATORS entry is { id, pattern, clones:[{case,store,node,departure,
//   status}], admitted }. A departure is a node-id in a case file, never a description. Node references
//   are (store, node) into the built case stores; build/check-atlas.mjs enforces both admission tests.
// Invariant: pure data; corpora imports nothing. A basis entry is admitted only with an existing
//   exemplar node; a discriminator only with two existing clones. A pending entry is defined, not admitted.
"use strict";

const ATLAS = {
  // The earned shared object from docs/family-discrimination.md: not a transformation with
  // variants, but a two-stage pipeline whose two cases fail at different stages.
  "atlas.statistic-supports-conclusion": {
    id: "atlas.statistic-supports-conclusion",
    role: "a statistic computed from a sample supports a conclusion about a target",
    signature: "sample -> statistic -> conclusion",
    parent_of: null,
    // the two typed preconditions the pattern rests on; each clone is the variant that violates one
    // (L2's two-stage factoring made load-bearing). The pattern holds only if both hold.
    preconditions: [
      {
        name: "representativeness",
        stage: 1,
        condition: "the sample is drawn without selection bias: inclusion is independent of the variable being estimated",
        holds_when: "P(include | x) is constant in the estimand (an exchangeable draw)",
        variant: "selection-aware",
        violated_by: "covid.instance",
      },
      {
        name: "sufficiency",
        stage: 2,
        condition: "the statistic is computed over a sample clean and large enough, and retains the information the conclusion needs",
        holds_when: "the statistic is sufficient for the parameter the conclusion turns on (uniform response, so the mean carries the individual conclusion)",
        variant: "heterogeneity-aware",
        violated_by: "eggs.instance",
      },
    ],
    clones: [
      {
        case: "COVID origin",
        node_id: "covid.instance",
        departure:
          "stage-1 (representativeness) failure: surveillance is spatially concentrated, so sample inclusion correlates with the location being estimated; the draw is non-exchangeable",
      },
      {
        case: "eggs, individual dietary response",
        node_id: "eggs.instance",
        departure:
          "stage-2 (sufficiency) failure: responders are heterogeneous and the mean discards the within-population variance the individual conclusion needs",
      },
    ],
  },

  // LHC Branch 2, N2.3: the reusable "does the projectile stop in the target" pattern.
  // Within-case for now (one clone); the nature-vs-LHC scenario departure on the frame
  // boost (N2.1) is the S4 within-case instantiation, recorded on the case node.
  "atlas.projectile-stops-in-target": {
    id: "atlas.projectile-stops-in-target",
    role: "decide whether a projectile halts inside a given target before it can act",
    signature: "(stopping_length, target_radius, target_density) -> stops?",
    parent_of: null,
    // the typed precondition: the projectile must stop inside the target, which is density-gated.
    // The variant axis is the target's density regime; the clone instantiates it on the LHC case.
    preconditions: [
      {
        name: "stopping",
        condition: "stopping_length < target_radius: the projectile halts inside the target before it exits",
        holds_when: "the target density is high enough that lambda_stop(rho) < R_body",
        variant: "density-regime",
        instantiated_by: "lhc.N2.3",
        note: "low density (Earth) gives lambda_stop > radius, the projectile passes through and the body is uninformative; high density (white dwarf, neutron star) guarantees stopping and the body is informative",
      },
    ],
    clones: [
      {
        case: "LHC safety",
        node_id: "lhc.N2.3",
        departure:
          "dense-object selection: Earth is too sparse to stop a fast neutral object, so its survival is uninformative; white-dwarf and neutron-star densities are required",
      },
    ],
  },
};

// ===================================================================================================
// Register 1: the transformation BASIS. A transformation is a coordinate in the basis the case
// decompositions are written in. ADMISSION TEST: type-correctness, the terminal type is real and the
// signature is clean; one exemplar suffices, no second clone required, and a candidate with a vague
// terminal type is sent back (that is the failure this register guards, not soloness). One entry per
// terminal type; the exemplar is a node found in a case file. Two types (withheld-record, constitutive)
// have no exemplar node in the current corpus and are defined-but-pending, per the honesty discipline.
const BASIS = {
  "atlas.basis.measurement": {
    id: "atlas.basis.measurement", terminal_type: "measurement",
    signature: "a measured quantity -> closes at its measurement floor (checked)",
    exemplar: { case: "LHC safety", store: "S-lhc-cascade", node: "astro.survival" },
    admitted: true, note: "an LHC branch closing on the astronomical survival observation (white dwarfs and neutron stars survive)",
  },
  "atlas.basis.structured-forum": {
    id: "atlas.basis.structured-forum", terminal_type: "structured-forum",
    signature: "a cross-domain weighing over incommensurable terms -> closes at structured-forum, no higher",
    exemplar: { case: "eggs", store: "C-eggs", node: "w.system" },
    admitted: true, note: "the which-farming-system cross-domain weighing",
  },
  "atlas.basis.irreducible-prior": {
    id: "atlas.basis.irreducible-prior", terminal_type: "irreducible-by-choice prior",
    signature: "a reference-class or base-rate selection -> no fact resolves it",
    exemplar: { case: "COVID origin", store: "S-covid-origins", node: "prior.miller-zoo" },
    admitted: true, note: "Miller's base-rate prior (a natural pandemic about once per century)",
  },
  "atlas.basis.derivation": {
    id: "atlas.basis.derivation", terminal_type: "derivation",
    signature: "facts -> a conclusion under a system carried as its axioms (settled by construction within the regime)",
    exemplar: { case: "LHC safety", store: "S-lhc-cascade", node: "hawking.temp" },
    admitted: true, note: "the higher-dimensional Hawking-temperature derivation; the corpus's derivation-kind nodes live in the LHC case, so the exemplar is taken there rather than from the eggs verdict step the prompt suggested, which is not a typed node",
  },
  "atlas.basis.withheld-record": {
    id: "atlas.basis.withheld-record", terminal_type: "withheld-record",
    signature: "a dispute a named sealed dataset would resolve -> gated on unsealing",
    exemplar: null, admitted: false,
    pending: "a COVID node typing the market-clustering crux (CV-2) as withheld-record with the sealed early-case line-list as its closing dataset; corpora/covid/covid-origins.js carries no closing_condition node, so the terminal is described in the trellis but not yet represented as a typed node",
  },
  "atlas.basis.constitutive": {
    id: "atlas.basis.constitutive", terminal_type: "constitutive",
    signature: "a claim closing by adopting or refusing a framework carried as a parameter",
    exemplar: null, admitted: false,
    pending: "an eggs moral-status node (whether the hen's interests count) closing by adopting or refusing a framework; the current eggs corpus carries no such node (the framework-choice nodes that exist, the LHC dep.add and the framing records, are the framing-presupposition discriminator's clones, a different terminal)",
  },
};

// Register 2: the DISCRIMINATION patterns. A discriminator holds two or more cases against each other,
// and its content is the departure, the coordinate of the diverging node, not a resemblance. ADMISSION
// TEST: two existing clones with a real departure coordinate (a node-id in the case file). A pattern
// short of two existing clones is defined with its clones marked existing/pending and held. All four
// below carry two or more existing clones (the eggs which-body, the CVD crux, and the regenerative
// leaps all landed in Prompt 26), so all four admit.
const DISCRIMINATORS = {
  "atlas.discriminator.framing-presupposition": {
    id: "atlas.discriminator.framing-presupposition",
    pattern: "formal measurements presuppose a forum frame, checked-not-graded and swappable; swapping reframes the verdict while the measurements keep their grade",
    clones: [
      { case: "eggs denominator", store: "C-eggs", node: "F-throughput", departure: "the accounting-unit frame node (product-throughput against net-capital)", status: "existing" },
      { case: "LHC framework choice", store: "S-lhc-cascade", node: "F-add", departure: "the physics-model frame node (ADD against the standard model)", status: "existing" },
      { case: "eggs which-body", store: "C-eggs", node: "F-body-avgadult", departure: "the patient frame node (average adult against diabetic against pregnant)", status: "existing" },
    ],
    admitted: true,
  },
  "atlas.discriminator.conditional-robustness": {
    id: "atlas.discriminator.conditional-robustness",
    pattern: "independent-looking supports share a premise, so the apparent robustness is illusory",
    clones: [
      { case: "LHC legs", store: "S-lhc-cascade", node: "dep.semiclassical", departure: "the shared physical-premise node (semiclassical gravity, which all three legs depend on)", status: "existing" },
      { case: "COVID analyses", store: "S-covid-origins", node: "ev.clustering", departure: "the shared evidential-input node (the market-clustering factor every zoonosis analysis pivots on)", status: "existing" },
    ],
    admitted: true,
  },
  "atlas.discriminator.crux-divergence-frontier": {
    id: "atlas.discriminator.crux-divergence-frontier",
    pattern: "two contradicting conclusions share the evidence and diverge at an assumption; the crux is that frontier",
    clones: [
      { case: "COVID origin", store: "S-covid-origins", node: "prior.miller-zoo", departure: "the prior node the two support cones stop sharing", status: "existing" },
      { case: "eggs cardiovascular", store: "S-nutrition", node: "adj.uscohort", departure: "the confounding-adjustment node (the US-cohort stance the harm side rests on)", status: "existing" },
    ],
    admitted: true,
  },
  "atlas.discriminator.characterized-gap": {
    id: "atlas.discriminator.characterized-gap",
    pattern: "a claim held by transfer carries the specific measurement that would ground it",
    clones: [
      { case: "LHC leg premise", store: "S-lhc-cascade", node: "dep.add", departure: "the closing-condition node (a measurement of M_D within LHC reach would ground the ADD premise)", status: "existing" },
      { case: "regenerative eggs", store: "S-environment", node: "e.regen-soc", departure: "the closing-condition node (a direct soil-organic-carbon measurement would ground the regenerative claim)", status: "existing" },
    ],
    admitted: true,
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { ATLAS, BASIS, DISCRIMINATORS };
