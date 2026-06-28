// Role: the in-browser compose-gate runner. Loads Pyodide on click and runs the
//   captured compose_gate.py over the incumbent plus the ticked contributions, with
//   a captured-output fallback when the network is unavailable.
// Contract: wires #cgBtn; reads the data blocks (#cg-*) and #cgPaste; writes #cgOut.
// Invariant: owns DOM only; the JSON cleanup is engine/compose-gate/clean-json.js.
//   The Pyodide CDN load is the one network fetch, gated behind a click (T0-6 holds:
//   the page opens and reaches interactive offline; the runner degrades gracefully).
(function(){
  var btn=document.getElementById('cgBtn'); if(!btn) return;
  var out=document.getElementById('cgOut'), status=document.getElementById('cgStatus'), py=null;
  function txt(id){var e=document.getElementById(id);return e?e.textContent:'';}
  var pv=document.getElementById('cg-prompt-view'); if(pv) pv.textContent=txt('cg-prompt');
  var copy=document.getElementById('cgCopy');
  if(copy) copy.addEventListener('click', function(){
    var t=txt('cg-prompt');
    function done(){copy.textContent='Copied';setTimeout(function(){copy.textContent='Copy contract';},1500);}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done).catch(sel);}else sel();
    function sel(){var r=document.createRange();r.selectNodeContents(pv);var s=getSelection();s.removeAllRanges();s.addRange(r);status.textContent='Selected; press Cmd/Ctrl+C to copy.';}
  });
  function loadScript(s){return new Promise(function(res,rej){var el=document.createElement('script');el.src=s;el.onload=res;el.onerror=function(){rej(new Error('x'));};document.head.appendChild(el);});}
  async function ensurePy(){ if(py) return py; status.textContent='loading Python runtime (~6 MB, first run only)\u2026'; await loadScript('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'); py=await loadPyodide(); return py; }
  async function run(){
    btn.disabled=true;
    try{
      var p=await ensurePy();
      p.runPython("import os,glob\nos.makedirs('/home/pyodide',exist_ok=True)\nos.chdir('/home/pyodide')\n[os.remove(f) for f in glob.glob('contribution_*.json')]");
      p.FS.writeFile('incumbent.json', txt('cg-incumbent'));
      var ran=[];
      [['A','cgA'],['B','cgB'],['C','cgC']].forEach(function(pr){
        if(document.getElementById(pr[1]).checked){ p.FS.writeFile('contribution_'+pr[0]+'.json', txt('cg-'+pr[0])); ran.push(pr[0]); }
      });
      if(document.getElementById('cgD').checked){
        var raw=cleanJSON(document.getElementById('cgPaste').value);
        if(!raw){ status.textContent='D is ticked but the paste box is empty. Paste a JSON array, or untick D.'; btn.disabled=false; return; }
        var parsed;
        try{ parsed=JSON.parse(raw); }
        catch(e){ status.textContent='Your contribution is not valid JSON after cleanup: '+e.message+'  (paste the JSON array the model returned)'; out.classList.remove('show'); btn.disabled=false; return; }
        if(!Array.isArray(parsed)) parsed=[parsed];                        // auto-wrap single object
        var id=(document.getElementById('cgDid').value||'D').replace(/[^A-Za-z0-9]/g,'').slice(0,12)||'D';
        p.FS.writeFile('contribution_'+id+'.json', JSON.stringify(parsed)); ran.push(id);
      }
      var harness = txt('cg-py') + "\n\nimport sys, io, traceback\n_b=io.StringIO(); _o=sys.stdout; sys.stdout=_b\ntry:\n    main()\nexcept Exception:\n    traceback.print_exc()\nfinally:\n    sys.stdout=_o\n_b.getvalue()";
      out.textContent=p.runPython(harness); out.classList.add('show');
      status.textContent='ran compose_gate.py over: incumbent + '+(ran.join(' + ')||'(no contributions)');
    }catch(err){
      status.textContent='Live runner needs network to fetch the Python runtime. Showing the captured run (A+B+C) instead.';
      out.textContent=txt('cg-captured'); out.classList.add('show');
    }finally{ btn.disabled=false; }
  }
  btn.addEventListener('click', run);
})();
