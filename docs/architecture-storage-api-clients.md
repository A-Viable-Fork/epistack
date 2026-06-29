# Architecture: Storage, a Typed API, and Many Clients

*The substrate is a store of knowledge with an interface over it, in the shape every engineer already knows: a canonical store, a typed API, and many clients. It applies its own principle to the interface, canonical content and forkable everything else, which is what lets many ways of reading and working the map be built and shared while the store stays one and protected. This supersedes the earlier "presentation separation" framing; that framing was this one seen only at its shallowest layer.*

## The shape

- **Storage** is the typed claim-graph: claims with their type, verification state, and provenance, the atlas, the kill and departure records. This is what is true. It is canonical, and there is exactly one of it.
- **The API** is the engine: a stable, documented contract of operations over the store. Reads are open. Writes are gated. The gate and the typing rule are part of the contract.
- **Clients** are everything that reads or works the map. They consume the API and never reach into the store. They are open and they fork freely.

The dependency runs clients → API → storage and never the reverse.

## Storage

One authoritative graph. A claim is a node carrying its type, its verification state, and a path back to what supports it. The store is not a passive table: it is the thing the gate protects, and its integrity is the one property the whole design exists to keep.

## The API, and why it is not CRUD

The engine exposes the store as a typed contract.

- **Reads are open and many.** Resolve a node, decompose it, compose two investigations, compare clones across cases, query what depends on what. Any client may call these freely.
- **Writes are gated.** Adding a claim is not inserting a row. It is submitting the claim to the gate, which promotes it only on independent corroboration, agreement counted only once the agreeing parties are shown independent. The contract enforces this, not the client. So the store cannot be quietly written; it can only be added to under the rule, and the rule governs structure and never content.

This is the part that makes it a knowledge store rather than a database. Reads are public; a write is a submission that has to earn its place.

## Clients, in two tiers

A client is a forkable unit over the untouched store. It is read-only against truth: it may read what the API exposes and submit through the gate, but it can never reach in and rewrite a claim. Clients differ only in how much of the API they use.

- **Thin client.** Uses the default read path and only restyles what comes back, its own tokens and its own mapping from node kind to look. Because the set of node kinds is closed and graph-owned, a thin client covers every kind and so renders every node. This is the five-minute fork, and it carries a guarantee: every thin client can render the whole map.
- **Fat client.** Calls more of the API and composes the results its own way. It can lead with a different operation, re-sequence how the map is entered, recompose what a single view shows, redefine what acting on a node kind does. It trades the render-everything guarantee for power, and it is the heavier fork. A teaching walk, an auditor's inspection surface, a research compose-and-fork console, and a bare data browser are four fat clients over one store, not four paint jobs.

Both tiers are forks over the same store; both are sealed off from truth; the line between them is depth of API use, not appearance.

## The boundary, enforced

The linter proves the boundary rather than trusting it. A client may call the API; it may not touch storage, a truth field, or the graph directly. A thin client contains only tokens and a kind-to-look mapping and must cover every node kind, and no node kind exists that some thin client cannot render. A fat client may rebind operations, order, and layout, and still cannot reach a truth field. A new client of either tier cannot break a claim. The thing most exposed to many hands, the client layer, is provably the thing that cannot corrupt the substance.

## What the shape buys

- **Accessibility is a client concern.** The same store serves a newcomer's plain reader with a picture and a specialist's terse console, because both are just clients. The teaching layer is a client over the store, not a second store to keep in sync.
- **Composition is an API guarantee.** Two clients writing through the same gated contract compose because the contract, not the client, enforces independence. `compose_gate.py` is that guarantee exercised across two uncoordinated emitters.
- **Anti-capture is an API property.** The contract governs structure and never content, so a more capable client can flood the read side and submit all it likes, all of it judged the same way, and gains no power the contract does not grant. It cannot rewrite the gate.
- **Two axes of accretion.** Investigations accrete onto one store; clients multiply and improve how it is read and worked. The first compounds what is known, the second compounds how well it can be used, and neither can touch the other.

## Status

The store-and-API boundary is real and built; the client layer as a first-class, low-barrier thing is the active extension. Build status for this and every other claim is graded in one place, `docs/status-ledger.md` (entries B7 and P1 here), rather than restated per document.
