// Role: the self-contained kernel file's own surface. It renders one generated kernel's claims and their
//   grounding from the vendored snapshot through the real read contract, and wires the download-repo
//   button that hands the whole kernel back as a detached repository (a store-only zip of the inlined
//   bundle: the kernel's real files, the substrate vendored at a pin, the build imports rewritten). It
//   reuses the propose widget for authoring; it computes no grade and stores no truth of its own.
// Contract: reads #kernel-meta (id, pin), #pw-snapshot (the store), and #detached-bundle (the repo tree),
//   and the vendored contract (window.EpiClientApi / EpiLocalProvider). Renders into #kernel-claims and
//   binds #kernel-download. Periphery: reaches the kernel only through the contract.
// Invariant: the claims and grades shown are the contract's, not the surface's; the downloaded repo is the
//   exact inlined bundle, not a re-derivation. An empty kernel renders as empty and says so.
(function () {
  "use strict";

  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  // ---- a store-only (no compression) ZIP encoder, self-contained and offline ----
  // The detached repo is small text; store-only keeps the encoder tiny and the output valid everywhere.
  var CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(bytes) {
    var c = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  function utf8(s) { return new TextEncoder().encode(s); }
  function u16(n) { return [n & 0xff, (n >>> 8) & 0xff]; }
  function u32(n) { return [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]; }

  function zipStore(files) {
    // files: { relpath: contentString }. Returns a Uint8Array of a store-only zip.
    var names = Object.keys(files).sort();
    var chunks = [], central = [], offset = 0;
    function push(arr, bytes) { arr.push(bytes); }
    var localParts = [];
    names.forEach(function (name) {
      var nameB = utf8(name), dataB = utf8(files[name]), crc = crc32(dataB);
      var local = [].concat(u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(dataB.length), u32(dataB.length), u16(nameB.length), u16(0));
      var localHead = new Uint8Array(local);
      localParts.push(localHead, nameB, dataB);
      var cd = [].concat(u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(dataB.length), u32(dataB.length), u16(nameB.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset));
      central.push(new Uint8Array(cd), nameB);
      offset += localHead.length + nameB.length + dataB.length;
    });
    var localSize = offset;
    var centralSize = central.reduce(function (a, b) { return a + b.length; }, 0);
    var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(names.length), u16(names.length),
      u32(centralSize), u32(localSize), u16(0)));
    var all = localParts.concat(central, [end]);
    var total = all.reduce(function (a, b) { return a + b.length; }, 0);
    var out = new Uint8Array(total), p = 0;
    all.forEach(function (b) { out.set(b, p); p += b.length; });
    return out;
  }

  function renderClaims(api, host, meta) {
    var claims = api.read({});
    if (!claims.length) {
      host.innerHTML = '<p class="kf-empty">This kernel carries <strong>no claims yet</strong>. Its ' +
        'sources and kinds are grounded and its gate is live: author the first claim below and the ' +
        'receipt is graded against this empty store.</p>';
      return;
    }
    var rows = claims.map(function (c) {
      return '<tr><td>' + esc(c.kind) + '</td><td class="kf-stmt">' + esc(c.statement) + '</td>' +
        '<td><code>' + esc(c.source_id || "") + '</code></td>' +
        '<td>' + esc(c.declared_grade || "auto") + '</td>' +
        '<td><strong>' + esc(c.earned_grade) + '</strong></td></tr>';
    }).join("");
    host.innerHTML = '<table class="kf-claims"><thead><tr><th>kind</th><th>claim</th><th>source</th>' +
      '<th>declared</th><th>earned</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function init() {
    var meta = JSON.parse(document.getElementById("kernel-meta").textContent);
    var snap = JSON.parse(document.getElementById("pw-snapshot").textContent);
    var host = document.getElementById("kernel-claims");
    var status = document.getElementById("kernel-download-status");
    if (!window.EpiClientApi) { if (host) host.textContent = "The client bundle did not load."; return; }
    var api = window.EpiClientApi.createClientApi(window.EpiLocalProvider.createLocalProvider(snap));
    if (host) renderClaims(api, host, meta);

    var btn = document.getElementById("kernel-download");
    if (btn) btn.addEventListener("click", function () {
      var bundle = JSON.parse(document.getElementById("detached-bundle").textContent);
      var zip = zipStore(bundle.files);
      var blob = new Blob([zip], { type: "application/zip" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = bundle.id + "-detached.zip";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      if (status) status.textContent = "Downloaded " + bundle.id + "-detached.zip: " +
        Object.keys(bundle.files).length + " files, substrate pinned at " + bundle.pin.slice(0, 16) + ".";
    });

    // authoring returns the gate's receipt; it does not accrete into this file's store (a file-scheme
    // artifact has no server), so the claims list above is the kernel's grounded corpus, not the receipt.
    window.EpiKernelFile = { zipStore: zipStore };
  }

  window.EpiKernelFile = window.EpiKernelFile || {};
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})();
