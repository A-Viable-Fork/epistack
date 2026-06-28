# CLAUDE.md

Guidance for working in this repo. Keep it short; a long file here is a smell.

## What this is

A typed claim-graph epistemic engine. Every claim is a node carrying its kind, its
verification state, and its provenance. The novel property is composition: one shared
typed schema lets uncoordinated investigations accrete onto a single map. The deliverable
is one standalone interactive artifact, `submission.html`, that a judge double-clicks to open.

The binding design document is `docs/design-axioms.md`. Tier 0 there is non-negotiable.
Where the spec and the schema doc disagree, `docs/schema-revisions.md` wins on the data model.

## Hard constraints (do not violate)

- **Standalone open.** The built artifact runs from `file://` with no server, no network
  call, no install a browser lacks. The Pyodide compose-gate runner loads in-browser. Any
  dependency that breaks a double-click to open is out.
- **No Constitutional Kernel**, by name or apparatus, in any judge-facing text.
- **Gaps are first-class.** Every unverified node carries a `sorry` or `TODO_verify` marker,
  and every marker is listed in `docs/sorry-ledger.md`. Never fill, guess at, or quietly
  resolve a deferred-verification gap.
- **Generation is not verification.** Mark which is which. A claim states whether it was
  generated or verified, and by whom. Do not present author-typed as verified.

## Architecture rule

Three layers, dependency arrows one way, never crossed:

    data/   pure values. schema.js is the single source of truth every node imports.
    engine/ pure logic, DOM-free: no window, no document. Runs headless.
    view/   reads the engine, renders, owns no data.

view depends on engine depends on data. A DOM call in `engine/` or a data literal in
`view/` is a Tier 0 violation. A new case is a data file under `data/cases/`; adding one
never edits the engine or the view.

## Disciplines

- One schema. No module redefines a node shape or hand-rolls a parallel structure.
- No hidden state. State is explicit and passed; no globals, no mutable singletons,
  no localStorage. Perturbation is an overlay, not a mutation.
- Keep `docs/corpus-index.md` current: every module and data file is listed there; the
  linter flags any file not in the index.
- Module head comment, three lines: role, contract, invariant. Comment the why, not the what.
  Greppable markers: `// SORRY:`, `// DEPARTURE:`, `// CONTRACT:`.
- No em dashes in prose, code, or commits. Use a comma, a period, or restructure.

## Build and check

    node build/bundle.js   # inline data + engine + view into submission.html
    node linter.js         # fields, references, sorry-ledger, layer boundaries, corpus index
