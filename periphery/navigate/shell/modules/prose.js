// Role: the prose modules (Prompt 17). The judges document, rendered from its canonical source in
//   docs/what-stands-without-trust.md (inlined at #judges-doc, not copied), section by section as prose
//   modules. Where the paper speaks about a case, the phrase is marked as a claim-reference that
//   links to the live graph node and carries that node's grounding and robustness; the case it names
//   links back (the reverse link the shell adds). One framing module precedes the paper.
// Contract: registers on window.EpiShell. A section becomes a module; a claim-reference is made with
//   ctx.linkToNode(nodeKey, phrase), which the shell resolves to the live node reading.
// Invariant: periphery; no grounding logic. A claim-reference's grade badge comes from an api read
//   the shell performs, never from text here. The canonical markdown is rendered, never edited.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  // where the paper names a case, link the phrase to the case's focus node (its stable id / key).
  var PHRASES = [
    { phrase: "On LHC safety", key: "lhc.antecedent" },
    { phrase: "The LHC case", key: "lhc.antecedent" },
    { phrase: "On COVID origins", key: "covid.instance" },
    { phrase: "On eggs", key: "eggs.instance" },
  ];

  // -- the framing module --
  window.EpiShell.register({
    id: "prose-frame", title: "How to read this surface", kind: "prose", order: 0,
    render: function (ctx) {
      var p = document.createElement("p"); p.className = "shell-lede";
      p.textContent = "One navigable surface. The paper below is rendered from its canonical source; the three cases and the live demonstrations follow. Where the paper names a case, the phrase links into the graph and carries that node's live grade and robustness, and the case links back to the paragraph. Every reading is read from the graph through the propose/read contract, so this surface reflects the real state rather than describing it.";
      ctx.mount.appendChild(p);
    },
  });

  // -- render one inline run: escape, apply **bold** and *italic*, append into el --
  function appendInline(el, text) {
    var span = document.createElement("span");
    span.innerHTML = esc(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    while (span.firstChild) el.appendChild(span.firstChild);
  }

  // -- render one paragraph, splicing in claim-reference links at their phrases --
  function renderParagraph(text, ctx) {
    var p = document.createElement("p");
    var hits = [];
    PHRASES.forEach(function (ph) { var i = text.indexOf(ph.phrase); if (i >= 0) hits.push({ i: i, len: ph.phrase.length, phrase: ph.phrase, key: ph.key }); });
    hits.sort(function (a, b) { return a.i - b.i; });
    var cursor = 0, kept = [];
    hits.forEach(function (h) { if (h.i >= cursor) { kept.push(h); cursor = h.i + h.len; } }); // no overlaps
    var pos = 0;
    kept.forEach(function (h) {
      if (h.i > pos) appendInline(p, text.slice(pos, h.i));
      p.appendChild(ctx.linkToNode(h.key, h.phrase, ctx.moduleId, ctx.moduleTitle));
      pos = h.i + h.len;
    });
    if (pos < text.length) appendInline(p, text.slice(pos));
    return p;
  }

  // -- render a markdown section body (blocks separated by blank lines) --
  function renderSection(mdBody, ctx) {
    mdBody.split(/\n{2,}/).forEach(function (block) {
      block = block.trim(); if (!block) return;
      if (/^---+$/.test(block)) { ctx.mount.appendChild(document.createElement("hr")); return; }
      var m = block.match(/^(#{1,4})\s+(.*)$/);
      if (m) { var h = document.createElement("h" + Math.min(4, m[1].length + 1)); h.textContent = m[2]; ctx.mount.appendChild(h); return; }
      ctx.mount.appendChild(renderParagraph(block.replace(/\n/g, " "), ctx));
    });
  }

  // -- read the canonical markdown, split into ## sections, register a prose module per section --
  var src = document.getElementById("judges-doc");
  if (!src) return;
  var md = src.textContent;
  var parts = md.split(/\n(?=##\s)/); // the preamble, then each "## ..." section
  parts.forEach(function (part, idx) {
    var headMatch = part.match(/^##\s+(.*)$/m);
    var title = idx === 0 ? "What Stands Without Trust" : (headMatch ? headMatch[1] : "Section " + idx);
    // for a "## " section, drop the heading line from the body (the shell shows module.title).
    var body = idx === 0 ? part : part.replace(/^##\s+.*(\n|$)/, "");
    window.EpiShell.register({
      id: "paper-" + idx, title: title, kind: "prose", order: 1 + idx,
      render: function (ctx) { ctx.mount.classList.add("shell-prose"); renderSection(body, ctx); },
    });
  });
})();
