// Role: the population-mismatch case-family, authored as data (docs/population-pipeline.md)
//   with the v2 teaching layer (docs/teaching-layer.md). A self-contained data module the
//   engine loads (T0-4). The terse fields are the inspect layer; explain{} is the on-ramp.
// Contract: exports a case object { id, title, teaching, atlas_refs, entry, nodes, instances }
//   whose nodes conform to data/schema.js; refs resolve against data/primitives + data/atlas
//   + data/components/visuals. teaching:true makes the linter require explain on its
//   transformation/assumption/question nodes.
// Invariant: pure data. The explain layer is AUTHORED (generation), the terse role/why_breaks
//   is the verified-register spec it lands on; which is which stays marked. The two
//   case-specific numbers stay deferred (covid.instance, eggs.instance TODO_verify).
"use strict";

const CASE = {
  id: "population-pipeline",
  title: "Population mismatch: one pipeline, two stage-localized failures",
  teaching: true, // linter requires the explain layer on this case's teaching nodes
  atlas_refs: ["atlas.statistic-supports-conclusion"],
  entry: "q.start", // learning-first entry: open at the concrete question, not pipe.root

  nodes: {
    // ===================== the concrete entry (B5) =====================
    // Open at the contested questions; the typed structure emerges as the explanation of
    // why they are hard, and the shared pipeline (pipe.root) is the reveal at the bottom.
    "q.start": {
      id: "q.start",
      kind: "question",
      presentation: { type: "question" },
      label: "Two arguments that never end",
      children: ["q.covid", "q.eggs"],
      explain: {
        hook: "Why do some everyday arguments never end?",
        intuition:
          "Some arguments go in circles for years, not because a fact is missing, but because each side is standing on a different cracked floorboard. Take two famous ones apart and the same small machine turns up underneath, breaking in two different places.",
        stakes:
          "If the reason an argument never ends is one specific broken step, you can point at the step instead of restating your side louder.",
      },
    },
    "q.covid": {
      id: "q.covid",
      kind: "question",
      presentation: { type: "question" },
      label: "Why is the origin of COVID still argued about?",
      children: ["q.covid.casemap"],
      explain: {
        hook: "Why is the origin of COVID still argued about?",
        intuition:
          "Years on, careful people still disagree about where it started. The maps of early cases look like they should answer it. Open the argument up and the sticking point is not a missing fact, it is one step everyone is leaning on without checking.",
        stakes:
          "Where the early cases cluster is the heart of the public argument. Whether that cluster means anything rides on the very next step down.",
      },
    },
    "q.covid.casemap": {
      id: "q.covid.casemap",
      kind: "question",
      presentation: { type: "question" },
      label: "Does the case map show where it started?",
      children: ["pipe.stage1"],
      explain: {
        hook: "Does the case map show where it started?",
        intuition:
          "A cluster of early cases on a map feels like a pointing finger. But a map of cases is really a map of cases you found, and you only find what you go looking for. So the map only means what it seems to mean if one quiet assumption holds.",
        stakes:
          "If the map is really a map of where you looked, then every conclusion drawn from its shape is about your searching, not the virus.",
      },
    },
    "q.eggs": {
      id: "q.eggs",
      kind: "question",
      presentation: { type: "question" },
      label: "Why do people argue about whether eggs are bad for you?",
      children: ["q.eggs.individual"],
      explain: {
        hook: "Why do people argue about whether eggs are bad for you?",
        intuition:
          "Study after study, and the headlines still flip every few years. Both sides can point to real numbers and a real average. The argument survives the evidence, which is the sign that the trouble is not in the numbers but in a step everyone skips.",
        stakes:
          "People make real diet choices on this. If the studies cannot actually answer the question as asked, that is worth knowing plainly.",
      },
    },
    "q.eggs.individual": {
      id: "q.eggs.individual",
      kind: "question",
      presentation: { type: "question" },
      label: "Does the average diner tell you about you?",
      children: ["pipe.stage2"],
      explain: {
        hook: "Does the study's average tell you about you?",
        intuition:
          "A study reports an average effect across many people. You are one person, and you want to know what eggs do to you. Those are not the same question, and whether the first answers the second depends on one thing the average quietly hides.",
        stakes:
          "Advice for a person is being read off a number about a crowd. If people differ enough, that move is not valid, and the argument cannot close.",
      },
    },

    // ===================== the shared pipeline =====================
    // The reveal: both cases run this same two-step machine and break at different steps.
    "pipe.root": {
      id: "pipe.root",
      kind: "transformation",
      presentation: { type: "transformation" },
      label: "The same machine, twice",
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
      math: {
        tex: "\\text{sample} \\;\\rightarrow\\; \\text{statistic} \\;\\rightarrow\\; \\text{conclusion}",
        plain: "sample -> statistic -> conclusion",
        assumes: "each arrow holds on its own",
      },
      formal_status: "nl",
      composition: "sequence",
      children: ["pipe.stage1", "pipe.stage2"],
      atlas_ref: "atlas.statistic-supports-conclusion",
      explain: {
        hook: "The same machine, twice",
        intuition:
          "Both arguments run one little machine: take a sample, boil it down to a number, draw a conclusion. COVID breaks at the first step, the sample was not fair. Eggs breaks at the second, the number threw away what you needed. Same machine, two different broken parts.",
        in_words:
          "A sample becomes a number becomes a conclusion, and the conclusion is only as trustworthy as the weaker of those two steps.",
        symbols: [
          { sym: "sample", plain: "the cases or people you actually measured" },
          { sym: "statistic", plain: "the single number you boil them down to" },
          { sym: "conclusion", plain: "what you then claim about the wider world" },
        ],
        scenario:
          "Watch the two cases land on different steps. COVID's red light is on step one; eggs' is on step two. Two unrelated arguments, one shared machine, breaking in two different places.",
        stakes:
          "Once you can see which step an argument breaks at, the two sides stop talking past each other. The disagreement is not about the facts, it is about which step failed, and that is a thing you can check.",
      },
    },

    "pipe.stage1": {
      id: "pipe.stage1",
      kind: "transformation",
      presentation: {
        type: "selection-step",
        data: { distribution: "uniform", detection: "gaussian-bump", marker: 0.68, markerLabel: "the market", spread: 0.085 },
      },
      label: "Can you trust your sample?",
      tag: "representativeness",
      role: "map an observed sample to an estimate of the population it is drawn from",
      position: "step",
      takes: ["sample {x_i}"],
      produces: ["population estimate"],
      preserves: ["the statistic's internal validity, given a faithful draw"],
      function: "derive",
      breaks: "inclusion in the sample is correlated with the variable of interest",
      why_breaks:
        "the draw is non-exchangeable; inclusion is correlated with the variable being estimated, so the maximum-likelihood location reflects detect(x), not true(x)",
      load_bearing: "a non-flat detection function makes the sample read its own selection as signal",
      math: {
        tex: "\\text{observed}(x) = \\text{true}(x)\\,\\cdot\\,\\text{detect}(x)",
        plain: "observed(x) = true(x) * detect(x)",
        assumes: "detect(x) is the same everywhere",
      },
      formal_status: "nl",
      composition: "sequence",
      children: ["prim.estimator", "prim.exchangeability"],
      explain: {
        hook: "Can you trust your sample?",
        intuition:
          "Before where the cases are can tell you where something started, you have to trust that the cases you counted are a fair sample of all the cases. If you looked harder in some places than others, your map shows where you looked, not where things are.",
        in_words: "The cases you see at a place equals the cases really there, times how hard you looked there.",
        symbols: [
          { sym: "observed(x)", plain: "how many cases you counted at place x" },
          { sym: "true(x)", plain: "how many cases are really at place x" },
          { sym: "detect(x)", plain: "how thoroughly you searched place x" },
        ],
        scenario:
          "Suppose early testing happened mostly around one market. You find a cluster of cases there, not because it started there, but because that is where you looked. The cluster is a picture of your searchlight, not the source.",
        stakes:
          "Every conclusion that reads meaning from where the cases are, origin, spread, hotspot, depends on this step holding. If it fails, those conclusions are reading the searchlight.",
      },
    },

    "pipe.stage2": {
      id: "pipe.stage2",
      kind: "transformation",
      presentation: { type: "sufficiency-step" },
      label: "Is the average enough?",
      tag: "sufficiency",
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
      math: {
        tex: "\\mathbb{E}[x]\\ \\text{(the average)} \\;\\neq\\; x_{\\text{you}}",
        plain: "average(x) is not the same as your x",
        assumes: "everyone responds about the same",
      },
      formal_status: "nl",
      composition: "sequence",
      children: ["prim.estimator", "prim.sufficiency"],
      explain: {
        hook: "Is the average enough?",
        intuition:
          "Even with a perfectly fair sample, an average is a summary. It tells you what happens on average, not what happens to you. If people react in opposite ways, the average can sit in the middle, where nobody actually is.",
        in_words: "The average response is not the same thing as how any one person responds.",
        symbols: [
          { sym: "the average", plain: "the typical response across everyone in the study" },
          { sym: "the spread", plain: "how much people differ from that average" },
          { sym: "your x", plain: "what happens to one particular person, you" },
        ],
        scenario:
          "Suppose half the people in a study barely react to eggs and half react strongly. The average looks moderate, so 'eggs have a moderate effect' is true for the group and wrong for almost everyone in it. The average hid two opposite stories.",
        stakes:
          "Every claim that jumps from a study's average to advice for one person rides on this step. If people differ enough, the average cannot tell you what to do, and the argument never closes because both sides quote the same true average.",
      },
    },

    // ===================== the eggs closure (S6 split) =====================
    "eggs.prediction": {
      id: "eggs.prediction",
      kind: "prediction",
      presentation: { type: "prediction" },
      label: "Mean response applied to an individual",
      value: "the mean response m",
      produced_by: "pipe.stage2",
    },
    "eggs.observation": {
      id: "eggs.observation",
      kind: "observation",
      presentation: { type: "observation" },
      label: "Measured population mean",
      world_value: "the measured population mean response",
      immutable: true,
    },
    "eggs.comparison": {
      id: "eggs.comparison",
      kind: "comparison",
      presentation: { type: "comparison" },
      label: "Does the mean transfer to an individual?",
      test: "does m, applied to an individual, hold?",
      state: "contradicted",
      scope: "individual",
      note: "the population-level claim closes; only the individual application fails (stage 2)",
    },
  },

  // Instances: each instantiates pipe.root and breaks at a different child. The departure is
  // the coordinate of the broken node. These carry the two deferred verifications.
  instances: [
    {
      id: "covid.instance",
      instantiates: "pipe.root",
      atlas_ref: "atlas.statistic-supports-conclusion",
      case: "COVID origin",
      binds: { sample: "observed early cases", statistic: "spatial clustering", conclusion: "origin location" },
      broken_node: "pipe.stage1",
      plain: "The early cases were a map of where people looked, not where the virus started.",
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
      binds: { sample: "study responses", statistic: "mean response", conclusion: "an individual's response" },
      broken_node: "pipe.stage2",
      plain: "The average hid that people react in opposite ways, so it can't tell one person what to do.",
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
