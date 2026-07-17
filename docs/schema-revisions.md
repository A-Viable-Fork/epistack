---
Type: record
Purpose: "Records the schema revisions the cases forced, the data-model record that overrides the spec where the two disagree."
Depends on: [docs/architecture-spec.md, docs/lhc-cascade.md]
Depended on by: [CLAUDE.md, docs/architecture-spec.md, docs/family-discrimination.md]
---

# Schema Stress Test: Branch 2, and the Revisions It Forces

*The v0 test, run on the stopping branch of the LHC cascade. Author every node against the schema, see where it bends. It survived, but it bent in six places, each forced by a real feature of the argument rather than an invented edge case. One of them corrects the central backbone of the spec.*

---

## What the branch is

Branch 2 decides whether a produced black hole halts inside a body. Its internal structure: compute the black hole's velocity (N2.1), compute its stopping length in matter (N2.2), compare that length to the body's radius (N2.3). It rests on two assumptions, that the object is stable and dangerous (the hypothesis under test) and that it is neutral (the case that needs dense objects). I authored all of it. The strains are below, in the order the nodes forced them.

---

## The strains

### S1. Decomposition children are inference-connected, which breaks "three orthogonal graphs"

N2.3, the stopping condition, is *made of* N2.1 and N2.2: to decide if it stops, compute the velocity, then the stopping length, then compare to the radius. So N2.1 and N2.2 are N2.3's decomposition children. But they are also inference-chained: velocity feeds stopping length feeds the comparison. Decomposing N2.3 reveals an inference sub-graph.

This is the correction. The spec claimed decomposition and inference are orthogonal graphs over the same nodes. They are not. Decomposing a sequential step *is* zooming into nested inference. The truer picture: there is one inference relation, partly nested, and decompose is the zoom operation on it. The only genuinely orthogonal structure is instantiation, the atlas. So it is not three coequal graphs. It is one nested inference graph that you zoom with decompose, plus the atlas sideways.

The user-facing three motions survive unchanged, down and along and sideways. What changes is the data model: do not store inference edges and decomposition edges as two independent sets, because for a sequential step the children already imply the inference edges among them. Store the children and the composition type; derive the intra-level inference from sequential order. Two edge sets that must agree is a consistency bug waiting to happen; one set with a composition type is not.

### S2. Children compose in different ways, and the way matters

Decomposition does not always reveal an inference chain. The antecedent of the whole argument is production AND stopping AND accretion, three parallel conjuncts not in a chain. N2.2's interior splits by charge into two alternative sub-steps. N2.3's interior is a sequence. So decomposition reveals a composition with a type: sequence, conjunction, or disjunction. The flat `children` list does not say which, and perturbation and rendering both need it. A sequence propagates output to input; a conjunction fails if any child fails; a disjunction routes by a condition.

Fix: every decomposable node carries `composition: sequence | conjunction | disjunction`. For a disjunction, it also carries the assumption it splits on.

### S3. Conditional children, gated on an assumption

N2.2, stopping length, has two children: Bethe-Bloch for a charged object, geometric capture for a neutral one. Which child applies depends on the charge assumption. The DAG has edges that are live only under a condition. This is the disjunction case of S2, and it means decomposition is not a fixed tree even in structure: opening N2.2 shows one sub-step or the other depending on the active assumption state. The card has to render "under the neutral assumption, this decomposes to geometric capture" and show the other branch as the counterfactual alternative.

Fix: disjunction children carry a `guard: assumption_id = value`. The decompose view shows the live branch and offers the guarded alternative.

### S4. One transformation, several scenario-instances, inside a single case

N2.1, the velocity, produces a *fast* black hole for the cosmic-ray scenario and a *slow* one for the LHC scenario. Same transformation, the frame boost, applied to two scenarios, with opposite outputs, and the contrast between those outputs is the entire crux of the case. The schema's instantiation structure was cross-case (the COVID clone and the eggs clone of one family). Here the two instances are inside one case, distinguished by scenario, nature versus the machine.

So instantiation is not only cross-case. A transformation can be applied multiple times in one cascade under different scenarios, and the departure between those applications can itself be load-bearing. The frame boost applied to nature gives fast-and-escapes; applied to the LHC gives slow-and-stays; that departure is why the naive argument fails. The same machinery that compares the COVID and eggs clones should compare the nature and LHC applications of the boost.

