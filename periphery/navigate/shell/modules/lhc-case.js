// Role: the densified LHC cascade as a shell module (Prompt 25). Renders the case as the three
//   capabilities of one reified node, the ADD framework choice: the robustness reading finding it as a
//   shared dependency the leg count hides, the framework swap reframing the verdict while the
//   calculations hold, and the settled-versus-performed gap on the erased antecedent. The three legs are
//   shown with their grounding grade and their undercut-lowered confidence. The reading is the vendored
//   build artifact (vendor/lhc/reading.json), computed by the kernel at build time (build/vendor-lhc.mjs);
//   the module renders it and computes no grade.
// Contract: registers on window.EpiShell as a case module. Reads the embedded #lhc-reading JSON.
// Invariant: periphery; it touches no truth field and no kernel. The before/after robustness reading
//   and the framework swap are the kernel's own computations, shown, not re-derived here.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("lhc-reading");
  if (!el) return;
  var R; try { R = JSON.parse(el.textContent); } catch (e) { return; }
  function grade(g) { return '<span class="shell-grade shell-grade-' + esc(g) + '">' + esc(g) + "</span>"; }
  function claimRows(list) { return list.map(function (r) { return '<li><span class="eggs-claim">' + esc(r.statement) + "</span> " + grade(r.grade) + (r.source ? '<span class="eggs-src">' + esc(r.source) + "</span>" : "") + "</li>"; }).join(""); }

  window.EpiShell.register({
    id: "case-lhc-cascade", title: "Case: the LHC three legs and the one framework-choice node", kind: "case", order: 105,
    render: function (ctx) {
      var html = '<p class="shell-lede">' + esc(R.meta_question) + "</p>";
      html += '<div class="shell-reading"><div class="shell-node-name">' + esc(R.top.statement) + "</div><div class=\"shell-grades\"><span>top claim " + grade(R.top.grade) + "</span></div></div>";

      // the three legs, each with grounding and undercut-lowered confidence.
      html += "<h3>the three legs: grounding, and the confidence left after the undercuts</h3><ul class=\"eggs-claims\">";
      R.legs.forEach(function (L) {
        html += '<li><span class="eggs-claim">' + esc(L.statement) + "</span> grounding " + grade(L.grounding) + " &rarr; confidence " + grade(L.confidence) + (L.lowered ? " <b>(lowered by undercut)</b>" : "");
        if (L.undercuts.length) html += '<ul class="eggs-frontier">' + L.undercuts.map(function (u) { return "<li>" + esc(u.statement) + ' <span class="eggs-src">discovery: ' + esc(u.discovery) + "</span></li>"; }).join("") + "</ul>";
        html += "</li>";
      });
      html += "</ul>";

      // Reading 1: the shared dependency the leg count hides.
      html += "<h3>reading 1 &middot; robustness: the shared dependency the leg count hides</h3>";
      html += '<div class="eggs-recon"><div>before reifying, shared dependencies across the legs: <b>[' + esc(R.robustness.before.join(", ") || "none") + "]</b> (the three legs look independent)</div>";
      html += '<div class="eggs-crux-line">after reifying: <b>[' + esc(R.robustness.after.join(", ")) + "]</b>, found as single points of failure across all three legs</div>";
      html += '<ul class="eggs-frontier">' + R.robustness.shared.map(function (s) { return "<li>" + esc(s.statement) + "</li>"; }).join("") + "</ul>";
      html += '<div class="eggs-frame-note">the naive three-leg count read as independent; the reified nodes are correlated support the count hid.</div></div>';

      // Reading 2: the framework swap.
      html += "<h3>reading 2 &middot; framing: swap the framework, moot the analysis, keep the calculations</h3>";
      html += '<div class="eggs-recon"><div><b>frame (ADD):</b> ' + esc(R.framing.add_frame) + "</div>";
      html += '<div class="eggs-crux-line"><b>swap to the standard model:</b> ' + esc(R.framing.sm_frame) + "</div>";
      html += "<div>the within-framework calculations keep their grade across the swap:</div><ul class=\"eggs-resolved\">";
      html += R.framing.calcs.map(function (c) { return "<li>" + esc(c.statement) + " " + grade(c.grade_under_add) + "</li>"; }).join("");
      html += "</ul><div class=\"eggs-frame-note\">grades survive (" + (R.framing.grade_survives ? "yes" : "no") + "), analysis mooted under the standard model. dangerous branch: " + esc(R.framing.excluded.statement) + " " + grade(R.framing.excluded.grade) + "</div></div>";

      // Reading 3: the settled-versus-performed finding.
      html += "<h3>reading 3 &middot; settled versus performed: the erased antecedent</h3>";
      html += '<div class="eggs-recon"><div><b>performed (unconditional):</b> ' + esc(R.performed.performed_claim.statement) + " " + grade(R.performed.performed_claim.grade) + "</div>";
      html += '<div class="eggs-crux-line"><b>conditional structure:</b> ' + esc(R.performed.conditional_structure.statement) + " " + grade(R.performed.conditional_structure.grade) + "</div>";
      html += '<div>dropped antecedent: <b>' + esc(R.performed.antecedent) + "</b></div>";
      html += '<div class="eggs-frame-note">' + esc(R.performed.spc_evidence.statement) + "</div></div>";

      html += "<h3>the verdict</h3><ul class=\"eggs-claims\">" + claimRows([R.conditionality, R.closure]) + "</ul>";
      ctx.mount.innerHTML = html;
      if (ctx.registerNode) ctx.registerNode("the LHC three legs and the one framework-choice node", ctx.mount, "case-lhc-cascade", "case-lhc-cascade", "Case: the LHC three legs and the one framework-choice node");
    },
  });
})();
