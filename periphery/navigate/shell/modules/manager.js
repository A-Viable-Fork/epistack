// Role: the kernel manager, slice one (the probe). A shell module that renders the bottom-up federation
//   as a list of kernels operated, not just read: each member shown as a multi-author object (author and
//   provenance, one author today but the marketplace shape from day one), its local kinds versus the
//   shared type-hashes it pins, and its crossings to other members marked native or untyped. It performs
//   one real management operation, fork-and-adopt: pinning a shared type-hash onto a member so a crossing
//   that arrived untyped composes native, showing the real before and after.
// Contract: registers on window.EpiShell as a case module. Reads the embedded #federation-view JSON
//   (vendored by build/vendor-federation.mjs from the real buildBottomUp and adoption layer) and reads a
//   member's live claim grade through ctx.api (the propose/read contract). Holds no grounding logic.
// Invariant: periphery; it touches no truth field and no kernel. The federation structure is real state
//   from the real machinery; the live grade is a real read through the contract; the adopt is a real pin
//   of a real type-hash whose native/untyped result is the adoption-layer membership rule (a type crosses
//   native exactly when the target pins the source's hash), mirrored from build/adoption.mjs, no more.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("federation-view");
  if (!el) return;
  var V; try { V = JSON.parse(el.textContent); } catch (e) { return; }

  // the adoption-layer decision, mirrored: a claim of a kind crosses native exactly when the target pins
  // the source's type-hash for that kind, and arrives untyped otherwise (build/adoption.mjs crossingStatus).
  function statusOf(sourceHash, targetPinHashes) { return targetPinHashes.indexOf(sourceHash) >= 0 ? "native" : "untyped"; }

  function short(h) { return h ? h.slice(0, 12) : "?"; }
  function statusTag(s) { return '<span class="mgr-status mgr-status-' + esc(s) + '">' + esc(s) + "</span>"; }

  window.EpiShell.register({
    id: "kernel-manager", title: "Kernel manager (probe)", kind: "demonstration", order: 300,
    render: function (ctx) {
      // the surface's live pin state, seeded from the real vendored pins; the adopt mutates it for real.
      var pinsById = {};
      V.members.forEach(function (m) { pinsById[m.id] = m.shared_pins.map(function (p) { return p.hash; }).concat(m.local_kinds.map(function (k) { return null; }).filter(Boolean)); });
      // seed with every pinned hash the member holds (shared and any local), read from the real view.
      V.members.forEach(function (m) { pinsById[m.id] = Object.keys(m.pins).map(function (k) { return m.pins[k]; }); });
      var adopted = false;

      // a member's live claim grade, read through the contract; honest when the contract has no such claim.
      function liveGrade(m) {
        if (!m.sample || !ctx.api || !ctx.api.read) return null;
        var rows = ctx.api.read({ identity: m.sample.identity }) || [];
        if (!rows.length && m.sample.statement) rows = ctx.api.read({ contains: m.sample.statement.slice(0, 24) }) || [];
        return rows.length ? rows[0].earned_grade : "not carried in the contract's snapshot";
      }

      function memberHtml(m) {
        var local = m.local_kinds.length
          ? m.local_kinds.map(function (k) { return '<span class="mgr-kind mgr-kind-local">' + esc(k.kind) + " &middot; " + esc(k.ceiling) + "</span>"; }).join(" ")
          : '<span class="mgr-none">none (all kinds adopted from the shared subtree)</span>';
        var shared = m.shared_pins.map(function (p) { return '<span class="mgr-kind mgr-kind-shared" title="type-hash ' + esc(p.hash) + '">' + esc(p.kind) + " &middot; " + short(p.hash) + "</span>"; }).join(" ");
        var grade = liveGrade(m);
        var gradeHtml = grade ? '<span class="mgr-grade">live grade of a sample claim (through the contract): <b>' + esc(grade) + "</b></span>" : "";
        return '<div class="mgr-kernel">' +
          '<div class="mgr-kernel-head"><span class="mgr-kernel-id">' + esc(m.id) + '</span> <span class="mgr-by">kernel by ' + esc(m.author) + "</span></div>" +
          '<div class="mgr-prov">' + esc(m.provenance) + "</div>" +
          '<div class="mgr-tier"><b>local kinds</b> (this kernel owns) &nbsp; ' + local + "</div>" +
          '<div class="mgr-tier"><b>shared type-hashes pinned</b> (adopted) &nbsp; ' + shared + "</div>" +
          (gradeHtml ? '<div class="mgr-tier">' + gradeHtml + "</div>" : "") +
          "</div>";
      }

      function crossingsHtml() {
        return V.crossings.map(function (cx) {
          var live = statusOf(cx.hash, pinsById[cx.to] || []); // recomputed from the surface's live pins
          return '<li><span class="mgr-cross">' + esc(cx.from) + " &rarr; " + esc(cx.to) + '</span> <span class="mgr-cross-kind">on ' + esc(cx.kind) + " &middot; " + short(cx.hash) + "</span> " + statusTag(live) +
            '<div class="mgr-cross-note">' + esc(cx.note) + "</div></li>";
        }).join("");
      }

      function adoptHtml() {
        var a = V.adopt;
        var live = statusOf(a.hash, pinsById[a.to] || []);
        var receipt = adopted
          ? '<div class="mgr-receipt"><b>receipt:</b> ' + esc(a.to) + ' pinned the ' + esc(a.kind) + " type-hash " + short(a.hash) + '; the crossing ' + esc(a.from) + " &rarr; " + esc(a.to) + " recomputes <b>" + esc(live) + "</b>. This is the real adoption: the pin is in " + esc(a.to) + "'s pin set and the crossing status follows it.</div>"
          : "";
        return '<div class="mgr-adopt">' +
          '<div class="mgr-adopt-head">Fork-and-adopt (the probe)</div>' +
          '<p>' + esc(a.from) + " makes a claim of kind <b>" + esc(a.kind) + '</b> that crosses into ' + esc(a.to) + ". Because " + esc(a.to) + " pins no " + esc(a.kind) + " type-hash, the crossing arrives " + statusTag(a.status_before) + " and grounds nothing. Adopt the type into " + esc(a.to) + " and the same crossing composes " + statusTag(a.status_after) + ".</p>" +
          '<div class="mgr-adopt-state">crossing ' + esc(a.from) + " &rarr; " + esc(a.to) + " is now " + statusTag(live) + "</div>" +
          '<button class="mgr-adopt-btn"' + (adopted ? " disabled" : "") + ">adopt the " + esc(a.kind) + " type into " + esc(a.to) + "</button>" +
          receipt + "</div>";
      }

      function paint() {
        var html = '<p class="shell-lede">The bottom-up federation, operated: four kernels, each a multi-author object, their local-versus-shared tiers, and their crossings. Everything shown is real state from the real machinery (build/bottomup-build and the adoption layer); the one write below is a real adopt. This is slice one, a probe: see docs/manager-probe-findings.md for what driving a write from a surface taught.</p>';
        html += "<h3>the kernels</h3>" + V.members.map(memberHtml).join("");
        html += "<h3>crossings between kernels</h3><ul class=\"mgr-crossings\">" + crossingsHtml() + "</ul>";
        html += "<h3>one real operation</h3>" + adoptHtml();
        ctx.mount.innerHTML = html;
        var btn = ctx.mount.querySelector(".mgr-adopt-btn");
        if (btn) btn.addEventListener("click", function () {
          var a = V.adopt;
          if ((pinsById[a.to] || []).indexOf(a.hash) < 0) pinsById[a.to] = (pinsById[a.to] || []).concat([a.hash]); // the real pin
          adopted = true;
          paint();
        });
      }
      paint();
    },
  });
})();
