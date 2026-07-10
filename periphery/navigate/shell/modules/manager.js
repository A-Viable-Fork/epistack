// Role: the kernel manager. Renders the bottom-up federation as kernels operated, not just read, driving
//   through the management contract (list, read, adopt, fork, cross) and the claim contract (live grade),
//   and authors into a kernel through the claim contract: a person writes a claim with a support, proposes
//   it through the real gate, and reads the receipt, where the gate tells them what the claim earned
//   versus what they declared. The gate is the only judge; the surface gathers fields and shows the result.
// Contract: registers on window.EpiShell. Reads the management snapshot to build the management contract
//   (window.EpiManagementApi / EpiLocalManagementProvider); reads and proposes through ctx.api (the claim
//   contract). Holds no adoption, crossing, or grading logic.
// Invariant: periphery; it touches no truth field and no kernel. Everything shown is real state through
//   the two contracts, every write and every proposed claim is a real operation with a real receipt, and
//   it vendors no answers, which is what keeps it embeddable. The authoring surface constructs no grade;
//   the propose contract runs the real gate and returns the verdict.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function short(s, n) { s = String(s == null ? "" : s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
  var el = typeof document !== "undefined" && document.getElementById("management-snapshot");
  if (!el || !window.EpiManagementApi || !window.EpiLocalManagementProvider) return;
  var SNAP; try { SNAP = JSON.parse(el.textContent); } catch (e) { return; }
  var sampleById = {}; (SNAP.members || []).forEach(function (m) { sampleById[m.id] = m.sample || null; });

  function statusTag(s) { return '<span class="mgr-status mgr-status-' + esc(s) + '">' + esc(s) + "</span>"; }
  function gradeTag(g) { return '<span class="mgr-grade-tag">' + esc(g) + "</span>"; }
  function pre(o) { return '<pre class="mgr-receipt-json">' + esc(JSON.stringify(o, null, 2)) + "</pre>"; }
  function shortHash(h) { return h ? h.slice(0, 12) : "?"; }

  window.EpiShell.register({
    id: "kernel-manager", title: "Kernel manager", kind: "demonstration", order: 300, spine: true,
    render: function (ctx) {
      var mgmt = window.EpiManagementApi.createManagementApi(window.EpiLocalManagementProvider.createLocalManagementProvider(SNAP));
      var receipts = { adopt: null, fork: null, cross: null };

      function liveGrade(id) {
        var s = sampleById[id];
        if (!s || !ctx.api || !ctx.api.read) return null;
        var rows = ctx.api.read({ identity: s.identity }) || [];
        if (!rows.length && s.statement) rows = ctx.api.read({ contains: s.statement.slice(0, 24) }) || [];
        return rows.length ? rows[0].earned_grade : "not carried in the contract's snapshot";
      }

      // ---------- the read half: kernels, crossings, and the management writes (slice two) ----------
      function memberHtml(k) {
        var detail = mgmt.readKernel(k.id);
        var local = detail.local_kinds.length
          ? detail.local_kinds.map(function (r) { return '<span class="mgr-kind mgr-kind-local">' + esc(r.kind) + " · " + esc(r.ceiling) + "</span>"; }).join(" ")
          : '<span class="mgr-none">none (all kinds adopted from the shared subtree)</span>';
        var shared = detail.shared_pins.map(function (p) { return '<span class="mgr-kind mgr-kind-shared" title="type-hash ' + esc(p.hash) + '">' + esc(p.kind) + " · " + shortHash(p.hash) + "</span>"; }).join(" ");
        var grade = liveGrade(k.id);
        var gradeHtml = grade ? '<div class="mgr-tier"><span class="mgr-grade">live grade of a sample claim (through the claim contract): <b>' + esc(grade) + "</b></span></div>" : "";
        return '<div class="mgr-kernel"><div class="mgr-kernel-head"><span class="mgr-kernel-id">' + esc(k.id) + '</span> <span class="mgr-by">kernel by ' + esc(k.author) + "</span></div>" +
          '<div class="mgr-prov">' + esc(k.provenance) + "</div>" +
          '<div class="mgr-tier"><b>local kinds</b> (this kernel owns) &nbsp; ' + local + "</div>" +
          '<div class="mgr-tier"><b>shared type-hashes pinned</b> (adopted) &nbsp; ' + shared + "</div>" + gradeHtml + "</div>";
      }
      function crossingsHtml() {
        return mgmt.readCrossings().map(function (cx) {
          return '<li><span class="mgr-cross">' + esc(cx.origin) + " → " + esc(cx.target) + '</span> <span class="mgr-cross-kind">on ' + esc(cx.kind) + "</span> " + statusTag(cx.status) +
            '<div class="mgr-cross-note">' + esc(cx.note) + "</div></li>";
        }).join("");
      }
      function untypedCrossing() { return mgmt.readCrossings().filter(function (c) { return c.status === "untyped"; })[0]; }
      function nativeCrossing() { return mgmt.readCrossings().filter(function (c) { return c.status === "native"; })[0]; }
      function hashFor(kernelId, kind) { var p = (mgmt.readKernel(kernelId).shared_pins || []).filter(function (x) { return x.kind === kind; })[0]; return p ? p.hash : null; }
      function crossClaim(cx) { var rec = (SNAP.crossings || []).filter(function (c) { return c.id === cx.id; })[0]; return rec ? rec.from_claim : null; }
      function writesHtml() {
        var u = untypedCrossing(), n = nativeCrossing();
        var adoptBtn = u ? '<button class="mgr-op-btn" data-op="adopt">adopt the ' + esc(u.kind) + " type into " + esc(u.target) + " (makes " + esc(u.origin) + " → " + esc(u.target) + " native)</button>" : '<span class="mgr-none">no untyped crossing remains to adopt</span>';
        return '<div class="mgr-writes">' +
          '<div class="mgr-op"><b>adopt</b> a shared type-hash so an untyped crossing composes native.<br>' + adoptBtn + (receipts.adopt ? pre(receipts.adopt) : "") + "</div>" +
          '<div class="mgr-op"><b>fork</b> a kernel, deriving a child that inherits its pins.<br><button class="mgr-op-btn" data-op="fork">fork covid</button>' + (receipts.fork ? pre(receipts.fork) : "") + "</div>" +
          '<div class="mgr-op"><b>cross</b> a claim from one kernel into another and read whether it arrived native or untyped.<br>' +
          (n ? '<button class="mgr-op-btn" data-op="cross-native">cross a shared-kind claim (native)</button> ' : "") +
          (u ? '<button class="mgr-op-btn" data-op="cross-untyped">cross an unadopted-kind claim (untyped)</button>' : "") +
          (receipts.cross ? pre(receipts.cross) : "") + "</div></div>";
      }
      function paintTop(top) {
        top.innerHTML = "<h3>the kernels (listKernels)</h3>" + mgmt.listKernels().map(memberHtml).join("") +
          "<h3>crossings between kernels (readCrossings)</h3><ul class=\"mgr-crossings\">" + crossingsHtml() + "</ul>" +
          "<h3>operations (adopt, fork, cross)</h3>" + writesHtml();
        var btns = top.querySelectorAll(".mgr-op-btn");
        for (var i = 0; i < btns.length; i++) top.querySelectorAll(".mgr-op-btn")[i].addEventListener("click", function (e) {
          var op = e.target.getAttribute("data-op");
          if (op === "adopt") { var u = untypedCrossing(); if (u) receipts.adopt = mgmt.adopt(u.target, hashFor(u.origin, u.kind)); }
          else if (op === "fork") receipts.fork = mgmt.fork("covid");
          else if (op === "cross-native") { var nn = nativeCrossing(); if (nn) receipts.cross = mgmt.cross(nn.origin, crossClaim(nn), nn.target); }
          else if (op === "cross-untyped") { var uu = untypedCrossing(); if (uu) receipts.cross = mgmt.cross(uu.origin, crossClaim(uu), uu.target); }
          paintTop(top);
        });
      }

      // ---------- the write half: authoring into a kernel through the propose contract ----------
      var GRADES = [["", "auto"], ["asserted", "asserted"], ["supported", "supported"], ["corroborated", "corroborated"], ["checked", "checked"], ["independently-rechecked", "independently-rechecked"]];
      function kernelKinds(id) { var d = mgmt.readKernel(id); return d.local_kinds.map(function (r) { return r.kind; }).concat(d.shared_pins.map(function (p) { return p.kind; })); }

      function mountAuthoring(auth) {
        var kernelIds = mgmt.listKernels().map(function (k) { return k.id; });
        auth.innerHTML =
          '<h3>author a claim into a kernel (propose)</h3>' +
          '<p class="mgr-auth-lede">Write a claim, point it at a support already in the store, and propose it. The gate grades it: usually the earned grade is below the grade you declared, and the receipt shows why. Each support lends at the supported level, so one support earns supported and two independent supports earn corroborated. Declare corroborated with one support and the gate declines it, earned supported; add a second support and propose again to watch it reach corroborated. The surface judges nothing; the gate is the only judge.</p>' +
          '<div class="mgr-auth-form">' +
          '<label>target kernel <select class="mgr-auth-kernel">' + kernelIds.map(function (id) { return '<option value="' + esc(id) + '">' + esc(id) + "</option>"; }).join("") + "</select></label>" +
          '<label>statement <textarea class="mgr-auth-stmt" placeholder="A single, checkable claim in one sentence."></textarea></label>' +
          '<div class="mgr-auth-row"><label>kind <select class="mgr-auth-kind"></select></label>' +
          '<label>declared grade <select class="mgr-auth-declared">' + GRADES.map(function (g) { return '<option value="' + g[0] + '">' + esc(g[1]) + "</option>"; }).join("") + "</select></label></div>" +
          '<label>citation (optional) <input type="text" class="mgr-auth-cite" placeholder="e.g. Author 2020, Journal"></label>' +
          '<label>supports (choose at least one existing claim in the live store) <input type="text" class="mgr-auth-filter" placeholder="filter the claims by text or kind…"></label>' +
          '<div class="mgr-auth-supports"></div>' +
          '<button class="mgr-auth-btn">propose to the gate</button>' +
          '<div class="mgr-auth-status"></div>' +
          '<div class="mgr-auth-receipt"></div>' +
          '<p class="mgr-auth-note">This authors against the live kernel through the real gate and returns the real receipt. Taking a kernel you have populated away with you, to keep and federate, is the on-ramp\'s next step (the generator-to-download), specified and not built here.</p>' +
          "</div>";

        var elKernel = auth.querySelector(".mgr-auth-kernel"), elKind = auth.querySelector(".mgr-auth-kind");
        var elStmt = auth.querySelector(".mgr-auth-stmt"), elDeclared = auth.querySelector(".mgr-auth-declared");
        var elCite = auth.querySelector(".mgr-auth-cite"), elFilter = auth.querySelector(".mgr-auth-filter");
        var elSupports = auth.querySelector(".mgr-auth-supports"), elBtn = auth.querySelector(".mgr-auth-btn");
        var elStatus = auth.querySelector(".mgr-auth-status"), elReceipt = auth.querySelector(".mgr-auth-receipt");

        function fillKinds() { elKind.innerHTML = kernelKinds(elKernel.value).map(function (k) { return '<option value="' + esc(k) + '">' + esc(k) + "</option>"; }).join(""); }
        function renderSupports() {
          var claims = (ctx.api && ctx.api.read) ? ctx.api.read({}) : [];
          var q = (elFilter.value || "").toLowerCase();
          if (q) claims = claims.filter(function (c) { return c.statement.toLowerCase().indexOf(q) >= 0 || c.kind.indexOf(q) >= 0; });
          if (!claims.length) { elSupports.innerHTML = '<div class="mgr-none">no claims match; the live store carries the covid, densified LHC, and eggs claims read through the contract</div>'; return; }
          elSupports.innerHTML = claims.slice(0, 40).map(function (c) {
            return '<label class="mgr-auth-support"><input type="checkbox" value="' + esc(c.identity) + '"> <span class="mgr-auth-sg">' + esc(c.kind) + " · " + esc(c.earned_grade) + "</span> " + esc(short(c.statement, 90)) + "</label>";
          }).join("");
        }
        function selectedSupports() { return [].slice.call(elSupports.querySelectorAll("input:checked")).map(function (i) { return i.value; }); }

        // the receipt is the payoff: declared versus earned, the gap, and the gate's reason.
        function renderReceipt(r) {
          if (r.error) { elReceipt.innerHTML = '<div class="mgr-verdict mgr-declined">refused before the gate: ' + esc(r.error) + "</div>"; return; }
          var row = (r.grade_table || []).filter(function (g) { return g.identity === r.proposed_identity; })[0] || {};
          var declared = row.declared_grade || "n/a", earned = row.earned_grade || "ungraded";
          var accepted = String(r.decision).indexOf("accepted") === 0;
          var gap = declared !== earned;
          var head = accepted
            ? '<div class="mgr-verdict mgr-accepted">accepted, earned <b>' + esc(earned) + "</b></div>"
            : '<div class="mgr-verdict mgr-declined">declined</div>';
          var why = "";
          if (!accepted) why = '<div class="mgr-why">The gate admits a claim only at or below what it earns. You declared <b>' + esc(declared) + "</b>; the claim earned <b>" + esc(earned) + "</b> (basis <code>" + esc((r.decision_basis || []).join(", ")) + "</code>). Add or strengthen a support and propose again to raise the earned grade.</div>";
          else if (gap) why = '<div class="mgr-why">Admitted, but below your declaration: you declared <b>' + esc(declared) + "</b> and it earned <b>" + esc(earned) + "</b>.</div>";
          else why = '<div class="mgr-why">Admitted at the grade you declared; the support carried it.</div>';
          elReceipt.innerHTML = head + why +
            '<table class="mgr-grades-table"><tr><th>declared</th><th>earned</th><th>S (support)</th><th>B (own basis)</th></tr><tr><td>' +
            esc(declared) + "</td><td><b>" + esc(earned) + "</b></td><td>" + esc(row.S || "n/a") + "</td><td>" + esc(row.B || "n/a") + "</td></tr></table>" +
            '<div class="mgr-prov">graded client-side by the <b>' + esc(ctx.api.providerKind ? ctx.api.providerKind() : "local") + "</b> provider, the same gate the checks verify</div>";
        }

        function propose() {
          var statement = (elStmt.value || "").trim();
          if (!statement) { elStatus.textContent = "Enter a statement to propose."; return; }
          var supports = selectedSupports();
          if (!supports.length) { elStatus.textContent = "Choose at least one support: point the claim at an existing claim in the store."; return; }
          // each chosen support lends at the supported level, so one support earns supported and two
          // independent supports earn corroborated; the author sets the target with the declared grade,
          // and the gate decides the rest. This is a contribution field, not a grade the surface computes.
          var supportLinks = supports.map(function (id) { return { to_identity: id, declared_grade: "supported" }; });
          var proposed = { statement: statement, kind: elKind.value, citation: (elCite.value || "").trim() || undefined, declared_grade: elDeclared.value || undefined, supports: supportLinks };
          var r; try { r = ctx.api.propose(proposed); } catch (e) { elStatus.textContent = "propose error: " + (e && e.message ? e.message : e); return; }
          renderReceipt(r);
          elStatus.textContent = "proposed to the gate through the claim contract; the receipt below is the gate's verdict";
        }

        elKernel.addEventListener("change", fillKinds);
        elFilter.addEventListener("input", renderSupports);
        elBtn.addEventListener("click", propose);
        fillKinds(); renderSupports();
      }

      // ---------- compose: the read/write halves in their own containers, so a write repaint keeps the form ----------
      ctx.mount.innerHTML = '<p class="shell-turn">The argument and the cases made their point in prose. Here the reading turns to operation: the same kernels are operated and authored through the real contracts, so you stop reading about grounding and do it.</p><p class="shell-lede">The bottom-up federation, operated and authored through the real contracts. The kernels, tiers, and crossings come from the management contract; the writes below run through it; and authoring at the bottom rides the claim contract, where the gate grades the claim you write. Nothing is vendored, so this rung is embeddable as-is.</p><div class="mgr-top"></div><div class="mgr-auth"></div>';
      paintTop(ctx.mount.querySelector(".mgr-top"));
      mountAuthoring(ctx.mount.querySelector(".mgr-auth"));
    },
  });
})();
