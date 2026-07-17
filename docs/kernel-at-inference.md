---
Type: reference
Purpose: "The depth under the atlas capstone's inference-time grade: retrieval-grounded generation where retrieval returns graded, grounded claims through the read terminus and the model defers to the grade the graph computed. The runnable, buildable-today pattern, with each stage marked by its build register and the domain-scope bound held throughout."
Depends on: [docs/workflow-atlas.md, docs/api.md, docs/clients.md]
Depended on by: []
---

# Consumer Capstone: The Kernel at Inference

*The depth under the atlas capstone's inference-time grade: a model that reads grounding live and defers to it. Buildable today.*

The atlas capstone names this in brief: retrieval-grounded generation where retrieval returns graded claims through `read` rather than raw text, and the model asserts a claim only at the strength the graph grounds it. This document is the full pattern under that sentence. It is the solid grade of the capstone, runnable now with off-the-shelf tooling over the built read terminus, and it reads that way: confident and concrete, with the boundary between built and example named at every stage.

## The move

Ordinary retrieval returns text passages, and the model trusts them. It reads a paragraph, takes it on faith, and folds it into an answer that carries whatever confidence the model's own priors and the passage's fluency together produce. Nothing in the passage tells the model how much to rely on it.

Retrieval over the kernel returns graded, grounded claims. A claim read back through `read` carries its statement, its kind, its declared grade, its derived-earned grade, and its support path. The model's context is structure with its standing attached, not prose it must judge for itself. The model is instructed to assert a claim only at the strength the graph grounds it, to surface the load-bearing support the way the evidence-finder workflow does (`docs/workflow-consumer-evidence.md`), and to defer or hedge where the graph floors out or a gap is open. The graph did the attenuation; the model reads the result and respects it.

## The pipeline

1. **A query arrives.** The consumer's question enters the pattern. Register: example, current tooling.

2. **Retrieval selects relevant claims.** An embedding index over claim statements returns the claims relevant to the query. This is off-the-shelf: a standard retrieval index this submission does not build or vendor, named honestly. Register: example, current tooling.

3. **`read` returns the claims with grade and support.** Each selected claim comes back with its declared and derived-earned grade and its support path. Optionally, `robustness` enriches the context with each claim's fragility, its single points of failure, and the correlated-evidence flag, and `gaps` surfaces claims in force whose earned grade does not cover their declared grade, so the model sees where the graph is thin before it answers. Register: built.

4. **The model generates, constrained to the grounding.** A frontier model produces the answer, instructed to cite the support path, to carry the grades through into its expressed confidence, and to defer where the graph floors out. The model is off-the-shelf; the discipline is the instruction it carries. Register: example, current tooling, resting on the built reads above.

The retrieval and the model are the example part. The `read`, `robustness`, and `gaps` calls are built, graded in `docs/status-ledger.md`. The pattern is a consumer-side periphery a reader assembles over the built read terminus.

## Why it is more than ordinary RAG

The retrieved unit already carries its own reliability. In ordinary RAG the model is asked, implicitly, to judge how much to trust a passage, and it has only the passage's surface to go on, exactly the surface that cheap generation has made an unreliable signal. Here the model is not asked to judge trustworthiness at all. It is asked to respect a grade computed for the claim by a rule anyone recomputes and everyone recomputes alike. The graph did the attenuation, turning down reliance on whoever produced the claim until what remains is what the structure supports, and the model inherits that result rather than reconstructing it. A claim that floors out in the graph floors out in the answer, because the model was handed the floor and told to honor it.

## The honest bound

This disciplines the model on questions the kernel covers, and says nothing about the rest of what the model knows. On a question inside the covered domain, the model's standing is the kernel's standing: it defers to the graded grounding over its own priors. Off the covered domain the pattern is silent, because retrieval returns nothing to defer to and the model answers from its priors as it always would. The claim is scoped and stays scoped: within the covered domain the model respects graded grounding, and the kernel is not the model's knowledge and the model does not only know what the kernel holds. A model knows vastly more than any kernel holds, and the pattern touches only the slice the kernel covers.

## The failure modes

Three, named plainly.

Retrieval can miss relevant claims. That is a coverage failure, not a grounding failure: the claims the model did retrieve are still correctly graded, but the answer rests on a subset of what the graph holds, and a missed claim is a claim the model never had the chance to defer to. Better retrieval narrows this; nothing in the read terminus fixes it, because the terminus grades what it is asked for and does not decide what to ask.

The model can still generate ungrounded text between cited claims. The discipline is a constraint the instruction imposes on the model, not a guarantee the kernel enforces on the output. The kernel grades what is read; it does not police what the model writes around the reading. So a model can cite grounded claims and still connect them with an unsupported sentence, and catching that is the consumer's job, not the terminus's.

The answer is only as current as the kernel's grades. A claim's standing is what the graph computes now, and if the graph is stale the answer inherits the staleness. The grade is honest about the structure it reads; it cannot be more current than the corpus it reads from.

None of these is hidden by the pattern, and the first two are exactly why this is periphery a market improves rather than a guarantee the kernel makes.
