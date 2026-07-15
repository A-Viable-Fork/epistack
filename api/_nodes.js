// Role: the api node manifest for the typed repository map (build/repo-map.schema.js).
// Contract: exports an array of node records { path, type, group, flows? }; role and
//   contract are derived from each module's head comment by build/check-map.mjs.
// Invariant: pure data. One record per module; adding a module adds a record here.
"use strict";

module.exports = [
  {
    "path": "api/api.js",
    "type": "api",
    "flows": [
      {
        "type": "gated-write",
        "to": "kernel/gate/gate.mjs"
      }
    ]
  },
  {
    "path": "api/client-api.mjs",
    "type": "api"
  },
  {
    "path": "api/management-api.mjs",
    "type": "api"
  },
  {
    "path": "api/compose.js",
    "type": "api"
  },
  {
    "path": "api/credential.js",
    "type": "api"
  },
  {
    "path": "api/export.js",
    "type": "api"
  },
  {
    "path": "api/fork.js",
    "type": "api"
  },
  {
    "path": "api/contest.js",
    "type": "api"
  },
  {
    "path": "api/contribution.js",
    "type": "api"
  },
  {
    "path": "api/propose.js",
    "type": "api"
  },
  {
    "path": "api/providers/local-provider.mjs",
    "type": "api",
    "flows": [
      {
        "type": "gated-write",
        "to": "kernel/gate/gate.mjs"
      }
    ]
  },
  {
    "path": "api/providers/local-management-provider.mjs",
    "type": "api"
  },
  {
    "path": "api/providers/remote-provider.mjs",
    "type": "api"
  },
  {
    "path": "api/read.js",
    "type": "api"
  },
  {
    "path": "api/subscribe.js",
    "type": "api"
  }
];
