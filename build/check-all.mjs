// Role: the one gate: the privacy check first, the linter, every build/check-*.mjs (found by name, so a new
//   check cannot be left out of a hand-kept list), the vendored artifacts and the repo map regenerated and
//   compared with the copies on disk before the run, and the bundle rebuilt and compared.
// Contract: `node build/check-all.mjs` exits non-zero if any step fails, printing PASS or FAIL per step and
//   the tail of each failure. Regeneration writes the generated files in place; when everything was current
//   nothing changes, and when something was stale the run fails and leaves the regenerated file to commit.
// Invariant: it adds no rule of its own; every verdict is a step's exit code.
"use strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED = ["vendor/gate/gate.bundle.js", "vendor/gate/snapshot.json", "vendor/eggs/reading.json", "vendor/covid/reading.json",
  "vendor/lhc/reading.json", "vendor/demo/reading.json", "docs/repo-map.md", "docs/repo-map.generated.json", "submission.html"];
const checks = readdirSync(join(ROOT, "build")).filter((f) => /^check-.*\.mjs$/.test(f) && f !== "check-all.mjs" && f !== "check-privacy.mjs").sort();
const steps = [
  ["node", "build/check-privacy.mjs"],
  ["node", "linter.js"],
  ...checks.map((f) => ["node", `build/${f}`]),
  ...["snapshot", "gate-browser", "eggs", "covid", "lhc", "demo"].map((v) => ["node", `build/vendor-${v}.mjs`]),
  ["node", "build/bundle.js"],
];
// freshness: the generated files on disk before this run must equal what regeneration writes. On a fresh
// checkout that is the committed copy; before a commit it is the working tree, so regenerating and then
// committing is the normal path and never a false failure.
const hashOf = (f) => (existsSync(join(ROOT, f)) ? createHash("sha256").update(readFileSync(join(ROOT, f))).digest("hex") : "absent");
const before = new Map(GENERATED.map((f) => [f, hashOf(f)]));
let failed = 0;
for (const [cmd, ...args] of steps) {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const name = [cmd, ...args].join(" ").slice(0, 100);
  if (r.status === 0) { console.log(`PASS ${name}`); continue; }
  failed++;
  console.log(`FAIL ${name}`);
  console.log(((r.stdout || "") + (r.stderr || "")).trim().split("\n").slice(-12).map((l) => "    " + l).join("\n"));
}
const stale = GENERATED.filter((f) => hashOf(f) !== before.get(f));
if (stale.length) { failed++; console.log(`FAIL generated files were stale, now regenerated (review and commit): ${stale.join(", ")}`); }
else console.log(`PASS generated files current (${GENERATED.length})`);
console.log(failed ? `check-all: ${failed} step(s) failed of ${steps.length + 1}` : `check-all: PASS (${steps.length + 1} steps)`);
process.exit(failed ? 1 : 0);
