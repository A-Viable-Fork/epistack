// Role: build the self-contained kernel file for one generated kernel. It vendors the kernel's store
//   snapshot (build/vendor-kernel.mjs), refreshes the browser contract bundle
//   (build/vendor-gate-browser.mjs), assembles the detached repository (build/build-detached-kernel.mjs),
//   stages all three as JSON the template inlines, and produces <id>.kernel.html: one file that IS the
//   kernel, opens from file://, renders its claims and grounding, authors through the real gate, and
//   carries the detached repo the download button hands back. It reuses the gate, the contract, the
//   propose widget, and the receipt rendering; it reimplements none of them.
// Contract: `node build/build-kernel-file.mjs <id> [outfile]` writes <id>.kernel.html (default at the
//   repo root). Build layer; may reach any layer. The kernel's builder and corpora must already exist.
// Invariant: same @@INCLUDE inlining bundle.js uses, plus one @@KERNEL_ID@@ text token; the snapshot and
//   the detached bundle are the real vendored artifacts, not mocks. Scoped to one kernel; touches no case.
"use strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { vendorKernel } from "./vendor-kernel.mjs";
import { assembleDetached } from "./build-detached-kernel.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = /@@INCLUDE:([^@]+)@@/g;

export async function buildKernelFile(id, outfile) {
  // 1. the store snapshot the contract reads and the gate runs over, vendored from the kernel's builder.
  const { snapshot } = await vendorKernel(id);

  // 2. the detached repository this file hands back, assembled with a real substrate pin.
  const { files, pin } = assembleDetached(id);

  // 3. refresh the browser contract bundle (the real gate + providers, offline).
  execFileSync("node", [join(ROOT, "build/vendor-gate-browser.mjs")], { stdio: "inherit" });

  // 4. stage the per-kernel JSON the template inlines through @@INCLUDE.
  const stage = join(ROOT, "vendor/kernel-file");
  mkdirSync(stage, { recursive: true });
  writeFileSync(join(stage, "snapshot.json"), JSON.stringify(snapshot));
  writeFileSync(join(stage, "meta.json"), JSON.stringify({ id, pin }));
  writeFileSync(join(stage, "detached-bundle.json"), JSON.stringify({ id, pin, files }));

  // 5. inline: the id text token first, then every @@INCLUDE source.
  let tpl = readFileSync(join(ROOT, "periphery/navigate/shell/kernel.template.html"), "utf8");
  tpl = tpl.replace(/@@KERNEL_ID@@/g, id);
  const included = [];
  const out = tpl.replace(TOKEN, (_, rel) => {
    rel = rel.trim();
    included.push(rel);
    return readFileSync(join(ROOT, rel), "utf8").replace(/\n$/, "");
  });
  const leftover = out.match(TOKEN);
  if (leftover) throw new Error(`${id}.kernel.html: unresolved include tokens: ${leftover.join(", ")}`);

  const dest = outfile || join(ROOT, `${id}.kernel.html`);
  writeFileSync(dest, out);
  return { dest, bytes: out.length, included: included.length, claims: snapshot.state.entries.length, pin };
}

if (process.argv[1] && process.argv[1].endsWith("build-kernel-file.mjs")) {
  const id = process.argv[2];
  if (!id) { console.error("usage: node build/build-kernel-file.mjs <id> [outfile]"); process.exit(1); }
  const r = await buildKernelFile(id, process.argv[3]);
  console.log(`built ${r.dest} (${r.bytes} bytes) from ${r.included} inlined sources: ${r.claims} claims, substrate pin ${r.pin.slice(0, 16)}`);
}
