---
Type: reference
Purpose: Maps the competition's criteria to the part of the architecture that answers each, so the argument can be checked against the tree.
Depends on: docs/epistemic_uplift.md, docs/kernel-taxonomy.md, docs/knowledge-system-what.md, docs/status-ledger.md, docs/what-stands-without-trust.md
Depended on by: nothing
---

# Where Each Criterion Lives

A map from the competition's evaluation criteria to the part of the architecture that addresses each one and its location in the repository. This is a lookup, meant to be read after the argument in `docs/what-stands-without-trust.md`, to check that argument against the tree. Build maturity is graded in `docs/status-ledger.md`; where a criterion is served by a component that is specified rather than built, it is marked here.

Read the three layers below as contribution plus contract plus thin demonstration, not three equal columns: the kernel is the domain-agnostic contribution, the API is the contract that makes its boundary real, and the periphery is a deliberately minimal demonstration surface, so a criterion served in the periphery is served by the smallest surface that shows what the kernel enables, not by a product built out. The architecture admits three kernel types along one axis, the direction of authority over the schema, domain-specific, bottom-up meta, and top-down meta; this submission is a top-down meta kernel, one schema spanning three domains as regions within it, and the taxonomy is set out in full in `docs/what-stands-without-trust.md`.

## Ingestion

Turning messy sources into typed claims tied to their origins.

| Sub-criterion | Architecture part | Location | Maturity |
|---|---|---|---|
| Messy source to typed claim | The ingestion translator and the propose path | `build/translate-trellis.mjs`, `api/client-api.mjs`, `api/providers/local-provider.mjs` | Built |
| Every claim tied to its origin | The claim record's provenance field | `kernel/schema/records.mjs` | Built |
| Grounding mode assigned at entry | The grounding modes and the type-to-floor table | `kernel/schema/confidence.mjs`, `kernel/schema/tables.mjs` | Built |
| A reader adds a claim and sees it graded | The interactive client over the read-and-propose contract | `api/client-api.mjs`, `api/providers/local-provider.mjs`, `kernel/gate/gate.mjs` | Built |

Admission is the discipline that makes ingestion sound: a claim enters only through the gate, so what is ingested is what holds together with the store, in `kernel/gate/gate.mjs`.

## Structure

The relationships among claims, made legible.

| Sub-criterion | Architecture part | Location | Maturity |
|---|---|---|---|
| Which claims support which | The typed graph and support links with grouping | `kernel/store/graph.js`, `kernel/schema/records.mjs` (support groups), `kernel/schema/edges.js` | Built |
| The same claim in different words, kept distinct from a different claim | Content-hash identity and the restatement link | `kernel/schema/records.mjs`, `kernel/schema/edges.js` | Built |
| The kinds of relation between claims | The link-kind routing: supports, contradicts, refines, depends-on, restatement | `kernel/schema/edges.js` | Built |
| How claims change over time | The store-state history chain, supersession, and decay | `kernel/store/state.mjs`, `kernel/store/patch-ledger.js`, `kernel/store/decay.mjs` | Built |

The link-kind routing is what keeps structure honest: each kind feeds exactly one computation, so support propagates grounding while a presupposition or a discourse relation does not, in `kernel/schema/edges.js`.

## Assessment

Judging the structure, and telling the reader what to believe and what to look at next.

| Sub-criterion | Architecture part | Location | Maturity |
|---|---|---|---|
| Separate a claim's force from its evidential weight | Grounding by structure rather than assertion; the gate admits by earned grade | `kernel/grounding/earned-grade.mjs`, `kernel/gate/gate.mjs` | Built |
| Flag correlated evidence treated as independent | The robustness analysis and the corroboration-independence finding | `kernel/analysis/robustness.mjs`, `kernel/schema/records.mjs` | Built |
| Find the decisive disagreement | The contradiction record with its divergence-point set, the reconciliation register, and the crux computation over it | `kernel/schema/records.mjs` (record), `kernel/analysis/reconciliation.mjs` (register and crux) | Built (Prompt 22): a within-domain crux walks the support cones for the divergence frontier, a cross-domain crux names the framing node; the crux is a candidate; on the CVD contradiction it resolves to the confounding-adjustment choice once the confounder is reified (Prompt 26), with the diabetic phenotype in the resolved region, see the status ledger |
| Surface what is missing | The gap reading and the characterized-gap reading | `kernel/analysis/gaps.js`, `kernel/analysis/characterized-gaps.mjs` | Built |
| Confidence that holds under out-of-model pressure | The confidence order with contamination, and fragility under the worst single removal | `kernel/schema/confidence.mjs`, `kernel/grounding/earned-grade.mjs`, `kernel/analysis/robustness.mjs` | Built |
| Distinguish settled from performed-settling | The floor-versus-forum split, the framing record that exposes a presupposed choice, and the characterized gap that declines to perform closure | `kernel/schema/confidence.mjs`, `kernel/composition/framing.mjs`, `kernel/analysis/characterized-gaps.mjs` | Built |

