---
Type: reference
Purpose: "Defines the four document types, the required header, and the two dependency chains, so the documentation set is itself a typed, navigable graph."
Depends on: [docs/parameters-register.md, docs/what-stands-without-trust.md]
Depended on by: [docs/register-view.md]
---

# Document Style Guide

The architecture's thesis is that untyped claims are the problem and typing them is the fix. This guide applies that thesis to the repository's own prose. Every document carries a thin required header, and below it documents vary freely by type. This is the same two-tier cut the parameters register draws for kernels, a small shared structure and free local form, applied to documentation, so the guide does not impose one template on every file, which would be the forced schema the architecture rejects. It names the types and states the header, as guidance and a thin invariant, not a mold.

## The required header

Three fields, at the top of every document, in a front-matter block. They are the questions a reader asks on opening a file, answered before the file is read.

**Type.** Which of the four kinds below. This sets the reading mode: an argument is read start to finish, a reference is indexed into, a record is scanned for status, a specification is consulted for a contract.

**Purpose.** The document's role, in a sentence: why it exists, not what it says. This field states the job and stops. It is not a summary of the contents, since the type already sets the reading mode and the dependencies already place the document in the graph, so a purpose that recites what the document argues is the content leaking into the header. "States X canonically," "maps the criteria to the architecture," "tracks build status" are roles; a sentence that lists the document's claims is a summary and does not belong here.

**Dependencies.** Two typed chains, kept separate, each bidirectional. The argument chain: what this document derives from conceptually, under "Depends on", and what derives from it, under "Depended on by". The code chain, for documents that describe or accompany code: what code this rests on and what code rests on it. A document may carry one chain or both, and the two are never merged, because they answer different questions and have different truth conditions, set out below.

Below the header, a document follows its type's conventions and is otherwise free.

## The four types

**Argument.** Persuades and reasons. Read start to finish. The judges document, the top-level README, the epistemic-uplift and adversarial-walkthrough documents. Conventions: prose in a meditation register, affirmative framing, the claim built rather than asserted.

**Reference.** Consulted, not read through. Indexed into for a specific answer. The criteria map, the parameters register, the layer READMEs, this guide. Conventions: structured for lookup, each section answering one question, stable across changes.

**Record.** Tracks state and history. Scanned for status. The status ledger, the case trellises, the exclusion reservoir. Conventions: entries with dates and states, honest about what is open, structured so a reader finds current status fast.

**Specification.** Defines how a part works. Consulted for a contract. The composition and API specs. Conventions: records and field tables, precise about inputs and outputs, the shapes rather than the prose.

## The two dependency chains, and why they are separate

The dependency field is not documentation of what happens to link to what. It is a declaration of where truth lives and which way it flows, so that a fork is a change at a source that propagates outward, and the chain tells you exactly what a change re-derives. Truth should live wherever makes it easiest to fork, at the point where the smallest clean change produces the largest correct propagation, and the chain points at that origin.

**The argument chain** is conceptual: what a document derives from in its ideas, and what derives from it. It is directional, because it flows from canonical sources outward to the documents that express them. There is no single root, because the architecture is not one claim but a small set of independent commitments, and each lives where a fork of that one commitment propagates without disturbing the others. A source is a document whose job is to state one commitment canonically and that derives from nothing more canonical; a derived document distills, applies, or narrows one or more sources. The grounding rule and schema, the composition and untyped-type mechanism, the parameters register, the kernel taxonomy, and the core move of separating trust from view are sources, each the canonical home of its own truth. The judges document is not a source but the furthest-derived leaf, a compilation that points at where the truth lives, so its header is almost entirely "Depends on" and almost nothing depends on it. So an argument edge asserts not only that A depends on B but that B is the more canonical source A is re-derived against, and a change at a source propagates to everything that derives from it while a change at a leaf stays local. The test for a source is the fork test: a source is a place where one fork changes one thing, so if changing your mind about one commitment forces edits to another commitment's document, they are not properly separated and the source set is wrong. This chain is authored, because what rests on what conceptually is a claim about ideas that no parser can read, and it is owned: whoever draws an edge asserts it. What is checkable about it is symmetry: every "Depends on" edge must have its matching "Depended on by" backlink in the other document, or the graph has a dangling citation, which is the documentation analog of the exact failure the kernel forbids in claims. And a truth that no document states canonically, relied on across documents but sourced in none, is homeless, which is not a filing problem but a signal that the architecture has a commitment it has never stated canonically, and the fix is a new source document rather than a new edge.

**The code chain** is mechanical: what code a document rests on and what rests on it, which for code is what imports what. It flows from sources too, the schema and the grounding rule are the canonical code and the rest imports from them, so the code chain is a propagation from that core the same way the argument chain propagates from its sources. This chain is derived, not authored, because a parser can read the imports and a hand-maintained code chain drifts. It is generated from the actual imports and verified against them, the same walk the map check already performs, so it is never wrong because it is never hand-written.

The two are typed so they compose. Ask for the code graph alone, the argument graph alone, or the union. The union is where structure shows: a document argumentatively load-bearing but importing nothing is pure framing, a file imported everywhere but arguing nothing is pure mechanism, and both edges on one node tell you which. Keeping them separate is what lets the union be informative rather than a blur.

## The two checks

The header carries two invariants, checked two ways, because the two chains have different truth conditions.

The argument chain is checked for symmetry: every downward edge has its upward backlink. This is authored structure verified for consistency, the dangling-citation check.

The code chain is checked for agreement with the imports: every declared code edge matches an actual import, and every import is declared. This is derived structure verified against the tree.

A document set that passes both is a typed graph whose truth has a source and whose edges resolve, which is the submission holding its own documentation to the standard it holds claims to. The documentation becomes a small worked example of the architecture it documents: typed, navigable by dependency, and forkable at a root that propagates.

A note on the two poles. The guide speaks of the leaf, a document that is almost all "Depends on", and the judges document is its example. Its mirror also exists and is healthy: a document that is almost all "Depended on by" and derives from almost nothing, of which the status ledger is the example, correct for the single source of build truth. Both poles are expected, and neither is a defect.

## The discipline for new documents

A new document declares its type, its purpose, and its dependencies before it is written, because the header is how it enters the graph. Its argument edges are authored and their backlinks added to the documents they point at, keeping the graph symmetric. Its code edges are left to the parser. And its place in the truth flow is chosen deliberately: if it states a commitment canonically, it is a source others will derive from and should sit where a fork of it propagates cleanly; if it applies or narrows, it derives from its sources and says so. If it states a truth that no existing document owns, it is a new source, and the signal that one is needed is a homeless truth surfaced by the truth-homing pass. The header is thin on purpose, three fields, so this costs little per document, which is what keeps the required tier small and the practice maintainable.
