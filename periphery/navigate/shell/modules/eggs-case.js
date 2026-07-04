// Role: the restructured eggs case as a shell module (Prompt 20). Renders the eggs question as a
//   composite over its domains: the three domain stores grounded to their floors, the two cross-domain
//   weighings at structured-forum, the regenerative characterized gaps with their closing conditions,
//   and the denominator swap (product-throughput vs net-capital), exercisable in the page. The reading
//   is the vendored build artifact (vendor/eggs/reading.json), computed by the kernel and composition
//   layer at build time (build/vendor-eggs.mjs); the module renders it and computes no grade.
// Contract: registers on window.EpiShell as a case module. Reads the embedded #eggs-reading JSON.
// Invariant: periphery; it touches no truth field and no kernel. The denominator toggle switches
//   between two precomputed framings whose measurement grades are identical, showing the swap leaves
//   the measurements intact while the verdict is reframed. The CVD crux is COMPUTED on read (Prompt 22)
//   and shown as a candidate: on this contradiction a shallow finding, the tension displayed not resolved.
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

  function reconciliationHtml() {
    var r = R.reconciliation || {};
    var w = r.within || {}, c = r.cross || {};
    var frontier = (w.frontier_candidates || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
    var resolved = (w.resolved_sub_region || []).length ? (w.resolved_sub_region || []).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") : "<li><em>none yet: the agreement is not structural until the confounder is a node</em></li>";
    var within = '<div class="eggs-recon"><div class="eggs-node-name">the CVD contradiction (within-domain)</div>' +
      '<div>' + esc(w.side_a && w.side_a.statement) + " " + grade(w.side_a && w.side_a.grade) + ' <b>contradicts</b> ' + esc(w.side_b && w.side_b.statement) + " " + grade(w.side_b && w.side_b.grade) + "</div>" +
      '<div class="eggs-crux-line"><b>crux candidate' + (w.shallow ? " (shallow finding)" : "") + ':</b> ' + (w.shallow ? "the frontier is at the top" : "the divergence frontier") + "</div>" +
      '<ul class="eggs-frontier">' + frontier + "</ul>" +
      '<div class="eggs-crux-line"><b>resolved sub-region:</b></div><ul class="eggs-resolved">' + resolved + "</ul>" +
      '<div class="eggs-frame-note">' + esc(w.note) + "</div></div>";
    var cross = '<div class="eggs-recon"><div class="eggs-node-name">which system is better (cross-domain)</div>' +
      '<div class="eggs-crux-line"><b>crux:</b> the framing node the weighing rests on: ' + (c.framing_crux || []).map(esc).join(", ") + "</div>" +
      '<div class="eggs-frame-note">' + esc(c.note) + "</div></div>";
    return within + cross;
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
        html += "<h3>the disagreements, and what each turns on (computed crux)</h3>" + reconciliationHtml();
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
