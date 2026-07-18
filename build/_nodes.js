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
    "path": "build/check-characterized-gaps.mjs",
    "type": "build"
  },
  {
    "path": "build/check-composition.mjs",
    "type": "build"
  },
  {
    "path": "build/check-algebra.mjs",
    "type": "build"
  },
  {
    "path": "build/check-eggs.mjs",
    "type": "build"
  },
  {
    "path": "build/check-reconcile.mjs",
    "type": "build"
  },
  {
    "path": "build/covid-build.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-covid.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-lineage.mjs",
    "type": "build"
  },
  {
    "path": "build/check-covid.mjs",
    "type": "build"
  },
  {
    "path": "build/lhc-build.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-lhc.mjs",
    "type": "build"
  },
  {
    "path": "build/check-lhc.mjs",
    "type": "build"
  },
  {
    "path": "build/check-atlas.mjs",
    "type": "build"
  },
  {
    "path": "build/check-demo.mjs",
    "type": "build"
  },
  {
    "path": "build/check-docs.mjs",
    "type": "build"
  },
  {
    "path": "build/check-registers.mjs",
    "type": "build"
  },
  {
    "path": "build/lineage-build.mjs",
    "type": "build"
  },
  {
    "path": "build/check-lineage.mjs",
    "type": "build"
  },
  {
    "path": "build/check-vocabulary.mjs",
    "type": "build"
  },
  {
    "path": "build/math-build.mjs",
    "type": "build"
  },
  {
    "path": "build/self-build.mjs",
    "type": "build"
  },
  {
    "path": "build/check-self.mjs",
    "type": "build"
  },
  {
    "path": "build/check-boundary.mjs",
    "type": "build"
  },
  {
    "path": "build/check-conformance.mjs",
    "type": "build"
  },
  {
    "path": "build/tcpip-eras.mjs",
    "type": "build"
  },
  {
    "path": "build/check-tcpip-counterexample.mjs",
    "type": "build"
  },
  {
    "path": "build/check-math.mjs",
    "type": "build"
  },
  {
    "path": "build/check-math-exhaustion.mjs",
    "type": "build"
  },
  {
    "path": "build/check-math-differential.mjs",
    "type": "build"
  },
  {
    "path": "build/check-math-embed.mjs",
    "type": "build"
  },
  {
    "path": "build/check-certificate.mjs",
    "type": "build"
  },
  {
    "path": "build/check-comment.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/_shared/common-types.js"
      }
    ]
  },
  {
    "path": "build/adoption.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/_shared/common-types.js"
      }
    ]
  },
  {
    "path": "build/check-type-hash.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/_shared/common-types.js"
      }
    ]
  },
  {
    "path": "build/check-crossing.mjs",
    "type": "build"
  },
  {
    "path": "build/check-fork-contest.mjs",
    "type": "build"
  },
  {
    "path": "build/emit-snapshot.mjs",
    "type": "build"
  },
  {
    "path": "build/check-contribution.mjs",
    "type": "build"
  },
  {
    "path": "build/decomposition-build.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/submission-decomposition/decomposition.js"
      }
    ]
  },
  {
    "path": "build/check-decomposition.mjs",
    "type": "build"
  },
  {
    "path": "build/check-agreement.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/_shared/common-types.js"
      }
    ]
  },
  {
    "path": "build/bottomup-build.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/federation/federation.js"
      }
    ]
  },
  {
    "path": "build/check-bottomup.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-management.mjs",
    "type": "build",
    "flows": [
      {
        "type": "loads-corpus",
        "to": "corpora/_shared/common-types.js"
      }
    ]
  },
  {
    "path": "build/check-management.mjs",
    "type": "build"
  },
  {
    "path": "build/build-manager-probe.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-kernel.mjs",
    "type": "build"
  },
  {
    "path": "build/build-detached-kernel.mjs",
    "type": "build"
  },
  {
    "path": "build/build-kernel-file.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-demo.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-front-door.mjs",
    "type": "build"
  },
  {
    "path": "build/eggs-build.mjs",
    "type": "build"
  },
  {
    "path": "build/vendor-eggs.mjs",
    "type": "build"
  },
  {
    "path": "build/check-client.mjs",
    "type": "build"
  },
  {
    "path": "build/check-ingest.mjs",
    "type": "build"
  },
  {
    "path": "build/check-produce.mjs",
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
  },
  {
    "path": "build/check-compute.mjs",
    "type": "build"
  },
  {
    "path": "build/check-glossary.mjs",
    "type": "build"
  }
];
