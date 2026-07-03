// Role: the restructured eggs case as a shell module (Prompt 20). Renders the eggs question as a
//   composite over its domains: the three domain stores grounded to their floors, the two cross-domain
//   weighings at structured-forum, the regenerative characterized gaps with their closing conditions,
//   and the denominator swap (product-throughput vs net-capital), exercisable in the page. The reading
//   is the vendored build artifact (vendor/eggs/reading.json), computed by the kernel and composition
//   layer at build time (build/vendor-eggs.mjs); the module renders it and computes no grade.
// Contract: registers on window.EpiShell as a case module. Reads the embedded #eggs-reading JSON.
// Invariant: periphery; it touches no truth field and no kernel. The denominator toggle switches
//   between two precomputed framings whose measurement grades are identical, showing the swap leaves
//   the measurements intact while the verdict is reframed. The cardiovascular crux is shown as
//   specified-not-built: the tension is displayed, never resolved.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("eggs-reading");
  if (!el) return;
  var R; try { R = JSON.parse(el.textContent); } catch (e) { return; }

  function grade(g) { return '<span class="shell-grade shell-grade-' + esc(g) + '">' + esc(g) + "</span>"; }

  function domainsHtml() {
    return R.domains.map(function (d) {
      var rows = d.claims.map(function (c) {
        return '<li><span class="eggs-claim">' + esc(c.statement) + "</span> " + grade(c.grade) + '<span class="eggs-src">' + esc(c.source) + "</span></li>";
      }).join("");
      return '<div class="eggs-domain"><h4>' + esc(d.store_id) + ' <small>' + d.floor_count + " at a floor, " + d.forum_count + " in the forum</small></h4><ul class=\"eggs-claims\">" + rows + "</ul></div>";
    }).join("");
  }

  function weighingsHtml() {
    return R.weighings.map(function (w) {
      var cites = w.cites.map(function (c) {
        return '<li>' + esc(c.statement) + " <small>(" + esc(c.domain) + ", " + esc(c.role) + ")</small> " + grade(c.carried_grade) + "</li>";
      }).join("");
      return '<div class="eggs-weighing"><div class="eggs-node-name">' + esc(w.statement) + "</div>" +
        '<div class="shell-grades"><span>ceiling <b>structured-forum</b></span> <span>earned ' + grade(w.grade) + "</span></div>" +
        '<div class="eggs-rationale">' + esc(w.rationale) + "</div>" +
        '<details><summary>the domain claims it weighs</summary><ul>' + cites + "</ul></details></div>";
    }).join("");
  }

  function gapsHtml() {
    return R.characterized_gaps.map(function (g) {
      var src = (g.transfer_source || []).map(function (t) { return esc(t.statement) + " " + grade(t.transfer_grade); }).join(", ");
      var cc = g.closing_condition || {};
      return '<div class="eggs-gap"><div class="eggs-claim">' + esc(g.statement) + "</div>" +
        '<div class="shell-grades"><span>floor <b>' + esc(g.ceiling) + "</b></span> <span>earned " + grade(g.earned_grade) + "</span></div>" +
        '<div class="eggs-closing"><b>closing condition</b> (' + esc(cc.condition_kind) + "): " + esc(cc.target) + (cc.system ? " <em>on " + esc(cc.system) + "</em>" : "") + "</div>" +
        '<div class="eggs-transfer"><b>transfer from</b> ' + src + "</div></div>";
    }).join("");
  }

  function denominatorHtml(which) {
    var d = R.denominator[which];
    var alt = which === "throughput" ? "netcapital" : "throughput";
    var altLabel = which === "throughput" ? "net-capital" : "product-throughput";
    var meas = d.measurements.map(function (m) { return "<li>" + esc(m.statement) + " " + grade(m.grade) + "</li>"; }).join("");
    return '<div class="eggs-frame"><div><b>denominator in force:</b> ' + esc(d.frame) + "</div>" +
      '<button class="eggs-swap" data-alt="' + alt + '">swap to ' + altLabel + "</button>" +
      '<div class="eggs-frame-note">the weighings above are reframed to this denominator; the per-unit measurements below keep the grade their own floor gave them, unchanged by the swap</div>' +
      '<ul class="eggs-measurements">' + meas + "</ul></div>";
  }

  window.EpiShell.register({
    id: "case-eggs-composite", title: "Case: eggs, a composite over its domains", kind: "case", order: 103,
    render: function (ctx) {
      var frame = { which: "throughput" };
      function paint() {
        var html = '<p class="shell-lede">' + esc(R.meta_question) + "</p>";
        html += "<h3>the domains, grounded to their own floors</h3>" + domainsHtml();
        html += "<h3>the composite: cross-domain weighings at structured-forum</h3>" + weighingsHtml();
        html += "<h3>the regenerative claims, as characterized gaps</h3>" + gapsHtml();
        html += '<h3>the denominator, swappable</h3><div id="eggs-denominator">' + denominatorHtml(frame.which) + "</div>";
        html += '<div class="eggs-crux"><b>held, not resolved:</b> ' + esc(R.cardiovascular_crux.note) + "</div>";
        ctx.mount.innerHTML = html;
        var btn = ctx.mount.querySelector(".eggs-swap");
        if (btn) btn.addEventListener("click", function () { frame.which = btn.getAttribute("data-alt"); paint(); });
      }
      paint();
      // register the meta-question as a cross-link anchor so the prose can navigate to it.
      if (ctx.registerNode) ctx.registerNode("eggs, the composite question", ctx.mount, "case-eggs-composite", "case-eggs-composite", "Case: eggs, a composite over its domains");
    },
  });
})();
