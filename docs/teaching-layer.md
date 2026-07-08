---
Type: specification
Purpose: Specifies the learning-first card layer over the architecture spec.
Depends on: docs/architecture-spec.md
Depended on by: nothing
---

# Making the Nodes Teach (v2 direction)

*v1 implements the spec faithfully, and the spec wrote every node in one register: the terse functional spec. That register is correct for navigation, audit, and the composition machinery, and wrong for the stated goal, which is making the math accessible to anyone. The fix is a teaching layer that ladders a non-expert up to the precise claim, not a softening of the precise claim. Precision stays; it becomes the destination of every ladder and the inspect-layer of every card. The accessibility goal and the substrate goal become the same goal.*

---

## The diagnosis

A node carries two registers today: the terse functional spec (`role`, `breaks`, `why_breaks`, `math`) and the formal math. Both are audit-grade. Neither teaches. "The draw is non-exchangeable" is a correct thing to *arrive at* and a terrible thing to *open with*. The card renders the anatomy of a typed node; a learner wants the story that ends at the anatomy.

So the node needs a third register, authored alongside the other two: a teaching layer. It is the on-ramp. It ends by handing over the exact statement, which keeps it honest. This is the generation-to-verification discipline pointed at the reader: intuition first, the exact typed claim last, both visible, which is which marked.

---

## Fix 1: the schema gains a teaching layer

Add an `explain` block to every transformation and assumption node. The existing terse fields remain as the inspect layer.

```
explain: {
  hook:      string,    // the relatable question this step answers, learner-facing
  intuition: string,    // 1-3 plain sentences; an everyday analogy is welcome
  in_words:  string,    // the equation read aloud as a sentence
  symbols:   [ { sym, plain } ],   // every symbol glossed in ordinary words
  scenario:  string,    // the break as a concrete story, not a mechanism
  stakes:    string,    // what conclusion rides on this step holding
}
```

And `math` gains a typeset form so it can be rendered properly rather than as code:

```
math: {
  tex:    "\\text{observed}(x) = \\text{true}(x)\\,\\cdot\\,\\text{detect}(x)",
  plain:  "observed(x) = true(x) * detect(x)",   // fallback
}
```

The terse `role` and formal `why_breaks` stay exactly as they are. They are the inspect layer, reached on demand. Nothing precise is lost; it is relocated one tap deeper.

---

## The worked node, before and after

**Before (v1, the only register).**

```
label:      "Representativeness"
role:       "map an observed sample to an estimate of the population it is drawn from"
breaks:     "inclusion in the sample is correlated with the variable of interest"
why_breaks: "observed density equals true density times a detection function over the
             variable; if detection is not flat, the statistic reads the shape of the
             detection function as signal about the truth; the draw is non-exchangeable"
math:       "observed(x) = true(x) * detect(x); the step assumes detect(x) = const"
```

**After (v2, teaching layer added; inspect layer retained).**

```
label:   "Representativeness"
explain: {
  hook: "Can you trust your sample?",
  intuition: "Before where the cases are can tell you where something started, you have
              to trust that the cases you counted are a fair sample of all the cases. If
              you looked harder in some places than others, your map shows where you
              looked, not where things are.",
  in_words: "The cases you see at a place equals the cases really there, times how hard
             you looked there.",
  symbols: [
    { sym: "observed(x)", plain: "how many cases you counted at place x" },
    { sym: "true(x)",     plain: "how many cases are really at place x" },
    { sym: "detect(x)",   plain: "how thoroughly you searched place x" },
  ],
  scenario: "Suppose early testing happened mostly around one market. You find a cluster
             of cases there, not because it started there, but because that is where you
             looked. The cluster is a picture of your searchlight, not the source.",
  stakes: "Every conclusion that reads meaning from where the cases are, origin, spread,
           hotspot, depends on this step holding. If it fails, those conclusions are
           reading the searchlight.",
}
math: {
  tex:   "\\text{observed}(x) = \\text{true}(x)\\,\\cdot\\,\\text{detect}(x)",
  plain: "observed(x) = true(x) * detect(x)",
  assumes: "detect(x) is the same everywhere",
}
// inspect layer, unchanged:
role:       "map an observed sample to an estimate of the population it is drawn from"
breaks:     "inclusion in the sample is correlated with the variable of interest"
why_breaks: "the draw is non-exchangeable; inclusion is correlated with the variable being
             estimated, so the maximum-likelihood location reflects detect(x), not true(x)"
```

