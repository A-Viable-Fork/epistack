---
Type: argument
Purpose: "Derives recentralization rather than asserting it: each internet era is a foreign kernel that faithfully encodes its trust decisions, the conformance checker prices all three, and every violation maps to the era's documented failure. The eras hold the composition invariants and violate the control invariants; the violation was costless in the cooperative regime and catastrophic after the shift; the Act 3 patches compensated by installing authorities, so the compensation is the centralization."
Depends on: []
Depended on by: []
---

# The TCP/IP counterexample: recentralization, derived

The mapping to the internet holds at the trust-architecture layer and never at the content layer. A claim in an era kernel is an acceptance, "this MAIL FROM is who it declares," "this autonomous system legitimately originates this prefix," "this response resolves this name," a structural trust assertion with no semantic payload. Packets carry no semantics; claims do. So these kernels model what the network decided to accept from whom, which is the one layer the internet-to-kernel mapping is about. Nothing here is a claim about whether a packet's contents are true, only about the standing the protocols conferred on an acceptance and from whom.

This document is computed. Each verdict table below is produced by running the register-driven conformance checker (`build/check-conformance.mjs`) over three era kernels (`build/tcpip-eras.mjs`) against the real contract register, and `build/check-tcpip-counterexample.mjs` reruns the reports and fails if any verdict here drifts from what the checker computes. Run it to reproduce every table.

The loving frame holds throughout: Act 1 was right for its regime. The violations named below were real and costless, because a cooperative club supplied out of band exactly what the invariants supply in band. The story is not that the founders erred; it is that the regime shifted and the accounting had to rebase.

## Scope: what the checker computes, and what is analysis

The conformance checker computes verdicts for the five invariants that have a mechanical predicate against the kernel shape: `CR-typed`, `CR-monotone`, `CR-untyped-floor`, `CR-shared-hash`, and `CR-recomputable`. The other six contract-register invariants are reported unverifiable-mechanically and are treated here as analysis in prose, labeled as such: `CR-gate-authority`, `CR-forkable`, `CR-history`, `CR-typing-acts`, `CR-attenuation-line`, and `CR-reading-open`. Where this document reasons about authority holding a trust decision (`CR-gate-authority`) or revocation being concentrated (`CR-forkable`), that reasoning is prose, not a computed verdict, and the tables mark those rows unverifiable.

Two classes organize the whole exhibit. The **composition invariants** are what two kernels must share to compose: that claims are typed, and that a shared type means a shared meaning. The **control invariants** are what keeps standing honest inside a kernel: that a grade recomputes from public structure, never exceeds its supports, and that a crossed claim grounds nothing until it is locally typed. The internet held the composition invariants and scaled on them. It lacked the control invariants, and its history is the price of that.

## Act 1: the cooperative regime

Every acceptance is native and advertised at full standing with no support structure, because that is what the protocols did: standing was a grant of the social layer, outside the graph. The gate recomputes each acceptance to the floor, so the advertised full standing exceeds what public structure carries. The violation is real. It was also costless, because verification happened out of band: an unwelcome sender got a phone call, not a forged-header check (`net.thuerk-1978`, the Defense Communications Agency reprimand).

| Invariant | Verdict | Evidence | Mapped documented failure |
|---|---|---|---|
| CR-typed | conforms | every acceptance carries its protocol type (mail, route, name); both ends implement the same RFC | none: the internet held this and scaled on it |
| CR-monotone | violates | advertised full acceptance exceeds the floor that recomputation over zero support confirms | none in regime: verification was out of band |
| CR-untyped-floor | conforms | every acceptance is native; nothing crosses in | none in regime |
| CR-shared-hash | conforms | no acceptance carries a foreign origin or an inherited grade | none in regime |
| CR-recomputable | violates | standing is a social grant, not a function of public structure (`net.smtp-noauth`, `net.egp-trust`, `net.bgp1-auth-zero`, `net.dns-txid`) | none in regime: the cooperative club supplied it in person |
| CR-history | unverifiable | no mechanical predicate | analysis: provenance was institutional memory |
| CR-forkable | unverifiable | no mechanical predicate | analysis: forking was leaving the club |
| CR-gate-authority | unverifiable | no mechanical predicate | analysis: the endpoints held authority jointly |
| CR-typing-acts | unverifiable | no mechanical predicate | analysis |
| CR-attenuation-line | unverifiable | no mechanical predicate | analysis |
| CR-reading-open | unverifiable | no mechanical predicate | analysis: the record was open among peers |

