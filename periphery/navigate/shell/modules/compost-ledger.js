// Role: the compost ledger as a reading exhibit, a fork off the spine after the vision capstone. It is
//   the research record: the approaches taken seriously while building EpiStack and then killed for a
//   characterized reason, each with its kill and its reactivation condition, so a judge can audit the
//   kills rather than take the finished structure on trust. The canonical source is docs/compost-ledger.md,
//   inlined at #compost-doc and rendered here, never copied or edited.
// Contract: registers on window.EpiShell as a closing prose section (order 501, after the vision at 500),
//   not marked spine: it is depth, the audit trail, not the essential read. Reads the embedded #compost-doc.
// Invariant: periphery; it renders the doc and asserts nothing of its own. Each kill is shown plainly with
//   its reactivation, because the credibility of every surviving claim rests on the honesty of every kill.
(function () {
  "use strict";
  if (typeof window === "undefined" || !window.EpiShell) return;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); }
  var el = typeof document !== "undefined" && document.getElementById("compost-doc");
  if (!el) return;
  var MD = (el.textContent || "").replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n/, ""); // strip front-matter

  function inline(text) {
    return esc(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  window.EpiShell.register({
    id: "compost-ledger", title: "The compost: what the finished structure survived", kind: "prose", order: 501,
    render: function (ctx) {
      var html = '<p class="shell-lede">This is the research record, the killed approaches with their kill-reasons, offered so you can evaluate the submission the way it evaluates knowledge: subtract trust in the author and audit what survived. It is a fork off the spine, not part of the essential read.</p>';
      var count = 0;
      MD.split(/\n{2,}/).forEach(function (block) {
        block = block.trim();
        if (!block || block === "---") return;
        if (/^#\s+/.test(block)) return; // the doc's H1 duplicates the section title
        var lines = block.split(/\n/);
        if (/^\*\*[0-9]+\./.test(lines[0])) {
          // an entry: bold title, the approach-and-kill, then the reactivation line.
          count++;
          html += '<div class="compost-entry">';
          html += '<div class="compost-title">' + inline(lines[0]) + "</div>";
          var body = [], react = "";
          lines.slice(1).forEach(function (l) { if (/^Reactivation:/.test(l.trim())) react = l.trim(); else body.push(l); });
          if (body.length) html += "<p class=\"compost-body\">" + inline(body.join(" ")) + "</p>";
          if (react) html += '<div class="compost-react">' + inline(react) + "</div>";
          html += "</div>";
        } else {
          html += "<p>" + inline(block.replace(/\n/g, " ")) + "</p>";
        }
      });
      ctx.mount.innerHTML = html;
      ctx.mount.setAttribute("data-entry-count", String(count));
    },
  });
})();
