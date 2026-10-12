---
Type: reference
Purpose: "Points any coding agent at CLAUDE.md as this repository's instructions, imports included."
Depends on: [CLAUDE.md]
Depended on by: []
---

# Instructions for coding agents

This repository's instructions are in `CLAUDE.md`, written for Claude Code; they apply to every agent in full. Read it before doing anything else. A line in it that starts with `@` (such as `@.infra/CONVENTIONS.md`) is an import: Claude Code loads that file automatically, and any other agent must open and read it too, as part of the instructions. Read `HANDOFF.md`, where there is one, for what is in flight.
