---
Type: reference
Purpose: The operational design for a kernel community's backend, carved into eleven functions by the coordination layer's function-and-contract split, each function marked built, assembly-available, or frontier, with the Stage 4 finding that this repository already runs the admission contract in embryo through its own CI.
Depends on: docs/community-invitation.md, docs/coordination-layer-spec.md, docs/parameters-register.md, docs/substrate-map.md
Depended on by: docs/ecosystem-guide.md
---

# The Community Backend

The backend is designed by the coordination layer's own split. Functions are fixed by what a community needs, and contracts are the best current way to fill each function, found by the market and swappable without renegotiating the function. A community swaps a contract and still composes with communities running different contracts, because composition depends on the protocol (the store format, the gate, the hashes), never on backend choices. The backend is periphery.

The backend is untrusted infrastructure. It cannot mint standing, because standing is recomputable by anyone from the public store, and a tampered admission produces receipts and certificates that fail to reproduce, detectable by any verifier. A malicious operator has two attacks: forgery, which is detectable, and censorship, which is answered by forking the whole stack. The test every contract must pass is that it adds no authority the gate does not already have. A contract requiring a trusted operator decision anywhere in the write path is the maintainer-merge anti-pattern, and it is excluded by construction.

## The carve

One section per function: the function, the best current contract for it, and the tier that contract sits at (built, assembly, or frontier).

### 1. Store persistence

The hash-chained, append-only, publicly readable state. Contract: a git repository, content-addressed, history-preserving, forkable, and mirrored for free. Tier: **built**; this repository is the instance.

### 2. Admission (the gated write path)

Receive a contribution from any producer, run the real gate, append on admission, and return the receipt. Contract: CI-as-gate, a mechanical workflow that runs the gate's checks on every proposed contribution and merges on green. The legitimacy line: a maintainer's merge judgment in the write path is the anti-pattern, but a CI job executing the check suite is the gate executing, with git as transport. Operator tampering with the workflow is covered by the untrusted-infrastructure frame, since a forged admission fails to reproduce against a clean run. A named option for communities where attribution priority matters is commit-reveal: submit `hash(contribution)` first to timestamp priority, then reveal the content, so an observer cannot front-run a pending contribution to claim its credit, using the hash machinery already built. Tier: **built in embryo** (see the Stage 4 section below). Alternative contract: a hosted endpoint wrapping the gate, assembly-available, named in the substrate map.

### 3. Verification access

Anyone recomputes standing without trust. Contract: the public repository plus the check suite; clone, run, and compare certificates. Recomputing the grade is structural attenuation, open to anyone; the semantic attenuation, re-performing the checks a record attests, contesting a sock puppet's claimed independence, and recording an exposed forgery in the compost, is the community's work, carried by functions 5, 9, and 10. Tier: **built**.

### 4. Read surface

Consumers read claims, grades, and reconciliations without cloning. Contract: a static site derived from the store on each admitted write. Static generation preserves derived-never-stored: the site is a derivation with no state of its own and cannot drift from the store it renders. Tier: **assembly**; the presentation shell is the in-repo instance of the rendering, and the derive-on-write pipeline is commodity CI.

### 5. Identity and attestation

Who a checker is, and the cost of a sock puppet. Contract today: named ids plus signed git commits, giving checker identity cryptographic teeth using machinery git already carries. This yields attribution, not Sybil-resistance; the full answer is the standing economy, function 10. Tier: **assembly**.

### 6. Deliberation

Free-parameter debate, challenges, and the forum tier. Contract: ordinary tooling (a forum, discussions, chat), with one hard rule: **deliberation concludes in a typed, attributed parameter-change submitted through the same gated write path**. Talk anywhere; decisions land through the gate. Tier: **assembly**; the tooling is commodity and the rule is the design.

### 7. Ruleset lifecycle

Propose, time-lock, adopt, and version parameter changes. Contract: ruleset changes as ordinary gated contributions plus a two-phase merge honoring the community's `time_lock`. The proposal lands immediately as a record, it takes effect after the configured delay, and the delay is enforced by the same CI, so a violation is detectable in the history. The time_lock has a dual purpose, and both guarantees flow from value being stored in the kernel. It is the cost anchor: standing accrues only over locked time, so credibility cannot be assembled instantaneously, the defense the adjacent field learned against flash-borrowed voting power. It is also the exit window: changes queue against the same clock, so a dissenter forks with kernel-stored standing intact before a change applies. One lock, two guarantees: no rushing in, no trapping in. Tier: **assembly**, with the `time_lock` parameter itself built (the parameters register).

### 8. Federation and crossing

