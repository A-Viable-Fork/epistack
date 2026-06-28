// Role: (v1) the spine rail. The decomposition path from the root claim to the focused
//   node, horizontal and clickable, marking which case and claim the node sits under.
//   "Where am I and how do I get back", always visible. architecture-spec.md section 6.
// Contract: (planned) renderRail(path, onJump) -> DOM element. Reads engine state.
// Invariant: view depends on engine depends on data, never the reverse (T0-2).
//
// SORRY: seam only at this checkpoint. Built in v1 alongside view/card.js, on the
//   population pipeline. Not built here yet (task non-goal).
"use strict";
