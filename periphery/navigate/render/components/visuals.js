// Role: the registered visual components. A node does not contain a visual; it references
//   one by id and passes params (docs/components-and-forking.md). This file holds the data
//   descriptors so a visual is addressable, resolvable, and forkable like any component.
// Contract: exports { id -> { id, kind:"visual", title, defaults } }. The render function
//   for each id lives in view/ (view owns DOM); this layer owns only the descriptor.
// Invariant: pure data, no DOM. A node embeds a visual with
//   visual: { component: "viz.searchlight", params: {...} }; the renderer resolves the id.
"use strict";

const VISUALS = {
  "viz.searchlight": {
    id: "viz.searchlight",
    kind: "visual",
    title: "the searchlight",
    // a true distribution that is uniform, a movable detection bump, and their product as
    // the observed density. Params let a node tune the marker and the bump width.
    defaults: { sigma: 0.085, marker: 0.68, markerLabel: "the market" },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { VISUALS };
