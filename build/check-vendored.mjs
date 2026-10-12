// Role: pins the vendored third-party bytes: every file under vendor/katex/ hashes to what PIN.json records,
//   and no file is there that the pin does not name. After A-Viable-Fork/EpiTrellis scripts/verify-vendor.py.
//   The generated vendor files (gate bundle, snapshot, case readings) are held fresh by regenerating them in
//   CI; third-party bytes cannot be regenerated here, so they are pinned instead.
// Contract: `node build/check-vendored.mjs` exits non-zero naming each mismatch.
// Invariant: reads only. A changed hash is a provenance failure to explain, never a pin to refresh silently.
"use strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H + "\nCHECK-VENDORED: third-party bytes match their pin\n" + H);
const dir = join(ROOT, "vendor/katex");
const pin = JSON.parse(readFileSync(join(dir, "PIN.json"), "utf8"));
for (const [f, { sha256 }] of Object.entries(pin.files)) {
  const got = createHash("sha256").update(readFileSync(join(dir, f))).digest("hex");
  ok(got === sha256, `vendor/katex/${f} ${got === sha256 ? "matches" : `is ${got.slice(0, 12)}, pinned ${sha256.slice(0, 12)}`} (${pin.package}@${pin.version})`);
}
for (const f of readdirSync(dir)) if (f !== "PIN.json") ok(f in pin.files, `vendor/katex/${f} is named by the pin`);
console.log("\n" + H + "\n" + (fails ? `check-vendored: ${fails} FAILURE(S)` : "check-vendored: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
