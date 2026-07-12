---
Type: reference
Purpose: The consumer workflow for auditing a graph against a motivated reader: an assembly over the built robustness, dependents, and gaps reads, surfacing claims doing heavy work on thin support and where standing is fragile to a single re-grade, strongest when run on the submission's own cases.
Depends on: docs/workflow-atlas.md, docs/api.md, docs/clients.md
Depended on by: nothing
---

# Consumer Workflow: The Adversarial Auditor

*Question: is this graph gamed? Would it survive someone who wants the opposite conclusion and is looking for the weak joint?*

## The question a reader brings

A reader distrusts the graph and wants to break it. A synthesis gives such a reader nothing to grip: challenged, it offers its author's judgment as the final word, and a motivated skeptic is left arguing with a viewpoint. The adversarial auditor hands the skeptic the knife. It surfaces the claims doing heavy work on thin support and the places where standing is fragile to a single re-grade, so a reader who wants the opposite conclusion knows exactly where to attack and can check whether the attack lands.

## The built reads it rests on

- `robustness(query)` returns each claim's grade, its robustness (the earned grade after the worst single removal from its support closure), whether it is fragile, its single points of failure, and the correlated-evidence flag that catches evidence presented as independent when it shares a source.
- `dependents(id)` returns the blast radius of a node: every component that references it, so the auditor sees how far a single re-grade would propagate.
- `gaps(query)` returns claims in force whose earned grade does not cover their declared grade: the places where the graph is standing on more than it has earned.

## What the client adds

The motivated-reader framing. The reads return fragility, blast radius, and gaps objectively; the client composes them into the audit a skeptic would run, surfacing claims that do heavy work on thin support (high blast radius, low robustness) and standing that is fragile to a single re-grade (fragile claims whose single point of failure sits under a widely-referenced conclusion). This is assessment-layer judgment the store defers: gap objects carry no importance or rank field, and no read orders them, so which fragility a reader should worry about most is the client's call, decided in the audit and never in the store.

## What it returns that a synthesis cannot

A runnable audit of the graph's fragility. Where a synthesis returns confidence, the auditor returns the worst-single-removal grade, the single points of failure, and the correlated-evidence flags, so a reader runs the attack instead of trusting the defense. On the LHC case it surfaces the antecedent as a fragile conjunction and names the one genuinely redundant node; on a case where three legs read independent but share a reified dependency, the correlated-evidence flag catches the apparent robustness collapsing to a single shared support. The audit is strongest run on the submission's own cases, because handing a skeptic the knife to the author's own graph is the strongest possible demonstration that the standing was earned rather than performed.

## The register

Assembly over built reads. The workflow composes `robustness`, `dependents`, and `gaps` and adds the motivated-reader framing, storing nothing. The reads are built and graded in `docs/status-ledger.md`; the client reads through the contract and never touches the store.
