---
Type: record
Purpose: The authored fidelity read of the accessible register against its precise source, a graded verdict per section, which the drift check cannot compute and which stands as the discharge of the authored-fidelity obligation the register-view design names.
Depends on: docs/register-view.md
Depended on by: nothing
---

# Register Fidelity Read

The register-view drift check (`build/check-registers.mjs`) verifies structure, not fidelity: it
confirms every accessible section has a counterpart, a delta, its links, and a fresh hash, and it
surfaces the per-section `verify` spans as authored obligations it does not discharge. This record is
that discharge. It is a read of every accessible section of the judges document against its precise
source in `docs/what-stands-without-trust.md`, graded per section, the way a case instance is verified
against its literature. It is authored, not computed, which is why it lives here as a record rather
than as a check.

The verdicts use three grades. **Faithful** means the accessible reading preserves every claim the
precise section makes, its figure handling matches the calculus (near-literal figures plainer with no
delta, earned case-figures kept verbatim and grounded, constitutive figures translated to a plainer
figure with a delta, ramps collapsed to their payoff, enumerations kept whole, enacted commitments
stated), and the delta names the real loss. **Faithful with a noted residual** means the reading is
faithful but carries an open item recorded below. No section graded unfaithful; where one had, the
prose would have been corrected before this record was written.

## The verdicts

| Section | Verdict | What the read confirmed |
|---|---|---|
| opening | Faithful | The enacted concession is promoted to a stated commitment ("the argument depends on this strength being real"), which avoids the glib-about-synthesis failure; the constitutive figure "the clearing" becomes "nothing underneath it" and the delta names the lost non-local work (the kernel filling the cleared ground). Both moves check out against the precise opening. |
| what-knowledge-is | Faithful | The constitutive definition is translated to a plainer figure of the same kind ("stays standing when you stop trusting whoever made it"), never to a literal paraphrase; the earned analogy "one measurement is testimony; many are knowledge" is kept verbatim; the synthesis-placement paragraph carries the whole placement (generation is not knowledge until the knower is subtracted), not a dismissal; the delta names "subtracted" as the deferred precision. |
| kernel-watched-at-work | Faithful | The LHC walk keeps one descent verb where the precise ramps three, no claim lost; the near-figure "carrying two loads" becomes "doing two jobs" with no delta, correctly, since it over-commits to nothing; the three domains stay as three, each landing on its own floor. |
| three-kernels | Faithful | The three kernel types, the untyped type as not-a-floor, the laundering guard, retail and wholesale forks, standards-from-use, the continuous axis, and the regime choice all survive; only the illustrative per-type LHC restatements collapse, which is a ramp, not a claim. |
| what-was-built | Faithful | The type-first reframe carries: the contribution is the knowledge kernel type and the top-down meta kernel is its fitted instance, with the both-markets-unpopulated honesty intact. The earned case-figures ("one assumption wearing several coats," "a method pushed past the range it was built for," the frame-swap) are kept verbatim; the one constitutive tail ("honestly terminates" to "honestly ends") carries its delta; the closing enumeration is kept whole. The cross-cutting node-grounding residual below is now closed. |
| where-it-points | Faithful | The federation-as-built, the independence of members, the untyped-type join, standards-from-use, and the free-and-required tiers all survive; the built-versus-specified line (the federation is built, the coordination fabric that governs writes at scale specified) is held. |
| evaluating-an-enabler | Faithful | The two-axes-ordered framing, the present-and-enabled split, the enabler-scoping choice, and the enabled-not-guaranteed bound are all preserved; the section reads as a finding, not a bid. |
| reading-on | Faithful | A plain list of the companion documents; no figure, no claim at risk. |
| postscript | Faithful | The dated-observation framing is promoted to a stated caveat, and the point stays structural (a purpose-built workbench occupies the periphery slot the architecture predicts), not a product claim. |
| provenance | Faithful | A near-verbatim carry of a short factual disclosure; nothing to translate. |
| appendix-federation | Faithful | Every federation mechanism survives (standalone members, the composite, transfer semantics, retail and wholesale forks, standards-from-use, convergence); only the bold sub-labels and their restatement collapse, a ramp; the built-federation-with-specified-coordination-fabric line is held. |

## The one cross-cutting residual (now closed)

The `what-was-built` and `kernel-watched-at-work` sections carried a residual that was about grounding
granularity, not prose fidelity. The COVID counterexample names "the prior each verdict turns on" and
the LHC counterexample names "the dependency those lines share," and in both registers these grounded
to the coarse case node (`covid.instance`, `lhc.antecedent`) plus the LHC robustness read, rather than
to the individual prior node or the reified shared-dependency node.

This is now closed. The gate snapshot (`build/vendor-snapshot.mjs`) is a full merge of all four cases,
folding the two migrated cases together with the three densified case stores (covid, the densified LHC
legs, and the eggs domain stores). The finer nodes the sentences name now resolve through the read
contract, and the `what-was-built` node_links were upgraded to the finer keys ("Miller's prior" for
the covid verdict, "framework choice" for the shared dependency) accordingly. The prose was already
faithful; the grounding is now at the granularity the prose promises. This was the same residual
`docs/register-diet-findings.md` recorded, and both are now resolved together.

## What this read does not close

This read grades the accessible register faithful as authored. It does not make fidelity a computed
property: a later edit to a precise section can still drift its accessible counterpart, and the drift
check will flag the stale hash but not the semantic drift, so this read is re-run when a precise
section changes. The `verify` spans in `corpora/registers/judges-accessible.js` remain the machine-
surfaced markers of where that re-read must happen; this record is their standing discharge until the
next precise edit.