## Act 2: the regime shift

The same kernel construction, now with adversarial inputs admitted at identical advertised standing. A bulk commercial mailing is accepted as legitimate mail (`net.canter-siegel-1994`); AS7007's false origination is accepted as the preferred path (`net.as7007-1997`); and a spoofed response crosses in from a non-authoritative source carrying a grade, admitted without local typing (`net.dns-poisoning-known`). The control-invariant violation profile on the legitimate acceptances is identical to Act 1. What changed is the cost, and one new violation class: the crossed-in spoof grounds standing across the border, which is `CR-untyped-floor`, and its carried grade is accepted with no recomputation path, which is `CR-shared-hash`. Cache poisoning and rsh trust files were, structurally, standing laundered through an unguarded border.

| Invariant | Verdict | Evidence | Mapped documented failure |
|---|---|---|---|
| CR-typed | conforms | the adversarial inputs are still typed acceptances; the kernel cannot tell them from legitimate ones | scale held |
| CR-monotone | violates | advertised full acceptance exceeds recomputation, on legitimate and adversarial inputs alike | the spam, the route leak |
| CR-untyped-floor | violates | the spoof is non-native and advertises full standing, grounding across the border | DNS cache poisoning |
| CR-shared-hash | violates | the spoof carries a grade natively accepted with no local recomputation path | DNS cache poisoning |
| CR-recomputable | violates | standing is still granted, not recomputed, now to anonymous and adversarial producers | Canter and Siegel, AS7007 |
| CR-history | unverifiable | no mechanical predicate | analysis: provenance now unrecoverable at scale |
| CR-forkable | unverifiable | no mechanical predicate | analysis |
| CR-gate-authority | unverifiable | no mechanical predicate | analysis |
| CR-typing-acts | unverifiable | no mechanical predicate | analysis |
| CR-attenuation-line | unverifiable | no mechanical predicate | analysis |
| CR-reading-open | unverifiable | no mechanical predicate | analysis |

The violation profile is constant across Acts 1 and 2 while the outcome inverts. That is the fixed/free lesson stated as a computed diff between two conformance reports over one contract register: the cost of a control-invariant violation is regime-conditional, costless in a cooperative regime, catastrophic once the regime admits an adversary.

## Act 3: reinforcement

The patched architecture. Acceptances now carry checking records, but for the authority-granted decisions every checker is a concentrated authority attesting its own grant: an inbox provider's classifier (`net.recentralization`), a certificate-authority signature (`net.diginotar-2011`), a content-delivery network's admission (`net.fastly-2021`), and, for the unsigned legacy majority, plain trust (`net.arin-legacy-friction`). The grade remains a grant rather than a function of public structure, so `CR-recomputable` and `CR-monotone` still violate. Two patches are different in kind: a Certificate Transparency log entry (`net.ct-logs`) and a signed Route Origin Authorization (`net.rpki-growth`) carry genuine independent public recomputation, and they conform on `CR-recomputable`. They are the rebase, and the honest counterweight.

