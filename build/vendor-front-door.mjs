// Role: vendor the front door (docs/the-climb-of-synthesis.md) into vendor/front-door/front-door.md so
//   the presentation shell renders the easy-register overview as its opening section from a file:// page
//   with no repo tree present. The canonical source stays the markdown doc; this copies its body (the
//   front-matter header stripped) so the shell holds no content of its own.
// Contract: `node build/vendor-front-door.mjs` writes vendor/front-door/front-door.md. No arguments. Deterministic.
// Invariant: periphery build artifact; it carries prose only, no grounding and no truth field. A re-run is
//   byte-identical, and the vendored body is the doc's body verbatim, never edited here.
"use strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(ROOT, "docs/the-climb-of-synthesis.md"), "utf8");
// strip the front-matter header (between the first pair of --- lines): metadata, not prose.
const body = src.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trimStart();

mkdirSync(join(ROOT, "vendor/front-door"), { recursive: true });
const out = body.endsWith("\n") ? body : body + "\n";
writeFileSync(join(ROOT, "vendor/front-door/front-door.md"), out);
console.log(`wrote vendor/front-door/front-door.md (${out.length} bytes): the front door, body only, front-matter stripped`);
