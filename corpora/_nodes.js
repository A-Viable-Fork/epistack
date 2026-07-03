// Role: the corpora node manifest for the typed repository map (build/repo-map.schema.js).
// Contract: exports an array of node records { path, type, group, flows? }; role and
//   contract are derived from each module's head comment by build/check-map.mjs.
// Invariant: pure data. One record per module; adding a module adds a record here.
"use strict";

module.exports = [
  {
    "path": "corpora/_primitives/primitives.js",
    "type": "corpus"
  },
  {
    "path": "corpora/_shared/atlas/atlas.js",
    "type": "corpus"
  },
  {
    "path": "corpora/_shared/bodies/bodies.js",
    "type": "corpus"
  },
  {
    "path": "corpora/_shared/forks.js",
    "type": "corpus"
  },
  {
    "path": "corpora/_shared/units.js",
    "type": "corpus"
  },
  {
    "path": "corpora/covid/covid.js",
    "type": "corpus"
  },
  {
    "path": "corpora/eggs/eggs.js",
    "type": "corpus"
  },
  {
    "path": "corpora/eggs/tables.js",
    "type": "corpus"
  },
  {
    "path": "corpora/eggs/nutrition.js",
    "type": "corpus"
  },
  {
    "path": "corpora/eggs/environment.js",
    "type": "corpus"
  },
  {
    "path": "corpora/lhc/lhc-cascade.js",
    "type": "corpus"
  },
  {
    "path": "corpora/population/population-pipeline.js",
    "type": "corpus"
  },
  {
    "path": "corpora/_shared/graph.json",
    "type": "corpus"
  }
];
