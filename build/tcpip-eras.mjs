// Role: the three internet-era kernels for the TCP/IP counterexample exhibit. Each era is a foreign
//   kernel (the conformance checker's shape) that faithfully encodes the era's actual TRUST DECISIONS,
//   never content. A claim here is an acceptance ("this MAIL FROM is who it declares", "this AS
//   legitimately originates this prefix", "this response resolves this name"), a structural trust
//   assertion with no semantic payload: packets carry no semantics, so the kernels model what the
//   network decided to accept from whom, which is the layer the internet-to-kernel mapping holds at.
// Contract: exports act1Kernel(), act2Kernel(), act3Kernel() built with foreignKernel(...), plus TABLES.
//   Each kernel carries a `mapping` (per-claim key, identity, and the net.* refs it encodes) so the
//   exhibit oracle can map a computed violation to a documented failure in tcpip-contracts.js. Imports
//   the conformance checker and the kernel schema only; pure over its encoded data.
// Invariant: faithfulness is the method. Each claim encodes what the protocols actually did, sourced
//   from the grounded net.* claims, never what would make the demonstration cleaner. Advertised grades
//   are the standing the era's protocols conferred; recomputation is what the public structure carries.
"use strict";
import { foreignKernel } from "./check-conformance.mjs";
import { claimRecord } from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";

// FULL acceptance: the network conferred strong standing on the acceptance. It is an open-tier grade,
// so it never self-warrants; a claim reaches it only if public structure recomputes to it.
const FULL = "corroborated";

// provenance classes, mapped onto the schema's source-class enum: an accountable institutional endpoint,
// an anonymous commercial endpoint, an adversary, a concentrated authority, and a publicly recomputable log.
const sources = makeSourceTable([
  { source_id: "src:endpoint", source_class: "institutional-report", rests_on: [] },
  { source_id: "src:anon", source_class: "testimony", rests_on: [] },
  { source_id: "src:adversary", source_class: "testimony", rests_on: [] },
  { source_id: "src:authority", source_class: "institutional-report", rests_on: [] },
  { source_id: "src:public-log", source_class: "institutional-report", rests_on: [] },
]);
// types are protocols: both ends of a protocol implement the same RFC, so an era genuinely pins a shared
// type-bundle. The ceiling is the open-tier top; an acceptance is not a settled fact about the world.
const kinds = makeKindTable([
  { kind: "mail-acceptance", ceiling: "corroborated" },
  { kind: "route-acceptance", ceiling: "corroborated" },
  { kind: "name-resolution", ceiling: "corroborated" },
]);
export const TABLES = { sourceTable: sources, kindTable: kinds };

