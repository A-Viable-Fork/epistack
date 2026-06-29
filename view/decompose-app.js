// Role: the decompose + compare surface. Boots the spine rail + focused card + collapsed
//   children over the population pipeline, drives drill-down, and opens the cross-case
//   compare view (the SIDEWAYS reveal). See docs/architecture-spec.md sections 6 and 8.
// Contract: reads the inlined data, builds the registry + resolver, and renders through the
//   engine (focusView, motions, compare, pipelineMembers) and view (renderCard, renderRail,
//   renderView). Mounts into #app.
// Invariant: view owns ephemeral UI state (the path, and whether the compare view is open),
//   not data. Every lookup goes through resolve(id); the graph is immutable (T0-3). No
//   localStorage.
"use strict";

(function () {
  // build the one registry and resolver; every lookup routes through resolve.
  // presentation components (visuals, card layouts, views) are registered alongside the data.
  const registry = buildRegistry({
    primitives: PRIMITIVES,
    atlas: ATLAS,
    cases: [CASE],
    components: Object.assign({}, VISUALS, CARD_LAYOUTS, typeof VIEW_COMPONENTS !== "undefined" ? VIEW_COMPONENTS : {}),
    forks: typeof FORKS !== "undefined" ? FORKS : undefined,
  });
  const resolve = makeResolver(registry);

  // learning-first entry: open at the concrete contested question (B5), not the abstract root.
  const ROOT_ID = CASE.entry || "pipe.root";
  const caseLabel = "Two arguments";

  // precompute, for each atlas the case names, the set of nodes "inside" its shared pipeline.
  // a focused node that is a pipeline member (root, stage, or primitive) can open compare.
  const atlasPipelines = (CASE.atlas_refs || []).map((aref) => {
    const entry = resolve(aref);
    const first = entry && entry.clones && entry.clones[0];
    const pipeId = first && resolve(first.node_id) && resolve(first.node_id).instantiates;
    return { aref, members: pipeId ? pipelineMembers(resolve, pipeId) : new Set() };
  });
  function compareAtlasFor(id) {
    const n = resolve(id);
    if (n && n.atlas_ref) return n.atlas_ref;
    for (const p of atlasPipelines) if (p.members.has(id)) return p.aref;
    return null;
  }

  // a hash names any resolvable id as the entry (points the reader at a fork, a node, the root).
  const hash = typeof location !== "undefined" && location.hash ? decodeURIComponent(location.hash.slice(1)) : "";
  const startId = hash && resolve(hash) ? hash : ROOT_ID;

  // explicit UI state: the click path, and the open compare atlas (null = decompose mode).
  const state = { path: [startId], compare: null };
  const mount = document.getElementById("app");

  function focusChild(id) { if (!resolve(id)) return; state.compare = null; state.path.push(id); render(); }
  function jumpTo(index) { state.compare = null; state.path = state.path.slice(0, index + 1); render(); }
  function goTo(id) { if (!resolve(id)) return; state.compare = null; state.path = [id]; render(); }
  function reset() { state.compare = null; state.path = [ROOT_ID]; render(); }
  function openCompare(atlasId) { state.compare = atlasId; render(); }
  function closeCompare() { state.compare = null; render(); }

  function render() {
    mount.innerHTML = "";
    const pathNodes = state.path.map((id) => resolve(id)).filter(Boolean);
    const focusedId = state.path[state.path.length - 1];
    const focused = resolve(focusedId);

    // ---- compare mode: the cross-case reveal ----
    if (state.compare) {
      const back = document.createElement("nav");
      back.className = "rail";
      const b = document.createElement("button");
      b.className = "rail-seg";
      b.innerHTML = "&lsaquo; back to " + (focused.label || focusedId);
      b.addEventListener("click", closeCompare);
      back.appendChild(b);
      const sep = document.createElement("span"); sep.className = "rail-sep"; sep.textContent = "/";
      const cur = document.createElement("span"); cur.className = "rail-seg rail-current"; cur.textContent = "compare";
      back.appendChild(sep); back.appendChild(cur);
      mount.appendChild(back);

      const model = compare(resolve, state.compare);
      mount.appendChild(renderView("view.compare", model, { onStage: goTo, resolve: resolve }));
      window.scrollTo({ top: 0 });
      return;
    }

    // ---- decompose mode ----
    mount.appendChild(renderRail(pathNodes, jumpTo, caseLabel));

    // compare is reachable both ways: as the sideways motion from any pipeline node, and as
    // the end-of-path reveal (a primitive labels it "now see the surprising part").
    const atlasId = compareAtlasFor(focusedId);
    const isLeaf = !(focused.children && focused.children.length);
    const onCompare = atlasId ? () => openCompare(atlasId) : null;
    const compareLabel = isLeaf ? "now see the surprising part" : "compare the two cases";

    const fv = focusView(resolve, focusedId);
    mount.appendChild(renderCard(focused, {
      motions: motions(focused, resolve), resolve: resolve, onCompare: onCompare, compareLabel: compareLabel,
    }));

    if (fv.children.length) {
      const wrap = document.createElement("section");
      wrap.className = "children";
      const h = document.createElement("h3"); h.className = "children-head"; h.textContent = "made of";
      wrap.appendChild(h);
      fv.children.forEach((entry) => wrap.appendChild(renderChildCard(entry, focusChild)));
      mount.appendChild(wrap);
    }

    window.scrollTo({ top: 0 });
  }

  const home = document.getElementById("home");
  if (home) home.addEventListener("click", reset);

  render();
})();
