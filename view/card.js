// Role: (v1) the node card. Renders one schema node from all three structures: the break
//   block featured, takes->produces as context, the math line, and the three motion
//   affordances (decompose / compare / perturb). See docs/architecture-spec.md section 3.
// Contract: (planned) renderCard(node, handlers) -> DOM element. Reads the engine; owns
//   no data.
// Invariant: view depends on engine depends on data, never the reverse (T0-2).
//
// SORRY: seam only at this checkpoint. The migrated artifact's node rendering lives in
//   view/app.js (renderNode); the typed-schema card is the v1 build on the population
//   pipeline. Not built here yet (task non-goal).
"use strict";
