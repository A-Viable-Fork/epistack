---
Type: record
Purpose: "Records the population-mismatch pipeline demonstration, the record the trellis translator derives from."
Depends on: [docs/architecture-spec.md, docs/family-discrimination.md]
Depended on by: [docs/trellis-to-v3.md]
---

# Population Pipeline, v0: The Family as a DAG

> **Disambiguation (Prompt 24, Option B).** This pipeline is a **population-mismatch pattern demonstration**, kept by design as a distinct structural demo: one shared machinery whose failure localizes at different stages (`covid.instance` breaks at stage 1, `eggs.instance` at stage 2). It is **not** the canonical covid or eggs case. The canonical covid case is the densified origins store `corpora/covid/covid-origins.js` (Prompt 23a); the canonical eggs case is the domain stores and composite in `corpora/eggs/` (Prompt 20). The pipeline is retained because it is load-bearing for shipped demonstrations (the trellis-to-v3 migration reproduction, the fork demo, the atlas compare, the gap-detector and robustness readings) and because the pattern is worth showing in its own right; the two representations coexist by decision, not by accident.

*The family-discrimination verdict, authored as the actual data the atlas stores and the UI renders. Revised schema throughout. This is the COVID-and-eggs half of the v0 test the stress test flagged; authoring it against the schema is what confirms S4 and turns the verdict from prose into structure. Case-specific numbers are flagged as deferred; the structure does not wait on them.*

---

## The shared decomposition (the atlas parent)

```
pipe.root  (transformation)
  role        : a statistic computed from a sample supports a conclusion about a target
  composition : sequence
  children    : [pipe.stage1, pipe.stage2]
  function    : derive
  load_bearing : the inference is only as good as its weakest stage; the two stages
                 fail independently and for different reasons
  atlas_id    : atlas.statistic-supports-conclusion
```

```
pipe.stage1  (transformation)   // REPRESENTATIVENESS
  role        : map an observed sample to an estimate of the population it is drawn from
  takes       : [sample {x_i}]
  produces    : [population estimate]
  preserves   : [the statistic's internal validity, given a faithful draw]
  function    : derive
  breaks      : inclusion in the sample is correlated with the variable of interest
  why_breaks  : observed density equals true density times a detection function over the
                variable; if detection is not flat, the statistic reads the shape of the
                detection function as signal about the truth; the draw is non-exchangeable
  composition : sequence
  children    : [prim.estimator, prim.exchangeability]
  math        : observed(x) = true(x) * detect(x);  the step assumes detect(x) = const
  formal_status : nl
```

```
pipe.stage2  (transformation)   // SUFFICIENCY
  role        : map a population statistic to a conclusion about the target
  takes       : [statistic]
  produces    : [conclusion about target]
  preserves   : [whatever the statistic does retain]
  function    : derive
  breaks      : the conclusion needs information the statistic discards
  why_breaks  : the statistic is a lossy summary; a first moment discards the variance and
                higher structure the target-level conclusion requires, so two populations
                with opposite internal structure share the statistic and the conclusion
                cannot resolve between them
  composition : sequence
  children    : [prim.estimator, prim.sufficiency]
  math        : conclusion needs F(distribution); statistic carries only E[.]; F not recoverable from E
  formal_status : nl
```

The parent is a sequence of two stages. Each stage is a `derive` with a precondition, and the precondition is exactly where one of the cases breaks. The two stages fail independently, which is the whole content of the verdict: this is not one transformation with variants, it is a two-step pipeline with a named failure at each step.

---

## The floor (basis nodes, cite the proof)

```
prim.estimator       role: compute a summary statistic from a sample.   cite: standard estimation theory
prim.exchangeability  role: the condition that sample inclusion is independent of the estimand.
                      cite: exchangeability / selection-bias, standard
prim.sufficiency      role: the relation between a statistic and the information it retains
                      about a parameter.   cite: sufficiency / Fisher-Neyman, standard
```

These three are the coordinate basis the two cases are measured against. `prim.estimator` is shared by both stages (one node, two parents), which is the DAG sharing that makes the basis a basis.

