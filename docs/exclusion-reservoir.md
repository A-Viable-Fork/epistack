# Exclusion Reservoir

Patterns rejected, each with the condition that would reactivate it. A kill without its
reactivation condition is a kill you cannot revisit. Seeded from the exclusion reservoir in
`docs/design-axioms.md`; new exclusions are appended here as they are decided.

| pattern | excluded because | reactivate when |
|---|---|---|
| A framework with a dev-server-only mode | breaks standalone-open (T0-6) | the build still emits a single file that opens from `file://` |
| ~~Computed perturbation in v1~~ **DISCHARGED (Prompt 21)** | silent-error risk: a wrong propagation rule misleads silently (T1-3) | ~~authored consequences exist for every case AND a rule audit exists~~ both conditions met: the authored cascade is retained as the verification fixture and the rule audit exists (`build/check-perturb.mjs`) |
| Inheritance hierarchies for node kinds | rigidity; fights T1-4 | never; use a kind tag with composed behavior |
| A global mutable store for graph or UI state | hidden state (T0-3) | never |
| Bundling that minifies or obfuscates the submission source | the source is the forkable artifact and a judge may read it | never for the submission build; a separate minified build is fine if the readable one stays the deliverable |
| Re-deriving a primitive in the engine to avoid a citation | breaks the decomposition floor (T1-2) | never |

The "Computed perturbation in v1" row is **discharged** (Prompt 21). Both reactivation conditions are
now met. The rule audit exists and is asserted mechanically in `build/check-perturb.mjs`: the
propagation runs along support edges only (inputs, children, produced_by, outputs, tests, the same
inference edges the earned-grade fold reads), and a node collapses only when the flip reaches it
through those edges, so no collapse is asserted that does not follow from a lost support. The authored
consequence cascade the assumptions carry is retained as the verification fixture the computed rule
must reproduce; on every perturbable assumption in the corpus (the LHC danger flip) the computed
cascade reproduces the authored one exactly, states, trail topology, and consequence prose. The
silent-error risk the hold guarded against is answered not by trusting the rule but by pinning it to
the authored ground truth: a mismatch stops and reports, so a wrong rule cannot mislead silently.
`kernel/motions/perturb.js` now COMPUTES the cascade from the support graph (the same
removal-and-recompute the robustness analysis runs for the worst single removal, aimed at a chosen
flip); the overlay stays non-destructive.

## Appended during setup

| pattern | excluded because | reactivate when |
|---|---|---|
| Fixing the `TRACK_LABELS` bug during the Phase 2 migration | the migration is behavior-preserving; a fix is a behavior change and would hide what the original did (see sorry-ledger G-A) | the schema-migration phase, as a deliberate, separately-reviewed change |
| Authoring LHC Branches 1 and 3 from the cascade sketch | the task floor is Branch 2 only; the others are stubbed so their absence is honest, not invented (sorry-ledger `lhc.branch1#sorry`, `lhc.branch3#sorry`) | the branches are authored to the floor with cited primitive leaves, Branch 3 after its accretion regime is verified against the source |
