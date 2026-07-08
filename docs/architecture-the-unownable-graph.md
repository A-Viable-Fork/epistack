---
Type: specification
Purpose: Specifies the mature coordination design, the substrate, the patch history, and standing, as the source the adversarial and status documents derive from.
Depends on: docs/knowledge-system-how.md
Depended on by: docs/adversarial-robustness.md, docs/api.md, docs/status-ledger.md
---

# Architecture: The Unownable Graph

*The complete design, current as of this writing. It supersedes the earlier storage-API-clients spec, which it folds in as one part. The thesis is simple to state and runs through everything below: the system does not defend a castle, it makes the castle unownable. The value lives in the substrate, the gate is a filter rather than a fortress, and capture of any single gate is capture of an empty shell, because the honest minority exits with the substrate intact. The design question is therefore not how to keep bad actors out. It is how to make honest participation the cheapest path to influence and capture the most expensive.*

**Read this first: design versus build.** The typed substrate and the gate's mechanical core are built and verified. The coordination layer described here, the layered access, the standing economy, the Knowledge Game, the patch history, is the design for the mature system, specified but not yet implemented. The present tense below describes the design; what is actually in the repo is stated in the Status section at the end and graded in the status ledger. The governance core that grounds the design is described here directly in its own terms, not invoked as a named apparatus.

**Read this second: the impossibilities are accepted, not beaten.** Two results bound any system of this shape. Sybil-resistance is impossible for an identity-free system without a non-forgeable cost anchor (Douceur 2002). Non-dictatorial aggregation is manipulable (Gibbard-Satterthwaite). The design does not claim to beat these. It prices around them: it imports a real cost (time-locked verified labor) and keeps a structural backstop (forkability), so that exploiting the impossibilities is uneconomic, and where the economics fail, recoverable. Stating the bounds openly is the honest position and the defensible one.

---

## 1. The substrate (the narrow waist)

Beneath everything is a commons substrate that survives any fork. It is un-ownable by its author and forkable against its author, and it hosts adversarial experiments as readily as honest ones. What discriminates honest from adversarial is the same public process running on the same fixed substrate, not a gate on entry.

The substrate provides: neutral addressing, so any entity or claim is nameable and reachable across any fork; a provenance envelope, the cryptographic fixedness of declarations, so a commitment is downstream-verifiable and no single actor can rewrite the ledger; a lossless trace, so a condition a party declares is never silently erased by a receiver that does not price it; and the shared typing schema, the structural interface contract that makes cross-fork comparison, atlas interoperability, and mechanical verification possible.

The provenance envelope is load-bearing in a way it was not before. The patch history (Section 3) rests on it, so the tamper-evidence of declarations is now a primary assumption, not a convenience.

---

## 2. The typed core

A claim carries what a flat citation omits: its type, its verification state, and its provenance. A claim is typed by where it can terminate, across six terminals. On the auditable side: a measurement, where the world closes a prediction; a derivation, where formal work legitimately stops; a withheld record, a measurement behind a sealed door. On the refused side: an irreducible prior, topping out in a reference-class choice no measurement reaches; a constitutive terminal, topping out in a framework adopted or refused. And a meta terminal, a question set, a claim about whether the branches are all drawn.

The typing rule carves a question into parts and routes each by its terminal: the cuts a measurement or a model can answer route onward to be audited; the cuts a commitment answers are priced and refused. This cut is the partition: the auditable side, where a mechanical gate closes, and the priced-and-refused side, where judgment prices each position rather than auditing it.

Three corpora accumulate: the atlas (the derivation segment made queryable), the kill record (refuted claims, axiom-tagged), and the departure record (where structural patterns fail real phenomena).

Gaps in this typed core are first-class and detected mechanically: a claim whose support reaches no terminal, a dependency on a superseded source, a claim with no rebuttal searched, a question-set branch left undrawn. They are objective facts about the graph, read like any claim, and they never carry a rank; which gap most needs closing is the assessment layer's call.

---

## 3. Storage: a tamper-evident patch history

Storage is the canonical typed graph, instantiated as an append-only, tamper-evident sequence of patches. Each patch is a sealed canonical state. The canonical store is not the source of truth; it is the residue of truth after the graph has metabolized it, frozen at a point.

This is the form that makes the rest work. Because the history is append-only and cryptographically fixed, a captured present cannot un-verify the past: the accrued value of every prior patch survives. Rollback has a target that is never empty, the last good patch. And canonical-ness becomes a property of a selected patch rather than of a single mutable store (Section 7).

---

## 4. The three access layers

Access is layered, and the layers map onto the API. Only the canonical layer carries guarantees, which is what keeps the Sybil problem confined to the one place it costs anything.

