// Role: the MCP tool definition for authoring a claim. Its inputSchema is the propose contract's
//   proposedClaim shape as a JSON Schema, marked strict so the schema is a grammar the agent's output
//   must satisfy: structural hallucination is eliminated by construction, the agent cannot emit a
//   malformed claim. This is a pure definition; it gates the agent's structure and holds no grading.
// Contract: proposeToolDefinition(kinds) -> an MCP tool { name, description, inputSchema, strict:true },
//   with kind constrained to the kernel's real kinds and declared_grade to the real grade values.
//   GRADES and PROPOSE_TOOL_NAME are exported for the server and the check. Periphery: imports nothing.
// Invariant: the inputSchema is the proposedClaim shape verbatim (statement and kind required; citation,
//   contributor_id, declared_grade, supports optional), so the tool exposes the exact human contract. The
//   schema enforces structure; grounding is the gate's, never the tool's.
"use strict";

// the five real grade values a claim may declare (kernel/schema/confidence.mjs POSITIONS).
export const GRADES = ["asserted", "supported", "corroborated", "checked", "independently-rechecked"];

export const PROPOSE_TOOL_NAME = "propose_claim";

// a support is either an existing claim identity (a string) or an object naming the target identity and
// optionally the grade the link declares. This is the proposedClaim.supports element shape verbatim.
const SUPPORT_ITEM = {
  oneOf: [
    { type: "string", description: "the identity of an existing claim this claim rests on" },
    {
      type: "object",
      additionalProperties: false,
      required: ["to_identity"],
      properties: {
        to_identity: { type: "string", description: "the identity of the supporting claim" },
        declared_grade: { type: "string", enum: GRADES, description: "the grade the support link declares" },
      },
    },
  ],
};

export function proposeToolDefinition(kinds) {
  const kindList = (kinds || []).map((k) => (typeof k === "string" ? k : k.kind)).filter(Boolean);
  if (!kindList.length) throw new Error("proposeToolDefinition: needs the kernel's real kinds to constrain 'kind'");
  return {
    name: PROPOSE_TOOL_NAME,
    description:
      "Author a typed claim into the kernel through the gate. The claim is graded by structure, not by " +
      "who authored it: the same gate that grades a human's claim grades this one. Declaring a grade above " +
      "what the claim earns is refused by the gate, not the tool.",
    // strict: the schema compiles to a grammar the agent's tool call must satisfy. A malformed claim
    // cannot be emitted; that is the fix for agents-hallucinate-structure, a property of the schema.
    strict: true,
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["statement", "kind"],
      properties: {
        statement: { type: "string", description: "a single, checkable claim in one sentence" },
        kind: { type: "string", enum: kindList, description: "the claim's kind, one the kernel declares" },
        citation: { type: "string", description: "an optional source the claim cites, entered as its own basis" },
        contributor_id: { type: "string", description: "who authored the claim (an agent id, for provenance)" },
        declared_grade: { type: "string", enum: GRADES, description: "the grade the author claims; the gate may earn less" },
        supports: { type: "array", items: SUPPORT_ITEM, description: "existing claims this claim rests on" },
      },
    },
  };
}
