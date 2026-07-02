// Role: the propose widget (Prompt 10). A judge enters a typed claim, statement, kind, an optional
//   citation, and supports chosen from the current store, and sees the receipt: the grade, the price
//   into the forum, or the refusal with the failing check named. The widget calls the propose/read
//   CONTRACT and renders; it computes no grade, price, or refusal of its own.
// Contract: wires the #pw-* DOM. Depends on the vendored contract (window.EpiClientApi) and two
//   providers (window.EpiLocalProvider, window.EpiRemoteProvider); the snapshot is #pw-snapshot.
// Invariant: the widget reaches the kernel only through the contract, and never learns which
//   provider answers. Swapping local for remote is one line in the boot below; nothing else changes.
(function () {
  var root = document.getElementById("pw"); if (!root) return;
  if (!window.EpiClientApi) { var s0 = document.getElementById("pw-status"); if (s0) s0.textContent = "The client bundle did not load."; return; }

  // ---- boot: bind the contract to a provider. This is the whole seam. ----
  var SNAPSHOT = JSON.parse(document.getElementById("pw-snapshot").textContent);
  var PROVIDERS = {
    local: function () { return EpiClientApi.createClientApi(EpiLocalProvider.createLocalProvider(SNAPSHOT)); },
    remote: function () { return EpiClientApi.createClientApi(EpiRemoteProvider.createRemoteProvider({ endpoint: "https://kernel.example/v1/propose" })); },
  };
  var api = PROVIDERS.local(); // <-- swap to PROVIDERS.remote() and the widget below is untouched.

  // ---- DOM handles ----
  var elKind = document.getElementById("pw-kind"), elStmt = document.getElementById("pw-statement");
  var elCite = document.getElementById("pw-citation"), elSup = document.getElementById("pw-supports");
  var elFilter = document.getElementById("pw-support-filter"), elOut = document.getElementById("pw-out");
  var elStatus = document.getElementById("pw-status"), elBtn = document.getElementById("pw-run");
  var elDeclared = document.getElementById("pw-declared"), elProv = document.getElementsByName("pw-provider");

  var KINDS = ["measurement", "claim", "observation", "prediction", "forum", "assumption"];
  KINDS.forEach(function (k) { var o = document.createElement("option"); o.value = k; o.textContent = k; elKind.appendChild(o); });
  // "Claim a grade": auto lets the provider pick (asserted, or checked with a citation). Picking a
  // grade above what the claim earns is how a judge reaches a refusal: the gate declines the overclaim.
  var GRADES = [["", "auto"], ["asserted", "asserted"], ["supported", "supported"], ["corroborated", "corroborated"], ["checked", "checked"], ["independently-rechecked", "independently-rechecked"]];
  GRADES.forEach(function (g) { var o = document.createElement("option"); o.value = g[0]; o.textContent = g[1]; elDeclared.appendChild(o); });

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  function short(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  // populate the supports picker from read(); the widget reads the store, it does not know its shape
  // beyond the contract's claim projection.
  function renderSupports(filter) {
    var claims = api.read({}); if (filter) { var q = filter.toLowerCase(); claims = claims.filter(function (c) { return c.statement.toLowerCase().indexOf(q) >= 0 || c.kind.indexOf(q) >= 0; }); }
    elSup.innerHTML = "";
    claims.slice(0, 60).forEach(function (c) {
      var id = "pws-" + c.identity.slice(0, 10);
      var row = document.createElement("label"); row.className = "pw-support";
      row.innerHTML = '<input type="checkbox" value="' + c.identity + '"> <span class="pw-sg">' + esc(c.kind) + " · " + esc(c.earned_grade) + '</span> ' + esc(short(c.statement, 90));
      elSup.appendChild(row);
    });
    if (!claims.length) elSup.innerHTML = '<div class="pw-empty">no claims match</div>';
  }

  function selectedSupports() {
    return [].slice.call(elSup.querySelectorAll("input:checked")).map(function (i) { return i.value; });
  }

  // render the receipt. The widget only reads fields off the receipt; every verdict is the gate's.
  function renderReceipt(r) {
    if (r.error) { elOut.innerHTML = '<div class="pw-refused">Refused before the gate: ' + esc(r.error) + "</div>"; elOut.classList.add("show"); return; }
    var row = (r.grade_table || []).filter(function (g) { return g.identity === r.proposed_identity; })[0] || {};
    var html = "";
    if (r.decision === "declined") {
      var f = (r.findings || [])[0];
      html += '<div class="pw-verdict pw-refused">Refused</div>';
      html += '<div class="pw-why">The gate declined this claim. Failing check: <code>' + esc((r.decision_basis || []).join(", ") || (f && f.rule_id) || "unknown") + "</code>";
      if (f && f.expected) html += " &mdash; expected " + esc(f.expected) + (f.found ? ", found " + esc(f.found) : "");
      html += ".</div>";
    } else if (row.earned_grade === "corroborated" && (row.ceiling === "corroborated")) {
      html += '<div class="pw-verdict pw-priced">Priced into the forum</div>';
      html += '<div class="pw-why">Corroborated, the strongest an argued claim reaches. It is capped at the forum ceiling: it does not cross to a measurement.</div>';
    } else {
      html += '<div class="pw-verdict pw-graded">Graded: <strong>' + esc(row.earned_grade || "ungraded") + "</strong></div>";
    }
    html += '<table class="pw-grades"><tr><th>declared</th><th>earned</th><th>S (support)</th><th>B (own basis)</th></tr><tr><td>' +
      esc(row.declared_grade || "—") + "</td><td><strong>" + esc(row.earned_grade || "—") + "</strong></td><td>" + esc(row.S || "—") + "</td><td>" + esc(row.B || "—") + "</td></tr></table>";
    if (r.provider_note) html += '<div class="pw-note">' + esc(r.provider_note) + "</div>";
    html += '<div class="pw-prov">answered by the <strong>' + esc(api.providerKind()) + "</strong> provider</div>";
    elOut.innerHTML = html; elOut.classList.add("show");
  }

  function run() {
    var statement = (elStmt.value || "").trim();
    if (!statement) { elStatus.textContent = "Enter a statement to propose."; return; }
    var proposed = { statement: statement, kind: elKind.value, citation: (elCite.value || "").trim() || undefined, declared_grade: elDeclared.value || undefined, supports: selectedSupports() };
    var r;
    try { r = api.propose(proposed); }
    catch (e) { elStatus.textContent = "propose error: " + (e && e.message ? e.message : e); return; }
    renderReceipt(r);
    elStatus.textContent = "graded against the current store, client-side, by the " + api.providerKind() + " provider";
  }

  // the provider swap: rebinding `api` is the only change; the form and render code above are untouched.
  for (var i = 0; i < elProv.length; i++) elProv[i].addEventListener("change", function (e) {
    api = PROVIDERS[e.target.value]();
    renderSupports(elFilter.value);
    elStatus.textContent = "provider swapped to " + e.target.value + "; same widget, same contract";
  });
  elFilter.addEventListener("input", function () { renderSupports(elFilter.value); });
  elBtn.addEventListener("click", run);
  renderSupports("");
})();
