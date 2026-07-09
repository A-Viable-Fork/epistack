// Role: the prose modules (Prompt 17; register view Prompt: register view, phase C). The judges
//   document rendered in either register over the same grounded claims. The precise register is the
//   canonical markdown (docs/what-stands-without-trust.md, inlined at #judges-doc, not copied); the
//   accessible register is corpora/registers/judges-accessible.js (window.EpiRegisters). A toggle
//   switches register for the reading and defaults to accessible. Where the paper names a case, the
//   phrase is a claim-reference that links to the live node and carries that node's grade and
//   robustness; the SAME node links render under both registers, so grounding is invariant across them.
// Contract: registers on window.EpiShell. A section becomes a module rendering both registers; a
//   claim-reference is made with ctx.linkToNode(nodeKey, phrase), which the shell resolves live.
// Invariant: periphery; no grounding logic. A claim-reference's grade comes from an api read the shell
//   performs, never from text here. The canonical markdown is rendered, never edited; the accessible
//   register is read from data, never authored here. Grounding under both registers is the demonstration.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }

  // where the paper names a case in the precise register, link the phrase to the case's focus node.
  var PHRASES = [
    { phrase: "On LHC safety", key: "lhc.antecedent" },
    { phrase: "The LHC case", key: "lhc.antecedent" },
    { phrase: "On COVID origins", key: "covid.instance" },
    { phrase: "On eggs", key: "eggs.instance" },
  ];

  var REG = (window.EpiRegisters && window.EpiRegisters.judgesAccessible) || null;

  // -- the framing module: how to read, plus the register toggle --
  window.EpiShell.register({
    id: "prose-frame", title: "How to read this surface", kind: "prose", order: 0,
    render: function (ctx) {
      var p = document.createElement("p"); p.className = "shell-lede";
      var orient = "Two ways in. Read the argument below and click any claim to land on its live grounding, the grade it earns and where it can fail, read from the graph rather than asserted in the text; and verify the protocol at the command line, where each oracle states the invariant it checked. ";
      p.textContent = orient + (REG
        ? "One navigable surface, in two registers over the same grounded claims. The paper below defaults to the accessible register, a plainer reading; the toggle switches any section to the precise register, the canonical argument. Where a section simplifies it says so, in a delta note, and links to its precise counterpart. Where the paper names a case, the phrase links into the graph and carries that node's live grade and robustness, and it does so under both registers, because grounding is a property of the claim and not of how it is read. Every reading is read from the graph through the propose/read contract."
        : "One navigable surface. The paper below is rendered from its canonical source; the three cases and the live demonstrations follow. Where the paper names a case, the phrase links into the graph and carries that node's live grade and robustness. Every reading is read from the graph through the propose/read contract.");
      ctx.mount.appendChild(p);
      if (REG) {
        var bar = document.createElement("div"); bar.className = "reg-toggle-bar";
        var label = document.createElement("span"); label.className = "reg-toggle-label"; label.textContent = "Register:";
        var acc = mkToggle("Accessible", true), pre = mkToggle("Precise", false);
        function set(precise) {
          var content = document.getElementById("shell-content");
          if (content) content.classList.toggle("reg-precise", precise);
          acc.setAttribute("aria-pressed", String(!precise)); pre.setAttribute("aria-pressed", String(precise));
          acc.classList.toggle("reg-on", !precise); pre.classList.toggle("reg-on", precise);
        }
        acc.addEventListener("click", function () { set(false); });
        pre.addEventListener("click", function () { set(true); });
        bar.appendChild(label); bar.appendChild(acc); bar.appendChild(pre);
        ctx.mount.appendChild(bar);
        set(false); // default accessible
      }
    },
  });

  function mkToggle(text, on) {
    var b = document.createElement("button"); b.type = "button"; b.className = "reg-toggle" + (on ? " reg-on" : "");
    b.textContent = text; b.setAttribute("aria-pressed", String(on)); return b;
  }

  // -- render one inline run: escape, apply **bold** and *italic*, append into el --
  function appendInline(el, text) {
    var span = document.createElement("span");
    span.innerHTML = esc(text).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    while (span.firstChild) el.appendChild(span.firstChild);
  }

  // -- render one paragraph, splicing in claim-reference links at the given phrase table --
  function renderParagraph(text, ctx, phrases) {
    var p = document.createElement("p");
    var hits = [];
    phrases.forEach(function (ph) { var i = text.indexOf(ph.phrase); if (i >= 0) hits.push({ i: i, len: ph.phrase.length, phrase: ph.phrase, key: ph.key }); });
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

  // -- render a markdown/plain section body (blocks separated by blank lines) into el --
  function renderBody(el, mdBody, ctx, phrases) {
    mdBody.split(/\n{2,}/).forEach(function (block) {
      block = block.trim(); if (!block) return;
      if (/^---+$/.test(block)) { el.appendChild(document.createElement("hr")); return; }
      var m = block.match(/^(#{1,4})\s+(.*)$/);
      if (m) { var h = document.createElement("h" + Math.min(4, m[1].length + 1)); h.textContent = m[2]; el.appendChild(h); return; }
      el.appendChild(renderParagraph(block.replace(/\n/g, " "), ctx, phrases));
    });
  }

  // -- the grounding strip: the section's node links, rendered live under BOTH registers --
  function groundingStrip(rec, ctx) {
    if (!rec.node_links || !rec.node_links.length) return null;
    var wrap = document.createElement("div"); wrap.className = "reg-grounding";
    var lab = document.createElement("span"); lab.className = "reg-grounding-label"; lab.textContent = "Grounded here: ";
    wrap.appendChild(lab);
    rec.node_links.forEach(function (nl, i) {
      if (i) wrap.appendChild(document.createTextNode("  "));
      wrap.appendChild(ctx.linkToNode(nl.node_key, nl.phrase, ctx.moduleId, ctx.moduleTitle));
    });
    return wrap;
  }

  // -- the delta note and the register links under an accessible reading --
  function metaFor(rec, otherLabel) {
    var meta = document.createElement("div"); meta.className = "reg-meta";
    if (rec.delta) {
      var d = document.createElement("p"); d.className = "reg-delta";
      var k = document.createElement("span"); k.className = "reg-delta-key"; k.textContent = "What this plainer reading sets aside: ";
      d.appendChild(k); d.appendChild(document.createTextNode(rec.delta)); meta.appendChild(d);
    }
    if (rec.source_links && rec.source_links.length) {
      var s = document.createElement("p"); s.className = "reg-sources";
      s.appendChild(document.createTextNode("Derives from: "));
      rec.source_links.forEach(function (src, i) {
        if (i) s.appendChild(document.createTextNode(", "));
        var code = document.createElement("code"); code.textContent = src; s.appendChild(code);
      });
      meta.appendChild(s);
    }
    return meta;
  }

  // -- read the canonical markdown, split into the preamble + "## " sections --
  var src = document.getElementById("judges-doc");
  if (!src) return;
  var md = src.textContent;
  md = md.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, ""); // strip the header front-matter: metadata, not prose
  var parts = md.split(/\n(?=##\s)/); // the preamble, then each "## ..." section

  parts.forEach(function (part, idx) {
    var headMatch = part.match(/^##\s+(.*)$/m);
    var title = idx === 0 ? "What Stands Without Trust" : (headMatch ? headMatch[1] : "Section " + idx);
    // for a "## " section, drop the heading line from the body (the shell shows module.title).
    var preciseBody = idx === 0 ? part : part.replace(/^##\s+.*(\n|$)/, "");
    var rec = REG ? REG[idx] : null;

    window.EpiShell.register({
      id: "paper-" + idx, title: title, kind: "prose", order: 1 + idx,
      render: function (ctx) {
        ctx.mount.classList.add("shell-prose");
        if (!rec) { renderBody(ctx.mount, preciseBody, ctx, PHRASES); return; }

        // accessible register (default shown)
        var accWrap = document.createElement("div"); accWrap.className = "register register-accessible";
        renderBody(accWrap, rec.accessible, ctx, rec.node_links.map(function (n) { return { phrase: n.phrase, key: n.node_key }; }));
        var accMeta = metaFor(rec); if (accMeta.childNodes.length) accWrap.appendChild(accMeta);
        var accGround = groundingStrip(rec, ctx); if (accGround) accWrap.appendChild(accGround);
        var accTag = document.createElement("p"); accTag.className = "reg-tag";
        accTag.textContent = "Accessible register. The precise argument is one toggle up, grounded on the same nodes.";
        accWrap.appendChild(accTag);
        ctx.mount.appendChild(accWrap);

        // precise register (shown when #shell-content carries .reg-precise)
        var preWrap = document.createElement("div"); preWrap.className = "register register-precise";
        renderBody(preWrap, preciseBody, ctx, PHRASES);
        var preGround = groundingStrip(rec, ctx); if (preGround) preWrap.appendChild(preGround);
        ctx.mount.appendChild(preWrap);
      },
    });
  });
})();
