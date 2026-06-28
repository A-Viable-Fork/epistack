// Role: the single-page artifact. Renders graph nodes, the paper/overview/spec
//   views, the vocabulary register UI, the fork-this cell, and routing.
// Contract: reads data/graph.json (DOM block #kg-graph), data/registers.js,
//   and the engine helpers (promotionFor, exportYaml). Owns DOM, not data.
// Invariant: behavior-preserving migration of knowledge-game.html's main script.
//   DEPARTURE: the data graph is still loaded from a DOM <script> block; threading
//   it as an imported value is the schema-migration step (see docs/sorry-ledger.md G-C).
// Graph is parsed from the embedded canonical block (script#kg-graph),
// which is byte-identical to graph.json. The render code is a consumer
// of the data, not its container. See contract.md.
const KG = JSON.parse(document.getElementById('kg-graph').textContent);
const ONTOLOGY = KG.ontology;
const GRAPH = KG.graph;

const $ = (s,r=document)=>r.querySelector(s);
const el = (t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e;};
let mode = "reader";

/* ---- terminal badge ---- */
function badge(termKey){
  if(!termKey) return "";
  const t = ONTOLOGY[termKey]; if(!t) return "";
  const b = el("span","chip-badge");
  b.style.background = t.color;
  b.innerHTML = '<span class="bdot"></span>'+t.label;
  return b.outerHTML;
}

/* ---- entrance intro animation, then the parse ---- */
function runEntrance(){
  const words = ["Should","I","eat","eggs"];
  const q = $("#question");
  q.innerHTML = words.map((w,i)=>`<span class="w" data-i="${i}">${w}</span>`).join(" ")
              + ' <span class="w punct">?</span>';
  const spans = [...q.querySelectorAll('.w[data-i]')];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function reveal(){
    $("#parse").hidden=false; $("#paperlink").hidden=false;
    spans.forEach(s=>s.classList.remove("dim"));
    buildParse(); buildPaperDoor();
  }
  function showHmm(){
    const h=$("#hmm"); h.hidden=false;
    requestAnimationFrame(()=>h.classList.add("in"));
    setTimeout(reveal, 780);
  }
  if(reduce){
    const h=$("#hmm"); h.hidden=false; h.classList.add("in");
    spans.forEach(s=>s.classList.remove("dim"));
    reveal(); return;
  }

  let i=0;
  spans.forEach(s=>s.classList.add("dim"));
  const iv = setInterval(()=>{
    spans.forEach(s=>s.classList.add("dim"));
    if(spans[i]) spans[i].classList.remove("dim");
    i++;
    if(i>spans.length){ clearInterval(iv); setTimeout(showHmm,300); }
  },520);
}

/* ---- the paper door. word spans kept so terminal typing / node links can be added later ---- */
function buildPaperDoor(){
  const pq = $("#paperq"); if(!pq) return;
  const words = ["Or","should","I","read","the","paper"];
  pq.innerHTML = words.map(w=>`<span class="pw">${w}</span>`).join(" ")
               + '<span class="pw punct">?</span>';
}

function buildParse(){
  const p = $("#parse"); p.innerHTML="";
  GRAPH.entrance.tokens.forEach(tok=>{
    const t = el("button", "token"+(tok.meta?" is-meta":""));
    t.setAttribute("aria-label","Open "+tok.word);
    const term = tok.terminal ? ONTOLOGY[tok.terminal] : null;
    const dot = term ? `<span class="dot" style="background:${term.color}"></span>` : `<span class="dot" style="background:var(--faint)"></span>`;
    let metaTxt;
    if(tok.meta) metaTxt = "two blocks";
    else if(tok.forksTwo) metaTxt = "forks to two";
    else if(term && term.pending) metaTxt = "type pending";
    else if(term) metaTxt = term.label;
    else metaTxt = "";
    t.innerHTML = `<span class="tok-word">${tok.word}</span><span class="tok-meta">${dot}${metaTxt}</span>`;
    t.addEventListener("click",()=>openNode(tok.to));
    p.appendChild(t);
  });
}

