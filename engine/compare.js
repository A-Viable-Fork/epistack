// Role: the SIDEWAYS motion. Walk instantiation: a shared atlas entry and its clones
//   (cross-case) or scenario-instances (within-case), each carrying its departure.
// Contract: (planned) compare(atlas, entryId) -> { entry, instances:[{...departure}] }.
// Invariant: DOM-free and pure. A departure is the coordinate, in a shared decomposition,
//   of the node that diverges (docs/family-discrimination.md); compare reads it, never
//   asserts resemblance.
//
// SORRY: seam only at this checkpoint. The compare view is v2, after the population
//   pipeline is authored across COVID and eggs. The seed data for it lands in Phase 3;
//   the rendered sideways panel is not built yet (task non-goal).
"use strict";

if (typeof module !== "undefined" && module.exports) module.exports = {};
