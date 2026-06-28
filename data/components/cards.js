// Role: the registered card-layout components. A card is addressable and resolvable like any
//   other component, so it is forkable (docs/components-and-forking.md): a contributor can fork
//   a layout, reorder or drop a section, and point a node at the fork.
// Contract: exports { id -> { id, kind:"card", title, sections:[...] } }. The render function
//   for each layout lives in view/card.js (view owns DOM); this layer owns only the descriptor.
// Invariant: pure data, no DOM. A node may name its layout with `card: "card.teaching"`;
//   absent that, the renderer defaults by whether the node carries an explain block.
"use strict";

const CARD_LAYOUTS = {
  "card.teaching": {
    id: "card.teaching",
    kind: "card",
    title: "learning-first card",
    sections: ["hook", "intuition", "math", "visual", "scenario", "stakes", "inspect", "motions"],
  },
  "card.terse": {
    id: "card.terse",
    kind: "card",
    title: "terse basis card",
    sections: ["label", "role", "basis", "motions"],
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { CARD_LAYOUTS };
