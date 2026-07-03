// Role: the demonstration modules (Prompt 17). Three live interactive pieces registered on the
//   shell: the compose-gate panel, the propose widget, and the robustness reading. Each is a module
//   with the standard interface; the shell composes them wherever they are registered.
// Contract: registers on window.EpiShell. The compose-gate and propose modules clone their markup
//   from a <template> and call the panel's init(); the robustness module reads api.robustness.
// Invariant: periphery; reads the kernel only through ctx.api (the propose/read contract). Computes
//   no grounding, no robustness, no grade of its own; every reading comes back from an api read.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  // -- the compose-gate panel: uncoordinated contributions composed through the real gate --
  window.EpiShell.register({
    id: "demo-compose", title: "Run the gate", kind: "demonstration", order: 20,
    render: function (ctx) {
      var t = document.getElementById("tmpl-compose");
      if (t) ctx.mount.appendChild(t.content.cloneNode(true));
      if (window.EpiComposeGate) window.EpiComposeGate.init();
    },
  });

  // -- the propose widget: a judge proposes a typed claim and reads the gate's receipt --
  window.EpiShell.register({
    id: "demo-propose", title: "Propose a claim", kind: "demonstration", order: 21,
    render: function (ctx) {
      var t = document.getElementById("tmpl-propose");
      if (t) ctx.mount.appendChild(t.content.cloneNode(true));
      if (window.EpiProposeWidget) window.EpiProposeWidget.init();
    },
  });

  // -- the robustness reading: the fragility of each case's top conclusion, read live --
  window.EpiShell.register({
    id: "demo-robustness", title: "Robustness reading", kind: "demonstration", order: 22,
    render: function (ctx) {
      var targets = [
        ["LHC, the survival argument", "lhc.antecedent:"],
        ["LHC, the hazard-bounded conclusion", "lhc.claim:"],
        ["COVID, the priced-prior termination", "covid.instance:"],
        ["eggs, the population conclusion", "eggs.instance: eggs, individual dietary response (population"],
      ];
      var claims = ctx.api.read({});
      var rows = targets.map(function (t) {
        var e = claims.filter(function (c) { return c.statement.indexOf(t[1]) === 0; })[0];
        if (!e) return "";
        var r = (ctx.api.robustness({ identity: e.identity }) || [])[0] || {};
        var spof = r.worst_removal ? esc((claims.filter(function (c) { return c.identity === r.worst_removal.identity; })[0] || {}).statement || "").split(":")[0] : "—";
        return "<tr><td>" + esc(t[0]) + "</td><td>" + esc(r.grade || "—") + "</td><td>" + esc(r.robustness || "—") +
          "</td><td>" + (r.fragile ? "fragile" : "redundant") + "</td><td>" + spof + "</td></tr>";
      }).join("");
      ctx.mount.innerHTML =
        '<p class="shell-lede">Grounding says how high a claim reaches; robustness says how much of that reach survives the loss of one support beneath it. This is read live from the graph through the API, not written here.</p>' +
        '<table class="shell-table"><thead><tr><th>conclusion</th><th>grade</th><th>robustness</th><th>fragility</th><th>worst single point of failure</th></tr></thead><tbody>' +
        rows + "</tbody></table>";
    },
  });
})();
