---
Type: reference
Purpose: Guides an outside team through the ways to extend the kernel, from a view over the contract to a new domain region to a whole-kernel fork, as the how-to a builder consults.
Depends on: docs/api.md, docs/composition-spec.md, docs/kernel-taxonomy.md, docs/parameters-register.md
Depended on by: nothing
---

# Extending the Kernel

This is the how-to for a team that wants to build on the kernel rather than read it. It names the five ways to extend, from the lightest to the most invasive, and for each one it names the contract or the files you touch, the steps in order, and the check that tells you it worked. The ways form a ladder by how deep into the trust boundary they reach: a view touches nothing the kernel owns, a new domain region extends the schema, a whole-kernel fork re-points the store. Pick the lowest rung that does your job, because the lower the rung the less you take on and the less anyone downstream must trust. The ladder also spans the two markets a knowledge kernel opens: rung one is entry into the interface market, a new surface over the read-write contract, and the retail fork, the wholesale fork, and the whole-kernel fork are moves in the trust market, selecting which grounding to stand under and exercising the right to fork off it.

Two things frame the whole ladder. First, the built-versus-specified line, which this guide keeps as scrupulously as the rest of the submission: rungs one through four run today and are exercised by the three cases in the tree, and rung five and the multi-team write coordination around all of them are Stage 4, specified and deferred, graded in [the status ledger](status-ledger.md). Where a step is specified rather than runnable, it says so. Second, the required tier, below, which every rung must preserve regardless of how deep it reaches, because it is what keeps your extension composable with everyone else's.

## The one invariant set every extension holds

Whatever you build, it stays composable with other kernels only if it holds the required tier of [the parameters register](parameters-register.md). Everything else is yours to set. The required tier is small on purpose, and it is the whole contract of belonging:

- Every claim carries a type, including the untyped type when nothing local fits.
- Grounding is monotone: a claim never advertises more standing than its necessary supports carry.
- The untyped type grounds nothing, so an imported claim confers standing only after an owned local fork types it.
- Every claim carries its history: its origin, its crossings, and the forks that retyped it.
- Standing is forkable and revocable.

Hold these and your extension federates. Break one and your claims can no longer cross safely into a kernel that relies on the guarantee you dropped, which is the register's definition of leaving the protocol. Everything below is built to hold this set; if you author your own components, hold it too.

## Rung 1: a view over the contract

The lightest extension adds a way of reading, not a claim. You build a periphery, a tool that reads grounded claims and proposes new ones, and it never touches the store, because the API is the only door and it hands out derived values, never a mutable handle.

Reach for this when your contribution is an interface: a specialist lens, a plain-language explainer, a domain dashboard, a red-team console. This is the interface market, the market of surfaces over shared trust, described in [Epistemic Uplift](epistemic_uplift.md); a new surface competes with the incumbents over the same checkable claims without any of them having to be trusted about the grounding.

The contract is `createClientApi(provider)` (`api/client-api.mjs`), which returns `{ propose, read, robustness, gaps, characterizedGaps, reconciliations, providerKind }`. You read through those calls and propose through the gate, and you hold no reference that would let you write directly. A provider answers the contract, and the seam (`api/providers/`) lets the same client run against a local in-process kernel (`local-provider.mjs`, the real gate) or a remote one (`remote-provider.mjs`, the same contract) by swapping one import, so a view built against one serves the other unchanged.

Steps: implement a client over `createClientApi`, or for a declarative view use the thin-client kit, a manifest mapping node kind to presentation validated at build and render ([`docs/thin-clients.md`](thin-clients.md), [`docs/clients.md`](clients.md)); read the claims and their readings through the contract; render. The linter enforces the boundary, so a client that touches a truth field fails loudly rather than corrupting a grade.

Check: `node build/check-client.mjs` confirms a client-side receipt is byte-identical to a direct kernel run, and `node build/check-map.mjs` confirms your periphery imports only through the API and never reaches past it. Runs today.

## Rung 2: claims into an existing domain

The next rung adds knowledge to a domain that already exists. You propose typed claims, and the gate admits them only when they hold together with what is already there, so what you add is what composes, checked by machine with no model in the loop.

Reach for this when the domain and its floors already fit your claims and you are extending the content, not the schema: a new study in the nutrition region, a new measurement leg in the LHC region.

