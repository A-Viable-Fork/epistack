---
Type: reference
Purpose: The map of the minimum viable substrate a fork starts from, the annotated tree with its built/genericize/build/frontier marks, the tiered gaps, and what a post-submission extraction strips from this repository to make the forkable substrate.
Depends on: docs/coordination-layer-spec.md, docs/design-axioms.md, docs/kernel-workflow-guide.md, docs/parameters-register.md
Depended on by: docs/community-invitation.md
---

# The Substrate Map

This map describes a post-submission extraction. The competition repository stays frozen and separate; the substrate is a forkable kernel-and-community repository derived from it later. This document is the target for that extraction, not a claim that the substrate repository exists now. It states what a person or organization forks to start their own kernel, grow it into a community, and join a market of kernels, grounded in the actual EpiStack tree.

Where `docs/kernel-workflow-guide.md` is how you build a kernel, this map is what you fork to build one.

## Legend

- (no mark) **built and transfers as-is.** Exists in EpiStack, works, forks directly.
- `~` **exists, genericize.** Present in EpiStack but competition-specific or content-specific; strip the EpiStack content and framing, keep the mechanism.
- `*` **build.** Does not exist yet; bounded engineering, mostly post-submission.
- `**` **specified frontier.** Exists as specification, not working code; the genuinely hard coordination pieces that scale-without-trust requires. This is what the community invitation invites help with.

## What a fork gets you, by tier

Fork today, build the generated check, and you have a **working individual kernel (N=1)**: store, gate, grounding, generator, crossing, all built. That is a real kernel of your domain, admitting claims by grounding, checkable by anyone.

Add the trivial and moderate `*` pieces and you have a **working small community**: producers submit through a hosted gate, admission is by grounding, and humans deliberate the free parameters on ordinary tooling. Standing at small scale is handled by the deliberation layer manually.

Add the `**` frontier and you have a **large trustless community and a real market of kernels**: automated standing, multi-producer lifecycle at scale, and cross-kernel discovery. This is the invited frontier, not a blocker to starting.

The through-line is forkability: the substrate forks whole, so no instance is hosted by a center that could be captured. The ultimate check on any instance's rules is that dissenters fork the entire apparatus, not only the claims.

## The repository map

```
substrate/
├── kernel/                          the trusted core (pure logic, imports only kernel/)
│   ├── schema/
│   │   ├── canonical.mjs            canonical form, claim/link identity
│   │   ├── records.mjs              record types, well-formedness
│   │   ├── confidence.mjs           the grade lattice, meet/join
│   │   ├── type-hash.mjs            content-addressed type bundles (the crossing primitive)
│   │   ├── sha256.mjs               hashing
│   │   ├── registry.js / tables.mjs / edges.js / registers.js / schema.js
│   ├── gate/
│   │   ├── gate.mjs                 the gate: admit-if-grounds, producer-agnostic
│   │   ├── verify.mjs               verification
│   │   ├── lifecycle.js             single-kernel write lifecycle
│   │   └── immune.js / clean-json.js
│   ├── grounding/
│   │   ├── earned-grade.mjs         the earned-grade recurrence
│   │   └── resolve.js / profile.js
│   ├── composition/
│   │   ├── transfer.mjs             cross-kernel crossing (min over carried grades)
│   │   ├── vocabulary.mjs           shared-term reconciliation
│   │   ├── framing.mjs              framing/presupposition edges
│   │   └── records.mjs / notify.mjs / profiles.mjs
│   ├── motions/
│   │   ├── decompose.js / perturb.js / compare.js   the three motions
│   ├── analysis/
│   │   ├── robustness.mjs           worst-single-removal read
│   │   ├── reconciliation.mjs       contradiction/crux read
│   │   ├── gaps.js / characterized-gaps.mjs
│   └── store/
│       ├── state.mjs / apply.mjs / graph.js         the store operations
│       ├── patch-ledger.js          history chain
│       ├── decay.mjs              ~ standing decay primitive exists; the full economy is the frontier below
│       └── exclusion.js
├── api/                             the membrane (imports kernel/, sole boundary)
│                                    the propose and read contracts
├── scaffolder/                      the kernel generator
│   ├── new-kernel.mjs               config in, empty kernel out, runs the real check
│   ├── kernel-config.schema.json    the config schema (tier-annotated: fixed/shared/free as data)
│   └── examples/
│       ├── valid-empty.json         a blank valid config (the fork's starting template)
│       └── broken-*.json            negative examples the check rejects
├── corpora/
│   ├── _shared/
│   │   ├── common-types.js          the shared type subtree (adopt by hash)
│   │   └── graph.json
│   ├── _primitives/                 floor nodes
│   ├── _example/                  ~ keep one worked case as a learning template; strip covid, eggs, lhc, lineage, population, vocabulary, federation content
│   └── <your-kernel>/             * empty; this is what the forker fills
├── build/
│   ├── check-gate.mjs               substrate check: the gate
│   ├── check-crossing.mjs           substrate check: crossing
│   ├── check-type-hash.mjs          substrate check: type hashing and meaning-sensitivity
│   ├── check-composition.mjs        substrate check: composition
│   ├── check-agreement.mjs          substrate check: shared-type four-way agreement
│   ├── check-robustness.mjs / check-perturb.mjs / check-reconcile.mjs   the read checks
│   ├── check-docs.mjs               doc-graph symmetry
│   ├── check-registers.mjs / check-map.mjs / check-translate.mjs / check-migrate.mjs
│   ├── check-produce.mjs / check-ingest.mjs   the producer-path checks
│   ├── check-<case>.mjs           ~ strip case-specific: covid, eggs, lhc, lineage, demo, atlas, client, management, bottomup, characterized-gaps, vocabulary, gaps
│   └── check-<your-kernel>.mjs    * generated by the scaffolder for the forker's kernel
├── periphery/                       the fallible layer (reaches kernel only through api/)
│   ├── produce/                     the producer path (author a claim toward the gate)
│   ├── ingest/                      the ingestion connector (source to typed claim)
│   ├── author/                      claim authoring
│   ├── query/ + assess/ + redteam/ + filter/   the consumer paths (evidence, assessment, adversarial)
│   ├── navigate/                  ~ strip the competition presentation shell (shell/, the guided walk, the vendored readings); keep a minimal reader (clients/, render/)
│   └── endpoint/                  * the hosted submission endpoint: wrap the gate as a service so an outside producer submits without cloning and running locally
├── docs/
│   ├── protocol-spec.md             the RFC (authoritative for the protocol)
│   ├── design-axioms.md             code-tier governance
│   ├── governing-trellis.md         the repo's own governing constraints, mapped to the checks
│   ├── api.md                       the client contract
│   ├── composition-spec.md          the crossing spec
│   ├── coordination-layer-spec.md   the coordination frontier, specified
│   ├── parameters-register.md     ~ reframe from competition to community: the fixed invariants versus the free parameters
│   ├── workflow-guide.md          * the kernel-building workflow (from the math-kernel design), the on-ramp
│   ├── fork-and-start.md          * the forker's README: you forked this, here is how to build your kernel (fork, edit the config, run the generator, ground your claims)
│   ├── constitution.md            * the community-founding doc: the fixed invariants (not votable), the free parameters (yours to set), and that the first act is setting them together
│   └── deliberation.md            * how and where the human deliberation happens (the platform pointer, how parameters get decided)
├── linter.js                        import-boundary and rule enforcement
├── LICENSE                          AGPL (forkable by design)
├── README.md                      ~ reframe from competition submission to substrate
└── coordination/                  ** the specified frontier (exists as spec in coordination-layer-spec.md, not as working multi-producer code)
    ├── standing/                  ** the standing economy: concave, decaying, Sybil-resistant weighting from verified labor (the decay primitive exists in kernel/store/decay.mjs; the full economy does not)
    ├── submission-lifecycle/      ** the multi-producer gated-write lifecycle at scale (the single-kernel lifecycle exists in kernel/gate/lifecycle.js; the multi-party version does not)
    └── discovery/                 ** how kernels find each other and propagate standing across the market (the crossing exists; the at-scale discovery does not)
```

