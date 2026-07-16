---
Type: reference
Purpose: Draws the line between the free tier a community configures and the required tier a kernel must hold, as the reference for what is local policy and what is a composition invariant.
Depends on: docs/composition-spec.md, docs/kernel-taxonomy.md, docs/knowledge-system-how.md, docs/trust-and-view.md
Depended on by: README.md, docs/adversarial-robustness.md, docs/adversarial_walkthrough.md, docs/authoring-methodology.md, docs/community-backend.md, docs/community-invitation.md, docs/coordination-layer-spec.md, docs/document-style-guide.md, docs/ecosystem-guide.md, docs/epistemic_uplift.md, docs/extending-the-kernel.md, docs/kernel-workflow-guide.md, docs/lineage-architecture-findings.md, docs/protocol-spec.md, docs/reading-the-brief.md, docs/substrate-map.md, docs/what-stands-without-trust.md
---

# The Parameters Register

A kernel is configured by the community that runs it, and this register draws the line between what that community may set freely and what it must hold to remain composable with other kernels. The line is the composition contract. On one side are free parameters, local policy that nothing downstream depends on, which a community sets to its own situation and changes at will. On the other side are required invariants, the promises a kernel must keep for the untyped crossings and the shared grounding language to work, which a community cannot violate without leaving the protocol. A kernel that moves anything in the free tier still federates; a kernel that breaks a required invariant is no longer one of these kernels, because its claims can no longer cross into another kernel that relies on the guarantee it dropped.

The register is therefore not a list of settings. It is the definition of what it means to still be a kernel of this kind, and its central discipline is that the required tier is as small as possible, because every invariant in it is a constraint imposed on every community that would ever compose with this one.

## The free tier: what a community sets

These are local choices with real internal consequences and no effect on whether another kernel can compose with this one, because they govern how a kernel grounds and governs inside itself, not the language it speaks at the border.

The time-lock parameters, the levers that price gaming against contribution. How much elapsed, sampled work standing costs, how fast it decays, and the length of the sampling-and-revocation window: these set what it costs an adversary to game the gate against what it costs an honest producer to contribute, and a community tunes them to its own stakes, a longer window and a steeper cost where stakes are high, light where they are low. The property the lock holds across every setting is that standing accrues in elapsed time independent of the volume of work produced, so compute raises how much valid work a producer can emit without raising the standing that work earns; the attack this defends, and why it cannot be waived even where every claim is checkable, is worked in the adversarial walkthrough. Neither choice changes what a claim means when it crosses out.

The standing and reputation rules. Who earns standing, how it is weighted for canonical writes and for fork-choice, and whether some producers are trusted more than others. A community may run flat or hierarchical, meritocratic or credentialed, and remain composable, because a crossing depends on the claim, not on how the source community distributed standing.

The agent policy. Which producers may perform which steps, and whether agents are permitted, restricted to certain domains, or trusted equally with humans. This is the worked example of a free parameter: a kernel that forbids agents entirely and a kernel that lets agents do everything are both valid and can compose with each other, because nothing about a crossing depends on how the source kernel treated its producers, only on the claim arriving typed, grounded, and traceable.

The type system. What floors this kernel recognizes and what a claim may be typed as. A physics kernel and a nutrition kernel have different floors, and that difference is correct and local. A community extends its own schema by wholesale fork whenever its use warrants it, and this never threatens composition, because the untyped type is what carries a claim across a boundary between kernels whose type systems differ.

The forum and weighing conventions. How this community handles cross-domain weighings, what it treats as a settled question, and how it prices incommensurable trade-offs. These are governance choices about the community's own deliberation, not properties of what it exports.

The corpus content license. The terms a community declares its claims carry, gift, attribution-required, share-alike, non-commercial, or a named commercial term, enforced legally and normatively rather than mechanically, carried in the parameter record and therefore inside the governance-hash so it travels visibly with every fork. This never touches composition because a crossing depends on a claim's type and grounding, never on what its source community charges or requires downstream, so the license is exactly as free as the standing rules it sits beside.

## The required tier: what a kernel must hold

These are thin by necessity, because each one constrains everyone who composes with this kernel, and the federation is possible only because the set is small. Each is here because a crossing genuinely depends on it, and that is the sole test for admission to this tier.

