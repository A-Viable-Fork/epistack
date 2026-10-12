// Role: holds the licensing layout to LICENSING.md: every license text present and the license it says,
//   every layer directory's LICENSE pointer naming its license and a text that exists, and the vendored
//   third-party code carrying its own notice.
// Contract: `node build/check-licensing.mjs` exits non-zero on any failure, naming it.
// Invariant: reads only. It checks the files say what LICENSING.md says; whether the scheme is right is the
//   operator's ruling, not this check's.
"use strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), "utf8") : "");
const H = "=".repeat(80);
console.log(H + "\nCHECK-LICENSING: the files say what LICENSING.md says\n" + H);

const TEXTS = { "LICENSE": "Apache License", "LICENSE-AGPL.txt": "GNU AFFERO GENERAL PUBLIC LICENSE", "LICENSE-CC0.txt": "CC0", "LICENSE-CC-BY.txt": "Attribution 4.0 International", "LICENSE-CC-BY-SA.txt": "Attribution-ShareAlike 4.0 International" };
for (const [f, mark] of Object.entries(TEXTS)) ok(read(f).includes(mark), `${f} is present and is the ${mark} text`);
const POINTERS = { "periphery/LICENSE": ["AGPL-3.0-or-later", "LICENSE-AGPL.txt"], "corpora/LICENSE": ["CC-BY-4.0", "LICENSE-CC-BY.txt"], "docs/LICENSE": ["CC-BY-SA-4.0", "LICENSE-CC-BY-SA.txt"], "archive/LICENSE": ["CC-BY-SA-4.0", "LICENSE-CC-BY-SA.txt"] };
const table = read("LICENSING.md");
for (const [f, [id, text]] of Object.entries(POINTERS)) {
  ok(read(f).startsWith(id) && read(f).includes(text), `${f} names ${id} and its text ${text}`);
  ok(table.includes(`\`${dirname(f)}/\``) && table.includes(id), `LICENSING.md assigns ${dirname(f)}/ to ${id}`);
}
ok(read("docs/LICENSE").includes("Type: specification") && read("docs/LICENSE").includes("CC0-1.0"), "docs/LICENSE carries the specification exception to CC0");
ok(read("vendor/katex/LICENSE").includes("MIT License") && read("vendor/katex/LICENSE").includes("Khan Academy"), "vendored KaTeX carries its own MIT notice");
ok(/license:\n(\s+- "[^"]+"\n){5}/.test(read("CITATION.cff")), "CITATION.cff lists the five licenses");

console.log("\n" + H + "\n" + (fails ? `check-licensing: ${fails} FAILURE(S)` : "check-licensing: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
