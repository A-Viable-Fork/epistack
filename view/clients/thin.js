// Role: a THIN client. Tokens + a kind-to-look mapping over the default read path (drill).
//   It restyles the response and nothing more; it covers every node kind, so it renders the
//   whole map. The five-minute fork (docs/clients.md).
// Contract: renderThin(api, mount, client, opts) -> void. Uses only api.entry / resolve /
//   decompose; no compare, no dependents, no custom composition.
// Invariant: a client of the API, read-only against truth. It carries the render-everything
//   guarantee: its mapping has an entry for every kind in api.kinds().
"use strict";

function renderThin(api, mount, client, opts) {
  opts = opts || {};
  const mapping = client.mapping || {};
  const start = opts.node && api.has(opts.node) ? opts.node : api.entry();
  const state = { path: [start] };

  function focusChild(id) { if (!api.has(id)) return; state.path.push(id); render(); }
  function jumpTo(i) { state.path = state.path.slice(0, i + 1); render(); }
  function layoutFor(node) {
    const m = mapping[node.presentation && node.presentation.type];
    return m && m.layout ? m.layout : node.explain ? "teaching" : "terse";
  }

  function render() {
    mount.innerHTML = "";
    const pathNodes = state.path.map((id) => api.resolve(id)).filter(Boolean);
    const focusedId = state.path[state.path.length - 1];
    const focused = api.resolve(focusedId);

    mount.appendChild(renderRail(pathNodes, jumpTo, "Plain reader"));
    mount.appendChild(renderCard(focused, { layout: layoutFor(focused), motions: api.motions(focusedId) }));

    const fv = api.decompose(focusedId);
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
