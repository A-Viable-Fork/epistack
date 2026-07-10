// Role: build the standalone kernel-manager probe page. Runs build/vendor-federation.mjs, then inlines
//   the shell, the manager module, the vendored contract and snapshot, and the federation view into one
//   file (manager-probe.html) that opens from file:// with no server. Separate from build/bundle.js on
//   purpose: this slice ships its own probe page and does not rebuild submission.html.
// Contract: `node build/build-manager-probe.mjs` writes manager-probe.html at the repo root. No arguments.
// Invariant: same @@INCLUDE@@ inlining bundle.js uses, so the probe page carries the real contract and
//   the real federation view, nothing mocked. Deterministic: the same sources produce the same page.
"use strict";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = /@@INCLUDE:([^@]+)@@/g;

// refresh the federation view from the real machinery before inlining it.
execFileSync("node", [join(ROOT, "build/vendor-federation.mjs")], { stdio: "inherit" });

const template = "periphery/navigate/shell/manager-probe.template.html";
let tpl = readFileSync(join(ROOT, template), "utf8");
const included = [];
const out = tpl.replace(TOKEN, (_, rel) => {
  rel = rel.trim();
  let body = readFileSync(join(ROOT, rel), "utf8").replace(/\n$/, "");
  included.push(rel);
  return body;
});
const leftover = out.match(TOKEN);
if (leftover) throw new Error(`manager-probe.html: unresolved include tokens: ${leftover.join(", ")}`);
writeFileSync(join(ROOT, "manager-probe.html"), out);
console.log(`built manager-probe.html (${out.length} bytes) from ${included.length} inlined sources`);
