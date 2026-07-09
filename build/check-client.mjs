// Role: the Phase A acceptance oracle for the propose/read contract and the local provider (Prompt
//   10). Confirms propose runs the REAL gate over the migrated snapshot and returns a full receipt,
//   read returns claims with their grounding, and the receipt is byte-identical to a direct kernel
//   run, so the artifact grades exactly as Node does.
// Contract: `node build/check-client.mjs` exits non-zero on any failure. Imports the contract, the
//   local provider, and (for the cross-check) the kernel gate directly.
// Invariant: the provider is the real gate, not a mock. A divergence between the provider's receipt
//   and the direct kernel receipt would fail here, which is what keeps the browser gate honest.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { claimRecord, linkRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { storeViewOf } from "../kernel/store/decay.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor/gate/snapshot.json"), "utf8"));

let fails = 0;
const ok = (cond, msg) => { console.log(`${cond ? "  ok  " : " FAIL "} ${msg}`); if (!cond) fails++; };
const H = "=".repeat(78);
const gradeRow = (r) => (r.grade_table || []).find((g) => g.identity === r.proposed_identity) || {};

const api = createClientApi(createLocalProvider(snapshot));
console.log(H); console.log("CHECK-CLIENT (Phase A): the propose/read contract over the local provider"); console.log(H);

// --- read: claims with their grounding ---
console.log("\n[1] read returns claims with their grounding");
{
  const all = api.read({});
  ok(all.length === (snapshot.state.entries || []).length && all.length > 0, `read({}) returns all ${all.length} snapshot claims`);
  ok(all.every((c) => c.identity && c.kind && c.statement && c.earned_grade), "every claim carries identity, kind, statement, earned_grade");
  const measurements = api.read({ kind: "measurement" });
  ok(measurements.length > 0 && measurements.every((c) => c.kind === "measurement"), `read({kind}) filters (${measurements.length} measurements, all earned=checked: ${measurements.every((c) => c.earned_grade === "checked")})`);
}

// --- propose: a fabricated measurement with no checking record enters as asserted ---
console.log("\n[2] a fabricated measurement with no citation enters at asserted");
let r2;
{
  r2 = api.propose({ statement: "The intermediate host was definitely a pangolin, measured directly.", kind: "measurement" });
  ok(r2.decision === "accepted", `decision ACCEPTED (got ${r2.decision})`);
  const g = gradeRow(r2);
  ok(g.earned_grade === "asserted", `earned grade asserted (got ${g.earned_grade})`);
  ok(g.S === "asserted" && g.B === "none", `basis reported: S=${g.S}, B=${g.B} (no support, no own basis)`);
}

// --- propose: adding a citation raises it (own basis) ---
console.log("\n[3] adding a citation raises the same claim (own basis)");
{
  const r = api.propose({ statement: "The intermediate host was definitely a pangolin, measured directly.", kind: "measurement", citation: "Lam et al. 2020, Nature" });
  const g = gradeRow(r);
  ok(r.decision === "accepted", `decision ACCEPTED (got ${r.decision})`);
  ok(g.earned_grade === "checked", `earned grade checked, capped by the measurement ceiling (got ${g.earned_grade})`);
  ok(g.B === "checked", `own basis B=checked from the distinct-party citation (got B=${g.B})`);
}

// --- propose: resting on existing store claims delivers support ---
console.log("\n[4] resting on existing store claims delivers support");
{
  const forumClaim = api.read({}).find((c) => c.kind === "forum");
  const measures = api.read({ kind: "measurement" }).slice(0, 2).map((c) => c.identity);
  const r = api.propose({ statement: "A synthesis resting on two independent measured premises.", kind: "claim", supports: measures });
  const g = gradeRow(r);
  ok(r.decision === "accepted", `decision ACCEPTED (got ${r.decision})`);
  ok(["supported", "corroborated"].includes(g.earned_grade), `earned grade lifted by support to ${g.earned_grade} (S=${g.S})`);
  ok(forumClaim && forumClaim.earned_grade === "corroborated", "read surfaces the priced-prior forum claim at corroborated (grounding from the snapshot)");
}

// --- propose: a malformed claim is refused with the failing check named ---
console.log("\n[5] a malformed claim is refused with the failing check named");
{
  const r = api.propose({ statement: "A claim declaring more than it can earn.", kind: "measurement", declared_grade: "independently-rechecked" });
  const overClaim = r.decision === "declined" && (r.decision_basis || []).length > 0;
  ok(overClaim, `declined with a named basis (decision=${r.decision}, basis=${JSON.stringify(r.decision_basis)})`);
  ok((r.findings || []).some((f) => f.finding_type === "well-formedness"), "a well-formedness finding names the failing rule");
  const noStatement = api.propose({ kind: "claim" });
  ok(noStatement.decision === "declined", "a claim with no statement is refused, not invented");
}

// --- the receipt is byte-identical to a direct kernel run ---
console.log("\n[6] the provider's receipt is byte-identical to a direct kernel run (real gate, not a mock)");
{
  const statement = "A cross-check claim proposed twice, once through the provider and once through the kernel.";
  const viaProvider = api.propose({ statement, kind: "claim" });
  // reproduce the exact same contribution against the kernel directly
  const kindTable = makeKindTable(snapshot.kinds);
  const claim = claimRecord({ kind: "claim", statement, source_id: "judge:unsourced", contributor_id: "judge", declared_grade: "asserted" });
  const tables = { kindTable, sourceTable: makeSourceTable([...snapshot.sources, { source_id: "judge:unsourced", source_class: "testimony", rests_on: [] }]) };
  const direct = decide({ hash: claim.hash, entries: [claim], links: [] }, storeViewOf(snapshot.state, tables), {});
  const strip = (r) => { const c = Object.assign({}, r); delete c.proposed_identity; return c; };
  ok(hashOf(strip(viaProvider)) === hashOf(direct), `receipt hash matches the direct kernel receipt (${hashOf(direct).slice(0, 16)})`);
  ok(viaProvider.proposed_identity === claim.identity, "the provider reports the proposed claim's identity");
}

// --- the seam: the client is provider-agnostic ---
console.log("\n[7] the provider seam");
{
  ok(api.providerKind() === "local", `the client reports its provider kind: ${api.providerKind()}`);
  ok(typeof api.propose === "function" && typeof api.read === "function", "the contract exposes exactly propose and read");
}

console.log("\n" + H);
if (fails === 0) console.log("verified: a client-side reading is byte-identical to a direct kernel run over the same contract.");
console.log(fails === 0 ? "check-client: OK (real gate client-side, receipt identical to Node)" : `check-client: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
