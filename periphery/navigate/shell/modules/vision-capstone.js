// Role: the reading's capstone, the vision document rendered as the terminal section so the scroll ends
//   where the work is going. It closes the spine: the argument, the cases, the lineage exhibit, operating
//   the kernels, the on-ramp to make your own, and then the destination. The canonical source is
//   docs/vision-and-continuation.md, inlined at #vision-doc and rendered here, never copied or edited.
// Contract: registers on window.EpiShell as a closing prose section (order 500). Reads the embedded
//   #vision-doc markdown and renders it with a light markdown pass (headings, paragraphs, lists, bold).
// Invariant: periphery; it renders the doc and asserts nothing of its own. The register is the doc's:
//   what is real is marked real and what is specified is marked specified, unchanged from the source.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("vision-doc");
  if (!el) return;
  var MD = el.textContent || "";
  // strip the front-matter header (between the first pair of --- lines).
  MD = MD.replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, "");

  function inline(text) {
    return esc(text)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1") // a doc link renders as its text; targets are other files
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  window.EpiShell.register({
    id: "vision-capstone", title: "Where this goes", kind: "prose", order: 500,
    render: function (ctx) {
      var html = "", listOpen = false;
      MD.split(/\n{2,}/).forEach(function (block) {
        block = block.trim();
        if (!block) return;
        if (/^#\s+/.test(block)) return; // the doc's H1 duplicates the section title; skip it
        if (/^###\s+/.test(block)) { if (listOpen) { html += "</ul>"; listOpen = false; } html += "<h4>" + inline(block.replace(/^###\s+/, "")) + "</h4>"; return; }
        if (/^##\s+/.test(block)) { if (listOpen) { html += "</ul>"; listOpen = false; } html += "<h3>" + inline(block.replace(/^##\s+/, "")) + "</h3>"; return; }
        if (/^[-*]\s+/.test(block)) {
          html += "<ul class=\"eggs-claims\">" + block.split(/\n/).map(function (li) { return "<li>" + inline(li.replace(/^[-*]\s+/, "")) + "</li>"; }).join("") + "</ul>";
          return;
        }
        html += "<p>" + inline(block.replace(/\n/g, " ")) + "</p>";
      });
      if (listOpen) html += "</ul>";
      ctx.mount.innerHTML = html;
    },
  });
})();