Two of these carry the sharpest of the assessment work. The characterized gap in `kernel/analysis/characterized-gaps.mjs` names exactly which claims are unmeasured and what single measurement would close each, which is surface-what-is-missing made mechanical rather than editorial. The framing record in `kernel/composition/framing.mjs` lets a reader swap a presupposed denominator and watch grounded measurements survive while a verdict reframes, which is distinguish-settled-from-performed-settling made operational: a per-unit measurement that read as a bare fact is shown to depend on a value choice held off the page.

## The criteria above the three layers

The competition also asks that a workflow scale with better AI and compound across people and teams.

| Criterion | Architecture part | Location | Maturity |
|---|---|---|---|
| Scales with new AI and interfaces | The trust boundary: fallible producers (human or model) live in the periphery, and the trusted core checks a claim's structure rather than the claimant's nature, so it is independent of what produces the claim | `kernel/` (core), `api/` (membrane), `periphery/` | Built |
| Configurable to different communities, and agent policy in particular | The parameters register's two tiers: producer and agent policy is a free parameter a community sets, not an architectural given, and the standing system makes it enforceable | `docs/parameters-register.md` (free tier: agent policy), `kernel/` (standing, specified) | Register written; standing specified (Stage 4) |
| Compounds across people and domains | The composition layer, the shared vocabulary, and the tamper-evident patch history | `kernel/composition/`, `kernel/store/patch-ledger.js` | Built |
| Stays usable against a changing user base and expanding tooling | The parameters register's two tiers, made precise: communities diverge freely across the free tier (time locks, standing rules, agent policy, type system) and stay interoperable by holding the thin required tier (typed claims, monotone grounding, the untyped type grounding nothing, claims carrying history, forkable standing); the untyped type plus retail and wholesale forks plus standards-from-use is how that plays out on the type system | `docs/parameters-register.md` (the two tiers), `kernel/composition/` (crossings, forks), `docs/what-stands-without-trust.md` (federation appendix), `docs/adversarial_walkthrough.md` (scenario five: the border refusing to launder standing) | Top-down built; bottom-up federation specified |
| Teaching uplift: bringing a reader up to speed | Modest by design, which is what the criterion's benchmark of off-the-shelf research and coding assistants measures: the thin periphery surfaces claim structure, what is load-bearing, where an argument turns, what is unmeasured, rather than trying to explain a topic faster than a strong synthesis does | `periphery/` (the thin demonstration surface), the guided path in `submission.html` (the three cases walked) | Present, real, not the contribution |
| Claim uplift: the claim itself made checkable, composable, and able to survive the removal of trust | Two components. Present: mechanical grounding makes a claim's standing checkable, the exclusion record makes a refutation stick, provenance makes an origin traceable, the crux locates a disagreement's frontier. Enabled: separating trust from view lets a market of interfaces compose over shared checkable trust, so claim uplift compounds across many peripheries, enabled and not guaranteed, the credit sought being for the enablement the compounding and scaling criteria ask the evaluator to weigh | `kernel/grounding/`, `kernel/analysis/` (present, on the three cases), `docs/epistemic_uplift.md` and `docs/what-stands-without-trust.md` (the axes and the scoping note), the external contract's feasibility (the enablement) | Present component built; enabled component argued |
| Adversarial robustness, the gate gamed or the write path captured | Cost from time-locked standing plus damage capped by forkability and the untyped-type border | `docs/adversarial-robustness.md` (the solution type), `docs/adversarial_walkthrough.md` (five worked attacks) | Recoverable half built (forkability runs today); cost half specified, Stage 4, with [S1] open |

The trust boundary is what lets a stronger model improve the periphery without touching what the core guarantees, checked as a property of the import graph by `build/check-map.mjs`. The composition layer is what lets a question span domains without merging them into one floor: nutrition, environment, and economics ground to their own floors and a spanning question composes them, in `kernel/composition/`. The operational form of that compounding, the concrete steps a team follows to add claims, fork a crossing, or add a domain and have it compose, is the guide in `docs/extending-the-kernel.md`. Maintainability is the same machinery read forward in time, and `docs/parameters-register.md` is what makes the configurability claim precise: it draws the line between the free tier a community sets to its own situation (time locks, standing rules, agent policy, type system) and the thin required tier every kernel must hold to stay composable. Communities diverge across the free tier and stay interoperable by holding the required tier, which is diversity in the free tier and unity in the required tier. On the type system in particular, because the untyped type is not a floor and nothing grounds through it, a new domain or a foreign schema meets the tree at the untyped type and earns standing only by an owned fork, retail per claim or wholesale per category, so the format absorbs a changing user base and new tooling without a central schema authority legislating the additions, and the shared vocabulary is what accumulated forks have proven in use.

The two uplift rows are ordered, not independent, and the order is why the split matters for how the criterion is read. A better synthesis raises teaching uplift while leaving the claim beneath it unchecked, because in a synthesis the claim was never a separable object; this submission raises claim uplift, the upstream axis, so a teaching-axis benchmark cannot register its contribution and cannot credit the teaching that contribution seeds, which is the gap in the instrument that `docs/reading-the-brief.md` names and the argument in `docs/epistemic_uplift.md` develops. The deepest form of claim uplift is the production of knower-independent knowledge, a claim that stands when trust in whoever asserted it is subtracted, which is the definition of knowledge the whole submission runs on, so the uplift axis and the definition line up: to raise claim uplift to its limit is to make the claim hold without its knower.
