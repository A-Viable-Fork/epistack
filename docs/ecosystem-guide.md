---
Type: argument
Purpose: The one document a builder opens first: the ecosystem's fixed invariants, the contract each role holds, community sharing and discovery, identity as a graded claim, and the deliberate absences stated as design. Integrates by pointer; the protocol specification governs where they diverge.
Depends on: docs/protocol-spec.md, docs/parameters-register.md, docs/composition-spec.md, docs/community-backend.md, docs/community-invitation.md, docs/substrate-map.md, docs/clients.md, docs/coordination-layer-spec.md, docs/the-asymmetric-weapon.md, docs/trust-and-view.md
Depended on by: nothing
---

# The Ecosystem Guide

This document is the map for anyone building on the protocol rather than reading about it: a community founder, a client author, a contributor, an agent establishing an identity, a deployment maintainer, a directory operator. It states the invariants that hold everywhere, then gives each role its contract: what is fixed for you, and what is yours. It integrates by pointer; where a rule matters, the document that owns it is named, and [the Protocol Specification](protocol-spec.md) governs wherever prose and spec diverge. Tier marks run throughout: **built** means a named check enforces it in this repository; **specified** means the design is fixed and the construction is not. The line between the two is drawn per item in [the Status Ledger](status-ledger.md) and is never blurred here.

## The shared substrate, stated once

Everything below stands on one small fixed core: the record formats and the canonical form, the one named hash, claim identity as hash(kind, statement), the grade lattice and the earned-grade recurrence, the gate as the sole write path, the crossing with its untyped floor, and type bundles whose hash is their identity. [The Protocol Specification](protocol-spec.md) defines them; [the Parameters Register](parameters-register.md) draws the line between the parameters required for composition and the parameters a community sets freely. Every contract in this guide is a way of holding that core fixed while varying everything else.

## The invariants

These hold across the whole ecosystem. Each follows from the substrate; none is a policy choice.

1. **Shared meaning is shared hash.** Two parties mean the same thing by a type exactly when they pin the same type bundle hash; a subtly different meaning is a different hash. This is the primitive federation rests on ([the Composition Specification](composition-spec.md)). Built.
2. **Trust is unownable; views compete.** Standing recomputes from the public graph by anyone, so no host, platform, or client owns what holds. Everything above standing, ordering, rendering, teaching, ranking, is view, and views are a market ([Trust and View](trust-and-view.md)). Built for standing; the market is whoever shows up.
3. **No participant holds authority the gate lacks.** A client, a host, a directory, a backend: each is untrusted infrastructure. Anything any of them asserts about the graph is recomputable against the graph ([The Community Backend](community-backend.md)). Built.
4. **Standing moves only through typing acts.** Admission through the gate, a fork adopted, a pin changed. Reading, ranking, viewing, and contesting move nothing: a contest is recorded at its own standing and changes no grade, mechanically checked (build/check-fork-contest.mjs). Built.
5. **Every function is owned by one side of the attenuation line.** Structural attenuation, recomputing what a claim rests on, belongs to the kernel and is mechanical. Semantic attenuation, judging whether the floors are true of the world, belongs to a community and is attributable. A function that cannot say which side it lives on is misdesigned ([Trust and View](trust-and-view.md)).
6. **Reading requires nothing, ever.** No account, no credential, no permission. Every graph, every grade, every receipt is open to any reader. Identity begins where writing begins, and nowhere earlier.

## For a community founder

A community is its kernel. Founding one is a typing act: choose the kinds, ceilings, and floors that encode your community's semantic policy, pin the shared type hashes you adopt, and name a contribution target that admits patches by re-running the gate. [The Kernel Workflow Guide](kernel-workflow-guide.md) is the six-stage lifecycle with a worked instance; [the Community Invitation](community-invitation.md) is the constitution-shaped negative space, invariants fixed, free parameters open, and the first act of a community is setting them together.

Fixed for you: the substrate, the crossing, the invariants above. Yours: the typing policy (your semantics, frozen into checkable structure), the admission policy including what identity to require and at what grade, the parameters the register marks free, and your governance, which the protocol deliberately does not contain ([the Coordination Layer Specification](coordination-layer-spec.md), specified).

Sharing your community is passing a **community card**: a small manifest carrying the kernel identity, the snapshot hash, one or more fetch locations, the pinned type hashes, the contribution target, and the protocol identity. The hash covers the meaning-bearing fields; the fetch locations are transport hints. Anyone can mirror the files, because trust lives in the hash and not the host: a community survives its host the way it survives its clients. Specified; the snapshot it points at is the static form of a kernel (build/emit-snapshot.mjs, built).

