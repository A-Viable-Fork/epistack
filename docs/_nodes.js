// Role: the docs node manifest for the typed repository map (build/repo-map.schema.js).
// Contract: exports an array of node records { path, type, group, flows? }; role and
//   contract are derived from each module's head comment by build/check-map.mjs.
// Invariant: pure data. One record per module; adding a module adds a record here.
"use strict";

module.exports = [
  {
    "path": "docs/criteria-to-architecture-map.md",
    "type": "doc"
  },
  {
    "path": "docs/adversarial-robustness.md",
    "type": "doc"
  },
  {
    "path": "docs/knowledge-system-what.md",
    "type": "doc"
  },
  {
    "path": "docs/knowledge-system-how.md",
    "type": "doc"
  },
  {
    "path": "docs/knowledge-system-why.md",
    "type": "doc"
  },
  {
    "path": "docs/what-stands-without-trust.md",
    "type": "doc"
  },
  {
    "path": "docs/status-ledger.md",
    "type": "doc"
  },
  {
    "path": "docs/sorry-ledger.md",
    "type": "doc"
  },
  {
    "path": "docs/design-axioms.md",
    "type": "doc"
  },
  {
    "path": "docs/api.md",
    "type": "doc"
  },
  {
    "path": "docs/clients.md",
    "type": "doc"
  },
  {
    "path": "docs/corpus-index.md",
    "type": "doc"
  },
  {
    "path": "docs/repo-map.md",
    "type": "doc"
  },
  {
    "path": "docs/repo-map.generated.json",
    "type": "doc"
  }
];
