// Role: the propose interface: accept a claim, edge, join, or refutation and hand it to the gate, which decides; never writes directly.
// Contract: STUB: the write half of api/api.js's own trellis surface, to split out later. The v3
//   propose/read CONTRACT is realized in api/client-api.mjs over a provider; the local provider that
//   runs the gate is api/providers/local-provider.mjs (Prompt 10).
// Invariant: api imports kernel and api; never the periphery.
