// Role: the case modules (Prompt 17). Each of the three migrated cases is a module: its focus
//   conclusion, that conclusion's grounding and robustness read live through the API, and the claims
//   it rests on. Registered on the shell; adding a case is registering another module.
// Contract: registers on window.EpiShell. Each module reads api.read and api.robustness for its
//   focus node, registers the node as a cross-link anchor (so prose can navigate to it and it can
//   surface the prose about it), and renders the reading. No case data lives here beyond the focus
//   node's stable id; the content is the graph, read through the contract.
// Invariant: periphery; the kernel is reached only through ctx.api. The module surfaces the engine's
//   own readings (grade, robustness, fragility, single points of failure), it computes none of them.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var keyOf = function (stmt) { return String(stmt).split(":")[0]; };
  var label = function (id, claims) { var e = claims.filter(function (c) { return c.identity === id; })[0]; return e ? keyOf(e.statement) : id.slice(0, 10); };

  // the three cases, each named by the stable id of its focus conclusion and its lede.
  var CASES = [
    { id: "case-lhc", title: "Case: the LHC survival argument", focus: "lhc.antecedent:",
      lede: "A produced black hole is dangerous only if production AND stopping AND accretion all hold. The densest long-lived bodies survive, so by modus tollens a conjunct is false. The conjunction is read below, live." },
    { id: "case-covid", title: "Case: the COVID origin", focus: "covid.instance:",
      lede: "The early-case clustering returns a priced prior, not a measurement of origin, because the surveillance draw is non-exchangeable. The termination is read below, live." },
    { id: "case-eggs", title: "Case: eggs, the population split", focus: "eggs.instance: eggs, individual dietary response (population",
      lede: "Stage 1 holds, so the population claim closes on a measurement; stage 2 fails, so the individual application does not follow. The population conclusion is read below, live." },
  ];

  CASES.forEach(function (spec) {
    window.EpiShell.register({
      id: spec.id, title: spec.title, kind: "case",
      render: function (ctx) {
        var claims = ctx.api.read({});
        var focus = claims.filter(function (c) { return c.statement.indexOf(spec.focus) === 0; })[0];
        if (!focus) { ctx.mount.innerHTML = "<p>focus node not found in the graph.</p>"; return; }
        var rob = (ctx.api.robustness({ identity: focus.identity }) || [])[0] || {};

        var html = '<p class="shell-lede">' + esc(spec.lede) + "</p>";
        // the focus node's live reading: grade, robustness, fragility, single points of failure.
        html += '<div class="shell-reading" id="reading-' + spec.id + '">';
        html += '<div class="shell-node-name">' + esc(keyOf(focus.statement)) + "</div>";
        html += '<div class="shell-grades"><span>grade <b>' + esc(focus.earned_grade) + "</b></span>";
        html += "<span>robustness <b>" + esc(rob.robustness || "—") + "</b></span>";
        html += "<span>" + (rob.fragile ? "fragile" : "redundant") + "</span>";
        html += "<span>" + ((rob.single_points_of_failure || []).length) + " single point(s) of failure</span></div>";
        if (rob.correlated_evidence_flag) html += '<div class="shell-flag">correlated-evidence flag: ' + esc((rob.correlated_evidence_flag.shared_points || []).map(function (id) { return label(id, claims); }).join(", ")) + "</div>";
        html += "</div>";

        // what the conclusion rests on: its support closure, each claim with its live grade.
        var closure = (rob.single_points_of_failure || []).map(function (s) { return s.identity; });
        if (closure.length) {
          html += '<details class="shell-closure"><summary>rests on ' + closure.length + " claim(s), each a single point of failure</summary><ul>";
          closure.slice(0, 40).forEach(function (id) {
            var c = claims.filter(function (x) { return x.identity === id; })[0];
            if (c) html += "<li><code>" + esc(keyOf(c.statement)) + "</code> &middot; " + esc(c.earned_grade) + "</li>";
          });
          html += "</ul></details>";
        }
        ctx.mount.innerHTML = html;

        // register the focus node as a cross-link anchor: prose can navigate to it, and it will
        // surface the prose that discusses it (the reverse link the shell adds in pass 2).
        ctx.registerNode(keyOf(focus.statement), document.getElementById("reading-" + spec.id), focus.identity, spec.id, spec.title);
      },
    });
  });
})();
