---
Type: argument
Purpose: Walks the robustness solution type through five concrete attacks, as the worked companion to the robustness argument.
Depends on: docs/adversarial-robustness.md, docs/parameters-register.md, docs/status-ledger.md
Depended on by: nothing
---

# Adversarial Walkthrough

The robustness argument states a solution type: a gate expensive to game and recoverable when gamed, cost from time-locked standing and required work, damage capped by forkability. This walks that type through five concrete attacks, so the mechanism is visible rather than asserted. Each scenario names the attack, follows what the mechanism does, and states the bound honestly. Where a mechanism is specified rather than built, it is marked, because the point is the shape of the defense, not a claim that all of it runs.

This is the worked-scenarios companion to [Robustness Under Adversaries](adversarial-robustness.md), which argues the solution type these five attacks make concrete.

The threat model is producer-agnostic. An adversary here is anything that emits claims, a person, a model, or an agentic pipeline, and none of the five defenses turns on which it is: standing is priced and revoked, and captured state is forked, the same way whatever produced the attack. How strictly a community gates agents in particular is a free parameter it sets in [The Parameters Register](parameters-register.md), not an assumption baked into the threat model here.

## One: flooding the claim layer

An adversary generates plausible claims by the thousand and pushes them at the store, aiming to drown the grounded in fluent noise.

Nothing downstream moves. Reading the graph is open, but a claim's standing is a property of what it rests on, computed the same for everyone, and a flood of claims that rest on nothing grounds to nothing. An ungrounded claim supports no conclusion, so the flood adds volume and no standing, and a reader querying what is load-bearing sees straight through it, because the load-bearing view walks support, not word count. The cost of generating the flood is the adversary's; the cost of ignoring it is one computation. This is the cheapest attack to defeat, and it is defeated by the grounding rule alone, which runs today.

## Two: acquiring standing to poison a domain

An adversary decides to do it properly: acquire the standing to write, then enter a false claim that grounds, or bend a real one.

Here the cost layer bites. The canonical write is gated by standing that is non-transferable, decaying, domain-typed, revocable, and earned by sampled verifiable work priced in elapsed time. Priced in elapsed time is the load-bearing phrase: compute can produce claims in bulk but cannot front-load a credential that accrues only through a real-time sampling-and-revocation window. So acquiring enough standing to poison a domain at scale costs the one thing generation cannot shortcut, and if the poisoning is caught, revocation takes the standing back and the exclusion record keeps the false claim with the reason it fell. This layer is specified, Stage 4 in the status ledger, and its open quantity is [S1], the survival inequality: whether synthetic standing survives a long sampling-and-revocation window more cheaply than the value of capture. The honest state is that this is designed and its central inequality is unproven.

There is a subtler form of this that pays the cost honestly. Standing is earned by valid work, and valid work can be automated: an adversary emits sound proofs by the thousand, each passing the gate, each conferring real standing, and spends the accumulated reputation where reputation is the lever, on canonical writes over non-checkable claims or on fork-choice weight. Nothing here is fake, which is why verification cannot catch it, because every proof is sound. The defense is not at the gate but in how standing accrues: it accrues in elapsed time, not per unit of valid work, so a thousand sound proofs in an hour are a thousand valid claims and an hour of standing, not a thousand units of it. The producer's clock and the claim's clock are separate, the claim converting to knowledge on its warrant while the producer's standing accrues on the lock, and a checkable, automatable domain is the sharpest case for the lock rather than an exemption from it. This too is Stage 4 and specified; the property it turns on, standing rate-limited in elapsed time independent of work volume, is the time-lock's whole job, stated in [The Parameters Register](parameters-register.md).

Suppose the adversary pays the cost anyway and a poisoned claim lands. Then the second mechanism takes over, and it runs today.

## Three: the poison lands, and the community forks

A poisoned claim is in a domain, grounding, and readers build on it before it is caught.

The damage is capped because a fork is a re-point, not a rebuild. The API is a contract, not a location, so the reading tools and the interfaces read through it regardless of which kernel it serves, and the store's history is content-addressed. When the poison is found, the honest community re-points to a point in the history before the poisoning, or to a fresh fork, and the claims that rested on the poison re-derive against the clean base. In a fused system this would be a rebuild of everything, which is exactly what gives an incumbent store its power to hold captured ground; the layer separation makes it a choice of point in a history, selected client-side, so there is no single store to seize, because seizing it only makes people fork away. The mechanism is the store-state history, the composition re-derivation, and the contract membrane, and those are built.

## Four: gaming one domain inside a composite

An adversary cannot take the whole thing, so it aims at one domain kernel inside a federated composite, hoping the poison propagates upward into everything that composes it.

It does not propagate, because composition imports across a thin protocol rather than fusing. A composite cites its member kernels' claims, and a member's claim enters the composite as the untyped type, grounding nothing above it on its own. So a poisoned domain is forked and the composite re-points its citations at the clean fork, and the composition survives without a rebuild, because it never depended on the member's internals, only on cited claims through the protocol. The fork is two-level: capturing one domain gets the adversary forked out of that domain while the rest holds, rather than getting the composite. This is the composition layer's second payoff, and its mechanism is the same re-point and re-derivation that the single-domain fork uses.

## Five: laundering standing across a border

An adversary controls a loose kernel, one whose floors are set so permissively that everything grounds, and tries to carry a false claim from it into a strict kernel so it arrives looking measured.

The border refuses to carry standing. A claim crossing from another kernel arrives as the untyped type, which is not a floor, so nothing grounds through it, and anything resting on it inherits untyped status. Standing cannot be imported, only earned by an owned fork: for the false claim to ground in the strict kernel, an author there must retail-fork it, cast it into a local type, and sign the cast as a claim of their own, staking their standing on the crossing. The launder therefore requires a local author to put their name on the false claim, which is not laundering but assertion, caught and revocable like any other claim. The untyped type closes this channel by construction, without the protocol needing to understand the loose kernel's type system at all, and it is present at the bottom of the ordering today.

## The bound that ties the last two together

An adversary who cannot capture the store and cannot launder across a border has one move left: defeat forkability by fragmenting the community's choice of which fork to move to, splitting people rather than seizing the center. This is the real bound, and its answer is the standing layer: the same time-locked standing that gates writes weights fork-choice, so an adversary who cannot fake standing cannot fragment the fork. Faking-resistance and fragmentation-resistance are one property, which means the fork-coordination bound and [S1] are the same open quantity seen from two sides, and both rest on the standing layer holding. That is the honest seam of the whole design, and it is named rather than hidden.

## What runs and what is designed

The split matters, since the point is to refuse performed-settling about the system itself. The damage cap is real: forkability's mechanism, the history, the re-derivation, the contract, and the untyped-type border, runs today, so flooding fails, a poisoned domain is forked out, a captured domain does not reach the composite, and a cross-border launder cannot confer standing, all by mechanisms in the tree. The cost layer, the time-locked credential and the gated-write lifecycle, is specified, Stage 4, with [S1] the open inequality. So the walkthrough demonstrates the recoverable half and argues the cost half in the open. The claim is the shape, expensive to game and recoverable when gamed, with the recoverable half built and the cost half designed honestly, which is the only claim the evidence supports and the one worth making.
