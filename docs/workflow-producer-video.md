---
Type: reference
Purpose: The producer workflow for a spoken multi-party debate: the pipeline from recorded video to a proposedClaim landing at the built gate, the tools named with their build register, the provenance each stage preserves, and the federation-crossing discipline that keeps machine extraction from contaminating a curated case.
Depends on: docs/workflow-atlas.md, docs/api.md, docs/producer-connector-findings.md, docs/composition-spec.md
Depended on by: nothing
---

# Producer Workflow: Spoken Multi-Party Debate

*Source shape: a long recorded debate among several speakers. The richest case, because the provenance the graph keeps is exactly what a flat synthesis loses.*

## The source

The worked example is the recorded COVID-origins debate the competition references: roughly twenty hours across three sessions, Saar Wilf and Yuri Deigin arguing lab-leak, Peter Miller arguing zoonosis, hosted by Rootclaim and posted to YouTube. It is the hardest producer input in this atlas: many hours, several speakers, claims that build on and answer each other, and a verdict that turns on who said what and when. A synthesis of it is one reader's account of twenty hours. What lands in the kernel is every claim wired to the exact minute a named speaker made it.

## The pipeline

1. **Acquire audio and any caption track.** A downloader pulls the audio and whatever captions the source carries (yt-dlp). A source with clean speaker-labeled captions lets you skip transcription entirely, and you should: starting from a clean transcript is reading a text source, not ingesting video, and the video pipeline exists for the case where the transcript is absent or unlabeled. Provenance captured: the video id and the caption track if present. Register: example, current tooling.

2. **Transcribe with speaker attribution.** Where captions are absent or unlabeled, transcribe with diarization (WhisperX: Whisper large-v3 for ASR, pyannote for diarization), yielding word-timestamped, speaker-attributed turns. Provenance captured: each turn carries its speaker label and its timestamp span. Register: example, current tooling.

3. **Extract candidate claims.** A frontier model reads the speaker-attributed transcript in windows and emits candidate claims, each carrying the speaker who made it and the timestamp span it came from. This is the model doing the reading a human producer would otherwise do by hand. Provenance captured: speaker and timestamp on every candidate. Register: example, current tooling.

4. **Type each candidate.** The same model types each candidate against the kernel's kinds and grades: what kind of thing the claim is, and what grade its author is declaring for it. This is the claimant's typing work, done by the model, and it is the work the gate will check. Register: example, current tooling.

5. **Emit and land.** Each typed candidate becomes a `proposedClaim` carrying its `statement`, its `kind`, its `supports` where it rests on other extracted claims, and its provenance, and lands through the MCP producer tool or `propose`. Register: built. The gate grades it exactly as it grades a human's claim, and an over-declaration is demoted at the gate, not at the extractor.

A landed claim, using only the real `proposedClaim` fields, looks like:

```
{
  statement: "The furin cleavage site is consistent with natural recombination",
  kind: "claim",
  declared_grade: "attributed",
  citation: "rootclaim-debate/session-2 @ 04:12:30-04:15:10, speaker: Miller",
  supports: ["covid.zo.furin.evidence-node"]
}
```

## The provenance star

Every landed claim links back to (video, timestamp, speaker): a pointer to the exact minute of the debate where a named person made it. That link is the thing the graph keeps and a synthesis cannot. A synthesis says the debate covered the furin cleavage site; the graph says Miller made this specific claim at this minute, resting on this evidence node, at this declared grade, and a reader clicks back to the source and checks. The provenance is not decoration; it is what makes a twenty-hour source auditable one claim at a time instead of trusted one summary at a time.

## The register of each stage

Acquire, transcribe, extract, and type are the example register: off-the-shelf tools this submission does not build or vendor, named honestly so a producer can assemble the same pipeline with mass-market tooling. The landing is built: `propose` and the MCP producer tool are the write anchor, graded in `docs/status-ledger.md`. Every stage above the gate is periphery a producer supplies. The gate it lands at is built.

## The crossing discipline

Machine-extracted claims should land in their own kernel and reach any curated case only through the federation crossing. They arrive at the border untyped, grounding nothing until a named local author forks and types them, so an extraction error cannot contaminate an audited case: it sits at the floor as an untyped import until someone owns the crossing (`docs/composition-spec.md`). This is not a safeguard bolted on. It is the bottom-up crossing doing exactly what it is for, and the video pipeline is a feature demonstration of that crossing, not a risk it exposes. A high-volume, fallible producer is precisely the case the untyped border was built to admit freely and ground carefully.
