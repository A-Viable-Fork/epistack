---
Type: specification
Purpose: Defines how kernels compose, the untyped type and the crossing, as the canonical source the composition code and the other documents cite.
Depends on: docs/kernel-taxonomy.md, docs/knowledge-system-how.md, docs/trust-and-view.md
Depended on by: docs/coordination-layer-spec.md, docs/extending-the-kernel.md, docs/lineage-architecture-findings.md, docs/parameters-register.md, docs/protocol-spec.md, docs/status-ledger.md, docs/the-asymmetric-weapon.md, docs/workflow-atlas.md, docs/workflow-producer-video.md
---

# The Composition Specification

Composition is how one kernel builds on another without fusing their schemas. A composite kernel cites claims from other kernels, domain stores or full kernels, across a thin protocol, and the protocol's whole content is a single shared type and the rules for crossing into and out of it. This document defines that type, the crossing, and the two operations by which a crossed claim earns local standing. It defines the mechanism; the argument for why federation is preferable to one schema lives in the judges document, and the three kernel types live in the kernel taxonomy, which references this document for how the crossing works.

## The untyped type

Every schema shares exactly one type, the untyped type. It holds two populations of claim, treated identically:

- Claims imported from another kernel whose local type does not translate into this kernel's schema.
- Claims a local author declined to type, for any reason.

These are the same situation from the protocol's side, because in both the protocol knows exactly one thing about the claim: that it is not grounded in the local type system. The protocol's stance toward both is therefore identical, and unifying them into one type is what keeps the protocol small, since it needs no theory of foreign type systems, only a place for claims it cannot vouch for locally.

The untyped type has three properties, and they are the whole of its behavior:

1. It is not a floor. Nothing grounds through it. A claim typed untyped has no standing on its own.
2. Inheritance is downward. A locally-typed claim that rests on an untyped claim inherits untyped status, because measured standing cannot be built on something the local system has not measured.
3. It carries origin as inert metadata. An imported claim records where it came from and how it grounded in its origin kernel's terms, and the grounding rule ignores this while a reader may use it.

Property one and two together are the laundering guard, and they hold by construction rather than by policy. Because the untyped type is not a floor and standing does not propagate up through it, a claim cannot import standing from a permissive kernel into a strict one; it arrives untyped and grounds nothing until it is forked and typed locally, which requires a named local author. So a cross-kernel launder is not blocked by a check, it is impossible to express, because the type that carries a foreign claim is the type that confers no standing.

Read against the definition in `docs/trust-and-view.md`, the untyped type is the one type that performs no attenuation. To type a claim is to subject it to that type's attenuation, driving its dependence on its author down toward a floor; the untyped type does none of this locally, which is exactly why it grounds nothing. It holds the claims the local system has not attenuated: a foreign claim whose attenuation happened under another kernel's rules, and a local claim its author declined to attenuate at all. That is the same fact the protocol already knows about both populations, said in the definition's terms.

## The crossing

A claim moving from kernel A into kernel B enters B as the untyped type. The crossing is lossy in one direction: it may lower or annotate standing, never raise it. A claim that grounded to a measurement floor in A does not arrive in B as a measurement in B's terms; it arrives as untyped, carrying the inert record that it was measured under A's rules. B may then treat that record as it chooses, as context, as weak support, or as nothing, but never as a floor of B's own.

The crossing preserves provenance and strips authority. What crosses is a record that something was grounded elsewhere, not a grant of grounding here. This is why the crossing is honest about disagreement rather than hiding it: a claim that has crossed three kernels carries three annotations and very little transferred standing, and that thinness is the true and legible cost of composing kernels that share no schema. Composition is the accumulation of such crossings, not the reconciliation of the kernels' internal grounding rules, which is what lets two kernels that genuinely disagree about what grounding means still compose.

In the definition's terms, the crossing strips the attenuation. A claim's standing in A is the work A's type did in driving out A's authors; that work does not transfer, because B's authors are other people and B did no attenuating. So the claim arrives with its local attenuation removed, carrying only the record that it was attenuated elsewhere, and the lossiness is not a defect to be minimized but the honest register of that fact: standing earned by attenuating one kernel's authors out is not standing over another kernel's, and a protocol that let it cross intact would be laundering unearned authority. The crossing is lossy because attenuation is local, and honoring the loss is what keeps the composite truthful about whose authors have actually been driven out of what.

Every crossing is recorded in the claim's history, so a crossed claim carries the chain of where it originated, which borders it crossed, and how its standing changed at each, and that history is bidirectional and traceable, which is what makes a composition auditable rather than a flattening.

## Earning standing: the two forks

A claim in the untyped type earns local standing only by a fork, and there are two, at two grains.