- **Personal.** Private, pre-API, no standing, no cost. A claim is composed locally against a private typed graph and carries a provisional type. The smooth space where a claim is born.
- **Forum.** Public, open API, no standing required. Anyone may submit; anyone may engage, comment, flag gaps, restyle, query, build clients. Claims are addressable and forkable but carry no verification state, cannot serve as terminal nodes in canonical derivation, and auto-expire if they attract no substantive engagement. The network effect lives here, and because nothing here carries weight, flooding it is free and worthless.
- **Canonical.** Public read, gated write, standing required, verified, derivation-enabled. The only claims that can serve as evidence downstream. This is the patch history of Section 3.

---

## 5. The API

The engine exposes storage as a typed contract.

Reads are open and many, and they read against a selected patch: resolve a node, decompose, compose, compare, query dependents, list gaps. Any client may call these freely, over whichever patch it points at.

A write is not a row inserted. It is a claim moved through the Knowledge Game (Section 6) until it promotes into the next patch, and the credential the write path checks is standing (Section 7). Reads stay open; writes are gated, time-locked, and earn their place. This is the storage-API-clients boundary intact, with the write gate now richer than a single check.

---

## 6. The Knowledge Game (the gated write)

A claim reaches a canonical patch by surviving a lifecycle, no model in the loop deciding truth.

1. **Personal.** Composed and provisionally typed.
2. **Forum.** Submitted to the open layer; lives or dies by organic engagement.
3. **Sponsorship.** A standing-holder stakes their own standing to sponsor the claim into the canonical queue. The author earns a small credit; the sponsor is now liable, and loses standing if the claim fails.
4. **Fermentation.** The claim enters a read-only escrow and is exposed to a randomized mesh of standing-holders chosen for maximum mutual-information decay, across domains and traditions. Responders stake to register a typed response. The claim must accumulate non-trivial cross-domain engagement that measurably shifts its type-boundary or confidence structure. A claim that exits with zero harmonic residue, sterile agreement, is auto-flagged as suspicious. This is the harmonic inversion in operation (Section 9).
5. **Stratified random verification.** The verifier assigns duties from domain-stratified pools. Most claims get a light heuristic check; a sampled fraction get deep jury review. Response is mandatory, refusal decays standing. Quorum is asymmetric: promotion requires a supermajority, challenge or block requires only a plurality, so the system biases against false promotion. Split juries escalate to a wider domain ring.
6. **Promotion or expulsion.** Promoted claims seal into the next canonical patch and standing is returned. Expelled claims go to the kill record; the sponsor loses standing.

---

## 7. Standing: the time-locked labor credential

Standing is not currency. It is a non-transferable, decaying credential representing verified capacity to perform substrate labor, and it is the only key to the canonical gate.

It is earned only by work the verifier can sample: correctly typing forum claims, supplying substantively independent corroboration, surfacing confirmed structural gaps, cross-domain engagement that shifts claim structure, and successful red-team defense. It is domain-typed, so a cartel must capture every niche to control the gate; decaying, so it expires without continued labor; revocable, so accuracy on assigned duties is tracked and falling below threshold forfeits all of it; and non-transferable, so it cannot be sold, delegated, or inherited.

The decisive property is that standing is **time-locked**. It is duration of verified contribution, and duration is the one axis compute cannot collapse. An attacker with unlimited synthetic labor still cannot front-load standing by a compute spike, because the gate is time-plus-survival: staying under the revocation threshold across a long adversarial window while the deep sample rolls repeatedly. Instantaneous attacks, the cheap ones, do not clear it. This converts the defense from an inequality with tunable knobs (is fake labor cheaper than real) into a harder bet (can you survive a long window unsampled into revocation).

---

## 8. The red-team immune system

Any standing-holder may open a super-stake challenge against a fermenting or promoted claim, staking a multiple of the submitter's stake. The challenge triggers an independent red-team audit across multiple validation channels. A successful challenge recovers the stake plus the submitter's forfeit, held in escrow until a second independent red team confirms. Red teams that show self-dealing patterns see their standing repriced down. The red team is not a volunteer class; it is the standing population on rotation plus bounty hunters, self-funding in standing and self-correcting in accuracy.

---

## 9. The uncapturability argument

This is the spine, and it answers an adversarial audit's worst findings structurally rather than by claiming to have solved identity.

