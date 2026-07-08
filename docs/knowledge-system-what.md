# The Knowledge System: What It Does

*This is a functional specification. It describes what the system does, the parts that do it, and what passes between them. It does not describe how any part is built; that belongs to a companion document. It assumes no prior knowledge.*

---

## 1. What the system is for

The system builds knowledge that can be trusted, traced, and added to by many people and machines over a long time. "Trusted" means you can check why a claim is held rather than taking it on someone's word. "Traced" means every claim carries a path back to whatever it ultimately rests on. "Added to" means a later contributor can build on earlier work without redoing it, and without the earlier work quietly rotting.

Most ways of storing knowledge lose one of these. A search engine traces sources but does not show why a claim is sound. An encyclopedia is readable but flattens disagreement into a single voice. A personal research file is trusted by its author and useless to anyone else. This system is designed to hold all three at once, and the rest of this document describes the functions that make that possible.

## 2. The basic unit: claims and the links between them

The smallest thing the system stores is a claim. A claim is a statement that could be true or false, supported or refuted: "water boils at 100 degrees Celsius at sea level," "this policy reduces poverty," "the collider cannot destroy the Earth."

Claims connect to other claims through typed links. The most important link is support: claim A is offered as a reason to believe claim B. There are others: A objects to B, A is a more cautious version of B, A and B are the same statement worded differently. The entire body of knowledge is a network of claims joined by these links. Picture a map where each point is a claim and each arrow is a relationship between claims. The system's job is to build that map, keep it honest, and let people read it.

## 3. Where claims bottom out: the floor

A claim is only as trustworthy as what it rests on. If A is believed because B supports it, and B because C supports it, the chain has to stop somewhere, at something that is not just another claim waiting for its own support. That stopping point is the floor.

There are three kinds of floor, and which kind a claim reaches determines what "well-grounded" even means for it. This three-way split is the central structural fact of the system.

**Grounded by evidence or proof.** Some claims bottom out in a physical measurement or a logical or mathematical proof. "Water boils at 100 degrees at sea level" rests on measurement. "There are infinitely many prime numbers" rests on proof. These floors are checkable by anyone with the instrument or the argument, and they do not depend on who is asking. Call this the formal region of knowledge. For a formal claim, well-grounded has an exact meaning: a path of support reaches a measurement or a proof.

**Grounded by declaration.** Some claims bottom out not in evidence but in an act of declaration. "The speed limit on this road is 60" is true because it was enacted, not because it was measured. A definition, an adopted standard, a signed contract, a law all work this way: they are binding because they were declared by an authority empowered to declare them. Call this the constitutive region. For a constitutive claim, well-grounded means the declaration is on the record and currently in force.

**Grounded by argument.** Many claims reach none of those floors. "This policy will reduce poverty," "this is the more likely explanation of the outbreak," "the evidence here is weaker than it looks" rest on argument, interpretation, and contested or incomplete evidence. They are real and they matter, but they do not reduce to a measurement, a proof, or a declaration. Call this the forum region. For a forum claim, well-grounded cannot mean reaching a hard floor, because there is no hard floor to reach. It means something different: the structure around the claim is faithful. The claim is honestly attributed to whoever made it, the reasons for and against it are both shown, the competing positions are represented rather than hidden, and the points of disagreement are visible.

So the system holds three regions distinguished by how their claims are grounded, and it checks groundedness differently in each. Formal claims are checked against the floor. Constitutive claims are checked against the record of what is in force. Forum claims are checked for faithful structure. The same machinery runs over all three; only the meaning of "grounded" changes.

## 4. Two kinds of forum claim

The forum region contains two different things, and the system must tell them apart.

Some forum claims could reach a floor but have not yet. "This drug lowers blood pressure" is an open empirical question; the measurement that would ground it is possible, just not yet done or not yet cited. A claim like this is an open piece of work, a debt the system records so someone can pay it.

Other forum claims are not the kind that ever reaches a measurement, proof, or declaration. "This outcome is more important than that one" is a value judgment; no instrument settles it. A claim like this is permanently in the forum, and that is not a defect. The system must not treat it as an unpaid debt and nag forever for a grounding that cannot exist.

