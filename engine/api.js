// Role: the engine's client-facing API. THE single door between clients and storage. Reads
//   are open (resolve, decompose, compare, dependents, motions, kinds, entry); the one write
//   is submit(claim), a gated submission, never a direct store mutation.
// Contract: createApi(sources) -> api. sources is the data (primitives, atlas, cases,
//   components, forks); the API builds the registry + resolver internally so clients never
//   see storage. Every method is a read except submit. Pure over its inputs, DOM-free.
// Invariant: clients call this and nothing below it (docs/api.md, docs/architecture-storage-
//   api-clients.md). The store is added to only under the gate; the rule governs structure,
//   never content. The dependency runs clients -> API -> storage and never the reverse.
"use strict";

(function (root) {
  const NODE = typeof module !== "undefined" && module.exports;
  // engine dependencies: required in Node, globals in the inlined browser bundle.
  const E = NODE
    ? {
        buildRegistry: require("./registry.js").buildRegistry,
        makeResolver: require("./resolve.js").makeResolver,
        dependents: require("./resolve.js").dependents,
        focusView: require("./decompose.js").focusView,
        motions: require("./decompose.js").motions,
        classify: require("./decompose.js").classify,
        compare: require("./compare.js").compare,
        pipelineMembers: require("./compare.js").pipelineMembers,
        detectGaps: require("./gaps.js").detectGaps,
        detectGapsAt: require("./gaps.js").detectGapsAt,
        perturb: require("./perturb.js").perturb,
        SCHEMA: require("../data/schema.js"),
      }
    : {
        buildRegistry: buildRegistry,
        makeResolver: makeResolver,
        dependents: dependents,
        focusView: focusView,
        motions: motions,
        classify: classify,
        compare: compare,
        pipelineMembers: pipelineMembers,
        detectGaps: typeof EpiStackGaps !== "undefined" ? EpiStackGaps.detectGaps : null,
        detectGapsAt: typeof EpiStackGaps !== "undefined" ? EpiStackGaps.detectGapsAt : null,
        perturb: typeof perturb !== "undefined" ? perturb : null,
        SCHEMA: typeof SCHEMA !== "undefined" ? SCHEMA : null,
      };

  // submit: a write is not a row inserted. It is a claim submitted to the gate, which promotes
  // only on independent corroboration. This door never mutates the store; it returns standing.
  function submitToGate(claim) {
    if (!claim || typeof claim !== "object" || !claim.statement)
      return { accepted: false, reason: "a claim needs at least a statement" };
    return {
      accepted: true,
      status: "submitted",
      promoted: false,
      rule: "promotes only on independent corroboration; agreement counts once independence is shown",
      gate: "compose_gate.py",
      note: "not a store write; the store is added to only under the gate, and the rule governs structure, never content",
    };
  }

  function createApi(sources) {
    sources = sources || {};
    const registry = E.buildRegistry(sources);
    const resolve = E.makeResolver(registry);
    const entryId =
      sources.entry ||
      (Array.isArray(sources.cases) && sources.cases[0] && sources.cases[0].entry) ||
      null;

    return {
      // ---- reads: open and many ----
      resolve: (id) => resolve(id), // the merged component at id (fork-aware)
      has: (id) => resolve(id) !== undefined,
      decompose: (id) => E.focusView(resolve, id), // { node, children:[{node,kind,expandable}] }
      compare: (atlasOrId) => E.compare(resolve, atlasOrId), // cross-case model | null
      dependents: (id) => E.dependents(registry, id), // the blast radius: who references id
      motions: (id) => E.motions(resolve(id), resolve), // { decompose, compare, perturb }
      // perturb: the ALONG motion as a non-destructive what-if read. Given a set of flipped
      // assumption ids, return the authored-consequence overlay { states, trails }; never mutates.
      perturb: (flippedSet) => E.perturb(resolve, flippedSet || []),
      classify: (id) => E.classify(resolve(id)), // structural class of a node
      // gaps: the substrate's own objective holes as first-class typed facts. gaps() over the
      // whole graph, gaps(id) over a node's subtree. Read-only; the detector ranks nothing.
      gaps: (id) =>
        id == null
          ? E.detectGaps(sources)
          : E.detectGapsAt(sources, id),
      kinds: () => (E.SCHEMA ? E.SCHEMA.PRESENTATION_TYPES.slice() : []), // the closed kind set
      pipelineMembers: (rootId) => E.pipelineMembers(resolve, rootId),
      entry: () => entryId, // the case's learning-first entry id
      atlasRefs: () => (Array.isArray(sources.cases) ? sources.cases : []).reduce((a, c) => a.concat(c.atlas_refs || []), []),
      // the atlas a node can open compare on: its own atlas_ref, or its shared pipeline's.
      compareTargetFor: (id) => {
        const n = resolve(id);
        if (n && n.atlas_ref) return n.atlas_ref;
        const refs = (Array.isArray(sources.cases) ? sources.cases : []).reduce((a, c) => a.concat(c.atlas_refs || []), []);
        for (const aref of refs) {
          const entry = resolve(aref);
          const first = entry && entry.clones && entry.clones[0];
          const pipeId = first && resolve(first.node_id) && resolve(first.node_id).instantiates;
          if (pipeId && E.pipelineMembers(resolve, pipeId).has(id)) return aref;
        }
        return null;
      },

      // ---- write: a gated submission, not CRUD ----
      submit: (claim) => submitToGate(claim),
    };
  }

  const out = { createApi, submit: submitToGate };
  if (NODE) module.exports = out;
  else {
    root.createApi = createApi;
    root.EpiStackAPI = out;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
