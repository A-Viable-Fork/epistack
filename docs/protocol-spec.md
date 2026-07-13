---
Type: specification
Purpose: The extractable, normative protocol specification: the record formats, the grounding computation, the gate, the crossing, and the client contract, stated so a team can implement a conforming kernel without reading the argument.
Depends on: docs/api.md, docs/composition-spec.md, docs/parameters-register.md
Depended on by: nothing
---

# The EpiStack Protocol Specification

This document specifies the protocol normatively and standalone. It states the rules; it does not
argue them. Where a rule has a rationale, the rationale lives in an argument document cited as
informative in Section 9, and no argument document is required to implement the protocol.

Ground truth is the built machinery. Every format and algorithm below is derived from the code in
`kernel/` and `api/`, and where this prose and the code ever disagree, the code governs.

## 1. Scope and conformance

The protocol covers: the typed claim and link records (Section 2), the grade ordering (Section 3),
the grounding computation (Section 4), the intake gate (Section 5), the untyped type and the
crossing (Section 6), and the client contract (Section 7). Section 8 draws the line between the
invariants an implementation MUST hold and the parameters a deployment MAY set locally.

An implementation conforms if it satisfies the invariants stated below. The repository's check suite
(`build/check-*.mjs`) is the reference conformance suite: each check is an executable statement of one
or more of these invariants, and an implementation conforms exactly when it would pass them.

The key words MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted as described in
RFC 2119.

## 2. The record formats

Records are derived from `kernel/schema/records.mjs`. Undeclared top-level fields on any record are
collected into a hashed `extensions` map that no check reads; a `field_path` MUST NOT point into it.
Every record canonicalizes to a stable form and carries a content hash of that form.

### 2.1 The claim record

| field | required | value |
|---|---|---|
| `identity` | derived | content identity, computed from `kind` and `statement`; not author-set |
| `kind` | MUST | a kind the local kind table declares |
| `statement` | MUST | the claim text |
| `source_id` | MUST | an id in the source table |
| `contributor_id` | MUST | the contributing party |
| `declared_grade` | MUST | a grade position (Section 3) |
| `checking_records` | MAY | array of checking records (Section 2.3) |
| `closing_condition` | MAY | on a claim held as a characterized gap: the measurement, proof, or direct study that would ground it |

A claim's identity is `kind` plus `statement`, so restating the same claim yields the same identity.
The claim record carries no references field: what a claim rests on is expressed only by `supports`
links into it (Section 2.2), which are the sole source of truth for its support.

### 2.2 The link record

| field | required | value |
|---|---|---|
| `identity` | derived | computed from `link_kind`, `from_identity`, `to_identity` |
| `link_kind` | MUST | one of the link kinds below |
| `from_identity` | MUST | the source claim identity |
| `to_identity` | MUST | the target claim identity |
| `support_group` | MAY | present only on `supports` links; groups co-necessary supports |
| `source_id` | MUST | an id in the source table |
| `contributor_id` | MUST | the contributing party |
| `declared_grade` | MUST | a grade position; caps what the link can deliver |
| `checking_records` | MAY | array of checking records |

The link kinds and their semantics, exactly as built:

- **`supports`**: the only link that enters the grade computation. `from` delivers grounding to `to`.
  A `support_group` on a set of supports marks them co-necessary (combined weakest-of); supports in
  distinct groups are corroborating alternatives (combined strongest-of). There is no separate role
  field; the group encodes the necessary-versus-corroborating distinction.
- **`depends-on`**: a presupposition or frame edge. It routes to the currency check (Section 5) and
  never enters the grade fold; a fallen frame breaks form, not grade. `MUST` name an in-force target.
- **`contradicts`**: records a disagreement. It routes to a contradiction record (Section 5) and is
  inert in the grade fold.
- **`refines`**: a claim refining another; carried in the record, inert in the grade fold.
- **`restatement`**: joins two identities as one claim under a union-find closure; supports into any
  member support the merged claim.
- **`undercut`**: attacks a support edge's grounding rather than adding support. Inert in the gate; a
  dedicated undercut reading over the graph lowers the confidence the attacked leg transmits.

### 2.3 The checking record

A checking record on a claim or link carries `checker_id` (MUST), `method_class` (MUST, one of
`replication`, `derivation-audit`, `data-audit`, `direct-measurement`), `method`, `checked_at_state`
(MUST), `outcome` (MUST, `confirms` or `confirms-with-noted-limits ...`), and `independence` (MUST,
`distinct-party` or `self`). Only a `distinct-party` check contributes to a claim's own basis
(Section 4).

## 3. The grade ordering and floors

The grade set and ordering are derived from `kernel/schema/confidence.mjs`. Grades are named
positions, never numbers.

