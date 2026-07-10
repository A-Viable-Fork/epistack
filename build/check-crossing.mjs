// Role: the crossing oracle (the keystone). Treats the four existing cases as four independent kernels
//   pinning type-hashes, and tests the two behaviors the three-tier design turns on, over the real
//   composition machinery: a claim of a type both kernels pin crosses native and lossless; a claim of a
//   type the target did not pin arrives untyped and grounds nothing, until the target forks it in.
// Contract: `node build/check-crossing.mjs` exits non-zero on any failure. Imports the adoption layer,
//   the composition transfer/records, the confidence order, and the covid and lhc case builders.
// Invariant: the crossing is the existing citeDomainClaim path; the new thing is that native versus
//   untyped is keyed on type-hash adoption, not on the store boundary. A fork (adopting the type) is
//   what confers standing, so non-adoption is safe rather than broken. A re-run is byte-identical.
"use strict";
import { adoptionOf, crossingStatus } from "./adoption.mjs";
import { citeDomainClaim, compositeGrade } from "../kernel/composition/transfer.mjs";
import { compositeClaimRecord } from "../kernel/composition/records.mjs";
import { derivedGrade } from "../kernel/store/decay.mjs";
import { buildCovid } from "./covid-build.mjs";
import { buildLhc } from "./lhc-build.mjs";

let fails = 0;
const ok = (c, m) => { console.log(`${c ? "  ok  " : " FAIL "} ${m}`); if (!c) fails++; };
const H = "=".repeat(80);
console.log(H); console.log("CHECK-CROSSING (the keystone): same-hash native, unpinned untyped, fork restores"); console.log(H);

// the four kernels' adoptions. covid and lhc are built as real stores (origins we cite from); lineage
// is the target kernel B, present here as its adoption (its pins are all the crossing decision needs).
const covid = buildCovid();
const lhc = buildLhc();
const covidAd = adoptionOf("covid");
const lhcAd = adoptionOf("lhc");
const B = adoptionOf("lineage"); // the target kernel

// the crossing itself is the existing composition path; the gate reads the type-hash to decide whether
// the crossed grade transfers (native) or the claim arrives untyped and grounds nothing.
function cross(originKind, originAd, targetAd, originStore, cited_claim, citing_claim) {
  const status = crossingStatus(originKind, originAd, targetAd);
  const citation = citeDomainClaim(originStore, { citing_claim, cited_claim, role: "necessary", made_at: "cross" });
  const effective = status === "native" ? citation.carried_grade : "ungraded";
  return { status, citation, effective };
}

// --- 1. same-hash crossing composes native and lossless ---
console.log("\n[1] same-hash crossing: native and lossless");
{
  const cited = covid.refId.get("ev.clustering"); // a covid measurement claim, grade checked
  const originGrade = derivedGrade(covid.state, cited, covid.tables);
  const host = compositeClaimRecord({ statement: "B rests on a crossed covid measurement", region: "forum" });
  const { status, citation, effective } = cross("measurement", covidAd, B, covid, cited, host.claim_id);

  ok(covidAd.pins.measurement === B.pins.measurement, "kernel A (covid) and kernel B (lineage) pin the same measurement type-hash");
  ok(status === "native", `the crossing is native (got ${status})`);
  ok(citation.carried_grade === originGrade, `the crossed claim carries its grade natively, no loss (origin ${originGrade}, carried ${citation.carried_grade})`);
  ok(effective === originGrade, "the effective crossed grade equals the origin grade");
  // and it is lossless precisely because the hashes match: a composite in B resting on it is not degraded
  const g = compositeGrade({ ceiling: "settled", citations: [{ role: "necessary", carried_grade: effective }] });
  ok(g === "settled", `a B claim resting on the native crossing grounds at the composed top (got ${g})`);
  ok(covidAd.pins.measurement === B.pins.measurement && status === "native", "native holds precisely because both kernels pin the same type-hash");
}

// --- 2. unpinned crossing arrives untyped and grounds nothing ---
console.log("\n[2] unpinned crossing: untyped, grounds nothing");
let forkFixture;
{
  const cited = lhc.refId.get("prod.reach"); // an lhc derivation claim, grade constitutive; no other kernel pins derivation
  const originGrade = derivedGrade(lhc.state, cited, lhc.tables);
  const host = compositeClaimRecord({ statement: "B rests on a crossed lhc derivation", region: "forum" });
  const { status, citation, effective } = cross("derivation", lhcAd, B, lhc, cited, host.claim_id);

  ok(!Object.values(B.pins).includes(lhcAd.pins.derivation), "kernel B (lineage) pins no type-hash equal to lhc's derivation hash");
  ok(status === "untyped", `the crossing arrives untyped (got ${status})`);
  ok(citation.carried_grade === originGrade, `the composition path did copy the real grade (${originGrade}); the gate, not the copy, is what withholds it`);
  ok(effective === "ungraded", `keyed on hash non-adoption, the untyped crossing grounds nothing (effective ${effective})`);
  const g = compositeGrade({ ceiling: "settled", citations: [{ role: "necessary", carried_grade: effective }] });
  ok(g === "ungraded", `a B claim resting on the untyped crossing inherits untyped, grounding nothing (got ${g})`);
  forkFixture = { cited, originGrade, host, citation };
}

// --- 3. the fork restores standing ---
console.log("\n[3] the fork restores standing (adoption confers it)");
{
  const { cited, originGrade, host, citation } = forkFixture;
  // B retail-forks the untyped claim: it adopts the type locally, pinning that type-hash as its own.
  const Bforked = { ...B, pins: { ...B.pins, "derivation@lineage-local": lhcAd.pins.derivation } };
  const status = crossingStatus("derivation", lhcAd, Bforked);
  const effective = status === "native" ? citation.carried_grade : "ungraded";

  ok(status === "native", `after the fork, the same crossing is native (got ${status})`);
  ok(effective !== "ungraded" && effective === originGrade, `the forked claim now grounds, carrying its grade (${effective})`);
  const g = compositeGrade({ ceiling: "settled", citations: [{ role: "necessary", carried_grade: effective }] });
  ok(g !== "ungraded", `a B claim resting on the forked claim now grounds (got ${g})`);
  void host;
}

// --- 4. determinism ---
console.log("\n[4] determinism");
{
  const a = crossingStatus("measurement", covidAd, B) + "/" + crossingStatus("derivation", lhcAd, B);
  const b = crossingStatus("measurement", adoptionOf("covid"), adoptionOf("lineage")) + "/" + crossingStatus("derivation", adoptionOf("lhc"), adoptionOf("lineage"));
  ok(a === b, "the crossing decision is deterministic across rebuilds of the adoptions");
}

console.log("\n" + H);
if (fails === 0) console.log("verified: crossing composes native between kernels pinned to the same type-hash, arrives untyped otherwise, and a fork restores standing, so shared meaning is what composes and the untyped type makes non-adoption safe.");
console.log(fails === 0 ? "check-crossing: OK" : `check-crossing: ${fails} FAILURE(S)`);
console.log(H);
process.exit(fails === 0 ? 0 : 1);
