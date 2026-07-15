---
Type: reference
Purpose: Indexes every tracked module and data file with its role, as the manifest the linter checks completeness against.
Depends on: docs/design-axioms.md
Depended on by: nothing
---

# Corpus Index

A manifest of every module and data file, organized by the trust-boundary layer it sits in. Linter rule 9 fails on any tracked file under `kernel/`, `api/`, `corpora/`, `periphery/`, or `build/` (plus `linter.js`) that is not listed here. Keep this current: a new file is a new row. `periphery/navigate/shell/shell.template.html` and `periphery/navigate/render/decompose.template.html` are named through the includes they carry, so they are exempt. (The classic `index.template.html` and its built snapshot now live in `archive/`, outside the tracked layers.)

The layers and their dependency direction (design axiom T0-2): `periphery -> api -> kernel`; `corpora` are pure data imported by nothing; `build` may reach any layer. Phase B's `build/check-map.mjs` derives and enforces this from the real import graph.


## kernel/ (the trusted core: pure logic, DOM-free)

| file | role |
|---|---|
| `kernel/README.md` | the layer README (Prompt 36): what the trusted core is, its responsibilities, its interface up and down, its invariant (standing is a property of structure, producer-agnosticism at its source), and a map of the directory |
| `kernel/_nodes.js` | the kernel node manifest for the typed repository map (build/repo-map.schema.js) |
| `kernel/analysis/characterized-gaps.mjs` | the characterized-gap reading (Prompt 18): an open-line claim with a floor ceiling, a transfer support, and a closing condition; distinguishes gap / bare assertion / settled |
| `kernel/analysis/gaps.js` | the gap taxonomy as typed predicates over the graph (docs/architecture-storage-api- |
| `kernel/analysis/robustness.mjs` | the v3 robustness reading (Prompt 13): single points of failure over the support and presupposition closures, robustness, fragility, and the correlated-evidence flag, by re-derivation |
| `kernel/analysis/reconciliation.mjs` | the reconciliation reading (Prompt 22): a contradicts-linked pair as a disagreement record, and the crux the disagreement turns on, a within-domain divergence frontier from the cone walk or (Phase B) a cross-domain framing node, computed on read and marked a candidate |
| `kernel/composition/records.mjs` | the composition-layer records (Prompt 19): the cross-store citation and the composite claim, v3-shaped records that carry a copied domain grade across the store boundary |
| `kernel/composition/transfer.mjs` | grounding transfer across the boundary (Prompt 19): copies the domain grade into a citation, folds necessary carried grades under the v3 min (settled-collapse), and detects staleness |
| `kernel/composition/vocabulary.mjs` | the shared vocabulary (Prompt 19): shared terms declared once and referenced by identity, the ceiling selection (single term vs distinct terms), and the three divergence detections (version skew, cache drift, schema violation) |
| `kernel/composition/framing.mjs` | the framing record and presupposition edge (Prompt 19): the denominator seam. A frame carries status not grade; the edge is checked (in-force) not graded, so a fallen or swapped frame flags frame-orphaned and leaves the measurement's floor grade untouched |
| `kernel/composition/notify.mjs` | cross-boundary notification and re-derivation (Prompt 19): a change notification drives re-derivation of affected citations and composite grades, propagating transitively, and emits an auditable re-derivation report that is itself a record |
| `kernel/composition/profiles.mjs` | the two grounding profiles (Prompt 19): a domain store by its floor distribution, a composite store by cited grounding, forum residents, citation health, and framing condition |
| `kernel/gate/clean-json.js` | strip code fences and surrounding prose from a model's JSON reply |
| `kernel/gate/gate.mjs` | the intake gate (intake data model v3, Sections 3, 5, 6, 7, 8, 9, 11). Runs the checks by |
| `kernel/gate/immune.js` | the red-team immune system: super-stake challenges adjudicated by the standing population on rotation, bountied and anti-self-dealing |
| `kernel/gate/lifecycle.js` | the Knowledge Game gated-write lifecycle: sponsorship under stake, fermentation in a cross-domain mesh, stratified random verification |
| `kernel/gate/verify.mjs` | the external verifier (intake data model v3, Sections 11 and 15). Re-runs a decision from |
| `kernel/grounding/earned-grade.mjs` | the earned-grade rule (intake data model v3, Section 9). Support delivery S over supports |
| `kernel/grounding/profile.js` | the grounding profile: a read-only summary of how much of a kernel sits at each lattice position and where |
| `kernel/grounding/resolve.js` | the one resolver. Every data and presentation lookup goes through resolve(id), |
| `kernel/motions/compare.js` | the SIDEWAYS motion. Walk instantiation: resolve an atlas entry and its clones |
| `kernel/motions/decompose.js` | the DOWN motion. Zoom into a node's interior: classify each node as expandable |
| `kernel/motions/perturb.js` | the ALONG motion. Apply a flipped-assumption set as a NON-DESTRUCTIVE overlay, reading the |
| `kernel/schema/canonical.mjs` | the v3 canonical form and the one named hash (intake data model v3, Section 1). Turns a |
| `kernel/schema/confidence.mjs` | the v3 confidence order (intake data model v3, Section 9). An enumerated lattice: the |
| `kernel/schema/edges.js` | the edge taxonomy: edges as claims, typed by the lattice (support, undercut, rebut, presupposition, restatement, specialization, discourse) |
| `kernel/schema/records.mjs` | the v3 record types (intake data model v3, Sections 2, 4, 5, 6, 7, 8) plus the checking |
| `kernel/schema/sha256.mjs` | the one named hash (sha256), a vendored pure-JS implementation so the kernel hashes identically |
| `kernel/schema/registers.js` | vocabulary registers. Each concept's label per register, plus the coinage |
| `kernel/schema/registry.js` | assemble the one registry. Merge every addressable component (primitives, case |
| `kernel/schema/schema.js` | the one node schema. Single source of truth (design axiom T0-1). Every node |
| `kernel/schema/type-hash.mjs` | content-address a shared type. A type bundle (a kind with its ceiling and rules, a floor, a source class) hashes to its meaning, so two kernels that mean the same thing by a type pin the same hash; the one primitive the three-tier crossing rests on |
| `kernel/schema/tables.mjs` | the two reference tables (intake data model v3, Section 10) and the source-footprint |
| `kernel/store/apply.mjs` | the apply contract (intake data model v3, Section 14). Apply changes structure only: the |
| `kernel/store/decay.mjs` | derived grade and decay (intake data model v3, Section 14). Earned grade is derived, never |
| `kernel/store/exclusion.js` | the exclusion store: refuted claims kept with reason and grounds so a kill cannot be silently revived |
| `kernel/store/graph.js` | pure graph utilities over the node schema. Index, traversal, acyclicity |
| `kernel/store/patch-ledger.js` | storage as a tamper-evident, append-only sequence of sealed canonical patches |
| `kernel/store/state.mjs` | the store-state record and the history chain (intake data model v3, Section 13). A store |

## api/ (the sole membrane: kernel-facing contract)

| file | role |
|---|---|
| `api/README.md` | the layer README (Prompt 36): what the boundary is, its responsibilities, its interface up and down, its discipline (read through the contract, propose through the gate, never touch the store), and a map of the directory |
| `api/_nodes.js` | the api node manifest for the typed repository map (build/repo-map.schema.js) |
| `api/api.js` | the engine's client-facing API. THE single door between clients and storage. Reads |
| `api/client-api.mjs` | the propose/read contract (Prompt 10): a provider-agnostic seam, createClientApi(provider), that a client calls without learning which provider answers |
| `api/management-api.mjs` | the management contract, the kernel-shaped sibling of the claim contract: createManagementApi(provider) exposes listKernels, readKernel, readCrossings, adopt, fork, and cross, each delegating to the provider; holds no adoption or crossing logic of its own |
| `api/providers/local-management-provider.mjs` | the local provider behind the management contract: runs the real adoption logic over a management snapshot, computing each member's pins live with the real hashTypeBundle and every crossing's status by the crossing rule; imports only kernel and api, and is proven faithful to build/adoption by check-management |
| `api/compose.js` | the cross-kernel composition protocol: a citation whose target lives in another store, inheriting the target's grounding under its floors |
| `api/credential.js` | the credential layer: who may propose to which kernel, time-locked so it can be neither seized nor revoked instantly; reading requires none |
| `api/export.js` | machine-readable export of a forked node and its typed citation edge |
| `api/fork.js` | the provenance and fork interface: fork a kernel, and fork a type bundle (forkType, the crossing's fork at type granularity, a new type-hash whose receipt names its parent and departure, snapshot only) |
| `api/contest.js` | the type-contest interface: contestType constructs a gate-admissible forum claim whose subject is a type-hash, recording a semantic disagreement the kernel never adjudicates; changes no grade |
| `api/contribution.js` | the contribution export: packages a gate-decided proposal (claims plus links) as a portable bundle with a content-derived contribution id, the receipt, and admission instructions; import rebuilds and re-verifies the id, rejecting a tampered bundle loudly (gate-passed, not admitted) |
| `api/propose.js` | the propose interface: accept a claim, edge, join, or refutation and hand it to the gate, which decides; never writes directly |
| `api/providers/local-provider.mjs` | the local provider behind the propose/read contract: runs the real v3 gate over the migrated snapshot in-process; the one API-layer module that imports the kernel |
| `api/providers/remote-provider.mjs` | a stub remote provider behind the same contract: imports no kernel, returns a fixed receipt standing in for a hosted kernel, so the provider swap is one import |
| `api/read.js` | the open read interface: resolve, decompose, compose, compare, dependents, gaps, profile, exclusions, disagreements; no credential |
| `api/subscribe.js` | the subscription interface: notify a consumer when something it relies on changes (a cited claim withdrawn, a gap closed, a grounding lowered) |

## corpora/ (pure data; each folder a self-contained kernel's data)

| file | role |
|---|---|
| `corpora/_nodes.js` | the corpora node manifest for the typed repository map (build/repo-map.schema.js) |
| `corpora/_primitives/primitives.js` | the floor. Named standard transformations, the coordinate basis. Each is a leaf |
| `corpora/_shared/atlas/atlas.js` | the atlas, the meta-index (Prompt 27): the pre-existing discrimination map (ATLAS) plus two seeded registers, the transformation BASIS (admitted solo on type-correctness) and the DISCRIMINATION patterns (admitted in pairs on a real departure node-id), each entry referencing exemplar/clone nodes in the case stores |
| `corpora/_shared/bodies/bodies.js` | the body corpus, the empirical floor, sibling to data/primitives (the mathematical floor) |
| `corpora/_shared/common-types.js` | the seed of the shared type subtree: the type bundles for the kinds more than one kernel pins in common (measurement, forum, declaration) and their content-address type-hashes, so a case references the shared hash rather than minting its own meaning |
| `corpora/_shared/forks.js` | fork descriptors. A fork is a new id that names a parent and lists only its overrides |
| `corpora/_shared/graph.json` | data (JSON) |
| `corpora/_shared/units.js` | the thin shared root: units and cross-kernel definitions so they translate across kernels (bodies and atlas sit alongside) |
| `corpora/covid/covid.js` | the COVID-origin case home. The canonical covid case is corpora/covid/covid-origins.js (Prompt 23a); covid.instance in the population pipeline is a separate population-mismatch pattern demo kept by design (Prompt 24, Option B) |
| `corpora/eggs/eggs.js` | the eggs case home. The canonical eggs case is the corpora/eggs domain stores and composite (Prompt 20); eggs.instance in the population pipeline is a separate population-mismatch pattern demo kept by design (Prompt 24, Option B) |
| `corpora/covid/tables.js` | the covid-origins case reference tables (Prompt 23a): a source row per cited study/document with its citation as provenance, and the kind table (a measurement floor and a forum band) |
| `corpora/covid/covid-origins.js` | the densified covid-origins store (Prompt 23a), ingested from the Rootclaim-debate write-up: evidence to floors, contested interpretations separate, the zoonosis and lab-leak conclusions a contradicts-linked forum pair each on the shared evidence and its explicit priors, the divergence/judges/method-critique meta level |
| `corpora/covid/covid-depth.js` | the deep extraction (Prompt 34) that deepens the covid case under the existing spine: each line's argument set (the ZO reading, the LL counter, the counters to those) several nodes deep; the weightings of three careful readers (Alexander, Van Treuren, Stansifer) as attributed forum nodes carrying the likelihood ratios, stated-versus-reconstructed intact; the reader divergences on shared evidence as first-class contradictions; and each line's sub-crux, several bottoming out in a withheld-record terminal (a sealed dataset) typed as such (`build/covid-build.mjs`, `build/check-covid.mjs`) |
| `corpora/eggs/tables.js` | the eggs case reference tables (Prompt 20): the source table (a row per cited study, with its citation as provenance) and the kind table (a measurement floor and a forum band) |
| `corpora/eggs/nutrition.js` | the eggs nutrition domain store (Prompt 20, deepened Prompt 26): the three coupled subsystems (choline/one-carbon, metabolic regulation, the lipid mechanistic floor) to their floors; the population-to-individual refusal resting on absorption/synthesis/responder variance; the choline good-versus-bad fork (TMAO causal link held at association with the fish-paradox, renal, and Mendelian undercuts); and the cardiovascular crux resolving to the confounding-adjustment choice with the diabetic phenotype in the resolved region |
| `corpora/eggs/environment.js` | the eggs environment domain store (Prompt 20): per-unit measurements (emissions, land, welfare, antibiotics, runoff, soil, biodiversity) to the measurement floor, trade-offs in the forum, and the regenerative soil-carbon claims as characterized gaps (a cross-system transfer caps each, a closing condition names the direct measurement that would ground it) |
| `corpora/eggs/economics.js` | the eggs economics domain store (Prompt 20): feed conversion, energy demand, energy return, and production cost to the measurement floor; the discount rate and the objective-function choice in the forum |
| `corpora/eggs/composite.js` | the eggs composite store (Prompt 20, extended Prompt 26): citations across the boundary, the two cross-domain weighings at the structured-forum ceiling, the denominator framing (product-throughput vs net-capital), and the second framing node, the which-body node (average adult / diabetic / hyper-responder / choline-deficient pregnant woman) whose swap reframes which effects dominate while the measurements hold |
| `corpora/lhc/lhc-cascade.js` | the LHC-safety case-family, authored as data (docs/lhc-cascade.md, |
| `corpora/lhc/lhc-tables.js` | the densified LHC-cascade reference tables (Prompt 25): a source row per cited report/study, and the kind table (a derivation floor/constitutive, a measurement floor/checked, a forum band/corroborated) |
| `corpora/lhc/lhc-legs.js` | the densified LHC cascade (Prompt 25): the three legs and their computed quantities to their floors, the reified ADD framework-choice and semiclassical shared dependencies, the framework-swap framing records, the undercuts, the performed-settling pair, and the empirical-closure and conditionality meta-claims |
| `corpora/population/population-pipeline.js` | the population-mismatch pattern demonstration, authored as data (docs/population-pipeline.md). A distinct structural demo (same machinery, the failure localized at different stages), NOT the canonical covid or eggs case; kept by design (Prompt 24, Option B) |
| `corpora/lineage/tables.js` | the lineage case (fourth case) reference tables: a source row per cited report/study/document, and three kinds (measurement/checked, forum/corroborated, declaration/constitutive). The four deep-research reports are canonical for the claims, never for the grade |
| `corpora/lineage/lineage.js` | the lineage case authored from four deep-research reports: the kernel's mechanisms already run by hand in common law, software, science, Wikipedia, journalism, and accounting, and the novelty conjecture that no known system composes all five axes for empirical and contested knowledge. Declared conservatively; the gate prices it and the demotions are the finding |
| `corpora/math/tables.js` | the math kernel reference tables, generated from scaffolder/examples/math-config.json: the adopted shared kinds (declaration, measurement) and the local theorem kind at the constitutive proof-floor, plus the source table (the confidence-order spec source, and the exhaustion/differential-test/formal-proof grounding sources carried at a placeholder class pending the source-class decision) |
| `corpora/math/math-data.js` | the math kernel store: the stage-zero axioms of the confidence order as declaration-claims at the constitutive floor, and the stage-two foundational properties the code computes as bare claims with no support so the gate floors them (the lattice laws as theorems at the constitutive proof-floor, the earned-grade recurrence and contamination and crossing as measurements at the asserted floor), the honest before-state stage three grounds |
| `corpora/math/embed-manifest.js` | the embed manifest for the sixth exhibit: names each code operation the math kernel grounds (meet, join, capByCeiling, earnedGrade, supportDelivery, compositeGrade), the claims that ground it, the tier those claims hold, the oracle that establishes correspondence, and a content hash of the operation's source at grounding time, read by build/check-math-embed.mjs to make the GROUNDED pointers mechanical |
| `corpora/vocabulary/tables.js` | the vocabulary kernel (fifth exhibit) reference tables: the one kind, declaration, at the constitutive ceiling, and the external citations reference terms ground in (a physics reference for cross-section, a logic reference for modus tollens, web and language specs for the infrastructure terms) |
| `corpora/vocabulary/vocabulary.js` | the vocabulary kernel: the submission's own terms as declaration claims grounding by adoption, core terms in their home region inside the submission and reference terms in an external citation, overloaded terms one entry per sense with its own home |
| `corpora/registers/judges-accessible.js` | the accessible register of the judges document (register view, phase B): one section record per precise section of docs/what-stands-without-trust.md, carrying the accessible-register prose, its delta, its source and node links, and the authored-verification list; the precise register stays the canonical markdown. Grounding is invariant across registers, node_links resolve through the read contract |

## periphery/ (fallible; reaches the kernel only through api/)

| file | role |
|---|---|
| `periphery/README.md` | the layer README (Prompt 36): what the fallible layer is, its responsibilities, its interface up and down, its invariant (fallible-producers-not-fallible-AI at its source, never touch the store), and a map of the directory |
| `periphery/_nodes.js` | the periphery node manifest for the typed repository map (build/repo-map.schema.js) |
| `periphery/assess/assess.js` | the assessment agent: an AI consumer that produces interpretive assessments the kernel cannot compute, submitted back through the gate as claims |
| `periphery/author/author.js` | the authoring and curation tools: add claims, propose groundings, discharge open questions, record refutations, AI-assisted |
| `periphery/filter/filter.js` | the forum filter: reader-side tier selection over what the kernel keeps down to the raw tier; openness at the bottom, strictness at the floor |
| `periphery/ingest/ingest.js` | the ingestion pipeline: read messy multi-source material, emit attributed candidate claims with proposed types and links, submit through the gate |
| `periphery/ingest/rate-limit.mjs` | a minimum-interval rate limiter enforced by construction: guarantees arXiv's one-request-per-three-seconds spacing (and a polite OpenAlex interval) with an injectable clock so the spacing is testable without waiting |
| `periphery/ingest/arxiv.mjs` | the arXiv metadata connector: queries the Atom API (or replays a saved fixture offline), parses descriptive metadata deterministically, and returns normalized works with the abstract-page link back; metadata only, never the full-text e-print |
| `periphery/ingest/openalex.mjs` | the OpenAlex metadata connector: queries the works API (or replays a saved fixture offline) with a polite delay and client identification, parses metadata deterministically, and carries the venued-versus-not distinction for honest classing |
| `periphery/ingest/to-sources.mjs` | maps normalized ingested works into kernel source rows in the real shape, with the honest class mapping (arXiv preprint; OpenAlex peer-reviewed when venued, else preprint) and a link back in every description; pure and deterministic |
| `periphery/ingest/fixtures/arxiv-sample.xml` | a saved arXiv Atom response, the offline replay fixture the ingest check parses deterministically |
| `periphery/ingest/fixtures/openalex-sample.json` | a saved OpenAlex works response, the offline replay fixture the ingest check parses deterministically |
| `periphery/produce/propose-tool.mjs` | the MCP tool definition for authoring a claim: its inputSchema is the proposedClaim shape as a JSON Schema, marked strict so the schema is a grammar the agent must satisfy (kind constrained to the kernel's real kinds, declared_grade to the real grade values); a pure definition that gates structure and holds no grading |
| `periphery/produce/mcp-server.mjs` | a minimal MCP server exposing the propose tool: tools/list returns it, tools/call validates the agent's arguments against the strict inputSchema at the boundary and, only if they pass, drives them through the real propose contract; transport only, holding no grading logic |
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
| `periphery/navigate/render/compose-gate.js` | the in-browser compose-gate runner. Runs the vendored v3 gate kernel (window.EpiGate) over the incumbent plus the ticked contributions, offline |
| `periphery/navigate/render/compose/tables.json` | the compose-gate source and kind tables (v3): the trusted inputs the gate prices independence over |
| `periphery/navigate/render/compose/incumbent.json` | the compose-gate incumbent map: the shared COVID-origin conclusion the contributors compose onto |
| `periphery/navigate/render/compose/A.json` | compose-gate contribution A (population / epidemiological vantage), a v3 typed contribution |
| `periphery/navigate/render/compose/B.json` | compose-gate contribution B (molecular / documentary vantage), a v3 typed contribution |
| `periphery/navigate/render/compose/C.json` | compose-gate contribution C (Claude Code quantitative), a v3 typed contribution with an imputed sub-mechanism held at asserted |
| `periphery/navigate/render/compose/prompt.txt` | the bring-your-own-contribution contract: emit a v3 contribution any LLM can produce, for the D flow |
| `periphery/navigate/render/decompose.template.html` | build template; @@INCLUDE@@ tokens |
| `periphery/navigate/render/host.js` | the host. The wiring that builds the API from storage once, registers the fat clients |
| `periphery/navigate/render/kernel-file.js` | the self-contained kernel file's own surface: renders one generated kernel's claims and grounding through the read contract, reuses the propose widget for authoring, and wires the download-repo button with a self-contained store-only zip encoder; computes no grade, stores no truth |
| `periphery/navigate/render/propose-widget.js` | the propose widget (Prompt 10): a judge enters a typed claim and reads the gate's receipt; calls the propose/read contract and renders, computing no grounding |
| `periphery/navigate/render/rail.js` | the spine rail. The decomposition path from the root claim to the focused node, |
| `periphery/navigate/shell/kernel.template.html` | build template for the self-contained kernel file; @@INCLUDE@@ tokens plus a @@KERNEL_ID@@ text token |
| `periphery/navigate/render/styles/compose-gate.css` | stylesheet |
| `periphery/navigate/render/styles/propose-widget.css` | stylesheet |
| `periphery/navigate/render/styles/decompose.css` | stylesheet |
| `periphery/navigate/render/styles/main.css` | stylesheet |
| `periphery/navigate/render/visuals.js` | the view-side renderers for registered visual components. A node references a visual |
| `periphery/navigate/shell/shell.js` | the presentation shell (Prompt 17): content-agnostic navigation frame, module registry, and cross-link machinery; composes registered modules, holds no content |
| `periphery/navigate/shell/modules/prose.js` | prose modules: sections of the paper with claim-references that link into the live graph (Phase B weaves docs/what-stands-without-trust.md) |
| `periphery/navigate/shell/modules/cases.js` | case modules: each case's focus conclusion, its grounding and robustness read live through the contract, and what it rests on |
| `periphery/navigate/shell/modules/demos.js` | demonstration modules: the compose-gate panel, the propose widget, and the robustness reading, registered on the shell |
| `periphery/navigate/shell/styles/shell.css` | stylesheet |
| `periphery/query/query.js` | the query surface: answer whether a claim is grounded and where it is weakest, by walking the graph through the read interface |
| `periphery/redteam/redteam.js` | the red-team surface: attack the graph, propose objections, find thin grounding, submit refutations through the gate |

## build/ and root tooling

| file | role |
|---|---|
| `build/_nodes.js` | the build node manifest for the typed repository map (build/repo-map.schema.js) |
| `build/bundle.js` | the deliverable build. Inlines the data + engine + view modules back into |
| `build/check-gaps.mjs` | the gap detector's oracle. Tests each predicate in isolation on fixtures, then runs the |
| `build/check-gate.mjs` | the v3 gate kernel's oracle (intake data model v3). Runs the acceptance suite phase by |
| `build/check-characterized-gaps.mjs` | the characterized-gaps oracle (Prompt 18): the closing-condition record, the capping transfer, the gap category, the three-way distinction, determinism, and the contract exposure |
| `build/check-composition.mjs` | the composition-layer oracle (Prompt 19): the citation copies the domain grade, the grounding transfer folds the min with the settled-collapse, a forum-band citation carries the forum value, and staleness leaves the record intact |
| `build/check-eggs.mjs` | the eggs-case oracle (Prompt 20): the eggs question as domain stores and a composite on real ingested research; grounding, the cardiovascular contradiction, the regenerative characterized gaps, the cross-domain weighings, the denominator swap, and the vendored reading |
| `build/check-atlas.mjs` | the atlas oracle (Prompt 27): the two registers' distinct admission tests over the real case stores, the transformation basis type-correct with existing exemplars, the discrimination patterns admitted on two existing clones with departure node-ids, the pending terminals named |
| `build/check-demo.mjs` | the three-counterexample oracle (Prompt 29): the LHC apparent-robustness collapse (before/after reifying the shared dependency), the covid crux resolving to the priors, and the eggs framing swaps leaving the measurements intact, each written to fail loudly |
| `build/check-docs.mjs` | the documentation-graph oracle (Prompt 37): the argument chain checked for symmetry (every Depends-on has its Depended-on-by backlink, the dangling-citation check) and the code chain checked for agreement with the actual cross-directory imports |
| `build/lineage-build.mjs` | the shared builder for the lineage case (fourth case), modeled on build/covid-build.mjs: drives every lineage claim through the real gate and reads the earned-grade view. Pure over the corpus |
| `build/check-lineage.mjs` | the lineage oracle: verifies the case structure (provenance resolves, the conjecture rests on five independent gaps, the retraction reaches checked, the institutional declarations reach the constitutive floor) and reports the gate's grading, the demotions being the finding, without tuning the corpus green |
| `build/math-build.mjs` | the builder for the math kernel (generated by the scaffolder, modeled on build/covid-build.mjs): drives the math kernel's claims through the real gate and reads the earned-grade view. Pure over the corpus |
| `build/check-math.mjs` | the math kernel oracle (sixth exhibit, in progress): verifies the kernel is coherent (adopted hashes match the shared subtree, tables build, the gate accepts) and that the grounded state holds by the gate's computation, the axioms and lattice laws at the constitutive proof-floor and the recurrence and crossing properties lifted to the checked tier |
| `build/check-math-exhaustion.mjs` | the math kernel's exhaustion oracle: proves the grade-lattice laws (meet and join commutative, associative, idempotent, absorption, the lattice, mode-incomparability well-definedness) by enumerating the operations over the whole finite grade domain, a complete proof that grounds the lattice theorems at proof-floor |
| `build/check-math-differential.mjs` | the math kernel's differential-test harness: grounds the earned-grade recurrence, contamination, and crossing properties at the checked tier by generating random support graphs and confirming the real code agrees with the extracted recurrence over thousands of trials, including the cycle guard, linearity, determinism, and the untyped-crossing floor |
| `build/check-math-embed.mjs` | the math kernel's embed guard: reads the kernel code files as text and verifies every GROUNDED code-to-kernel pointer resolves to a real claim, the pointer's stated tier matches the tier the gate grades that claim at, the cited oracle exists and covers the claim, and the described operation's content hash is unchanged since grounding, catching both pointer drift and code drift without importing the graded operations into its check path |
| `build/check-certificate.mjs` | the certificate-seal oracle (CERT-1): confirms the derived certificate hash on the gate receipt is a function of the sealed bundle (grades, bindings, checking records, state, ruleset), changing if and only if a bundled part changes and reproducing for an identical assembly, that verifyDecision reproduces it and names a tampered seal, and that grounding is untouched and expiry is mark-stale by comparison rather than an eager re-ground |
| `build/check-vocabulary.mjs` | the vocabulary kernel oracle (fifth exhibit): verifies every core term's cited home region actually contains it (the drift guard), every reference term carries a real external citation, no leakage term is authored, model leads with the map sense, and LLM is its own term |
| `build/adoption.mjs` | the thin adoption layer: reads the four cases' existing kind tables (no corpus edit) and computes each kernel's pinned type-hashes, a common kind resolving to the shared hash and a unique kind holding its own; decides from two kernels' pins whether a crossing is native or untyped |
| `build/check-type-hash.mjs` | the type-hash oracle: identical bundles hash identically, every meaning-bearing field is load-bearing in the hash, and the authored common-type hash literals match hashTypeBundle |
| `build/check-crossing.mjs` | the crossing oracle (the keystone): treats the four cases as four kernels and verifies same-hash crossing composes native and lossless, an unpinned crossing arrives untyped and grounds nothing, and a fork restores standing |
| `build/check-fork-contest.mjs` | the type-fork and type-contest oracle: verifies forkType is a deterministic snapshot fork naming its parent and departure, the forked type crosses non-native against the parent, and admitting a contest against a type in use moves no pre-existing grade or certificate (the no-grade-motion theorem) |
| `build/emit-snapshot.mjs` | the standalone snapshot emit: writes the kernel snapshot { state, sources, kinds } vendor-kernel stages as a fetchable <id>.snapshot.json with a snapshot_hash over the canonical content, so a fat client loads a community's kernel from static hosting and runs the real gate on device |
| `build/check-contribution.mjs` | the contribution-export and snapshot oracle: verifies id determinism and order-independence, export/import round-trip, loud tamper rejection, status honesty (gate-passed, not admitted), the static-JSON-to-live-provider-to-receipt end to end, and snapshot hash verification |
| `build/check-agreement.mjs` | the agreement gate (F4): confirms all four cases imply the same type-hash for each common kind they use, matching the shared subtree, so the scaffolder may publish the common kinds as shared; a divergence is reported and stops the gate |
| `corpora/federation/federation.js` | the bottom-up federation over the four standalone members: the demonstration crossings on real cross-kernel content (a native forum crossing, an untyped-then-forked declaration crossing) and the composite weighings that select among members and ground by citing across the boundary; pure data, no member schema |
| `build/bottomup-build.mjs` | the bottom-up meta kernel: assembles the four case stores as standalone members (each owning its schema and pinning its own hashes), crosses claims between them through the composition layer, and builds a composite over them; modeled on eggs-build pointed at four independent kernels |
| `build/check-bottomup.mjs` | the adversarial independence test (the chain's iron): proves the four members own separate schemas, standing crosses only through an owned fork (the try-to-cheat step), the shared-hash crossings compose native, and the composite federates the whole; reports transparency status default on |
| `build/vendor-management.mjs` | freezes the raw federation facts the management provider runs over into vendor/management/management-snapshot.json: the kind rows each member declares, the crossings and the claim each crosses, a sample claim, and the common-kind names; writes no computed pin or status, which the provider computes live |
| `build/build-manager-probe.mjs` | builds the standalone kernel-manager probe page (manager-probe.html), inlining the shell, the manager module, the real contract and snapshot, and the federation view; separate from bundle.js so this slice does not rebuild submission.html |
| `build/vendor-kernel.mjs` | freezes one generated kernel's grounded store into vendor/<id>/kernel-snapshot.json = { state, sources, kinds }, the generic per-kernel analogue of vendor-snapshot.mjs; runs the kernel's own builder and serializes the store it already grounded, no data or grade changed |
| `build/build-detached-kernel.mjs` | assembles a generated kernel as a detached repository: vendors the whole kernel under substrate/kernel/ at a real content-hash pin, copies the kernel's corpora and build files, rewrites the build imports from ../kernel to the substrate path, and writes PIN.txt and a README naming the live git-submodule fetch as the production form the vendored pin stands in for; the detached repo runs its check on unzip with no fetch |
| `build/build-kernel-file.mjs` | builds the self-contained kernel file (<id>.kernel.html): vendors the kernel snapshot, refreshes the browser contract bundle, assembles the detached repository, stages all three as inlined JSON, and inlines the template; one file that IS the kernel, opens from file://, renders and authors through the real gate, and carries the detached repo the download hands back |
| `periphery/navigate/shell/modules/manager.js` | the kernel manager: renders the federation as multi-author kernels with their tiers and crossings and performs the three management writes (adopt, fork, cross) through the management contract, reads live grades and authors claims through the claim contract; the authoring panel gathers a claim with a support, proposes it through the real gate, and renders the receipt as the payoff (declared versus earned, the grade moving with support); vendors no answers, holds no grading logic |
| `build/check-management.mjs` | the management-contract oracle: proves the contract is a faithful membrane, its reads and writes equal what buildBottomUp and the adoption layer compute directly (listKernels pins, readCrossings statuses, adopt untyped-to-native, cross native-versus-untyped), holding no logic of its own |
| `scaffolder/kernel-config.schema.json` | the kernel config JSON Schema (local-tier slice): kernel_id, adopted_type_hashes, local_kinds, sources, time_lock, each field tagged with its x-tier (substrate-inherited, shared-adopted, local) so the config carries the fixed-shared-free line as data |
| `scaffolder/new-kernel.mjs` | the first scaffolder step: reads a config, emits a working empty kernel under corpora/<kernel_id>/ plus a build/<id>-build.mjs and build/check-<id>.mjs modeled on covid, then runs the generated check; holds no rules, defers all rule-checking to the real gate and check |
| `scaffolder/examples/*.json` | example configs: valid-empty (a passing empty kernel), broken-source-class and broken-unadopted-hash (each fails the real check with its named cause), eggs-config (regenerates the eggs schema from config) |
| `build/check-registers.mjs` | the register drift oracle (register view, phase E): every precise section of the judges document has an accessible counterpart and the reverse, every accessible section carries its source and register links and an explicit delta, every node link resolves live through the read contract (grounding under both registers), and every precise_version hash is fresh. Verifies structure, not fidelity; the `verify` lists are the authored obligations it surfaces and does not discharge |
| `build/vendor-demo.mjs` | vendors the guided path into vendor/demo/reading.json (Prompt 29): the three counterexamples as stops, each recomputed by the kernel readings the check-demo oracle verifies |
| `build/vendor-front-door.mjs` | vendors the front door (Prompt 40) into vendor/front-door/front-door.md: the body of docs/the-climb-of-synthesis.md, front-matter stripped, so the shell renders the opening section offline and holds no content of its own |
| `vendor/front-door/front-door.md` | the vendored front door: the body of docs/the-climb-of-synthesis.md, the easy-register overview the front-door module renders as the surface's opening section (build output of build/vendor-front-door.mjs) |
| `build/check-reconcile.mjs` | the reconciliation oracle (Prompt 22): the CVD within-domain crux resolving to the confounding-adjustment choice (Prompt 26), a synthetic rich pair (a real frontier and resolved sub-region), a disjoint pair, and determinism |
| `build/covid-build.mjs` | the shared builder for the densified covid case (Prompt 23a): builds the covid v3 store through the gate from corpora/covid |
| `build/vendor-covid.mjs` | vendors the densified covid case into vendor/covid/reading.json (Prompt 23a): the reading the shell renders, evidence to floors, the contradiction, and the crux resolving to the priors |
| `build/vendor-lineage.mjs` | vendors the lineage case (fourth exhibit) into vendor/lineage/reading.json: the novelty conjecture and its earned grade, the five near-miss gaps that ground it, the institutions where the mechanisms already run by hand, and the gate's demotions as the finding |
| `build/check-covid.mjs` | the covid-origins oracle (Prompt 23a): evidence to floors, contested interpretations, the zoonosis/lab-leak contradiction on shared evidence and priors, the meta level, the mode-disagreement findings, and the crux resolving to the priors |
| `build/lhc-build.mjs` | the shared builder for the densified LHC cascade (Prompt 25): builds the LHC v3 store through the gate from corpora/lhc, with the framing seam and the before/after graph for the shared-dependency reading |
| `build/vendor-lhc.mjs` | vendors the densified LHC cascade into vendor/lhc/reading.json (Prompt 25): the three legs, the shared-dependency robustness reading (before/after), the framework swap, and the settled-versus-performed finding |
| `build/check-lhc.mjs` | the LHC-cascade oracle (Prompt 25): the legs grounded to their floors and premises as characterized dependencies, the framework-choice node read two ways (robustness and framing swap), the undercuts, the performed-settling gap, and the empirical closure |
| `build/eggs-build.mjs` | the shared builder for the restructured eggs case (Prompt 20): builds the three domain stores through the gate and the composite through the composition layer, so the oracle and the presentation build the same structure |
| `build/vendor-eggs.mjs` | vendors the restructured eggs case into vendor/eggs/reading.json (Prompt 20): the reading the shell renders in a file:// page, computed by the kernel at build time |
| `periphery/navigate/shell/modules/covid-case.js` | the densified covid case as a shell module (Prompt 23a): the shared evidence to its floors, the contested interpretations, the origin question in the forum with its priors as the computed crux, and the 23-order divergence |
| `periphery/navigate/shell/modules/lhc-case.js` | the densified LHC cascade as a shell module (Prompt 25): the three legs with their grounding and undercut-lowered confidence, and the one framework-choice node read three ways (robustness on the shared dependency, the framework swap, the settled-versus-performed gap) |
| `periphery/navigate/shell/modules/lineage-case.js` | the lineage as the critique's fourth exhibit, lighter than the domain cases: it leads with the novelty conjecture and its earned grade, shows the five near-miss gaps that ground it, and puts the institutions where the mechanisms already run by hand one click down; renders the vendored reading and shows the gate's demotions as the finding |
| `periphery/navigate/shell/modules/on-ramp.js` | the on-ramp reach, the reading's turn from operating the kernels to making your own: it names as built and reachable the generator, the self-contained kernel file and detached-repo download, and the two connectors with their checks, without inlining a second running kernel |
| `periphery/navigate/shell/modules/vision-capstone.js` | the reading's capstone: renders docs/vision-and-continuation.md as the terminal section so the scroll ends on the destination; a light markdown pass over the canonical source, edited nowhere |
| `periphery/navigate/shell/modules/compost-ledger.js` | the compost ledger as a reading exhibit (order 501, a fork after the vision, not spine): renders docs/compost-ledger.md, the approaches killed while building, each with its kill and reactivation, so a judge audits the kills; renders the canonical source, edited nowhere |
| `periphery/navigate/shell/modules/front-door.js` | the front door as a shell module (Prompt 40): renders the vendored docs/the-climb-of-synthesis.md as the opening section (order -1, spine), before the guided walk, realizing the Go-deeper pointers as live links, in-surface where the target is a module here and the repo path where it is not; prose and links only, computes no grade |
| `periphery/navigate/shell/modules/guided-path.js` | the guided path as a shell module (Prompt 29): the three counterexamples staged in sequence, each stop carrying its fluent reading, its counterexample, its reproducible receipt, and a pointer into the case region; reads the vendored reading, computes no grade |
| `periphery/navigate/shell/modules/eggs-case.js` | the restructured eggs case as a shell module (Prompt 20): renders the vendored reading, the domains grounded to their floors, the weighings at structured-forum, the characterized gaps with closing conditions, and the exercisable denominator swap |
| `build/check-client.mjs` | the propose/read contract's oracle (Prompt 10). Runs propose/read over the local provider and confirms the receipt is byte-identical to a direct kernel run |
| `build/check-ingest.mjs` | the ingestion connector's oracle: from saved arXiv and OpenAlex fixtures it proves valid source rows makeSourceTable accepts, the metadata-only legal boundary (link back in every row, no full text), the rate limiter's three-second interval on a virtual clock, and one ingested source grounding a real claim through the propose contract |
| `build/check-produce.mjs` | the producer connector's oracle: it drives simulated agent tool calls through the MCP server into the real gate and proves an agent's well-formed claim is graded identically to a human's, an over-declared claim is demoted by the gate, and a structurally invalid input is rejected by the schema before the gate is reached, so the producer is checked by structure and grounding, not trusted |
| `build/check-map.mjs` | the typed-repository-map oracle. Assembles the node manifests, validates them, checks |
| `build/check-robustness.mjs` | the robustness analysis oracle (Prompt 13): the four fixtures, the two-closure separation, determinism, and the per-case top-conclusion fragility readings |
| `build/check-migrate.mjs` | the migration oracle (Phase B). Translates the three real cases and verifies the v3 grounding |
| `build/check-perturb.mjs` | the perturbation overlay's oracle. Exercises kernel/motions/perturb.js on the LHC case: the empty |
| `build/check-translate.mjs` | the trellis-to-v3 translator's oracle (Phase A). A fragment test over conjunction, disjunction, |
| `build/fork-demo.mjs` | demonstrate the canonical fork (docs/components-and-forking.md). pipe.stage1.plain |
| `build/gate-demo.mjs` | the runnable composition demo, now under Node (intake data model v3). The v3 JS gate |
| `build/new-client.mjs` | scaffold a new thin client. Emits clients/<name>.json pre-filled with the default |
| `build/repo-map.schema.js` | the schema for the typed repository map. A typed graph of the repository itself, in the |
| `build/translate-trellis.mjs` | the trellis-to-v3 ingestion path (docs/trellis-to-v3.md). A pure, deterministic translator |
| `build/vendor-gate-browser.mjs` | vendor the v3 gate kernel (plus the propose/read contract and local provider) into vendor/gate/gate.bundle.js so the client runs the real gate offline |
| `build/vendor-snapshot.mjs` | freeze the migrated corpus into vendor/gate/snapshot.json, the store state the local provider proposes against |
| `build/vendor-katex.mjs` | vendor KaTeX into the repo so the deliverable opens from file:// with no network |

## docs/trellises/ (the reasoning records the graph's claims compress)

The trellises are the reasoning records behind each case: the located crux structure, the discharge
ledger, and the exclusion reservoir the corpus nodes are the compressed output of. They sit beside the
argument, not in the corpus (they carry no gate node), and their repo-path references resolve.

| file | role |
|---|---|
| `docs/trellises/covid-origins-crux-trellis.md` | the COVID-origins dispute reconstructed and priced: the located cruxes, the withheld-record retype of the market-clustering crux, and the correlated-evidence collapse the reconciliation and shared-dependency readings now compute (`corpora/covid/covid-origins.js`, `kernel/analysis/reconciliation.mjs`) |
| `docs/trellises/black-holes-reconstruction-trellis.md` | the LHC black-hole safety argument reconstructed around the framework-choice node: the empirical anchor, the shared dependencies the robustness reading finds, Plaga's undercut, and the performed-settling finding (`corpora/lhc`, Prompt 25) |
| `docs/trellises/eggs-completeness-trellis.md` | the "should I eat eggs?" question-set completeness test: the four-word parse, the provenance sign-flip surfaced as the denominator node, and the coupled-subsystem deepening with its four structural moves (`corpora/eggs`, Prompts 20 and 26) |

## docs/ (the specified frontier and the record)

| file | role |
|---|---|
| `docs/coordination-layer-spec.md` | the coordination-layer specification: the frontier where many communities validate and build on each other's claims, designed as the built grade computation extended from claims to participants (standing is to participants what grade is to claims); it develops the parameters register's line into a function-and-contract vocabulary and the status ledger's Stage 4 into a worked design, and draws the built-versus-specified line sharply, the grade machinery built, the coordination layer specified |
| `docs/compost-ledger.md` | the compost ledger: the twenty-two approaches taken seriously while building EpiStack and then killed for a characterized reason, each with its kill and its reactivation condition, ordered by how much the kill shaped the final design, so a reader audits the kills rather than take the finished structure on trust |

## root tooling

| file | role |
|---|---|
| `linter.js` | the design discipline made mechanical. Enforces the linter rules in |
