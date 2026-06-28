# The Family, Tested: It Is a Pipeline, Not a Transformation

*The asserted-to-earned move, executed. Author the population-mismatch family across COVID and eggs against the revised schema, then run the discrimination: is there a real shared parent, or two failures wearing one sentence? The loose family dies. A more precise structure is earned in its place, and the tool that discriminates them is the decomposition we just specified. The case-specific COVID numbers still want the deferred verification; the structural result below does not.*

---

## The two clones, authored

**COVID, the selection variant.** A likelihood that reads the spatial clustering of early observed cases as evidence about the origin. Takes the observed case locations, produces a posterior over origin. Its precondition is that the observed cases are a faithful draw from the true case distribution. It breaks when surveillance is spatially concentrated. The mechanism: observed density is true density times a detection function over location, and the estimator assumes the detection function is flat, so it reads the shape of where people looked as signal about where it started. The draw is non-exchangeable. Inclusion in the sample is correlated with the very quantity being estimated.

**Eggs, the heterogeneity variant.** A sample mean that reads the average dietary response and uses it to predict an individual. Takes the population of responses, produces the mean, applies it to one person. Its precondition is that the response is homogeneous enough that the mean transfers to an individual. It breaks when responders are heterogeneous, hyper and hypo. The mechanism: the mean is a first moment and discards the variance the individual claim needs, so two populations with opposite internal structure share a mean. The draw is fine. The reduction is lossy.

Both reduce, in a sentence, to "the population the statistic assumes is not the population the conclusion needs." That sentence is what has to be tested.

---

## The discrimination

Lay the two mechanisms side by side and ask whether they are one thing.

COVID's failure is that the sample does not faithfully represent the population the conclusion is about. Eggs' failure is that the statistic, even on a faithful sample, does not carry the information the conclusion needs. These are not the same failure. They are failures of two different maps in the inference:

- COVID breaks the **sample-to-population** map. The draw is biased.
- Eggs breaks the **statistic-to-conclusion** map. The summary is insufficient.

The slogan "population mismatch" conflates a representativeness failure with a sufficiency failure. They rhyme, both are "what you measured is not what you need," but the mechanism differs and, more decisively, the *location* of the failure differs. They fail at different points in the chain.

---

## Verdict

**The loose family dies.** "A population statistic with two mechanism-variants" is not a real parent. It is one sentence stretched over two distinct failures, and stretching it would have been the unearned move the whole method exists to catch.

**A precise structure is earned, and it is better.** The honest shared object is not a transformation with variants. It is a decomposed pipeline:

```
sample  --(stage 1: representativeness)-->  statistic  --(stage 2: sufficiency)-->  conclusion about target
```

Any "a statistic supports a conclusion" inference factors into these two stages, and each stage has its own validity condition and its own named failure. COVID is a stage-1 failure: the sample does not represent the population. Eggs is a stage-2 failure: the statistic does not suffice for the conclusion. The cases do not instance one transformation failing two ways. They instance one pipeline failing at two different stages.

This is a stronger result than the conjecture, not a weaker one. The departure between COVID and eggs is no longer "different mechanism, same parent," which was the suspicious formulation. It is "a different node of the shared decomposition is the one that breaks." The departure is a *coordinate in the pipeline*, which is exactly the metric we said the leaves provide: the divergence is measured as which node in the shared basis fails, not asserted as a resemblance.

---

## What this does to the architecture

It validates the decomposition design by using it. The operation that discriminated the family is decompose. Open the "population mismatch" parent and it resolves into a two-stage pipeline; the two cases light up different stages. The "compare" motion between COVID and eggs is therefore not "here are two variants of one step." It is "here is the shared pipeline, and COVID's broken node is stage one while eggs' is stage two." The departure view renders as two instances of one decomposition with the red on different children. The tool we built to navigate the atlas is the tool that earns its entries.

This is also the concrete confirmation of S4 from the stress test, sharpened. S4 claimed the within-case scenario departure and the cross-case clone departure are the same machinery. They are, and now we can say what the machinery is: a departure is the location, in a shared decomposition, of the node that diverges, whether the divergence is a scenario (nature versus the LHC, on the frame boost) or a case (COVID versus eggs, on the inference pipeline). One mechanism: divergence localized to a node in a shared basis.

---

## What this does to the bounds

It corrects the submission's "leap" language. The current bound reads, in the overview, both the standalone summary and the in-artifact view, that "the departure shape seen twice, an aggregate transformation failing on a phenomenon that is not the homogeneous population it assumes, is a reusable pattern rather than a suggestive echo." That overclaims sameness. The two cases do not fail the same way. The accurate statement is narrower and more defensible:

> A shared inference pipeline, sample to statistic to conclusion, factors into a representativeness stage and a sufficiency stage. Two cases instance failures at the two different stages. The pipeline and its two failure sites are earned from these two; whether the factoring is a broadly reusable pattern is a conjecture wanting a third instance, one that fails at a stage already named, or at a new one.

That is the honest version, and it should replace the "shape seen twice" phrasing in both documents. It trades a claim of repetition, which the test just refuted, for a claim of shared structure with stage-localized failures, which the test just earned.

---

## What still needs the deferred verification

The structural discrimination above is conceptual and robust: selection bias and statistic insufficiency are distinct and well understood, and the assignment of COVID to the first and eggs to the second does not depend on any specific number. What does depend on the sources, and waits for the verification pass:

1. **Which COVID analysis, exactly, and whether selection is the dominant critique** of its clustering argument, or one of several. The pipeline placement is right; the specific instantiation should be checked against the actual analyses and their critiques.
2. **The eggs effect sizes and the strength of the heterogeneity**, the hyper- and hypo-responder split, against the nutrition literature, so the stage-2 failure is quantified rather than asserted.

Neither check can move the verdict. They sharpen the two instances; they do not decide whether the family is a pipeline.

---

## Net

The move came out the way the method is supposed to make it come out. A clean kill of the loose family, and a more precise structure earned: a shared two-stage pipeline with stage-localized failures, COVID at stage one, eggs at stage two, the departure measured as the broken node's coordinate in the shared basis. The decomposition architecture is what discriminated them, which means the tool and the claim it tests are the same machinery. And the submission's bounds get more honest as a result, trading a refuted claim of repetition for an earned claim of shared structure.

The next instance is the lever. A third case that fails at stage one or stage two tightens the pattern from earned-structure toward reusable-law; a case that fails at a stage the pipeline does not name would extend it. Either is the same asserted-to-earned move, run once more, and the architecture is now built to show it.
