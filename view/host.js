// Role: the host. The wiring that builds the API from storage once, registers the fat clients
//   and the thin-client manifests, validates each manifest against the palette, applies the
//   active client's tokens, and runs it. The host is infrastructure, not a client.
// Contract: boots on load; #client=<name> selects the client, #node=<id> sets the entry node.
//   Renders a gallery (every client, node-preserving, shareable by hash) and mounts into #app.
// Invariant: clients receive only the api object; they never see storage. A malformed thin
//   manifest fails loudly in the gallery and never renders a broken node (docs/thin-clients.md).
"use strict";

(function () {
  const manifests = typeof MANIFESTS !== "undefined" ? MANIFESTS : {};

  // every bundled case registers itself on window.CASES (the bundler wraps each case include so
  // their `const CASE` declarations do not collide). The first case is the default entry.
  const cases = typeof window !== "undefined" && Array.isArray(window.CASES) ? window.CASES : (typeof CASE !== "undefined" ? [CASE] : []);

  // build the API over storage, registering the fat client descriptors and the thin manifests.
  const api = createApi({
    primitives: PRIMITIVES,
    atlas: ATLAS,
    bodies: typeof BODIES !== "undefined" ? BODIES : undefined,
    cases: cases,
    components: Object.assign({}, VISUALS, CARD_LAYOUTS, VIEW_COMPONENTS, CLIENTS, manifests),
    forks: typeof FORKS !== "undefined" ? FORKS : undefined,
  });

  const RENDERERS = { teaching: renderTeaching, thin: renderThin, auditor: renderAuditor };
  const short = (id) => id.replace(/^client\./, "");

  // the gallery: every client, fat and thin, with thin manifests validated against the palette.
  const gallery = [];
  for (const c of Object.values(CLIENTS)) {
    gallery.push({ id: c.id, name: short(c.id), title: c.title || c.id, tier: c.tier, renderer: c.renderer, problems: [] });
  }
  for (const id of Object.keys(manifests)) {
    const resolved = api.resolve(id) || manifests[id];
    const problems = typeof validateManifest === "function" ? validateManifest(resolved, api.kinds()) : [];
    gallery.push({ id, name: short(id), title: (resolved && resolved.title) || id, tier: "thin", renderer: "thin", problems });
  }
  const byName = {};
  gallery.forEach((g) => (byName[g.name] = g));

  const mount = document.getElementById("app");

  function parseHash() {
    const h = typeof location !== "undefined" ? location.hash.replace(/^#/, "") : "";
    const out = {};
    h.split("&").forEach((p) => { const i = p.indexOf("="); if (i > 0) out[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1)); });
    return out;
  }
  function applyTokens(tokens) {
    const r = document.documentElement;
    if (tokens) for (const k of Object.keys(tokens)) r.style.setProperty(k, tokens[k]);
  }
  function renderGallery(activeName, node) {
    let bar = document.getElementById("switcher");
    if (!bar) { bar = document.createElement("div"); bar.id = "switcher"; bar.className = "switcher"; mount.parentNode.insertBefore(bar, mount); }
    bar.innerHTML = '<span class="sw-label">client</span>';
    gallery.forEach((g) => {
      const b = document.createElement("button");
      const broken = g.problems && g.problems.length;
      b.className = "sw-btn" + (g.name === activeName ? " on" : "") + (broken ? " broken" : "") + (g.tier === "thin" ? " thin" : "");
      b.textContent = g.title + (g.tier === "thin" ? "" : " · fat");
      b.title = broken ? "invalid manifest: " + g.problems[0] : g.tier + " client";
      b.addEventListener("click", () => { location.hash = "client=" + g.name + (node ? "&node=" + node : ""); });
      bar.appendChild(b);
    });
  }

  function boot() {
    const q = parseHash();
    const g = q.client && byName[q.client] ? byName[q.client] : byName["teaching"];
    const node = q.node;
    renderGallery(g.name, node);
    document.body.setAttribute("data-client", g.name);
    const lede = document.getElementById("lede");
    if (lede) lede.style.display = g.renderer === "teaching" || g.renderer === "thin" ? "" : "none";

    const client = api.resolve(g.id) || g;
    // a malformed thin manifest fails loudly and renders nothing broken.
    if (g.problems && g.problems.length) {
      applyTokens(null);
      mount.innerHTML = '<div class="client-error"><b>This thin client manifest is invalid.</b><ul>' +
        g.problems.map((p) => "<li>" + String(p).replace(/</g, "&lt;") + "</li>").join("") + "</ul></div>";
      return;
    }
    applyTokens(client.tokens);
    const render = RENDERERS[g.renderer];
    if (!render) { mount.textContent = "no renderer for " + g.id; return; }
    render(api, mount, client, { node: node });
  }

  window.addEventListener("hashchange", boot);
  const home = document.getElementById("home");
  if (home) home.addEventListener("click", () => { location.hash = ""; boot(); });
  boot();
})();