## For a client author

A client renders a kernel; it never is one, and it never outranks one. The contract is [the client contract](clients.md) over the provider seam (api/client-api.mjs): propose and read, with the provider interchangeable behind one import, a local provider running the real gate over a snapshot on the reader's device, or a remote one. The presentation-type set is closed so every client renders every node and no client invents a kind. Deep links are claim hashes, so links are portable across clients: any client can link into any other's rendering of the same claim. Built.

The invariant that keeps this a market: **no client is privileged, including the first-party one.** A client holds no capability that any other client with the snapshot lacks, and a deployment claims this as a governance claim grounded by its import graph, mechanically checked, not promised. A platform that wanted to strangle third-party clients would have to strangle the protocol, because there is no API to price into a weapon: the graph is public, the snapshot is a static file, and the gate runs wherever the reader is.

Fixed for you: the record shapes, the closed presentation set, the receipt shapes, the rule that gate passage renders separately from semantic acceptance. Yours: everything the reader sees, ordering, disclosure, teaching, objectives, and the view market rewards whoever does it best.

## For a contributor

A contribution climbs a three-state ladder, and no state implies the next:

1. **Gate-passed.** Your proposal grounds against the target's graph; the receipt proves the structure holds. This is structural attenuation and it is mechanical.
2. **Admitted.** The target kernel's own suite re-ran the gate and merged the patch. This is the community's act of taking the claim into its store.
3. **Semantically accepted.** Members of the community, attributably, judged the claim's floors true enough to build on. This is semantic attenuation and it is never mechanical.

The contribution bundle carries its content-derived identity, its receipt, and its status, and the status says gate-passed, never more (api/contribution.js, built; the durable patch history remains specified, [4.5]). A pasted citation does not become an independent confirmation by being pasted; independence is an attribute someone attests and stakes their standing on.

## For an agent: identity as a graded claim

An account is a keypair. The public key hash is the account identity: global by content-addressing rather than by registration, issued by no one, revocable by no one, identical at every community. What the ecosystem deliberately lacks is the issuer, the party who could deny an identity or confiscate one.

Everything else about identity is claims. "Key K is this persistent agent, with these attributes" is a claim; its supports are attestation claims; its grade is computed by the same recurrence that grades everything else. A bare key is that claim self-asserted, and it sits where self-assertion sits. A community vouch supports it. Independent attestations, a domain proof answered by challenge, an external registry binding, standing held over time, lift it through the lattice exactly as independent support groups lift any claim, and different attestation kinds carry different ceilings natively: a cryptographic proof can earn what a social vouch cannot, and the lattice already knows how to mix them.

Communities then set thresholds per action, all free parameters at the credential seam (api/credential.js, [4.2], specified): reading requires nothing, by invariant 6. Proposing might take any key. Contesting a type might take a supported identity; vouching for others, a corroborated one. Engagement rights scale with the earned grade of the identity engaging, and each community prices the scale.

Grade travels, which is why an account is worth holding. A corroborated identity arrives at a new community carrying its attestation structure, and the structure recomputes there under that community's own pins and tables. The well-attested contributor starts nowhere from zero; a griefer's fresh keys never climb off the floor, and burning an established identity costs everything it took to earn. The passport asymmetry applies verbatim: strict satisfies loose, a signed contribution is admissible wherever anonymity is tolerated, an anonymous one never satisfies a signature requirement, so identity fraud is herded into its maximum-exposure form.

Two boundaries keep this from becoming the thing it replaces. **The grade grades the identity claim, never the person**: it answers how established it is that key K is this persistent agent with these attributes, not whether the agent is good. Behavioral judgment lives in federated exclusion and vouch claims, plural, evidenced, attributable, weighed by each community under its own policy ([The Asymmetric Weapon](the-asymmetric-weapon.md), the shared compost pile). And **the judgment of an identity is always local**: the attestation graph is global, the grade computed over it is each community's own, under its own trust in each attestation kind. A community that trusts a given registry at zero gets a different number than one that does not, and both are correct locally.