function buildLegend(){
  const g = $("#legend-grid"); g.innerHTML="";
  Object.keys(ONTOLOGY).forEach(k=>{
    const t = ONTOLOGY[k];
    if(t.reserved || t.pending) return;
    const row = el("div","leg");
    row.innerHTML = badge(k) + `<div class="leg-txt"><b>${t.label}</b> &nbsp;${t.closure} &nbsp;<span style="color:var(--faint)">Exemplar: ${t.exemplar}.</span></div>`;
    g.appendChild(row);
  });
}

let REGISTER = "plain";

function wrapTerms(root){
  if(!root) return;
  const entries=[];
  Object.keys(AUTOWRAP).forEach(id=>AUTOWRAP[id].forEach(p=>entries.push([p,id])));
  entries.sort((a,b)=>b[0].length-a[0].length);
  const idOf={}; entries.forEach(([p,id])=>idOf[p.toLowerCase()]=id);
  const alt=entries.map(e=>e[0].replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|");
  let re; try{ re=new RegExp("(?<![A-Za-z])("+alt+")(?![A-Za-z])","gi"); }
  catch(_){ re=new RegExp("\\b("+alt+")\\b","gi"); }
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
    acceptNode(n){
      if(!n.nodeValue||!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let p=n.parentNode;
      while(p&&p!==root){
        if(p.nodeType===1){
          const tag=p.tagName;
          if((p.classList&&p.classList.contains("term"))||tag==="A"||tag==="BUTTON"||tag==="H1"||tag==="H2"||tag==="H3") return NodeFilter.FILTER_REJECT;
        }
        p=p.parentNode;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes=[]; let n; while(n=walker.nextNode()) nodes.push(n);
  nodes.forEach(node=>{
    const text=node.nodeValue; re.lastIndex=0;
    if(!re.test(text)) return; re.lastIndex=0;
    const frag=document.createDocumentFragment(); let last=0,m;
    while(m=re.exec(text)){
      const before=text.slice(last,m.index); if(before) frag.appendChild(document.createTextNode(before));
      const span=document.createElement("span");
      span.className="term";
      span.setAttribute("data-term",idOf[m[1].toLowerCase()]);
      span.setAttribute("data-orig",m[1]);
      span.textContent=m[1];
      frag.appendChild(span);
      last=m.index+m[1].length;
    }
    const after=text.slice(last); if(after) frag.appendChild(document.createTextNode(after));
    node.parentNode.replaceChild(frag,node);
  });
}

function applyRegister(r){
  REGISTER=r; document.body.setAttribute("data-register",r);
  document.querySelectorAll(".term[data-term]").forEach(s=>{
    const t=TERMS[s.getAttribute("data-term")]; if(!t) return;
    const orig=s.getAttribute("data-orig")||t.plain||s.textContent;
    s.textContent = (r==="plain") ? orig : (t[r]||orig);
    if(r==="plain") s.removeAttribute("title");
    else s.setAttribute("title",(t.literature||"")+": "+(t.delta||""));
  });
  document.querySelectorAll("#register button").forEach(b=>b.classList.toggle("on",b.getAttribute("data-reg")===r));
  const pop=$("#termpop"); if(pop) pop.classList.remove("show");
}

/* ---- routing ---- */
let ENTERED = false;
let SPEC_WRAPPED = false;
function ensureEntrance(){ if(!ENTERED){ ENTERED=true; runEntrance(); } }
function hideViews(){
  $("#nodeview").classList.remove("active");
  $("#paperview").classList.remove("active");
  $("#overviewview").classList.remove("active");
  $("#specview").classList.remove("active");
  $("#intro").classList.remove("active");
}
function showIntro(){
  hideViews();
  $("#entrance").style.display="none";
  $("#intro").classList.add("active");
  $("#register").classList.remove("show");
  history.replaceState({},"","#");
  window.scrollTo({top:0});
}
function enterQuestion(){
  hideViews();
  $("#entrance").style.display="flex";
  $("#register").classList.remove("show");
  ensureEntrance();
  history.replaceState({},"","#question");
  window.scrollTo({top:0});
}
function openNode(id){
  const node = GRAPH[id]; if(!node) return;
  window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});
  hideViews();
  $("#entrance").style.display="none";
  $("#nodeview").classList.add("active");
  renderNode(id,node);
  wrapTerms($("#nodebody")); applyRegister(REGISTER);
  $("#register").classList.add("show");
  history.replaceState({id},"","#"+id);
}
function openPaper(){
  window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});
  hideViews();
  $("#entrance").style.display="none";
  $("#paperview").classList.add("active");
  $("#register").classList.add("show");
  history.replaceState({paper:1},"","#paper");
}
function openSpec(){
  window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});
  hideViews();
  $("#entrance").style.display="none";
  $("#specview").classList.add("active");
  if(!SPEC_WRAPPED){ wrapTerms($("#specview .paper")); SPEC_WRAPPED=true; }
  applyRegister(REGISTER);
  $("#register").classList.add("show");
  history.replaceState({spec:1},"","#spec");
}
function openOverview(){
  window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});
  hideViews();
  $("#entrance").style.display="none";
  $("#overviewview").classList.add("active");
  $("#register").classList.remove("show");
  history.replaceState({overview:1},"","#overview");
}
function backToEntrance(){
  hideViews();
  ensureEntrance();
  $("#entrance").style.display="flex";
  $("#register").classList.remove("show");
  history.replaceState({},"","#question");
  window.scrollTo({top:0});
}

