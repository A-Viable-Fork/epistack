// Role: the documentation-graph oracle (Prompt 37). Verifies the two typed dependency chains the
//   document-style-guide defines, by their two different truth conditions. The argument chain is
//   authored and checked for SYMMETRY: every "Depends on" edge has its "Depended on by" backlink and
//   vice versa (the dangling-citation check, the documentation analog of the contamination the kernel
//   forbids). The code chain is derived and checked for AGREEMENT with the real imports: every declared
//   code edge is a real cross-directory import and every such import is declared.
// Contract: `node build/check-docs.mjs`. Exits 0 if both graphs hold, 1 with a named report. Reads the
//   front-matter header of every tracked .md document; the generated repo map (docs/repo-map.md) is
//   excluded per the guide. Pure over the tree; imports nothing from the repo.
// Invariant: the argument chain is authored (only symmetry is machine-checkable); the code chain is
//   derived from imports, never hand-trusted. A missing backlink or an undeclared import fails the check.
"use strict";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fails = [];
const fail = (m) => fails.push(m);
const H = "=".repeat(80);

// ---- collect every tracked .md document (the generated repo map is excluded) ----
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "vendor") continue; // vendor/ is build output, not authored docs
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md")) out.push(relative(ROOT, p).replace(/\\/g, "/"));
  }
  return out;
}
const EXCLUDE = new Set(["docs/repo-map.md", "docs/submission-overview.md"]); // outward-facing pages, outside the internal argument graph
const docs = walk(ROOT).filter((d) => !EXCLUDE.has(d)).sort();

// ---- parse the front-matter header of each document ----
const MD = /[A-Za-z0-9_./-]+\.md/g;
function parseHeader(rel) {
  const text = readFileSync(join(ROOT, rel), "utf8");
  const m = text.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const block = m[1];
  const field = (name) => {
    const fm = block.match(new RegExp("^" + name + ":(.*)$", "mi"));
    if (!fm) return null;
    return (fm[1].match(MD) || []);
  };
  return {
    type: (block.match(/^Type:\s*(.+)$/mi) || [])[1] || null,
    purpose: (block.match(/^Purpose:\s*(.+)$/mi) || [])[1] || null,
    dependsOn: field("Depends on") || [],
    dependedOnBy: field("Depended on by") || [],
    codeDependsOn: field("Code depends on") || [],
    codeDependedOnBy: field("Code depended on by") || [],
  };
}

const hdr = new Map();
for (const d of docs) {
  const h = parseHeader(d);
  if (!h) { fail(`header: ${d} carries no front-matter header (Type/Purpose/Dependencies)`); continue; }
  if (!h.type) fail(`header: ${d} has no Type`);
  if (!h.purpose) fail(`header: ${d} has no Purpose`);
  hdr.set(d, h);
}

// ---- Part 1: the argument chain is symmetric ----
// every "Depends on: T" in D has "Depended on by: D" in T, and every "Depended on by: T" in D has
// "Depends on: D" in T. A missing backlink is a dangling citation.
console.log(H); console.log("CHECK-DOCS (Prompt 37): the documentation is a typed graph with resolving edges"); console.log(H);
console.log("\n[1] the argument chain is symmetric (no dangling citation)");
let edgeCount = 0, sym = 0;
for (const [d, h] of hdr) {
  for (const t of h.dependsOn) {
    edgeCount++;
    if (!hdr.has(t)) { fail(`argument: ${d} depends on ${t}, which is not a document in the tree`); continue; }
    if (!hdr.get(t).dependedOnBy.includes(d)) fail(`argument: ${d} declares "Depends on: ${t}", but ${t} has no matching "Depended on by: ${d}" (dangling citation)`);
    else sym++;
  }
  for (const t of h.dependedOnBy) {
    if (!hdr.has(t)) { fail(`argument: ${d} is depended on by ${t}, which is not a document in the tree`); continue; }
    if (!hdr.get(t).dependsOn.includes(d)) fail(`argument: ${d} declares "Depended on by: ${t}", but ${t} has no matching "Depends on: ${d}" (dangling backlink)`);
  }
}
console.log(`      ${edgeCount} argument edges, ${sym} with a resolved backlink; ${docs.length} documents typed`);

// ---- Part 2: the code chain agrees with the imports ----
// The doc-owned code directories are those with a README. An import from a file in one to a file in
// another is a cross-document code edge; the READMEs declare exactly these, derived not authored.
console.log("\n[2] the code chain agrees with the actual imports");
const CODE_DIRS = ["kernel", "api", "periphery"].filter((d) => existsSync(join(ROOT, d, "README.md")));
const README = Object.fromEntries(CODE_DIRS.map((d) => [d, d + "/README.md"]));
const IMPORT_RE = [/require\(\s*["']([^"']+)["']\s*\)/g, /import\s+[^"';]*?from\s*["']([^"']+)["']/g, /import\s*["']([^"']+)["']/g];
function codeFiles(dir) {
  const out = [];
  (function w(d) {
    if (!existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) w(p);
      else if (/\.(js|mjs)$/.test(e.name)) out.push(p);
    }
  })(join(ROOT, dir));
  return out;
}
const dirOf = (absTarget) => {
  const r = relative(ROOT, absTarget).replace(/\\/g, "/");
  const top = r.split("/")[0];
  return CODE_DIRS.includes(top) ? top : null;
};
// derive the real cross-directory edges: from -> to (from imports to)
const derived = new Set();
for (const fromDir of CODE_DIRS) {
  for (const f of codeFiles(fromDir)) {
    const src = readFileSync(f, "utf8");
    for (const reOrig of IMPORT_RE) {
      const re = new RegExp(reOrig.source, "g");
      let m;
      while ((m = re.exec(src))) {
        const spec = m[1];
        if (!spec.startsWith(".")) continue;
        const toAbs = resolve(dirname(f), spec);
        const toDir = dirOf(existsSync(toAbs) ? toAbs : (existsSync(toAbs + ".js") ? toAbs + ".js" : toAbs));
        if (toDir && toDir !== fromDir) derived.add(fromDir + " -> " + toDir);
      }
    }
  }
}
// declared edges from the READMEs
const declared = new Set();
for (const d of CODE_DIRS) {
  const h = hdr.get(README[d]);
  if (!h) { fail(`code: ${d}/README.md missing`); continue; }
  for (const t of h.codeDependsOn) declared.add(d + " -> " + Object.keys(README).find((k) => README[k] === t));
}
// every declared edge is a real import
for (const e of declared) if (!derived.has(e)) fail(`code: declared code edge "${e}" has no matching import`);
// every real cross-directory import is declared
for (const e of derived) if (!declared.has(e)) fail(`code: import "${e}" crosses a document boundary but is not declared`);
// backlink symmetry on the code chain too
for (const d of CODE_DIRS) {
  const h = hdr.get(README[d]);
  for (const t of h.codeDependsOn) if (!hdr.get(t) || !hdr.get(t).codeDependedOnBy.includes(README[d])) fail(`code: ${README[d]} depends on ${t} without the matching "Code depended on by" backlink`);
}
console.log(`      derived ${derived.size} cross-directory import edge(s): ${[...derived].sort().join(", ") || "none"}`);
console.log(`      declared ${declared.size}; they agree`);

// ---- report ----
console.log("\n" + H);
if (fails.length) {
  console.error(`check-docs: ${fails.length} FAILURE(S):`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log(`verified: every Depends-on edge has its backlink; ${docs.length} documents, the argument graph symmetric.`);
console.log(`check-docs: OK (${docs.length} documents, argument graph symmetric, code graph agrees with imports)`);
console.log(H);
