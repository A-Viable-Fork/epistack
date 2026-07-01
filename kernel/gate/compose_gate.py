#!/usr/bin/env python3
"""compose_gate.py - mechanical compose-and-gate over independent typed contributions.
No model runs here. Judgment lives in the registries and the RULES below; everything
else is deterministic over the typed fields the emitters wrote. Hardened to tolerate
malformed / partial contributions (e.g. pasted LLM output): bad nodes are reported as
violations, never crash the run.
Input : incumbent.json + every contribution_*.json in the directory.
"""
import json, glob, os
from collections import defaultdict

SOURCE_REGISTRY = {
    "DS-EARLYCASE-DEC2019": {"withheld": True},  "DS-ENVSAMPLES-HSM": {"withheld": False},
    "DS-PHYLO-EARLY":       {"withheld": False}, "DS-BASERATE-HIST":  {"withheld": False},
    "DS-FCS-MOLEC":         {"withheld": False}, "DS-DEFUSE-2018":    {"withheld": False},
    "DS-SARBECO-SURVEY":    {"withheld": False}, "DS-LABRECORDS-WIV": {"withheld": True},
}
ONTOLOGY   = {"measurement", "irreducible-prior", "withheld-record", "question-set", "pending"}
NODE_SPACE = {"Q-PIVOT-MARKET","Q-GEO-WHYWUHAN","Q-FCS-DEFUSE","Q-BASERATE","Q-METHOD","Q-LAYER0"}

def names_withheld_resolver(n):
    r = n.get("namesWithheldResolver")
    return bool(r) and SOURCE_REGISTRY.get(r, {}).get("withheld", False)
def idents(n):
    return {s["ident"] for s in (n.get("sources") or []) if isinstance(s, dict) and "ident" in s}
def load(p):
    with open(p) as f: return json.load(f)

def validate(n):
    e = []
    if n.get("terminal") not in ONTOLOGY:
        e.append(f"{n['_src']}:{n['addr']}: bad/missing terminal {n.get('terminal')!r}")
    if n["addr"] not in NODE_SPACE and not str(n["addr"]).startswith("Q-NEW-"):
        e.append(f"{n['_src']}:{n['addr']}: addr off-space (not a registered question)")
    for s in (n.get("sources") or []):
        if not isinstance(s, dict) or s.get("ident") not in SOURCE_REGISTRY:
            bad = s.get("ident") if isinstance(s, dict) else s
            e.append(f"{n['_src']}:{n['addr']}: unregistered/malformed source {bad!r}")
    return e

def ingest(arr, src, violations, nodes):
    if not isinstance(arr, list):
        violations.append(f"{src}: top-level JSON must be an array of nodes"); return
    for n in arr:
        if not isinstance(n, dict):
            violations.append(f"{src}: a node is not a JSON object -> skipped"); continue
        n["_src"] = src
        if "addr" not in n:
            violations.append(f"{src}: a node is missing 'addr' -> skipped"); continue
        violations += validate(n); nodes.append(n)

