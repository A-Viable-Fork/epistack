---
Type: record
Purpose: Records the LHC-cascade case reasoning, the record the black-holes trellis and the schema revisions derive from.
Depends on: docs/knowledge-system-how.md
Depended on by: docs/schema-revisions.md, docs/trellises/black-holes-reconstruction-trellis.md
---

# LHC Safety: The Math Cascade

*First pass. The chain of transformations the LHC-safety derivation composes, laid out for decomposition. Confidence is flagged per node. Branch 3 (accretion) is the one that must be read from Giddings-Mangano (arXiv:0806.3381) rather than reconstructed; the rest is structurally settled.*

## The spine: the astrophysical survival bound

Everything below serves one composition, a modus tollens from a natural experiment.

- **Conditional.** IF a stable black hole is produced, AND it stops inside a dense body, AND it then accretes faster than the body's age, THEN that body is destroyed within its observed lifetime.
- **Observation.** The densest long-lived bodies we see, white dwarfs and neutron stars, survive to ages of order a gigayear.
- **Therefore.** The three-part antecedent is false. The hazard is bounded.

The reusable transformation is the bound itself: *hazard H implies system S destroyed by now; S survives; therefore not H.* It recurs across risk arguments unchanged (strangelets against lunar survival, vacuum decay against cosmic survival). The three conjuncts in the antecedent are the three branches of the cascade. The closure is the comparison `t_destroy < tau_S` read against the survival of S.

## The cascade

### Branch 1 - Production: has nature already run it?
*Role: establish that cosmic rays striking matter have produced black holes at least as often as the LHC will, so a natural null result carries the LHC's statistics. Confidence: high.*

- **N1.1 Fixed-target center-of-mass energy.** `sqrt(s) ~ sqrt(2 E_cr m_N)` for `E_cr >> m_N`. Takes: cosmic-ray lab energy `E_cr`, target nucleon mass `m_N`. Produces: `sqrt(s)`. *Floor: Mandelstam s in the fixed-target limit.*
- **N1.2 Collision count above threshold.** `N_coll(>sqrt(s)) = (area x time) x integral_{E(sqrt s)}^inf Phi(E) dE x n_target`. Takes: cosmic-ray flux spectrum `Phi(E)`, exposure geometry, target density. Produces: number of natural collisions at or above the LHC energy. *Floor: the interaction-rate integral, rate = flux x number x time.*
- **N1.3 Cross-section cancellation.** `N_BH(nature)/N_BH(LHC) = N_coll(nature)/N_coll(LHC)`, because the production cross-section `sigma_BH` is the same physics on both sides and divides out. Takes: the two collision counts (`N_coll(LHC) = integral L dt`). Produces: a ratio at least 1, with `sigma_BH` absent. *Mid-level. The most uncertain quantity in the whole problem, the production cross-section, drops out here. This is why the bound is robust to not knowing it.*

Branch 1 by itself is the "Earth has survived cosmic rays" argument. It is not sufficient, and Branch 2 is the reason.

### Branch 2 - Stopping: whose survival is informative? (the departure-rich node)
*Role: decide whether a produced black hole halts inside a given body, which it must do before it can accrete. This is where the naive argument fails and the dense-object argument is forced. Confidence: high on structure; the charged/neutral split is load-bearing.*

- **N2.1 Lab-frame velocity from kinematics.** A cosmic-ray (fixed-target) black hole carries essentially the full lab energy and is relativistic: `gamma_BH ~ sqrt(s)/(2 m_N) = sqrt(E_cr/(2 m_N))`. An LHC (symmetric-collision) black hole is produced nearly at rest, `beta_BH ~ 0`. Takes: `sqrt(s)`, `m_N`, the collision asymmetry. Produces: `beta_BH`. *Floor: Lorentz boost, center-of-mass to lab.*
  - *This is the root of the departure. The same production physics yields a fast black hole in nature and a slow one at the LHC, so nature's fast black holes do not directly bound the LHC's slow one.*