function renderNode(id,node){
  const c = $("#nodebody"); c.innerHTML="";

  // breadcrumb
  const crumb = el("div","crumb");
  crumb.innerHTML = `<a id="bk">Should I eat eggs?</a><span class="sep">/</span><span>${node.meta?"meta":(node.terminal?ONTOLOGY[node.terminal].label:"fork")}</span>`;
  c.appendChild(crumb);

  if(node.meta && node.blocks){ renderMeta(c,node); $("#bk").onclick=backToEntrance; return; }

  // head
  const head = el("div","node-head");
  const badges = el("div","node-badges");
  if(node.terminal) badges.innerHTML = badge(node.terminal);
  if(node.conjecture) badges.innerHTML += ' <span class="chip-badge" style="background:#9A6A2E"><span class="bdot"></span>conjecture</span>';
  if(node.loadBearing) badges.innerHTML += ' <span class="tag-load">load-bearing</span>';
  if(node.edgeMeta) badges.innerHTML += ` <span class="tag-setaside">edge: ${node.edgeMeta}</span>`;
  head.appendChild(el("h2","node-claim",node.claim));
  if(node.terminal||node.conjecture) head.appendChild(badges);
  c.appendChild(head);

  if(node.noVerdict){
    const vb = el("div","verdict-banner");
    vb.innerHTML = `<div class="vt"><span class="vk">no verdict</span>${node.noVerdict}</div>`;
    c.appendChild(vb);
  }

  if(node.conjecture){
    const cb = el("div","conj-banner");
    cb.innerHTML = `<div class="ct"><b>Labeled conjecture fork</b>You reached this by choosing to descend. Author-typed, no external source by construction. Reachable, load-bearing for nothing on the surface.</div>`;
    c.appendChild(cb);
  }

  if(node.closureNote){
    const cl = el("p","closure");
    cl.innerHTML = `<span class="lab">closure</span>${node.closureNote}`;
    c.appendChild(cl);
  }

  if(node.intro){ const pr=el("div","prose"); pr.appendChild(el("p",null,node.intro)); c.appendChild(pr); }

  if(node.completeness){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","The completeness test"));
    const pr=el("div","prose"); pr.appendChild(el("p",null,node.completeness)); c.appendChild(pr);
  }

  // verification vector (inspector)
  if(node.vector){
    c.appendChild(rule());
    const wrapv = el("div","ins");
    wrapv.appendChild(el("h3","h-mono","Verification vector"));
    wrapv.appendChild(vectorEl(node.vector));
    wrapv.appendChild(el("p","builtline",'The honest state is the vector, not a single stamp. Single-author: typing is author-verified, never de-facto verified.'));
    c.appendChild(wrapv);
  }

  // collapse demo (COVID root)
  if(node.collapseDemo){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","The spread collapses"));
    const tr = el("div","toggle-row");
    tr.innerHTML = `<button class="switch" id="collapse" aria-pressed="false"><span class="knob"></span>collapse to shared inputs</button><span class="toggle-note" id="collapse-note">Six analyses, roughly twenty orders of magnitude apart.</span>`;
    c.appendChild(tr);
    c.appendChild(collapseEl(node.collapseDemo));
    setTimeout(()=>wireCollapse(),0);
  }

  // crux: shared evidence, two readings, the priced discount
  if(node.sharedEvidence){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","The evidence both camps see"));
    const se = el("div","shared-ev");
    se.innerHTML = `<span class="lab">shared null</span><p>${node.sharedEvidence}</p>`;
    c.appendChild(se);
  }
  if(node.readings){
    const rd = el("div","readings");
    node.readings.forEach(r=>{
      const x = el("div","reading");
      x.innerHTML = `<span class="side">${r.side}</span><p>${r.text}</p>`;
      rd.appendChild(x);
    });
    c.appendChild(rd);
  }
  if(node.discount){
    const dc = el("div","discount"+(node.discount.asymmetric?" asym":""));
    dc.innerHTML = `<span class="lab">${node.discount.asymmetric?"the price, not a wash":"the price each side pays"}</span><p>${node.discount.text}</p>`;
    c.appendChild(dc);
  }

  // Layer 0 split
  if(node.splitNote){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","Split the diagnostic"));
    const a = el("div","split-block");
    a.innerHTML = `<span class="lab">capacity, prior-independent</span><p>${node.splitNote.capacity}</p>`;
    const b = el("div","split-block");
    b.innerHTML = `<span class="lab">distribution, prior-dependent</span><p>${node.splitNote.distribution}</p>`;
    c.appendChild(a); c.appendChild(b);
  }

  // null note (LHC)
  if(node.nullNote){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","The shared null"));
    const pr=el("div","prose"); pr.appendChild(el("p",null,node.nullNote)); c.appendChild(pr);
  }

  // branches (LHC exclusion tree) + assumption-removal toggle
  if(node.branches){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","The exclusion tree"));
    const tr = el("div","toggle-row");
    tr.innerHTML = `<button class="switch" id="assump" aria-pressed="false"><span class="knob"></span>remove theory-dependent assumptions</button><span class="toggle-note" id="assump-note">Showing all branches.</span>`;
    c.appendChild(tr);
    const holder = el("div"); holder.id="branches";
    node.branches.forEach(b=>holder.appendChild(branchEl(b)));
    c.appendChild(holder);
    setTimeout(()=>wireAssumption(),0);
  }

  // forks (Layer C)
  if(node.forks){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono",node.forksTwoLabel||"Where this goes"));
    const f = el("div","forks");
    node.forks.forEach(fk=>{
      const target = GRAPH[fk.to];
      const tterm = target && target.terminal ? target.terminal : (fk.conjecture?null:null);
      const btn = el("button","fork"+(fk.conjecture?" locked":""));
      const arrow = fk.conjecture? "lock" : "\u2192";
      let badgeHtml = "";
      if(fk.conjecture){ badgeHtml = '<span class="chip-badge" style="background:#9A6A2E"><span class="bdot"></span>conjecture</span>'; }
      else if(tterm){ badgeHtml = badge(tterm); }
      btn.innerHTML = `<span class="fork-l"><span class="fork-label">${fk.label}</span>`+
                      `<span class="fork-edge">edge: ${fk.edge}${fk.meta?` &nbsp;/&nbsp; <span class="fork-meta">${fk.meta}</span>`:""}</span>`+
                      `${badgeHtml?`<span style="margin-top:2px">${badgeHtml}</span>`:""}</span>`+
                      `<span class="fork-arrow">${arrow==="lock"?"&#128274;":arrow}</span>`;
      if(!fk.conjecture && target) btn.addEventListener("click",()=>openNode(fk.to));
      else if(fk.conjecture) btn.addEventListener("click",()=>openNode(fk.to)); // reachable, labeled
      f.appendChild(btn);
    });
    c.appendChild(f);
  }

  // lines of flight (eggs, the should channel)
  if(node.linesOfFlight){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","Departures off \u201Cshould\u201D"));
    const w = el("div","lof-wrap");
    node.linesOfFlight.forEach(l=>{
      const x = el("div","lof");
      x.innerHTML = `<div class="lof-head"><span class="lof-name">${l.name}</span><span class="lof-status">${l.status}</span></div><p>${l.text}</p>`;
      w.appendChild(x);
    });
    c.appendChild(w);
  }

  // leak note
  if(node.leak){
    const lk = el("p","builtline");
    lk.innerHTML = `<span class="ins">recursion: </span>${node.leak.text}`;
    c.appendChild(lk);
  }

  // source chips (Layer A)
  if(node.sources){
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono","Typed citations"));
    const ch = el("div","chips");
    node.sources.forEach(s=>ch.appendChild(srcEl(s)));
    c.appendChild(ch);
  }

  // external artifact link
  if(node.link){
    c.appendChild(rule());
    const a = el("a","extlink"); a.href=node.link.href; a.target="_blank"; a.rel="noopener";
    a.innerHTML = node.link.label+' <span class="ar">&#8599;</span>';
    c.appendChild(a);
  }

  // fork-this (runnable cell seed)
  if(node.allowFork){
    c.appendChild(rule());
    c.appendChild(forkBox(id));
  }

  if(node.built){
    const bl = el("p","builtline");
    bl.innerHTML = `<span class="ok">&#9679;</span> ${node.built}`;
    c.appendChild(bl);
  }

  $("#bk").onclick=backToEntrance;
}

