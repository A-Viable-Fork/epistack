---
Type: reference
Purpose: "The consumer workflow for finding where a disagreement actually turns: an assembly over the built reconciliations read, which computes each contradicts-linked pair's crux on read, with the client adding presentation and selection because the crux is a candidate not a verdict."
Depends on: [docs/workflow-atlas.md, docs/api.md, docs/clients.md]
Depended on by: []
---

# Consumer Workflow: The Crux Locator

*Question: where does this disagreement actually turn? Not what each side says, but the single node the whole dispute rests on.*

## The question a reader brings

A reader has two positions in conflict and wants the crux, not the transcript. A synthesis of a disagreement narrates both sides and, at best, tells you where the author thinks they part; you are trusting one reader's account of where the real hinge is. The crux locator walks the structure instead and returns the specific node the disagreement turns on, so a reader can argue about the one thing that matters rather than the whole exchange.

## The built read it rests on

- `reconciliations(query)` returns each contradicts-linked pair with its computed crux. The crux is computed on read, the same way grounding and robustness are, and the reading routes by shape: a within-domain contradiction walks each side's support cone and returns the divergence frontier, where the cones stop sharing structure, as the crux candidate set; a cross-domain weighing names the framing node the disagreement rests on. This is a single built read, and the workflow maps almost directly onto it.

## What the client adds

Presentation and selection. The crux is a candidate, never a verdict, and a shallow frontier is a finding rather than a failure, so the client's job is to present the candidate set legibly and let a reader select among the nodes the read surfaced. On the COVID case the read resolves the origin crux to the four prior claims, with the shared evidence sitting in the resolved sub-region; the client presents that frontier and does not pretend to adjudicate it. This is the assessment-layer judgment the store defers: which candidate to lead with, and how to frame a shallow frontier, are the client's to decide, and the store computes the crux and stops.

## What it returns that a synthesis cannot

The single node a disagreement turns on, localized instead of narrated. A synthesis returns a balanced account and a reader still does not know where to push. The crux locator returns the divergence frontier, and a reader sees that the COVID dispute turns on the priors and not on the shared evidence, so the argument moves to the priors where it belongs. Localizing the crux is structural work prose cannot do, because prose cannot walk two support cones and report where they stop sharing structure.

## The register

Assembly over a built read; this maps almost directly onto `reconciliations`. The workflow adds presentation and selection over a read that already computes the crux, and stores nothing. The read is built and graded in `docs/status-ledger.md`; the client reads through the contract and never touches the store.
