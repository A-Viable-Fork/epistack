// Role: the build node manifest for the typed repository map (build/repo-map.schema.js).
// Contract: exports an array of node records { path, type, group, flows? }; role and
//   contract are derived from each module's head comment by build/check-map.mjs.
// Invariant: pure data. One record per module; adding a module adds a record here.
"use strict";

module.exports = [
  {
    "path": "build/bundle.js",
    "type": "build"
  },
  {
    "path": "build/check-gaps.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/_shared/atlas/atlas.js"
      }
    ]
  },
  {
    "path": "build/check-gate.mjs",
    "type": "build"
  },
  {
    "path": "build/check-lattice.mjs",
    "type": "build"
  },
  {
    "path": "build/check-client.mjs",
    "type": "build"
  },
  {
    "path": "build/check-map.mjs",
    "type": "build"
  },
  {
    "path": "build/check-robustness.mjs",
    "type": "build"
  },
  {
    "path": "build/check-translate.mjs",
    "type": "build"
  },
  {
    "path": "build/check-migrate.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/lhc/lhc-cascade.js"
      },
      {
        "type": "loads-corpus",
        "to": "corpora/population/population-pipeline.js"
      }
    ]
  },
  {
    "path": "build/check-perturb.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/lhc/lhc-cascade.js"
      }
    ]
  },
  {
    "path": "build/fork-demo.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/population/population-pipeline.js"
      }
    ]
  },
  {
    "path": "build/gate-demo.mjs",
    "type": "build"
  },
  {
    "path": "build/new-client.mjs",
    "type": "build"
  },
  {
    "path": "build/repo-map.schema.js",
    "type": "build"
  },
  {
    "path": "build/translate-trellis.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-gate-browser.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-snapshot.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/lhc/lhc-cascade.js"
      },
      {
        "type": "loads-corpus",
        "to": "corpora/population/population-pipeline.js"
      }
    ]
  },
  {
    "path": "build/vendor-katex.mjs",
    "type": "build"
  },
  {
    "path": "linter.js",
    "type": "build"
  }
];
