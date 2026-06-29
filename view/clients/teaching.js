// Role: the teaching client (FAT). The learning-first walk: concrete entry, drill, the compare
//   reveal, the searchlight. Renders exactly as v1. Reads only through the API; touches no
//   truth field and never imports the store (docs/clients.md).
// Contract: renderTeaching(api, mount, client, opts) -> void. api is the engine API; client is
//   the descriptor (tokens + mapping); opts.node optionally sets the entry node.
// Invariant: a client of the API, read-only against truth. Its kind-to-look mapping is the thin
//   part it carries; its entry sequencing and compare are the fat part.
"use strict";

function renderTeaching(api, mount, client, opts) {
  opts = opts || {};
  const mapping = client.mapping || {};
  const ROOT_ID = api.entry();
  const REVEAL_ID = "pipe.root";
  const caseLabel = "Two arguments";
  const start = opts.node && api.has(opts.node) ? opts.node : ROOT_ID;
  const state = { path: [start], compare: null };

  function focusChild(id) { if (!api.has(id)) return; state.compare = null; state.path.push(id); render(); }
  function jumpTo(i) { state.compare = null; state.path = state.path.slice(0, i + 1); render(); }
  function goTo(id) { if (!api.has(id)) return; state.compare = null; state.path = [id]; render(); }
  function openCompare(atlasId) { state.compare = atlasId; render(); }
  function closeCompare() { state.compare = null; render(); }

  // the visual the client maps this node's kind to, rendered from the node's presentation.data.
  function visualFor(node) {
    const m = mapping[node.presentation && node.presentation.type];
    if (!m || !m.visual || typeof renderVisual !== "function") return null;
    const d = (node.presentation && node.presentation.data) || {};
    if (m.visual === "viz.searchlight")
      return renderVisual("viz.searchlight", { sigma: d.spread, marker: d.marker, markerLabel: d.markerLabel });
    return renderVisual(m.visual, d);
  }
  function layoutFor(node) {
    const m = mapping[node.presentation && node.presentation.type];
    return m && m.layout ? m.layout : node.explain ? "teaching" : "terse";
  }

  function render() {
    mount.innerHTML = "";
    const pathNodes = state.path.map((id) => api.resolve(id)).filter(Boolean);
    const focusedId = state.path[state.path.length - 1];
    const focused = api.resolve(focusedId);

    if (state.compare) {
      const back = document.createElement("nav");
      back.className = "rail";
      const b = document.createElement("button");
      b.className = "rail-seg";
      b.innerHTML = "&lsaquo; back to " + (focused.label || focusedId);
      b.addEventListener("click", closeCompare);
      const sep = document.createElement("span"); sep.className = "rail-sep"; sep.textContent = "/";
      const cur = document.createElement("span"); cur.className = "rail-seg rail-current"; cur.textContent = "compare";
      back.appendChild(b); back.appendChild(sep); back.appendChild(cur);
      mount.appendChild(back);
      mount.appendChild(renderView("view.compare", api.compare(state.compare), { onStage: goTo }));
      window.scrollTo({ top: 0 });
      return;
    }

    mount.appendChild(renderRail(pathNodes, jumpTo, caseLabel));

    const atlasId = api.compareTargetFor(focusedId);
    const isLeaf = !(focused.children && focused.children.length);
    const onCompare = atlasId ? () => openCompare(atlasId) : null;
    const compareLabel = isLeaf ? "now see the surprising part" : "compare the two cases";

    const fv = api.decompose(focusedId);
    mount.appendChild(renderCard(focused, {
      layout: layoutFor(focused),
      visualEl: visualFor(focused),
      visualAside: "The field underneath never changes. Only your searchlight moves.",
      motions: api.motions(focusedId),
      onCompare: onCompare,
      compareLabel: compareLabel,
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

  render();
}
