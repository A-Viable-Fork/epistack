// Role: effective grounding and the contamination rule. Folds a node's support subtree along
//   `children` edges only, combining by meet (conjunction/sequence, jointly necessary) or join
//   (disjunction, independently sufficient), capped by the node's own declared terminal; then
//   flags any node whose declared terminal is FORMAL but whose effective grounding folds into the
//   forum region (weakness flowed down from a forum support into a claim that advertises a floor).
// Contract: [1.4] Stage 1 demonstrator. Exports effectiveGrounding(nodeMap, id), ceilingOf(node),
//   groundingOf(nodeMap, id) -> { mode, ceiling, effective, region }, and contaminationGaps(nodeMap)
//   -> [{ kind, at, declared_floor, effective, forum_support, ... }]. Pure, DOM-free; kernel imports
//   only kernel (lattice + terminals).
// Invariant: the fold runs along support (children) edges ONLY, never presupposition/guard/input
//   edges. A cited primitive, an observation, and a populated body-property leaf are floors; any
//   other childless support is untyped, matching the current structural detector at the boolean
//   level (kernel/analysis/gaps.js groundingGaps).
// Scope: single-composition decomposition, the support structure the graph already has. It does
//   NOT model the reified edge taxonomy, forum tiers as authored progression, the reconciliation
//   register, or multiple independent support sets beyond one disjunction node (Stage 1 remainder).
"use strict";

(function (root) {
  const NODE = typeof module !== "undefined" && module.exports;
  const L = NODE ? require("../schema/lattice.js") : (typeof EpiStackLattice !== "undefined" ? EpiStackLattice : null);
  const T = NODE ? require("../schema/terminals.js") : { modeOf: typeof modeOf !== "undefined" ? modeOf : null };
  const modeOfFn = T.modeOf; // local binding; must not shadow the global `modeOf` (TDZ in browser)

  // the floor position a declared terminal_type reaches, by its mode. Formal -> proof (derivation)
  // or measurement (the other formal terminals); constitutive -> declaration; forum -> structured
  // (the top forum tier, the ceiling of a forum claim). Unknown/absent -> null.
  function floorFor(terminal_type) {
    const m = modeOfFn ? modeOfFn(terminal_type) : null;
    if (m === "formal") return terminal_type === "derivation" ? "proof" : "measurement";
    if (m === "constitutive") return "declaration";
    if (m === "forum") return "structured";
    return null;
  }

  // a childless node that legitimately grounds (the floor): a cited primitive (incl. a flattened
  // body-property leaf, which is kind primitive with a citation), or an observation. Matches
  // kernel/analysis/gaps.js isGroundedLeaf exactly, so the boolean agrees by construction.
  function isGroundedLeaf(n) {
    if (!n) return false;
    if (n.kind === "primitive") return !!n.citation;
    if (n.kind === "observation") return true;
    return false;
  }

  // the grounding of a CHILDLESS node reached as support.
  function leafPosition(n) {
    if (isGroundedLeaf(n)) {
      if (n.kind === "observation") return "measurement"; // a world-fact closes a claim: a floor
      return floorFor(n.terminal_type) || "proof"; // a cited primitive: its floor, math floor by default
    }
    // a childless forum-terminal leaf grounds by declaration at its forum tier; any other childless
    // support (a formal terminal with no support drawn, or no terminal) bottoms out untyped.
    if (n.terminal_type && modeOfFn && modeOfFn(n.terminal_type) === "forum") return floorFor(n.terminal_type);
    return "untyped";
  }

  // the ceiling: the highest grounding a node's KIND could reach, from its declared terminal_type.
  function ceilingOf(node) {
    if (!node || !node.terminal_type) return "untyped";
    return floorFor(node.terminal_type) || "untyped";
  }

  // effective grounding: fold the support subtree along `children` only. meet for conjunction/
  // sequence, join for disjunction, then cap by the node's own declared terminal (a node never
  // advertises more grounding than its terminal allows). Memoized; guarded against cycles.
  function effectiveGrounding(nodeMap, id, memo, stack) {
    if (!L) return "untyped";
    memo = memo || Object.create(null);
    stack = stack || new Set();
    if (id in memo) return memo[id];
    const n = nodeMap[id];
    if (!n) return "untyped"; // a dangling child is a separate gap axis; treat as no support here
    if (stack.has(id)) return "untyped"; // cycle guard (the linter forbids decomposition cycles)
    const kids = Array.isArray(n.children) ? n.children : [];
    let pos;
    if (!kids.length) {
      pos = leafPosition(n);
    } else {
      stack.add(id);
      const disj = n.composition === "disjunction";
      let combined = null;
      for (const c of kids) {
        const cp = effectiveGrounding(nodeMap, c, memo, stack);
        combined = combined == null ? cp : (disj ? L.join(combined, cp) : L.meet(combined, cp));
      }
      stack.delete(id);
      if (n.terminal_type) combined = L.meet(combined, ceilingOf(n)); // cap by own declared terminal
      pos = combined;
    }
    memo[id] = pos;
    return pos;
  }

  // the read surfaced alongside a node: its mode, ceiling, effective grounding, and lattice region.
  function groundingOf(nodeMap, id) {
    const n = nodeMap[id];
    if (!n) return null;
    const eff = effectiveGrounding(nodeMap, id);
    return {
      id,
      mode: n.terminal_type && modeOfFn ? modeOfFn(n.terminal_type) : null,
      ceiling: ceilingOf(n),
      effective: eff,
      region: L ? L.regionOf(eff) : null,
    };
  }

  // the contamination check: a node whose declared terminal is FORMAL but whose effective grounding,
  // folded from its supports, falls into the forum region. Reports the node, its declared floor, and
  // the forum support that pulls it down. Objective and unranked, like every gap read.
  function contaminationGaps(nodeMap) {
    const out = [];
    if (!L || !modeOfFn) return out;
    const memo = Object.create(null);
    for (const id of Object.keys(nodeMap)) {
      const n = nodeMap[id];
      if (!n || !n.terminal_type || modeOfFn(n.terminal_type) !== "formal") continue;
      const eff = effectiveGrounding(nodeMap, id, memo);
      if (L.regionOf(eff) !== "forum") continue;
      const forumChild = (Array.isArray(n.children) ? n.children : []).find(
        (c) => L.regionOf(effectiveGrounding(nodeMap, c, memo)) === "forum"
      );
      out.push({
        kind: "contamination",
        at: id,
        declared_floor: ceilingOf(n),
        effective: eff,
        forum_support: forumChild || null,
        missing:
          "declares a formal floor (" + ceilingOf(n) + ", terminal '" + n.terminal_type +
          "') but its support folds to the forum region (" + eff + ")" +
          (forumChild ? ", pulled down by forum support '" + forumChild + "'" : ""),
        discharge: "raise the forum support to a floor, or lower the declared terminal to match its support",
      });
    }
    return out;
  }

  const out = { floorFor, isGroundedLeaf, leafPosition, ceilingOf, effectiveGrounding, groundingOf, contaminationGaps };
  if (NODE) module.exports = out;
  else root.EpiStackGrounding = out;
})(typeof globalThis !== "undefined" ? globalThis : this);
