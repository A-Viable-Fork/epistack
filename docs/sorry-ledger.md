---
Type: record
Purpose: "Records the open deferred-verification obligations, one line per marker, as the ledger the linter reproduces."
Depends on: [docs/design-axioms.md]
Depended on by: [docs/governing-trellis.md, docs/status-ledger.md]
---

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
  and `docs/what-stands-without-trust.md` now states the earned claim in their place, "the same machinery,
  three terminations, the divergence localized rather than repeated" (one shared structure with
  the failure localized at different terminations, not a repeated pattern). The overclaim no
  longer appears anywhere in the repository.
- **G-C. The atlas/cases data model was migration-pending. CLOSED.** The reconciliation this line
  named, getting the separately-authored case modules and the artifact's embedded v0.1 graph onto
  one schema, is resolved. The cases are unified under the v3 model in `corpora/` (the pre-reorg
  `data/cases/` path no longer exists), carried there by the trellis-to-v3 translator that
  reproduces the grounding (`build/translate-trellis.mjs`, `build/check-migrate.mjs`,
  `docs/schema-revisions.md`). The v0.1 embedded `<script id="kg-graph">` graph survives only in
  the archived classic submission (`archive/`), which no build target ships, so the migration step
  is done rather than pending.

- **G-D. The math kernel's recurrence properties sit at checked, not proof-floor. OPEN.** The math
  kernel (`corpora/math/`, the sixth exhibit) grounds its lattice laws at the constitutive proof-floor
  by exhaustion (`build/check-math-exhaustion.mjs`, a complete proof over the finite grade domain). Its
  recurrence, contamination, and crossing properties (`thm.earned-recurrence`, `thm.earned-linear`,
  `thm.ungrouped-singleton`, `thm.cycle-guard`, `thm.settled-not-inherited`, `thm.determinism`,
  `thm.contamination-monotone`, `thm.crossing-min`, `thm.untyped-floor`) are grounded at the checked
  tier by differential testing (`build/check-math-differential.mjs`), the tier random-trial agreement
  reaches. These properties are provable over their unbounded domain but are not yet proven here. The
  closing condition is a formal proof-assistant proof of each recurrence property, which would let it
  re-type from a checked measurement to a proof-floor theorem citing `src:formal-proof`. This is the
  honest gap between the tier the evidence reaches (checked, by testing) and the tier the property
  admits (proof-floor, by formal proof); it is not a node marker, so it is tracked here in prose rather
  than in the machine-checked table above.

- **G-E. The comment kind's never-citable rule has no rules-vocabulary home. OPEN.** The comment
  kind (`corpora/_shared/common-types.js`) needs one further rule beyond kind and ceiling: no record
  of kind `comment` may occupy a support role in any link. The discipline that added it preferred
  expressing this as bundle data, a link-role restriction carried in the bundle's rules field, so it
  would be community policy structuralized with zero core touch. `kernel/schema/tables.mjs`'s kind
  table carries no rules field at all (`makeKindTable` reads only `kind`, `ceiling`, and
  `compatibility_rule_id`; the word "rules" appears nowhere live in the kernel, only as unenforced
  prose in `kernel/schema/type-hash.mjs`'s header). So the rule is enforced instead by a named,
  gate-adjacent validation (`kernel/gate/comment-guard.mjs`'s `rejectCommentSupport`, called before
  `decide` on the local provider's write path, `api/providers/local-provider.mjs`), checked by
  `build/check-comment.mjs`. The closing condition is a rules-vocabulary extension to the kind
  bundle and `makeKindTable`, a per-kind link-role restriction the gate reads and enforces natively,
  at which point this guard retires into bundle data and the gate needs no comment-specific code at
  all.

- **G-F. The self-kernel asserts claims carry their full history, which no oracle yet grounds. OPEN.**
  The self-kernel (`corpora/self/`, the reflexive exhibit) grounds eleven structural invariants at the
  checked tier over cited math theorems and checks, but its twelfth invariant, `self.history` (every
  admitted claim carries its full history, its origin, the borders it crossed, and the forks that
  retyped it, so any crossing is auditable end to end), grounds nothing and floors to asserted, because
  the v3 record (`kernel/schema/records.mjs`) carries no first-class history or provenance field and no
  oracle verifies a complete traceable chain. Composition and provenance are asserted in the design
  (`docs/composition-spec.md`, "Claims carry their history"), but the running system does not yet make
  the property mechanical. The claim is entered at the floor with no citation rather than lifted by a
  citation that does not support it; the gap is the honest output. The closing condition is a
  first-class history/provenance field in the v3 record plus an oracle that verifies every admitted
  claim carries a complete, traceable history chain of its origin, its crossings, and the forks that
  retyped it, end to end, at which point `self.history` re-types from a floored assertion to a checked
  measurement citing that oracle. This is not a node marker, so it is tracked here in prose.
