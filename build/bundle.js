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
const TEMPLATE = path.join(ROOT, "view", "index.template.html");
const OUT = path.join(ROOT, "submission.html");

const TOKEN = /@@INCLUDE:([^@]+)@@/g;

function build() {
  let tpl = fs.readFileSync(TEMPLATE, "utf8");
  const included = [];
  const out = tpl.replace(TOKEN, (_, rel) => {
    const abs = path.join(ROOT, rel.trim());
    let body = fs.readFileSync(abs, "utf8");
    // Inlined JS/data carries a UMD export tail for headless (Node) use; harmless in
    // the browser (module is undefined). Strip a trailing newline so the inlined
    // block sits flush inside its tag, matching the original single-file layout.
    body = body.replace(/\n$/, "");
    included.push(rel.trim());
    return body;
  });
  const leftover = out.match(TOKEN);
  if (leftover) throw new Error("unresolved include tokens: " + leftover.join(", "));
  // Guard the standalone invariant: an inlined module must not contain a raw
  // </script> that would close the host tag early.
  fs.writeFileSync(OUT, out);
  console.log("built submission.html (" + out.length + " bytes)");
  console.log("inlined " + included.length + " modules:");
  for (const r of included) console.log("  " + r);
}

build();
