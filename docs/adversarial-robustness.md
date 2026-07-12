---
Type: argument
Purpose: Argues the answer to the gamed-gate objection, deriving the cost-and-forkability solution type.
Depends on: docs/architecture-the-unownable-graph.md, docs/parameters-register.md, docs/status-ledger.md, docs/what-stands-without-trust.md
Depended on by: docs/adversarial_walkthrough.md
---

# Robustness Under Adversaries

The argument in `docs/what-stands-without-trust.md` answers what a claim is worth when its author cannot be trusted. That answer invites one objection, and this document answers it: a capable adversary games the gate, floods it with claims that pass, or captures the write path, and everything the system calls grounded is worthless.

The answer is not an ungameable gate. Against a determined adversary that is impossible, and claiming it would be the performed-settling the whole system exists to refuse. The answer is a gate that is expensive to game and recoverable when gamed. Cost and a damage cap, not a wall.

It helps to say what the gate is and is not doing, in plain terms. The gate does not filter the claims that pass through it; it defines what counts as an admissible claim in the first place. An admissible move is a claim the gate's checks recognize as grounded, and an attempted game, over-declaring a grade, laundering standing across a crossing, mis-typing to borrow a floor, resting a strong claim on thin support, is a non-move: it is admitted at the floor or demoted and never recognized as standing. The gate is hard to game not because it detects and blocks gaming but because gaming is not among the moves it recognizes, and producing grounding is the honest act itself. Engaging at all is opt-in: typing is the price of standing an agent chooses to seek, so an agent that wants no standing plays no move and is under no rule, its untyped emission entering at the floor and earning nothing. This sharpens the answer above rather than overturning it, since the determined adversary that plays admissible moves at scale is exactly what the cost-and-forkability argument below prices and caps.

For the solution type below walked through five concrete attacks, see the worked examples in [Adversarial Walkthrough](adversarial_walkthrough.md); this document argues the type, the walkthrough makes it concrete.

## The shape

Two mechanisms, aimed at two different quantities. Required work and time-locked standing set the cost of an attack. Forkability caps the damage of one. Together an attack costs a great deal and achieves little, because what it captures gets forked away, so honest participation is the cheaper path to a result that survives. Robustness here is that inequality, not a guarantee that the gate cannot be beaten.

The argument is producer-agnostic, and that is deliberate. The cost-and-recovery story depends on standing being hard to fake and easy to revoke, and on captured state being forkable, none of which turns on whether the agent is a person, an organization, a model, or a pipeline of these. So the threat model does not assume the attacker or the defender is human: an adversary is anything that emits claims, and the same two mechanisms price and cap it either way. How strictly a given community gates agents in particular is a free parameter, set in [The Parameters Register](parameters-register.md), and the standing system is what makes whatever policy it chooses enforceable.

## The cost: standing that takes time

The canonical write is gated by standing, and the standing is a non-transferable, decaying, domain-typed, revocable labor credential, earned by sampled verifiable work and priced in elapsed time. Priced in elapsed time is the load-bearing phrase: compute can produce plausible claims by the page, but it cannot front-load a credential that accrues only through a sampling-and-revocation window that runs in real time. So flooding the claim layer gains nothing, since an ungrounded claim grounds nothing downstream, and capturing the write path at scale requires standing that costs the one thing compute cannot shortcut. This layer is specified, Stage 4 in the status ledger.

Two clocks run here and they are easy to conflate. One is the claim's: how long a claim takes to become knowledge, which the warrant sets, so a checkable proof converts in one move and a convergent measurement converts over the time its independent confirmations take. The other is the producer's: how fast standing accrues, which the time-lock sets, and it runs in elapsed time in every domain regardless of the warrant, because what it rate-limits is reputation, not belief in any one claim. The distinction matters most exactly where it is most tempting to drop. A proof needs no time to become knowledge, but a producer emitting proofs still earns standing only in elapsed time, and a proof-heavy domain is the sharpest case for the producer clock rather than an exemption from it, because checkable work is the most automatable and so the cheapest to mass-produce. The producer clock is what a flood of valid automated work runs into: a thousand sound proofs in an hour are a thousand claims and an hour of standing, not a thousand units of it. This is worked as an attack in [the walkthrough](adversarial_walkthrough.md).

