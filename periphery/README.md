---
Type: reference
Purpose: Describes the fallible producer-and-view layer for a reader who has opened periphery/, deferring the whole-system story upward.
Depends on: nothing
Depended on by: nothing
---

# periphery/

This is where the fallible producers live, of any kind: the ingesters, authors, red-teamers, and every render surface. It is deliberately thin, a demonstration surface rather than a product, the smallest set of tools that shows what a checkable kernel enables. It is also where the market of views forms: many interfaces over one shared trust.

## What it is responsible for, and what it may never do

It is responsible for producing and presenting: reading messy material into candidate claims, letting a person or agent author and object, and rendering the graph so a reader can walk it, compare cases, and flip an assumption. Each surface is one question asked of the same structure, and new surfaces compose over the same kernel.

It may never touch the store. It has no way to write a truth field, and it never imports the kernel directly. It processes and it proposes; the proposal goes to the gate, which decides, and the periphery renders whatever comes back. Anything it computes is a view, not grounding.

## What it exposes, and what it depends on

Upward it exposes nothing to the kernel; it is the top of the dependency graph. It exposes surfaces to a human or agent reader: the presentation shell and its modules, the thin and fat clients, the propose widget. Downward it depends only on `api/`, reaching the kernel through that contract and never around it (`periphery -> api -> kernel`).

## The invariant it enforces

Fallible-producers, not fallible-AI, live here, and this is the source of that framing: a producer is anything that emits claims, human or model or pipeline, and the kernel checks them all the same. The boundary is checkable-core versus fallible-producer, not human versus AI. So a periphery module may be wrong, may be replaced, may be one of many rival views, and none of that reaches the stored truth, because everything it does is read through the contract and proposed through the gate. Which producers may perform which steps is a configured policy (the free tier of `docs/parameters-register.md`), not a property baked in here.

## What lives here

- `navigate/`, the reading surfaces: the presentation shell and its modules, the thin and fat clients, the render components, the compose-gate and propose widgets.
- `ingest/`, `author/`, the producer surfaces that read messy material and author claims into proposals.
- `assess/`, `query/`, `filter/`, the consumer surfaces that read the graph and select what a reader sees.
- `redteam/`, the surface for attacking the graph, proposing objections and refutations.

---

For the whole-system argument, and the market-of-views case in particular, see the top-level [`README.md`](../README.md), the judges document [`docs/what-stands-without-trust.md`](../docs/what-stands-without-trust.md), and [`docs/epistemic_uplift.md`](../docs/epistemic_uplift.md). For how to work in this tree, see the agent orientation in [`CLAUDE.md`](../CLAUDE.md).