The reader meets the question, gets the intuition, sees the equation read as a sentence with every symbol named, understands the break as a story, and only then, if they want it, reaches "non-exchangeable." They arrive at the precise claim instead of being struck by it.

---

## Fix 2: the card is learning-first

Reorder the card so the teaching layer leads and the inspect layer is progressive disclosure.

1. **The hook**, large. The relatable question.
2. **Intuition**, plain prose.
3. **The math, communicated** (see Fix 3): the typeset equation, read as a sentence, symbols glossed.
4. **The break, as a scenario**, featured. The concrete story, not the mechanism.
5. **The stakes**, one line.
6. **See the precise version**, a disclosure that reveals the inspect layer: the terse `role`, the formal `why_breaks`, the type signature. This is where the auditor and the composition machinery read.
7. **The motions.** Decompose ("what is this made of") continues the lesson; compare and perturb as before.

The schema-anatomy card v1 built is exactly the right thing behind step 6. It was wrong only as the default.

---

## Fix 3: communicate the math, do not just display it

The current math is one line of code font. To make an equation legible to anyone:

- **Typeset it.** Render the `tex` with KaTeX, not code font. A real equation reads as a real equation. This alone is a large step.
- **Gloss every symbol.** The `symbols` list renders as a small legend under the equation, or on tap of each term. No symbol appears unexplained.
- **Read it as a sentence.** `in_words` always shows beside the equation. The sentence and the symbols together mean a reader never has to already know the notation.
- **Show the assumption inline.** `math.assumes` renders as a visible condition on the equation, since the assumption is usually where the break lives.
- **A small visual where the equation supports one.** The detection-function step is highly visualizable: a true distribution, a detection overlay, and their product as the observed. One static figure or a tiny interactive makes "the statistic reads the searchlight as signal" instant. Not every node needs this; the ones that carry a distribution or a comparison earn it most.

Progressive depth throughout: intuition, then the unpacked equation, then the formal type. A learner stops where they are satisfied; a specialist keeps going.

---

## Fix 4: enter at the concrete question, reveal the structure

v1 opens at `pipe.root`, "Statistic supports a conclusion." That is the abstract shared pattern, and it is the payoff, not the entry. A learner is hooked by the concrete contested question, not the abstraction over it.

- **Enter at the case.** "Why do people keep arguing about whether eggs are bad for you?" or "Why is the origin of COVID still contested?" The typed structure then emerges as the *explanation of why the question is hard*. Decomposition becomes the act of understanding: take the reasoning apart until you reach things you already trust.
- **The abstract pipeline is the reveal.** After the reader has seen both cases taken apart, show the surprising part: these two unrelated arguments break in the same machine, at different stages. That is the compounding claim made felt rather than asserted, and it lands because the reader earned it by walking both cases first.

This reframes the artifact's job for the user. Not "navigate a typed graph," which is the auditor's framing, but "understand why a hard question is hard by taking its reasoning apart until you hit something you already trust." Same object, same typed substrate underneath. The graph is the scaffold for the understanding, not the thing shown first.

---

## What this costs, and the order to do it in

The teaching layer is authored, not generated from the terse fields. It is real writing, per node, and it is the bulk of the accessibility work. So do not scale it across every case at once.

1. Author the `explain` layer and the typeset `math` for the population pipeline only, every node, end to end. One case, fully accessible.
2. Rebuild the card learning-first (Fix 2) and the math rendering (Fix 3) against that one case.
3. Reorder the entry to the concrete question with the pipeline as reveal (Fix 4).
4. Review whether a person with no statistics background can walk it and come out understanding why the egg argument never ends. That walk is the real acceptance test, not the linter.

Only after one case passes that walk is it worth authoring the teaching layer for the LHC cascade. The accessibility claim is proven on one case the way the family claim was: earned on one, then extended.