The write is `propose(proposedClaim) -> receipt` on the client contract, which carries your claim to the gate (`kernel/gate/gate.mjs`). A proposed claim is a `claimRecord` (`kernel/schema/records.mjs`) carrying its kind, statement, source, contributor, declared grade, any checking records, and a closing condition where it is a characterized gap; support is a `linkRecord` typed `supports`, `depends-on`, `contradicts`, `refines`, or `restatement`, each routed to exactly one computation. The gate admits your claim only if the grade it declares is at or below the grade it earns from what it rests on (the `GM-ABOVE` rule), so you cannot assert more standing than your supports carry.

Steps: write your claim and its support links as records against the domain's existing kinds and sources; propose through the contract; read the receipt for the earned grade and any gap the claim opens. If the gate declines, the receipt says why, which is a finding about the claim, not an error to route around.

Check: `node build/check-gate.mjs` is the gate's own oracle; the domain's case check (below) verifies your claim grounds where you expect once it is in the corpus. Runs today.

## Rung 3: a retail fork, one crossing

When a claim you want lives in another kernel, or was left untyped, it enters your kernel as the untyped type, which is not a floor, so nothing grounds through it. To give it local standing you retail-fork it: cast the single claim into a local type and sign the cast as a claim of your own, staking your standing on the crossing. The original untyped import stays, provenance intact, and your typed fork supersedes it locally.

Reach for this when you compose across a boundary and need one imported claim to carry weight in your schema. It is the common case of composition, cheap and reversible, and it puts the cost of typing exactly where the judgment was made: no one has to agree that claims of this kind generally cross, you decided this one does and you own it.

The mechanism is in [the composition spec](composition-spec.md) and `kernel/composition/`: a cross-store citation (`records.mjs`, `transfer.mjs`) copies the origin grade and never assigns it, the transfer folds under the min so the crossing can lower standing but never raise it, and the shared vocabulary (`vocabulary.mjs`) is how a term declared once is referenced by identity so a unit or definition translates rather than being re-guessed. A framing record (`framing.mjs`) is the denominator seam: a presupposition is checked for being in force, never graded, so a swapped or fallen frame flags the dependent claim frame-orphaned and leaves the measurement's own floor grade intact.

Steps: import the claim, which arrives untyped; author a retail fork casting it into a local kind and signing it; propose the fork through the gate like any claim; the fork now grounds locally and carries the crossing in its history. If the source claim later changes in its home kernel, your fork points at a version and does not silently follow, so staleness is a checkable fact.

Check: `node build/check-composition.mjs` verifies the crossing copies and never assigns standing and that the untyped type grounds nothing; `node build/check-eggs.mjs` exercises real crossings, the eggs composite citing its nutrition, environment, and economics domains. Built on fixtures and run on the real eggs composite.

## Rung 4: a new domain region

This is the rung Randy's phrase names: to add a fourth domain, extend the schema at the type table, add your floor types, register your atlas entries, drive your claims through the gate, and run the check. It is a wholesale fork, heavier than a retail one because it changes the schema rather than one claim, and it is how a category of claims comes to type natively instead of being retail-forked one at a time. It is not hypothetical. It is the exact procedure that added the three cases already in the tree, and `build/eggs-build.mjs` is one worked instance of it, corpus data typed and driven through the real gate, verified by `build/check-eggs.mjs`; the LHC and COVID builds are two more.

Reach for this when your subject has its own floors and its own kinds that the existing schema does not carry: a new science with its own measurement terminals, a new normative domain that bottoms out in its own declarations.

Where you extend, concretely:

- **The kind table.** Declare your domain's node kinds and the ceiling each can reach, as rows to `makeKindTable` (`kernel/schema/tables.mjs`), each row a `{ kind, ceiling }` where the ceiling is a floor position. This is adding your floor types: the ceiling fixes the highest grade a kind of claim can ever earn, a measurement kind ceilinged at the empirical floor, a definitional kind at the constitutive floor, a provable kind at proof. The floors themselves are the fixed settled tier in `kernel/schema/confidence.mjs` (the empirical axis of checked then independently-rechecked, the constitutive position, and proof); your domain chooses which floor each of its kinds reaches, it does not invent new floors.

- **The source table.** Declare your sources as rows to `makeSourceTable` (`kernel/schema/tables.mjs`), each a `{ source_id, source_class, description, rests_on }`, the class drawn from the fixed set the model recognizes (primary-measurement, peer-reviewed, preprint, dataset, institutional-report, testimony). The `rests_on` field is what lets the footprint closure tell genuinely independent sources from shared ones, which is what the robustness reading prices.

- **The atlas.** Register your structural patterns as addressable components, each carrying its typed preconditions, so the detector finds no coverage gap on them and the compare motion can walk instances of the same pattern across cases. The two in the tree, `atlas.statistic-supports-conclusion` and `atlas.projectile-stops-in-target`, are the model; a fourth domain adds its own where it has a recurring reasoning shape worth naming.

