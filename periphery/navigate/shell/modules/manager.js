// Role: the kernel manager, slice two. A shell module that renders the bottom-up federation as a list of
//   kernels operated, not just read, driving entirely through the two contracts and vendoring no answers.
//   The kernel list, each kernel's local-versus-shared tiers, and the crossings with their native-or-
//   untyped status all come from the management contract (listKernels, readKernel, readCrossings); a
//   member's live claim grade comes from the claim contract (ctx.api.read). It performs all three write
//   operations, adopt, fork, and cross, through the management contract and renders their real receipts.
// Contract: registers on window.EpiShell. Builds the management contract from window.EpiManagementApi and
//   window.EpiLocalManagementProvider over the embedded #management-snapshot (the provider's raw input,
//   the way the claim provider reads the claim snapshot); reads live grades through ctx.api. Holds no
//   adoption, crossing, or grounding logic; the provider computes every pin, status, and receipt.
// Invariant: periphery; it touches no truth field and no kernel. Everything it shows is real state through
//   the two contracts, every write is a real operation with a real receipt, and it vendors no answers,
//   which is what makes it honest to embed.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("management-snapshot");
  if (!el || !window.EpiManagementApi || !window.EpiLocalManagementProvider) return;
  var SNAP; try { SNAP = JSON.parse(el.textContent); } catch (e) { return; }
  var sampleById = {}; (SNAP.members || []).forEach(function (m) { sampleById[m.id] = m.sample || null; });

  function short(h) { return h ? h.slice(0, 12) : "?"; }
  function statusTag(s) { return '<span class="mgr-status mgr-status-' + esc(s) + '">' + esc(s) + "</span>"; }
  function pre(o) { return '<pre class="mgr-receipt-json">' + esc(JSON.stringify(o, null, 2)) + "</pre>"; }

  window.EpiShell.register({
    id: "kernel-manager", title: "Kernel manager", kind: "demonstration", order: 300,
    render: function (ctx) {
      // the management contract over its provider, built once so a write's session state persists.
      var mgmt = window.EpiManagementApi.createManagementApi(window.EpiLocalManagementProvider.createLocalManagementProvider(SNAP));
      var receipts = { adopt: null, fork: null, cross: null };

      // a member's live claim grade, read through the claim contract; honest when the snapshot has no claim.
      function liveGrade(id) {
        var s = sampleById[id];
        if (!s || !ctx.api || !ctx.api.read) return null;
        var rows = ctx.api.read({ identity: s.identity }) || [];
        if (!rows.length && s.statement) rows = ctx.api.read({ contains: s.statement.slice(0, 24) }) || [];
        return rows.length ? rows[0].earned_grade : "not carried in the contract's snapshot";
      }

      function memberHtml(k) {
        var detail = mgmt.readKernel(k.id);
        var local = detail.local_kinds.length
          ? detail.local_kinds.map(function (r) { return '<span class="mgr-kind mgr-kind-local">' + esc(r.kind) + " &middot; " + esc(r.ceiling) + "</span>"; }).join(" ")
          : '<span class="mgr-none">none (all kinds adopted from the shared subtree)</span>';
        var shared = detail.shared_pins.map(function (p) { return '<span class="mgr-kind mgr-kind-shared" title="type-hash ' + esc(p.hash) + '">' + esc(p.kind) + " &middot; " + short(p.hash) + "</span>"; }).join(" ");
        var grade = liveGrade(k.id);
        var gradeHtml = grade ? '<div class="mgr-tier"><span class="mgr-grade">live grade of a sample claim (through the claim contract): <b>' + esc(grade) + "</b></span></div>" : "";
        return '<div class="mgr-kernel">' +
          '<div class="mgr-kernel-head"><span class="mgr-kernel-id">' + esc(k.id) + '</span> <span class="mgr-by">kernel by ' + esc(k.author) + "</span></div>" +
          '<div class="mgr-prov">' + esc(k.provenance) + "</div>" +
          '<div class="mgr-tier"><b>local kinds</b> (this kernel owns) &nbsp; ' + local + "</div>" +
          '<div class="mgr-tier"><b>shared type-hashes pinned</b> (adopted) &nbsp; ' + shared + "</div>" +
          gradeHtml + "</div>";
      }

      function crossingsHtml() {
        return mgmt.readCrossings().map(function (cx) {
          return '<li><span class="mgr-cross">' + esc(cx.origin) + " &rarr; " + esc(cx.target) + '</span> <span class="mgr-cross-kind">on ' + esc(cx.kind) + "</span> " + statusTag(cx.status) +
            '<div class="mgr-cross-note">' + esc(cx.note) + "</div></li>";
        }).join("");
      }

      // the adopt target: the untyped crossing, and the shared type-hash its target would pin.
      function untypedCrossing() { return mgmt.readCrossings().filter(function (c) { return c.status === "untyped"; })[0]; }
      function hashFor(kernelId, kind) { var d = mgmt.readKernel(kernelId); var p = (d.shared_pins || []).filter(function (x) { return x.kind === kind; })[0]; return p ? p.hash : null; }

      function writesHtml() {
        var u = untypedCrossing();
        var adoptBtn = u
          ? '<button class="mgr-op-btn" data-op="adopt">adopt the ' + esc(u.kind) + " type into " + esc(u.target) + " (makes " + esc(u.origin) + " &rarr; " + esc(u.target) + " native)</button>"
          : '<span class="mgr-none">no untyped crossing remains to adopt</span>';
        var natCross = mgmt.readCrossings().filter(function (c) { return c.status === "native"; })[0];
        return '<div class="mgr-writes">' +
          '<div class="mgr-op"><b>adopt</b> a shared type-hash so an untyped crossing composes native.<br>' + adoptBtn + (receipts.adopt ? pre(receipts.adopt) : "") + "</div>" +
          '<div class="mgr-op"><b>fork</b> a kernel, deriving a child that inherits its pins.<br><button class="mgr-op-btn" data-op="fork">fork covid</button>' + (receipts.fork ? pre(receipts.fork) : "") + "</div>" +
          '<div class="mgr-op"><b>cross</b> a claim from one kernel into another and read whether it arrived native or untyped.<br>' +
          (natCross ? '<button class="mgr-op-btn" data-op="cross-native">cross a shared-kind claim (native)</button> ' : "") +
          (u ? '<button class="mgr-op-btn" data-op="cross-untyped">cross an unadopted-kind claim (untyped)</button>' : "") +
          (receipts.cross ? pre(receipts.cross) : "") + "</div></div>";
      }

      function paint() {
        var html = '<p class="shell-lede">The bottom-up federation, operated through the real management contract. The kernels, their tiers, and the crossings all come from listKernels, readKernel, and readCrossings; the live grade comes from the claim contract. The three writes below are real operations through the contract, each with its real receipt. Nothing is vendored: the provider computes every pin and status live.</p>';
        html += "<h3>the kernels (listKernels)</h3>" + mgmt.listKernels().map(memberHtml).join("");
        html += "<h3>crossings between kernels (readCrossings)</h3><ul class=\"mgr-crossings\">" + crossingsHtml() + "</ul>";
        html += "<h3>operations (adopt, fork, cross)</h3>" + writesHtml();
        ctx.mount.innerHTML = html;
        var btns = ctx.mount.querySelectorAll(".mgr-op-btn");
        for (var i = 0; i < btns.length; i++) btns[i].addEventListener("click", function (e) {
          var op = e.target.getAttribute("data-op");
          if (op === "adopt") { var u = untypedCrossing(); if (u) receipts.adopt = mgmt.adopt(u.target, hashFor(u.origin, u.kind)); }
          else if (op === "fork") { receipts.fork = mgmt.fork("covid"); }
          else if (op === "cross-native") { var n = mgmt.readCrossings().filter(function (c) { return c.status === "native"; })[0]; if (n) { var claim = crossClaim(n); receipts.cross = mgmt.cross(n.origin, claim, n.target); } }
          else if (op === "cross-untyped") { var u2 = untypedCrossing(); if (u2) { var claim2 = crossClaim(u2); receipts.cross = mgmt.cross(u2.origin, claim2, u2.target); } }
          paint();
        });
      }
      // the claim a crossing crosses, read from the snapshot's crossing record (the provider's input).
      function crossClaim(cx) { var rec = (SNAP.crossings || []).filter(function (c) { return c.id === cx.id; })[0]; return rec ? rec.from_claim : null; }

      paint();
    },
  });
})();
