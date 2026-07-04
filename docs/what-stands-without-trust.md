# What Stands Without Trust
### A submission to the epistemic case study competition

Most submissions to this competition will produce impressive, readable syntheses of the three cases. I look forward to using them.

Take the best version of one. It ingests the messy, contradictory record, papers and preprints and testimony and data, and pulls each claim from it tied to its source. It sees when two sources make one claim in different words and when they make two claims that only look alike, so it neither double counts nor flattens. It resolves which claims support which, separates a claim's rhetorical force from its evidential weight, surfaces the cruxes rather than settling them by fiat, and names what the record leaves out. It renders all of this so a reader takes in a tangled dispute in minutes. Give it the strongest available model and it does this across more sources than a person can hold, with an agent checking every citation and figure, and a session another researcher can fork and rerun. That tool would be excellent. I would use it.

It still stands short of knowledge. What it makes is a synthesis, organized for a reader, and the next agent that wants to build on it has to trust it or redo it. The judgments inside it, this claim is grounded, that one is rhetoric, this crux decides the matter, are the synthesizer's own, offered as conclusions rather than as a structure the next agent can check and extend. Two of these syntheses over one question do not combine; merging them puts a person back in the loop. Against someone who disputes a claim, a synthesis offers the synthesizer's authority in place of a floor the disputant also has to stand on. So it is read, and then it ends. However good, it is the single-user artifact this competition names as the thing that does not yet travel, combine, or survive scrutiny.

## What knowledge is, among reasoners who model each other

The reason the best synthesis stops there is not a flaw in the tool. It is what the word knowledge has to mean once there is more than one reasoner.

For a single reasoner, a justified belief can live in the reasoner's head, and the justification is available by looking inward. That option closes the moment there are many reasoners who cannot see into each other, and who model not only the world but each other's reliability and motives. What one agent holds as justified is, to every other agent, an assertion, discounted by their estimate of the source, unless the justification lives outside the agent where a party who does not trust the agent can check it. So among agents who model each other, knowledge is the part of justified belief whose justification stands when trust in whoever is asserting it is subtracted. It is what a reasoner can build on without pricing the source.

A synthesis fails this by construction. Subtract the synthesizer and the judgments inside it have nothing left to rest on, because their justification was the synthesizer. That is what organized for a reader means: a reader supplies the missing trust. Knowledge is what needs no reader to supply it.

The definition claims less than truth, and the difference is the honest part. Not every true thing carries its justification into the shared space. A real measurement stays contested until its grounding is placed where others can check it, and a value judgment never fully leaves the space of argument. So the definition does not say knowledge is what is true. It says knowledge is the part of justified belief that carries its own justification into a form others can verify without trusting its author, and it lets the rest sit marked as unsettled rather than dressed as settled. A system that overclaimed what had crossed would fail a distrusting reader at the first check, which is the failure it exists to prevent.

## The two layers this forces

Read that definition in operational form and two requirements fall out, one from each half.

Justification that lives outside the agent has to live somewhere, as objects a second agent can point at. That is a **typed structure**: the claims and the reasons between them on a shared map, each labeled by what it is and what it rests on, rather than held in one agent's head or narrated in one agent's prose.

Justification a distrusting party can check has to be decidable without appeal to the asserter, because anything decided by authority is precisely what a party who rejects the authority cannot check. That is **mechanical grounding**: whether a claim holds is a property of the structure that yields the same answer for everyone, computed rather than granted.

These are not extra features added to a definition of knowledge. They are the definition of knowledge among recursive modelers, written as things to build. A skeptic who grants the definition has already granted the two layers. The synthesis tools are the third layer of this system, the interface a reader meets. The typed structure and the mechanical grounding are the two underneath, and they are what let separate investigations land on one map and accrete into something larger than any of them. They are what this submission builds. The build state of every part named below is graded, component by component, in the status ledger; this document states what the engine is, why it is sound, and why the problem forces it.

## A working engine

The engine is those two layers, running. It records knowledge as a typed graph of claims and the support between them, and it does four things to that graph that a synthesis leaves undone.

It grounds each claim to a floor. A claim bottoms out in a measurement or a proof, in a binding declaration, or, for a contested claim, in a faithful structure of the argument around it. The engine holds which floor a claim reaches and how far its support actually descends toward that floor.

It finds the holes mechanically. A claim whose support reaches no floor, a dependency resting on a superseded source, a pattern with a branch left undrawn, a reference that dangles: the engine surfaces each as a first-class object through an open read, and run on the worked cases it reproduces exactly the holes a person had been tracking by hand.

