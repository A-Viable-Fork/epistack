#!/usr/bin/env node
// Role: PostToolUse formatter hook. Normalizes a just-edited text file.
// Contract: reads the hook JSON on stdin, formats tool_input.file_path in place.
// Invariant: dependency-free and non-failing; it never blocks a tool call. It only
//   strips trailing whitespace and guarantees a single final newline, so it cannot
//   change program behavior, only noise. A real formatter (prettier) can replace this
//   when one is added to the toolchain.
import { readFileSync, writeFileSync } from "node:fs";

const TEXT = /\.(js|mjs|cjs|json|css|md|html|py|yml|yaml)$/;

function main() {
  let raw = "";
  try {
    raw = readFileSync(0, "utf8");
  } catch {
    return;
  }
  let path;
  try {
    path = JSON.parse(raw)?.tool_input?.file_path;
  } catch {
    return;
  }
  if (!path || !TEXT.test(path)) return;
  let src;
  try {
    src = readFileSync(path, "utf8");
  } catch {
    return;
  }
  const out =
    src
      .split("\n")
      .map((l) => l.replace(/[ \t]+$/g, ""))
      .join("\n")
      .replace(/\n*$/g, "") + "\n";
  if (out !== src) {
    try {
      writeFileSync(path, out);
    } catch {
      /* never fail the tool call */
    }
  }
}

main();
