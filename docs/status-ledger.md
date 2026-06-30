# Status Ledger

The single source of build truth for the submission. Every claim about what is and is not built lives here, graded on one scale, so that the prose elsewhere states a claim and points here instead of re-hedging in every paragraph. If a maturity claim appears anywhere else, it is wrong by construction: this file is the only place build status is asserted.

The grade runs from built to named, a gradient a reader can take top to bottom.

**Built and verified.** Coded or stored, and the oracle (build, linter, test, or measurement) passes.
**In progress.** The boundary or scaffold exists; the full thing is being built, with what remains named.
**Asserted, not built.** Designed and named, not yet stored or coded.
**A characterized leap.** A claim that reaches past its evidence, with the gap stated and the instance that would close it.
**Named, not walked.** The path is described, not yet taken.

The last two are where a careless project writes "future work." Here they say what is missing and what would close it. The unit of progress is the named gap, not the confident resolution.

Two groupings sit below the gradient: **the coordination layer**, a detailed mature-system design held at the asserted-not-built grade and grouped for coherence; and **open seams**, named risks in that design rather than features, each with what would resolve it.

**Scope.** This ledger is judge-facing and tracks the maturity of the claims. Open code obligations, latent bugs, and the specific deferred verifications live one level down in `docs/sorry-ledger.md`, which is developer-facing; the lines below cross-reference it where a status is discharged by a code obligation. The internal viability tracking stays offstage in its own file and never merges here.

**Discipline.** A PR is not done until the line it affects moves. Status lives here and is updated by the same merge that changes it, the same rule already applied to the corpus index and the sorry ledger.

## Built and verified

**[B1] The path.** A claim travels proposed, then sound in a model, then checked against the world, and promotion is advancing along it. Built.

**[B2] The derivation segment, two cases.** The middle segment is a real traversal of transformations on two measurement cases in two terminal states. Built. The generalization to every measurement claim is a leap; see L1.

**[B3] The partition.** The auditable side and the priced-and-refused side are structurally separated on a case that forks across the cut. Built.

**[B4] Composition.** Two uncoordinated emitters' frozen output composes mechanically, no model in the loop, in `compose_gate.py`. Built and runnable.

**[B5] The teaching client.** The plain-language learning-first surface, the explain layer, typeset math, the searchlight visual, and the concrete entry path. Built, verified in-browser.

**[B6] The compare view.** The cross-case sideways motion: two unrelated cases shown breaking in the same structure at different stages. Built.

**[B7] The store-and-API boundary.** Storage is the canonical typed graph; the engine exposes it through open reads and a gated write, named as a single documented contract (`engine/api.js`, `docs/api.md`); the consuming components are clients of that API. Built.

**[B8] The two-tier client layer.** A node declares only its kind (`presentation: { type, data }`, a closed graph-owned set); clients map kind to look. The thin tier (tokens + a kind-to-look mapping over the default read path, covering every kind) and the fat tier (`client.teaching`, the learning walk; `client.auditor`, an inspect-and-dependents console that uses a wider slice of the API a genuinely different way) both ship, switchable in `v1.html`. The boundary is enforced by the linter: a client touches no truth field and never reaches the store. Built and verified in-browser. `docs/clients.md` is the fat-client authoring contract.

**[B9] The thin-client kit.** A thin client is a single declarative manifest in `clients/` (tokens + a kind-to-look mapping), composed from a fixed palette of layouts and visuals (`data/clients/palette.js`) and validated loudly at build and at render: a manifest that misses a kind, names a layout or visual outside the palette, or malforms its tokens fails and renders nothing broken. The scaffold `node build/new-client.mjs <name>` emits a valid covering manifest; the gallery in `v1.html` switches clients by `#client=<name>` while preserving the node. `client.plain` (the default reader) and `client.warm` (a tokens-only fork of it) ship as manifests. A third client, `client.blueprint`, was authored from the kit alone, no engine, API, or view file edited, re-presenting one kind from the palette. `docs/thin-clients.md` is the authoring contract. Built and verified in-browser.

**[A2] Structural gap detection.** The detector finds the substrate's objective structural gaps, grounding (support reaching no terminal, or a leaf that is not a cited primitive), freshness (a dependency on a superseded source), coverage (no rebuttal searched, a question-set branch undrawn, an atlas pattern with no typed preconditions), and dangling dependencies, as first-class typed objects, and exposes them as open API reads (`api.gaps`, `api.gaps(id)`; `engine/gaps.js`, `docs/api.md`). Run on the cases it reproduces the sorry ledger exactly: six grounding gaps matching the six sorry markers, the un-populated atlas as two coverage gaps, no false ones, nothing ranked (`build/check-gaps.mjs`). The default client surfaces gaps read-only at a node, kind, what is missing, and the discharge, ranking nothing; the linter forbids any importance/score/weight/rank/priority field and any sort-by-importance path, so prioritization is absent by construction. Built and verified in-browser. Which gap most needs closing is subjective and stays out of scope; the deeper inconsistency and topological-hole methods are N5.