It admits new work through a gate. Reading the graph is open to everyone. Adding to it passes one check: a contribution enters only when it holds together with what is already there, and two uncoordinated contributors' output composes by machine with no model in the loop. A reader can run that composition in about two minutes and watch the check rather than take it on faith.

It keeps what was ruled out. A refuted claim stays in the record with the reason it fell, so the work of refutation compounds and a dead claim meets its own obituary on any attempt to revive it.

Around this core sits the interface layer, the same synthesis work the opening described, now reading through one public interface rather than standing alone: a plain-language walk for a newcomer, a terse exact view for a specialist, an inspect-and-dependents console, a side-by-side view that sets two disputes together, and a control that flips an assumption and shows the conclusion give way. Every one of them reads through the interface and leaves the stored truth to the gate.

The engine runs on three cases chosen to differ in shape, which are the three shapes this competition names. On LHC safety, a confident answer over complex evidence, it carries the reasoning down to a measurement, and every surviving line closes against an actual astronomical observation. On COVID origins, a curated debate, it traces the disagreement to one statistical method pushed past the range it was built for, prices what each side assumes, and leaves the verdict to the reader. On eggs, mundane and contested, it splits one casual question into the several it contains, answers the parts evidence settles, and marks the part that is a values choice. The three cases share one earned structure, a claim carried down to where it terminates, and they fail at different points along it, which is the reusable result: the same machinery, three terminations, the divergence localized rather than repeated.

## The theory that makes it correct

The engine's output stands without trust in its author because groundedness is a property of the graph anyone can check, the same for everyone. The theory is what makes that property well-defined.

Every claim sits at a position in one ordering, from untyped at the bottom, through the tiers of a still-contested claim, to three floors at the top: proof, measurement, and declaration. The ordering measures a single quantity, how much a downstream claim may rely on this one. Two positions ride on each claim: the highest grounding its kind could ever reach, and the grounding it actually achieves given what it rests on. A claim is as settled as its kind allows exactly when the two meet, and the distance between them is the work that remains.

Grounding propagates by one rule. A claim supported by several necessary parts is as grounded as its weakest necessary part; a claim with several sufficient paths takes its strongest. Support that leans on a contested assumption carries the contested value forward, so a claim's advertised grounding stays at or below what its supports actually provide. This is the whole of correctness, and it is the checkable-by-a-distrusting-party clause made precise: the gate admits a contribution only when the grounding it declares is covered by the grounding it can show, so the graph holds nothing that claims more standing than it has earned. The floor is the sole anchor, and every claim above it inherits its standing by this rule from what it rests on, never from who asserted it.

The same rule carves a question into parts. A claim is typed by where it can terminate, and that type is the knife: the cuts a measurement or a model can answer route onward toward a floor, and the cuts a commitment answers are priced and left to judgment. This is what lets the engine give a firm answer where the world settles one and decline where a values choice is all that remains, in the same structure and by the same discipline.

One line runs through all of it: what supports what, who said it, and where a hole sits are checkable facts about structure, so they compound across people who agree on nothing else, while which argument is strongest and which hole matters most turn on judgment and stay with the reader. The engine is exact only where structure has to be mechanical for grounding and composition to work, and the words and the judgments stay in plain language everywhere else.

## Why the problem forces exactly this

This competition asks for workflows that produce reliable knowledge bases that compound, where separate investigations build on each other and stand up to adversarial scrutiny. The definition already says why the two layers are forced in general; the competition's own frame, ingestion then structure then assessment, is where each layer does its work, and the three demands map onto the three clauses.

Compounding forces the shared structure. For one investigation to build on another, both have to land on the same map with the same coordinate system, which is the typed graph and the fixed public interface every contributor writes to. A capable research run already sorts claims, names a crux, and catches two analyses leaning on one source. The piece it leaves undone is leaving anything behind, because each run invents its own organization and discards it. The shared typed structure is what turns separate runs into accumulation.

Surviving adversarial scrutiny forces mechanical grounding. Cheap generation has made the marks of credibility, an authoritative tone, wide citation, a known name, forgeable for nothing, so the signal worth checking is whether a claim survived attack from sources that share no evidence. That check holds only when grounding is a property of structure an adversary cannot talk, pressure, or outvote into place, which is why grounding is computed and enforced at the gate rather than granted by standing. The same design grows stronger as scrutiny grows cheaper, because a standing adversarial process supplies the attacks and a claim earns its place by surviving them.

Knowledge that stands without trust in its author forces the floor and the contamination rule. A stranger has to be able to see why a claim holds, find its weakest joint, and stand on its strong parts on their own account, which is what the floor and the earned-grounding rule deliver: every claim traces to a floor, and a claim that leans on something contested carries that weakness forward in plain view. A capable generator gains nothing by flooding the claim layer, because the rules govern structure and leave content to the same check, and a claim only the cleverest agent can verify counts as one source rather than many.

