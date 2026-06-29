# Status Ledger

The single source of build truth for the submission. Every claim about what is and is not built lives here, graded on one scale, so that the prose elsewhere states a claim and points here instead of re-hedging in every paragraph. If a maturity claim appears anywhere else, it is wrong by construction: this file is the only place build status is asserted.

The grade runs from built to named, a gradient a reader can take top to bottom.

**Built and verified.** Coded or stored, and the oracle (build, linter, test, or measurement) passes.
**In progress.** The boundary or scaffold exists; the full thing is being built, with what remains named.
**Asserted, not built.** Designed and named, not yet stored or coded.
**A characterized leap.** A claim that reaches past its evidence, with the gap stated and the instance that would close it.
**Named, not walked.** The path is described, not yet taken.

The last two are where a careless project writes "future work." Here they say what is missing and what would close it. The unit of progress is the named gap, not the confident resolution.

**Scope.** This ledger is judge-facing and tracks the maturity of the claims. Open code obligations, latent bugs, and the specific deferred verifications live one level down in `docs/sorry-ledger.md`, which is developer-facing; the lines below cross-reference it where a status is discharged by a code obligation. The internal viability tracking stays offstage in its own file and never merges here.

**Discipline.** A PR is not done until the line it affects moves. Status lives here and is updated by the same merge that changes it, the same rule already applied to the corpus index and the sorry ledger.

## Built and verified

**[B1] The path.** A claim travels proposed, then sound in a model, then checked against the world, and promotion is advancing along it. Built.

**[B2] The derivation segment, two cases.** The middle segment is a real traversal of transformations on two measurement cases in two terminal states. Built. The generalization to every measurement claim is a leap; see L1.

**[B3] The partition.** The auditable side and the priced-and-refused side are structurally separated on a case that forks across the cut. Built.

**[B4] Composition.** Two uncoordinated emitters' frozen output composes mechanically, no model in the loop, in `compose_gate.py`. Built and runnable.

**[B5] The teaching client.** The plain-language learning-first surface, the explain layer, typeset math, the searchlight visual, and the concrete entry path. Built, verified in-browser.

**[B6] The compare view.** The cross-case sideways motion: two unrelated cases shown breaking in the same structure at different stages. Built.

**[B7] The store-and-API boundary.** Storage is the canonical typed graph; the engine exposes it through open reads and a gated write; the consuming components are forkable. Built.

## In progress

**[P1] The client layer.** The boundary holds and the consuming components are forkable today; the two-tier client system, thin clients that restyle the read response and fat clients that compose more of the API their own way, with a node declaring only its kind, is being built. Discharge: the client-layer and thin-client-kit work lands, a second client uses the store a genuinely different way, and a non-engineer ships a thin client from the kit.

## Asserted, not built

**[A1] The populated atlas.** The transformations named in the cases are illustrative, not stored entries with typed preconditions. Discharge: populate a handful with their preconditions and their selection-aware and heterogeneity-aware variants, moving the atlas from illustrative to load-bearing. Sorry ledger: the atlas-entry obligations.

## A characterized leap

**[L1] Every measurement claim crosses a derivation.** Real on two measurement cases; the generalization is the leap. Discharge: more measurement cases, or a structural argument that the segment is always present. The specific deferred verification of the LHC accretion regime against Giddings-Mangano (arXiv:0806.3381) is in the sorry ledger, not yet run.

**[L2] The two-stage factoring of the contested statistic.** The inference factors into a representativeness stage and a sufficiency stage, and the two contested cases fail at different stages rather than instancing one repeated failure. Earned from two; the reach is a conjecture. Discharge: a third instance that fails at one of the two stages as predicted. The case-specific numbers for COVID and eggs are deferred in the sorry ledger.

## Named, not walked

**[N1] The genesis-to-institution path.** The two-emitter case is the seed; the properties that make the substrate valuable at scale, independence across many contributors, a map no author owns, and standing with a real history, hold only past a threshold the seed has not crossed. The path is named, not walked.

**[N2] The data-layer unification.** One canonical store behind both the engine API and the compose-gate, resolving the three-artifact split at the repo root. A design decision to settle in chat; the clean store-and-API boundary is most of what it needs. Not yet walked.

**[N3] The LHC teaching content.** The teaching client is built on the population case; authoring it for the LHC cascade is gated on the human acceptance walk of the population case. Named, not walked.

**[N4] Perturbation.** The authored along-the-inference motion: flip an assumption and watch the conclusion give way. Designed, not built.
