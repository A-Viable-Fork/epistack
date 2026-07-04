// Role: the densified covid-origins case as a shell module (Prompt 23a). Renders the case as the
//   dispute it is: the evidence grounded to its floors, the contested interpretations, the origin
//   question in the forum with the zoonosis and lab-leak conclusions contradicts-linked, the priors
//   named as the computed crux, and the 23-order divergence as the reason the question is prior-driven.
//   The reading is the vendored build artifact (vendor/covid/reading.json), computed by the kernel at
//   build time (build/vendor-covid.mjs); the module renders it and computes no grade.
// Contract: registers on window.EpiShell as a case module. Reads the embedded #covid-reading JSON.
// Invariant: periphery; it touches no truth field and no kernel. The crux is shown as a candidate,
//   the priors as the divergence frontier and the shared evidence as the resolved region.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("covid-reading");
  if (!el) return;
  var R; try { R = JSON.parse(el.textContent); } catch (e) { return; }
  function grade(g) { return '<span class="shell-grade shell-grade-' + esc(g) + '">' + esc(g) + "</span>"; }
  function rows(list, cls) { return list.map(function (r) { return '<li><span class="eggs-claim">' + esc(r.statement) + "</span> " + grade(r.grade) + (r.source ? '<span class="eggs-src">' + esc(r.source) + "</span>" : "") + "</li>"; }).join(""); }

  window.EpiShell.register({
    id: "case-covid-origins", title: "Case: covid origins, the same evidence under different priors", kind: "case", order: 104,
    render: function (ctx) {
      var c = R.contradiction, cx = c.crux;
      var html = '<p class="shell-lede">' + esc(R.meta_question) + "</p>";
      html += "<h3>the shared evidence, grounded to its floors</h3><ul class=\"eggs-claims\">" + rows(R.evidence) + "</ul>";
      html += "<h3>the contested interpretations (the sample is measured, what it implies is argued)</h3><ul class=\"eggs-claims\">" + rows(R.interpretations) + "</ul>";
      html += "<h3>the origin question, in the forum</h3>";
      html += '<div class="eggs-recon"><div>' + esc(c.zoonosis.statement) + " " + grade(c.zoonosis.grade) + ' <b>contradicts</b> ' + esc(c.lableak.statement) + " " + grade(c.lableak.grade) + "</div>";
      html += '<div class="eggs-crux-line"><b>crux candidate: the priors</b> (the divergence frontier where the two support cones split)</div><ul class="eggs-frontier">' + cx.frontier.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>";
      html += '<div class="eggs-crux-line"><b>resolved sub-region: the shared evidence</b></div><ul class="eggs-resolved">' + cx.resolved.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ul>";
      html += '<div class="eggs-frame-note">' + esc(cx.note) + "</div></div>";
      html += "<h3>why the question is prior-driven</h3><ul class=\"eggs-claims\">" + rows(R.meta) + "</ul>";
      ctx.mount.innerHTML = html;
      if (ctx.registerNode) ctx.registerNode("covid origins, the same evidence under different priors", ctx.mount, "case-covid-origins", "case-covid-origins", "Case: covid origins, the same evidence under different priors");
    },
  });
})();