**Retail fork.** An author in the receiving kernel forks a single untyped claim into a local type, casting it into the receiving schema and signing the cast. The claim now grounds locally, because a named author asserted that the crossing is legitimate and staked their standing on it. The original untyped import remains, provenance intact, and the forked typed claim supersedes it locally. This is the common case, and it puts the cost of typing exactly where the judgment was made: no one had to agree that claims of this kind generally cross, one author decided this one does, and owns it. In the definition's terms, the fork is what re-subjects a crossed claim to attenuation: the crossing stripped A's, and typing the claim locally starts B's, driving the claim's dependence on the forking author down under B's own type, which is why the standing it earns is genuinely B's and not a transfer of A's.

**Wholesale fork.** When the same category of crossing is forked repeatedly, an author forks the kernel itself and extends its schema so that claims of that shape type natively from then on. The retail forks for that category stop being necessary. This is the heavier act, earned by repetition rather than declared in advance, and it is owned by whoever performs it.

Standards emerge from the relationship between the two. Retail forks are the leading indicator of where a schema wants to grow: a crossing that many authors keep forking by hand is a schema extension waiting to be written, and the fork history shows which. So a shared vocabulary forms bottom-up, as accumulated retail forks become a wholesale one, rather than being imposed by decree. The untyped type is therefore not only an escape hatch but the sensor that shows where a standard should form.

## The content-addressed crossing

The crossing above is lossy by default because it cannot generally tell whether A's type and B's type mean the same thing. When they demonstrably do, the loss is not necessary, and the mechanism that recognizes it is content addressing. A type is not a name but a bundle, the kind with its ceiling and rules, the floor with its rank, and the source class with its footings, and `kernel/schema/type-hash.mjs` hashes that bundle over its apparatus rather than its label (`hashTypeBundle`, over a canonicalized form so the hash is order-independent and deterministic). Two kernels that mean the same thing by a type therefore pin the same hash, and two that mean something different pin different hashes even if they spell the type the same; `build/check-type-hash.mjs` proves both the determinism and the meaning-sensitivity, and the built status is ledger entry [3.4].

The hash certifies which attenuation a claim underwent. The type bundle is the apparatus that performs a given attenuation, so its hash is the identity of that attenuation, and a claim carrying a pinned type carries a certificate of exactly which one drove out its authors. This is what lets a crossing be lossless without trusting a name: the receiving kernel checks whether it pins the same hash, which is to say whether it performs the same attenuation, not whether the two kernels happen to use the same word.

A crossing between two kernels that pin the same hash is native and lossless. Because the target performs the very attenuation the claim already underwent, no standing is stripped: the claim's grade carries across intact, and a composite in the target resting on it grounds at the composed top. A crossing into a kernel that pins no matching hash arrives untyped and grounds nothing, exactly as the default crossing does, until a fork re-subjects it to the target's own attenuation. `build/check-crossing.mjs` is the oracle for both behaviors, running four cases as independent kernels: a same-hash claim crosses native and lossless, an unpinned claim arrives untyped, and a fork restores standing, so it is adoption of the hash, not the store boundary, that decides.

This is where the degenerate lossless crossing named in the taxonomy below becomes concrete. The special case in which a crossing loses nothing is precisely the same-hash case: two floors coincide exactly when the two type bundles hash the same, so the lossless internal crossing of a top-down kernel and a same-hash crossing between two independent kernels are one mechanism, not two. The hash is what places every crossing on the one axis, from the identity crossing inside a single schema, through same-hash native crossings between kernels that have converged on a type, out to the fully lossy untyped bridge between kernels that share nothing.

## The composability invariants

For a kernel to be composable, it must hold the invariants the crossing depends on, which are the required tier of the parameters register: claims are typed, including as untyped; grounding is monotone in the contamination sense; the untyped type grounds nothing; claims carry their history; and standing is forkable and revocable. A kernel that violates any of these cannot be safely composed with, because the guarantee the crossing relies on no longer holds. The register is the canonical statement of that tier; this document is why each invariant is required.

## Composition and the taxonomy

The untyped type is the coordinate that makes the kernel taxonomy a continuous axis rather than three discrete options. A top-down meta kernel is the point on the axis where the domains are regions of one schema, so every internal crossing is an identity, a trivial crossing whose losslessness is the special case where two floors coincide. A bottom-up meta kernel is the point where the domains are independent kernels and every crossing is a lossy untyped bridge. Each converges toward the other as schemas merge or relax, and a top-down kernel's native composition is exactly the degenerate case of this mechanism in which no crossing loses anything. The taxonomy names the three types; this mechanism is what places them on one axis.
