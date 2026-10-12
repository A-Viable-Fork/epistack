// Role: the self-description check: every repository path a tracked document names in backticks exists,
//   or is listed in build/self-description-absent.json with the reason it is absent; and every listed path is
//   still absent. After A-Viable-Fork/EpiTrellis scripts/verify-selfdescription.py, whose compost entry 10
//   recorded documents going stale against the tree they describe.
// Contract: `node build/check-self-description.mjs` exits non-zero naming each document and path.
// Invariant: reads only. A path counts when its first segment is a top-level entry of this tree and it has no
//   wildcard or placeholder; a named path in another repository says so and is listed, never guessed at.
"use strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H + "\nCHECK-SELF-DESCRIPTION: the paths documents name exist, or say why not\n" + H);
const { absent } = JSON.parse(readFileSync(join(ROOT, "build/self-description-absent.json"), "utf8"));
const tops = new Set(readdirSync(ROOT));
// .infra/ is the vendored kit: its documents describe the kit and every repository it serves, not this tree.
const docs = execFileSync("git", ["ls-files", "*.md"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter((d) => d && !d.startsWith(".infra/"));
const seen = new Set();
let named = 0;
for (const d of docs) {
  const text = readFileSync(join(ROOT, d), "utf8");
  for (const m of text.matchAll(/`([A-Za-z0-9_.\/-]+\/[A-Za-z0-9_.\/-]*)`/g)) {
    const p = m[1].replace(/\/$/, "");
    if (!tops.has(p.split("/")[0]) || /[*<>{}]/.test(p)) continue;
    named++;
    if (existsSync(join(ROOT, p))) continue;
    const reason = absent[d] && absent[d][p];
    seen.add(d + "\u0000" + p);
    ok(!!reason, `${d} names ${p}, which is absent${reason ? ": " + reason : " and unlisted"}`);
  }
}
for (const [d, paths] of Object.entries(absent)) for (const p of Object.keys(paths)) {
  if (existsSync(join(ROOT, p))) ok(false, `${p} is listed absent for ${d} but exists: drop the entry`);
  else if (!seen.has(d + "\u0000" + p)) ok(false, `${p} is listed absent for ${d}, which no longer names it: drop the entry`);
}
ok(true, `${named} path mentions across ${docs.length} documents`);
console.log("\n" + H + "\n" + (fails ? `check-self-description: ${fails} FAILURE(S)` : "check-self-description: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