The line between these two, an open question versus a settled-as-unsettleable matter of judgment, is one the system marks explicitly. Only the first counts as work to be done.

## 5. Grounding is a process, not a fixed state

The map is not static. A claim can move from one region to another when someone does the work. A forum claim that was an open empirical question becomes a formal claim the moment a measurement or proof is supplied for it. The boundary between what is grounded and what is not grounded shifts as investigation proceeds.

This movement is the system's basic unit of progress. Closing an open question, or cleanly ruling one out, advances the knowledge; merely adding more ungrounded claims does not. The system is built to make that kind of progress visible and to reward it.

## 6. The contamination rule

The three regions are not sealed off from each other. A forum argument can lean on a formal result, and a formal claim can rest on a forum assumption. These two cases are not symmetric, and the asymmetry is a rule the system enforces.

When a forum claim cites a formal result, it inherits that result's solidity cleanly. An argument that uses a proven theorem is standing on firm ground for that step.

When a formal claim depends on a forum assumption, it is only as solid as the assumption, which is to say it is not actually formally grounded at all. A calculation that looks rigorous but secretly rests on a contested premise is not rigorous; it is contested. The system must catch this and must refuse to let a claim advertise formal grounding while it quietly depends on something from the forum.

Stated simply: solidity flows upward, from floor toward argument, without loss, and weakness flows downward, contaminating anything that depends on it. Enforcing this asymmetry is one of the system's load-bearing jobs.

## 7. The functions and the parts that perform them

The system is a small set of parts, each responsible for one function. What follows names each part and the function it must perform. How each part performs it is left to the companion document.

**Intake** takes messy, real-world material, papers, transcripts, datasets, recordings, arguments, and turns it into claims attached to their origins. For each claim it records who asserted it, where, when, and in what context, so the claim never floats free of its source. That record is the start of the claim's history, which grows as it lives on the map: the crossings it makes between regions and the forks that retype it are recorded on the claim too, so its standing stays a traceable chain rather than a bare verdict. It also recognizes when the same claim appears in different words across different sources, so the map does not fill with duplicates. The output of intake is a set of attributed claims ready to be placed on the map.

**Typing** labels each claim with its grounding region, formal, constitutive, or forum, and labels each link between claims with its kind, support, objection, restatement, more-cautious-version. Typing is what makes the structure legible: once claims and links are labeled, the shape of an argument can be read and checked rather than merely felt.

**The grounding check** examines each claim and determines whether it is grounded in the sense appropriate to its region. For a formal claim it asks whether a path of support reaches a measurement or proof. For a constitutive claim it asks whether the declaration is on record and in force. For a forum claim it asks whether the surrounding structure is faithful and complete. Wherever a claim is not grounded, the grounding check names the gap precisely, and it marks whether the gap is closeable, an open question someone could resolve, or permanent, a matter of judgment that will not resolve. The grounding check is what lets anyone see, mechanically and without appeal to authority, exactly what is and is not grounded and what is missing.

**Composition control** governs every addition and every join. When a new claim is added, or two bodies of knowledge are merged, composition control allows it only if the result still holds together: nothing newly ungrounded is hidden, the contamination rule is respected, no duplicate masquerades as independent support. A join that would smuggle in a weakness is refused. Composition control is what keeps the map sound as it grows, rather than letting growth erode its guarantees.

**The negative-knowledge store** keeps what has been ruled out. When a claim is decisively refuted, the refutation is not discarded; the store records what was killed, why, and on what grounds. This serves two purposes. It prevents a refuted claim from being silently revived, since any attempt to reintroduce it meets the standing record of why it failed. And it preserves the work of refutation, which is as valuable as the work of confirmation and far more often lost. What the system has ruled out is part of its knowledge, not a discard pile.

**Disagreement handling** deals with the case where two well-grounded claims conflict. This is not treated as an error to be suppressed in favor of one side. The conflict itself becomes something the system represents: a recorded disagreement, holding both positions and the specific point on which they turn. The map is allowed to disagree with itself, openly, because forcing premature agreement destroys exactly the nuance the system exists to preserve.

