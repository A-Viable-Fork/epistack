// Role: the acceptance oracle for the producer connector. It proves producer-agnosticism at the tool
//   boundary: a claim authored through the schema-gated MCP tool is graded by the same gate as a human's,
//   an over-declared claim is demoted by the gate, and a structurally invalid input is rejected by the
//   schema before the gate is reached. The agent side is simulated deterministically (well-formed tool
//   inputs, as a strict-tool-use agent would emit), so the proof runs offline with no live model.
// Contract: `node build/check-produce.mjs` exits non-zero on any failure. Build layer: imports the
//   periphery MCP server and tool, the api contract and local provider, and the vendored snapshot.
// Invariant: the gate is the real one; the server holds no grading logic, proven by the receipt through
//   the tool equalling the receipt through the human contract for the same claim; no invalid input ever
//   reaches propose, proven by a provider spy that counts calls.
"use strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClientApi } from "../api/client-api.mjs";
import { createLocalProvider } from "../api/providers/local-provider.mjs";
import { createProduceServer } from "../periphery/produce/mcp-server.mjs";
import { GRADES, PROPOSE_TOOL_NAME } from "../periphery/produce/propose-tool.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(readFileSync(join(ROOT, "vendor/gate/snapshot.json"), "utf8"));
const H = "=".repeat(80);
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };

// a provider spy over the real local provider: it counts propose calls so the check can prove a
// schema-rejected input never reaches the gate.
let proposeCalls = 0;
const base = createLocalProvider(snapshot);
const provider = Object.assign({}, base, { propose: (pc) => { proposeCalls++; return base.propose(pc); } });
const humanApi = createClientApi(provider); // the human authoring surface, over the same provider
const server = createProduceServer({ provider, kinds: snapshot.kinds });

const KIND = (snapshot.kinds.find((k) => k.kind === "measurement") || snapshot.kinds[0]).kind;
const call = (args, id = 1) => server.handle({ jsonrpc: "2.0", id, method: "tools/call", params: { name: PROPOSE_TOOL_NAME, arguments: args } });
const gradeRow = (r) => (r.grade_table || []).find((g) => g.identity === r.proposed_identity) || {};

console.log(H);
console.log("CHECK-PRODUCE: an agent authors through the schema-gated tool, graded by the same gate as any producer");
console.log(H);

// [1] the tool the server advertises is the propose contract, strict, verbatim.
console.log("\n[1] tools/list advertises the propose tool: strict, the proposedClaim shape verbatim");
const list = server.handle({ jsonrpc: "2.0", id: 0, method: "tools/list" });
const tool = list.result.tools[0];
ok(tool && tool.name === PROPOSE_TOOL_NAME, `the server lists the propose tool (${tool && tool.name})`);
ok(tool.strict === true, "the tool is marked strict: the schema is a grammar the agent must satisfy");
const sch = tool.inputSchema;
ok(sch.required.join(",") === "statement,kind", "statement and kind are required; the rest optional");
ok(sch.properties.kind.enum.includes(KIND) && sch.additionalProperties === false, "kind is constrained to the kernel's real kinds; no extra properties");
ok(JSON.stringify(sch.properties.declared_grade.enum) === JSON.stringify(GRADES), "declared_grade is constrained to the real grade values");

// [2] producer-agnostic: the agent's well-formed claim is graded identically to a human's.
console.log("\n[2] a well-formed tool call is graded identically to the human authoring surface");
const claim = { statement: "An agent-authored measurement of the intermediate host, stated without a checking record.", kind: KIND };
const before = proposeCalls;
const viaTool = call(claim, 11).result;
const viaHuman = humanApi.propose(claim);
ok(!viaTool.isError, "the well-formed claim passed the schema and reached the gate");
ok(JSON.stringify(viaTool.structuredContent) === JSON.stringify(viaHuman), "the tool receipt is identical to the human-surface receipt for the same claim (producer-agnostic)");
ok(viaTool.structuredContent.decision === "accepted" && gradeRow(viaTool.structuredContent).earned_grade === "asserted", `admitted at the grade it earns: ${gradeRow(viaTool.structuredContent).earned_grade}`);
ok(proposeCalls === before + 2, "both the tool and the human surface drove the real gate (2 propose calls)");

// [3] the gate demotes an over-declared claim: structure is well-formed, grounding is not earned.
console.log("\n[3] an over-declared tool call is demoted by the gate, with the reason");
const over = { statement: "An agent-authored claim declaring more than it can earn.", kind: KIND, declared_grade: "independently-rechecked" };
const overRes = call(over, 12).result;
ok(!overRes.isError, "the over-declared claim is well-formed: it passes the schema (structure is fine)");
const overReceipt = overRes.structuredContent;
ok(overReceipt.decision === "declined", `the gate declined to grant the over-declared grade (decision ${overReceipt.decision})`);
ok((overReceipt.decision_basis || []).length > 0, `the receipt names the failing basis: ${JSON.stringify(overReceipt.decision_basis)}`);
ok((overReceipt.findings || []).some((f) => f.finding_type === "well-formedness"), "a well-formedness finding names the rule the over-declaration broke");

// [4] the schema gates structure at the boundary: an invalid input never reaches the gate.
console.log("\n[4] a structurally invalid tool call is rejected by the schema before the gate");
const invalidCases = [
  ["missing the required statement", { kind: KIND }],
  ["a kind outside the kernel's kinds", { statement: "x", kind: "not-a-real-kind" }],
  ["a grade outside the real values", { statement: "x", kind: KIND, declared_grade: "gold-plated" }],
  ["an unexpected extra property", { statement: "x", kind: KIND, hallucinated_field: "y" }],
];
for (const [label, bad] of invalidCases) {
  const b = proposeCalls;
  const res = call(bad, 13).result;
  ok(res.isError === true && res.structuredContent && res.structuredContent.schema_error, `${label}: rejected at the schema (${res.structuredContent && res.structuredContent.schema_error})`);
  ok(proposeCalls === b, `${label}: the gate was never reached (no propose call)`);
}

// [5] the server is transport only: it holds no grading logic.
console.log("\n[5] the server is transport only, holding no grading logic");
ok(JSON.stringify(call(claim, 14).result.structuredContent) === JSON.stringify(humanApi.propose(claim)), "the server adds nothing to the receipt: it forwards the claim and returns the gate's verdict unchanged");
const unknown = server.handle({ jsonrpc: "2.0", id: 15, method: "tools/call", params: { name: "delete_everything", arguments: {} } });
ok(unknown.error && unknown.error.code === -32602, "an unknown tool is refused; only the propose tool is exposed");

console.log("\n" + H);
if (fails) { console.log(`check-produce: ${fails} FAILURE(S)`); process.exit(1); }
console.log("verified: an agent authoring through the schema-gated tool is graded by the same gate as any producer,");
console.log("structure enforced by the schema and grounding by the gate, so the producer is checked, not trusted. A");
console.log("live agent session over MCP transport, and autonomous multi-claim orchestration, are the named deferred depth.");
console.log("check-produce: OK");
console.log(H);
