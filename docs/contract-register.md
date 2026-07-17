---
Type: reference
Purpose: Enumerates the composition contract, the required tier a kernel must hold to stay composable, as the checkable complement to the parameters register's free tier, each invariant with the crossing that depends on it and the check that enforces it.
Depends on: docs/composition-spec.md
Depended on by: docs/parameters-register.md, docs/ecosystem-guide.md, docs/for-the-institutional-adopter.md, docs/the-climb-of-synthesis.md, docs/the-minimum-constitution.md
---

# The Contract Register

This register is the enumerated form of the composition contract: the required tier the parameters
register names in prose, promoted into checkable entries. Where the parameters register draws the line
and describes the free side, this register is the fixed side stated one invariant at a time, so the
boundary between what a community may set and what it must hold becomes an object a linter can check
rather than a distinction kept by hand. The two registers are complements over one line, and
`build/check-boundary.mjs` proves their entry sets disjoint and that no claim's text asserts fixedness
about a free parameter or freedom about a contract.

## The discipline, at the head

An entry earns its place here only if a crossing genuinely depends on it, the same admission test the
parameters register names for its required tier. Every invariant in this register is a constraint
imposed on every community that would ever compose with this one, so the register is as short as honesty
allows: free by default, required only when composition demands it. Adding an entry here is adding a
promise every future member must keep, and the burden of proof is on the addition.

Each entry names its modality (always required, in this register), its statement, the crossing or
property that depends on it, the check that enforces it (or `prose-specified` where no mechanical check
exists yet), and, where the self-kernel makes the property a claim about the running system, the
self-kernel ref it grounds in (`corpora/self/`, so the register enumerates the contract and the
self-kernel grounds it, the two linked rather than duplicated). The `Covers` field names which item of
the two enumerable source lists the entry answers: `spec:*` for the composition specification's
composability invariants, `guide:N` for the ecosystem guide's numbered invariants.

## The entries

### CR-typed
- Modality: required
- Statement: Every claim carries a type, even when that type is the untyped type.
- A crossing depends on it: a claim must land somewhere in the receiving kernel's space, if only as untyped, so a kernel that emitted genuinely untypeable claims could not be crossed into.
- Enforced by: build/check-gate.mjs, build/check-crossing.mjs
- Grounds in the self-kernel: self.typed
- Covers: spec:claims-typed

### CR-monotone
- Modality: required
- Statement: Grounding is monotone in the contamination sense, so a claim never advertises more standing than its necessary supports carry.
- A crossing depends on it: a composing kernel must be able to trust that an imported claim's grade is not a lie about its supports, or importing it would poison the composite.
- Enforced by: build/check-math-differential.mjs
- Grounds in the self-kernel: self.monotone
- Covers: spec:grounding-monotone

### CR-untyped-floor
- Modality: required
- Statement: The untyped type grounds nothing, so an imported claim confers no standing until an owned fork types it locally.
- A crossing depends on it: this is the laundering guard, holding by construction; a kernel that let untyped claims ground would be the channel the border exists to close, and no kernel could safely import from it.
- Enforced by: build/check-crossing.mjs, build/check-composition.mjs
- Grounds in the self-kernel: self.untyped-floor
- Covers: spec:untyped-grounds-nothing
- Claims: so.proto.cross, cos.untyped.mech

### CR-history
- Modality: required
- Statement: Claims carry their history, the record of their origin, their crossings, and the forks that retyped them.
- A crossing depends on it: a receiving kernel must be able to walk back what an imported claim actually rests on, or the crossing is not auditable and provenance is lost.
- Enforced by: prose-specified. The v3 record carries no first-class history field and no oracle yet verifies a complete traceable chain; this is the honest gap the self-kernel maps (docs/sorry-ledger.md, G-F).
- Grounds in the self-kernel: self.history (floored, the characterized gap)
- Covers: spec:claims-carry-history

### CR-forkable
- Modality: required
- Statement: Standing is forkable and revocable, so captured or poisoned state can be forked away from and misassigned standing can be withdrawn or superseded.
- A crossing depends on it: a kernel whose captured state could not be forked would trap anyone who composed it, so forkability is a promise a kernel makes to those who build on it.
- Enforced by: build/check-fork-contest.mjs, build/check-gate.mjs
- Grounds in the self-kernel: self.revocable
- Covers: spec:standing-forkable-revocable

