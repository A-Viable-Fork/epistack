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

const ROOT = path.resolve(__dirname, "..");
const TOKEN = /@@INCLUDE:([^@]+)@@/g;

// Build targets: each template inlines its @@INCLUDE@@ modules into one standalone file.
//   submission.html is the migrated artifact; v1.html is the decompose surface (the v1
//   milestone, kept separate until it is reviewed and merged into the deliverable).
const TARGETS = [
  { template: "view/index.template.html", out: "submission.html" },
  { template: "view/decompose.template.html", out: "v1.html" },
];

function buildOne(target) {
  let tpl = fs.readFileSync(path.join(ROOT, target.template), "utf8");
  const included = [];
  const out = tpl.replace(TOKEN, (_, rel) => {
    const abs = path.join(ROOT, rel.trim());
    let body = fs.readFileSync(abs, "utf8");
    // Inlined JS/data carries a UMD export tail for headless (Node) use; harmless in
    // the browser (module is undefined). Strip a trailing newline so the inlined
    // block sits flush inside its tag, matching the single-file layout.
    body = body.replace(/\n$/, "");
    included.push(rel.trim());
    return body;
  });
  const leftover = out.match(TOKEN);
  if (leftover) throw new Error(`${target.out}: unresolved include tokens: ` + leftover.join(", "));
  fs.writeFileSync(path.join(ROOT, target.out), out);
  console.log(`built ${target.out} (${out.length} bytes) from ${included.length} modules`);
}

for (const t of TARGETS) buildOne(t);