- **The registry.** Your domain contributes its nodes, instances, and atlas entries by being passed to `buildRegistry` (`kernel/schema/registry.js`) as sources; adding a domain never edits that file, because a case contributes and nothing shared is copied. One id, one definition.

Steps, following the eggs build: author your corpus as pure data (kinds, sources, claims, links, atlas entries); build the domain store by driving each claim through the gate (`decide`) onto the genesis state (`apply`, `kernel/store/`) and reading the earned-grade view (`storeViewOf`); where your question spans domains, add a composite that cites them across the boundary by the rung-3 mechanism; write a shared builder so the oracle that verifies the case and the generator that renders it build the same structure, which is what keeps the presentation honest to the check.

Check: model a `build/check-<domain>.mjs` on `build/check-eggs.mjs`, `build/check-lhc.mjs`, or `build/check-covid.mjs`. It should verify that each claim grounds to the floor you expect, that a claim whose declared grade conflicts with its earned grade stops and reports rather than passing, and that any characterized gap carries its closing condition. Run `node build/check-map.mjs` to confirm the import boundary still holds and `node build/check-atlas.mjs` to confirm your atlas entries carry their preconditions. Built; demonstrated three times.

## Rung 5: a whole-kernel fork

The deepest extension takes the whole kernel and re-points it: keep the reading tools and the contract, change which kernel the contract serves. This is the recovery move when a kernel is captured or poisoned, and it is what makes the commons unownable, because owning a kernel only makes people fork away from it. A fork is a re-point over a content-addressed history, not a rebuild, so the claims that rested on a poisoned base re-derive against a clean one.

Reach for this when you reject a kernel's canonical state wholesale, or when you want your own standalone kernel that others compose with across untyped bridges rather than a region inside someone else's schema. Forking a region back out to the federation and forking a whole kernel are the same operation at different grains.

The interface is `api/fork.js` and the patch history it re-points over (`kernel/store/patch-ledger.js`, client-side patch selection). **This rung is Stage 4, specified and not built** ([4.6] in [the status ledger](status-ledger.md)): the fork interface is a stub, and the tamper-evident sealed patch ledger and client-side canonical selection are designed and deferred. What runs today is the re-point's mechanism at the composition layer, the notification and re-derivation that a fork drives (`kernel/composition/notify.mjs`), and the swappable provider seam that makes the contract a location-independent membrane. So the damage-cap half of forkability is real; the full patch-history fork is designed in the open. Treat this rung as the mapped path, not a runnable step.

## What coordinates many teams doing this

Rungs one through four are single-author acts: you build a view, add claims, fork a crossing, add a domain, and the gate checks each on its structure. What decides who may perform a canonical write, and prices the standing that gates it, is the coordination fabric, and **it is Stage 4, specified**: the time-locked labor credential, the gated-write lifecycle, the challenge system ([4.2] through [4.4]). The write-side rules a federation of teams needs, standing that accrues in elapsed time so compute cannot front-load it, revocation and the exclusion record when a write is caught, are designed with their open seams named ([S1] through [S4]), not built. So a team can extend the artifact today by every rung above through rung four; the machinery that lets many teams write to one canonical commons without anyone owning it is the mapped Stage 4, and this guide marks that line rather than blurring it.

## The ladder at a glance

| Rung | What it adds | Contract or files | Confirming check | Maturity |
|---|---|---|---|---|
| 1. A view | a way of reading, over the contract | `createClientApi`, `api/providers/`, the thin-client kit | `check-client`, `check-map` | Built |
| 2. Claims into a domain | content, through the gate | `propose`, `kernel/gate/gate.mjs`, `kernel/schema/records.mjs` | `check-gate`, the domain check | Built |
| 3. A retail fork | one imported claim, typed and signed locally | `kernel/composition/` (records, transfer, vocabulary, framing) | `check-composition`, `check-eggs` | Built on fixtures and the real eggs composite |
| 4. A new domain region | your kinds, floors, atlas, and claims | `kernel/schema/tables.mjs`, `registry.js`, a `build/*-build.mjs` | a new `check-<domain>`, `check-atlas`, `check-map` | Built; demonstrated three times |
| 5. A whole-kernel fork | a re-point over the patch history | `api/fork.js`, `kernel/store/patch-ledger.js` | none yet | Specified, Stage 4 [4.6] |

Start at the lowest rung that carries your contribution. Hold the required tier at every rung. Run the check before you claim the extension works, because in this tree a component is done when its check passes and not before.
