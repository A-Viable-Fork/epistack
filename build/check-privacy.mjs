// Role: the privacy gate, run first: no tracked file carries a link that is itself the access (a share link,
//   a document id, a token in a query string). Such a link is a capability, not an address, and git history
//   is not deletable in practice, so one landing is permanent. Adopted from A-Viable-Fork/EpiTrellis
//   scripts/verify-privacy.py, whose patterns these are, with the ChatGPT and Gemini share forms added.
// Contract: `node build/check-privacy.mjs` exits non-zero naming each file and line; it first proves each
//   pattern fires on an invented sample assembled at run time, so its own source carries none.
// Invariant: reads only. Vendored third-party bytes (vendor/katex) are skipped, for a reason: they are
//   minified upstream code, not anything a person here wrote or captured.
"use strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H + "\nCHECK-PRIVACY: no tracked file carries a capability link\n" + H);

const CAPABILITY = [
  ["share link (claude.ai)", /claude\.ai\/share\/[0-9a-f-]{8,}/i],
  ["share link (chatgpt)", /(chatgpt\.com|chat\.openai\.com)\/share\/[0-9a-f-]{8,}/i],
  ["share link (gemini)", /(gemini\.google\.com\/share|g\.co\/gemini\/share)\/[A-Za-z0-9_-]{6,}/i],
  ["document id (google docs)", /docs\.google\.com\/[a-z]+\/d\/[A-Za-z0-9_-]{20,}/i],
  ["shortlink (reddit)", /reddit\.com\/r\/[^/\s]+\/s\/[A-Za-z0-9]{6,}/i],
  ["token in a query string", /[?&](is|si|token|auth|key|access_token|sig)=[A-Za-z0-9_-]{10,}/i],
];

console.log("\n[1] each pattern fires on an invented sample");
const join2 = (...p) => p.join("");
const SAMPLES = [join2("https://claude", ".ai/share/", "0123abcd-0000"), join2("https://chatgpt", ".com/share/", "abcdef01-2345"), join2("https://gemini.google", ".com/share/", "abcdef12"),
  join2("https://docs.google", ".com/document/d/", "A".repeat(24)), join2("https://reddit", ".com/r/invented/s/", "AbCdEf12"), join2("https://example.invalid/x?", "token=", "abcdefghijkl")];
CAPABILITY.forEach(([name, re], i) => ok(re.test(SAMPLES[i]), `${name}: fires on its invented sample`));

console.log("\n[2] every tracked file");
const files = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" }).split("\n").filter((f) => f && !f.startsWith("vendor/katex/"));
let scanned = 0;
for (const f of files) {
  let text; try { text = readFileSync(join(ROOT, f), "utf8"); } catch { continue; }
  if (text.includes("\u0000")) continue; // binary
  scanned++;
  text.split("\n").forEach((line, i) => { for (const [name, re] of CAPABILITY) if (re.test(line)) ok(false, `${f}:${i + 1}: ${name}`); });
}
ok(true, `${scanned} tracked text files scanned`);

console.log("\n" + H + "\n" + (fails ? `check-privacy: ${fails} FAILURE(S)` : "check-privacy: OK") + "\n" + H);
process.exit(fails ? 1 : 0);
