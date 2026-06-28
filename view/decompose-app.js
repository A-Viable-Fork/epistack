// Role: the v1 decompose surface. Boots the spine rail + focused card + collapsed children
//   over the population pipeline, and drives drill-down navigation. Decompose only (compare
//   is v2, perturb is v3). See docs/architecture-spec.md sections 6 and 8.
// Contract: reads the inlined data (PRIMITIVES, CASE, ATLAS), builds the registry and the
//   resolver (engine/registry, engine/resolve), and renders through the engine (focusView,
//   motions) and view (renderCard, renderChildCard, renderRail). Mounts into #app.
// Invariant: view owns ephemeral UI state (the path the user clicked), not data. Every
//   lookup goes through resolve(id); the graph is immutable, navigation only changes which
//   node is focused (T0-3). No localStorage.
"use strict";

(function () {
  // build the one registry and resolver; every lookup routes through resolve (Phase A).
  const registry = buildRegistry({ primitives: PRIMITIVES, atlas: ATLAS, cases: [CASE] });
  const resolve = makeResolver(registry);

  const ROOT_ID = "pipe.root";
  const caseLabel = "Population mismatch";

  // explicit UI state: the path of clicks from the root to the focused node
  const state = { path: [ROOT_ID] };

  const mount = document.getElementById("app");

  function focusChild(id) {
    if (!resolve(id)) return;
    state.path.push(id);
    render();
  }
  function jumpTo(index) {
    state.path = state.path.slice(0, index + 1);
    render();
  }
  function reset() {
    state.path = [ROOT_ID];
    render();
  }

  function render() {
    mount.innerHTML = "";
    const pathNodes = state.path.map((id) => resolve(id)).filter(Boolean);
    const focusedId = state.path[state.path.length - 1];
    const focused = resolve(focusedId);

    mount.appendChild(renderRail(pathNodes, jumpTo, caseLabel));

    const fv = focusView(resolve, focusedId);
    mount.appendChild(renderCard(focused, { motions: motions(focused, resolve), resolve: resolve }));

    // collapsed children, exactly one level down
    if (fv.children.length) {
      const wrap = document.createElement("section");
      wrap.className = "children";
      const h = document.createElement("h3");
      h.className = "children-head";
      h.textContent = "made of";
      wrap.appendChild(h);
      fv.children.forEach((entry) => wrap.appendChild(renderChildCard(entry, focusChild)));
      mount.appendChild(wrap);
    }

    window.scrollTo({ top: 0 });
  }

  // a quiet reset affordance in the corner
  const home = document.getElementById("home");
  if (home) home.addEventListener("click", reset);

  render();
})();