**[B10] The body corpus (the empirical floor).** Bodies (Earth, the Sun, a white dwarf, a neutron star) are a corpus sibling to the primitives, `data/bodies/bodies.js`: a body property is a measurement-terminal leaf with a value, a unit, and a citation, grounding the graph because the world closed it, the way a math primitive grounds because a derivation stops. The detector flattens populated properties into cited primitive leaves and adds one rule, populate-on-demand coverage: a model node that references a body property the body declares as a stub or lacks is a coverage gap whose discharge is the measurement, while a reference to an absent body is a dangling gap. Seeded with the bodies the LHC model reaches for (scalars populated, the accretion regime deferred to the existing `lhc.branch3` marker). Built and fixture-verified; the dense-body density and radius citations are order-of-magnitude placeholders flagged for tightening. Load-bearing use, repointing model nodes to cite bodies, is the next phase and is not yet walked.

## Asserted, not built

**[A1] The populated atlas.** The transformations named in the cases are illustrative, not stored entries with typed preconditions. Discharge: populate a handful with their preconditions and their selection-aware and heterogeneity-aware variants, moving the atlas from illustrative to load-bearing. Sorry ledger: the atlas-entry obligations. The gap detector surfaces this as a coverage gap (`ledger_ref: A1`).

## A characterized leap

**[L1] Every measurement claim crosses a derivation.** Real on two measurement cases; the generalization is the leap. Discharge: more measurement cases, or a structural argument that the segment is always present. The specific deferred verification of the LHC accretion regime against Giddings-Mangano (arXiv:0806.3381) is in the sorry ledger, not yet run.

**[L2] The two-stage factoring of the contested statistic.** The inference factors into a representativeness stage and a sufficiency stage, and the two contested cases fail at different stages rather than instancing one repeated failure. Earned from two; the reach is a conjecture. Discharge: a third instance that fails at one of the two stages as predicted. The case-specific numbers for COVID and eggs are deferred in the sorry ledger.

## Named, not walked

**[N1] The genesis-to-institution path.** The two-emitter case is the seed; the properties that make the substrate valuable at scale, independence across many contributors, a map no author owns, and standing with a real history, hold only past a threshold the seed has not crossed. The path is named, not walked.

**[N2] The data-layer unification.** One canonical store behind both the engine API and the compose-gate, resolving the three-artifact split at the repo root. A design decision to settle in chat; the clean store-and-API boundary is most of what it needs. Not yet walked.

**[N3] The LHC teaching content.** The teaching client is built on the population case; authoring it for the LHC cascade is gated on the human acceptance walk of the population case. Named, not walked.

**[N4] Perturbation.** The authored along-the-inference motion: flip an assumption and watch the conclusion give way. Designed, not built.

**[N5] Deeper gap detection: inconsistency and topological holes.** Beyond the objective structural gaps of A2, two deeper kinds are characterized but not built, and both belong to the subjective assessment layer. Inconsistency: put a justified confidence flow on the graph and the discrete Hodge decomposition separates a consistent credence potential from local circular inconsistency and from globally irreducible tension; the harmonic part is the prize, but it needs a justified metric on the edges or the decomposition is decorative. Topological holes: model adjudications as 2-cells and the first Betti number counts loops of relation with no adjudication spanning them, a formal hole in the reasoning; conjecture-grade, pending a commitment to what fills a loop. Both are chat-and-research, not a build.

## The coordination layer (designed, not built)

The mature-system design from the architecture doc (`docs/architecture-the-unownable-graph.md`). All sit at the asserted-not-built grade: specified in detail, no code. The discharge for each is implementation. N1 is the institution these compose into.

**[C1] Layered access.** Three layers: a private personal layer, an open forum layer carrying no verification weight, and the gated canonical layer. Designed.

**[C2] Time-locked standing.** The non-transferable, decaying, domain-typed, revocable labor credential that gates the canonical write, earned only by sampled verifiable work, and priced in elapsed time so compute cannot front-load it. Designed.

**[C3] The Knowledge Game.** The gated-write lifecycle: sponsorship under stake, fermentation in a cross-domain mesh that flags sterile agreement, and stratified random verification with asymmetric quorum. Designed.

**[C4] The red-team immune system.** Super-stake challenges adjudicated by the standing population on rotation, bountied and anti-self-dealing. Designed.

**[C5] The patch history.** Storage as a tamper-evident, append-only sequence of sealed canonical patches, so a captured present cannot un-verify the past. Designed.

**[C6] Client-side patch selection.** Canonical as a per-client choice over the patch history, so a fork is a re-point rather than a rupture and no single gate can be owned. Designed.

## Open seams (named risks in the design)

Risks in the coordination layer, surfaced rather than hidden. Each is unresolved; each names what would close it.

**[S1] The time-lock survival inequality.** Whether synthetic labor can survive a long sampling-and-revocation window more cheaply than the value of capture, against a high-value target with near-free synthetic labor. Defensible and parameterized, not proven. Closes with the inequality stated and computed.

**[S2] Synthetic versus genuine harmonic.** The harmonic inversion moves the attack to manufacturing cross-domain disagreement that looks heterogeneous. Whether synthetic harmonic is distinguishable from genuine is open; the cost argument (faking disagreement across genuinely different traditions is nearly as dear as having it) is plausible and unproven.

**[S3] Patch-boundary integrity.** Making patches the rollback unit makes the boundary a target: poisoning the window just before a patch seals, or contesting where the last good patch is. Rests on the provenance envelope, append-only and tamper-evident; closes by establishing that property rigorously.

**[S4] The density-collapse lever.** A governance threshold an attacker could drive a local cluster past, by inflating participant density and interaction velocity, to force collapse of a targeted sub-graph without engaging any claim's content. Surfaced in adversarial review, not yet answered.
