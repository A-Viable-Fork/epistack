// Role: the guided path as a shell module (Prompt 29). Stages the three counterexamples in sequence,
//   each a stop with four parts: the fluent reading a good synthesis would give, the protocol's
//   counterexample, the reproducible receipt a judge runs to see it (recomputed by the kernel at build
//   time), and a curated pointer into the exact case region where the counterexample lives. The reading
//   is the vendored build artifact (vendor/demo/reading.json), computed by build/vendor-demo.mjs.
// Contract: registers on window.EpiShell as the guided-path module. Reads the embedded #demo-reading
//   JSON and renders it; each pointer names the case module and the node-ids the receipt lands on.
// Invariant: periphery; it touches no truth field and no kernel and computes no grade. The receipts
//   shown are the kernel's own build-time derivations; the module renders them and asserts nothing.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("demo-reading");
  if (!el) return;
  var R; try { R = JSON.parse(el.textContent); } catch (e) { return; }

  function receiptHtml(rc) {
    var rows = [];
    Object.keys(rc).forEach(function (k) {
      if (k === "what" || k === "reads" || k === "fires") return;
      var v = rc[k];
      rows.push("<li><code>" + esc(k) + "</code>: " + esc(Array.isArray(v) ? "[" + v.join(", ") + "]" : String(v)) + "</li>");
    });
    return '<div class="demo-receipt"><div><b>the receipt:</b> ' + esc(rc.what) + "</div>" +
      '<ul class="demo-receipt-rows">' + rows.join("") + "</ul>" +
      '<div class="demo-reads">' + esc(rc.reads) + "</div>" +
      '<div class="demo-fires ' + (rc.fires ? "demo-fires-ok" : "demo-fires-bad") + '">' + (rc.fires ? "fires" : "DID NOT FIRE (a wiring finding)") + "</div></div>";
  }

  function stopHtml(s, n) {
    var p = s.pointer || {};
    return '<div class="demo-stop" id="demo-stop-' + n + '">' +
      '<h3>stop ' + n + " &middot; " + esc(s.title) + "</h3>" +
      '<div class="demo-fluent"><b>the fluent reading</b> (what a good synthesis would give): ' + esc(s.fluent) + "</div>" +
      '<div class="demo-counter"><b>the counterexample</b> (what the structure surfaces): ' + esc(s.counterexample) + "</div>" +
      receiptHtml(s.receipt) +
      '<div class="demo-pointer"><b>pointer:</b> ' + esc(p.region) + ' &rarr; the <b>' + esc(s.case) + "</b> case, at " +
      (p.nodes || []).map(function (x) { return "<code>" + esc(x) + "</code>"; }).join(", ") +
      ' <span class="demo-oracle">reproduce: ' + esc(p.oracle) + "</span></div></div>";
  }

  window.EpiShell.register({
    id: "guided-path", title: "Start here: three things a synthesis buries", kind: "path", order: 99,
    render: function (ctx) {
      var html = '<p class="shell-lede">' + esc(R.lede) + "</p>";
      html += (R.stops || []).map(function (s, i) { return stopHtml(s, i + 1); }).join("");
      var all = (R.stops || []).every(function (s) { return s.receipt && s.receipt.fires; });
      html += '<div class="demo-summary">' + (all ? "all three receipts fire on the dense content" : "a receipt did not fire") + "</div>";
      ctx.mount.innerHTML = html;
      // register the walk as a cross-link anchor so the prose can navigate to it.
      if (ctx.registerNode) ctx.registerNode("the guided path: three things a synthesis buries", ctx.mount, "guided-path", "guided-path", "Start here: three things a synthesis buries");
    },
  });
})();