## The damage cap: a fork is a re-point

The API is a contract, not a location. Forking the kernel is the same operation the interactive client already performs when it swaps a local provider for a remote one: keep the reading tools and the contract, change which kernel the contract serves. In a fused system a fork is a rebuild, which is exactly what gives an incumbent kernel its power to capture. The layer separation makes a fork a re-point instead, and the content-addressed history makes the target well defined: an earlier patch before the poisoning, a new branch, or a fresh kernel. Client-side selection of that point makes the choice local, so no single kernel is a seizable center; owning one only makes people fork away from it.

The fork is two-level, which is the composition layer paying off a second time. A gamed domain store, a region of this top-down meta kernel, is contained by the composite: the poisoned domain is forked and the composite re-points its citations across the thin protocol, and the composition survives without rebuild. So capturing one domain does not reach the composite; the attacker is forked out of one domain while the rest holds.

This is the strongest of the three, because its mechanism runs today rather than being designed. The store-state history chains, the composition layer's notification and re-derivation is the re-point operation, and the API is the swappable membrane. A fork over a content-addressed history is those pieces used together, and they are built.

## The untyped type: the crossing that cannot launder standing

The forkability above has two grains, and naming them shows where the laundering channel would be and why it is closed. A retail fork casts one imported claim into a local type and signs the cast; a wholesale fork extends the schema so a whole category of crossings types natively. Both are the same operation the two-level fork performs, seen at the level of a single crossing rather than a whole domain: standing moves across a boundary only when an author owns the move.

The attack this forecloses is laundering: importing a claim from a gamed or unaccountable source and having its standing carry across the boundary unearned, so that capturing one store lets the attacker spend its standing everywhere it is cited. The untyped type closes that channel by construction. A claim that crosses a boundary arrives as the untyped type, which is not a floor, so nothing grounds through it and everything resting on it inherits untyped status. Standing therefore cannot be imported; it can only be earned on this side by an owned fork, a retail cast or a wholesale schema extension, gated and recorded like any other claim, with the author's own standing behind it. An attacker who games a source gains nothing at the crossing, because the crossing grants zero until someone signs for it, and the signature is exactly the accountable act the gate already prices. The launder is the sharpest non-move: not a crossing the gate blocks, but a crossing it never reads as conferring standing, so there is nothing to detect and nothing to evade. This strengthens the spine above rather than replacing it: forkability caps the damage of a capture, and the untyped type ensures a capture's standing does not leak across a boundary in the first place.

## The three are one: the standing layer

Forking works only if the honest community agrees which fork to move to. An adversary who cannot capture the kernel can still try to defeat forkability by fragmenting that choice, splitting the community rather than seizing the center. The answer is the same standing that gates writes: standing weights fork-choice, so an adversary who cannot fake standing cannot fragment the fork. Faking-resistance and fragmentation-resistance are one property, and the standing layer is the connective tissue that makes the three defenses one.

## The honest bounds

Two quantities stay open, and they are the sorries this document does not close.

**[S1], the nonemptiness of the lever space.** The levers set the cost of gaming against the price of contributing, and the open quantity is whether, for a given stake and adversary, a setting exists that prices gaming above capture while honest standing survives its own decay. Forkability helps rather than competes: forking caps the value of capture, lowering the number the gaming cost must beat. The requirement is not that gaming be impossible, only that it cost more than a capture that gets abandoned. It rests on the sampling being unfakeable, so it closes under a result from [S2], and it is named [S1] in the status ledger.

**Fork coordination.** The harder bound, answered above by the standing layer, but only as strongly as the standing layer resists fragmentation, which loops back to [S1]. The two open quantities are therefore one open quantity seen from two sides, and both rest on the standing layer holding.

## Maturity

The honest split, since the whole point is to refuse performed-settling about the system itself. The damage cap is real: forkability's mechanism, the history chain and the re-derivation and the API membrane, runs today. The cost layer, the time-locked credential and the gated-write lifecycle and the challenge system, is specified, Stage 4, graded in `docs/status-ledger.md`, with [S1] the open seam. So this document argues the solution type and demonstrates the recoverable half. It does not claim the cost half runs. The claim is the shape: expensive to game and recoverable when gamed, with the recoverable half built and the cost half specified in the open, which is the only claim the evidence supports and the only one worth making.
