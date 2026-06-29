// Role: fork descriptors. A fork is a new id that names a parent and lists only its overrides
//   (docs/components-and-forking.md). It inherits everything else by reference, so parent
//   improvements flow into the un-overridden fields. A fork is its departure from a parent.
// Contract: exports { id -> descriptor }. Live: { id, forks: parentId, overrides:{...} }.
//   Snapshot: { id, copy_of: parentId, at: version }. resolve() (engine/resolve.js) merges a
//   live fork's overrides onto the resolved parent and freezes a snapshot.
// Invariant: pure data. Reference-not-inline taken to its conclusion: forking is a diff, not
//   a copy. The same metric that measures the distance between two cases governs a fork.
"use strict";

const FORKS = {
  // The canonical fork (docs/components-and-forking.md "the worked case"): the clunky stage-1
  // intuition, improved. It overrides explain.intuition and nothing else, so the math, the
  // children, the role, and the searchlight visual all inherit live from pipe.stage1.
  "pipe.stage1.plain": {
    id: "pipe.stage1.plain",
    forks: "pipe.stage1",
    overrides: {
      explain: {
        intuition:
          "A map of where cases show up only tells you where something started if you searched everywhere equally hard. Look harder in some places than others, and the map just shows where you looked, not where the cases are.",
      },
    },
  },

  // A snapshot fork (the other flavor): frozen against its parent at a version. Propagation
  // stops; the copy is on its own. Here it pins stage 2 so a later edit to pipe.stage2 would
  // not change it, demonstrating the copy_of path the resolver and linter support.
  "pipe.stage2.pinned": {
    id: "pipe.stage2.pinned",
    copy_of: "pipe.stage2",
    at: "v2",
  },

  // The thin-client reskin (docs/clients.md "the five-minute fork"): client.plain.warm forks
  // client.plain and overrides ONLY tokens, a warm parchment skin. It inherits the mapping,
  // the renderer, and the tier live, so the whole surface reskins with zero change to the store.
  "client.plain.warm": {
    id: "client.plain.warm",
    forks: "client.plain",
    overrides: {
      title: "Plain reader (warm)",
      tokens: {
        "--paper": "#f6f1e7", "--paper-2": "#eee7d6", "--ink": "#2a2416", "--ink-soft": "#5b5340",
        "--ink-faint": "#9a9176", "--rule": "#e0d8c2", "--lamp": "#b5651d", "--lamp-deep": "#8f4e16",
        "--slate": "#7a7156", "--night": "#1c1810", "--danger": "#b23b2e",
      },
    },
  },
};

if (typeof module !== "undefined" && module.exports) module.exports = { FORKS };
