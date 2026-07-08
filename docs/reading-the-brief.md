# Reading the Brief

## How the competition's guidance shaped the build

This note connects the competition's stated guidance to the choices this submission made, so a judge does not have to infer the reasoning. It is written as a competitor answering the brief, not as an architect documenting a system, and every section quotes the competition's own language and shows the decision that followed from it. Where a choice was made for other reasons and the guidance merely permits it, that is said plainly, since the note is only useful if each citation is load-bearing and honest.

## On scope: a component, taken literally

The brief says it is "excited by any submission that advances the state-of-the-art on a component," and "aren't asking you to build an entire, robust, fully-featured system." We took this literally. The component is the structure-and-grounding kernel: the typed graph and the mechanical rule that grounds a claim by what it rests on. Everything else in the submission, the three cases, the interfaces, the composition layer, exists to demonstrate that component rather than to be a product around it. This is why the periphery is deliberately thin. A thick periphery would be building the fully-featured system the brief explicitly does not ask for, and the honest demonstration of a component is the smallest surface that shows it works.

## On polish versus spec: the spec, and a surface that proves it runs

The judging guidance says to "read for the spec, not the polish," that "a clear workflow with a rough prototype usually beats a polished prototype with opaque methodology." So the effort went into a verifiable kernel with an oracle suite that checks its every claim, and a minimal navigable surface that proves it runs, rather than into interface polish. The submission is legible where the guidance says to look, the grounding rule and its checks, and thin where the guidance says polish does not decide, the interface. The guided path exists to point at the effective regions, which the brief asks for directly: "curated pointers to particularly effective regions of worked examples."

## On transparency: the ledger is the criterion, not a confession

The assessment desiderata ask to "distinguish what the debate settled from what it merely performed settling," and the spec shape asks submitters to "make clear where your design choices are uncertain, and be transparent about where you're making tradeoffs, and why." The status ledger is the operationalization of this. It is not an apology for unfinished work; it is the same discipline the kernel applies to claims applied to the submission itself, naming what is built, what is specified, and what is the open seam, so that the boundary between demonstrated and designed is a checkable fact rather than a rhetorical choice. The Stage 4 coordination fabric being marked specified, with its central inequality named as the open question, is this criterion met, not evaded.

## On adversarial robustness: forkability and grounding, not authority

The brief wants artifacts that "travel, combine, or survive (especially adversarial) scrutiny," and asks how a format "plays well with newly-emerging sources, a diverse and changing user base, and an expanding frontier of AI capability for tooling." The answer is forkability and mechanical grounding rather than authority. A claim's standing is a property of its structure that a reader can check without trusting its author, so it survives motivated reading by being checkable rather than by being vouched for; and a captured or poisoned kernel is forked rather than appealed to, so the commons has no center to seize. The adversarial walkthrough shows this under specific attacks, and it keeps the run-versus-specified split honest throughout.

## On compounding: the separation of trust from view

The brief's headline question is whether work "compounds, with multiple people or teams building on each others' work," and it names the failure of current tools plainly: they "mostly produce single-user artifacts tuned to one investigator's context, not the kind that travel, combine, or survive." The submission's answer is one move: separate trust from view. Synthesis fuses them, the author who grounds is the author who presents, which is exactly why a synthesis is a single-user artifact that cannot be reused without its author. The kernel splits them, so the grounding is established once and reused by anyone, and many views compose over it. Compounding is what that split enables on the trust side.

## On scaling: a market of views over shared trust

The brief asks whether the work "scales with improvements to AI or more compute," and the protocol shape asks for a format maintainable against "a diverse and changing user base, and an expanding frontier of AI capability for tooling." A single tool answers this badly, because it must keep pace with every user and every advance itself. The submission's answer is a market: a checkable core lets many peripheries, built by different parties and specialized for different readers, compete over the same trusted claims, and a new tool enters over the contract without touching the core. The external contract is the mechanism that admits foreign peripheries, so the scaling claim is not that this submission keeps up, but that the architecture lets an ecosystem keep up. This is enabled, not guaranteed, which the submission says rather than overclaiming a market that does not yet exist.

## On generalizability: the field's own examples

The brief judges whether "the workflow travels," across "cases of different shape" and "beyond the three we provide," and it points at an abridged collection of strong epistemic efforts as its reference for quality. The submission argues generalizability on that collection directly: each named effort, from image-forensics to claim-by-claim evidence grading to analysis of competing hypotheses, is someone supplying by discipline a capability the kernel supplies by structure. That is the generalizability case made on the competition's own list rather than by assertion, and the three cases were chosen to span the brief's three shapes, curated debate, confident answer with complex evidence, and mundane-but-contested, on purpose.

## What this note is not

It is not a claim that every choice was made by reading the brief. Some choices, the typed graph, the grounding rule, the trust boundary, came first and the brief confirmed them; others, the thin periphery and the status ledger as an explicit artifact, were shaped by the guidance directly. The note distinguishes the two rather than dressing every decision as a response, because a bridge between the competition's values and the author's choices is only worth crossing if it holds weight, and it holds weight only where the quote is real and the decision genuinely followed.
