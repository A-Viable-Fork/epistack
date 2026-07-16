// Role: the comment kind's oracle (the comment kind and identity presentation prompt). Confirms the
//   grounding-inertness the floor ceiling promises (a comment thread, added or withdrawn, moves no
//   existing grade or certificate), that the comment-support guard actually stops a comment-bomb
//   (naming the rule, not decorative), that comments-on/replies-to resolve exactly the way every other
//   link resolves (so a reply to a nonexistent comment fails the ordinary reference-resolution rule),
//   and that no construction lifts a comment's earned grade off the lattice floor.
// Contract: `node build/check-comment.mjs`. Exits 0 if every assertion holds, 1 with a report. Imports
//   only kernel v3 modules and Node's standard library.
// Invariant: read-only. A comment's ceiling is the lattice floor by kind-table construction
//   (corpora/_shared/common-types.js's COMMON_BUNDLES.comment), so capByCeiling forces every earned
//   comment grade to ungraded no matter what supports it; the never-citable rule is enforced by
//   kernel/gate/comment-guard.mjs, called before the gate on the local provider's write path
//   (api/providers/local-provider.mjs).
"use strict";
import { createRequire } from "node:module";
import * as R from "../kernel/schema/records.mjs";
import { makeSourceTable, makeKindTable } from "../kernel/schema/tables.mjs";
import { decide } from "../kernel/gate/gate.mjs";
import { verifyDecision } from "../kernel/gate/verify.mjs";
import { genesis } from "../kernel/store/state.mjs";
import { apply } from "../kernel/store/apply.mjs";
import { derivedGrade, storeViewOf } from "../kernel/store/decay.mjs";
import { hashOf } from "../kernel/schema/canonical.mjs";
import { rejectCommentSupport, RULE } from "../kernel/gate/comment-guard.mjs";

const require = createRequire(import.meta.url);
const { COMMON_BUNDLES } = require("../corpora/_shared/common-types.js");

const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); };
const eq = (a, b, msg) => ok(a === b, `${msg} (got ${JSON.stringify(a)} vs ${JSON.stringify(b)})`);
const H = "=".repeat(80);
console.log(H); console.log("CHECK-COMMENT: the comment kind, grounding-inert and never citable as support"); console.log(H);

