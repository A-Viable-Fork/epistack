// Role: the grounding lattice: the ordering every claim sits in, with meet (jointly-necessary
//   minimum) and join (independently-sufficient maximum). untyped at the bottom; the forum tiers
//   raw < attributed < structured; then the three floors proof, measurement, declaration, each
//   above the forum tiers and MUTUALLY INCOMPARABLE (they collapse to one floor rank for the meet).
// Contract: [1.1] Stage 1 demonstrator. Exports POSITIONS, floorRank(pos), meet(a,b), join(a,b),
//   regionOf(pos), isFloor(pos). Pure, DOM-free; kernel imports only kernel.
// Invariant: floorRank collapses the three floors to a single rank, so a node combining a
//   proof-grounded and a measurement-grounded NECESSARY support stays at floor, while one forum
//   necessary support pulls the meet down to that forum value (weakness flows downward).
// Scope: the demonstrator exposes the ordering, the meet/join, and the floor-collapse. It does
//   NOT add the reified edge taxonomy, the forum tiers as an authored progression on real content,
//   the reconciliation register, or multiple independent support sets beyond one disjunction node.
"use strict";

(function (root) {
  // the positions, low to high. The three floors and the collapsed "floor" sentinel share a rank.
  const POSITIONS = ["untyped", "raw", "attributed", "structured", "proof", "measurement", "declaration", "floor", "top"];
  const FLOORS = ["proof", "measurement", "declaration", "floor"];
  // the collapsed rank of each position: the three floors (and the "floor" sentinel) all rank 4.
  const RANK = { untyped: 0, raw: 1, attributed: 2, structured: 3, proof: 4, measurement: 4, declaration: 4, floor: 4, top: 5 };

  function floorRank(pos) {
    return Object.prototype.hasOwnProperty.call(RANK, pos) ? RANK[pos] : 0;
  }
  function isFloor(pos) {
    return FLOORS.indexOf(pos) >= 0;
  }
  // the lattice region a position sits in: untyped (bottom), forum (a forum tier), or floor.
  function regionOf(pos) {
    const r = floorRank(pos);
    if (r <= 0) return "untyped";
    if (r >= 4) return "floor";
    return "forum";
  }

  // meet: the jointly-necessary minimum (the weakest necessary support governs). When two
  // positions share the floor rank but are different floors, the meet is the collapsed "floor".
  function meet(a, b) {
    const ra = floorRank(a), rb = floorRank(b);
    if (ra < rb) return a;
    if (rb < ra) return b;
    if (isFloor(a) && isFloor(b) && a !== b) return "floor";
    return a;
  }
  // join: the independently-sufficient maximum (the strongest sufficient path governs).
  function join(a, b) {
    const ra = floorRank(a), rb = floorRank(b);
    if (ra > rb) return a;
    if (rb > ra) return b;
    if (isFloor(a) && isFloor(b) && a !== b) return "floor";
    return a;
  }

  const out = { POSITIONS, FLOORS, floorRank, isFloor, regionOf, meet, join };
  if (typeof module !== "undefined" && module.exports) module.exports = out;
  else root.EpiStackLattice = out;
})(typeof globalThis !== "undefined" ? globalThis : this);
