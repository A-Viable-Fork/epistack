# Corpus Index

A manifest of every module and data file. Linter rule 9 fails on any tracked file under
`data/`, `engine/`, `view/`, or `build/` (plus `linter.js`) that is not listed here. Keep
this current: a new file is a new row. The template `view/index.template.html` is named
through the includes it carries, so it is not required to have its own row.

The `clients/` directory is deliberately outside the tracked set. It holds community
thin-client manifests (`clients/*.json`), each authored from the kit and validated by the
linter against the palette and the kind set, but not corpus-indexed: a manifest is content a
non-engineer drops in, not a module of the codebase, so it carries no index row.

## data/ (pure values; layer owns no behavior)

| file | role |
|---|---|
| `data/schema.js` | the one node schema, single source of truth (T0-1); kinds, enums, REQUIRED_FIELDS, validateNode |
| `data/registers.js` | vocabulary registers (TERMS, AUTOWRAP) for the migrated artifact |
| `data/graph.json` | the migrated typed claim graph (v0.1 citation schema) the artifact renders |
| `data/primitives/primitives.js` | the floor: shared basis primitives with citations |
| `data/atlas/atlas.js` | atlas entries (abstract patterns) with clones and departures |
| `data/components/visuals.js` | registered visual-component descriptors (the searchlight) |
| `data/components/cards.js` | registered card-layout descriptors (teaching / terse) |
| `data/components/views.js` | registered view-component descriptors (the compare view) |
| `data/cases/population-pipeline.js` | the population-mismatch family, fully authored (COVID + eggs) |
| `data/cases/lhc-cascade.js` | LHC safety; Branch 2 authored to the floor, Branches 1 and 3 stubbed |
| `data/clients/clients.js` | the fat client descriptors (teaching, auditor) |
| `data/clients/palette.js` | the thin-client palette catalog + validateManifest (the kit) |
| `data/forks/forks.js` | fork descriptors (live pipe.stage1.plain, snapshot pipe.stage2.pinned) |
| `data/compose-gate/compose_gate.py` | the compose-gate program (runs in-browser via Pyodide) |
| `data/compose-gate/incumbent.json` | compose-gate incumbent map |
| `data/compose-gate/A.json` | compose-gate contribution A |
| `data/compose-gate/B.json` | compose-gate contribution B |
| `data/compose-gate/C.json` | compose-gate contribution C |
| `data/compose-gate/prompt.txt` | the emitter contract prompt shown in the artifact |
| `data/compose-gate/captured.txt` | the captured A+B+C run, the offline fallback |

## engine/ (pure logic; DOM-free, runs headless)

| file | role |
|---|---|
| `engine/registry.js` | assemble the one id-keyed registry from primitives/atlas/cases (T0-1) |
| `engine/resolve.js` | the one resolver: resolve(id) with fork merge, referencesOf, dependents |
| `engine/graph.js` | pure graph utilities: index, traversal, acyclicity |
| `engine/terminals.js` | the terminal-type registry and promotion conditions (T1-6) |
| `engine/export.js` | machine-readable node + citation-edge export (migrated, pure) |
| `engine/compose-gate/clean-json.js` | strip fences/prose from a model JSON reply (migrated, pure) |
| `engine/decompose.js` | the DOWN motion: classify, motions, focusView (v1, built) |
| `engine/perturb.js` | seam: the ALONG motion, authored overlay (v3, not built) |
| `engine/compare.js` | the SIDEWAYS motion: atlas clones to broken-node coordinates (built) |
| `engine/api.js` | the client-facing API: open reads (resolve/decompose/compare/dependents) + gated submit |

## view/ (reads the engine; owns no data)

| file | role |
|---|---|
| `view/app.js` | the migrated single-page artifact: rendering, register UI, routing |
| `view/compose-gate.js` | the in-browser compose-gate runner (Pyodide, click-gated) |
| `view/card.js` | the learning-first node card (teaching layer + inspect disclosure) |
| `view/rail.js` | the spine rail: the clicked path, entry to focused |
| `view/host.js` | the host: builds the API from storage, selects the client, applies tokens |
| `view/clients/teaching.js` | the teaching client (fat): the learning-first walk + compare |
| `view/clients/thin.js` | a thin client: tokens + kind-to-look over the default read path |
| `view/clients/auditor.js` | the auditor client (fat): inspect layer + dependents + the gate |
| `view/visuals.js` | view-side renderers for visual components (the searchlight) |
| `view/compare-view.js` | the cross-case compare view renderer (learning-first reveal) |
| `view/styles/main.css` | the artifact's main stylesheet |
| `view/styles/compose-gate.css` | the compose-gate panel styles |
| `view/styles/decompose.css` | the v1 decompose surface styles |
| `view/index.template.html` | the build template for submission.html; @@INCLUDE@@ tokens |
| `view/decompose.template.html` | the build template for v1.html (the decompose surface) |

## build/ and root tooling

| file | role |
|---|---|
| `build/bundle.js` | the deliverable build: inlines modules into submission.html + v1.html |
| `build/extract.mjs` | the one-time migration tool: slices knowledge-game.html into modules |
| `build/vendor-katex.mjs` | vendor KaTeX (JS + CSS with fonts inlined) for offline typeset math |
| `build/new-client.mjs` | scaffold a thin client: emit clients/<name>.json from the default |
| `build/fork-demo.mjs` | demonstrate the canonical fork: pipe.stage1.plain changes only the intuition |
| `linter.js` | enforces the design-axioms linter rules in CI and locally |
