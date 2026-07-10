---
Type: specification
Purpose: Specifies the grounding computation, the canonical home of the grounding rule the code and the downstream documents derive from.
Depends on: docs/knowledge-system-what.md, docs/knowledge-system-why.md
Depended on by: CLAUDE.md, docs/api.md, docs/architecture-spec.md, docs/architecture-the-unownable-graph.md, docs/components-and-forking.md, docs/composition-spec.md, docs/coordination-layer-spec.md, docs/design-axioms.md, docs/family-discrimination.md, docs/kernel-taxonomy.md, docs/lhc-cascade.md, docs/parameters-register.md, docs/status-ledger.md, docs/trellis-to-v3.md, docs/trellises/black-holes-reconstruction-trellis.md, docs/trellises/covid-origins-crux-trellis.md, docs/trellises/eggs-completeness-trellis.md, docs/what-stands-without-trust.md
---

# The Knowledge System: How It Is Built

*This is a specification of the system's makeup: the components, the contracts between them, and the computation at the core. It describes what each part must do and the rules it enforces, in enough detail to build against, without committing to a particular programming language or file format. It is a companion to two other documents, one stating the functions the system performs and one stating why it has this shape. It assumes no prior knowledge.*

---

## 1. The organizing principle: a trust boundary

The system is three kinds of component separated by one boundary.

On one side sits a small core that is trusted, and trusted only because everything it does can be checked mechanically by anyone. On the other side sits a large periphery of tools, much of it driven by AI, that does the fallible, judgment-heavy work and is trusted by no one. Between them sits a contract layer that lets anyone read the core freely and lets nothing change the core that has not passed the core's own checks.

The core is the **kernel**. The periphery is the **UI/UX layer**. The contract layer is the **API**. These are not three tiers of a stack; they are a trust boundary. The core's soundness never depends on the periphery being honest. That independence is what lets the system run the most capable available AI in the periphery without trusting it, and what lets the knowledge survive someone deliberately attacking it. Everything below follows from putting the deterministic, checkable work in the kernel, the fallible work in the periphery, and an enforcing contract between.

## 2. The foundation: the grounding lattice

Every claim and every grounding judgment in the system is a position in a single ordering. The ordering measures one thing: how much a downstream claim may rely on this one, from no reliance at the bottom to complete reliance at the top. Every contract in the system is, underneath, a function over this ordering, so it is described first.

```
        ⊤    grounded in every way that applies (rare, mostly theoretical)
        │
  ┌─────┼─────┐
proof  meas.  declaration      the three floors: each a complete grounding,
  └─────┼─────┘                 and none substitutable for another
        │
   structured  ┐
   attributed  ├  forum: grounded by faithful structure, rising completeness
   raw         ┘
        │
        ⊥    untyped (commits to nothing, supports nothing)
```

At the bottom is **untyped**: a claim that has been captured but makes no commitment at all. It can be stored, attributed, linked, and filtered, but nothing may rely on it. Above it are the **forum tiers**, where a claim is grounded by faithful structure rather than by reaching a hard floor: *raw* (committed to the forum, nothing more), *attributed* (its source is known), and *structured* (its supports and objections are drawn and the disagreement around it is shown). A claim climbs these tiers as work is done on it.

Above the forum sit the **three floors**, the hard groundings: *proof* (logical or mathematical), *measurement* (physical evidence), and *declaration* (binding by enactment, definition, or adopted standard). The three floors are deliberately drawn side by side rather than stacked, because none substitutes for another. A measurement is not a weaker proof; a declaration is neither. This is the one place the ordering branches, and it is what makes it a lattice rather than a line.

Two positions in this lattice hang on every claim. Its **ceiling** is the highest grounding it could ever reach, fixed when the claim is typed, by its kind: a mathematical claim's ceiling is proof, an empirical claim's is measurement, a definitional claim's is declaration, and a pure value judgment's ceiling is structured forum, because faithful argument is as far as it can go and no instrument lifts it higher. Its **effective** grounding is what it actually achieves given what it rests on. Effective is always at or below ceiling. A claim is fully grounded for its kind exactly when the two meet, and the gap between them is the work remaining.

