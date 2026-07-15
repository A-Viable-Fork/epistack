// Role: the contribution-export and standalone-snapshot oracle. Verifies the two thin additions the
//   first deployment consumes: a gate-decided proposal packages as a portable bundle with a
//   content-derived id that catches tampering, and the kernel snapshot emits as a static JSON a fat
//   client loads and runs the real gate over. Neither touches the gate, grounding, or crossing.
// Contract: `node build/check-contribution.mjs` exits non-zero on any failure, with named causes.
//   Imports the api export tools, the snapshot emit, and the local provider and client contract.
// Invariant: the id is order-independent and the sole integrity anchor (a tampered bundle is rejected
//   loudly, never repaired); a bundle asserts gate passage, never admission; the snapshot hash verifies
//   against content. The end-to-end proof is that a static file on any host is a working kernel.
"use strict";
import { readFileSync, unlinkSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { exportContribution, importContribution, contributionId } from "../api/contribution.js";
import { emitSnapshot, verifySnapshot } from "./emit-snapshot.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { createClientApi } from "../api/client-api.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { genesis } from "../kernel/store/state.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-CONTRIBUTION: the portable gate-passed bundle and the static-hosting snapshot"); console.log(H);

// a fixed proposal (records with deterministic content) and its pinned id.
const distinctCheck = { checker_id: "C1", method_class: "replication", method: "re-ran", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
const c1 = claimRecord({ kind: "measurement", statement: "the fixed measured claim", source_id: "S1", contributor_id: "P1", declared_grade: "checked", checking_records: [distinctCheck] });
const c2 = claimRecord({ kind: "measurement", statement: "the fixed premise", source_id: "S2", contributor_id: "P1", declared_grade: "checked" });
const link = linkRecord({ link_kind: "supports", from_identity: c2.identity, to_identity: c1.identity, support_group: "g", source_id: "S2", contributor_id: "P1", declared_grade: "checked" });
const proposal = { entries: [c1, c2], links: [link] };
const PINNED_ID = "13270b771dce1360aa652f014c6c051aa813c081c510d472f2f124f83933bde3";

// a real gate receipt over this proposal, so the bundle carries what the gate actually returned.
const tables = { sourceTable: makeSourceTable([{ source_id: "S1", source_class: "primary-measurement", rests_on: [] }, { source_id: "S2", source_class: "peer-reviewed", rests_on: [] }]), kindTable: makeKindTable([{ kind: "measurement", ceiling: "checked", compatibility_rule_id: null }]) };
const receipt = decide({ hash: "H-CONTRIB", entries: proposal.entries, links: proposal.links }, storeViewOf(genesis(), tables), {});
const bundle = exportContribution(proposal, receipt, { kernel_id: "math", state_id: "ST0" });

// --- 1. id determinism: fixed proposal, stable and equal to the pinned value; permutation invariant ---
console.log("\n[1] id determinism and order-independence");
{
  ok(contributionId(proposal) === PINNED_ID, `the id equals the pinned value (got ${contributionId(proposal).slice(0, 12)})`);
  ok(contributionId(proposal) === contributionId(proposal), "the id is stable across runs");
  const permuted = { entries: [c2, c1], links: [link] };
  ok(contributionId(permuted) === PINNED_ID, "permuting record order in the input leaves the id unchanged");
}

// --- 2. round-trip: export then import, records byte-identical under canonical form; id verifies ---
console.log("\n[2] round-trip (export then import is byte-identical under canonicalization)");
{
  const back = importContribution(bundle);
  const canon = (p) => JSON.stringify([...p.entries.map((e) => e.canonical), ...p.links.map((l) => l.canonical)]);
  ok(canon(back) === canon(proposal), "every imported record's canonical form matches the exported one, byte for byte");
  ok(contributionId(back) === bundle.contribution_id, "the imported proposal recomputes the bundle's contribution id");
  ok(bundle.protocol === "v3" && bundle.origin.kernel_id === "math", "the bundle carries the protocol identity and the origin kernel");
}

// --- 3. tamper rejection: mutate one field of a bundled record, import throws naming the id mismatch ---
console.log("\n[3] tamper rejection (a mutated bundle is rejected loudly, never repaired)");
{
  const tampered = JSON.parse(JSON.stringify(bundle));
  tampered.proposal.entries[0].statement = "the fixed measured claim, quietly altered";
  let threw = false, named = false;
  try { importContribution(tampered); } catch (e) { threw = true; named = /id mismatch/.test(e.message); }
  ok(threw && named, "editing a statement inside the bundle makes import throw, naming the id mismatch");
  // a non-identity field (the source) is caught too, because the record is rebuilt from all its inputs.
  const t2 = JSON.parse(JSON.stringify(bundle));
  t2.proposal.entries[1].source_id = "S-forged";
  let threw2 = false;
  try { importContribution(t2); } catch (e) { threw2 = /id mismatch/.test(e.message); }
  ok(threw2, "editing a non-identity field (the source) is also caught by the recomputed id");
}

// --- 4. status honesty: no admission language outside a negation or the re-check instruction ---
console.log("\n[4] status honesty (a bundle asserts gate passage, never admission)");
{
  const text = (bundle.status + " " + bundle.instructions).toLowerCase();
  ok(bundle.status === "gate-passed, not admitted", "the status string is gate-passed, not admitted");
  // every occurrence of an admission token must be immediately preceded by a negation word.
  const NEG = new Set(["not", "never", "no"]);
  const words = text.replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  let cleanTokens = true;
  for (const tok of ["admitted", "accepted", "validated", "true"]) {
    for (let i = 0; i < words.length; i++) if (words[i] === tok) {
      const prev = i > 0 ? words[i - 1] : "";
      if (!NEG.has(prev)) { cleanTokens = false; console.log(`      token "${tok}" not under a negation (preceded by "${prev}")`); }
    }
  }
  ok(cleanTokens, "admitted, accepted, validated, and true appear only under a negation, never as a bare assertion");
  ok(/re-runs the gate|re-run/.test(bundle.instructions), "the instructions name re-check by the target as the admission step");
}

// --- 5. snapshot loads: static JSON to live provider to receipt (the end-to-end proof) ---
console.log("\n[5] snapshot loads (a static file on any host is a working kernel for a fat client)");
let emitted;
{
  const dest = join(ROOT, "vendor", "math", "check-contribution.snapshot.json");
  emitted = await emitSnapshot("math", dest);
  const parsed = JSON.parse(readFileSync(dest, "utf8"));
  const api = createClientApi(createLocalProvider(parsed));
  const rows = api.read({});
  ok(rows.length > 0 && rows.every((r) => r.identity && r.kind), `read returns projected claims from the parsed snapshot (${rows.length} rows)`);
  const r = api.propose({ statement: "a fat-client proposed claim against the loaded snapshot", kind: "theorem" });
  ok(r && typeof r.decision === "string" && Array.isArray(r.grade_table), `propose runs the real gate on device and returns a well-formed receipt (decision ${r.decision})`);
  ok(typeof r.certificate_hash === "string" && r.certificate_hash.length === 64, "the on-device receipt carries a certificate hash");
}

// --- 6. snapshot hash verifies against content; a mutated snapshot fails ---
console.log("\n[6] snapshot hash verifies against content");
{
  const parsed = JSON.parse(readFileSync(emitted.dest, "utf8"));
  ok(verifySnapshot(parsed).ok, `the emitted snapshot hash verifies against its content (${parsed.snapshot_hash.slice(0, 12)})`);
  const mutated = JSON.parse(JSON.stringify(parsed));
  mutated.kinds.push({ kind: "smuggled", ceiling: "constitutive" });
  ok(!verifySnapshot(mutated).ok, "a mutated snapshot fails hash verification");
}

// clean up: neither the check-only snapshot nor vendor-kernel's staging file is a committed artifact.
{
  if (existsSync(emitted.dest)) unlinkSync(emitted.dest);
  const staged = join(ROOT, "vendor", "math", "kernel-snapshot.json");
  if (existsSync(staged)) unlinkSync(staged);
  const dir = join(ROOT, "vendor", "math");
  try { rmSync(dir, { recursive: false }); } catch (e) { void e; } // remove only if now empty
}

console.log("\n" + H);
if (fails === 0) console.log("verified: a gate-decided proposal packages as a portable bundle whose content-derived id catches any tampering and whose text asserts gate passage rather than admission, and the kernel snapshot emits as a static JSON a fat client loads and runs the real gate over.");
console.log(fails === 0 ? "check-contribution: OK" : `check-contribution: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
