#!/usr/bin/env node
// Role: scaffold a new thin client. Emits clients/<name>.json pre-filled with the default
//   mapping and tokens, ready to edit. A new client starts from a working copy, not a blank file.
// Contract: `node build/new-client.mjs <name>`. Writes clients/<name>.json (refuses to clobber).
//   No engine, API, or view code is touched; a thin client is one manifest.
// Invariant: the emitted manifest covers every node kind and names only palette entries, so it
//   is valid the moment it is written; the author edits tokens (a reskin) or a mapping entry (a
//   re-present) and rebuilds. See docs/thin-clients.md.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const name = (process.argv[2] || "").trim().replace(/[^a-z0-9-]/gi, "");
if (!name) {
  console.error("usage: node build/new-client.mjs <name>   (letters, digits, hyphens)");
  process.exit(1);
}
const out = resolve(ROOT, "clients", name + ".json");
if (existsSync(out)) {
  console.error("clients/" + name + ".json already exists; pick another name or edit it.");
  process.exit(1);
}

// start from the default thin client (clients/plain.json) so the copy renders immediately.
const base = JSON.parse(readFileSync(resolve(ROOT, "clients", "plain.json"), "utf8"));
const manifest = {
  id: "client." + name,
  kind: "client",
  tier: "thin",
  title: name.charAt(0).toUpperCase() + name.slice(1) + " reader",
  tokens: base.tokens,
  mapping: base.mapping,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(manifest, null, 2) + "\n");
console.log("wrote clients/" + name + ".json (a thin client; edit tokens or a mapping entry, then run node build/bundle.js)");
console.log("preview it at v1.html#client=" + name);
