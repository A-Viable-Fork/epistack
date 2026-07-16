---
Type: argument
Purpose: The front door: the critique, its three counterexamples, and the protocol they force, in two easy pages, distilling the judges document for a first read.
Depends on: docs/what-stands-without-trust.md
Depended on by: README.md, docs/workflow-atlas.md
---

# The Climb of Synthesis

*The critique, its three counterexamples, and the protocol they force. Two pages. Start here.*

## The tool everyone will build, and where it stops

Ask the best AI research tool a hard question and it produces a synthesis: it reads everything, ties each claim to its source, and writes one clean, integrated answer. This is genuinely good and it gets better every month. This competition will receive many excellent versions of it, and I look forward to using them.

But a synthesis has one limit no improvement removes: it is one reader's view of the record. From inside a single view, however good, you cannot tell which parts are the world and which parts are the viewer, because the viewer is woven through every sentence. Everything follows from that. To check one step you must redo the whole thing. To combine two syntheses you need a person back in the loop. Challenged, a synthesis offers its author's judgment as the final word. So you read it, and then it ends. And as syntheses get better and cheaper, the point sharpens rather than softens: even the best is still one viewpoint, and the trust it asks for is the entire product.

## What might knowledge be

Two familiar facts show the alternative.

A mathematical proof asks you to trust nothing about the prover. You check the steps. The prover could be anyone or no one; a single checked proof removes its author entirely.

A measured constant asks you to trust no single lab. One lab's measurement is testimony you either believe or don't. What you trust is that many independent measurements agree, so the number survives any one lab being wrong. As measurements accumulate, trust in any particular measurer is turned down toward the measurements themselves.

Here is the definition this submission runs on, stated once at full density: knowledge is the invariant left as the model is attenuated (attenuation in the plain sense, turning something down). Plainly: turn down your reliance on whoever is telling you, and knowledge is what does not move. The proof is the case where the attenuation completes, trust in the prover driven to zero because the steps carry the whole weight. The measurement is the case where it approaches a floor, the most grounded a claim of its kind can be and the base a support chain terminates in, trust in any one measurer turned down across many, what agrees being what remains. A synthesis can perform neither on itself: its author cannot be checked, and cannot be agreed out, because removing the author destroys the result. So a synthesis is a contribution to knowledge, one measurement's worth, and not knowledge. The missing layer is whatever performs the attenuation. It performs the structural half: it attenuates the producer, so a claim's grade recomputes from its cited support without trusting who produced it. Judging whether that support is true of the world is the other half, semantic attenuation, which is the community's work and which the protocol makes checkable rather than performs. That climb, from one viewpoint's reach to what stands without it, is what this submission builds.

AI does not change what a synthesis is. It changes how many of them arrive, and it can wear the marks that used to signal care. The polish that once meant someone had done the work, clean prose, cited sources, a confident structure, is now cheap to produce without the work, so the reader's old shortcut for trust, that a thing which looks rigorous probably is, stops holding. A synthesis was always one viewpoint with its author welded in, and cheap capable generation multiplies these: more of them, faster, each reading cleanly, each still asking for the same trust while the signs that trust was earned no longer track whether it was. The channel from a producer to the record was never typed, and it carried this fine when syntheses were slow and few and their surface roughly tracked their soundness. Under the influx it does not carry, not because a new kind of thing is coming down it but because the old kind is coming down it faster, and dressed better, than any reader can attenuate by hand. So the influx is a multiplier on a channel that was always untyped, and the fix is to type the channel, checking what a claim rests on rather than how it reads, which is worth doing now precisely because the volume and the polish together make the missing typing visible.

## The protocol: a knowledge kernel

The layer that performs the attenuation has a type, and the type has three parts. A typed claim graph: claims labeled by what kind of thing they are (a proof, a measurement, an estimate, a definition, a still-contested judgment) and connected to what they rest on, with one rule doing all the work, a claim is as grounded as its weakest necessary support. A gate: the sole way in, admitting a contribution only if it holds together with what is already there, and rechecking every declared grade on every change. And shared pieces: types and subtrees another kernel adopts by pinning them or leaves by forking, so nothing is enrolled and no one owns the result. Call the whole a knowledge kernel. Any reader recomputes any claim's standing from the public structure, trusting no one, and gets the same answer as everyone else.

The gate checks a claim's typing, supplied by the claimant. Standing is something a claim's agent does to the claim before the gate sees it, by typing it, which stakes the agent's own standing on the claim holding. The gate reads the typing it is handed and confirms it holds. Input that arrives untyped is admitted and sits at the floor, grounding nothing, until someone types it and owns the typing. So the work of earning standing rests on whoever makes the claim: you get the standing you typed for, and untyped input is free to enter and simply earns nothing. And whoever types it is only ever a named agent, a person, an organization, a model, or a pipeline of these, alike, so the identical rule falls on all of them: type your claim and stake your standing, or ground nothing. The gate reads the typing, never the kind of agent behind it.

