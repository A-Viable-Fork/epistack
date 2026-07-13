// Role: the front door (Prompt 40). Renders docs/the-climb-of-synthesis.md, the easy-register overview,
//   as the opening section of the surface, before the guided path, so a first reader lands on the two-page
//   distillation. The canonical source is the markdown doc, vendored to vendor/front-door/front-door.md by
//   build/vendor-front-door.mjs and inlined at #front-door-doc; this module renders it and asserts nothing.
// Contract: registers on window.EpiShell as the opening prose section (order -1, spine). Reads the embedded
//   #front-door-doc markdown and renders it, realizing the Go-deeper pointers as live links: in-surface
//   where the target is a module here, the repo path where it is not.
// Invariant: periphery; it computes no grounding and touches no truth field. It is prose and links only,
//   so it needs no contract read. Where a pointer resolves in-surface it navigates within the page; where
//   it does not it opens the repo path. No dead links.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("front-door-doc");
  if (!el) return;
  var MD = el.textContent || "";
  MD = MD.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, ""); // strip front-matter if the vendored copy carries it

  // resolve a doc-relative href to where it lives on this surface: an in-page module anchor where the
  // target is a module here, else the repo path from submission.html at the tree root.
  var TARGET = {
    "what-stands-without-trust.md": "#mod-paper-0",   // the judges document, the prose (register) module
    "protocol-spec.md": "docs/protocol-spec.md",      // the extractable spec, at its repo path
    "../submission.html": "#mod-guided-path",         // the walk, staged in-surface
    "vision-and-continuation.md": "#mod-vision-capstone", // the vision, in-surface as the capstone
    "on-transparency.md": "docs/on-transparency.md",
    "workflow-atlas.md": "docs/workflow-atlas.md",
    "kernel-taxonomy.md": "docs/kernel-taxonomy.md",
    "status-ledger.md": "docs/status-ledger.md",
    "compost-ledger.md": "docs/compost-ledger.md",
    "quickstart.md": "docs/quickstart.md",
  };
  function resolve(href) { return Object.prototype.hasOwnProperty.call(TARGET, href) ? TARGET[href] : href; }

  // one inline run: escape, then splice in [text](href) links, then bold/italic/code. Link text here is
  // plain, so escaping the whole string first is safe; the mapped href carries no markdown metacharacters.
  function inline(text) {
    return esc(text)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_m, label, href) {
        return '<a href="' + esc(resolve(href)) + '">' + label + "</a>";
      })
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  window.EpiShell.register({
    id: "front-door", title: "The Climb of Synthesis", kind: "prose", order: -1, spine: true,
    render: function (ctx) {
      ctx.mount.classList.add("shell-prose");
      var html = "";
      MD.split(/\n{2,}/).forEach(function (block) {
        block = block.trim();
        if (!block) return;
        if (/^#\s+/.test(block)) return; // the doc H1 duplicates the section title; skip it
        if (/^###\s+/.test(block)) { html += "<h4>" + inline(block.replace(/^###\s+/, "")) + "</h4>"; return; }
        if (/^##\s+/.test(block)) { html += "<h3>" + inline(block.replace(/^##\s+/, "")) + "</h3>"; return; }
        if (/^[-*]\s+/.test(block)) {
          html += "<ul class=\"front-door-list\">" + block.split(/\n/).map(function (li) {
            return "<li>" + inline(li.replace(/^[-*]\s+/, "")) + "</li>";
          }).join("") + "</ul>";
          return;
        }
        html += "<p>" + inline(block.replace(/\n/g, " ")) + "</p>";
      });
      // reading-order handoff: after the critique, before the protocol demonstration, route to the
      // governing openness argument. A pointer, not the document's text.
      html += '<p class="front-door-next">Read next, before the protocol demonstration: <a href="docs/on-transparency.md">On Transparency</a>, why this submission takes an open form.</p>';
      ctx.mount.innerHTML = html;
    },
  });
})();
