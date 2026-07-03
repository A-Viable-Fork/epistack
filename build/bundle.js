#!/usr/bin/env node
// Role: the deliverable build. Inlines the data + engine + view modules back into
//   one standalone submission.html that opens from file:// (design axiom T0-6).
// Contract: reads view/index.template.html and the files named by its @@INCLUDE@@
//   tokens; writes submission.html at the repo root. No network, no minify.
// Invariant: the source modules are the forkable artifact; this single file is the
//   deliverable. The build only inlines and never rewrites, so submission.html
//   reproduces the modular source's behavior. Readable on purpose (no obfuscation).
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "..");

// regenerate the frozen corpus snapshot and the browser gate bundle first, so the deliverable is
// never stale: the client proposes against the snapshot, and both are inlined into the artifact.
execFileSync("node", [path.join(__dirname, "vendor-snapshot.mjs")], { stdio: "inherit" });
execFileSync("node", [path.join(__dirname, "vendor-gate-browser.mjs")], { stdio: "inherit" });
const TOKEN = /@@INCLUDE:([^@]+)@@/g;
const MANIFEST_TOKEN = "@@CLIENT_MANIFESTS@@";

// gather every thin-client manifest under clients/ into one inlined object. A community client
// is a validated manifest dropped into clients/; the build picks it up with no other change.
function clientManifests() {
  const dir = path.join(ROOT, "periphery", "navigate", "clients");
  if (!fs.existsSync(dir)) return "var MANIFESTS = {};";
  const out = {};
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const m = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    out[m.id] = m;
  }
  return "var MANIFESTS = " + JSON.stringify(out, null, 2) + ";";
}

// Build targets: each template inlines its @@INCLUDE@@ modules into one standalone file.
//   submission.html is the migrated artifact; v1.html is the decompose surface (the v1
//   milestone, kept separate until it is reviewed and merged into the deliverable).
const TARGETS = [
  { template: "periphery/navigate/shell/shell.template.html", out: "submission.html" },
  { template: "periphery/navigate/render/decompose.template.html", out: "v1.html" },
];

function buildOne(target) {
  let tpl = fs.readFileSync(path.join(ROOT, target.template), "utf8");
  tpl = tpl.split(MANIFEST_TOKEN).join(clientManifests()); // inline the thin-client manifests
  const included = [];
  const out = tpl.replace(TOKEN, (_, rel) => {
    rel = rel.trim();
    const abs = path.join(ROOT, rel);
    let body = fs.readFileSync(abs, "utf8");
    // Inlined JS/data carries a UMD export tail for headless (Node) use; harmless in
    // the browser (module is undefined). Strip a trailing newline so the inlined
    // block sits flush inside its tag, matching the single-file layout.
    body = body.replace(/\n$/, "");
    included.push(rel);
    // Case modules each declare `const CASE = ...`; two of them at top level would collide.
    // Wrap each case include in an IIFE that scopes its CASE and registers it on window.CASES,
    // so many cases coexist in one bundle. The host reads window.CASES.
    if (/^corpora\/(lhc|population|covid|eggs)\//.test(rel)) {
      return "(function(){\n" + body + "\n;(window.CASES=window.CASES||[]).push(CASE);\n})();";
    }
    return body;
  });
  const leftover = out.match(TOKEN);
  if (leftover) throw new Error(`${target.out}: unresolved include tokens: ` + leftover.join(", "));
  fs.writeFileSync(path.join(ROOT, target.out), out);
  console.log(`built ${target.out} (${out.length} bytes) from ${included.length} modules`);
}

for (const t of TARGETS) buildOne(t);