function renderMeta(c,node){
  node.blocks.forEach(b=>{
    c.appendChild(rule());
    c.appendChild(el("h3","h-mono",b.h));
    const pr=el("div","prose"); pr.appendChild(el("p",null,b.t)); c.appendChild(pr);
  });
  // the terminal-types legend lives here now, one click off the bare entrance
  c.appendChild(rule());
  c.appendChild(el("h3","h-mono","The terminal types"));
  const g = el("div","legend-grid");
  Object.keys(ONTOLOGY).forEach(k=>{
    const t = ONTOLOGY[k];
    if(t.reserved || t.pending) return;
    const row = el("div","leg");
    row.innerHTML = badge(k) + `<div class="leg-txt"><b>${t.label}</b> &nbsp;${t.closure} &nbsp;<span style="color:var(--faint)">Exemplar: ${t.exemplar}.</span></div>`;
    g.appendChild(row);
  });
  c.appendChild(g);
}

function rule(){ return el("div","section-rule"); }

function vectorEl(v){
  const wrap = el("div","vector");
  const fills = {"unformalized":0,"unreviewed":0,"unvalidated":0,"validated-single":50,"expert-confirmed":50,"expert-disputed":50,"validated-multi":100,"compiled-multi":100};
  [["formal",v.formal],["engineering",v.engineering],["domainStandard",v.domainStandard]].forEach(([k,val])=>{
    const t = el("div","track");
    const pct = fills[val]!=null?fills[val]:0;
    t.innerHTML = `<span class="tname">${TRACK_LABELS[k]}</span>`+
                  `<span class="tbar"><i style="width:${pct}%"></i></span>`+
                  `<span class="tstat stat-${val}">${val}</span>`;
    wrap.appendChild(t);
  });
  return wrap;
}

