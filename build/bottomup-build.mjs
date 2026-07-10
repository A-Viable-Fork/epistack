// Role: the bottom-up meta kernel. Assembles the four existing case stores (lhc, covid, eggs, lineage)
//   as sovereign, independently-authored members of a federation joined at the untyped type, then builds
//   a composite over them that crosses claims between kernels through the existing composition layer.
//   Modeled on build/eggs-build.mjs, but pointed at four sovereign kernels instead of one composite's
//   internal domains: the members keep four schemas, never merged, joined only by shared type-hashes.
// Contract: buildBottomUp() -> { members, composite, crossings, receipts, transparency }. Imports the
//   kernel, the composition layer, the adoption layer, the four case builders, and corpora/federation.
// Invariant: each member owns its own kind table and pins its own hashes; a crossing composes native
//   only when both members pin the same type-hash for the crossed kind, and arrives untyped otherwise,
//   grounding nothing until the target forks it. The build reuses citeDomainClaim/compositeGrade; the
//   check is the enforcer.
"use strict";
import { createRequire } from "node:module";
import { crossDomainClaimRecord } from "../kernel/composition/records.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { citeDomainClaim, compositeGrade } from "../kernel/composition/transfer.mjs";
import { ceilingForCitations } from "../kernel/composition/vocabulary.mjs";
import { adoptionOf, crossingStatus } from "./adoption.mjs";
import { buildLhc } from "./lhc-build.mjs";
import { buildCovid } from "./covid-build.mjs";
import { buildEggs } from "./eggs-build.mjs";
import { buildLineage } from "./lineage-build.mjs";

const require = createRequire(import.meta.url);
const { FEDERATION } = require("../corpora/federation/federation.js");

const MADE = "2026-07-10T00:00:00Z";

export function buildBottomUp() {
  // ---- the four sovereign members, each built through its own path, each owning its own tables ----
  const lhc = buildLhc();
  const covid = buildCovid();
  const lineage = buildLineage();
  const eggs = buildEggs();

  // eggs is itself a composite of three domains that share the eggs schema; as one federation member it
  // is one citable kernel over the union of those domain stores, still owning the single eggs kind table.
  const eggEntries = [], eggLinks = [], eggRef = new Map();
  for (const d of Object.values(eggs.domains)) {
    for (const e of d.state.entries) eggEntries.push(e);
    for (const l of d.state.links || []) eggLinks.push(l);
    for (const [k, v] of d.refId) eggRef.set(k, v);
  }
  const eggState = apply(genesis(), { entries: eggEntries, links: eggLinks, applied_contribution_hash: "eggs", receipt_reference: "eggs" });

  const member = (store_id, state, tables, refId, receipt) => ({ store_id, state, tables, refId, receipt, adoption: adoptionOf(store_id) });
  const members = {
    lhc: member("lhc", lhc.state, lhc.tables, lhc.refId, lhc.receipt),
    covid: member("covid", covid.state, covid.tables, covid.refId, covid.receipt),
    eggs: member("eggs", eggState, eggs.tables, eggRef, null),
    lineage: member("lineage", lineage.state, lineage.tables, lineage.refId, lineage.receipt),
  };

  // ---- the cross-kernel crossings: gated on type-hash adoption, not on the store boundary ----
  const crossings = FEDERATION.crossings.map((cx) => {
    const from = members[cx.from_store], into = members[cx.into_store];
    const cited = from.refId.get(cx.from_claim);
    const status = crossingStatus(cx.kind, from.adoption, into.adoption);
    // the composition path copies the real domain grade; the gate is what withholds it when untyped.
    const citation = citeDomainClaim(from, { citing_claim: `fed:${cx.id}`, cited_claim: cited, role: "necessary", made_at: MADE });
    const effective = status === "native" ? citation.carried_grade : "ungraded";
    // the fork: the target adopts the crossed type locally (pins the hash), so the same crossing grounds.
    let forked = null;
    if (cx.fork_into) {
      const forkedAdoption = { ...into.adoption, pins: { ...into.adoption.pins, [`${cx.kind}@${into.store_id}-local`]: from.adoption.pins[cx.kind] } };
      const forkedStatus = crossingStatus(cx.kind, from.adoption, forkedAdoption);
      forked = { status: forkedStatus, effective: forkedStatus === "native" ? citation.carried_grade : "ungraded" };
    }
    return { ...cx, cited, status, citation, effective, forked };
  });

  // ---- the composite: each weighing selects its members and grounds by citing across the boundary ----
  const weighs = FEDERATION.weighings.map((w) => {
    const claim_id = hashOf({ statement: w.statement });
    const cits = w.cites.map((c) => {
      const m = members[c.store];
      return citeDomainClaim(m, { citing_claim: claim_id, cited_claim: m.refId.get(c.claim), role: c.role, made_at: MADE });
    });
    // each cited claim is a common-kind (forum) claim, so every citation crosses native between the
    // member and the composite, both pinning the forum hash; the status is recorded for the check.
    const crossStatuses = w.cites.map((c) => crossingStatus("forum", members[c.store].adoption, adoptionOf("lineage")));
    const rec = crossDomainClaimRecord({ statement: w.statement, support: cits.map((x) => x.citation_id), weighting: w.weighting });
    const ceiling = ceilingForCitations(cits);
    const grade = compositeGrade({ ceiling, citations: cits });
    return { spec: w, claim_id, cits, rec, ceiling, grade, members: w.cites.map((c) => c.store), crossStatuses };
  });

  const composite = {
    store_id: FEDERATION.store_id,
    claims: weighs.map((w) => w.rec),
    citations: weighs.flatMap((w) => w.cits),
    weighs,
    selects: [...new Set(weighs.flatMap((w) => w.members))],
  };

  const receipts = { lhc: lhc.receipt, covid: covid.receipt, lineage: lineage.receipt, eggs: eggs.domains["S-nutrition"].receipt };

  // ---- Step 4: transparency status, default on. A published, checkable fact, not a gate. The check
  // verifies transparency of FORM (documents typed, dependencies declared, built-versus-specified
  // separated), not of CONTENT (that the types are honest), which stays authored. ----
  const transparency = {
    default: "on",
    boundary: "verifies transparency of form (documents typed, dependencies declared, built-versus-specified separated), not of content (that the types are honest), which stays an authored property no check confers",
    federation: { store_id: FEDERATION.store_id, discipline_active: true },
    members: Object.fromEntries(["lhc", "covid", "eggs", "lineage"].map((m) => [m, { discipline_active: true, document_typing: true, dependency_graph: true, built_vs_specified: true }])),
  };

  return { members, composite, crossings, receipts, transparency };
}
