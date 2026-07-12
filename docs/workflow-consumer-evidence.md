---
Type: reference
Purpose: The consumer workflow for finding what a conclusion rests on and where its weakest link is: an assembly over the built read and decompose reads, applying the grounding rule to name the load-bearing support a synthesis hides.
Depends on: docs/workflow-atlas.md, docs/api.md, docs/clients.md
Depended on by: nothing
---

# Consumer Workflow: The Load-Bearing Evidence Finder

*Question: what is this conclusion actually resting on, and what is the weakest link in the chain that holds it up?*

## The question a reader brings

A reader has a conclusion and wants its foundation, not its summary. A synthesis answers by narrating the argument: it tells you the reasoning reads well and moves on. The evidence finder answers by walking the structure: it names the specific support path under the conclusion and points at the single node that carries the least, because that node is the one a challenge should attack and the one a synthesis hides inside fluent prose.

## The built reads it rests on

- `read(query)` returns the claim and its grounding, its declared grade and its derived-earned grade.
- `decompose(id)` returns one level down the decomposition, and the client walks it repeatedly down to the cited floor: the primitives and observations where the support terminates.

## What the client computes on top

The client applies the grounding rule, that a claim is as grounded as its weakest necessary support, to the support path it assembled by walking `decompose`. It finds the minimum-grade node on that path, the load-bearing link: the node whose grade the conclusion's grade is capped by, so that if this node fell the conclusion would fall with it. This is assessment-layer work the store defers to the client: the reads return the structure and the grades, and the client selects the weakest necessary node and presents it as the one to watch. The store computes each grade; the client picks the minimum along a path and calls it load-bearing.

## What it returns that a synthesis cannot

The support path with its load-bearing link named. Where a synthesis returns a conclusion and the confidence of its author, the evidence finder returns the actual chain from the conclusion down to the cited floor, with the weakest necessary node marked. On the LHC case, that chain descends from the no-catastrophe conclusion through the cosmic-ray survival comparison to astronomical measurement, and the finder names the node the conclusion is most fragile at. A reader does not have to trust the finder's account of the argument, because the finder handed them the path and the reader rechecks it node by node.

## The register

Assembly over built reads, and near-direct: the workflow composes `read` and a walked `decompose` and adds the grounding-rule minimum over the assembled path. It builds no new read and stores nothing; the reads are built and graded in `docs/status-ledger.md`, and the client adds orchestration and the selection of the load-bearing node. The client reads through the contract and never touches the store.