Claims are typed. Every claim carries a type, even when that type is the untyped type. A kernel that emitted genuinely untypeable claims could not be crossed into, because the untyped type is the shared floor of the border and a claim must land somewhere in the receiving kernel's space, if only as untyped.

Grounding is monotone in the contamination sense. A claim never advertises more standing than its necessary supports carry. A kernel that let standing inflate above its supports would poison anything that composed it, so a composing kernel must be able to trust that an imported claim's grade is not a lie about its supports.

The untyped type grounds nothing. A claim resting on an untyped claim inherits untyped status, so imported claims cannot confer standing until an owned fork types them locally. A kernel that let untyped claims ground would be the laundering channel the border exists to close, and no kernel could safely import from it.

Claims carry their history. A claim carries the record of its origin, its crossings, and the forks that retyped it, so a crossing is auditable. A kernel that stripped provenance would make its exports untraceable, and a receiving kernel could not walk back what an imported claim actually rests on.

Standing is forkable and revocable. Captured or poisoned state can be forked away from, and misassigned standing can be revoked. A kernel whose captured state could not be forked would trap anyone who composed it, so forkability is a promise a kernel makes to those who build on it, not only a defense it keeps for itself.

That is close to the whole required tier. Its smallness is the design: these are what a kernel must promise to be composable, and everything else is free.

## Function and contract: the free tier has structure

The two-tier line is sharp, but each tier has an internal shape the coordination layer names, and this register carries that vocabulary so the two documents speak as one. A required invariant is better understood as a function: a slot and the properties any filling of it must have. The function is fixed because it is exactly what must match for two kernels to compose, the shared meaning their standing and their claims translate across.

A free parameter, seen from the same angle, is a community's contract filling a function, and a contract has two parts. Its form is its type, the specific choice that fills the slot. Its parameters are its values. Two contracts of the same form differ only in parameters and compose almost as one; two of different form are a cross-type difference that needs translation, which is the untyped-type move applied to the rules themselves rather than to the claims. The form is the part of a contract that does not float; the parameters are the part that can.

A parameter is static or floating. A static parameter is set flat, a value the community chooses and leaves. A floating parameter is set as a function of the community's own local state, a governor rather than a number, and it floats on local state only, never on federation-global state, so a community stays sovereign in its economy. That static-or-floating distinction is the free tier's internal structure the original two-tier line did not name. This section formalizes the vocabulary; `docs/coordination-layer-spec.md` is its worked development, applying function, contract, form, and parameter to the coordination mechanisms and sorting them into a fixed, a free-static, and a free-floating tier.

## Why the two tiers answer the maintainability question

The competition asks how a format stays usable across a diverse and changing user base and an expanding frontier of tooling. The register is the mechanism. Communities diverge freely across the entire free tier, setting different time locks, different standing rules, different agent policies, and different type systems for their different needs and risks, and they stay interoperable because they all hold the thin required tier. Diversity in the free tier, unity in the required tier. A new community joins by holding a small set of invariants while configuring everything else to its situation, which is federation with a written constitution rather than an unstated one, and the register is the constitution.

This also settles producer-agnosticism precisely. The architecture treats producers uniformly in the sense that producer policy is a free parameter, not a required invariant, because nothing about a crossing depends on whether a claim came from a person, a model, or an agentic pipeline, only on the claim being typed, grounded, and traceable when it arrives. So the architecture's answer to whether agents may do a given thing is the register's answer: that is a free parameter, a community sets it as its risks require, and it remains composable either way. Producer-agnosticism is not the claim that agents are treated identically everywhere; it is the claim that agent treatment is configurable and not required, and this register is what makes that claim exact. That is also safer than baking one policy in, because different communities facing different risks set different policies on the same substrate, and the architecture makes those policies explicit and enforceable rather than assumed.

## The discipline the register imposes on evolution

The register is a rule for how the architecture grows, not only a description of it. Every new capability must declare which tier its parameters live in, and the default is the free tier. A new required invariant is added only when a crossing genuinely depends on it, and the burden of proof is on adding to the required tier, because every invariant added there is a constraint imposed on every community that would ever compose with this kernel. Free by default, required only when composition demands it. That discipline is what keeps the required tier small, which is what keeps the federation possible, so the register governs not just how a kernel is configured today but what the protocol is permitted to become.
