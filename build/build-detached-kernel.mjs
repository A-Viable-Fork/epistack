// Role: assemble a generated kernel as a detached repository with its substrate pinned. It vendors the
//   whole kernel (the substrate, self-contained, imports only itself) under substrate/kernel/, copies
//   the generated kernel's corpora and build files, rewrites the build files' ../kernel imports to the
//   substrate path, records a real content-hash pin of the substrate, and writes a README naming the
//   live git-submodule fetch as the production form this vendored pin stands in for. The detached repo
//   runs its check on unzip with no fetch step.
// Contract: assembleDetached(id) -> { files: { relpath: content }, pin }. CLI:
//   `node build/build-detached-kernel.mjs <id> <outdir>` writes the tree and prints where. Build layer,
//   may reach any layer; imports node builtins for the pin hash and the filesystem walk.
// Invariant: the pin is a real sha256 of the substrate content, not a placeholder; the fetch is the
//   deferred production mechanism, named in the README, never faked. No ../kernel reference remains in
//   the rewritten build files. The generated corpora and the shared subtree are copied verbatim.
"use strict";
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

export function assembleDetached(id) {
  const files = {};

  // the substrate: the whole kernel, vendored under substrate/kernel/. It imports only itself, so this
  // is complete with no extraction. The pin is a content hash over exactly these bytes.
  const kernelDir = join(ROOT, "kernel");
  const kernelFiles = walk(kernelDir).sort();
  const hash = createHash("sha256");
  for (const abs of kernelFiles) {
    const rel = relative(ROOT, abs).replace(/\\/g, "/"); // kernel/...
    const src = readFileSync(abs, "utf8");
    files["substrate/" + rel] = src;
    hash.update(rel + "\n" + src + "\n");
  }
  const pin = hash.digest("hex");

  // the shared subtree the kernel adopts (the common kinds), copied verbatim under its usual path.
  const sharedRel = "corpora/_shared/common-types.js";
  files[sharedRel] = readFileSync(join(ROOT, sharedRel), "utf8");

  // the generated kernel's own data (pure data, no ../kernel import), copied verbatim.
  for (const rel of [`corpora/${id}/tables.js`, `corpora/${id}/${id}-data.js`]) {
    files[rel] = readFileSync(join(ROOT, rel), "utf8");
  }

  // the generated build files: the only coupling to the substrate is ../kernel, rewritten to the pinned
  // substrate path. The ../corpora and ./build references keep the same layout and stay valid.
  for (const rel of [`build/${id}-build.mjs`, `build/check-${id}.mjs`]) {
    let src = readFileSync(join(ROOT, rel), "utf8");
    src = src.replace(/(["'])\.\.\/kernel\//g, "$1../substrate/kernel/");
    files[rel] = src;
  }

  files["substrate/PIN.txt"] = pin + "\n";
  files["README.md"] = readme(id, pin);
  return { files, pin };
}

function readme(id, pin) {
  return [
    `# Detached kernel: ${id}`,
    "",
    "This is a standalone knowledge kernel, detached from its origin repository. It runs immediately on",
    "unzip: its check passes against the pinned substrate with no fetch step.",
    "",
    "## Layout",
    "",
    "- `corpora/" + id + "/` the kernel's own data (its kind table, sources, and claims).",
    "- `corpora/_shared/common-types.js` the shared type subtree the kernel adopts.",
    "- `build/" + id + "-build.mjs`, `build/check-" + id + ".mjs` the build and the check.",
    "- `substrate/kernel/` the substrate, the trusted core, vendored in at a pinned version.",
    "- `substrate/PIN.txt` the substrate version this kernel is pinned to.",
    "",
    "## Run it",
    "",
    "```",
    "node build/check-" + id + ".mjs",
    "```",
    "",
    "The check imports the substrate through `../substrate/kernel/...` and passes against the pin below.",
    "",
    "## The pin, and the production form",
    "",
    "The substrate is pinned at content hash:",
    "",
    "```",
    pin,
    "```",
    "",
    "The substrate is vendored in at this pin so the detached kernel runs on unzip with no network. In",
    "production, this vendored directory is a git submodule fetched from a git host at the same pinned",
    "version; the live `git submodule` fetch is the production mechanism this vendored pin stands in for.",
    "The pin is real; the fetch is the deferred production form, named here and not faked.",
    "",
  ].join("\n");
}

// ---- CLI: write the detached tree to a directory ----
if (process.argv[1] && process.argv[1].endsWith("build-detached-kernel.mjs")) {
  const id = process.argv[2] || "eggs-regen";
  const outdir = process.argv[3] || join(ROOT, `.detached-${id}`);
  const { files, pin } = assembleDetached(id);
  for (const rel of Object.keys(files)) {
    const dest = join(outdir, rel);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, files[rel]);
  }
  console.log(`wrote detached kernel ${id} to ${outdir} (${Object.keys(files).length} files, substrate pin ${pin.slice(0, 16)})`);
}
