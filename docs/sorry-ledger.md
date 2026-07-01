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

*No live node markers remain. All deferred-verification gaps are discharged: the LHC case is authored across all three branches with its two Branch-2 checks verified against Giddings-Mangano (arXiv:0806.3381), and the two population-case instances are verified against the literature, covid.instance against the epidemiology (Worobey et al. 2022; the ascertainment-bias critique, Weissman JRSS-A 2024, a leading critique among several) and eggs.instance against the nutrition science (the modest, heterogeneous dietary-cholesterol-to-LDL effect and the ~1/3 hyper-responder split, Fernandez PMID 16340654). Each discharged node carries a `verified` field with its anchors. The corpus is grounded to the floor on all three cases.*

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
- **G-B. Overview "shape seen twice" language overclaimed sameness. CLOSED.**
  `docs/family-discrimination.md` concluded that the loose "population mismatch" family dies
  and is replaced by a two-stage pipeline with stage-localized failures, and that the earlier
  "departure shape seen twice ... is a reusable pattern" phrasing overclaimed sameness and
  should be replaced. Resolution: the overviews that carried the overclaim have been retired,
  and `docs/judges-document.md` now states the earned claim in their place, "the same machinery,
  three terminations, the divergence localized rather than repeated" (one shared structure with
  the failure localized at different terminations, not a repeated pattern). The overclaim no
  longer appears anywhere in the repository.
- **G-C. The atlas/cases data model is migration-pending.** The Phase 2 artifact still loads
  its graph from a DOM `<script id="kg-graph">` block (a typed claim graph in the v0.1 citation
  schema), which predates the revised node schema in `docs/schema-revisions.md`. The seed data
  modules in `data/cases/` are authored against the revised schema separately. Reconciling the
  artifact's embedded graph onto the revised schema is the schema-migration step that follows
  this checkpoint.