Presentation is per-act and agent-chosen, and a presentation is a predicate over the agent's attestation graph, proven without disclosing more than the predicate. Four canonical levels: this key (a particular verified individual); a member of group G; a member of this community; and the empty predicate, a fresh key at the floor. Options are downward-closed in the attestation order: the fully attested agent holds the whole menu, a bare key holds only the last. The presented grade is the grade of the predicate's own claim: your identity claim's grade at level one, the group's membership-machinery grade at level two (what the verifier learns is that someone the group admitted acted, so the ceiling is trust in the group's admission), the community's at level three, self-assertion at level four. The cap is total across everything identity-keyed: action thresholds evaluate the presented identity, and personal footing (testimony, judgment, vouches) contributes at most the presented grade. Impersonal evidence is unaffected; a measurement never cared who presented it, so an anonymous claim carried by impersonal evidence can still reach the ceiling, and that arrival is the definition demonstrated: knowledge as what survives the attenuation, applied by the knower to themselves. A group needs no new object: a group is a set of membership claims, and its admission grade is their computed standing.

Spent standing is identity information: high standing cannot be wielded anonymously, since the wielding itself identifies; the membership levels are the disciplined exception, disclosing exactly one bit of affiliation. Two costs are part of the design and stated with it. Linkability is a community free parameter with different adversary surfaces: unlinkable presentations make an anonymous griefer's acts unbannable even pseudonymously; linkable variants allow excluding a thread of acts without identity; an opening authority that can deanonymize is a reintroduced trusted producer inside the group, and a community that installs one should know that is what it chose. And membership presentation requires a member-set commitment published alongside the community's state, so anonymity at levels two and three is only as fresh as the last commitment. All of this is coordination-layer, specified, unbuilt, and marked so.

Key rotation and loss are succession claims, key K2 succeeds K1 signed by K1, keeping continuity in-protocol. Specified, with the rest of this section: nothing in it is built, and the credential seam is the stub it says it is.

## For a deployment maintainer

A deployment that ships the protocol carries its own accounting: a pinned, attributable substrate with an integrity lock, a governance kernel whose claims describe the deployment's own behavior, and checks that ground those claims, ranking cannot move standing, private data cannot enter a public patch, no undeclared egress, entered bare and grounded by real checks rather than asserted. [The Substrate Map](substrate-map.md) places the individual deployment as the N=1 case of the community kernel. The first deployment's requirements enter as claims, at their honest floor, awaiting the verification that only a community performs.

## For a directory operator

A directory is a kernel whose domain is other communities: claims of the shape "kernel X, snapshot hash Y, pins Z, fetchable at W," graded, contestable, and forkable like anything else. Anyone can run one; they compete as views over shared structure, and a directory that misdescribes a community is contradicted by the community's own hash. What the ecosystem deliberately lacks is the registry, the single list that could delist. Discovery is plural by construction. Specified as a convention; it requires no machinery the substrate lacks.

## The deliberate absences

Each absence is a design, most of them the same design: a claim-level judge of meaning, wherever it is installed, is a reintroduced trusted producer, a fixed target for whoever optimizes against it, and a single surface whose capture poisons everything downstream. The higher-level-adversary argument, applied six times.

- **No account issuer.** Accounts are keypairs, global by content-addressing; what to require of them is each community's admission policy; identity attributes federate as claims; reading never requires identity.
- **No global score.** A universal reputation number is a trusted aggregation of "who is good," one Goodhart target, one capture surface, and one community's judgment exported as everyone's default. Negative knowledge federates instead as exclusion claims, positive knowledge as vouches and attestations, each community composing them under its own policy. The stated cost: federated exclusion is opt-in and lagging, so cross-community griefing is bounded and slowed by admission friction rather than prevented by decree. The bound is the design.
- **No tokens.** No protocol currency, no financial incentive layer. The standing economy is the honest frontier, and its one fixed constraint is provable-fault-only slashing; everything else there is unsettled and marked so.
- **No central registry.** Of communities, of clients, of types. Directories are kernels, plural and forkable.
- **No semantic judge.** The kernel structuralizes a community's semantic policy through typing and never judges meaning claim by claim. This is the boundary between structural and semantic attenuation, and it is the whole design in one line.
- **No ingesting kernel.** A kernel that pulls content in chooses what enters, and choosing what enters is synthesis, so an ingesting kernel is a trusted synthesizer. Ingestion lives in the periphery, where its judgments are attributable and its outputs still face the gate.

## What this guide does not standardize

This guide fixes what must be shared for artifacts to compose. It does not standardize what should remain local: personal objectives, semantic judgment, participant governance, validation incentives, identity thresholds, or community purpose. Those are the free parameters, and setting them is the first thing a community does.