### CR-shared-hash
- Modality: required
- Statement: Shared meaning is shared hash: two kernels mean the same thing by a type exactly when they pin the same type-bundle hash, and a subtly different meaning is a different hash.
- A crossing depends on it: this is the primitive federation rests on. Pinning the same hash means pinning the same attenuation apparatus, which makes native acceptance of the carried grade available and well-defined; it does not vouch that the source ran that apparatus honestly, so the receiver may always accept the carried grade or re-ground the claim under its own execution instead. What is contractually fixed is that standing is always recomputable (CR-recomputable) and that provenance always transfers, never that the receiver must accept the carried grade; an unpinned crossing arrives untyped and grounds nothing. Native lossless transfer is the receiver's accept-native stance, a permitted admission policy (the origin verification stance, PR-origin-stance), not a required invariant, so it is adoption of the hash, not the store boundary, that makes native acceptance possible.
- Enforced by: build/check-type-hash.mjs, build/check-crossing.mjs, build/check-agreement.mjs
- Grounds in the self-kernel: self.crossing-min
- Covers: guide:1
- Claims: so.proto.cross

### CR-recomputable
- Modality: required
- Statement: Trust is unownable: a claim's standing recomputes from the public graph by anyone, so no host, platform, or client owns what holds.
- A crossing depends on it: a composing kernel verifies an imported claim's grade by recomputing it against the graph rather than taking the exporter's word, so standing must be a function of public structure, not a grant held by an authority.
- Enforced by: build/check-gate.mjs
- Grounds in the self-kernel: self.determinism
- Covers: guide:2
- Claims: so.c2.mech

### CR-gate-authority
- Modality: required
- Statement: No participant holds authority the gate lacks: a client, a host, a directory, or a backend is untrusted infrastructure, and anything any of them asserts about the graph is recomputable against the graph.
- A crossing depends on it: an imported claim's grade must be gate-produced and re-derivable, never a figure infrastructure asserted, or a composing kernel would be trusting the exporter's plumbing rather than the graph.
- Enforced by: build/check-gate.mjs, build/check-map.mjs
- Grounds in the self-kernel: self.typing-acts
- Covers: guide:3
- Claims: so.c2.mech, cos.gate.mech, cos.producer.mech

### CR-typing-acts
- Modality: required
- Statement: Standing moves only through typing acts, admission through the gate, a fork adopted, or a pin changed; reading, ranking, viewing, and contesting move no grade.
- A crossing depends on it: a crossing transfers only what a typing act grounded, so a kernel that let a view or a contest move a grade would export standing no typing act earned.
- Enforced by: build/check-fork-contest.mjs, build/check-gate.mjs
- Grounds in the self-kernel: self.contest-inert
- Covers: guide:4

### CR-attenuation-line
- Modality: required
- Statement: Every function is owned by one side of the attenuation line: structural attenuation, recomputing what a claim rests on, belongs to the kernel and is mechanical; semantic attenuation, judging whether the floors are true of the world, belongs to a community and is attributable.
- A crossing depends on it: the structural half must be mechanical for an importer to recompute an imported claim's standing without adopting the exporter community's semantic judgment; a function that cannot say which side it lives on is misdesigned.
- Enforced by: prose-specified (docs/the-asymmetric-weapon.md; the structural-versus-semantic boundary made mechanical at each site, e.g. build/check-fork-contest.mjs's contest-changes-no-grade).
- Grounds in the self-kernel: self.def.structural-semantic
- Covers: guide:5

### CR-reading-open
- Modality: required
- Statement: Reading requires nothing, ever: no account, no credential, no permission; every graph, every grade, every receipt is open to any reader, and identity begins where writing begins and nowhere earlier.
- A crossing depends on it: recomputation of an imported claim's standing (CR-recomputable) is only universal if the graph it runs over is readable by any party, so the open read is what makes an imported grade checkable rather than trusted.
- Enforced by: prose-specified. The read contract (api/client-api.mjs) requires no credential; identity requirements attach only to the write path, which is the free tier's admission policy (PR-identity-admission).
- Covers: guide:6

## The complement

The free side of this line is the parameters register (`docs/parameters-register.md`): the time-lock
parameters, the standing and reputation rules, the agent policy, the type system, the forum and weighing
conventions, and the corpus content license. Each of those is a community's own choice with no effect on
whether another kernel can compose with it, and asserting fixedness about any of them, or freedom about
any entry above, is the masquerade `build/check-boundary.mjs` exists to catch. Diversity in the free
tier, unity in the required tier; this register is the unity, and its shortness is the design.