function branchEl(b){
  const d = el("div","branch");
  d.dataset.setaside = b.setAside?"1":"0";
  const right = b.openResidual? '<span class="tag-open">open residual</span>' : (b.setAside?'<span class="tag-setaside">set aside</span>':"");
  d.innerHTML = `<div class="branch-top"><h4 class="branch-name">${b.name}${right}</h4><span>${badge(b.terminal)}</span></div>`+
                `<p class="branch-claim">${b.claim}</p>`+
                `<p class="branch-close"><b>closes:</b> ${b.close}</p>`;
  return d;
}

function wireAssumption(){
  const btn = $("#assump"); if(!btn) return;
  btn.addEventListener("click",()=>{
    const on = btn.getAttribute("aria-pressed")==="true";
    const next = !on;
    btn.setAttribute("aria-pressed", next?"true":"false");
    document.querySelectorAll('#branches .branch').forEach(br=>{
      if(br.dataset.setaside==="1") br.classList.toggle("set-aside-off", next);
    });
    $("#assump-note").textContent = next
      ? "Theory-dependent branches greyed. The conclusion holds without them."
      : "Showing all branches.";
  });
}

function collapseEl(d){
  const box = el("div","collapse-demo"); box.id="collapsebox";
  const chips = el("div","analysis-chips");
  d.analyses.forEach(a=>chips.appendChild(el("span","analysis-chip",a)));
  box.appendChild(chips);
  box.appendChild(el("p","spread-label","spread: ~20 orders of magnitude, presented as independent"));
  const ul = el("ul","shared-inputs");
  d.sharedInputs.forEach(s=>ul.appendChild(el("li",null,s)));
  box.appendChild(ul);
  return box;
}
function wireCollapse(){
  const btn = $("#collapse"); if(!btn) return;
  btn.addEventListener("click",()=>{
    const on = btn.getAttribute("aria-pressed")==="true";
    const next = !on;
    btn.setAttribute("aria-pressed", next?"true":"false");
    const box = $("#collapsebox"); if(box) box.classList.toggle("collapsed", next);
    $("#collapse-note").textContent = next
      ? "Not six independent reads. They reduce to a few shared inputs, conceded by both camps."
      : "Six analyses, roughly twenty orders of magnitude apart.";
  });
}

