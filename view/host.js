// Role: the host. The wiring that builds the API from storage once, selects the active client,
//   applies that client's tokens, and runs it. The host is infrastructure, not a client: it is
//   the only place the data is named, so clients never see storage (docs/clients.md).
// Contract: boots on load; #client=<name> in the hash selects the client, #node=<id> sets the
//   entry node. Renders a switcher and mounts the active client into #app.
// Invariant: clients receive only the api object; they never see PRIMITIVES/CASE/ATLAS. Tokens
//   are applied as CSS custom properties so switching a client reskins the whole surface.
"use strict";

(function () {
  // build the API over storage. This is the wiring boundary; below here is the store.
  const api = createApi({
    primitives: PRIMITIVES,
    atlas: ATLAS,
    cases: [CASE],
    components: Object.assign({}, VISUALS, CARD_LAYOUTS, VIEW_COMPONENTS, CLIENTS),
    forks: typeof FORKS !== "undefined" ? FORKS : undefined,
  });

  const RENDERERS = { teaching: renderTeaching, thin: renderThin, auditor: renderAuditor };
  const SHORT = {
    teaching: "client.teaching",
    auditor: "client.auditor",
    plain: "client.plain",
    warm: "client.plain.warm",
  };
  const SWITCH = [
    { name: "teaching", label: "Teaching walk" },
    { name: "auditor", label: "Auditor console" },
    { name: "plain", label: "Plain reader" },
  ];

  const mount = document.getElementById("app");

  function parseHash() {
    const h = typeof location !== "undefined" ? location.hash.replace(/^#/, "") : "";
    const out = {};
    h.split("&").forEach((p) => {
      const i = p.indexOf("=");
      if (i > 0) out[p.slice(0, i)] = decodeURIComponent(p.slice(i + 1));
    });
    return out;
  }

  function applyTokens(tokens) {
    const root = document.documentElement;
    if (tokens) for (const k of Object.keys(tokens)) root.style.setProperty(k, tokens[k]);
  }

  function renderSwitcher(activeName) {
    let bar = document.getElementById("switcher");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "switcher";
      bar.className = "switcher";
      mount.parentNode.insertBefore(bar, mount);
    }
    bar.innerHTML = '<span class="sw-label">client</span>';
    SWITCH.forEach((s) => {
      const b = document.createElement("button");
      b.className = "sw-btn" + (s.name === activeName ? " on" : "");
      b.textContent = s.label;
      b.addEventListener("click", () => { location.hash = "client=" + s.name; });
      bar.appendChild(b);
    });
  }

  function boot() {
    const q = parseHash();
    const name = q.client && SHORT[q.client] ? q.client : "teaching";
    const client = api.resolve(SHORT[name]);
    if (!client) { mount.textContent = "no client: " + name; return; }
    applyTokens(client.tokens);
    document.body.setAttribute("data-client", name);
    // the reader lede is teaching framing; the auditor brings its own console header.
    const lede = document.getElementById("lede");
    if (lede) lede.style.display = name === "auditor" ? "none" : "";
    renderSwitcher(name);
    const render = RENDERERS[client.renderer];
    if (!render) { mount.textContent = "no renderer for " + client.id; return; }
    render(api, mount, client, { node: q.node });
  }

  window.addEventListener("hashchange", boot);
  const home = document.getElementById("home");
  if (home) home.addEventListener("click", () => { location.hash = ""; boot(); });

  boot();
})();
