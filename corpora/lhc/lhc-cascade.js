// Role: the LHC-safety case-family, authored as data (docs/lhc-cascade.md,
//   docs/schema-revisions.md). A self-contained data module (T0-4). Branch 2 (stopping)
//   is authored to the floor; Branches 1 (production) and 3 (accretion) are STUBS carrying
//   sorry markers, per the task: do not invent their contents.
// Contract: exports a case object { id, title, atlas_refs, nodes } conforming to
//   data/schema.js; children/atlas refs resolve against data/primitives + data/atlas.
// Invariant: pure data. Every gap is marked and ledgered (docs/sorry-ledger.md). The
//   deferred accretion-regime verification (Giddings-Mangano) is NOT resolved here.
"use strict";

const CASE = {
  id: "lhc-cascade",
  title: "LHC safety: the astrophysical survival bound",
  atlas_refs: ["atlas.projectile-stops-in-target"],

  nodes: {
    // -- the spine: a modus tollens from a natural experiment --
    "lhc.claim": {
      id: "lhc.claim",
      kind: "claim",
      presentation: { type: "claim" },
      label: "The hazard is bounded",
      role: "the densest long-lived bodies survive, so the dangerous three-part antecedent is false",
      position: "hypothesis",
      terminal_type: "measurement",
    },

    "lhc.antecedent": {
      id: "lhc.antecedent",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Production AND stopping AND accretion",
      role: "the three-part condition for a produced black hole to destroy a body within its lifetime",
      position: "step",
      takes: ["production", "stopping", "accretion"],
      produces: ["body destroyed within its observed lifetime"],
      preserves: ["the modus tollens: if the body survives, a conjunct is false"],
      function: "derive",
      breaks: "any one conjunct fails",
      why_breaks:
        "the antecedent is a conjunction; a survived dense body shows the consequent false, so by modus tollens at least one of production, stopping, or accretion does not hold, which bounds the hazard",
      load_bearing: "a conjunction fails if any child fails; the dense body's survival is what fails it",
      math: "produced AND stops AND accretes  =>  destroyed within tau",
      formal_status: "nl",
      composition: "conjunction",
      children: ["lhc.branch1", "lhc.N2.3", "lhc.branch3"],
    },

    // -- the two assumptions (perturbable) --
    "lhc.assume.danger": {
      id: "lhc.assume.danger",
      kind: "assumption",
      presentation: { type: "assumption" },
      label: "Stable black hole, dangerously accreting",
      position: "hypothesis",
      // authored perturbation (architecture-spec section 5): flip false -> true and the
      // cascade predicts the neutron star should already be gone.
      perturb: {
        flips: true,
        cascade: [
          {
            target: "lhc.prediction",
            new_state: "sound",
            consequence: "destruction time computes to t_destroy << tau_NS",
          },
          {
            target: "lhc.comparison",
            new_state: "contradicted",
            consequence: "the cascade predicts the neutron star should already be gone",
          },
        ],
      },
    },
    "lhc.assume.neutral": {
      id: "lhc.assume.neutral",
      kind: "assumption",
      presentation: { type: "assumption" },
      label: "The object is neutral",
      position: "precondition",
    },

    // -- Branch 1: production. AUTHORED TO THE FLOOR (docs/lhc-cascade.md). --
    "lhc.branch1": {
      id: "lhc.branch1",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Production: has nature already run it?",
      role: "establish that cosmic rays striking matter have produced black holes at least as often as the LHC will, so a natural null result carries the LHC's statistics",
      position: "step",
      takes: ["cosmic-ray spectrum", "LHC luminosity", "production cross-section sigma_BH"],
      produces: ["nature has produced black holes at least as often as the LHC will"],
      preserves: ["the production physics, identical on the natural and artificial sides"],
      function: "derive",
      breaks: "nature's collisions do not reach the LHC's energy or count",
      why_breaks:
        "the natural null result carries the LHC's statistics only if cosmic rays have struck matter at or above the LHC energy at least as many times as the LHC will collide; the energy is reached (N1.1), the count is reached (N1.2), and the unknown production cross-section cancels (N1.3)",
      load_bearing: "the branch rests on the count comparison surviving the cancellation of the unknown sigma_BH",
      math: "N_BH(nature) / N_BH(LHC) >= 1",
      formal_status: "nl",
      composition: "sequence",
      children: ["lhc.N1.1", "lhc.N1.2", "lhc.N1.3"],
      outputs: ["lhc.antecedent"],
    },

    "lhc.N1.1": {
      id: "lhc.N1.1",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Fixed-target center-of-mass energy",
      role: "compute the collision energy a cosmic ray delivers on a stationary nucleon, to find which cosmic rays match the LHC",
      position: "step",
      takes: ["E_cr", "m_N"],
      produces: ["sqrt(s)"],
      preserves: ["the kinematics, the same invariant the LHC's own sqrt(s) is"],
      function: "derive",
      breaks: "the fixed-target limit does not apply",
      why_breaks:
        "a cosmic ray strikes a stationary nucleon, so the center-of-mass energy grows only as the square root of the lab energy, sqrt(s) ~ sqrt(2 E_cr m_N); cosmic rays above the LHC-equivalent threshold are observed, so nature reaches the LHC energy",
      load_bearing: "the square-root scaling sets the energy threshold the collision count is taken above",
      math: "sqrt(s) ~ sqrt(2 E_cr m_N)  (E_cr >> m_N)",
      formal_status: "typed",
      composition: "sequence",
      children: ["prim.mandelstam-s"],
    },

    "lhc.N1.2": {
      id: "lhc.N1.2",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Collision count above threshold",
      role: "count how many collisions at or above the LHC energy a dense body has seen, integrating the cosmic-ray flux over its area and exposure time",
      position: "step",
      takes: ["sqrt(s) threshold", "cosmic-ray flux Phi(E)", "body area", "exposure time", "target density"],
      produces: ["number of natural collisions at or above the LHC energy"],
      preserves: ["the interaction-rate accounting, rate = flux x number x time"],
      function: "derive",
      breaks: "the exposure is too small to match the LHC's collision count",
      why_breaks:
        "the natural count integrates the measured cosmic-ray flux above the threshold over the body's cross-sectional area (from its radius) and its exposure time (its age); a gigayear-old dense body accumulates a count that dwarfs the LHC's",
      load_bearing: "the count comparison is what the cancellation then turns into a production comparison",
      math: "N_coll(>sqrt(s)) = (area x time) x integral_{E(sqrt s)}^inf Phi(E) dE x n_target",
      formal_status: "nl",
      composition: "sequence",
      children: ["prim.cosmic-ray-flux", "prim.interaction-rate"],
      // the empirical floor: the natural exposure reads the dense bodies' area (from radius) and
      // exposure time (from age), each a measured body property (data/bodies/bodies.js).
      body_refs: ["white-dwarf#radius", "white-dwarf#age", "neutron-star#radius", "neutron-star#age"],
    },

    "lhc.N1.3": {
      id: "lhc.N1.3",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Cross-section cancellation",
      role: "turn the collision-count comparison into a black-hole-production comparison, cancelling the unknown production cross-section",
      position: "step",
      takes: ["N_coll(nature)", "N_coll(LHC)"],
      produces: ["N_BH(nature)/N_BH(LHC) >= 1, with sigma_BH absent"],
      preserves: ["the production model, applied identically on both sides"],
      function: "cancel",
      load_bearing:
        "the production cross-section sigma_BH, the most uncertain quantity in the problem, is the same physics on both sides and divides out, so the bound holds without knowing it; this is one of the cascade's genuine junctions",
      math: "N_BH(nature)/N_BH(LHC) = (N_coll(nature) sigma_BH)/(N_coll(LHC) sigma_BH) = N_coll(nature)/N_coll(LHC)",
      formal_status: "typed",
      composition: "sequence",
      children: ["prim.production-rate"],
    },

    // -- Branch 2: stopping. AUTHORED TO THE FLOOR. --
    "lhc.N2.1": {
      id: "lhc.N2.1",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Lab-frame velocity from kinematics",
      role: "compute the black hole's lab-frame velocity from the production kinematics",
      position: "step",
      takes: ["sqrt(s)", "m_N", "collision asymmetry"],
      produces: ["beta_BH"],
      preserves: ["the production physics, unchanged across scenarios"],
      function: "derive",
      breaks: "the scenario is mis-assigned (cosmic-ray fast vs LHC slow)",
      why_breaks:
        "the same production physics yields a relativistic black hole for a fixed-target cosmic-ray collision and a nearly-at-rest one at the symmetric LHC, so nature's fast black holes do not directly bound the LHC's slow one; this scenario departure is the root of the case",
      load_bearing: "same boost, two scenarios, opposite outputs: nature fast-and-escapes, LHC slow-and-stays",
      math: "gamma_BH ~ sqrt(s)/(2 m_N) (cosmic-ray);  beta_BH ~ 0 (LHC)",
      formal_status: "typed",
      composition: "sequence",
      children: ["prim.lorentz-boost"],
      scenario: "nature|LHC",
      TODO_verify:
        "confirm the precise kinematic factor gamma_BH ~ sqrt(s)/(2 m_N) for the assumed production process. See docs/sorry-ledger.md lhc.N2.1#TODO_verify.",
    },

    "lhc.N2.2": {
      id: "lhc.N2.2",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Stopping length",
      role: "compute the distance over which the black hole loses its energy in matter",
      position: "step",
      takes: ["beta_BH", "M_BH", "rho", "charge"],
      produces: ["lambda_stop"],
      preserves: ["energy-loss physics within each charge regime"],
      function: "derive",
      breaks: "the charge regime is wrong",
      why_breaks:
        "a charged black hole loses energy electromagnetically and stops in ordinary matter (Bethe-Bloch), while a neutral one stops only by far-weaker geometric capture and needs very high density; the regime is load-bearing and gated on the charge assumption",
      load_bearing: "the charged/neutral split decides which bodies can stop the object",
      math: "lambda_stop = E_BH / |dE/dx|(rho, charge, beta)",
      formal_status: "nl",
      composition: "disjunction",
      guard: { assumption_id: "lhc.assume.neutral", value: true },
      children: ["prim.bethe-bloch", "prim.geometric-capture"],
      TODO_verify:
        "confirm the charged/neutral split and which bodies bound which case (charged: ordinary matter and the Sun; neutral: white dwarfs and neutron stars) against arXiv:0806.3381. See docs/sorry-ledger.md lhc.N2.2#TODO_verify.",
    },

    "lhc.N2.3": {
      id: "lhc.N2.3",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "Stopping condition",
      role: "decide whether a produced black hole halts inside a given body",
      position: "step",
      takes: ["stopping_length", "body_radius", "body_density"],
      produces: ["set of bodies whose survival bounds the hazard"],
      preserves: ["the production and accretion physics, unchanged"],
      function: "derive",
      breaks: "the body is too sparse to stop the object before it exits",
      why_breaks:
        "a relativistic neutral black hole loses energy only by weak capture, so in low-density matter its stopping length exceeds the body radius and it passes through; the body's survival is then consistent with the object being dangerous, so the body is uninformative. The fix is to select bodies dense enough that stopping is guaranteed (white dwarfs, neutron stars) and read their survival instead",
      load_bearing: "dense-object selection is the entire content of getting this case right",
      math: "stops iff lambda_stop < R_body",
      formal_status: "nl",
      composition: "sequence",
      children: ["lhc.N2.1", "lhc.N2.2"],
      atlas_ref: "atlas.projectile-stops-in-target",
      inputs: ["lhc.assume.neutral", "lhc.N2.2"],
      outputs: ["lhc.antecedent"],
      // the empirical floor: the stopping condition reads the density and radius of the dense
      // bodies (which can stop the object) and the Earth foil (too sparse to). Each is a measured
      // body property, grounded because the world closed it (data/bodies/bodies.js).
      body_refs: [
        "earth#mean_density", "earth#radius",
        "white-dwarf#mean_density", "white-dwarf#radius",
        "neutron-star#mean_density", "neutron-star#radius",
      ],
    },

    // -- Branch 3: accretion. STUB (sorry) + the deferred accretion-regime verification. --
    "lhc.branch3": {
      id: "lhc.branch3",
      kind: "transformation",
      label: "Accretion: how fast does a stopped black hole grow?",
      role: "given a black hole at rest inside body S, compute the time to consume it (N3.1 accretion rate, N3.2 time to destruction)",
      sorry:
        "Branch 3 (accretion) is NOT authored to the floor. It carries the load-bearing accretion-regime deferred verification: the exact dM/dt for a micro black hole inside degenerate matter is regime-dependent and must be read from Giddings-Mangano (arXiv:0806.3381), not reconstructed from the Bondi reference form. Do not invent or guess the rate. See docs/sorry-ledger.md lhc.branch3#sorry.",
    },

    // -- the closure, split into three nodes per S6 --
    "lhc.prediction": {
      id: "lhc.prediction",
      kind: "prediction",
      presentation: { type: "prediction" },
      label: "Time to destruction",
      value: "t_destroy(S, under the dangerous hypothesis)",
      produced_by: "lhc.branch3",
      // the integration ceiling: t_destroy integrates the accretion until the object has consumed
      // the body, so it reads the body's mass (data/bodies/bodies.js). The accretion RATE is the
      // deferred regime, carried once by lhc.branch3#sorry, not re-surfaced here.
      body_refs: ["white-dwarf#mass", "neutron-star#mass"],
    },
    "lhc.observation": {
      id: "lhc.observation",
      kind: "observation",
      presentation: { type: "observation" },
      label: "Neutron stars survive",
      world_value: "white dwarfs and neutron stars survive to ages of order a gigayear",
      immutable: true,
    },
    "lhc.comparison": {
      id: "lhc.comparison",
      kind: "comparison",
      presentation: { type: "comparison" },
      label: "Predicted destruction time vs observed age",
      test: "t_destroy < tau_S",
      state: "consistent",
      note: "as-argued the bodies survive (consistent); flipping lhc.assume.danger turns this contradicted",
      // tau_S is the body's measured age: the survival bound reads the dense bodies' ages
      // (data/bodies/bodies.js), the world-fact the prediction is tested against.
      body_refs: ["white-dwarf#age", "neutron-star#age"],
    },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { CASE };