| position | tier | mode |
|---|---|---|
| `ungraded` | bottom | none |
| `asserted` | open | none |
| `supported` | open | none |
| `corroborated` | open | none |
| `checked` | settled | empirical (rank 1) |
| `independently-rechecked` | settled | empirical (rank 2) |
| `constitutive` | settled | constitutive |

For every combination step the settled positions collapse to one level `settled`, giving the working
line `ungraded < asserted < supported < corroborated < settled`. `meet` is weakest-of and `join` is
strongest-of on that line. The settled tier is a branch, not a point: the empirical axis
(`checked < independently-rechecked`) and the constitutive position are in different modes and are
incomparable across modes. Comparing two settled positions of different mode is undefined, and an
implementation MUST read that as a decline, not a passed test.

Each kind carries a ceiling, an earned grade MUST NOT exceed it, and the ceiling is the kind's floor
category. The kind table is local (Section 8); the built cases use: `measurement` at ceiling
`checked` (the empirical measurement floor), `forum` at ceiling `corroborated` (the open forum band),
`derivation` at ceiling `constitutive` (the proof or derivation floor), and `declaration` at ceiling
`constitutive` (the constitutive floor a definition earns by adoption).

The source table (from `kernel/schema/tables.mjs`) types each `source_id` by one of the source
classes `primary-measurement`, `peer-reviewed`, `preprint`, `dataset`, `institutional-report`,
`testimony`, and records its `rests_on` dependencies for footprint closure (Section 4).

## 4. The grounding computation

The earned grade of a claim is a deterministic function of the public structure, derived from
`kernel/grounding/earned-grade.mjs`. Any party MUST be able to recompute an earned grade from the
graph alone; conformance requires this determinism.

Given a claim with its `supports` links (each carrying its own earned grade, its link's declared
grade, and its source footprint), its checking records, and its kind's ceiling:

```
support_delivery(supports):
  if no supports: return asserted            # support from nothing is nothing
  group the supports by support_group
  for each group: delivery = weakest-of over members of
                  min(collapse(member.support_earned), collapse(member.link_grade))
  S = strongest-of over the group deliveries
  if two groups each deliver >= supported and their source footprints are disjoint:
      S = strongest-of(S, corroborated)      # the independence lift, and no further
  return S

own_basis(claim):
  if kind is constitutive: return constitutive
  distinct = checking_records with independence == distinct-party
  if >= 2 distinct with a disjoint-footprint pair: return independently-rechecked
  if >= 1 distinct: return checked
  return none

earned_grade(claim):
  S = support_delivery(claim.supports)
  B = own_basis(claim)
  if B is settled and (S >= corroborated or claim has no supports):
      earned = cap_by_ceiling(B, ceiling)    # the basis stands, supports permitting
  else:
      earned = cap_by_ceiling(min(S, corroborated), ceiling)
  return earned
```

Two properties are load-bearing and MUST hold. First, settledness is not inherited: a claim resting
on settled support delivers at most `corroborated`; only a claim's own basis, a distinct-party check
or a constitutive kind, reaches the settled tier, and only when its supports do not drag it down.
Second, footprint disjointness is taken over the reflexive-transitive closure of each source's
`rests_on`, so two supports that trace to a common source are not independent even if their immediate
sources differ.

Contamination is monotone: a claim MUST NOT advertise more standing than its necessary supports
carry, which the weakest-of within a group enforces. The untyped type (Section 6) grounds nothing and
inherits downward.

## 5. The gate algorithm

The gate is the sole canonical write path, derived from `kernel/gate/gate.mjs`. `decide(contribution,
store_view, versions)` is a deterministic function of the contribution's content and the store state.
It reads the claim and its structure; it MUST NOT read the identity or nature of the author. Any
differential treatment of a producer by kind (person, organization, model, pipeline) is outside the
protocol; the gate's verdict is a function of structure alone.

On submit the gate runs these checks and declines on any failure:

- **Reference binding (Section 5 of the data model).** Every identity a link names binds at the grade
  the STORE holds for the target, never a grade the contribution asserts for another party's entry. A
  reference to a superseded entry declines (`WF-SUPERSEDED`, naming the successor); a reference to an
  unresolvable identity declines (`WF-UNRESOLVED`).
- **Currency.** Each `depends-on` target MUST exist and be in force, else `WF-DEPENDS`.
- **Grade-mode.** For each entry, `declared_grade` MUST be at or below the earned grade within a
  comparable mode. An incomparable mode declines (`GM-MODE`); a declared grade above earned declines
  (`GM-ABOVE`).
- **Withdrawn-claim reinstatement.** Reintroducing a withdrawn claim requires its typed reinstatement
  condition satisfied against the store and contribution, else `WD-UNSATISFIED`.

Two findings are recorded but do not by themselves decline:

- **Corroboration and independence.** A claim supported by two or more contributors yields a
  corroboration finding. When two support groups have disjoint source footprints the verdict is
  `disjoint` (effective count the number of groups); otherwise `shared` (effective count one). This is
  the promotion rule: standing above `supported` is earned only on independent corroboration, agreement
  counted once the agreeing parties are shown independent.
