// Role: the population-mismatch case-family, authored as data (docs/population-pipeline.md).
//   A self-contained data module the engine loads (T0-4): the shared two-stage pipeline,
//   its floor (shared primitives), and the two instances (COVID, eggs) that fail at
//   different stages. Fully authored except the two flagged case-specific verifications.
// Contract: exports a case object { id, title, atlas_refs, nodes, instances } whose nodes
//   conform to data/schema.js and whose children/atlas refs resolve against
//   data/primitives + data/atlas.
// Invariant: pure data. Adding this case edited no engine and no other case. The departure
//   between the two instances is the coordinate of the broken node, not a resemblance.
"use strict";

const CASE = {
  id: "population-pipeline",
  title: "Population mismatch: one pipeline, two stage-localized failures",
  atlas_refs: ["atlas.statistic-supports-conclusion"],

  nodes: {
    // -- the shared decomposition (the atlas parent) --
    "pipe.root": {
      id: "pipe.root",
      kind: "transformation",
      label: "Statistic supports a conclusion",
      role: "a statistic computed from a sample supports a conclusion about a target",
      position: "step",
      takes: ["sample {x_i}"],
      produces: ["conclusion about target"],
      preserves: ["the inference is no stronger than its weakest stage"],
      function: "derive",
      breaks: "either stage's precondition fails",
      why_breaks:
        "the pipeline is a sequence of two stages, representativeness then sufficiency; a break at either stage invalidates the conclusion, and the two fail independently for different reasons",
      load_bearing:
        "the inference is only as good as its weakest stage; the two stages fail independently and for different reasons",
      math: "sample -> statistic -> conclusion",
      formal_status: "nl",
      composition: "sequence",
      children: ["pipe.stage1", "pipe.stage2"],
      atlas_ref: "atlas.statistic-supports-conclusion",
    },

    "pipe.stage1": {
      id: "pipe.stage1",
      kind: "transformation",
      label: "Representativeness",
      role: "map an observed sample to an estimate of the population it is drawn from",
      position: "step",
      takes: ["sample {x_i}"],
      produces: ["population estimate"],
      preserves: ["the statistic's internal validity, given a faithful draw"],
      function: "derive",
      breaks: "inclusion in the sample is correlated with the variable of interest",
      why_breaks:
        "observed density equals true density times a detection function over the variable; if detection is not flat, the statistic reads the shape of the detection function as signal about the truth; the draw is non-exchangeable",
      load_bearing: "a non-flat detection function makes the sample read its own selection as signal",
      math: "observed(x) = true(x) * detect(x); the step assumes detect(x) = const",
      formal_status: "nl",
      composition: "sequence",
      children: ["prim.estimator", "prim.exchangeability"],
    },

    "pipe.stage2": {
      id: "pipe.stage2",
      kind: "transformation",
      label: "Sufficiency",
      role: "map a population statistic to a conclusion about the target",
      position: "step",
      takes: ["statistic"],
      produces: ["conclusion about target"],
      preserves: ["whatever the statistic does retain"],
      function: "derive",
      breaks: "the conclusion needs information the statistic discards",
      why_breaks:
        "the statistic is a lossy summary; a first moment discards the variance and higher structure the target-level conclusion requires, so two populations with opposite internal structure share the statistic and the conclusion cannot resolve between them",
      load_bearing: "a first moment cannot carry a conclusion that depends on the distribution's shape",
      math: "conclusion needs F(distribution); statistic carries only E[.]; F not recoverable from E",
      formal_status: "nl",
      composition: "sequence",
      children: ["prim.estimator", "prim.sufficiency"],
    },

    // -- the eggs closure, split into three nodes per S6 --
    "eggs.prediction": {
      id: "eggs.prediction",
      kind: "prediction",
      label: "Mean response applied to an individual",
      value: "the mean response m",
      produced_by: "pipe.stage2",
    },
    "eggs.observation": {
      id: "eggs.observation",
      kind: "observation",
      label: "Measured population mean",
      world_value: "the measured population mean response",
      immutable: true,
    },
    "eggs.comparison": {
      id: "eggs.comparison",
      kind: "comparison",
      label: "Does the mean transfer to an individual?",
      test: "does m, applied to an individual, hold?",
      state: "contradicted",
      scope: "individual",
      note: "the population-level claim closes; only the individual application fails (stage 2)",
    },
  },

  // Instances: each instantiates pipe.root and breaks at a different child. The departure
  // is the coordinate of the broken node. These carry the two deferred verifications.
  instances: [
    {
      id: "covid.instance",
      instantiates: "pipe.root",
      atlas_ref: "atlas.statistic-supports-conclusion",
      case: "COVID origin",
      binds: {
        sample: "observed early cases",
        statistic: "spatial clustering",
        conclusion: "origin location",
      },
      broken_node: "pipe.stage1",
      departure:
        "stage-1 failure; the observed-case sample is biased by spatially concentrated surveillance, so inclusion correlates with location, the quantity being estimated",
      closure:
        "REFUSED at the irreducible-prior terminal. With the draw non-exchangeable, the clustering statistic cannot discriminate origin from surveillance pattern, so the inference does not close on the data; it returns a priced prior, not a measurement",
      TODO_verify:
        "which specific COVID analysis, and whether selection is the dominant critique of its clustering argument or one of several",
    },
    {
      id: "eggs.instance",
      instantiates: "pipe.root",
      atlas_ref: "atlas.statistic-supports-conclusion",
      case: "eggs, individual dietary response",
      binds: {
        sample: "study responses",
        statistic: "mean response",
        conclusion: "an individual's response",
      },
      broken_node: "pipe.stage2",
      departure:
        "stage-2 failure; responders are heterogeneous, and the mean discards the within-population variance the individual conclusion needs",
      closure:
        "SPLIT. Stage 1 holds, so the population statistic is sound and the population claim closes on a measurement; stage 2 fails, so the individual claim does not follow. Resolves to a sound population claim and an unsupported individual claim",
      TODO_verify:
        "the eggs effect sizes and the strength of the hyper/hypo-responder split, against the nutrition literature",
    },
  ],
};

if (typeof module !== "undefined" && module.exports) module.exports = { CASE };
