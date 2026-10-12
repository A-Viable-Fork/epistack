// Role: the exclusion store: refuted claims kept with reason and grounds so a kill cannot be silently revived.
// Contract: killsOf(state, identity) -> the kill records on that claim, scoped and global; isKilled(state,
//   identity) -> true when a global kill holds. The record itself is killRecord (kernel/schema/standing.mjs).
// Invariant: pure logic, DOM-free; kernel imports only kernel. A kill is read, never deleted: the claim stays
//   in the store beside the record that killed it.
export function killsOf(state, identity) {
  return ((state && state.kill_records) || []).filter((k) => k.killed_identity === identity);
}
export function isKilled(state, identity) {
  return killsOf(state, identity).some((k) => k.scope === "global");
}