- **Contradiction.** Each `contradicts` link yields a contradiction record with the divergence points
  between the two sides' supports.

The decision is `declined` if any check declined, else `accepted-with-disagreement` if any
contradiction record was produced, else `accepted`. The receipt (Section 11 of the data model) MUST
carry: `ruleset_version`, `schema_version`, `store_state`, `contribution_hash`, `findings`,
`binding_table`, `grade_table`, `restatement_closures`, `withdrawn_matches`, `corroboration_findings`,
`contradiction_records`, `decision`, and `decision_basis`.

## 6. The untyped type and the crossing

These invariants are derived from `docs/composition-spec.md` and `kernel/schema/type-hash.mjs` and are
what make a kernel composable. Each is a MUST with its mechanical consequence.

- Every schema MUST include the untyped type.
- The untyped type is not a floor and grounds nothing: a claim typed untyped has no standing on its
  own.
- Untyped status inherits downward: a locally-typed claim resting on an untyped claim is itself
  untyped.
- A crossing from kernel A into kernel B MUST preserve provenance and strip standing: the claim enters
  B as untyped, carrying the inert record that it grounded under A's rules, never a floor of B's.
- Standing across a boundary is earned only by a fork with a named local author: a retail fork casts a
  single untyped claim into a local type; a wholesale fork extends the schema so that shape types
  natively. No unforked path confers standing.
- A same-hash crossing composes native and lossless. A type is a bundle (its kind with its ceiling and
  rules, its floor with its rank, its source class with its footings), hashed over that apparatus and
  not its label (`hashTypeBundle`). Two kernels that pin the same hash mean the same thing by the type,
  so the claim's grade carries across intact; a kernel that pins no matching hash receives it untyped.
  The hash MUST be deterministic and meaning-sensitive.

## 7. The client contract

The client contract is derived from `api/client-api.mjs` and `docs/api.md`. Reads never mutate; the
only write is a gated submission. A client reaches the store through no other door.

The propose/read surface:

```
propose(proposedClaim) -> receipt            # the Section-11 gate receipt (Section 5)
read(query) -> [claim with grounding]        # each claim with its declared and earned grade
robustness(query) -> [claim with fragility]  # grade, robustness after the worst single removal,
                                             #   single points of failure, correlated-evidence flag
gaps(query) -> [open gap]                     # a claim in force whose earned grade does not cover
                                             #   its declared grade
characterizedGaps(query) -> [gap]            # an honest leap with the closing condition that grounds it
reconciliations(query) -> [disagreement]     # a contradicts-linked pair with its computed crux candidate
providerKind() -> "local" | "remote"         # diagnostic only; the client renders identically
```

The write is `propose`, which returns the gate's receipt; it does not insert a row. `robustness`,
`gaps`, `characterizedGaps`, and `reconciliations` are derived on read from the same structure the
grade is, never stored. A crux is a candidate, never a verdict.

The trellis read surface (`docs/api.md`) exposes `resolve(id)`, `has(id)`, `decompose(id)`,
`compare(idOrAtlas)`, `dependents(id)` (the blast radius), `motions(id)`, `classify(id)`, `gaps()` and
`gaps(id)`, `perturb(flipped)` (a non-destructive what-if overlay), `kinds()`, `entry()`,
`compareTargetFor(id)`, and `pipelineMembers(rootId)`. Every one is an open read that MUST NOT mutate.
The one write is `submit(claim)`, which passes to the gate; there is no setter, no store handle, no
resolver a client can build.

## 8. Required invariants versus local policy

From `docs/parameters-register.md`. An implementation MUST hold the required tier to stay composable,
and MAY set the local tier however its deployment requires.

An implementation MUST hold:

- Claims are typed, including as the untyped type.
- Grounding is monotone in the contamination sense: a claim never advertises more standing than its
  necessary supports carry.
- The untyped type grounds nothing.
- Claims carry their history: origin, crossings, and the forks that retyped them.
- Standing is forkable and revocable.

An implementation MAY set locally, with no effect on composability:

- The time-lock parameters (the cost, decay, and window that price standing against gaming).
- The standing and reputation rules (who earns standing and how it is weighted).
- The agent policy (which producers may perform which steps).
- The type system (which kinds, floors, and source classes the kernel recognizes, and any grade names
  beyond the shared ordering).
- The forum and weighing conventions.

## 9. Informative references

None of these is required to implement the protocol. Each states rationale the sections above do not.

- `docs/the-climb-of-synthesis.md`: why the protocol takes this shape.
- `docs/what-stands-without-trust.md`: the full argument and the federation appendix.
- `docs/composition-spec.md`: the rationale for the crossing and untyped-type rules in Section 6.