This submission builds one instance of the type. Watch it work. In its tree sits the claim that LHC collisions pose no black hole catastrophe risk. Its support descends through the fact that nature has run higher-energy collisions for billions of years, down through the measured flux of cosmic rays striking the moon and surviving neutron stars, and terminates in astronomical measurement: something anyone can recheck. Now notice what the machine never knew. It has no idea the claim is about physics. Hand it a claim about disease origins and it runs the identical computation down to an epidemiological estimate; hand it a claim about diet and it runs it down to a public act of definition. And it has no idea who made the claim. It checks a claim's structure, never its agent's identity or nature, so a person, an organization, a model, or a pipeline of these are checked exactly the same way. The attenuation of the agent is done by a machine.

One layer sits outside this and is meant to. Something has to read the messy record and emit candidate claims into the gate: the ingestion producer, and the better and cheaper generation gets, the better that producer gets. The periphery thickens only where the protocol's spread needs it, and this layer does not need it: a working connector is enough, because it is the layer the influx is already good at, and the strongest automated ingestion in this competition is a producer this protocol would gate like any other. The two layers the influx makes necessary are the ones it cannot supply for itself: the gate that checks the typing of what arrives, and the store that composes and keeps it. Those are what this submission builds. A great ingestion tool feeds a typed channel; without the channel it is one more fast synthesis. The channel is the contribution, and it is general across the three domains no matter who or what fills it. Typing a claim is the agent's work, and the kernel checks it; the ingestion layer is periphery an agent supplies.

If you build synthesis tools, this is an invitation, not a competitor. The boundary is small and open: your tool emits claims already typed, each with the support it rests on, and hands them to the gate through one contract. The gate checks the typing and answers, admitted at this standing, or held back for this reason. Your tool never touches the store and is never asked to be trusted about grounding; it produces, the gate checks, and whatever holds composes with everything else already there. The better your tool, the more it contributes, because a typed claim that grounds is worth more than a synthesis that ends. Bring your producer to the channel.

## Three counterexamples

The proof the machine does real epistemic work is that each case yields what a good synthesis would have smoothed flat.

**The LHC.** The safety argument looks robust: several independent lines of evidence converging. It looks that way until the graph makes the assumption the lines share into an explicit node, and the convergence reprices as one assumption wearing several coats. In prose, that subtlety survives only as long as the author remembers to mention it. In the graph, it is a computed fact.

**COVID origins.** The evidence looks decisive, in whichever direction the teller favors. It looks that way until the prior each verdict turns on is named as a claim of its own, and the debate resolves into one open weighing, held where a reader can reprice it instead of buried where a narrator settles it.

**Eggs.** "Eggs are healthy" looks like a fact. It looks that way until the frame it presupposes, which population, which health outcome, replacing which other food, is swapped, and the verdict swaps with it while every measurement underneath keeps its grade.

Three domains, three counterexamples, one machine that never knew the difference.

## What you are evaluating: a protocol, with a working instance

The submission has three layers. The kernel is the checkable core: the schema, the gate, the grounding rule. The API is one contract through which everything reads and writes. The periphery is the interfaces. The contribution is the kernel and the contract, because that is the part that stays fixed while surfaces come and go, and because once the grounding is a shared checkable object, anyone can build any interface over it without being trusted about the grounding. Interfaces are the part a market supplies.

So read the periphery by its allocation rule: it is thick exactly where the protocol needs thickness to spread, and nowhere else. A guided walk exists so you can see the three counterexamples with reproducible receipts. A kernel manager exists so you can operate a federation of four kernels and author a claim through the real gate. A generator and an on-ramp exist so a stranger can stand up a kernel of their own from a config file. The surface a market would add sits outside that allocation rule, left to the market by design.

Every part of what was built has an oracle: run the checks and each one states the invariant it verified, in about two minutes. The coordination machinery a large federation of many writers would need is designed and marked specified in the status ledger, with its open problems named. The line between built and specified is kept sharp, because keeping such lines sharp is the entire method. The right form of an answer to this problem is open rather than finished, and [On Transparency](on-transparency.md) says why.

## Go deeper

- **Why the open form:** [On Transparency](on-transparency.md), why the answer to this problem is an open system rather than a finished one
- **The full argument, precisely:** [What Stands Without Trust](what-stands-without-trust.md)
- **Implement the protocol without the argument:** [The Protocol Specification](protocol-spec.md), the record formats, the grounding computation, the gate, and the crossing, stated normatively and standalone
- **Walk the counterexamples:** open [`submission.html`](../submission.html) and follow the guided path; the same receipts run headless with `node build/check-demo.mjs`
- **Feed a source in, ask a question out:** [The Workflow Atlas](workflow-atlas.md), how any producer feeds a source into the gate and any consumer queries the graph the gate protects
- **The three ways to arrange kernels, and why this one:** [The Kernel Taxonomy](kernel-taxonomy.md)
- **Exactly what is built and what is specified:** [The Status Ledger](status-ledger.md)
- **The approaches killed on the way here, with reasons:** [The Compost Ledger](compost-ledger.md)
- **Run it yourself:** [Quickstart](quickstart.md), clone to green checks in about two minutes
- **Where this goes next:** [Vision and Continuation](vision-and-continuation.md)