Fix: an instance carries a `scenario` tag, and the compare motion works over scenario-instances within a case as well as clone-instances across cases. The departure field is the same field in both.

### S5. Some nodes do not break; they remove a dependency

N1.3, the cross-section cancellation, has no honest `breaks` field. Its role is the opposite of breaking: it establishes robustness by making the production cross-section divide out, so the bound holds without knowing it. The schema is break-centric, every node asked for the condition under which it fails. A robustness node fails that prompt. The interesting field for it is not "why it breaks" but "what it removes and why that is safe."

Fix: a node facet, `function: derive | constrain | cancel`. A `cancel` node replaces the break block with a "removes dependency on X; valid because Y" block. The featured field generalizes from why-it-breaks to "the load-bearing thing about this node," which is the break for most and the cancellation for a few.

### S6. The closure is three nodes, not one

The spec treated the observation as the single closure target. Authoring it, the closure is three distinct things: the *prediction* the cascade produces (t_destroy), the *observation* from the world (the neutron star's age, the body extant), and the *comparison* that tests one against the other (t_destroy < tau, so it should be gone). Perturbation changes the prediction; the observation is fixed by the world; the comparison is what flips to contradicted. Collapsing them hides where the perturbation acts and why the red appears on the comparison rather than on the world-fact.

Fix: model the closure as prediction node, observation node, comparison node. Perturbation propagates into the prediction; the comparison renders consistent or contradicted by re-evaluating prediction against observation; the observation never changes, because the world does not.

---

## The corrected backbone

One nested inference graph, plus the atlas.

- **Inference** is the relation: input supports output, terminating at a comparison against an observation. It is nested: a step's interior is itself inference when the step is a sequence.
- **Decompose** is the zoom on that nesting. Opening a transformation reveals its internal composition, which is inference when sequential, a conjunction when parallel, a guarded choice when a case-split.
- **Perturb** propagates along inference at whatever zoom level, into prediction nodes, flipping comparisons.
- **Instantiation** is the one orthogonal structure: the same transformation applied in other scenarios and other cases, with departures. Compare walks it.

Three motions for the user, unchanged. Two structures underneath, not three: nested inference, and the atlas.

---

## Revised schema, the deltas

```
Node {
  ...all prior fields...

  // S2, S3: how the interior composes
  composition   : sequence | conjunction | disjunction | none   // none for primitives
  guard         : { assumption_id, value }?      // disjunction children only

  // S5: not every node breaks
  function      : derive | constrain | cancel
  load_bearing  : string    // the featured field: why_breaks for derive/constrain,
                            // "what it cancels and why that is safe" for cancel
  // breaks / why_breaks remain, used when function is derive or constrain

  // S4: instances are tagged by scenario as well as case
  scenario      : string?    // "nature" vs "LHC", within a case
}

// S6: the closure splits
PredictionNode  { kind: prediction;  value; produced_by: node_id }     // cascade output
ObservationNode { kind: observation; world_value; immutable: true }    // the world; never perturbed
ComparisonNode  { kind: comparison;  test: "prediction REL observation"; state: consistent | contradicted }

// S1: do not store inference edges inside a sequential decomposition; derive them
//     from `children` order + `composition = sequence`. Store explicit inputs/outputs
//     only across decomposition boundaries, where order does not imply them.
```

And the atlas entry gains nothing new except that its `clones` list now admits two flavors of member, cross-case clones and within-case scenario-instances, distinguished by whether `case` differs or `scenario` differs. The departure field carries both.

---

## Net

The design survives the test. None of the six is a kill; all six are refinements, and they make the model more correct rather than patching around it.

The one that matters most is S1, because it corrects the spec's framing: decompose and perturb are not motions over two independent graphs, they are zoom and flow over one nested inference graph, and the atlas is the only orthogonal axis. That simplifies the data model, it removes a class of consistency bug, and it is truer to what the LHC argument actually is.

The schema to author v0 against is the revised one above. The next real test is the same exercise on the COVID and eggs branches, because S4's claim, that the within-case scenario departure and the cross-case clone departure are the same machinery, is exactly what the population-mismatch family will confirm or break. That is the test that decides whether the family is one mechanism or two, which is the asserted-to-earned move the whole atlas turns on.
