// Role: a minimal MCP server exposing the propose tool over the standard interface. tools/list returns
//   the schema-gated propose tool; tools/call validates the agent's arguments against the tool's strict
//   inputSchema at the boundary (structure enforced by the schema) and, only if they pass, drives them
//   through the real propose contract (grounding enforced by the gate). It is the transport between an
//   agent's tool call and the gate; it holds no grading logic.
// Contract: createProduceServer({ provider, kinds }) -> { handle(request) -> response, tool }. handle
//   speaks the MCP/JSON-RPC request shape { id, method, params }; methods tools/list and tools/call.
//   Periphery: imports the api contract and the sibling tool definition; never the kernel.
// Invariant: an argument object that violates the schema is rejected before propose is called (the gate
//   is never reached); a well-formed one is forwarded verbatim and the receipt returned unchanged, so
//   every grade in the response is the gate's, produced nowhere in this file.
"use strict";
import { createClientApi } from "../../api/client-api.mjs";
import { proposeToolDefinition, PROPOSE_TOOL_NAME } from "./propose-tool.mjs";

// a small JSON-Schema check sufficient for the propose inputSchema: object/string/array, required,
// enum, additionalProperties:false, and oneOf for the support item. It stands in for the grammar strict
// tool use compiles the schema into; a real strict-mode agent could not emit a violating call at all.
export function validateStructure(value, schema, path = "") {
  if (schema.enum) {
    if (!schema.enum.includes(value)) return { ok: false, reason: `${path || "value"} must be one of [${schema.enum.join(", ")}]` };
  }
  if (schema.oneOf) {
    const matched = schema.oneOf.filter((s) => validateStructure(value, s, path).ok);
    if (matched.length !== 1) return { ok: false, reason: `${path || "value"} matches no allowed shape` };
    return { ok: true };
  }
  if (schema.type === "string") {
    if (typeof value !== "string") return { ok: false, reason: `${path || "value"} must be a string` };
    return { ok: true };
  }
  if (schema.type === "array") {
    if (!Array.isArray(value)) return { ok: false, reason: `${path || "value"} must be an array` };
    for (let i = 0; i < value.length; i++) {
      const r = validateStructure(value[i], schema.items, `${path}[${i}]`);
      if (!r.ok) return r;
    }
    return { ok: true };
  }
  if (schema.type === "object") {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return { ok: false, reason: `${path || "value"} must be an object` };
    for (const req of schema.required || []) if (!(req in value)) return { ok: false, reason: `missing required property '${req}'` };
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) if (!(schema.properties && key in schema.properties)) return { ok: false, reason: `unexpected property '${key}'` };
    }
    for (const key of Object.keys(value)) {
      if (schema.properties && schema.properties[key]) {
        const r = validateStructure(value[key], schema.properties[key], path ? `${path}.${key}` : key);
        if (!r.ok) return r;
      }
    }
    return { ok: true };
  }
  return { ok: true };
}

function rpc(id, result) { return { jsonrpc: "2.0", id, result }; }
function rpcError(id, code, message) { return { jsonrpc: "2.0", id, error: { code, message } }; }

// a compact human-readable line for the tool result text; the full receipt is the structuredContent.
function summarize(receipt) {
  const row = (receipt.grade_table || []).find((g) => g.identity === receipt.proposed_identity) || {};
  if (receipt.decision === "declined") return `declined: ${(receipt.decision_basis || []).join(", ") || "see findings"}`;
  return `accepted: earned ${row.earned_grade || "ungraded"}` + (row.declared_grade ? `, declared ${row.declared_grade}` : "");
}

export function createProduceServer(opts) {
  const o = opts || {};
  if (!o.provider) throw new Error("createProduceServer: needs a provider to drive propose through the gate");
  const api = createClientApi(o.provider);
  const tool = proposeToolDefinition(o.kinds);

  function handle(request) {
    const id = request && request.id != null ? request.id : null;
    const method = request && request.method;
    if (method === "tools/list") return rpc(id, { tools: [tool] });
    if (method === "tools/call") {
      const params = request.params || {};
      if (params.name !== PROPOSE_TOOL_NAME) return rpcError(id, -32602, `unknown tool '${params.name}'`);
      const args = params.arguments || {};
      // structure gate: reject a schema violation at the boundary, before the gate is ever reached.
      const v = validateStructure(args, tool.inputSchema);
      if (!v.ok) return rpc(id, { isError: true, content: [{ type: "text", text: "schema rejection: " + v.reason }], structuredContent: { schema_error: v.reason } });
      // grounding gate: the real contract grades the well-formed claim; the receipt is returned unchanged.
      const receipt = api.propose(args);
      return rpc(id, { content: [{ type: "text", text: summarize(receipt) }], structuredContent: receipt });
    }
    return rpcError(id, -32601, `method not found: ${method}`);
  }

  return { handle, tool };
}
