// Role: the kernel node manifest for the typed repository map (build/repo-map.schema.js).
// Contract: exports an array of node records { path, type, group, flows? }; role and
//   contract are derived from each module's head comment by build/check-map.mjs.
// Invariant: pure data. One record per module; adding a module adds a record here.
"use strict";

module.exports = [
  {
    "path": "kernel/analysis/assessment.js",
    "type": "kernel",
    "group": "analysis"
  },
  {
    "path": "kernel/analysis/gaps.js",
    "type": "kernel",
    "group": "analysis",
    "flows": [
      {
        "type": "checked-by",
        "to": "build/check-gaps.mjs"
      }
    ]
  },
  {
    "path": "kernel/analysis/robustness.js",
    "type": "kernel",
    "group": "analysis"
  },
  {
    "path": "kernel/gate/clean-json.js",
    "type": "kernel",
    "group": "gate"
  },
  {
    "path": "kernel/gate/immune.js",
    "type": "kernel",
    "group": "gate"
  },
  {
    "path": "kernel/gate/lifecycle.js",
    "type": "kernel",
    "group": "gate"
  },
  {
    "path": "kernel/grounding/check.js",
    "type": "kernel",
    "group": "grounding"
  },
  {
    "path": "kernel/grounding/contamination.js",
    "type": "kernel",
    "group": "grounding",
    "flows": [
      {
        "type": "checked-by",
        "to": "build/check-lattice.mjs"
      }
    ]
  },
  {
    "path": "kernel/grounding/profile.js",
    "type": "kernel",
    "group": "grounding"
  },
  {
    "path": "kernel/grounding/resolve.js",
    "type": "kernel",
    "group": "grounding"
  },
  {
    "path": "kernel/motions/compare.js",
    "type": "kernel",
    "group": "motions"
  },
  {
    "path": "kernel/motions/decompose.js",
    "type": "kernel",
    "group": "motions"
  },
  {
    "path": "kernel/motions/perturb.js",
    "type": "kernel",
    "group": "motions",
    "flows": [
      {
        "type": "checked-by",
        "to": "build/check-perturb.mjs"
      }
    ]
  },
  {
    "path": "kernel/schema/edges.js",
    "type": "kernel",
    "group": "schema"
  },
  {
    "path": "kernel/schema/lattice.js",
    "type": "kernel",
    "group": "schema",
    "flows": [
      {
        "type": "checked-by",
        "to": "build/check-lattice.mjs"
      }
    ]
  },
  {
    "path": "kernel/schema/modes.js",
    "type": "kernel",
    "group": "schema"
  },
  {
    "path": "kernel/schema/registers.js",
    "type": "kernel",
    "group": "schema"
  },
  {
    "path": "kernel/schema/registry.js",
    "type": "kernel",
    "group": "schema"
  },
  {
    "path": "kernel/schema/schema.js",
    "type": "kernel",
    "group": "schema"
  },
  {
    "path": "kernel/schema/terminals.js",
    "type": "kernel",
    "group": "schema"
  },
  {
    "path": "kernel/store/exclusion.js",
    "type": "kernel",
    "group": "store"
  },
  {
    "path": "kernel/store/graph.js",
    "type": "kernel",
    "group": "store"
  },
  {
    "path": "kernel/store/patch-ledger.js",
    "type": "kernel",
    "group": "store"
  },
  {
    "path": "kernel/store/reconciliation.js",
    "type": "kernel",
    "group": "store"
  },
  {
    "path": "kernel/gate/compose_gate.py",
    "type": "kernel",
    "group": "gate"
  }
];