Pin other communities' type hashes, import citations, and check staleness. Contract: recorded remote refs with pinned hashes in-store, and `isStale` checks running in CI so stale citations flag on every build. Two type-level tools are the built substrate here: the type fork (`forkType`, `api/fork.js`) derives a new type-hash from a parent by a named departure, the crossing's fork at type granularity, snapshot only so a pinned meaning never changes under its adopters; and the type contest (`contestType`, `api/contest.js`) constructs a gate-admissible forum claim whose subject is a type-hash, recording a semantic disagreement (function 6's contesting work) that the kernel never adjudicates and that changes no grade. Both are **built** with the oracle `build/check-fork-contest.mjs`; a contest's resolution (amend, fork, or re-pin, where a sustained contest converts to a fork mechanically) is coordination-layer authority, **specified** not built. The crossing's next capability, specified with its lineage, is the compact passport. Because the kernel is already a content-addressed graph with hash-chained states and certificate hashes, a receiving community can verify "claim X at grade G under state H, certified" from the certificate hash plus a Merkle inclusion path against the state hash, without cloning the source store, the same light-client verification the adjacent field built for verifying a chain's state without running the chain. The representation makes this a proof-path constructor away, not a redesign. Tier: the crossing and `isStale` are **built**; the CI staleness sweep is **assembly**; the compact passport is **specified**.

### 9. The compost

Shared negative knowledge, with exposed forgeries as one entry type. Contract: the in-store exclusion record at single-community scale (built: `kernel/store/exclusion.js`, and this submission's compost ledger). For the federated pile, a v0 is available now: a well-known compost repository other communities pin, entries as grounded claims, the same store-plus-gate machinery pointed at deaths. Tier: single-community **built**; federated v0 **assembly**; the full federated economics **frontier**, per `docs/the-asymmetric-weapon.md`.

### 10. The standing economy

Tenure, decay, Sybil-resistance, and challenge economics. No good current contract. At low N the function is filled by the deliberation layer manually; a community of twenty adjudicates standing in the forum, and that is fine. The automated economy is what scale-without-trust requires. One design constraint for the eventual contract is importable from the adjacent field's hardest lessons: consequence only on objectively provable, mechanically verifiable fault. Standing is reduced when a re-performed check reproducibly fails against a checker's attestation, a hash-pinned, grounded compost entry, and it is never reduced for judgment or disagreement, which forks rather than punishes. Consequence-slashing on provable equivocation stayed safe in that field; slashing on votes became a political weapon. Standing as a weighting can be lost without ever being spendable, so the import carries no tokenization with it. Tier: **frontier** (the coordination layer spec is its home), with the provable-fault constraint recorded as part of the specification.

### 11. Availability

Mirrors, uptime, and fork-as-backup. Contract: git mirrors; forkability is the availability story. Tier: **built** by inheritance.

### Two observations that fall out of the carve

First, ten of eleven functions have a real contract available today out of commodity parts, so the minimum viable community backend is nearly all assembly. The standing economy is the only function without a current contract, which sharpens the substrate map's claim and gives the invitation a concrete parts list.

Second, the write path never touches a human: producer, CI-gate, store, derived site, with humans confined to deliberation and to being producers. The backend has no seat for an adjudicator because no function needed one.

## Imports, validations, and exclusions

The contracts above draw on the one adjacent field that has run trustless coordination under sustained real attack at scale. Stated in the compost register: what was taken, what confirmed this design's choices, and what was refused.

**Imports** (mechanisms taken, stripped of their financial instruments):

- Consequence only on provable fault, the slashing-conditions lesson, folded into function 10.
- The time-lock as flash-capture defense and exit window jointly, folded into function 7.
- Commit-reveal for attribution: if credit accrues to first submission, an observer can front-run a pending contribution, and the defense is submitting `hash(contribution)` to timestamp priority and revealing content after, using the hash machinery already built. Named as an option in function 2.
- Light-client verification as the compact passport, folded into function 8.

**Validations** (this design's choices, confirmed by that field's most expensive failures):

- The untyped floor at boundaries: the largest losses in that field were bridge failures, and the post-mortem pattern is uniform, bridges fail where they pool trust between systems (a custodian, a multisig, a trusted relayer). This crossing has no bridge operator: same-hash composes, and everything else arrives untyped and re-earns. The refused component is the one that caused the losses.
- The up-hill cap: shared-security designs that let the same stake secure many systems created correlated contagion, one failure cascading across every system the stake touched. Standing that does not transfer across boundaries at full weight is the same firewall, chosen in advance.
- Time-locked standing: instantaneous assembly of voting power, the flash-loan governance attack, is defeated only by requiring power to age, which this design's cost anchor already requires.

**Exclusions** (refused, with the reason stated once):

- Tokenized or transferable standing, bonding curves, and any market in credibility: standing is a weighting, never spent, transferred, or held (the parameters register's fixed tier), because purchasable credibility is the resourced-capture vector the gate exists to close.
- Market price as a truth mechanism: a price is an untyped synthesis, one scalar hiding its grounding, precisely the object this system exists to decompose. Market odds may enter as a source-class of evidence, claims like any other; they never replace grounding as an aggregation mechanism.
- Zero-knowledge attestation gets a future-note, not an import: proof-of-verification for computational checks could someday close attestation fraud mechanically, and proofs over withheld data touch the withheld-record floor. Both are named as frontier-of-the-frontier.

## Open projects

The invitation asks people to constitute a community; this list gives a contributor something concrete to pick up on day one, derived from the carve's own tiers plus the named levers elsewhere in the corpus, in rough ascending order of difficulty. These are invitations, not promises or a roadmap with dates, and nothing here implies anyone has committed to any of them.

- **The deliberation platform.** Choose and open it; the rule (decisions land through the gate) is already written. Build on: function 6. Assembly, hours.
- **The CI staleness sweep.** Run `isStale` checks on every build so stale citations flag automatically. Build on: `isStale` in `kernel/composition/transfer.mjs`. Assembly over built machinery.
- **The derived read surface.** The static site generated from the store on each admitted write. Build on: the presentation shell (`periphery/navigate/`). Assembly.
- **The hosted submission endpoint.** Wrap the built gate as a service so a producer submits without cloning. Build on: the gate and the propose contract. Assembly, bounded.
- **The commit-reveal attribution option.** Hash-first submission for communities where priority matters. Build on: the hash machinery (`kernel/schema/canonical.mjs`). Assembly, small.
- **The conflict and standing matrix.** A visibility surface rendering the composition stack over the claim graph, every override, every reprice, the winning standing, legible at a glance; the model is the modding ecosystem's conflict matrix (xEdit), which made silent composition semantics operator-legible for two decades. Build on: the reconciliation and robustness reads. Assembly-to-moderate, and probably the highest-leverage tool on the list.
- **The scaling levers.** The scoped store-view build and the incremental state hash (the write path's named speedbumps), and incremental robustness (recompute only the affected sub-cone). Build on: `docs/speedbumps-of-scaling.md`, with the differential harness as the regression guard. Moderate, guarded.
- **The compact passport.** The Merkle inclusion-path constructor and verifier over the existing state chain, so a claim's certification verifies without cloning the source store. Build on: the state chain and the certificate hash. Moderate; the representation is ready for it.
- **The federated compost v0.** A well-known compost repository other communities pin, entries as grounded claims. Build on: the single-kernel exclusion record. Moderate.
- **The formal proof lift.** Proof-assistant proofs of the recurrence claims, lifting them from checked to proof-floor and closing the named sorry. Build on: the math kernel and `docs/sorry-ledger.md` (G-D). Moderate, self-contained.
- **The standing economy.** The frontier itself, with the provable-fault constraint and the coordination spec as its specification. Frontier; the invitation's deepest ask.

## Stage 4: what this repository already demonstrates

The admission contract of function 2 is not a projection. This repository has been running it in embryo for its entire development.

**The CI configuration, transcribed.** `.github/workflows/ci.yml` runs on every push to `main` and on every pull request. Its job checks out the repository, sets up Node 20, installs dependencies if any, and then runs, as gating steps: `node linter.js` (the graph linter), then the oracle block of seventeen checks (`check-gaps`, `check-perturb`, `check-gate`, `check-translate`, `check-migrate`, `check-client`, `check-robustness`, `check-characterized-gaps`, `check-composition`, `check-eggs`, `check-reconcile`, `check-covid`, `check-lhc`, `check-atlas`, `check-demo`, `check-docs`, `check-map`), then a verification that the vendored browser bundles and case snapshots are current (regenerate and `git diff --exit-code`), then a verification that the generated repo map is current (`git diff --exit-code`), then `node build/bundle.js` to build the standalone artifact, and finally `test -f submission.html`. Every step must pass for the job to be green; a failing check fails the job.

**The finding, as it is.** The gate's own oracle (`check-gate`) and the structural, case, docs-graph, and trust-boundary oracles run mechanically on every proposed change, and green is the condition a change lands on. So this repository's write path has been the admission contract in embryo: every change arrives as a proposed contribution, the suite runs without a human in the loop, and green is what admits. The embryo qualifier is load-bearing and stays. The current workflow gates repository changes by the check suite; a full admission contract gates claim contributions by the gate itself. The exact gap: the check suite runs on every proposed change and green is the merge condition, but CI here gates repository changes by the oracle suite rather than gating claim contributions by the gate itself, and the merge is a human action rather than auto-merge on a green receipt, so a contribution-shaped submission path with auto-merge on a green receipt is the assembly step remaining.

**Two notes, as recommended follow-ups, not changes made here.** First, whether a green check is required to merge (a checks-required branch protection) is a repository setting not visible in the workflow files; configuring it would make the "green admits" claim fully mechanical rather than conventional. Second, the CI block runs the core, structural, and case oracles but not the exhibit oracles (`check-math`, its exhaustion and differential companions, `check-vocabulary`, `check-lineage`, `check-certificate`, `check-math-embed`), which run locally; adding them to the CI block would make the mechanical suite complete. Both are small tightenings that would sharpen the embryo claim, and neither is an infrastructure change made in this document.
