# Corpus Index

A manifest of every module and data file, organized by the trust-boundary layer it sits in. Linter rule 9 fails on any tracked file under `kernel/`, `api/`, `corpora/`, `periphery/`, or `build/` (plus `linter.js`) that is not listed here. Keep this current: a new file is a new row. `periphery/navigate/render/index.template.html` is named through the includes it carries, so it is exempt.

The layers and their dependency direction (design axiom T0-2): `periphery -> api -> kernel`; `corpora` are pure data imported by nothing; `build` may reach any layer. Phase B's `build/check-map.mjs` derives and enforces this from the real import graph.


## kernel/ (the trusted core: pure logic, DOM-free)

| file | role |
|---|---|
| `kernel/_nodes.js` | the kernel node manifest for the typed repository map (build/repo-map.schema.js) |
| `kernel/analysis/assessment.js` | mechanical assessment: double-counted evidence, missing coverage, the blast radius if one claim falls; surfaced as open reads |
| `kernel/analysis/gaps.js` | the gap taxonomy as typed predicates over the graph (docs/architecture-storage-api- |
| `kernel/analysis/robustness.js` | the robustness analysis: the support graph as a fault tree, single points of failure as dominators, fragility as the interval |
| `kernel/gate/clean-json.js` | strip code fences and surrounding prose from a model's JSON reply |
| `kernel/gate/compose_gate.py` | the compose-gate program (runs in-browser via Pyodide) |
| `kernel/gate/fixtures/A.json` | data (JSON) |
| `kernel/gate/fixtures/B.json` | data (JSON) |
| `kernel/gate/fixtures/C.json` | data (JSON) |
| `kernel/gate/fixtures/README.md` | file |
| `kernel/gate/fixtures/captured.txt` | compose-gate fixture text |
| `kernel/gate/fixtures/incumbent.json` | data (JSON) |
| `kernel/gate/fixtures/prompt.txt` | compose-gate fixture text |
| `kernel/gate/gate.mjs` | the intake gate (intake data model v3, Sections 3, 5, 6, 7, 8, 9, 11). Runs the checks by |
| `kernel/gate/immune.js` | the red-team immune system: super-stake challenges adjudicated by the standing population on rotation, bountied and anti-self-dealing |
| `kernel/gate/lifecycle.js` | the Knowledge Game gated-write lifecycle: sponsorship under stake, fermentation in a cross-domain mesh, stratified random verification |
| `kernel/gate/verify.mjs` | the external verifier (intake data model v3, Sections 11 and 15). Re-runs a decision from |
| `kernel/grounding/check.js` | the per-mode groundedness check: floor for formal, in-force for constitutive, faithful structure for forum |
| `kernel/grounding/contamination.js` | effective grounding and the contamination rule. Folds a node's support subtree along |
| `kernel/grounding/earned-grade.mjs` | the earned-grade rule (intake data model v3, Section 9). Support delivery S over supports |
| `kernel/grounding/profile.js` | the grounding profile: a read-only summary of how much of a kernel sits at each lattice position and where |
| `kernel/grounding/resolve.js` | the one resolver. Every data and presentation lookup goes through resolve(id), |
| `kernel/motions/compare.js` | the SIDEWAYS motion. Walk instantiation: resolve an atlas entry and its clones |
| `kernel/motions/decompose.js` | the DOWN motion. Zoom into a node's interior: classify each node as expandable |
| `kernel/motions/perturb.js` | the ALONG motion. Apply a flipped-assumption set as a NON-DESTRUCTIVE overlay, reading the |
| `kernel/schema/canonical.mjs` | the v3 canonical form and the one named hash (intake data model v3, Section 1). Turns a |
| `kernel/schema/confidence.mjs` | the v3 confidence order (intake data model v3, Section 9). An enumerated lattice: the |
| `kernel/schema/edges.js` | the edge taxonomy: edges as claims, typed by the lattice (support, undercut, rebut, presupposition, restatement, specialization, discourse) |
| `kernel/schema/lattice.js` | the grounding lattice: the ordering every claim sits in, with meet (jointly-necessary |
| `kernel/schema/modes.js` | the three grounding modes: formal (evidence or proof), constitutive (declaration), forum (argument) |
| `kernel/schema/records.mjs` | the v3 record types (intake data model v3, Sections 2, 4, 5, 6, 7, 8) plus the checking |
| `kernel/schema/registers.js` | vocabulary registers. Each concept's label per register, plus the coinage |
| `kernel/schema/registry.js` | assemble the one registry. Merge every addressable component (primitives, case |
| `kernel/schema/schema.js` | the one node schema. Single source of truth (design axiom T0-1). Every node |
| `kernel/schema/tables.mjs` | the two reference tables (intake data model v3, Section 10) and the source-footprint |
| `kernel/schema/terminals.js` | the terminal-type registry. One place that names the closures a claim can reach |
| `kernel/store/apply.mjs` | the apply contract (intake data model v3, Section 14). Apply changes structure only: the |
| `kernel/store/decay.mjs` | derived grade and decay (intake data model v3, Section 14). Earned grade is derived, never |
| `kernel/store/exclusion.js` | the exclusion store: refuted claims kept with reason and grounds so a kill cannot be silently revived |
| `kernel/store/graph.js` | pure graph utilities over the node schema. Index, traversal, acyclicity |
| `kernel/store/patch-ledger.js` | storage as a tamper-evident, append-only sequence of sealed canonical patches |
| `kernel/store/reconciliation.js` | the reconciliation register: conflict between two grounded claims held as first-class disagreement with its crux |
| `kernel/store/state.mjs` | the store-state record and the history chain (intake data model v3, Section 13). A store |

## api/ (the sole membrane: kernel-facing contract)

| file | role |
|---|---|
| `api/_nodes.js` | the api node manifest for the typed repository map (build/repo-map.schema.js) |
| `api/api.js` | the engine's client-facing API. THE single door between clients and storage. Reads |
| `api/compose.js` | the cross-kernel composition protocol: a citation whose target lives in another store, inheriting the target's grounding under its floors |
| `api/credential.js` | the credential layer: who may propose to which kernel, time-locked so it can be neither seized nor revoked instantly; reading requires none |
| `api/export.js` | machine-readable export of a forked node and its typed citation edge |
| `api/fork.js` | the provenance and fork interface: carry signed contributions, retrieve history, fork a kernel, open a merge proposal |
| `api/propose.js` | the propose interface: accept a claim, edge, join, or refutation and hand it to the gate, which decides; never writes directly |
| `api/read.js` | the open read interface: resolve, decompose, compose, compare, dependents, gaps, profile, exclusions, disagreements; no credential |
| `api/subscribe.js` | the subscription interface: notify a consumer when something it relies on changes (a cited claim withdrawn, a gap closed, a grounding lowered) |

## corpora/ (pure data; each folder a self-contained kernel's data)

| file | role |
|---|---|
| `corpora/_nodes.js` | the corpora node manifest for the typed repository map (build/repo-map.schema.js) |
| `corpora/_primitives/primitives.js` | the floor. Named standard transformations, the coordinate basis. Each is a leaf |
| `corpora/_shared/atlas/atlas.js` | the atlas. Abstract transformation patterns (the index) that case nodes point into |
| `corpora/_shared/bodies/bodies.js` | the body corpus, the empirical floor, sibling to data/primitives (the mathematical floor) |
| `corpora/_shared/forks.js` | fork descriptors. A fork is a new id that names a parent and lists only its overrides |
| `corpora/_shared/graph.json` | data (JSON) |
| `corpora/_shared/units.js` | the thin shared root: units and cross-kernel definitions so they translate across kernels (bodies and atlas sit alongside) |
| `corpora/covid/covid.js` | the COVID-origin case. Its instance is authored in the shared two-stage pipeline corpus and is not split out |
| `corpora/eggs/eggs.js` | the eggs case. Its instance is authored in the shared two-stage pipeline corpus and is not split out |
| `corpora/lhc/lhc-cascade.js` | the LHC-safety case-family, authored as data (docs/lhc-cascade.md, |
| `corpora/population/population-pipeline.js` | the population-mismatch case-family, authored as data (docs/population-pipeline.md) |

## periphery/ (fallible; reaches the kernel only through api/)

| file | role |
|---|---|
| `periphery/_nodes.js` | the periphery node manifest for the typed repository map (build/repo-map.schema.js) |
| `periphery/assess/assess.js` | the assessment agent: an AI consumer that produces interpretive assessments the kernel cannot compute, submitted back through the gate as claims |
| `periphery/author/author.js` | the authoring and curation tools: add claims, propose groundings, discharge open questions, record refutations, AI-assisted |
| `periphery/filter/filter.js` | the forum filter: reader-side tier selection over what the kernel keeps down to the raw tier; openness at the bottom, strictness at the floor |
| `periphery/ingest/ingest.js` | the ingestion pipeline: read messy multi-source material, emit attributed candidate claims with proposed types and links, submit through the gate |
| `periphery/navigate/clients/blueprint.json` | data (JSON) |
| `periphery/navigate/clients/clients.js` | the registered client descriptors. A client is a forkable unit over the untouched |
| `periphery/navigate/clients/palette.js` | the thin-client palette and the manifest validator. A thin client is a single |
| `periphery/navigate/clients/plain.json` | data (JSON) |
| `periphery/navigate/clients/warm.json` | data (JSON) |
| `periphery/navigate/fat/auditor.js` | the auditor client (FAT). A genuinely different USE of the same store: it leads with |
| `periphery/navigate/fat/teaching.js` | the teaching client (FAT). The learning-first walk: concrete entry, drill, the compare |
| `periphery/navigate/fat/thin.js` | a THIN client. Tokens + a kind-to-look mapping over the default read path (drill) |
| `periphery/navigate/render/app.js` | the single-page artifact. Renders graph nodes, the paper/overview/spec |
| `periphery/navigate/render/card.js` | the node card. v2 learning-first (docs/teaching-layer.md, matching card-prototype.html): |
| `periphery/navigate/render/compare-view.js` | the cross-case compare view (the SIDEWAYS reveal). Renders the shared pipeline ONCE |
| `periphery/navigate/render/components/cards.js` | the registered card-layout components. A card is addressable and resolvable like any |
| `periphery/navigate/render/components/views.js` | registered view-level components, addressable and forkable like the cards and |
| `periphery/navigate/render/components/visuals.js` | the registered visual components. A node does not contain a visual; it references |
| `periphery/navigate/render/compose-gate.js` | the in-browser compose-gate runner. Loads Pyodide on click and runs the |
| `periphery/navigate/render/decompose.template.html` | build template; @@INCLUDE@@ tokens |
| `periphery/navigate/render/host.js` | the host. The wiring that builds the API from storage once, registers the fat clients |
| `periphery/navigate/render/index.template.html` | build template; @@INCLUDE@@ tokens |
| `periphery/navigate/render/rail.js` | the spine rail. The decomposition path from the root claim to the focused node, |
| `periphery/navigate/render/styles/compose-gate.css` | stylesheet |
| `periphery/navigate/render/styles/decompose.css` | stylesheet |
| `periphery/navigate/render/styles/main.css` | stylesheet |
| `periphery/navigate/render/visuals.js` | the view-side renderers for registered visual components. A node references a visual |
| `periphery/query/query.js` | the query surface: answer whether a claim is grounded and where it is weakest, by walking the graph through the read interface |
| `periphery/redteam/redteam.js` | the red-team surface: attack the graph, propose objections, find thin grounding, submit refutations through the gate |

## build/ and root tooling

| file | role |
|---|---|
| `build/_nodes.js` | the build node manifest for the typed repository map (build/repo-map.schema.js) |
| `build/bundle.js` | the deliverable build. Inlines the data + engine + view modules back into |
| `build/check-gaps.mjs` | the gap detector's oracle. Tests each predicate in isolation on fixtures, then runs the |
| `build/check-gate.mjs` | the v3 gate kernel's oracle (intake data model v3). Runs the acceptance suite phase by |
| `build/check-lattice.mjs` | the Stage 1 lattice demonstrator's oracle. Asserts modeOf is total over the seven |
| `build/check-map.mjs` | the typed-repository-map oracle. Assembles the node manifests, validates them, checks |
| `build/check-perturb.mjs` | the perturbation overlay's oracle. Exercises kernel/motions/perturb.js on the LHC case: the empty |
| `build/fork-demo.mjs` | demonstrate the canonical fork (docs/components-and-forking.md). pipe.stage1.plain |
| `build/gate-demo.mjs` | the runnable composition demo, now under Node (intake data model v3). The v3 JS gate |
| `build/new-client.mjs` | scaffold a new thin client. Emits clients/<name>.json pre-filled with the default |
| `build/repo-map.schema.js` | the schema for the typed repository map. A typed graph of the repository itself, in the |
| `build/vendor-katex.mjs` | vendor KaTeX into the repo so the deliverable opens from file:// with no network |

## root tooling

| file | role |
|---|---|
| `linter.js` | the design discipline made mechanical. Enforces the linter rules in |