// a concentrated authority attesting its own grant: a checking record with no distinct-party independence,
// so it adds a checker to the record without making the grade a function of independent recomputation.
const authorityAttest = (id) => [{ checker_id: id, method_class: "data-audit", method: "self-signed", checked_at_state: "s0", outcome: "confirms", independence: "self" }];
// independent public recomputation: two distinct-party audits of a public append-only log (a CT auditor,
// an RPKI validator), so the standing genuinely recomputes from public structure.
const publicAudit = (id) => [
  { checker_id: id + "-a", method_class: "replication", method: "inclusion-proof", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" },
  { checker_id: id + "-b", method_class: "replication", method: "inclusion-proof", checked_at_state: "s0", outcome: "confirms", independence: "distinct-party" },
];

// build an era kernel from acceptance specs. Each spec: { key, kind, statement, source, net_refs,
// native?, origin?, carried_grade?, checks? }. The advertised grade is FULL (the standing the protocol
// conferred); recomputation over the encoded structure is what the checker compares it against.
function buildEra(store_id, specs) {
  const entries = [], native = [], grades = {}, mapping = [];
  for (const s of specs) {
    const rec = { ...claimRecord({ kind: s.kind, statement: s.statement, source_id: s.source, contributor_id: s.contributor || "era", declared_grade: FULL, checking_records: s.checks }) };
    if (s.origin) rec.origin = s.origin;
    if (s.carried_grade) rec.carried_grade = s.carried_grade;
    entries.push(rec);
    if (s.native !== false) native.push(rec.identity);
    grades[rec.identity] = FULL;
    mapping.push({ key: s.key, identity: rec.identity, net_refs: s.net_refs });
  }
  const K = foreignKernel({ store_id, entries, links: [], native, grades, tables: TABLES });
  K.mapping = mapping;
  return K;
}

// Act 1, the cooperative regime: every acceptance native and advertised at full standing with zero
// support structure and zero checking records, because that is what the protocols did. Standing was a
// grant of the social layer, outside the graph. The violation is real (advertised exceeds recomputation)
// and was costless, because the regime supplied verification out of band (the DCA reprimand, net.thuerk-1978).
export function act1Kernel() {
  return buildEra("era-act1", [
    { key: "act1.mail", kind: "mail-acceptance", source: "src:endpoint", net_refs: ["net.smtp-noauth", "net.thuerk-1978"],
      statement: "Act 1 accepts this MAIL FROM as who it declares, on trust, per RFC 821" },
    { key: "act1.route", kind: "route-acceptance", source: "src:endpoint", net_refs: ["net.egp-trust", "net.bgp1-auth-zero"],
      statement: "Act 1 accepts this autonomous system as legitimately originating this prefix, on trust, per EGP and BGP-1" },
    { key: "act1.name", kind: "name-resolution", source: "src:endpoint", net_refs: ["net.dns-txid"],
      statement: "Act 1 accepts this response as resolving this name, matched only by a 16-bit query id, per RFC 1034" },
  ]);
}

// Act 2, the regime shift: the same construction, now with adversarial inputs admitted at identical
// advertised standing. The spam and the route leak are native acceptances the kernel cannot distinguish
// from legitimate ones; the cache-poisoning spoof crosses in from a non-authoritative source carrying a
// grade, admitted without local typing, which is standing laundered through the border.
export function act2Kernel() {
  return buildEra("era-act2", [
    { key: "act2.mail-spam", kind: "mail-acceptance", source: "src:anon", net_refs: ["net.canter-siegel-1994"],
      statement: "Act 2 accepts this bulk commercial mail as legitimate at identical standing, per the Canter and Siegel posting" },
    { key: "act2.route-leak", kind: "route-acceptance", source: "src:anon", net_refs: ["net.as7007-1997"],
      statement: "Act 2 accepts AS7007's more-specific origination as the preferred path at full standing" },
    { key: "act2.dns-spoof", kind: "name-resolution", source: "src:adversary", net_refs: ["net.dns-poisoning-known"], native: false, origin: "off-path-adversary", carried_grade: FULL,
      statement: "Act 2 accepts a spoofed response resolving this name, crossed in from a non-authoritative source and admitted without local typing, per DNS cache poisoning" },
  ]);
}

// Act 3, reinforcement: the patched architecture. Acceptances now carry checking records, but every
// checker for the authority-granted decisions is a concentrated authority attesting its own grant (an
// inbox classifier, a CA signature, a CDN admission), so the grade remains a grant rather than a function
// of public structure. The two rebase-shaped patches, a Certificate Transparency log entry and a signed
// Route Origin Authorization, carry genuine independent public recomputation and conform.
export function act3Kernel() {
  return buildEra("era-act3", [
    { key: "act3.mail", kind: "mail-acceptance", source: "src:authority", net_refs: ["net.recentralization"], checks: authorityAttest("inbox-classifier"),
      statement: "Act 3 accepts this mail because a concentrated inbox provider's classifier admitted it, a grade granted by the enforcer" },
    { key: "act3.ca", kind: "name-resolution", source: "src:authority", net_refs: ["net.diginotar-2011"], checks: authorityAttest("ca-signature"),
      statement: "Act 3 accepts this certificate because a certificate authority signed it, the browser root store's grant" },
    { key: "act3.ct", kind: "name-resolution", source: "src:public-log", net_refs: ["net.ct-logs"], checks: publicAudit("ct-log"),
      statement: "Act 3's Certificate Transparency log entry, its inclusion independently and publicly recomputable by any auditor" },
    { key: "act3.cdn", kind: "route-acceptance", source: "src:authority", net_refs: ["net.fastly-2021"], checks: authorityAttest("cdn-admission"),
      statement: "Act 3 accepts reachability because a concentrated content-delivery network admitted the route, a grant of the enforcer" },
    { key: "act3.rpki-legacy", kind: "route-acceptance", source: "src:authority", net_refs: ["net.arin-legacy-friction"], checks: authorityAttest("legacy-trust"),
      statement: "Act 3 still accepts an unsigned legacy route origination on trust, RPKI adoption incomplete" },
    { key: "act3.rpki-roa", kind: "route-acceptance", source: "src:public-log", net_refs: ["net.rpki-growth"], checks: publicAudit("rpki-roa"),
      statement: "Act 3's signed Route Origin Authorization, its origin independently recomputable against the public RPKI" },
  ]);
}