## 3. Kernels: the deterministic core

There is one kernel design, used for every body of knowledge. A kernel that is almost all proof and a kernel that is almost all argument run identical machinery; only the population of claims at different lattice positions differs. A self-contained body of knowledge that grounds to its own floors is a kernel; a kernel that is part of a larger whole is a subkernel. The kernel is made of the following components, each a contract.

The **claim store** is the typed graph itself: claims as nodes, relationships as edges, every claim and edge content-addressed so it has a stable identity that does not change when unrelated things change. The **schema** defines what counts as a well-formed claim and a well-formed edge: the lattice of grounding types from the previous section, and the taxonomy of edges from the next. The **provenance record** binds every claim immutably to who asserted it, where, when, and in what context, so no claim floats free of its origin. A claim carries its history as part of what it holds: not only its origin but the crossings it has made between regions and the forks that retyped it, each recorded on the claim, so a standing is a traceable chain back to a floor that any reader can walk rather than a bare verdict.

The **grounding engine** computes the effective grounding of every claim by the sweep described in section 5. The **composition gate** is the sole write path: nothing reaches the store except by passing through it, and it admits a proposed claim or join only if the result preserves every invariant. The **contamination check** lives with the gate and enforces the rule that weakness flows downward: a claim may not hold a grounding higher than what its supports actually provide. The **exclusion store** keeps refuted claims together with the reason and grounds for the refutation, permanently, so a killed claim cannot be silently revived. The **reconciliation register** holds conflicts between grounded claims as first-class disagreement records, each with the specific point on which the two sides turn.

The **robustness analysis** computes, alongside grounding, how fragile that grounding is, by the cut-set method in section 5. The **mechanical assessment** computes the parts of argument-quality that are decidable from structure alone: evidence being double-counted, coverage that is missing, and the set of claims that would be affected if a given claim fell. The **grounding profile** is a derived, read-only summary of how much of the kernel sits at each lattice position and where. The **patch ledger** records every change as a signed, tamper-evident history, which is the basis both for auditing the kernel and for forking it.

## 4. The edge taxonomy: what connects claims

The relationships between claims are not a loose set of flavors; each one feeds exactly one kernel function, and only one family enters the grounding computation. Keeping the families distinct is what makes that computation well-defined.

One move underlies the whole taxonomy: **edges are themselves claims**. "A supports B" is a proposition that can be true or false, grounded or contested, and typed by the same lattice as any node. This single fact lets an edge carry its own grounding, lets an edge be attacked, and lets the strength of an inference live in the lattice rather than in a separate mechanism. A strict deductive link is a proof-grounded edge; a loose analogical link is a weakly grounded edge.

| family | relates | feeds | enters grounding |
|---|---|---|---|
| support | source is a reason for target | the grounding sweep | yes |
| undercut | attacks a support edge | that edge's own grounding | through the edge |
| rebut | asserts a claim is false | the reconciliation register | no |
| presupposition | target uses source as definition or framework | a separate validity check | no |
| restatement | two claims are the same proposition | deduplication | no |
| specialization | target is a narrower version of source | nuance, independent grounding | no |
| addresses | a claim answers a question | discourse structure | no |
| sub-question-of | a question nests under another | finding the decisive question | no |

**Support** is the only family that transmits grounding. An incoming set of jointly necessary supports combines by the lattice minimum, because a conjunction is only as grounded as its weakest necessary member; alternative sufficient sets combine by the lattice maximum, because the strongest available path wins. **Undercut** needs no special machinery: because the support edge it attacks is itself a grounded claim, undercutting lowers that edge's grounding, which lowers what the edge can transmit. **Rebut** does not transmit, because it is not support; when both claims are grounded it is a genuine conflict and goes to the reconciliation register. **Presupposition** does not transmit grounding either, but it imposes a different requirement: the presupposed claim must be currently valid, and if it is withdrawn the dependent becomes ill-formed rather than merely weaker. **Restatement** and **specialization** preserve "similar but not identical" without flattening it, the first feeding deduplication and the second letting a narrower claim be grounded even while its broader parent is not. **Addresses** and **sub-question-of** build the structure of questions that the assessment layer reads.

