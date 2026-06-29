# The API

The engine is a typed API over storage. `data/` is the canonical store; the API is the only
door above it. Clients call the API and never reach into the store. The dependency runs
clients -> API -> storage and never the reverse. The entry module is `engine/api.js`;
`createApi(sources)` returns the `api` object below.

The one rule: **read through the API, submit through the gate, never touch the store.**

## Reads are open and many

Any client may call these freely. Each takes an id (a node, an atlas entry, a client, a fork)
and returns resolved, read-only values. A read never mutates anything.

| call | takes | returns |
|---|---|---|
| `api.resolve(id)` | an id | the merged component at that id, fork-aware (a live fork's overrides merged onto its parent, a snapshot's frozen copy). `undefined` if absent. |
| `api.has(id)` | an id | whether the id resolves |
| `api.decompose(id)` | a node id | `{ node, children: [{ node, kind, expandable }] }`, one level down the decomposition |
| `api.compare(idOrAtlas)` | a node carrying `atlas_ref`, or an atlas id | `{ atlas, pipeline, stages, instances }`: the shared pipeline and, per case instance, its broken-node coordinate. `null` if there is nothing to compare. |
| `api.dependents(id)` | an id | the blast radius: every component that references it |
| `api.motions(id)` | a node id | `{ decompose, compare, perturb }`, which affordances the node offers |
| `api.classify(id)` | a node id | the structural class (transformation / primitive / given) |
| `api.gaps()` | nothing | every objective structural gap in the graph, as typed objects (below) |
| `api.gaps(id)` | a node id | the gaps at that node or anywhere in its decomposition subtree |
| `api.kinds()` | nothing | the closed set of semantic node kinds (presentation types) |
| `api.entry()` | nothing | the case's learning-first entry id |
| `api.compareTargetFor(id)` | a node id | the atlas a node can open compare on (its own `atlas_ref`, or its shared pipeline's), or `null` |
| `api.pipelineMembers(rootId)` | a pipeline root id | the set of that pipeline's nodes (root + descendants) |

## Gaps are first-class reads

What the map is missing is an objective fact about the graph, the same standing as a claim, so it
is read like any other part of the map. `api.gaps()` returns every structural gap; `api.gaps(id)`
scopes to a node's subtree. Each gap is a typed object:

```
{ kind, at, missing, discharge, sorry_ref?, ledger_ref? }
```

- `kind` is one of `grounding` (support reaches no cited terminal, or a leaf that is not a cited
  primitive), `freshness` (a dependency on a source marked superseded / retracted / stale),
  `coverage` (a claim with no rebuttal-search recorded, a question-set branch left undrawn, or an
  atlas pattern with no typed preconditions), or `dangling` (an edge to a node that does not exist).
- `at` is the node the gap is on; `missing` is what is absent; `discharge` is what would close it.
- `sorry_ref` / `ledger_ref` cross-reference the obligation in `docs/sorry-ledger.md` or
  `docs/status-ledger.md` where one exists.

A gap object never carries an importance, score, weight, rank, or priority field, and no read
orders gaps by importance. The detector reports gaps objectively; **which gap most needs closing
is a subjective judgment, deferred to assessment-layer clients, never decided in the store**
(`docs/architecture-storage-api-clients.md`). The linter proves the absence of any ranking path.

## The write is a gated submission, not CRUD

There is exactly one write, and it is not a row inserted.

```
api.submit(claim) -> { accepted, status, promoted, rule, gate, note }
```

`submit` does **not** write to the store. It submits a claim to the gate, which promotes it
only on independent corroboration: agreement counts once the agreeing parties are shown
independent. The contract enforces this, not the client, so the store cannot be quietly
written. It can only be added to under the rule, and the rule governs structure, never content.
The gate's mechanism is `compose_gate.py`, which composes two uncoordinated emitters' frozen
output with no model in the loop. A read-only client never calls `submit`.

This is the part that makes it a knowledge store rather than a database: reads are public; a
write has to earn its place.

## Why this is the whole door

The `api` object exposes reads and `submit` and nothing else. There is no setter, no store
handle, no registry. So a client *cannot* mutate the store: not by discipline, by construction.
The linter additionally proves that a client file never names the store or builds its own
resolver (see `docs/clients.md`, Phase E checks in `linter.js`). The thing most exposed to many
hands, the client layer, is provably the thing that cannot corrupt the substance.

Build status for the API and the client layer is graded in `docs/status-ledger.md` (B7, B8),
not asserted here.