**Structural assessment** evaluates the shape of an argument, beyond whether its individual claims are grounded. It identifies the crux, the single disagreement whose resolution would most change the overall picture. It flags where the same piece of evidence is being counted more than once as if it were independent. It marks where a move carries more rhetorical force than evidential weight. It surfaces what is missing, the sources or perspectives that should be present and are not. And it distinguishes what an inquiry actually settled from what it only appeared to settle. Structural assessment is what helps a reader decide what to believe and what to examine next.

**The reading surface** exposes the entire map, claims and their justifications, for reading by anyone, a person, a simple display, a sophisticated automated agent, a downstream system that consumes the knowledge. Reading never requires permission to write. The interface is the same for every reader; a more capable reader can extract more from it, but no reader has to be trusted with the power to change anything in order to use it. This is what lets the knowledge travel and be built upon without being owned.

The flow between the parts is straightforward. Material enters through intake, is labeled by typing, and is checked by the grounding check. Additions and joins pass through composition control, which consults the grounding check before admitting anything. Refutations are recorded in the negative-knowledge store. Conflicts are routed to disagreement handling. Structural assessment reads across the whole map. The reading surface exposes all of it to consumers. Every part operates on the same shared map of typed claims.

## 8. Subkernels and grounding profiles

A bounded region of the map, one subject, one investigation, one community's body of work, is a kernel: a self-contained body of knowledge that grounds to its own floor and runs the full set of functions above. A kernel that is part of a larger whole is a subkernel.

Each kernel has a grounding profile: how much of it is formal, how much constitutive, how much forum, and where each region sits. A pure-mathematics kernel is almost entirely formal, with a thin forum layer only at its research frontier. A nutrition-policy kernel is mostly forum, with small islands of formal knowledge where a few measurements actually terminate. A safety question about a physical experiment is often a forum question wrapped around a formal core: the underlying physics grounds in measurement and proof, while the public question stays in the forum until that formal core is shown to settle it.

A grounding profile is not fixed by subject. It is the current shape of where a body of knowledge has and has not reached a floor, and it changes as work proceeds. Every closed question shifts a piece from forum to formal and redraws the profile.

## 9. The composite: many kernels, one thin shared layer

The whole system is the composition of all its kernels. They are not joined by merging into one enormous map under one authority. They are joined through a thin shared layer that carries only what crossing between kernels requires: a way for a claim in one kernel to cite a claim in another, a common way to express units and definitions so they translate across kernels, and a way to resolve a dispute that lands on a boundary between kernels.

The shared layer is deliberately thin. It must be thick enough that separate kernels can actually compose across their boundaries, and thin enough that no central authority comes to own the content. Each kernel keeps authority over its own claims and its own floor; the shared layer only specifies how they meet. When one kernel cites another across this boundary, the citing kernel inherits the grounding of the cited claim under that other kernel's floor, and the strength of what it inherits is exactly the strength of that floor.

This is what lets the system be many sovereign bodies of knowledge rather than one monolith, and it is what lets it grow by addition of whole new kernels rather than only by edits within one.

## 10. The same shape at every scale

The functions described here apply at every level. A single claim is grounded, typed, and checked. A kernel ingests, types, checks, composes, preserves negatives, assesses, and is read. The whole composite does the same across its kernels through the shared layer. The system is the same shape whether you are looking at one claim, one kernel, or the entire body of knowledge. There is no separate machinery for the large scale; there is the same machinery, applied again.

## 11. What stays true no matter how it is built

These are the guarantees the system holds regardless of implementation. They are the invariants the companion document must realize and must never violate.

Whether a claim is grounded is decided by its structure, not by a vote or by anyone's authority. Any reader can check it for themselves, and no one's standing changes the answer.

What has been ruled out is kept. Negative knowledge is preserved as a first-class part of the record and cannot be silently revived.

The floor is the only thing trusted at bottom. Every other claim inherits its trustworthiness from whatever it ultimately rests on, and nothing is trusted merely because it is asserted.

Every claim carries its justification. You can always trace why a claim is held, through its supports, down to a floor.

Reading never requires the power to write. Anyone can read the knowledge and its justifications without being granted the ability to change them.

Grounded always means the thing appropriate to the claim's region, reaching a measurement or proof, an in-force declaration, or a faithful structure, and the system never lets one kind of grounding be mistaken for another.