## 5. The core grounding computation

This is the central contract, and it is one sweep plus one pass over the type lattice.

**Grounding.** The grounding engine computes the effective grounding of a target by propagating up the support edges from claims that touch a floor. Each support edge transmits the minimum of two things, the grounding of its source and the grounding of the edge itself, so a floor-grade premise across a weak inference yields weak support. Within a set of jointly necessary supports the engine takes the minimum; across alternative sufficient sets it takes the maximum. The result is the target's effective grounding, and the **gap** on any claim is the interval between that effective grounding and the claim's ceiling.

**Contamination.** The contamination rule is not separate; it is the minimum above, with one simplification. For the purpose of the computation the three floors collapse to a single floor rank, so a claim that needs both a proof and a measurement stays at floor, while a single forum premise anywhere in its necessary support drags the minimum down to forum. That is exactly "a formal claim resting on a forum assumption is only as grounded as the assumption." The propagation runs only along support edges, never along presupposition edges, so a measurement expressed in declared units keeps its floor while the unit definition is checked separately for being in force.

**The gate.** Admission is a single comparison. A proposal is accepted only if the grounding it declares is at or below the effective grounding its supports actually provide. You cannot bank grounding you cannot cover: declare measurement while resting on a judgment and the effective value returns forum, the declared value exceeds it, and the gate rejects the proposal or forces it to re-declare at the grounding it can support. This is also why the bottom of the lattice can be left wide open. A raw, untyped claim has effective grounding at the bottom, and nothing grounded can take a necessary support edge from it without collapsing to the bottom itself, so unfiltered material is safe to admit at the cheapest tier.

**Robustness.** Grounding says how high a claim reaches; robustness says how fragile that reach is. The support graph is read as a reliability structure: necessary supports in series, sufficient sets in parallel, a claim falling to the bottom as a component failing. The robustness of a claim is its grounding level recomputed after the worst single removal among the claims it depends on. It is always at or below the claim's grounding, and they are equal exactly when the support is genuinely redundant. The interval between them is the fragility. A single point of failure is a claim shared across all of the target's sufficient paths, which is computable cheaply as a dominator in the support graph, and the system flags exactly the case FLF calls correlated evidence treated as independent: the graph presents redundant support but a single shared claim holds it all up. The same analysis is run separately over support dependence and over presupposition dependence, yielding two distinct fragilities with two distinct failure modes, a single point of grounding failure and a single point of well-formedness failure.

The honest limit of robustness is that disjoint dependence in the graph certifies structural independence, not true independence: two claims can be correlated through a common cause that is not represented as a node. The remedy is the same operation that exposes it. Naming the suspected common cause as a node that both paths depend on turns an unrepresented correlation into a shared dependency the analysis then finds. The check is as good as the graph is complete, and it improves as more is represented.

A refutation, finally, is a claim driven to the bottom of the lattice, recorded in the exclusion store with its grounds.

## 6. APIs: the contract boundary

The API is where the invariants are enforced at the edge of the kernel: reading is open, writing is gated, cross-kernel citation carries grounding, and history is tamper-evident.

The **read interface** answers any query over the kernel, a claim, its supports and objections, its grounding and robustness, its gaps, the shape of an argument, the grounding profile, the exclusions, the disagreements, and it requires no credential. The **propose interface** accepts a claim, edge, join, or refutation, and never writes directly; it hands the proposal to the gate, which decides. Writing is always proposing, and the gate always rules.

The **composition protocol** is the thin layer along which separate kernels meet, and it is downstream of the kernel format rather than a system of its own. Because every claim is content-addressed and carries its grounding mode, a citation from one kernel to another is simply a support or presupposition edge whose target lives in a different store, and the grounding it carries across the boundary is the target's own grounding read under that other kernel's floors. The contamination rule was never about location, only about mode, so cross-kernel citation needs no new contract: a forum claim citing a foreign proof inherits proof strength, and a formal claim resting on a foreign forum assumption is contaminated, exactly as if both lived in one kernel. What the protocol adds is the thin connective tissue: a shared way to express units and definitions so they translate across kernels, and a way to resolve a dispute that lands on a boundary. It stays thin on purpose, thick enough for kernels to compose, thin enough that no party owns the joined content, and each kernel keeps authority over its own claims and floors.