The ingestion layer is the typing at the moment a claim enters, attributed to its source. The structure layer is the graph that resolves which claims support which and carves a question into its parts. The assessment layer is the gate and the grounding rule, which count agreement once independence is shown, flag evidence double counted, surface what the map is missing, and separate what a measurement settled from what a standoff performed as settled. The LHC case is this competition's own request to probe a confident argument for its dependencies and weakest points, answered directly: the engine grounds every surviving line to an observation and names, as first-class objects, the places support runs thin. The value lives in the copyable substrate, the records and their history, so honest participation is the cheapest path to standing, and the shared map belongs to everyone who reads it.

## Postscript: a live demonstration

During the competition window, in late June 2026, a new AI workbench for scientific research, Claude Science, was released: a working environment with artifact generation, a reviewer agent, session forking, and integrated tools and connectors. Under this architecture it is a component of the interface layer. Its generative and reviewing work is producer and consumer work that writes through the same gate and reads through the same interface, and the standing of what enters the map holds the same whether that work comes from a person, a general model, or a purpose-built science workbench. A capability the architecture was not designed around enters by adding an interface tool, and the trusted core does not move. This is the criterion that the system scales with new AI and new interfaces, shown by an event in the world rather than argued on paper: as the tools improve, the interface layer improves, and the discipline at the membrane is what stays fixed. The opening named the synthesis tools as that layer; a strong one arrived mid-competition and landed exactly there.

## Provenance

This work began on June 22, 2026, and was developed in close collaboration with AI systems used as generators and verifiers under human direction. The collaboration is disclosed here under the standard the method applies to every claim: state who did the work and how it was checked.

It finds the holes mechanically. A claim whose support reaches no floor, a dependency resting on a superseded source, a pattern with a branch left undrawn, a reference that dangles: the engine surfaces each as a first-class object through an open read, and run on the worked cases it reproduces exactly the holes a person had been tracking by hand.

It admits new work through a gate. Reading the graph is open to everyone. Adding to it passes one check: a contribution enters only when it holds together with what is already there, and two uncoordinated contributors' output composes by machine with no model in the loop. A reader can run this composition in about two minutes and watch the check rather than take it on faith.

It keeps what was ruled out. A refuted claim stays in the record with the reason it fell, so the work of refutation compounds and a dead claim meets its own obituary on any attempt to revive it.

Around this core sits a reading layer that consumes the same public interface many ways: a plain-language walk for a newcomer, a terse exact view for a specialist, an inspect-and-dependents console, a side-by-side view that sets two disputes together, and a control that flips an assumption and shows the conclusion give way. Every one of them reads through the interface and leaves the stored truth to the gate.

The engine runs on three cases chosen to differ in shape, which are the three shapes this competition names. On LHC safety, a confident answer over complex evidence, it runs the reasoning down to a measurement, and every surviving line closes against an actual astronomical observation. On COVID origins, a curated debate, it traces the disagreement to one statistical method pushed past the range it was built for, prices what each side assumes, and leaves the verdict to the reader. On eggs, mundane and contested, it splits one casual question into the several it contains, answers the parts evidence settles, and marks the part that is a values choice. The three cases share one earned structure, a claim carried down to where it terminates, and they fail at different points along it, which is the reusable result: the same machinery, three terminations, the divergence localized rather than repeated.

## 2. The theory that makes it correct

The engine's output is trustworthy because groundedness is a property of the graph that anyone can check and that yields the same answer for everyone. The theory is what makes that property well-defined.

Every claim sits at a position in one ordering, running from untyped at the bottom, through the tiers of a still-contested claim, to three floors at the top: proof, measurement, and declaration. The ordering measures a single quantity, how much a downstream claim may rely on this one. Two positions ride on each claim: the highest grounding its kind could ever reach, and the grounding it actually achieves given what it rests on. A claim is as settled as its kind allows exactly when the two meet, and the distance between them is the work that remains.

Grounding propagates by one rule. A claim supported by several necessary parts is as grounded as its weakest necessary part; a claim with several sufficient paths takes its strongest. Support that leans on a contested assumption carries the contested value forward, so a claim's advertised grounding stays at or below what its supports actually provide. This is the whole of correctness: the gate admits a contribution only when the grounding it declares is covered by the grounding it can show, so the graph holds nothing that claims more standing than it has earned. The floor is the sole anchor, and every claim above it inherits its trust by this rule from what it rests on.

