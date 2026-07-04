# Where Each Criterion Lives

A map from the competition's evaluation criteria to the part of the architecture that addresses each one and its location in the repository. This is a lookup, meant to be read after the argument in `docs/what-stands-without-trust.md`, to check that argument against the tree. Build maturity is graded in `docs/status-ledger.md`; where a criterion is served by a component that is specified rather than built, it is marked here.

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
| Find the decisive disagreement | The contradiction record with its divergence-point set, the reconciliation register, and the crux computation over it | `kernel/schema/records.mjs` (record), `kernel/analysis/reconciliation.mjs` (register and crux) | Built (Prompt 22): a within-domain crux walks the support cones for the divergence frontier, a cross-domain crux names the framing node; the crux is a candidate, and on the CVD contradiction a shallow finding, see the status ledger |
| Surface what is missing | The gap reading and the characterized-gap reading | `kernel/analysis/gaps.js`, `kernel/analysis/characterized-gaps.mjs` | Built |
| Confidence that holds under out-of-model pressure | The confidence order with contamination, and fragility under the worst single removal | `kernel/schema/confidence.mjs`, `kernel/grounding/earned-grade.mjs`, `kernel/analysis/robustness.mjs` | Built |
| Distinguish settled from performed-settling | The floor-versus-forum split, the framing record that exposes a presupposed choice, and the characterized gap that declines to perform closure | `kernel/schema/confidence.mjs`, `kernel/composition/framing.mjs`, `kernel/analysis/characterized-gaps.mjs` | Built |

Two of these carry the sharpest of the assessment work. The characterized gap in `kernel/analysis/characterized-gaps.mjs` names exactly which claims are unmeasured and what single measurement would close each, which is surface-what-is-missing made mechanical rather than editorial. The framing record in `kernel/composition/framing.mjs` lets a reader swap a presupposed denominator and watch grounded measurements survive while a verdict reframes, which is distinguish-settled-from-performed-settling made operational: a per-unit measurement that read as a bare fact is shown to depend on a value choice held off the page.

## The criteria above the three layers

The competition also asks that a workflow scale with better AI and compound across people and teams.

| Criterion | Architecture part | Location | Maturity |
|---|---|---|---|
| Scales with new AI and interfaces | The trust boundary: fallible AI lives in the periphery, the trusted core is independent of it | `kernel/` (core), `api/` (membrane), `periphery/` | Built |
| Compounds across people and domains | The composition layer, the shared vocabulary, and the tamper-evident patch history | `kernel/composition/`, `kernel/store/patch-ledger.js` | Built |

The trust boundary is what lets a stronger model improve the periphery without touching what the core guarantees, checked as a property of the import graph by `build/check-map.mjs`. The composition layer is what lets a question span domains without merging them into one floor: nutrition, environment, and economics ground to their own floors and a spanning question composes them, in `kernel/composition/`.
