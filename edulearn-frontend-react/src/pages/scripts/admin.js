/* Lifted verbatim from edulearn-frontend/admin.html — do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{document.documentElement.classList.remove('dark-mode');localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


    // EduAPI.API_BASE is already the final answer: api.js resolves the host
    // (localhost / *.vercel.app / bestbrainplus.com) AND applies the
    // localStorage.edulearn_api override, stripping trailing slashes and
    // refusing an http:// override on an https page. Re-deriving it here only
    // reproduced that logic worse, and the old '/backend-api' tail-fallback was
    // actively harmful: nothing serves that path in dev, so a miss returned
    // index.html and the page failed as "Unexpected token '<'". api.js loads
    // synchronously above, so the global is always there; if it ever isn't,
    // throwing here is the honest failure.
    var API = EduAPI.API_BASE;
    var filter = 'all';
    var lastIds = new Set();

    document.querySelectorAll('#filters button').forEach(function(b){
      b.addEventListener('click', function(){
        document.querySelectorAll('#filters button').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on'); filter = b.getAttribute('data-f'); render();
      });
    });

    var DATA = { users: [], counts:{}, total:0 };

    function fmtDate(d){
      try { var x = new Date(d); return x.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) + ' ' + x.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }
      catch(e){ return ''; }
    }

    function render(){
      var rows = document.getElementById('rows');
      var list = DATA.users.filter(function(u){ return filter==='all' || u.role===filter; });
      if (!list.length){ rows.innerHTML = '<tr><td colspan="7" class="empty">No '+(filter==='all'?'':filter+' ')+'users yet. Register one to see it appear here.</td></tr>'; return; }
      rows.innerHTML = list.map(function(u){
        var idCol = u.role==='teacher' ? (u.teacherId||'—') : (u.rollNumber||'—');
        var cls = u.className ? (u.className + (u.section?' · '+u.section:'')) : (u.role==='parent'? (u.children+' child'+(u.children===1?'':'ren')) : '—');
        var fresh = !lastIds.has(u.id) && lastIds.size ? ' class="fresh"' : '';
        return '<tr'+fresh+'>'+
          '<td class="nm">'+esc(u.name)+'</td>'+
          '<td class="meta">'+esc(u.email)+'</td>'+
          '<td class="meta">'+esc(u.phone||'—')+'</td>'+
          '<td><span class="pill '+u.role+'">'+u.role+'</span></td>'+
          '<td class="mono" style="font-size:12px">'+esc(idCol)+'</td>'+
          '<td class="meta">'+esc(cls)+'</td>'+
          '<td class="meta">'+fmtDate(u.createdAt)+'</td>'+
        '</tr>';
      }).join('');
      // remember ids for next "fresh" highlight
      lastIds = new Set(DATA.users.map(function(u){return u.id;}));
    }

    function renderStats(){
      var c = DATA.counts || {};
      document.getElementById('stats').innerHTML =
        stat(DATA.total,'Total Users') + stat(c.student||0,'Students') +
        stat(c.teacher||0,'Teachers') + stat(c.parent||0,'Parents');
    }
    function stat(n,l){ return '<div class="stat"><b>'+n+'</b><span>'+l+'</span></div>'; }
    function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

    var pollTimer = null;
    function stopPolling(){ if (pollTimer){ clearInterval(pollTimer); pollTimer = null; } }

    async function load(manual){
      document.getElementById('errBox').innerHTML='';
      var res;
      try {
        res = await fetch(API + '/api/admin/users');
      } catch(e){
        // A thrown fetch means the host is genuinely unreachable (DNS, offline,
        // CORS block) — this is the only real "backend is down" case.
        document.getElementById('errBox').innerHTML =
          '<div class="err">Cannot reach the backend at '+esc(API)+'. It may be offline or blocked. ('+esc(e.message)+')</div>';
        return;
      }
      if (res.ok){
        DATA = await res.json();
        renderStats(); render();
        return;
      }
      // The backend responded but refused the request — surface ITS message and
      // status, not a misleading "run npm run demo". 403 here means the admin
      // endpoint is disabled/not configured on this server, so stop retrying.
      var serverMsg = '';
      try { serverMsg = (await res.json()).error || ''; } catch(_) {}
      var box = document.getElementById('errBox');
      if (res.status === 403 || res.status === 401){
        stopPolling();
        box.innerHTML = '<div class="err"><b>Admin view unavailable ('+res.status+').</b> '
          + (serverMsg ? esc(serverMsg)+'. ' : '')
          + 'This endpoint is disabled on the live backend — it needs the admin key configured server-side. The rest of the site is working normally.</div>';
      } else {
        box.innerHTML = '<div class="err">Backend returned '+res.status+'. '+esc(serverMsg)+'</div>';
      }
    }

    load();
    pollTimer = setInterval(function(){ load(); }, 5000);
  
}
