---
Type: specification
Purpose: Defines how kernels compose, the untyped type and the crossing, as the canonical source the composition code and the other documents cite.
Depends on: docs/kernel-taxonomy.md, docs/knowledge-system-how.md
Depended on by: docs/extending-the-kernel.md, docs/parameters-register.md, docs/status-ledger.md
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

## The crossing

A claim moving from kernel A into kernel B enters B as the untyped type. The crossing is lossy in one direction: it may lower or annotate standing, never raise it. A claim that grounded to a measurement floor in A does not arrive in B as a measurement in B's terms; it arrives as untyped, carrying the inert record that it was measured under A's rules. B may then treat that record as it chooses, as context, as weak support, or as nothing, but never as a floor of B's own.

The crossing preserves provenance and strips authority. What crosses is a record that something was grounded elsewhere, not a grant of grounding here. This is why the crossing is honest about disagreement rather than hiding it: a claim that has crossed three kernels carries three annotations and very little transferred standing, and that thinness is the true and legible cost of composing kernels that share no schema. Composition is the accumulation of such crossings, not the reconciliation of the kernels' internal grounding rules, which is what lets two kernels that genuinely disagree about what grounding means still compose.

Every crossing is recorded in the claim's history, so a crossed claim carries the chain of where it originated, which borders it crossed, and how its standing changed at each, and that history is bidirectional and traceable, which is what makes a composition auditable rather than a flattening.

## Earning standing: the two forks

A claim in the untyped type earns local standing only by a fork, and there are two, at two grains.

**Retail fork.** An author in the receiving kernel forks a single untyped claim into a local type, casting it into the receiving schema and signing the cast. The claim now grounds locally, because a named author asserted that the crossing is legitimate and staked their standing on it. The original untyped import remains, provenance intact, and the forked typed claim supersedes it locally. This is the common case, and it puts the cost of typing exactly where the judgment was made: no one had to agree that claims of this kind generally cross, one author decided this one does, and owns it.

**Wholesale fork.** When the same category of crossing is forked repeatedly, an author forks the kernel itself and extends its schema so that claims of that shape type natively from then on. The retail forks for that category stop being necessary. This is the heavier act, earned by repetition rather than declared in advance, and it is owned by whoever performs it.

Standards emerge from the relationship between the two. Retail forks are the leading indicator of where a schema wants to grow: a crossing that many authors keep forking by hand is a schema extension waiting to be written, and the fork history shows which. So a shared vocabulary forms bottom-up, as accumulated retail forks become a wholesale one, rather than being imposed by decree. The untyped type is therefore not only an escape hatch but the sensor that shows where a standard should form.

## The composability invariants

For a kernel to be composable, it must hold the invariants the crossing depends on, which are the required tier of the parameters register: claims are typed, including as untyped; grounding is monotone in the contamination sense; the untyped type grounds nothing; claims carry their history; and standing is forkable and revocable. A kernel that violates any of these cannot be safely composed with, because the guarantee the crossing relies on no longer holds. The register is the canonical statement of that tier; this document is why each invariant is required.

## Composition and the taxonomy

The untyped type is the coordinate that makes the kernel taxonomy a continuous axis rather than three discrete options. A top-down meta kernel is the point on the axis where the domains are regions of one schema, so every internal crossing is an identity, a trivial crossing whose losslessness is the special case where two floors coincide. A bottom-up meta kernel is the point where the domains are sovereign kernels and every crossing is a lossy untyped bridge. Each converges toward the other as schemas merge or relax, and a top-down kernel's native composition is exactly the degenerate case of this mechanism in which no crossing loses anything. The taxonomy names the three types; this mechanism is what places them on one axis.