- **Time-locked cost.** The one tax that scales with duration. Synthesis collapses cost on every axis except elapsed time, and standing is priced in elapsed time.
- **Sybil dissolution.** To forge N independent corroborators you must pay for N genuine, time-locked, cross-domain contributions. At that price the Sybil has become a contributor, and the attack is indistinguishable from honest participation, which is the point.
- **Reputation demoted to fork-signal.** Reputation is not the integrity guarantee, so it does not have to be unforgeable. Its job is to signal when the canonical store has drifted from the substrate, and a gamed reputation field is itself the readout that says fork now. The thing an audit can break was never the thing holding the system up.
- **Accrued-value ratchet.** A successful capture cannot un-verify history. Every prior patch's verified work is already canonical and already forkable, so capture wins the present gate and still inherits, and is inherited from, a real substrate. The downside of capture is bounded to losing the most recent window, not the commons.
- **Harmonic inversion.** Genuine cross-domain engagement produces harmonic disagreement, so the absence of harmonic, sterile agreement, is the alarm. The attacker's optimal evasion, a pristine acyclic consensus, is precisely what trips the wire. The polarity is flipped: the clean signal an attacker would manufacture is the suspicious one.
- **Client-side patch selection.** Canonical is a per-client choice over a tamper-evident history, so there is no single gate to own. An organization runs against the patch it trusts, a skeptic against an earlier one, a fork is just a patch some clients select and others do not. Capture of "the" canonical store stops being meaningful.
- **Impossibilities priced around.** Douceur and Gibbard-Satterthwaite stand. The labor-time cost makes exploiting them uneconomic, and forkability makes the residual recoverable. The design accepts the bounds and arranges the economics and the exits around them.

---

## 10. Clients and forking

Clients are the open, forkable layer, read-only against truth, and they now select which patch to read against. Thin clients restyle the read response within the closed node-kind vocabulary; fat clients call more of the API and compose their own way. Detaching the client from the patch is what makes a fork survivable: when the honest minority forks, users re-point the same client at the good patch, the captured patch is abandoned, and no one rebuilds an interface. Forking becomes a re-point rather than a rupture, and which patch is canonical becomes a user or organizational choice rather than a contested central authority.

---

## 11. Bootstrap and sunset

At genesis no standing exists, so the system cannot verify because there are no verifiers. The bootstrap exception opens a provisional queue: no standing required to submit, provisional claims cannot derive, they are visible in the forum and re-fermented once standing pools mature, and expelled provisional claims carry retroactive liability that flags the submitter and starts future standing negative. First standing is born by digesting the provisional backlog, typing and gap-hunting and cross-domain engagement on wild claims, so the first standing-holders are the ones who clean the compost pile. The provisional queue closes irreversibly once enough of a small set of maturity thresholds are met (model stability, variety saturation across distinct domains, and standing density). Past sunset, new submissions require standing and genesis-era standing decays at an accelerated rate.

---

## 12. Load-bearing assumptions and open seams

Stated plainly, because the design concentrates risk rather than eliminating it, and the concentration is the thing to defend. These are graded in the status ledger as open seams S1 through S4.

- **Tamper-evident patch history (the new crux).** The accrued-value ratchet, the rollback target, and client-side selection all rest on the patch history being append-only and tamper-evident and on the last good patch being unambiguous. This is a cleaner crux than identity, append-only tamper-evidence is a solved problem in a way Sybil-resistance is not, but it is now a primary assumption.
- **The time-lock survival inequality.** Defensible and parameterized, not proven. The open quantity is whether synthetic labor can survive a long window under the sampling and revocation regime more cheaply than the value of capture, against a high-value target with near-free synthetic labor.
- **Synthetic versus genuine harmonic.** The harmonic inversion moves the attack to manufacturing cross-domain disagreement that looks heterogeneous. The open question is whether synthetic harmonic is distinguishable from genuine harmonic, and the cost argument (faking disagreement across genuinely different traditions is nearly as dear as having them) is plausible and unproven.
- **The patch-boundary attack.** Making patches the rollback unit makes the patch boundary a target: poisoning the window just before a patch seals, or contesting where the last good patch was, attacks the ratchet rather than the gate. The provenance envelope is what must hold here.
- **The density-collapse lever (open).** A governance layer that codifies a hard coordination-density threshold gives an attacker a deterministic lever: drive local participant density and interaction velocity past the threshold to force collapse of a targeted sub-graph without engaging any claim's content. This was surfaced in adversarial review and is not yet answered.

---

## 13. Status

Built and verified: the typed substrate, the typing rule and terminals, the partition, the mechanical composition across uncoordinated emitters, the corpora, the teaching and compare clients, the storage-API-clients boundary, fork-by-diff, and structural gap detection. Designed and not yet built: the three access layers, the standing economy, the Knowledge Game lifecycle, the red-team immune system, the patch history, and client-side patch selection, that is, the whole of Sections 4 through 11. The uncapturability argument is a design argument over that unbuilt layer, with the open seams of Section 12 unresolved. Build status for every claim is graded in `docs/status-ledger.md`, not restated per document.
