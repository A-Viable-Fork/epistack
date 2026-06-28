# Sorry Ledger

Every open obligation, named. This is a build artifact: the honest unit of progress is the
named gap. Per design axiom T0-5 and linter rule 3, the machine-checked table below is kept
in one-to-one correspondence with the `sorry` / `TODO_verify` markers carried by nodes in
`data/`. The linter fails on a node marker not listed here, and on a row here with no live
node marker.

A marker key is `<node_id>#<field>`, where `field` is `sorry` or `TODO_verify`.

## Machine-checked: node markers (1:1 with `data/`)

| marker key | kind | gen/ver | gap | resolves when |
|---|---|---|---|---|
| `lhc.branch1#sorry` | stub | generated | Branch 1 (production: N1.1 fixed-target CoM energy, N1.2 collision count, N1.3 cross-section cancellation) is named in `docs/lhc-cascade.md` but NOT authored to the floor in the data. | Branch 1 nodes are authored with full fields and primitive leaves cited, per the cascade doc. |
| `lhc.branch3#sorry` | stub + deferred-verification | generated | Branch 3 (accretion: N3.1 accretion rate, N3.2 time to destruction) is NOT authored to the floor. It also carries the load-bearing **accretion-regime deferred verification**: the exact `dM/dt` for a micro black hole inside degenerate matter is regime-dependent and must be read from Giddings-Mangano (arXiv:0806.3381), not reconstructed from the Bondi reference form. | Branch 3 is authored AND N3.1's accretion regime is verified against arXiv:0806.3381. Do not resolve by guessing the rate. |
| `lhc.N2.1#TODO_verify` | deferred-verification | generated | The kinematic factor `gamma_BH ~ sqrt(s)/(2 m_N)` is the right scaling for a black hole carrying the full lab energy; the precise factor for the assumed production process is unconfirmed. | The factor is confirmed against the source treatment. |
| `lhc.N2.2#TODO_verify` | deferred-verification | generated | The charged/neutral stopping split is load-bearing, and which bodies bound which case (charged: ordinary matter and the Sun; neutral: white dwarfs and neutron stars) is asserted from structure, not yet checked against the source's exact treatment. | The split and body assignment are checked against arXiv:0806.3381. |
| `covid.instance#TODO_verify` | deferred-verification | generated | Which specific COVID clustering analysis is instanced, and whether selection (stage-1 representativeness) is the dominant critique of it or one of several. The pipeline placement (stage-1 failure) is structural and robust; the case-specific instantiation is not yet verified. | The specific analysis and the dominance of the selection critique are checked against the actual analyses. Cannot move the stage-1 verdict. |
| `eggs.instance#TODO_verify` | deferred-verification | generated | The eggs effect sizes and the strength of the hyper/hypo-responder split (the stage-2 sufficiency failure) are asserted, not quantified against the nutrition literature. | The effect sizes and heterogeneity are quantified against the literature. Cannot move the stage-2 verdict. |

## Prose: gaps that are not node markers

Not checked one-to-one by the linter (they are not node fields), but tracked here because a
kill or a discrepancy without a record is one you cannot revisit.

- **G-A. `TRACK_LABELS` is undefined in `knowledge-game.html`.** Discovered during the Phase 2
  migration. `view/card.js` (`vectorEl`, originally line 2693) references a `TRACK_LABELS`
  map that is never defined in the source, so opening a node carrying a `vector` throws a
  `ReferenceError` mid-render. This is a latent bug in the original artifact. The migration
  **preserves** it (behavior-preserving mandate; do not quietly resolve). Boot does not hit
  it, so there is no load-time console error. Reactivation: fix in the schema-migration phase
  by defining the track labels, which is a deliberate behavior change, not part of the migration.
- **G-B. Overview "shape seen twice" language is superseded but not yet edited.**
  `docs/family-discrimination.md` concludes that the loose "population mismatch" family dies
  and is replaced by a two-stage pipeline with stage-localized failures, and states that the
  "departure shape seen twice ... is a reusable pattern" phrasing in `docs/executive-overview.md`
  and `docs/judge-overview.md` overclaims sameness and **should be replaced**. That edit is a
  content change outside the scope of Phases 0-4 and is deferred, not silently applied.
  Reactivation: when the overviews are revised, swap the repetition claim for the earned
  shared-structure-with-stage-localized-failures claim.
- **G-C. The atlas/cases data model is migration-pending.** The Phase 2 artifact still loads
  its graph from a DOM `<script id="kg-graph">` block (a typed claim graph in the v0.1 citation
  schema), which predates the revised node schema in `docs/schema-revisions.md`. The seed data
  modules in `data/cases/` are authored against the revised schema separately. Reconciling the
  artifact's embedded graph onto the revised schema is the schema-migration step that follows
  this checkpoint.
