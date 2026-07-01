// Role: machine-readable export of a forked node and its typed citation edge.
// Contract: promotionFor(terminal)->string; exportYaml(node)->YAML string.
// Invariant: pure and DOM-free. The honest-status discipline (declared, never
//   verified) lives in the emitted YAML, not in any caller's DOM.
function promotionFor(t){
  const m={
    "measurement":"promotes on engineering or domain-standard by independent confirmation",
    "irreducible-prior":"does not promote; priced, not resolved",
    "withheld-record":"does not promote while sealed; converts to measurement when the record opens",
    "question-set":"promotes when a missing branch is named or the set is shown complete",
    "derivation":"promotes when a proof compiles (formal track)",
    "simulation-bound":"promotes against a bounded simulation"
  };
  return m[t] || "terminal pending";
}
function exportYaml(n){
  const q = s => '"'+String(s||"").replace(/"/g,'\\"')+'"';
  const tracks = "{formal: unformalized, engineering: unvalidated, domain-standard: unreviewed}";
  let s = "";
  s += `- claim:\n`;
  s += `    id: ${n.id}\n`;
  s += `    statement: ${q(n.statement)}\n`;
  s += `    terminal: ${n.terminal}\n`;
  s += `    verification: ${tracks}\n`;
  s += `    promotion: {state: declared, condition: ${q(promotionFor(n.terminal))}}\n`;
  s += `    declared-or-computed: declared\n`;
  if(n.hasSource){
    s += `  edge:\n`;
    s += `    from: ${n.id}\n`;
    s += `    to: ${n.parent}\n`;
    s += `    relation: ${n.rel}\n`;
    s += `    cited-result: ${q(n.loc)}\n`;
    s += `    rests-on: ${n.rterm}\n`;
    s += `    source: {cite: ${q(n.cite)}, identifier: ${q(n.ident||"to-confirm")}, identifier-status: to-confirm}\n`;
    s += `    edge-typing: {state: author-declared, by: judge (this session)}\n`;
  }
  return s;
}
if (typeof module !== "undefined" && module.exports) module.exports = { promotionFor, exportYaml };
