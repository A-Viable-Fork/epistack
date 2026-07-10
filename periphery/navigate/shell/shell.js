// Role: the presentation shell (Prompt 17). Content-agnostic: it holds the navigation frame, the
//   chrome, the module registry, and the cross-link machinery, and nothing else. No case, no claim,
//   no paragraph of the paper lives here. It composes whatever modules register themselves, so
//   adding content is registering a module and never an edit to this file. This is the assessment
//   layer's reading surface: modules read the kernel only through the propose/read contract.
// Contract: window.EpiShell = { register(module), modules(), compose({api, nav, content}) }. A
//   module is { id, title, kind: "prose"|"case"|"demonstration", order?, render(ctx) }. ctx carries
//   the api (the contract), a mount element, and the cross-link helpers registerNode / linkToNode /
//   proseDiscusses / navigate. Periphery; reaches the kernel only through ctx.api.
// Invariant: the shell computes no grounding. Every grade, robustness reading, and gap a module
//   shows comes from an api read; the shell only frames and links. Cross-linking runs both ways: a
//   claim-reference in prose navigates to its live graph node, and a node surfaces the prose about it.
(function (root) {
  "use strict";
  var registry = [];
  var KIND_ORDER = { prose: 0, case: 1, demonstration: 2 };

  function register(mod) {
    if (!mod || !mod.id || typeof mod.render !== "function") throw new Error("EpiShell.register: a module needs an id and a render()");
    registry.push(mod);
  }
  function unregister(id) { registry = registry.filter(function (m) { return m.id !== id; }); }
  function modules() {
    return registry.slice().map(function (m, i) { return { m: m, i: i }; })
      .sort(function (a, b) {
        var oa = a.m.order != null ? a.m.order : KIND_ORDER[a.m.kind] != null ? KIND_ORDER[a.m.kind] : 9;
        var ob = b.m.order != null ? b.m.order : KIND_ORDER[b.m.kind] != null ? KIND_ORDER[b.m.kind] : 9;
        return oa - ob || a.i - b.i;
      }).map(function (x) { return x.m; });
  }

  function compose(opts) {
    var api = opts.api, navEl = opts.nav, contentEl = opts.content;
    navEl.innerHTML = ""; contentEl.innerHTML = "";
    var mods = modules();

    // cross-link state, keyed by stable node key (a node id like "lhc.claim"), resolved in a second
    // pass once every module and its node anchors exist. Each anchor carries the node's content
    // identity so the reading is read live from the graph.
    var nodeAnchors = {};      // nodeKey -> { el, moduleId, title, identity }
    var proseAbout = {};       // nodeKey -> [ { moduleId, title } ]
    var pendingLinks = [];     // { el, nodeKey } claim-references waiting for their node anchor

    // read a node's live grounding and robustness through the contract (never computed here).
    function nodeReading(nodeKey) {
      var anchor = nodeAnchors[nodeKey];
      var identity = anchor ? anchor.identity : nodeKey; // fall back to treating the key as an identity
      var rows = api.read({ identity: identity }) || [];
      // a human node key (e.g. "lhc.claim") is not a content-hash identity; the store carries it as the
      // statement prefix, so resolve it through the contract by statement match. Still no grounding here.
      if (!rows.length && nodeKey) rows = api.read({ contains: nodeKey }) || [];
      var g = rows[0];
      if (!g) return null;
      var r = (api.robustness && api.robustness({ identity: g.identity }) || [])[0];
      return { grade: g.earned_grade, declared: g.declared_grade, statement: g.statement,
               robustness: r ? r.robustness : null, fragile: r ? r.fragile : null,
               spofs: r ? (r.single_points_of_failure || []).length : null };
    }

    var ctx = {
      api: api,
      // a case module calls this so a graph node becomes a navigable anchor other modules link to;
      // the identity lets any module read that node's live grounding and robustness through the api.
      registerNode: function (nodeKey, el, identity, moduleId, title) { nodeAnchors[nodeKey] = { el: el, identity: identity, moduleId: moduleId, title: title }; },
      // a prose module calls this to mark a claim-reference; it returns an <a> resolved in pass 2 to
      // scroll to the node and show that node's live grounding and robustness (read through the api).
      linkToNode: function (nodeKey, label, fromModuleId, fromTitle) {
        var a = document.createElement("a");
        a.className = "shell-claimref"; a.href = "#"; a.textContent = label; a.setAttribute("data-node", nodeKey);
        pendingLinks.push({ el: a, nodeKey: nodeKey });
        (proseAbout[nodeKey] = proseAbout[nodeKey] || []).push({ moduleId: fromModuleId, title: fromTitle });
        return a;
      },
      navigate: function (moduleId) { location.hash = "#mod-" + moduleId; },
      nodeReading: nodeReading,
    };

    // the essential spine: the sections a judge follows straight through for a complete submission,
    // summarized at the top of the nav so the reading budget is answered structurally. The depth stays
    // fully present below, marked as fork-in-by-choice rather than removed.
    var spineMods = mods.filter(function (m) { return m.spine; });
    if (spineMods.length) {
      var sh = document.createElement("div"); sh.className = "shell-nav-grouphead"; sh.textContent = "The essential spine"; navEl.appendChild(sh);
      spineMods.forEach(function (m) {
        var a = document.createElement("a");
        a.href = "#mod-" + m.id; a.className = "shell-nav-link shell-nav-spine shell-nav-spineitem";
        a.textContent = m.title; navEl.appendChild(a);
      });
      var dh = document.createElement("div"); dh.className = "shell-nav-grouphead shell-nav-grouphead-depth"; dh.textContent = "All sections, depth to fork into"; navEl.appendChild(dh);
    }

    // pass 1: nav + render each module into its section. Spine sections read prominent; depth reads
    // available but secondary, so the same list is a short spine and a reachable depth at a glance.
    mods.forEach(function (m) {
      var link = document.createElement("a");
      link.href = "#mod-" + m.id; link.className = "shell-nav-link shell-nav-" + m.kind + (m.spine ? " shell-nav-spine" : " shell-nav-depth");
      link.textContent = m.title; navEl.appendChild(link);

      var sec = document.createElement("section");
      sec.id = "mod-" + m.id; sec.className = "shell-module shell-" + m.kind + (m.spine ? " shell-spine" : " shell-depth");
      var h = document.createElement("h2"); h.className = "shell-module-title"; h.textContent = m.title; sec.appendChild(h);
      var body = document.createElement("div"); body.className = "shell-body"; sec.appendChild(body);
      contentEl.appendChild(sec);
      try { m.render(Object.assign({}, ctx, { mount: body, moduleId: m.id, moduleTitle: m.title })); }
      catch (e) { body.innerHTML = '<div class="shell-error">module ' + m.id + " failed: " + (e && e.message) + "</div>"; }
    });

    // pass 2: resolve the cross-links now that every node anchor is registered.
    pendingLinks.forEach(function (p) {
      var anchor = nodeAnchors[p.nodeKey];
      var reading = nodeReading(p.nodeKey);
      if (reading) {
        var tag = document.createElement("span"); tag.className = "shell-claimref-grade";
        tag.textContent = " [" + reading.grade + (reading.robustness ? " / robustness " + reading.robustness : "") + "]";
        p.el.appendChild(tag);
        p.el.title = "live reading: grade " + reading.grade + (reading.robustness ? ", robustness " + reading.robustness : "") + (reading.fragile ? ", fragile" : "");
      }
      if (anchor) {
        p.el.addEventListener("click", function (e) { e.preventDefault(); anchor.el.scrollIntoView({ behavior: "smooth", block: "center" }); anchor.el.classList.add("shell-node-flash"); setTimeout(function () { anchor.el.classList.remove("shell-node-flash"); }, 1400); });
      } else { p.el.classList.add("shell-claimref-unresolved"); }
    });
    // reverse link: on each node anchor, surface the prose modules that discuss it.
    Object.keys(proseAbout).forEach(function (nodeKey) {
      var anchor = nodeAnchors[nodeKey]; if (!anchor) return;
      proseAbout[nodeKey].forEach(function (src) {
        var back = document.createElement("a"); back.className = "shell-backlink"; back.href = "#mod-" + src.moduleId;
        back.textContent = "← discussed in " + src.title;
        anchor.el.appendChild(back);
      });
    });

    return { moduleCount: mods.length, nodeCount: Object.keys(nodeAnchors).length, linkCount: pendingLinks.length };
  }

  root.EpiShell = { register: register, unregister: unregister, modules: modules, compose: compose };
})(typeof window !== "undefined" ? window : this);
