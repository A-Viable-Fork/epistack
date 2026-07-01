# For the Judges

Three claims, in order. Here is a working engine. Here is the theory that makes its output correct. Here is why the problem this competition poses forces that theory. The reading budget is short, so each section spends it on one of the three.

The build state of every component named here is graded, component by component, in `docs/status-ledger.md`. This document states what the engine is, why it is sound, and why it takes this shape; the ledger states how far each part is built. Keeping the two apart is what lets this document stay fixed while the build advances.

---

## 1. A working engine

The engine records knowledge as a typed graph of claims and the support between them, and it does four things to that graph that a plain citation trail leaves undone.

It grounds each claim to a floor. A claim bottoms out in one of three places: a measurement or proof, a binding declaration, or, for a contested claim, a faithful structure of the argument around it. The engine holds which floor a claim reaches and how far its support actually descends toward that floor.

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

---

## Provenance

This work began on June 22, 2026, and was developed in close collaboration with AI systems used as generators and verifiers under human direction. The collaboration is disclosed here under the same standard the method applies to every claim: state who did the work and how it was checked.
