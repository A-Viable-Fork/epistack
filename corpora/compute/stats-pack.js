// Role: the statistics pack (COMPUTE-1). Statistics transformations are plural and forkable: there is
//   no canonical Bayesian aggregation, so the choice of prior, the independence structure, and the
//   bound are contested modeling choices, and this pack lives as corpus content, not shared root
//   (kernel/compute/transforms.mjs and kernel/compute/canonical-packs.mjs are the shared register and
//   the canonical graph/algebra wrappers respectively). A third author's entry, a fat-tailed bound
//   after Weissman's own reconstruction (corpora/covid/covid-depth.js, w.weissman.fattail), or a
//   t-distribution prior, would be a sibling in this file or a forked corpus: nothing here is the one
//   correct aggregation, and disagreement between entries is the point, not a defect.
// Contract: exports STATS_ENTRIES, an array of transformation entries ready for register(entry)
//   (kernel/compute/transforms.mjs). registerStatsPack(registry) calls registry.register(entry) for
//   each of them. Both entries are pure data plus a pure run.
// Invariant: neither entry ever emits a kernel or attaches a grade to its output; each carries its
//   assumptions manifest as a required field. The covid debate is the reason this pack's own two
//   entries must disagree: the Rootclaim aggregation multiplied a factor for choosing the suboptimal
//   RRAR insertion site by a factor for adding the proline, factors the debate itself questioned as
//   possibly not two independent weirdnesses but one furin-cleavage-site strategy (the suboptimal-PRRAR
//   thread in corpora/covid/covid-depth.js: fcs.will.suboptimal, fcs.zo.prrarunopt, fcs.ll.mimic). The
//   naive-multiply entry treats the factors as independent and compounds them; the dependence-aware
//   entry refuses to compound factors sharing a declared mechanism. build/check-compute.mjs runs both
//   over the same two factors and asserts they disagree.
"use strict";

const STATS_ENTRIES = [
  {
    id: "statistics.naive-multiply",
    pack: "statistics",
    consumes: "values",
    emits: "value",
    reversibility: "lossy",
    assumptions: [
      { id: "independence", statement: "the factors are treated as conditionally independent and multiplied" },
    ],
    // input: an array of numeric factors. Multiplies them unconditionally: this is the compounding
    // move the covid debate itself questions when the factors share a mechanism.
    run: (factors) => {
      const product = factors.reduce((acc, f) => acc * f, 1);
      return { value: product, manifest: STATS_ENTRIES[0].assumptions };
    },
  },
  {
    id: "statistics.dependence-aware",
    pack: "statistics",
    consumes: "values",
    emits: "flag",
    reversibility: "lossy",
    assumptions: [
      { id: "declared-dependence", statement: "factors sharing a mechanism group are not compounded; undeclared independence is refused, not assumed" },
    ],
    // input: an array of { factor, mechanism }. If two or more entries share a mechanism, refuses to
    // compound them and names the shared mechanism; otherwise multiplies the factors, exactly as
    // naive-multiply would, since nothing here objects to compounding factors that are genuinely
    // independent.
    run: (entries) => {
      const manifest = STATS_ENTRIES[1].assumptions;
      const byMechanism = new Map();
      for (const e of entries) {
        if (!byMechanism.has(e.mechanism)) byMechanism.set(e.mechanism, []);
        byMechanism.get(e.mechanism).push(e.factor);
      }
      for (const [mechanism, factors] of byMechanism) {
        if (factors.length >= 2) {
          return { refused: true, reason: `factors ${JSON.stringify(factors)} share the declared mechanism "${mechanism}", not compounded as independent`, manifest };
        }
      }
      const product = entries.reduce((acc, e) => acc * e.factor, 1);
      return { value: product, manifest };
    },
  },
];

function registerStatsPack(registry) {
  for (const entry of STATS_ENTRIES) registry.register(entry);
}

module.exports = { STATS_ENTRIES, registerStatsPack };
