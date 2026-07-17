---
Type: reference
Purpose: "The community invitation as a standalone artifact: the negative space for an EpiStack community over the three subjects, stated as an invitation to constitute one, with the fixed invariants, the free parameters, the first act, what exists to start from tiered by what is built, and how to take part. Nothing here implies a community exists."
Depends on: [docs/coordination-layer-spec.md, docs/kernel-workflow-guide.md, docs/parameters-register.md, docs/substrate-map.md]
Depended on by: [docs/community-backend.md, docs/ecosystem-guide.md, docs/for-the-institutional-adopter.md, docs/workflow-atlas.md]
---

# The Community Invitation

This document is an invitation to constitute an EpiStack community over the three subjects this submission carries, and it is only that. It describes the negative space where such a community would form, states what is fixed and what is open, and holds the door open. It does not describe a community that exists. There are no members, there is no traffic, and none is implied. The door being open and specified is complete on its own; it does not need anyone to have walked through it to be a real invitation.

## What this is

The submission grounds its three subjects (LHC safety, COVID origins, egg nutrition) as one worked map, and it ships the machinery for others to ground their own. What it does not ship is a running community, because a community is not a thing a single author can stand up alone. To pre-populate one would be to play both producer and adjudicator and call the result multi-party, and to pre-decide its rules would be to make the community's own most important choices for it. So the artifact is the frame a community would form through, with the constitutive decisions left open for the people who would make them. This is that frame, offered as an invitation.

## The fixed invariants (inherited, built, not votable)

Some properties are not the community's to set, because they are what make a kernel composable with any other kernel at all. A community that changed them would not be running a different EpiStack community; it would have left the protocol, because its claims could no longer cross into a kernel that relied on the guarantee it dropped. These are inherited from the protocol and already built:

- **The untyped-type crossing.** A claim entering a kernel that does not pin the same type arrives untyped and grounds nothing until an owned fork adopts the type locally. Standing does not transfer for free across a type boundary.
- **Monotone contamination.** A contested support can only lower a claim's grade along the support edges, never raise it. Weakening propagates; it does not reverse.
- **Producer-agnostic grading.** The gate reads a claim's structure and never its author's nature, so a person, an organization, or a model that types the same claim receives the same receipt.
- **The grounding rule.** A claim earns its standing from its supports by the weakest necessary link, with convergence adding at diminishing returns, so no author assigns a grade and the structure decides it.
- **The composability requirements.** The record formats, the identity and canonical form, and the shared type subtree that let uncoordinated kernels accrete onto one map.

These are not up for a vote. `docs/parameters-register.md` draws the full fixed-versus-free line and is the reference for exactly which promises a kernel must keep.

## The free parameters (named, left open, the community's to set)

Everything a community can move without breaking composition is genuinely open, and setting it is the community's own work, not the founder's:

- **The time-lock cost and its decay.** What a submission stakes, and how that stake ages.
- **The standing rules.** How a participant's weight is read from their record, within the ordering the protocol fixes.
- **The grade policy beyond the ordering.** The local policy choices the grade lattice leaves free once its order is fixed.
- **The moderation.** How the community handles conduct, disputes, and the human layer around the gate.

`docs/parameters-register.md` names each of these as free and explains why moving it still federates. The register is the definition of what it means to still be a kernel of this kind, and the free tier is where a community writes itself.

## The first act: set the free parameters together

The first act of a founding community is constituting itself by setting the free parameters together, not submitting claims. The reason is structural. A founder who set the parameters and then invited claims would already have made the community's most important decisions for it, which contradicts the forkable, no-central-adjudicator design the whole substrate rests on. Joint parameter-setting is the legitimate constitution of shared rules; claim submission comes after the rules exist, not before. This is why the invitation opens on deliberation rather than on a submission form.

## What exists to start from, by tier

Drawn from `docs/substrate-map.md`, which marks every piece built, to-genericize, to-build, or specified frontier:

- **A working individual kernel forks today.** The store (git), the gate, the grounding computation, the generator, and the cross-kernel crossing are all built. Fork the substrate and you have a real kernel of your domain, admitting claims by grounding and checkable by anyone. That is the N=1 foundation, and it is not a projection.
- **A small community needs a little bounded engineering.** A hosted submission endpoint (bounded work, post-submission) and a deliberation platform (ordinary, off-the-shelf tooling) are what turn the individual kernel into a small community where producers submit through a hosted gate and people deliberate the free parameters. At that scale standing is handled by deliberation directly, because at low participant count the community can weigh records by hand.
- **Scale without trust is the specified frontier the invitation opens onto.** The automated standing economy, the multi-producer lifecycle at scale, and cross-kernel discovery are specified in `docs/coordination-layer-spec.md`, not built. They are what a large trustless federation needs, and they are exactly what a community is invited to help build. They are the frontier: a small community does not need them to begin, and a large one cannot do without them.

The through-line is forkability. The substrate forks whole, so no instance is hosted by a center that could be captured, and the ultimate check on any instance's rules is that dissenters fork the entire apparatus, not merely the claims.

The operating design for the backend that hosts these functions is carved in `docs/community-backend.md`, one section per function with the best current contract for filling it at its tier. Ten of the eleven functions have a contract available today from commodity parts; the standing economy is the one function still on the frontier. That document also lists the open projects a contributor can pick up.

## How to take part

Three concrete steps, each pointing at something real:

- **Fork the substrate.** `docs/substrate-map.md` describes what a fork gets you, tier by tier. The substrate is AGPL and forkable by design.
- **Run the workflow.** `docs/kernel-workflow-guide.md` is the six-stage workflow a kernel comes to know its own domain through, reusable on any domain, with the math kernel as its worked instance. The prompt set that instantiates it is the on-ramp: run it as written and it rebuilds the math kernel, change its settings block and it builds a kernel of another domain.
- **Join the deliberation on the free parameters.** This is the first act above, the community constituting itself.

One note on the pointer. The substrate repository is a post-submission extraction from this competition repository, existing or forthcoming on the maintainer's timeline; `docs/substrate-map.md` is the target of that extraction, not a claim that the forkable repository is live today. The pointer holds either way, and this invitation does not present a not-yet-live link as though it were already serving.

## The claim, in one paragraph

A working individual kernel forks now, built and checkable. A small community completes soon, on bounded post-submission engineering and ordinary tooling. What a market of kernels needs at scale, the standing economy and the lifecycle and the discovery, is specified and named as the frontier the community is invited to help build. Between those three tiers there is a real path from one author's kernel to a federation, and every step of it is marked for what it is. Nothing above implies a community exists, has members, or expects traffic. It is an open, specified door, and an open door is complete on its own.
