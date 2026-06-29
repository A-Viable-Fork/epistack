// Role: registered view-level components, addressable and forkable like the cards and
//   visuals (docs/components-and-forking.md). The cross-case compare view is one of these.
// Contract: exports { id -> { id, kind:"view", title } }. The render function lives in
//   view/ (view owns DOM); this layer owns only the descriptor.
// Invariant: pure data, no DOM. A motion or a route names the view by id; the renderer
//   resolves it. Forkable: fork view.compare to change its framing without touching the data.
"use strict";

const VIEW_COMPONENTS = {
  "view.compare": {
    id: "view.compare",
    kind: "view",
    title: "cross-case compare view",
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { VIEW_COMPONENTS };
