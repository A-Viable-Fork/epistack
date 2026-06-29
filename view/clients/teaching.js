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

  // the objective gaps the API detects at this node or in its subtree, surfaced read-only. The
  // panel reports each gap as found and ranks nothing: which gap matters most is left to the
  // reader (docs/architecture-storage-api-clients.md; the subjectivity boundary).
  function renderGapPanel(gaps) {
    const sec = document.createElement("section");
    sec.className = "gaps";
    const h = document.createElement("h3");
    h.className = "gaps-head";
    h.textContent = (gaps.length === 1 ? "1 open gap here" : gaps.length + " open gaps here");
    sec.appendChild(h);
    const note = document.createElement("p");
    note.className = "gaps-note";
    note.textContent =
      "These are the holes the map knows about at this step, reported as found. Which one matters most is yours to weigh; the map does not rank them.";
    sec.appendChild(note);
    const ul = document.createElement("ul");
    ul.className = "gap-list";
    gaps.forEach((g) => {
      const li = document.createElement("li");
      li.className = "gap gap-" + g.kind;
      const row = document.createElement("div");
      row.className = "gap-row";
      const kind = document.createElement("span");
      kind.className = "gap-kind";
      kind.textContent = g.kind;
      const at = document.createElement("span");
      at.className = "gap-at";
      at.textContent = g.at;
      row.appendChild(kind);
      row.appendChild(at);
      li.appendChild(row);
      const miss = document.createElement("p");
      miss.className = "gap-missing";
      miss.textContent = g.missing;
      li.appendChild(miss);
      const dis = document.createElement("p");
      dis.className = "gap-discharge";
      const lab = document.createElement("span");
      lab.className = "gap-label";
      lab.textContent = "closes when ";
      dis.appendChild(lab);
      dis.appendChild(document.createTextNode(g.discharge));
      li.appendChild(dis);
      const refText = g.sorry_ref
        ? "sorry ledger: " + g.sorry_ref
        : g.ledger_ref
        ? "status ledger: " + g.ledger_ref
        : "";
      if (refText) {
        const ref = document.createElement("span");
        ref.className = "gap-ref";
        ref.textContent = refText;
        li.appendChild(ref);
      }
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    return sec;
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

    const nodeGaps = (api.gaps ? api.gaps(focusedId) : []) || [];
    if (nodeGaps.length) mount.appendChild(renderGapPanel(nodeGaps));

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