function srcEl(s){
  const d = el("div","src");
  const relClass = s.rel==="conflicts-with"?"src-rel conflict":"src-rel";
  const head = el("div","src-head");
  head.innerHTML = `<span class="${relClass}">${s.rel}</span>`+
                   `<span class="src-cite">${s.cite}<span class="id ins">${s.ident}</span></span>`+
                   `<span class="ins">${badge(s.resultTerminal)}</span>`+
                   `<span class="src-toggle">+</span>`;
  head.addEventListener("click",()=>d.classList.toggle("open"));
  d.appendChild(head);
  const body = el("div","src-body");
  let rows = "";
  rows += row("result", s.locator);
  rows += row("terminal", `<span class="mono">${s.resultTerminal}</span>`);
  rows += rowIns("tracks", `<span class="mono">formal: ${s.tracks.formal} &nbsp; eng: ${s.tracks.engineering} &nbsp; domain: ${s.tracks.domainStandard}</span>`);
  rows += rowIns("typing", `<span class="mono">${s.typing}${s.resolution?` &nbsp;/&nbsp; ${s.resolution}`:""}</span>`);
  if(s.note) rows += row("note", s.note);
  body.innerHTML = rows;
  d.appendChild(body);
  return d;
}
function row(k,v){ return `<div class="src-row"><span class="k">${k}</span><span class="v">${v}</span></div>`; }
function rowIns(k,v){ return `<div class="src-row ins"><span class="k">${k}</span><span class="v">${v}</span></div>`; }

/* ---- fork-this: the runnable cell. declare, type, source-trace, export ---- */
let userSeq = 0;
const userNodes = [];

function ontologyOptions(){
  return Object.keys(ONTOLOGY).filter(k=>!ONTOLOGY[k].reserved && !ONTOLOGY[k].pending)
    .map(k=>`<option value="${k}">${ONTOLOGY[k].label}</option>`).join("");
}

