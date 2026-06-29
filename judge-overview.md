# How to Read This Submission

This submission is a way to record knowledge so that separate investigations add up instead of starting over. Every claim it stores carries three things a plain citation hides: what kind of claim it is, whether it has been checked, and who checked it.

## The one new thing

A capable AI research run already does a lot on its own. It can sort claims by type, name the point a disagreement really turns on, and notice when two analyses that look independent are leaning on the same source. That is the bar to beat, and a tool that only repeated it would add nothing. The thing a single run cannot do is leave anything behind for the next one. Each run invents its own way of organizing a question and discards it when it finishes, so two runs never combine. This submission supplies the shared structure that lets separate runs land on one map and build on each other. A short program then composes two such runs mechanically, with no AI in the loop, and does work across them that neither could do alone.

## One store, many ways to use it

What the map stores is held separate from how anyone uses it. There is one shared store of knowledge, and a fixed public way to read it and to add to it. Reading is open. Adding is not a free write: a new claim has to pass the same check as every other, so the store cannot be quietly edited, only added to under the rules. Everything else, every way of reading and working the map, is a program built on that public interface. A plain reader with pictures for a newcomer, a terse exact view for a specialist, a research console, someone else's app you have never seen, all of them just use the store, and none can reach in and change it. So the work adds up two ways: investigations accrete onto one store, and the ways of using it multiply and improve, while what is true stays one and protected.

## Why it matters now

More claims are produced than anyone can check, and cheap generation has made the usual signs of credibility easy to fake. A claim that sounds authoritative, is widely cited, or comes from a known name can now be mass-produced for nothing. So the signal worth checking is not who made a claim or how confident it sounds. It is whether the claim survived attack from sources that do not share their evidence, which is the one thing cheap generation cannot manufacture.

## What to read, in order

The reading budget is short, so this is the order that spends it best.

1. **Run the demo.** `python compose_gate.py` composes two independent investigations and shows the mechanical check in about two minutes. That check working across separate contributors is the heart of the submission, and because it is mechanical you can watch it rather than take it on trust.
2. **Read the paper, start to finish.** It makes the whole case: the kinds of answer a question can settle into, the loop that builds the map, the check, and why a defense aimed at the claim rather than its author is the one that lasts.
3. **Skim the spec** for the method in operable detail and how it scales to many contributors.
4. **Optional.** Open the interactive piece. Enter at a plain question, walk one case down to the bedrock it rests on, and reach the view that sets two unrelated disputes side by side and shows them breaking in the same structure at different points. The system summary gives the architecture in condensed form.

## The three cases

They were chosen to differ in shape, and they match the three shapes the competition names.

- **LHC safety**, a confident answer with complex evidence. The method runs the reasoning down to a measurement, and every surviving line of argument closes against an actual astronomical observation.
- **COVID origins**, a curated debate. The method traces it to one statistical method pushed outside the range it was built for, prices what each side is assuming, and refuses to declare a winner.
- **Eggs**, mundane but contested. The method splits one casual question into four, answers the parts evidence can settle, and declines the part that is a values choice.

## Why it holds up, and improves with scale

Two properties matter most for a judge weighing whether this lasts. It gets stronger the more it is attacked: a standing adversary generates challenges, a claim earns its standing only by surviving them, so more scrutiny means a more trustworthy map, and scrutiny is exactly what gets cheaper as models improve. And a more capable generator cannot take it over: it can produce more claims, but it cannot change the rules those claims must pass, and a claim only the cleverest agent can verify counts as one source rather than many, so it never gets promoted on brilliance alone. And use is sealed off from substance: anyone can build a new way to read or work the map, but a client can only read what the store holds and add through the same gated check, never reach in and rewrite a claim, so any number of new uses can be built and none can corrupt the knowledge.

## What is shown, and what is not

A short honest summary; the full grade, item by item, is in `docs/status-ledger.md`. Shown and working: the typing and the check on three cases of different shape, the composition running as code across two independent investigations, and the teaching and compare views. Not yet there: the library of reusable steps is named, not stored; the claim that a pattern seen twice is reusable wants a third case; the store-and-interface separation is built at the boundary with the full client layer in progress; and the demonstration is a seed, not the commons. The ledger grades each and names what would close it.