- **N2.2 Stopping length.** `lambda_stop = E_BH / |dE/dx|(rho, charge, beta)`. Two regimes by charge. A **charged** black hole loses energy electromagnetically and stops in ordinary matter (Bethe-Bloch, short range). A **neutral** black hole stops only by gravitational or geometric capture, far weaker, requiring very high density. Takes: `beta_BH`, `M_BH`, `rho`, charge. Produces: `lambda_stop`. *Floor: the stopping-power integral, Bethe-Bloch (charged) or geometric capture (neutral).*
- **N2.3 Stopping condition.** STOPS iff `lambda_stop < R_body`, equivalently a density threshold. For the dangerous case (neutral, fast), Earth's density is too low (`lambda_stop > R_Earth`, the object passes through), so Earth's survival is uninformative. White-dwarf and neutron-star densities are high enough to stop even a fast neutral black hole. Takes: `lambda_stop`, `R_body`, `rho_body`. Produces: the set of bodies whose survival bounds the hazard. *Mid-level, reusable as "does the projectile stop in the target." This is the precondition that the natural exposure reaches the artificial regime.*
  - **Why the naive version breaks (the load-bearing field).** Earth's survival looks like it should bound the hazard but does not, because Earth cannot stop the dangerous object, so its survival is consistent with the object being dangerous. The fix is not a better Earth argument; it is to select bodies dense enough that stopping is guaranteed and read their survival instead. Dense-object selection is the entire content of getting this case right.

### Branch 3 - Accretion: how fast does a stopped black hole grow? (verification gap)
*Role: given a black hole at rest inside body S, compute the time to consume it. Confidence: LOW on the exact form. The accretion regime is the delicate part of Giddings-Mangano and must be read from the source, not reconstructed.*

- **N3.1 Accretion rate.** Regime-dependent. Bondi sets a reference, `dM/dt = 4 pi lambda_B (G M)^2 rho / c_s^3`, but for a black hole small compared to the relevant scales, and sitting inside degenerate matter (white dwarf, neutron star), the rate is modified, and Giddings-Mangano derive the applicable regime and a conservative bound. Takes: `M_BH`, `rho_S`, sound speed or degeneracy properties, regime. Produces: `dM/dt(M)`. *Floor: Bondi accretion, itself decomposing to continuity + Euler/Bernoulli + the capture radius `r_B = G M / c_s^2`; or a modified small-object law. **This node is the one to verify against the source.***
- **N3.2 Time to destruction.** `t_destroy = integral_{M_0}^{M_S} dM / (dM/dt)`. For `dM/dt` proportional to `M^2`, the early and slow growth dominates the integral. Takes: `dM/dt(M)`, initial mass `M_0`, body mass `M_S`. Produces: `t_destroy`. *Floor: separable ODE integration.*

### Closure
`t_destroy(S, under the dangerous hypothesis) < tau_S (observed age, body extant)` implies `not (dangerous accretion)`. Takes: predicted `t_destroy`, observed `tau_S`. Produces: the bound. This is the spine's comparison closing.

## The floor (store as nodes, cite the proof, do not re-derive)
Mandelstam s (fixed-target); the interaction-rate / flux integral; the Lorentz boost; the stopping-power integral (Bethe-Bloch / geometric capture); Bondi accretion (which decomposes to continuity, Euler, capture radius); separable ODE integration. These are the coordinate basis. Departures are measured against them.

## The mid-level transformations (the retrieval targets)
The astrophysical survival bound (the spine); the stopping / density-selection condition (N2.3); the accretion-to-destruction-time composition (N3.1 + N3.2). These are where reuse and departure live.

## The perturbation
Flip the top node, "stable black hole, dangerously accreting," from false to true. It propagates: Branch 1 says nature produced them, Branch 2 says a neutron star stops them, Branch 3 says `t_destroy << tau_NS`, so the cascade predicts neutron stars destroyed long ago. That contradicts the neutron stars we observe. The node the user flips turns the survival observation red. That is the load-bearing evidence made manipulable.

## Verification flags
1. **Accretion regime (N3.1), load-bearing.** The exact `dM/dt` for a micro black hole inside degenerate matter is regime-dependent and is the delicate derivation in Giddings-Mangano. Read it from arXiv:0806.3381 before formalizing; do not trust the Bondi reference form.
2. **Charged vs neutral split (N2.2), confirm.** Which bodies bound which case (charged stopped by ordinary matter and the Sun; neutral needing white dwarfs and neutron stars) should be checked against the source's exact treatment.
3. **Kinematic factor (N2.1), confirm.** `gamma_BH ~ sqrt(s)/(2 m_N)` is the right scaling for a black hole carrying the full lab energy; confirm the precise factor for the production process assumed.