// --- fixtures ---
const KINDS = makeKindTable([
  { kind: "measurement", ceiling: "independently-rechecked", compatibility_rule_id: "CMP-M" },
  { kind: "comment", ceiling: COMMON_BUNDLES.comment.ceiling, compatibility_rule_id: COMMON_BUNDLES.comment.compatibility_rule_id },
]);
const SRC = makeSourceTable([
  { source_id: "S1", source_class: "primary-measurement", rests_on: [] },
]);
const TABLES = { sourceTable: SRC, kindTable: KINDS };
const distinctCheck1 = { checker_id: "C2", method_class: "replication", method: "re-ran", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
const distinctCheck2 = { checker_id: "C3", method_class: "derivation-audit", method: "audited", checked_at_state: "ST0", outcome: "confirms", independence: "distinct-party" };
const claim = (kind, statement, declared_grade, checking_records) => R.claimRecord({ kind, statement, source_id: "S1", contributor_id: "P1", declared_grade, checking_records });

// ================= [1] grounding inertness =================
console.log("\n[1] grounding inertness: a comment thread moves no existing grade or certificate");
{
  let st = genesis();

  const P = claim("measurement", "premise P", "checked", [distinctCheck1]);
  const admitP = decide({ hash: "H-P", entries: [P], links: [] }, storeViewOf(st, TABLES));
  ok(admitP.decision === "accepted", "[1] premise P is admitted");
  st = apply(st, { entries: [P], links: [], applied_contribution_hash: "H-P", receipt_reference: hashOf(admitP) });

  const stBeforeC = st; // frozen: exactly the state C's own decision was run against
  const C = claim("measurement", "claim C", "corroborated", []);
  const supPC = R.linkRecord({ link_kind: "supports", from_identity: P.identity, to_identity: C.identity, support_group: "g1", source_id: "S1", contributor_id: "P1", declared_grade: "checked" });
  const contribC = { hash: "H-C", entries: [C], links: [supPC] };
  const viewBeforeC = storeViewOf(stBeforeC, TABLES);
  const receiptC = decide(contribC, viewBeforeC);
  ok(receiptC.decision === "accepted", "[1] claim C, supported by P, is admitted");
  st = apply(st, { entries: [C], links: [supPC], applied_contribution_hash: "H-C", receipt_reference: hashOf(receiptC) });

  const gradesBefore = { P: derivedGrade(st, P.identity, TABLES), C: derivedGrade(st, C.identity, TABLES) };

  // add a comment thread: a comment on C, and a reply to that comment
  const comment1 = claim("comment", "a question about C", "ungraded");
  const attach = R.linkRecord({ link_kind: "comments-on", from_identity: comment1.identity, to_identity: C.identity, source_id: "S1", contributor_id: "P2", declared_grade: "ungraded" });
  const comment2 = claim("comment", "a reply to the question", "ungraded");
  const reply = R.linkRecord({ link_kind: "replies-to", from_identity: comment2.identity, to_identity: comment1.identity, source_id: "S1", contributor_id: "P3", declared_grade: "ungraded" });
  const contribThread = { hash: "H-THREAD", entries: [comment1, comment2], links: [attach, reply] };
  const admitThread = decide(contribThread, storeViewOf(st, TABLES));
  ok(admitThread.decision === "accepted", "[1] the comment thread (comments-on + replies-to) is admitted");
  st = apply(st, { entries: contribThread.entries, links: contribThread.links, applied_contribution_hash: "H-THREAD", receipt_reference: hashOf(admitThread) });

  const gradesAfterAdd = { P: derivedGrade(st, P.identity, TABLES), C: derivedGrade(st, C.identity, TABLES) };
  eq(gradesAfterAdd.P, gradesBefore.P, "[1] P's derived grade is byte-identical after the thread is added");
  eq(gradesAfterAdd.C, gradesBefore.C, "[1] C's derived grade is byte-identical after the thread is added");
  const replayAfterAdd = verifyDecision(receiptC, contribC, viewBeforeC);
  eq(replayAfterAdd.result, "match", "[1] C's original receipt still re-derives byte-exactly from its own frozen inputs with the thread present elsewhere");

  // "delete" the thread: this ledger only removes standing, never entries, so withdraw both comments
  const wd1 = R.withdrawnClaimRecord({ claim_identity: comment1.identity, withdrawn_at_state: st.state_hash, withdrawn_by: "H-DEL", reason: "thread removed", reinstatement_condition: { condition_kind: "entry-of-kind", required_kind: "comment" } });
  const wd2 = R.withdrawnClaimRecord({ claim_identity: comment2.identity, withdrawn_at_state: st.state_hash, withdrawn_by: "H-DEL", reason: "thread removed", reinstatement_condition: { condition_kind: "entry-of-kind", required_kind: "comment" } });
  st = apply(st, { entries: [], links: [], withdrawn_records: [wd1, wd2], applied_contribution_hash: "H-DEL", receipt_reference: "R-DEL" });

  const gradesAfterDelete = { P: derivedGrade(st, P.identity, TABLES), C: derivedGrade(st, C.identity, TABLES) };
  eq(gradesAfterDelete.P, gradesBefore.P, "[1] P's derived grade is byte-identical after the thread is withdrawn");
  eq(gradesAfterDelete.C, gradesBefore.C, "[1] C's derived grade is byte-identical after the thread is withdrawn");
  const replayAfterDelete = verifyDecision(receiptC, contribC, viewBeforeC);
  eq(replayAfterDelete.result, "match", "[1] C's original receipt still re-derives byte-exactly after the thread is withdrawn");
}

// ================= [2] the comment-bomb =================
console.log("\n[2] the comment-bomb: a comment admitted into an existing support group is rejected, naming the rule");
{
  let st = genesis();
  const P = claim("measurement", "premise P2", "checked", [distinctCheck1]);
  const admitP = decide({ hash: "H2-P", entries: [P], links: [] }, storeViewOf(st, TABLES));
  st = apply(st, { entries: [P], links: [], applied_contribution_hash: "H2-P", receipt_reference: hashOf(admitP) });

  const C = claim("measurement", "claim C2", "corroborated", []);
  const supPC = R.linkRecord({ link_kind: "supports", from_identity: P.identity, to_identity: C.identity, support_group: "g1", source_id: "S1", contributor_id: "P1", declared_grade: "checked" });
  const receiptC = decide({ hash: "H2-C", entries: [C], links: [supPC] }, storeViewOf(st, TABLES));
  ok(receiptC.decision === "accepted", "[2] claim C2, supported by P2 in group g1, is admitted");
  st = apply(st, { entries: [C], links: [supPC], applied_contribution_hash: "H2-C", receipt_reference: hashOf(receiptC) });

  const gradeBeforeBomb = derivedGrade(st, C.identity, TABLES);
  ok(gradeBeforeBomb !== "ungraded", `[2] C2's grade before the bomb is above the floor (got ${gradeBeforeBomb})`);

  const comment1 = claim("comment", "a comment attempting to stand in the support role", "ungraded");
  const bombLink = R.linkRecord({ link_kind: "supports", from_identity: comment1.identity, to_identity: C.identity, support_group: "g1", source_id: "S1", contributor_id: "P4", declared_grade: "corroborated" });
  const bombContribution = { hash: "H2-BOMB", entries: [comment1], links: [bombLink] };
  const view = storeViewOf(st, TABLES);

  let threw = false, thrownMessage = "";
  try { rejectCommentSupport(bombContribution, view); } catch (e) { threw = true; thrownMessage = e.message; }
  ok(threw, "[2] the comment-bomb attempt is rejected");
  ok(threw && thrownMessage.includes(RULE), `[2] the rejection names the rule (${RULE})`);
  ok(threw && thrownMessage.includes(bombLink.identity), "[2] the rejection names the offending link");

  if (!threw) {
    // the guard did not hold (e.g. deliberately disabled): show what the gate alone would do, so the
    // failure is not just "expected a throw" but a visible, named grade movement.
    const r = decide(bombContribution, view, {});
    const stBombed = apply(st, { entries: bombContribution.entries, links: bombContribution.links, applied_contribution_hash: "H2-BOMB", receipt_reference: hashOf(r) });
    const gradeAfterBomb = derivedGrade(stBombed, C.identity, TABLES);
    console.error(`    [2] WITHOUT the guard, the comment-bomb moved C2's grade from ${gradeBeforeBomb} to ${gradeAfterBomb}`);
    ok(false, `[2] the comment-bomb moved C2's grade from ${gradeBeforeBomb} to ${gradeAfterBomb} (the guard is not load-bearing)`);
  }

  eq(derivedGrade(st, C.identity, TABLES), gradeBeforeBomb, "[2] C2's grade in the store is unmoved (the bomb was never applied)");
}

// ================= [3] thread shape =================
console.log("\n[3] thread shape: replies-to chains resolve; a reply to a nonexistent comment fails schema");
{
  let st = genesis();
  const comment0 = claim("comment", "root comment", "ungraded");
  const admit0 = decide({ hash: "H3-C0", entries: [comment0], links: [] }, storeViewOf(st, TABLES));
  ok(admit0.decision === "accepted", "[3] the root comment is admitted");
  st = apply(st, { entries: [comment0], links: [], applied_contribution_hash: "H3-C0", receipt_reference: hashOf(admit0) });

  const comment1 = claim("comment", "a reply", "ungraded");
  const reply1 = R.linkRecord({ link_kind: "replies-to", from_identity: comment1.identity, to_identity: comment0.identity, source_id: "S1", contributor_id: "P2", declared_grade: "ungraded" });
  const admit1 = decide({ hash: "H3-C1", entries: [comment1], links: [reply1] }, storeViewOf(st, TABLES));
  ok(admit1.decision === "accepted", "[3] a reply to the root comment resolves and is admitted");
  st = apply(st, { entries: [comment1], links: [reply1], applied_contribution_hash: "H3-C1", receipt_reference: hashOf(admit1) });

  const comment2 = claim("comment", "a reply to the reply", "ungraded");
  const reply2 = R.linkRecord({ link_kind: "replies-to", from_identity: comment2.identity, to_identity: comment1.identity, source_id: "S1", contributor_id: "P3", declared_grade: "ungraded" });
  const admit2 = decide({ hash: "H3-C2", entries: [comment2], links: [reply2] }, storeViewOf(st, TABLES));
  ok(admit2.decision === "accepted", "[3] a two-deep replies-to chain resolves and is admitted");
  st = apply(st, { entries: [comment2], links: [reply2], applied_contribution_hash: "H3-C2", receipt_reference: hashOf(admit2) });

  // a reply to a comment identity that was never entered anywhere: fails schema, the same
  // reference-resolution rule every link kind is bound by (gate.mjs's WF-UNRESOLVED).
  const comment3 = claim("comment", "a reply into the void", "ungraded");
  const ghostReply = R.linkRecord({ link_kind: "replies-to", from_identity: comment3.identity, to_identity: "ID-NEVER-ENTERED", source_id: "S1", contributor_id: "P4", declared_grade: "ungraded" });
  const declined = decide({ hash: "H3-C3", entries: [comment3], links: [ghostReply] }, storeViewOf(st, TABLES));
  ok(declined.decision === "declined", "[3] a reply to a nonexistent comment is declined");
  ok(declined.decision_basis.includes("WF-UNRESOLVED"), "[3] the decline names WF-UNRESOLVED");
  ok(declined.findings.some((f) => f.field_path === "to_identity" && f.rule_id === "WF-UNRESOLVED"), "[3] the finding points at replies-to's to_identity");
}

// ================= [4] ceiling =================
console.log("\n[4] ceiling: no construction lifts a comment's earned grade off the floor");
{
  let st = genesis();
  const target = claim("comment", "a comment that will be fuzzed with support", "ungraded");
  const admitTarget = decide({ hash: "H4-T", entries: [target], links: [] }, storeViewOf(st, TABLES));
  ok(admitTarget.decision === "accepted", "[4] the fuzz target comment is admitted at ungraded");
  st = apply(st, { entries: [target], links: [], applied_contribution_hash: "H4-T", receipt_reference: hashOf(admitTarget) });
  eq(derivedGrade(st, target.identity, TABLES), "ungraded", "[4] the target's derived grade starts at ungraded");

  const grades = ["asserted", "supported", "corroborated", "checked"];
  for (let i = 0; i < 30; i++) {
    const n = 1 + (i % 3);
    const entries = [], links = [];
    for (let k = 0; k < n; k++) {
      const supporter = claim("measurement", `fuzz supporter ${i}-${k}`, "asserted");
      entries.push(supporter);
      const g = grades[(i + k) % grades.length];
      links.push(R.linkRecord({ link_kind: "supports", from_identity: supporter.identity, to_identity: target.identity, support_group: `g-${i}-${k}`, source_id: "S1", contributor_id: "P1", declared_grade: g }));
    }
    const contribution = { hash: `H4-FUZZ-${i}`, entries, links };
    const r = decide(contribution, storeViewOf(st, TABLES));
    ok(r.decision === "accepted", `[4] fuzz ${i}: the batch of ${n} support(s) into the comment is admitted`);
    st = apply(st, { entries, links, applied_contribution_hash: contribution.hash, receipt_reference: hashOf(r) });
    eq(derivedGrade(st, target.identity, TABLES), "ungraded", `[4] fuzz ${i}: after ${n} more support(s) the comment's derived grade is still ungraded`);
  }

  // declaring the comment itself above its ceiling is refused by the ordinary grade-mode check,
  // regardless of how strong its own checking records are.
  const overreach = R.claimRecord({ kind: "comment", statement: "a comment declaring above its ceiling", source_id: "S1", contributor_id: "P1", declared_grade: "checked", checking_records: [distinctCheck1, distinctCheck2] });
  const overreachDecision = decide({ hash: "H4-OVER", entries: [overreach], links: [] }, storeViewOf(genesis(), TABLES));
  ok(overreachDecision.decision === "declined", "[4] a comment declaring above ungraded is declined regardless of its own checking records");
  ok(overreachDecision.decision_basis.includes("GM-ABOVE"), "[4] the decline names GM-ABOVE");
}

// ================= REPORT =================
console.log(`\ncomment kind: grounding inertness, the comment-bomb guard, thread shape, and the ceiling checked.`);
if (fails.length) {
  console.error(`\n${fails.length} assertion(s) failed:`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("verified: a comment's ceiling is pinned at the lattice floor, so join with bottom is identity and a thread moves no grade whether added or withdrawn; a comment can never occupy a support role, the attempt named and blocked before the gate; comments-on and replies-to resolve like any other link, so a reply to a nonexistent comment fails the same way any dangling reference does; and no fuzz of incoming support ever lifts a comment above ungraded.");
process.exit(0);