function forkBox(parentId){
  const box = el("div","addbox");
  const termOpts = ontologyOptions();
  const relOpts = ["concept","framework","infrastructure","illustration","anchor","conflicts-with"]
    .map(r=>`<option value="${r}">${r}</option>`).join("");
  box.innerHTML =
    `<h4>Fork this node &nbsp;<span class="run-tag">runnable</span></h4>`+
    `<p class="help">Declare a claim, type its terminal, and attach a typed citation. The typing rule is enforced here: a node needs a terminal, a citation needs a relation and a result terminal. The node renders at its honest status, declared and single-author, never verified. Then export the machine-readable edge, which is the join where another instance attaches. In-memory only.</p>`+
    `<div class="add-grid">`+
      `<div class="add-field add-wide"><label for="fc">claim</label><input id="fc" type="text" placeholder="State a claim that could be wrong about something specific"></div>`+
      `<div class="add-field"><label for="ft">terminal type</label><select id="ft">${termOpts}</select></div>`+
      `<div class="add-field"><label for="fr">citation relation</label><select id="fr">${relOpts}</select></div>`+
      `<div class="add-field add-wide"><label for="fs">source</label><input id="fs" type="text" placeholder="Author year, or leave blank to keep it author-typed"></div>`+
      `<div class="add-field"><label for="fi">identifier</label><input id="fi" type="text" placeholder="DOI or arXiv (optional)"></div>`+
      `<div class="add-field"><label for="frt">result terminal</label><select id="frt">${termOpts}</select></div>`+
      `<div class="add-field add-wide"><label for="fl">rests on (locator)</label><input id="fl" type="text" placeholder="The specific result and what it bottoms out in"></div>`+
    `</div>`+
    `<div class="add-actions">`+
      `<button class="addbtn" id="fadd">Add typed node</button>`+
      `<button class="addbtn ghost" id="fexport" disabled>Export edges (YAML)</button>`+
    `</div>`+
    `<div class="added" id="added"></div>`+
    `<pre class="exportbox" id="exportbox" hidden></pre>`;
  setTimeout(()=>wireFork(parentId),0);
  return box;
}

function wireFork(parentId){
  const add = $("#fadd"), exp = $("#fexport");
  add.addEventListener("click",()=>{
    const claim = $("#fc").value.trim();
    if(!claim){ $("#fc").focus(); return; }
    userSeq++;
    const n = {
      id:"U-"+userSeq, statement:claim, parent:parentId,
      terminal:$("#ft").value,
      rel:$("#fr").value,
      cite:$("#fs").value.trim(),
      ident:$("#fi").value.trim(),
      rterm:$("#frt").value,
      loc:$("#fl").value.trim()
    };
    n.hasSource = !!n.cite;
    userNodes.push(n);
    $("#added").appendChild(renderAddedCard(n));
    exp.disabled = false;
    $("#fc").value=""; $("#fs").value=""; $("#fi").value=""; $("#fl").value="";
    $("#fc").focus();
  });
  exp.addEventListener("click",()=>{
    const box = $("#exportbox");
    box.hidden = false;
    box.textContent = userNodes.map(exportYaml).join("\n");
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
  });
}

function renderAddedCard(n){
  const card = el("div","added-card");
  const esc = s => (s||"").replace(/</g,"&lt;");
  const src = n.hasSource
    ? `<div class="ac-src"><span class="sr">${n.rel}</span>${esc(n.cite)}`+
      `${n.ident?` <span style="color:var(--faint)">(${esc(n.ident)})</span>`:""} &nbsp; ${badge(n.rterm)} &nbsp;`+
      `<span style="color:var(--faint)">declared</span>`+
      `${n.loc?`<br><span style="color:var(--faint)">rests on: ${esc(n.loc)}</span>`:""}</div>`
    : `<div class="ac-src" style="color:var(--faint)">No source attached. Author-typed, and it stays off the shared branch until a publicly-resolvable terminal is attached.</div>`;
  card.innerHTML =
    `<div class="ac-top"><span class="ac-claim">${esc(n.statement)}</span>${badge(n.terminal)}<span class="ac-stamp">declared / single-author</span></div>`+
    `<p class="ac-prom">id ${n.id} &nbsp;/&nbsp; ${promotionFor(n.terminal)}</p>`+
    src;
  return card;
}


