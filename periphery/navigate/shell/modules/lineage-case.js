// Role: the lineage case as the critique's fourth exhibit, lighter than the three domain cases because
//   it argues about the architecture, not about a domain. It leads with the novelty conjecture and its
//   earned grade, shows the five independent near-miss gaps that ground it, and puts the institutions
//   where the mechanisms already run by hand one click down. The reading is the vendored build artifact
//   (vendor/lineage/reading.json), computed by the kernel at build time; the module renders it.
// Contract: registers on window.EpiShell as a case module. Reads the embedded #lineage-reading JSON.
// Invariant: periphery; it touches no truth field and no kernel. The conjecture's grade is the gate's,
//   and where it earns below what it declared the demotion is shown, not hidden: that is the finding.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("lineage-reading");
  if (!el) return;
  var R; try { R = JSON.parse(el.textContent); } catch (e) { return; }
  function grade(g) { return '<span class="shell-grade shell-grade-' + esc(g) + '">' + esc(g) + "</span>"; }
  function claimRows(list) { return list.map(function (r) { return '<li><span class="eggs-claim">' + esc(r.statement) + "</span> " + grade(r.grade) + (r.source ? '<span class="eggs-src">' + esc(r.source) + "</span>" : "") + "</li>"; }).join(""); }

  window.EpiShell.register({
    id: "case-lineage", title: "Fourth exhibit: the lineage, mechanisms already run by hand", kind: "case", order: 106,
    render: function (ctx) {
      var c = R.conjecture;
      var html = '<p class="shell-lede">' + esc(R.lede) + "</p>";

      html += "<h3>the conjecture</h3>";
      html += '<div class="eggs-recon"><div class="eggs-claim">' + esc(c.statement) + " " + grade(c.grade) + "</div>";
      if (c.grade !== "supported") html += '<div class="eggs-frame-note">The conjecture declared <b>supported</b> and the gate priced it <b>' + esc(c.grade) + "</b>: the near-miss gaps that ground it are each themselves only asserted architectural readings, so the gate does not lift the conjecture on their backs. The demotion is the finding, shown not hidden.</div>";
      html += '<div class="eggs-crux-line"><b>the five axes it claims no system composes</b></div><ul class="eggs-frontier">' + R.axes.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>";
      html += '<div class="eggs-frame-note">closes on: ' + esc(c.closing) + "</div></div>";

      html += "<h3>its grounding: five independent near-miss systems, each hitting some axes and missing the composition</h3>";
      html += '<ul class="eggs-claims">' + R.grounding.map(function (g) { return '<li><b>' + esc(g.system) + ":</b> <span class=\"eggs-claim\">" + esc(g.statement) + "</span> " + grade(g.grade) + "</li>"; }).join("") + "</ul>";

      html += "<details class=\"lineage-more\"><summary>The mechanisms already run by hand in mature institutions (one click down)</summary>";
      R.institutions.forEach(function (inst) {
        html += "<h4>" + esc(inst.domain) + ' <span class="eggs-src">' + esc(inst.note) + "</span></h4><ul class=\"eggs-claims\">" + claimRows(inst.claims) + "</ul>";
      });
      html += "</details>";

      if (R.demotions && R.demotions.length) {
        html += "<h3>what the gate demoted (the finding: which parallels are load-bearing, which were flattery)</h3>";
        html += '<ul class="eggs-claims">' + R.demotions.map(function (d) { return "<li><span class=\"eggs-claim\">" + esc(d.statement) + '</span> declared ' + grade(d.declared) + " earned " + grade(d.earned) + "</li>"; }).join("") + "</ul>";
      }

      ctx.mount.innerHTML = html;
      if (ctx.registerNode) ctx.registerNode("the lineage, mechanisms already run by hand", ctx.mount, "case-lineage", "case-lineage", "Fourth exhibit: the lineage");
    },
  });
})();