The direct inheritance just described is the native, within-schema case: when a crossing is between regions of one top-down schema it is an identity, and grounding carries as if both lived in one kernel, because they do. The other direction along the same axis, a federation of separate kernels that never shared a schema, needs one more piece, and the piece is the **untyped type**. It is one type every schema shares, and it is not a floor, so nothing grounds through it. A claim crossing between sovereign kernels arrives untyped and carries no standing, and everything resting on it inherits untyped status, so standing crosses only when a local author forks it across, retail per claim or wholesale per category, and owns the crossing as a claim of their own. This is the hinge that makes the protocol one thing serving both directions: native, lossless composition within a single schema, and lossy, owned crossings between many schemas, with the untyped type marking the boundary a claim must be re-earned across rather than laundered through. The federation direction is built on the hinge and verified by `build/check-bottomup.mjs`, which runs the four cases as standalone members and confirms standing crosses only through an owned fork; the hinge sits at the bottom of this submission's ordering.

The **provenance and fork interface** carries signed contributions, retrieves history, forks a kernel, and opens a merge proposal. The **subscription interface** notifies a downstream consumer when something it relies on changes, a cited claim withdrawn, a gap closed, a grounding lowered, which is what keeps a kernel that cites another from standing on a claim that has since been pulled. The **credential layer** governs who may propose to which kernel, with authority that is time-locked so it can be neither seized nor revoked instantly; reading requires none of this.

## 7. UI+UXs: the fallible periphery

Everything in this layer touches the kernel only through the API, and all of it is assumed fallible. This is where every AI component lives, and where all judgment-heavy work happens. Its outputs become trusted only by passing the gate.

The **ingestion pipeline** is the producer that reads messy real-world sources and emits attributed candidate claims with proposed types and links, then submits them through the propose interface. Extraction and first-pass typing happen here; the gate is what makes them safe to admit. The **authoring and curation tools** let a person, AI-assisted, add claims, propose groundings, discharge open questions, and record refutations. The **navigator** is the family of reading surfaces, a static rendering that simply shows the map, a light client that walks it, and a rich client that drills in and runs what-if explorations, all read-only.

The **assessment agent** is an AI consumer that reads through the API and produces the interpretive assessments the kernel cannot compute mechanically, the decisive question in a dispute, where a move carries more rhetorical than evidential weight, what to examine next. Its conclusions are themselves claims, submitted back through the gate, so even AI judgment becomes auditable structure rather than trusted opinion. The **query surface** answers a discerning consumer's question, such as whether a claim is grounded and where it is weakest, by walking the graph. The **red-team surface** is the set of tools for attacking the knowledge, proposing objections, finding thin grounding, submitting refutations, which is how adversarial scrutiny is operationalized.

The **forum filter** lives entirely in this layer and resolves the tension between keeping everything and showing only what is wanted. The kernel types everything down to the raw tier and keeps it; the filter decides what a given reader sees. A consumer who wants only well-attributed, structured claims filters out the raw tier; a researcher trawling for anything relevant turns the filter off. Whether a claim is typed is enforced by the kernel and is never relaxed, because typing is the price of being engageable, and "untyped" is a real type at the bottom of the lattice rather than the absence of one. How demanding a type's standard is depends on the type, and the forum types are deliberately undemanding. The strictness at the floor and the openness at the bottom are the same rule seen from its two ends.

## 8. How the three meet

The flows across the boundary are simple. Producers in the periphery submit through the propose interface; the gate consults the grounding engine and admits only what preserves the invariants. Consumers in the periphery read freely through the read interface. Nothing in the periphery is trusted, and the gate is the only thing that decides what enters the trusted core.

The coordination machinery does not form a fourth kind of component. The tamper-evident patch history is a property of the claim store, which is storage that does not forget. The credentialing of who may propose is a property of the write path, which is the gate with the added question of authority. Both distribute cleanly into the two boundaries already named, which is why the system is genuinely three kinds of component, a deterministic core, a contract membrane, and a fallible periphery, and no more.