## The gaps, tiered by cost

**Trivial (hours, mostly not code).**
- The deliberation layer: choose a platform (a forum, chat, or discussion board) and open it. External to the repo; `docs/deliberation.md` points at it.
- `fork-and-start.md` and the reframed `README.md`: documentation, written once.
- The `_example` template and `valid-empty.json` starting config: genericize what exists.

**Moderate (bounded engineering, post-submission).**
- `periphery/endpoint/*`: the hosted submission endpoint. Wrap the built gate as a service that takes a proposed claim, runs the real gate, and writes to the store on admission. Periphery over built machinery, not a research problem.
- Stripping the competition surface (`periphery/navigate/shell/`, the vendored readings, the judges docs) and genericizing `parameters-register.md`, `constitution.md`, `docs/workflow-guide.md`.

**Frontier (specified, genuinely hard, invited).**
- `coordination/standing/**`: the automated standing economy. Small communities do not need it (deliberation handles standing manually at low N); it is what scale-without-trust requires.
- `coordination/submission-lifecycle/**`: multi-producer gated writes at scale.
- `coordination/discovery/**`: kernel discovery and standing propagation across the market.

## What gets stripped from EpiStack to make the substrate

The competition demonstration is not part of the substrate. Strip: `submission.html`, the presentation shell and guided walk (`periphery/navigate/shell/`), the judges documents (`the-climb-of-synthesis.md`, `what-stands-without-trust.md`, `epistemic_uplift.md`, `vision-and-continuation.md`), the status ledger and criteria map (competition-specific tracking), the four cases as shipped content (keep one as `_example`), the lineage exhibit, the vendored readings, and the archived artifacts (`archive/`, `v1.html`, `card-prototype.html`, `manager-probe.html`). The mechanism stays; the competition framing and the specific content go.

## The honest one-paragraph claim for the invitation

The store is git and forks today. The gate, grounding, generator, crossing, and the read paths are built and fork today, giving a working individual kernel immediately. A small community needs a hosted submission endpoint (bounded, post-submission) and a deliberation platform (trivial), with standing handled by deliberation at low N. The automated standing economy, the multi-producer lifecycle at scale, and cross-kernel discovery are the specified frontier, named honestly, and are what the community is invited to help build. Nothing here implies a community exists; it states what forks now, what completes soon, and what the market needs at scale.
