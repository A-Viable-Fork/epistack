// Role: the periphery node manifest for the typed repository map (build/repo-map.schema.js).
// Contract: exports an array of node records { path, type, group, flows? }; role and
//   contract are derived from each module's head comment by build/check-map.mjs.
// Invariant: pure data. One record per module; adding a module adds a record here.
"use strict";

module.exports = [
  {
    "path": "periphery/assess/assess.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/author/author.js",
    "type": "periphery",
    "group": "producer"
  },
  {
    "path": "periphery/filter/filter.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/ingest/ingest.js",
    "type": "periphery",
    "group": "producer"
  },
  {
    "path": "periphery/navigate/clients/clients.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/clients/palette.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/fat/auditor.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/api.js"
      }
    ]
  },
  {
    "path": "periphery/navigate/fat/teaching.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/api.js"
      }
    ]
  },
  {
    "path": "periphery/navigate/fat/thin.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/api.js"
      }
    ]
  },
  {
    "path": "periphery/navigate/render/app.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/card.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/compare-view.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/components/cards.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/components/views.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/components/visuals.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/compose-gate.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/render/host.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/api.js"
      }
    ]
  },
  {
    "path": "periphery/navigate/render/propose-widget.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/client-api.mjs"
      }
    ]
  },
  {
    "path": "periphery/navigate/render/rail.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/shell/shell.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/client-api.mjs"
      }
    ]
  },
  {
    "path": "periphery/navigate/shell/modules/prose.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/navigate/shell/modules/cases.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/client-api.mjs"
      }
    ]
  },
  {
    "path": "periphery/navigate/shell/modules/demos.js",
    "type": "periphery",
    "group": "consumer",
    "flows": [
      {
        "type": "reads-through-api",
        "to": "api/client-api.mjs"
      }
    ]
  },
  {
    "path": "periphery/navigate/render/visuals.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/query/query.js",
    "type": "periphery",
    "group": "consumer"
  },
  {
    "path": "periphery/redteam/redteam.js",
    "type": "periphery",
    "group": "producer"
  }
];