| Invariant | Verdict | Evidence | Mapped documented failure |
|---|---|---|---|
| CR-typed | conforms | every acceptance is typed | scale held |
| CR-monotone | violates | the authority grants advertise above what their self-attestation recomputes | the DigiNotar misissuance, the CDN outages |
| CR-untyped-floor | conforms | the Act 3 acceptances are native to their enforcers | n/a |
| CR-shared-hash | conforms | no Act 3 acceptance inherits a foreign grade without recomputation | n/a |
| CR-recomputable | violates | the authority grants (mail, CA, CDN, unsigned legacy) do not recompute; the CT log and the signed ROA do and conform | recentralization of the enforcement layer |
| CR-history | unverifiable | no mechanical predicate | analysis: the log entries are the exception, publicly auditable |
| CR-forkable | unverifiable | no mechanical predicate | analysis: revocation is concentrated (DigiNotar died by browser revocation, not by participant fork) |
| CR-gate-authority | unverifiable | no mechanical predicate | analysis: infrastructure now asserts grades (the browser root store, the deliverability verdict) |
| CR-typing-acts | unverifiable | no mechanical predicate | analysis |
| CR-attenuation-line | unverifiable | no mechanical predicate | analysis |
| CR-reading-open | unverifiable | no mechanical predicate | analysis: reading a CT log is open; appealing a deliverability verdict is not |

## The derivation

The exhibit's spine, each step computed or labeled as prose analysis:

1. **The eras hold the composition invariants and violate the control invariants.** Computed: all three conform on `CR-typed`, and the two ends of every protocol pin the same RFC, so shared meaning is shared specification. All three violate `CR-recomputable` and `CR-monotone`. The internet was composable and scaled precisely because it held the composition class; it never held the control class.

2. **The violation profile is constant across Acts 1 and 2 while the outcome inverts.** Computed: Act 2's violation set contains Act 1's, so the control violations are identical on the legitimate acceptances; the added `CR-untyped-floor` and `CR-shared-hash` are the adversary exploiting the same unguarded border. The cost, not the profile, is what the regime shift changed.

3. **Every Act 3 patch that compensated for a control violation without restoring recomputability installed an authority.** Computed on `CR-recomputable`: the mail classifier, the CA, and the CDN grants violate; each is a concentrated enforcer holding a trust decision. An authority holding a trust decision is the definition of centralization the lineage documents (`net.recentralization`). So recentralization follows from the violation profile plus the regime shift; it is derived, not asserted.

4. **The patches that did restore recomputability are rebase-shaped, and they are the slow ones.** Computed: the CT log entry and the signed ROA conform on `CR-recomputable`. These are exactly the changes that rebased a legacy protocol rather than bolting an enforcer onto it, and RPKI adoption is dragged by legacy-address economics (`net.arin-legacy-friction`), which prices the cost of rebasing late.

## The two classes

Composition invariants are regime-invariant. Typed claims and shared-meaning-by-shared-specification are what let the internet compose and scale, and the eras hold them in every act. Control invariants are regime-conditional in cost. A cooperative community experiences them as pure overhead, right up until the regime shifts, because the community supplies verification out of band. That is precisely why EpiStack fixes the control invariants: a substrate cannot know in advance whether its community will stay cooperative, and retrofitting the control invariants after the shift means installing enforcers, which Act 3 receipts as concentration.

A dual-classification honesty note: the partition is not perfectly clean. `CR-recomputable` serves both classes at once, because recomputable standing is what makes a composed grade checkable by the receiver and what keeps standing honest internally. The two-class reading is a two-bit annotation on the invariants, an analytic lens, not a hard split in the register, and the register does not carry it as a field.

The cost of the control invariants also shows up where it is least expected: not only as concentrated enforcement, but as a rewritten legitimate producer. Once acceptance is a classifier's grant, senders write for the classifier. Templated machine-generated business-to-consumer mail reaches about 90 percent of major-provider non-spam volume (`net.variety-cost`), so the patch's cost is a reshaped sender population, not only a concentrated enforcement layer. The controls that absorb adversarial variety reshape legitimate production too.

## The stakes

The internet's trust layer was well calibrated for a cooperative club, violated the control invariants harmlessly for two decades, and then paid for those violations twice: once in the catastrophes of the regime shift, and again in the recentralization of the patches. A knowledge substrate facing the same generative-abundance regime shift has the internet's receipt in hand. It can rebase now, fixing recomputable standing in band while the community is still cooperative and the cost is low, or it can reinforce after the shift and recentralize. The choice is the one the eras already ran.

Run `node build/check-tcpip-counterexample.mjs` to recompute every verdict above and the full violation-to-failure mapping.
