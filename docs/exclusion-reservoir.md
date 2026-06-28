# Exclusion Reservoir

Patterns rejected, each with the condition that would reactivate it. A kill without its
reactivation condition is a kill you cannot revisit. Seeded from the exclusion reservoir in
`docs/design-axioms.md`; new exclusions are appended here as they are decided.

| pattern | excluded because | reactivate when |
|---|---|---|
| A framework with a dev-server-only mode | breaks standalone-open (T0-6) | the build still emits a single file that opens from `file://` |
| Computed perturbation in v1 | silent-error risk: a wrong propagation rule misleads silently (T1-3) | authored consequences exist for every case AND a rule audit exists |
| Inheritance hierarchies for node kinds | rigidity; fights T1-4 | never; use a kind tag with composed behavior |
| A global mutable store for graph or UI state | hidden state (T0-3) | never |
| Bundling that minifies or obfuscates the submission source | the source is the forkable artifact and a judge may read it | never for the submission build; a separate minified build is fine if the readable one stays the deliverable |
| Re-deriving a primitive in the engine to avoid a citation | breaks the decomposition floor (T1-2) | never |

## Appended during setup

| pattern | excluded because | reactivate when |
|---|---|---|
| Fixing the `TRACK_LABELS` bug during the Phase 2 migration | the migration is behavior-preserving; a fix is a behavior change and would hide what the original did (see sorry-ledger G-A) | the schema-migration phase, as a deliberate, separately-reviewed change |
| Authoring LHC Branches 1 and 3 from the cascade sketch | the task floor is Branch 2 only; the others are stubbed so their absence is honest, not invented (sorry-ledger `lhc.branch1#sorry`, `lhc.branch3#sorry`) | the branches are authored to the floor with cited primitive leaves, Branch 3 after its accretion regime is verified against the source |