def main():
    nodes, violations = [], []
    try: ingest(load("incumbent.json"), "incumbent", violations, nodes)
    except Exception as ex: violations.append(f"incumbent.json: cannot read ({ex})")
    for path in sorted(glob.glob("contribution_*.json")):
        src = os.path.basename(path).replace("contribution_", "").replace(".json", "")
        try: ingest(load(path), src, violations, nodes)
        except Exception as ex: violations.append(f"contribution_{src}.json: invalid JSON ({ex})")
    emitters = sorted({n["_src"] for n in nodes if n["_src"] != "incumbent"})

    by_addr = defaultdict(list)
    for n in nodes: by_addr[n["addr"]].append(n)

    composed = {}
    for addr, grp in sorted(by_addr.items()):
        srcs = sorted({n["_src"] for n in grp})
        terms = defaultdict(set)
        for n in grp: terms[n["_src"]].add(n.get("terminal", "(none)"))
        terms = {k: sorted(v) for k, v in terms.items()}
        distinct = {n.get("terminal") for n in grp}
        inc = next((n for n in grp if n["_src"] == "incumbent"), None)
        wr  = [n for n in grp if names_withheld_resolver(n)]
        rec = {"contributors": srcs, "relation": None, "resolution": None, "notes": []}
        if len(distinct) > 1:
            if inc and inc.get("terminal") == "irreducible-prior" and wr:
                named = sorted({n["namesWithheldResolver"] for n in wr}); who = sorted({n["_src"] for n in wr})
                rec["relation"] = "typing-disagreement -> WITHHELD-RECORD REFINE"
                rec["resolution"] = "adopt withheld-record typing; incumbent's irreducible-prior elides a registered sealed resolver"
                rec["notes"] += [f"incumbent: irreducible-prior, no resolver named",
                                 f"{who}: withheld-record-gated, resolver={named}",
                                 "sealed-but-existing resolver is not irreducible-in-principle (correction)"]
            else:
                rec["relation"] = "typing-disagreement"; rec["resolution"] = "surface competing typings with provenance; do not silently overwrite"
                rec["notes"].append(f"terminals by contributor: {terms}")
            if len(distinct) > 2: rec["notes"].append("3+ terminals at one address -> candidate for decomposition")
        leans = {n["_src"]: n.get("assertedLean") for n in grp if n.get("assertedLean")}
        if len(set(leans.values())) > 1:
            rec["relation"] = (rec["relation"]+" ; reading-fork") if rec["relation"] else "reading-fork"
            rec["resolution"] = (rec["resolution"] or "") + " | fork: expose both leans, price asymmetry, do NOT average"
            rec["notes"].append(f"incompatible leans: {leans}")
        if rec["relation"] is None:
            rec["relation"] = "merge / accumulate" if len(grp) > 1 else "single-contributor"
            rec["resolution"] = "union of complementary claims" if len(grp) > 1 else f"sole contribution: {srcs[0]}"
        composed[addr] = rec

    emit = {e: set() for e in emitters}
    for n in nodes:
        if n["_src"] in emit: emit[n["_src"]] |= idents(n)
    ds_emitters = defaultdict(set)
    for e in emitters:
        for d in emit[e]: ds_emitters[d].add(e)
    shared_cross = {d: sorted(es) for d, es in ds_emitters.items() if len(es) > 1}
    indep = {}
    for addr, grp in by_addr.items():
        per = defaultdict(set)
        for n in grp:
            if n["_src"] in emit: per[n["_src"]] |= idents(n)
        if len(per) < 2: continue
        common = set.intersection(*per.values()) if per else set()
        indep[addr] = ({"verdict": "SHARED-INPUT agreement (count once)", "shared": sorted(common)} if common
                       else {"verdict": "INDEPENDENT corroboration (weight up)", "by_emitter": {k: sorted(v) for k, v in per.items()}})

    tstats = defaultdict(lambda: defaultdict(int)); verified = []
    for n in nodes:
        if n["_src"] == "incumbent": continue
        for s in (n.get("sources") or []):
            if not isinstance(s, dict): continue
            tstats[n["_src"]][s.get("typing")] += 1
            if s.get("typing") == "author-verified": verified.append((n["_src"], n["addr"], s.get("ident")))
    wterms = defaultdict(set)
    for n in nodes:
        if names_withheld_resolver(n): wterms[n.get("terminal")].add(f"{n['_src']}:{n['addr']}")
    imputed = [(n["_src"], n["addr"], n.get("status")) for n in nodes if n.get("conjecture") and n["_src"] != "incumbent"]
    crux = [(n["_src"], n["addr"], n.get("namesWithheldResolver")) for n in nodes if n.get("loadBearing") and n["_src"] in emit]
    sealed = sorted({d for _, _, d in crux if d})

    P = print
    P("="*74); P(f"COMPOSE-GATE REPORT  (incumbent + {' + '.join(emitters) if emitters else 'no contributions'})"); P("="*74)
    P("\n[VALIDATION] " + ("OK - all nodes schema- and registry-valid" if not violations else f"{len(violations)} issue(s):"))
    for v in violations: P("   - " + v)
    P("\n[COMPOSED MAP]")
    for addr, r in composed.items():
        P(f"\n  {addr}   contributors={r['contributors']}")
        P(f"     relation : {r['relation']}")
        P(f"     resolve  : {r['resolution']}")
        for nt in r["notes"]: P(f"        - {nt}")
    P("\n[INDEPENDENCE PASS]")
    P(f"  datasets used by >1 emitter (cross-run dependency): {shared_cross or 'none'}")
    for addr, v in indep.items():
        P(f"  {addr}: {v['verdict']}  {v.get('shared') or v.get('by_emitter')}")
    P("\n[LINTER: typing honesty]")
    for e, st in tstats.items(): P(f"  emitter {e}: {dict(st)}")
    if verified:
        P("  author-verified claims requiring substantiation:")
        for v in verified: P(f"     {v[0]}  {v[1]}  {v[2]}")
    P("\n[LINTER: imported imputed/conjecture claims -> pending substantiation]")
    if imputed:
        for s, a, st in imputed: P(f"     {s}  {a}  status={st}  -> enters as conjecture, NOT promoted")
    else: P("  none")
    P("\n[LINTER: ontology consistency on withheld-record-gated nodes]")
    if len(wterms) > 1:
        P("  GAP: withheld-gated nodes carry >1 distinct terminal ->")
        for t, who in wterms.items(): P(f"     {t!r}: {sorted(who)}")
        P("  -> ontology has no canonical 'withheld-record' terminal; emitters improvised")
    else: P("  consistent")
    P("\n[STRUCTURAL SUMMARY: load-bearing cruxes]")
    for s, a, d in crux: P(f"  {s}: {a}   withheld-resolver={d}")
    P(f"  -> {len(crux)} load-bearing crux assertion(s) across {len(sealed)} distinct sealed datasets: {sealed}")
    if len(sealed) > 1: P("  -> map shape: SEALED DOORS (one per vantage), not one irreducible fog")