/* ---- mode toggle ---- */
function setMode(m){
  mode=m;
  document.body.classList.toggle("mode-reader", m==="reader");
  $("#m-reader").setAttribute("aria-pressed", m==="reader"?"true":"false");
  $("#m-inspector").setAttribute("aria-pressed", m==="inspector"?"true":"false");
}
$("#m-reader").addEventListener("click",()=>setMode("reader"));
$("#m-inspector").addEventListener("click",()=>setMode("inspector"));

const mbtn = $("#machine-btn");
if(mbtn) mbtn.addEventListener("click",()=>{
  const d = $("#machinedump");
  if(d.hidden){ d.textContent = $("#kg-graph").textContent.trim(); d.hidden=false; mbtn.textContent="hide machine graph"; }
  else { d.hidden=true; mbtn.textContent="view machine graph"; }
});

/* ---- paper view wiring ---- */
const plink = $("#paperlink");
if(plink) plink.addEventListener("click", e=>{ e.preventDefault(); openPaper(); });
const pbk = $("#paper-bk");
if(pbk) pbk.addEventListener("click", backToEntrance);
/* paper-ref anchors route into graph nodes. Add data-node="n-xxx" to any anchor to wire it. */
document.addEventListener("click", e=>{
  const a = e.target.closest && e.target.closest(".paper-ref");
  if(!a) return;
  e.preventDefault();
  const id = a.getAttribute("data-node");
  if(id && GRAPH[id]) openNode(id);
});

/* ---- vocabulary register wiring ---- */
const reg = $("#register");
if(reg) reg.addEventListener("click", e=>{
  const b = e.target.closest("button[data-reg]"); if(!b) return;
  applyRegister(b.getAttribute("data-reg"));
});
const termpop = $("#termpop");
document.addEventListener("click", e=>{
  const t = e.target.closest && e.target.closest(".term[data-term]");
  if(!t || REGISTER==="plain"){ if(termpop) termpop.classList.remove("show"); return; }
  const d = TERMS[t.getAttribute("data-term")]; if(!d || !termpop) return;
  termpop.innerHTML = `<b>${d.literature}</b> ${d.delta} <span class="src">${d.src}</span>`;
  termpop.classList.add("show");
  const r = t.getBoundingClientRect();
  const w = document.documentElement.clientWidth;
  termpop.style.top = (window.scrollY + r.bottom + 8) + "px";
  termpop.style.left = (window.scrollX + Math.max(12, Math.min(r.left, w - 324))) + "px";
  e.stopPropagation();
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && termpop) termpop.classList.remove("show"); });

/* ---- boot ---- */
wrapTerms($(".paper")); applyRegister("plain");

const enterBtn = $("#enter");
if(enterBtn) enterBtn.addEventListener("click", enterQuestion);
const toIntro = $("#toIntro");
if(toIntro){
  toIntro.addEventListener("click", showIntro);
  toIntro.addEventListener("keydown", e=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); showIntro(); } });
}
const specBk = $("#spec-bk-overview");
if(specBk) specBk.addEventListener("click", openOverview);
const toOverview = $("#paper-to-overview");
if(toOverview) toOverview.addEventListener("click", e=>{ e.preventDefault(); openOverview(); });
const ovBk = $("#overview-bk-paper");
if(ovBk) ovBk.addEventListener("click", openPaper);
const ovToSpec = $("#overview-to-spec");
if(ovToSpec) ovToSpec.addEventListener("click", e=>{ e.preventDefault(); openSpec(); });

/* front matter is the default screen; a direct link to the paper, spec, or a node skips it */
const h = location.hash;
if(h === "#paper") openPaper();
else if(h === "#overview") openOverview();
else if(h === "#spec") openSpec();
else if(h && h.length > 1 && GRAPH[h.slice(1)]) openNode(h.slice(1));
else if(h === "#question") enterQuestion();
else showIntro();
