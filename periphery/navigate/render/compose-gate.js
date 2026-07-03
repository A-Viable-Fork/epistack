// Role: the in-browser compose-gate runner. Runs the actual v3 gate kernel (window.EpiGate, vendored
//   from kernel/ by build/vendor-gate-browser.mjs) over the incumbent map plus the ticked
//   contributions. No network, no Python: the gate composes uncoordinated typed contributions and
//   prices their independence, mechanically, in the page.
// Contract: wires #cgBtn; reads the JSON data blocks (#cg-*) and #cgPaste; writes #cgOut. Depends on
//   window.EpiGate. The JSON cleanup is kernel/gate/clean-json.js.
// Invariant: owns DOM only; the gate logic is the kernel, unedited. Deterministic: the same
//   contributions produce the same receipts and the same earned grades every run (T0-6 holds, the
//   page opens and runs the gate fully offline).
(function () {
  // init() wires the panel over whatever #cg-* DOM is present. On a page that already carries the
  // markup (the classic submission) it self-runs at load; the shell injects the markup then calls
  // window.EpiComposeGate.init(), so the same code serves both without a second implementation.
  function init() {
  var btn = document.getElementById('cgBtn'); if (!btn) return;
  var out = document.getElementById('cgOut'), status = document.getElementById('cgStatus');
  function txt(id) { var e = document.getElementById(id); return e ? e.textContent : ''; }

  // -- the copy-the-contract affordance for the D (bring-your-own) flow --
  var pv = document.getElementById('cg-prompt-view'); if (pv) pv.textContent = txt('cg-prompt');
  var copy = document.getElementById('cgCopy');
  if (copy) copy.addEventListener('click', function () {
    var t = txt('cg-prompt');
    function done() { copy.textContent = 'Copied'; setTimeout(function () { copy.textContent = 'Copy contract'; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(done).catch(sel); } else sel();
    function sel() { var r = document.createRange(); r.selectNodeContents(pv); var s = getSelection(); s.removeAllRanges(); s.addRange(r); status.textContent = 'Selected; press Cmd/Ctrl+C to copy.'; }
  });

  var E = window.EpiGate;
  var tables = null, keyMap = {}, originId = null;

  // build a claim record from a JSON spec, registering its key -> content identity.
  function buildClaim(spec) {
    var raw = { kind: spec.kind, statement: spec.statement, source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade };
    if (spec.checking_records) raw.checking_records = spec.checking_records;
    var rec = E.claimRecord(raw);
    keyMap[spec.key] = rec.identity;
    return rec;
  }
  // build a link record, resolving from/to keys to the identities registered above.
  function buildLink(spec) {
    var raw = { link_kind: spec.link_kind, from_identity: keyMap[spec.from], to_identity: keyMap[spec.to], source_id: spec.source_id, contributor_id: spec.contributor_id, declared_grade: spec.declared_grade };
    if (spec.support_group) raw.support_group = spec.support_group;
    if (raw.from_identity == null || raw.to_identity == null) throw new Error('link references an unknown claim key: ' + spec.from + ' -> ' + spec.to);
    return E.linkRecord(raw);
  }
  function shorten(id) { return id.slice(0, 10); }

  // decide over the current state, then apply. Returns the receipt and the next state.
  function compose(state, contrib) {
    var claims = (contrib.claims || []).map(buildClaim);
    var links = (contrib.links || []).map(buildLink);
    var receipt = E.decide({ hash: contrib.id, entries: claims, links: links }, E.storeViewOf(state, tables), {});
    var next = receipt.decision === 'declined' ? state : E.apply(state, {
      entries: claims, links: links,
      contradiction_records: receipt.contradiction_records, corroboration_findings: receipt.corroboration_findings,
      applied_contribution_hash: contrib.id, receipt_reference: E.hashOf(receipt),
    });
    return { receipt: receipt, state: next, claims: claims, links: links };
  }

  function report(lines, label, step, state) {
    lines.push('[' + label + ']  decision: ' + step.receipt.decision.toUpperCase());
    var view = E.storeViewOf(state, tables);
    var og = view.earnedByIdentity.get(originId);
    if (og) lines.push('   covid.origin  earned = ' + og.earned);
    var cf = (step.receipt.corroboration_findings || []).filter(function (c) { return c.identity === originId; })[0];
    if (cf) lines.push('   corroboration on covid.origin: ' + cf.verdict + ', effective_count = ' + cf.effective_count);
    for (var i = 0; i < (step.receipt.grade_table || []).length; i++) {
      var g = step.receipt.grade_table[i];
      lines.push('     ' + shorten(g.identity) + '  declared=' + g.declared_grade + '  earned=' + g.earned_grade);
    }
    lines.push('');
  }

  function run() {
    btn.disabled = true;
    try {
      if (!E) { status.textContent = 'The gate bundle did not load.'; btn.disabled = false; return; }
      tables = (function () { var t = JSON.parse(txt('cg-tables')); return { sourceTable: E.makeSourceTable(t.sources), kindTable: E.makeKindTable(t.kinds) }; })();
      keyMap = {};
      var lines = [];
      var state = E.genesis();

      var incumbent = JSON.parse(txt('cg-incumbent'));
      var incStep = compose(state, incumbent);
      state = incStep.state;
      originId = keyMap['covid.origin'];
      lines.push('incumbent map: covid.origin present, earned = ' + E.storeViewOf(state, tables).earnedByIdentity.get(originId).earned + ' (no support yet)');
      lines.push('');

      var ran = [];
      [['A', 'cgA'], ['B', 'cgB'], ['C', 'cgC']].forEach(function (pr) {
        if (document.getElementById(pr[1]).checked) {
          var contrib = JSON.parse(txt('cg-' + pr[0]));
          var step = compose(state, contrib); state = step.state;
          report(lines, pr[0] + ' · ' + (contrib.label || pr[0]), step, state);
          ran.push(pr[0]);
        }
      });

      if (document.getElementById('cgD').checked) {
        var rawText = cleanJSON(document.getElementById('cgPaste').value);
        if (!rawText) { status.textContent = 'D is ticked but the paste box is empty. Paste your JSON contribution, or untick D.'; btn.disabled = false; return; }
        var parsed;
        try { parsed = JSON.parse(rawText); }
        catch (e) { status.textContent = 'Your contribution is not valid JSON after cleanup: ' + e.message; out.classList.remove('show'); btn.disabled = false; return; }
        var did = (document.getElementById('cgDid').value || 'D').replace(/[^A-Za-z0-9]/g, '').slice(0, 12) || 'D';
        parsed.id = did;
        try {
          var dstep = compose(state, parsed); state = dstep.state;
          report(lines, did + ' · ' + (parsed.label || 'your contribution'), dstep, state);
          ran.push(did);
        } catch (e2) { status.textContent = 'The gate rejected your contribution: ' + e2.message; out.classList.remove('show'); btn.disabled = false; return; }
      }

      lines.push('final store: ' + state.state_hash.slice(0, 16) + '…  (' + (state.entries || []).length + ' entries, ' + (state.links || []).length + ' links)');
      out.textContent = lines.join('\n'); out.classList.add('show');
      status.textContent = 'ran the v3 gate over: incumbent + ' + (ran.join(' + ') || '(no contributions)') + '  —  no network, no model in the loop';
    } catch (err) {
      status.textContent = 'compose error: ' + (err && err.message ? err.message : err);
      out.classList.remove('show');
    } finally { btn.disabled = false; }
  }
  btn.addEventListener('click', run);
  }
  window.EpiComposeGate = { init: init };
  if (typeof document !== 'undefined' && document.getElementById('cgBtn')) init(); // classic page: DOM present at load
})();
