# CLAUDE.md

Guidance for working in this repo. Keep it short; a long file here is a smell.

## What this is

A typed claim-graph epistemic engine. Every claim is a node carrying its kind, its
verification state, and its provenance. The novel property is composition: one shared
typed schema lets uncoordinated investigations accrete onto a single map. The deliverable
is one standalone interactive artifact, `submission.html`, that a judge double-clicks to open.

The orientation for the whole goal is the three blueprints, `docs/knowledge-system-what.md`
(the functions), `docs/knowledge-system-how.md` (the makeup), and `docs/knowledge-system-why.md`
(the rationale); `docs/judges-document.md` is the competition-facing summary.

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

One trust boundary, crossed only through the membrane. Dependency arrows one way (T0-2):

    kernel/    trusted core. Pure logic, DOM-free: no window, no document. Runs headless.
               schema/ carries the one schema and the lattice. Imports only kernel/.
    api/       the sole membrane. Imports kernel/ (and api/); never the periphery.
    periphery/ fallible: every AI component + every render surface. Reaches the kernel
               only through api/, never kernel/ directly.
    corpora/   pure data, imported by nothing (a corpus->corpus reference is data).

periphery -> api -> kernel; corpora is data; build/ may reach any layer. A DOM call in
`kernel/` or `api/`, or a `periphery` module importing `kernel` directly, is a Tier 0
violation. A new case is a folder under `corpora/`; adding one never edits the kernel.
`build/check-map.mjs` derives the import graph and enforces the boundary.

**Reference, never inline.** Every shared thing (a primitive, a transformation, a card
layout, a visual, a teaching block) lives once at a stable id and is referenced by it;
nothing shared is duplicated. Lookups go through one resolver, `resolve(id)`. A thing earns
a stable id only when it is shared or likely forked; one-off content stays inline. See
`docs/components-and-forking.md`.

## Disciplines

- One schema. No module redefines a node shape or hand-rolls a parallel structure.
- No hidden state. State is explicit and passed; no globals, no mutable singletons,
  no localStorage. Perturbation is an overlay, not a mutation.
- Keep `docs/corpus-index.md` current: every module and data file is listed there; the
  linter flags any file not in the index.
- Module head comment, three lines: role, contract, invariant. Comment the why, not the what.
  Greppable markers: `// SORRY:`, `// DEPARTURE:`, `// CONTRACT:`.
- No em dashes in prose, code, or commits. Use a comma, a period, or restructure.
- Status ledger is the single source of build truth. `docs/status-ledger.md` is the only place
  build status is asserted; a PR is not done until the ledger line it affects moves, by exactly
  the amount actually built. Prose elsewhere cites a ledger entry rather than re-hedging.

## The shape: storage, a typed API, clients

`corpora/` is storage, the one canonical typed graph. The `kernel/` is a typed core and `api/`
is a typed API over it: reads (`resolve`, `decompose`, `compare`, `dependents`, `gaps`) are open;
a write is `submit(claim)` to the gate, which promotes only on independent corroboration, never a
direct store mutation. Periphery surfaces consume the API and touch no truth field. See
`docs/api.md`, `docs/clients.md`, `docs/knowledge-system-how.md`.

## Build and check

    node build/bundle.js       # inline kernel + api + corpora + periphery into submission.html
    node linter.js             # fields, references, sorry-ledger, trust boundary, corpus index
    node build/check-gaps.mjs  # the gap detector reproduces the sorry ledger (5 gaps)
    node build/check-perturb.mjs  # the perturbation overlay is pure and deterministic
    node build/check-map.mjs   # derives the repo's import graph, enforces the trust boundary
