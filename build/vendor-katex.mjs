#!/usr/bin/env node
// Role: vendor KaTeX into the repo so the deliverable opens from file:// with no network
//   (design axiom T0-6; v2 hard constraint "no CDN survives into the build").
// Contract: reads node_modules/katex/dist (from `npm install katex`), writes
//   vendor/katex/katex.min.js (verbatim) and vendor/katex/katex.inline.css (the stylesheet
//   with every woff2 font embedded as a data: URI, woff/ttf fallbacks dropped).
// Invariant: the build inlines these two files; nothing is fetched at runtime. woff2 covers
//   every browser that can open the artifact, so dropping the older formats is safe.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DIST = resolve(ROOT, "node_modules", "katex", "dist");
const OUT = resolve(ROOT, "vendor", "katex");

if (!existsSync(DIST)) {
  console.error("KaTeX not found at " + DIST + " — run: npm install katex@0.16.9");
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

// 1. the JS, verbatim. Guard the standalone invariant: it must not contain a raw </script>.
const js = readFileSync(resolve(DIST, "katex.min.js"), "utf8");
if (/<\/script>/i.test(js)) {
  console.error("katex.min.js contains a literal </script>; the bundle would need to escape it.");
  process.exit(1);
}
writeFileSync(resolve(OUT, "katex.min.js"), js);

// 2. the CSS, with woff2 fonts inlined as data: URIs and woff/ttf fallbacks removed.
let css = readFileSync(resolve(DIST, "katex.min.css"), "utf8");
const fontCache = new Map();
function dataUri(file) {
  if (fontCache.has(file)) return fontCache.get(file);
  const buf = readFileSync(resolve(DIST, "fonts", file));
  const uri = "data:font/woff2;base64," + buf.toString("base64");
  fontCache.set(file, uri);
  return uri;
}
// rewrite each `src: ...;` to a single woff2 data URI
css = css.replace(/src:[^;]*;/g, (srcDecl) => {
  const m = srcDecl.match(/url\(fonts\/([A-Za-z0-9_\-]+\.woff2)\)/);
  if (!m) return srcDecl; // leave anything without a woff2 (there should be none)
  return `src:url(${dataUri(m[1])}) format("woff2");`;
});
writeFileSync(resolve(OUT, "katex.inline.css"), css);

console.log("vendored KaTeX:");
console.log("  vendor/katex/katex.min.js   " + (js.length / 1024).toFixed(0) + " KB");
console.log("  vendor/katex/katex.inline.css " + (css.length / 1024).toFixed(0) + " KB (" + fontCache.size + " woff2 fonts inlined)");