The same rule carves a question into parts. A claim is typed by where it can terminate, and that type is the knife: the cuts a measurement or a model can answer route onward toward a floor, and the cuts a commitment answers are priced and left to judgment. This is what lets the engine give a firm answer where the world settles one and decline where a values choice is all that remains, in the same structure and by the same discipline.

One line runs through all of it: what supports what, who said it, and where a hole sits are checkable facts about structure, so they compound across people who agree on nothing else, while which argument is strongest and which hole matters most turn on judgment and stay with the reader. The engine is exact only where structure must be mechanical for grounding and composition to work, and the words and the judgments stay in plain language everywhere else.

## 3. Why the problem forces the theory

This competition asks for workflows that produce reliable, trustworthy knowledge bases that compound, where separate investigations build on each other and stand up to adversarial scrutiny. The gap it names is precise: the strong tools available today produce single-user artifacts, tuned to one investigator, that inform their author and stay put. Each of the three demands in that ask forces a piece of the theory.

Compounding forces the shared structure. For one investigation to build on another, both must land on the same map with the same coordinate system, which is exactly the typed graph and the fixed public interface every contributor writes to. A capable research run already sorts claims, names a crux, and catches two analyses leaning on one source; the piece it leaves undone is leaving anything behind, because each run invents its own organization and discards it. The shared, typed structure is what turns separate runs into accumulation.

Surviving adversarial scrutiny forces mechanical grounding. Cheap generation has made the usual marks of credibility, an authoritative tone, wide citation, a known name, forgeable for nothing, so the signal worth checking is whether a claim survived attack from sources that share no evidence. That check holds only when grounding is a property of structure an adversary cannot talk, pressure, or outvote into place, which is why grounding is computed and enforced at the gate rather than granted by standing. The same design gets stronger as scrutiny gets cheaper, because a standing adversarial process supplies the attacks and a claim earns its place by surviving them.

Trustworthy-without-trusting-the-author forces the floor and the contamination rule. A stranger has to be able to see why a claim holds, find its weakest joint, and stand on its strong parts on their own account, which is what the floor and the earned-grounding rule deliver: every claim traces to a floor, and a claim that leans on something contested carries that weakness forward in plain view. A capable generator gains nothing by flooding the claim layer, because the rules govern structure and leave content to the same check, and a claim only the cleverest agent can verify counts as one source rather than many.

The competition splits the work into ingestion, structure, and assessment, and the engine serves each with the discipline to keep them apart. Ingestion is the typing at the moment a claim enters attributed to its source. Structure is the graph that resolves which claims support which and carves a question into its parts. Assessment is the gate and the grounding rule, which count agreement once independence is shown, flag evidence double-counted, surface what the map is missing, and separate what a measurement settled from what a standoff performed as settled. The LHC case is this competition's own request to probe a confident argument for its dependencies and weakest points, answered directly: the engine grounds every surviving line to an observation and names, as first-class objects, the places support runs thin.

The value lives in the copyable substrate, the records and their history, so honest participation is the cheapest path to standing and the shared map belongs to everyone who reads it. That is the shape the problem forces: a shared typed structure so work compounds, grounding decided by structure so it survives attack, a floor and an earned-grounding rule so a stranger can trust a claim without trusting its author, and a substrate anyone can carry off so the commons stays open.

## Reading on from here

Two companion documents sit beside this argument. [Where Each Criterion Lives](criteria-to-architecture-map.md) maps the competition's evaluation criteria to the part of the architecture that answers each one and its location in the repository, so this argument can be checked against the tree. [Robustness Under Adversaries](adversarial-robustness.md) answers the one objection this argument invites, that a capable adversary games the gate or captures the write path, with the honest split between the recoverable half that runs today and the cost half specified in the open.

---

## Postscript: a dated note on scaling (late June 2026)

*A dated observation, added after the argument above, which stands on its own.*

In late June 2026, during the competition window, a new AI workbench for scientific research, Claude Science, was released: a working environment with artifact generation, a reviewer agent, session forking, and integrated tools and connectors. Under this architecture it is a periphery component. Its generative and reviewing work is producer and consumer work that writes through the same gate and reads through the same interface, and the kernel's guarantees hold unchanged whether that work comes from a person, a general model, or a purpose-built science workbench. A capability the architecture was not designed around enters by adding a periphery tool, and the trusted core does not move. This is the criterion that the system scales with new AI and new AI interfaces, shown by an event in the world rather than argued on paper: as the tools improve, the periphery improves, and the discipline at the membrane is what stays fixed.

---

## Provenance

This work began on June 22, 2026, and was developed in close collaboration with AI systems used as generators and verifiers under human direction. The collaboration is disclosed here under the same standard the method applies to every claim: state who did the work and how it was checked.
