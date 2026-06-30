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

    // -- Branch 1: production. STUB (sorry). Named in the cascade doc, not authored here. --
    "lhc.branch1": {
      id: "lhc.branch1",
      kind: "transformation",
      label: "Production: has nature already run it?",
      role: "establish that cosmic rays have produced black holes at least as often as the LHC will (N1.1 fixed-target CoM energy, N1.2 collision count, N1.3 cross-section cancellation)",
      sorry:
        "Branch 1 (production) is named in docs/lhc-cascade.md but NOT authored to the floor. Do not invent its contents; author N1.1-N1.3 with cited primitive leaves. See docs/sorry-ledger.md lhc.branch1#sorry.",
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