---

## The two instances

Each case instantiates `pipe.root` and breaks at a different child. The departure is the coordinate of the broken node, not a description of a mechanism.

```
covid.instance
  instantiates : pipe.root          (atlas_ref -> atlas.statistic-supports-conclusion)
  case         : COVID origin
  binds        : sample = observed early cases; statistic = spatial clustering;
                 conclusion = origin location
  broken_node  : pipe.stage1        // representativeness
  departure    : stage-1 failure; the observed-case sample is biased by spatially
                 concentrated surveillance, so inclusion correlates with location,
                 the quantity being estimated
  closure      : REFUSED at the irreducible-prior terminal. The stage-1 failure is the
                 reason: with the draw non-exchangeable, the clustering statistic cannot
                 discriminate origin from surveillance pattern, so the inference does not
                 close on the data; it returns a priced prior, not a measurement.
  TODO_verify  : which specific analysis, and whether selection is the dominant critique
                 of its clustering argument or one of several
```

```
eggs.instance
  instantiates : pipe.root          (atlas_ref -> atlas.statistic-supports-conclusion)
  case         : eggs, individual dietary response
  binds        : sample = study responses; statistic = mean response;
                 conclusion = an individual's response
  broken_node  : pipe.stage2        // sufficiency
  departure    : stage-2 failure; responders are heterogeneous, and the mean discards the
                 within-population variance the individual conclusion needs
  closure      : SPLIT. Stage 1 holds, so the population-level statistic is sound and the
                 population-level claim closes on a measurement. Stage 2 fails, so the
                 individual-level claim does not follow from it. The case resolves to a
                 sound population claim and an unsupported individual claim, which is the
                 question-set / constitutive typing, not a single verdict.
  TODO_verify  : the effect sizes and the strength of the hyper/hypo-responder split,
                 against the nutrition literature
```

The closures differ in a way that matters and that the typing already carried: COVID is refused because its broken stage sits upstream, killing discrimination at the source, so the whole inference returns a prior. Eggs is split because its broken stage sits downstream of a sound statistic, so the population claim survives and only the individual claim falls. Same pipeline, failure at different depths, different downstream consequence.

---

## The closure nodes, per the S6 split

For eggs, concretely, the closure is three nodes, not one:

```
eggs.prediction   value: the mean response, m            produced_by: pipe.stage2 input
eggs.observation  world_value: the measured population mean   immutable: true
eggs.comparison   test: does m, applied to an individual, hold?   state: contradicted-for-individual
```

The population observation is real and fixed. The comparison is what fails, and it fails specifically at the individual-application, which is stage 2. Perturbing the homogeneity assumption (flip it to "homogeneous") would set `eggs.comparison` to consistent, which is the counterfactual that makes the individual claim follow, and shows exactly which assumption the individual claim is hostage to.

---

## How compare renders this

Invoke compare from either instance and the view is one pipeline, `pipe.root`, with both instances overlaid and the red on different children: COVID's stage-1 lit, eggs' stage-2 lit. That single image is the earned result. The reader sees the shared structure, sees that the two cases are not the same failure, and sees the departure as a position in the shared decomposition rather than as a claim of resemblance. The distance between the two cases is literally the distance between the two broken nodes in the basis. The metric is on the screen.

---

## What the authoring confirmed

The revised schema holds on this side too. Every node took its fields. The two additions earned their place immediately: `composition: sequence` is what lets the pipeline be a pipeline rather than a flat list, and the S6 prediction/observation/comparison split is what lets the eggs closure be "population sound, individual unsupported" rather than a single muddied verdict. S4 is confirmed in the direction the stress test predicted: the COVID-eggs departure and the LHC nature-versus-machine departure are the same machinery, a broken node's coordinate in a shared basis, the only difference being whether the basis is an inference pipeline or a physics cascade.

The one honest gap is unchanged and small: the two TODO_verify items are case-specific numbers, deferred by choice, and neither can move the structure. The pipeline is authored, the instances are placed, the departures are coordinates. v0 for the family is done.
