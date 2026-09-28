/* Lifted verbatim from edulearn-frontend/videos.html, do not hand-edit.
   Regenerate with `npm run sync:js`.

   Runs inside the page-script environment: the destructured parameters
   shadow the real globals so ".html" navigations become route changes and
   listeners can be torn down on unmount. See src/lib/pageScriptEnv.ts. */
/* eslint-disable */
export default function init({ location, document, window, onCleanup }) {
/* light-only product: strip any stale dark preference before paint */try{if(!document.documentElement.classList.contains('kid-dark')){document.documentElement.classList.remove('dark-mode');}localStorage.setItem('edulearn-theme','light');}catch(e){}

/* ---- next <script> block ---- */


    // EduAPI.API_BASE is the final answer, api.js (loaded synchronously above)
    // already resolves the host and applies the localStorage.edulearn_api
    // override safely. The old fallbacks were unreachable, and '/backend-api'
    // was a trap: nothing serves it in dev, so a miss returned index.html and
    // the page died on "Unexpected token '<'". The next line calls EduAPI
    // unguarded anyway, so guarding here bought nothing.
    var API = EduAPI.API_BASE;
    var user = EduAPI.requireAuth();
    var ALL = [];
    var subjectFilter = 'all';
    var searchQ = '';
    var view = localStorage.getItem('edulearn_videos_view') || 'rows';

    // --- DEMO / reviewer mode -------------------------------------------------
    // A demo account may browse EVERY class (with a Class 6 / Class 7 toggle) so
    // a manager can review both libraries from one login. Real students are NEVER
    // demo, so their strict single-class lock below is untouched.
    var DEMO_EMAILS = ['c7.student.livetest@edulearn.test'];
    var DEMO = !!(user && user.email &&
      (DEMO_EMAILS.indexOf(user.email.toLowerCase()) >= 0 || /demo|reviewer/.test(user.email.toLowerCase())));
    // Which class's library is on screen. For real students this is pinned to
    // their own class; for demo it's toggleable and starts on their class.
    var classFilter = (user && user.className && (String(user.className).match(/\d+/) || [])[0]) || 'all';

    function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;'); }
    function fmtDur(s){ if(!s||isNaN(s)) return ''; s=Math.round(s); var m=Math.floor(s/60),x=s%60; return m+':'+(x<10?'0':'')+x; }

    // --- inline line icons (lucide style; stroke is currentColor so each icon
    //     picks up the colour of whatever it sits in) ---
    var ICON = {
      play:    '<polygon points="6 3 20 12 6 21 6 3"/>',
      pause:   '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
      volume:  '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
      mute:    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>',
      check:   '<polyline points="20 6 9 17 4 12"/>',
      chevronLeft:  '<polyline points="15 18 9 12 15 6"/>',
      chevronRight: '<polyline points="9 18 15 12 9 6"/>',
      atom:    '<circle cx="12" cy="12" r="1" fill="currentColor"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>',
      ruler:   '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
      book:    '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
      globe:   '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
      clapper: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
      film:    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>'
    };
    function ico(name, size, extra){
      return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor"'+
        ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'+(extra||'')+'>'+
        ICON[name]+'</svg>';
    }
    // Subject glyphs are sized by their container's font-size (56px covers,
    // 200px hero, 28px list thumbs), so they render at 1em.
    function glyphIcon(name){ return ico(name, '1em', ' style="display:block"'); }

    // --- per-subject visual identity, derived from the site's aurora palette ---
    var SUBJECTS = {
      'science':  {glyph:glyphIcon('atom'), pip:'#0FA983', grad:'linear-gradient(135deg,#0FA983 0%,#3DE8C5 55%,#7C9BFF 120%)'},
      'maths':    {glyph:glyphIcon('ruler'), pip:'#7C9BFF', grad:'linear-gradient(135deg,#5B6CF0 0%,#7C9BFF 55%,#9FD6FF 120%)'},
      'math':     {glyph:glyphIcon('ruler'), pip:'#7C9BFF', grad:'linear-gradient(135deg,#5B6CF0 0%,#7C9BFF 55%,#9FD6FF 120%)'},
      'english':  {glyph:glyphIcon('book'), pip:'#FFB454', grad:'linear-gradient(135deg,#F0913D 0%,#FFB454 55%,#FFD79A 120%)'},
      'social':   {glyph:glyphIcon('globe'), pip:'#E8746A', grad:'linear-gradient(135deg,#D65A6E 0%,#F08A6A 55%,#FFB454 120%)'},
      'social studies':{glyph:glyphIcon('globe'), pip:'#E8746A', grad:'linear-gradient(135deg,#D65A6E 0%,#F08A6A 55%,#FFB454 120%)'},
      'default':  {glyph:glyphIcon('clapper'), pip:'#7C9BFF', grad:'var(--aurora)'}
    };
    function subjOf(v){
      var k = String(v.subject||'').trim().toLowerCase();
      return SUBJECTS[k] || SUBJECTS[k.split(' ')[0]] || SUBJECTS['default'];
    }

    // --- watched progress (localStorage, per user) ---
    var PKEY = 'edulearn_video_progress_' + (user && user.id ? user.id : 'anon');
    function loadProg(){ try{ return JSON.parse(localStorage.getItem(PKEY)||'{}'); }catch(e){ return {}; } }
    function saveProg(p){ try{ localStorage.setItem(PKEY, JSON.stringify(p)); }catch(e){} }
    var PROG = loadProg();
    function pctOf(id){ var d=PROG[id]; if(!d||!d.dur) return 0; return Math.min(100, Math.round(d.pos/d.dur*100)); }
    function isWatched(id){ return pctOf(id) >= 92; }

    async function load(){
      var sub = document.getElementById('sub');
      document.getElementById('stage').innerHTML =
        '<div class="grid">'+Array(4).fill('<div class="skel"></div>').join('')+'</div>';
      try {
        // A real student is locked to their own class; a demo account (and
        // teachers/parents) may load every class.
        var q = '';
        if (!DEMO && user.role === 'student' && user.className) q = '?className=' + encodeURIComponent(user.className);
        var res = await fetch(API + '/api/videos' + q, { headers:{ 'Authorization':'Bearer '+EduAPI.getToken() }, credentials:'include' });
        // Carry the status on the error object. It used to be flattened into
        // the string 'Server 401', so the catch below could not tell an expired
        // session (401) apart from a genuinely dead server, and reported both
        // as "Is the backend running?".
        if (!res.ok) {
          var httpErr = new Error('Server ' + res.status);
          httpErr.status = res.status;
          throw httpErr;
        }
        var j = await res.json();
        ALL = j.videos || [];
        // Defense-in-depth: a real student never sees videos outside their own
        // class. Skipped for demo so the reviewer can toggle between classes.
        if (!DEMO && user.role === 'student' && user.className){
          var myNum = (String(user.className).match(/\d+/) || [])[0];
          if (myNum) ALL = ALL.filter(function(v){
            var vn = (String(v.className||'').match(/\d+/) || [])[0];
            return vn === myNum;
          });
        }
        if (DEMO){
          sub.innerHTML = '<b>Reviewer mode</b> · toggle a class to see its library'
            + ' · <span style="font-family:\'Fragment Mono\',monospace;font-size:12px">'+ALL.length+' videos across classes</span>';
        } else {
          sub.innerHTML = (user.role==='student'
            ? (user.className ? ('Lectures for <b>'+esc(user.className)+'</b>') : 'All lectures')
            : 'All lectures on the platform')
            + ' · <span style="font-family:\'Fragment Mono\',monospace;font-size:12px">'+ALL.length+' videos</span>';
        }
        buildClassToggle(); buildFilters(); applyView(); render();
      } catch(e){
        document.getElementById('stage').innerHTML='';
        // "Is the backend running?" was wrong for the most common failure.
        // A 401 means the server answered fine and REJECTED THE TOKEN, which
        // happens whenever the session was issued by a different backend than
        // the one being called (the two servers sign with different secrets and
        // use different databases, so their tokens are not interchangeable).
        // Telling the user the server is down sends them to debug the wrong box.
        var box = document.getElementById('errBox');
        var api = (window.EduAPI && EduAPI.API_BASE) || '';
        if (e && e.status === 401){
          box.innerHTML = '<div class="err">Your session is not valid for this server' +
            (api ? ' (' + esc(api) + ')' : '') + '. Sign in again to refresh it. ' +
            '<a href="login.html" style="text-decoration:underline;font-weight:700">Go to login</a></div>';
        } else if (e && e.status){
          box.innerHTML = '<div class="err">The server returned an error (' + e.status + '). ' + esc(e.message) + '</div>';
        } else {
          box.innerHTML = '<div class="err">Could not reach ' + esc(api || 'the server') +
            '. It may be offline, or the browser may have blocked the response (CORS). ' + esc(e.message) + '</div>';
        }
      }
    }

    // Demo-only: a Class 6 / Class 7 (etc.) toggle so a reviewer can switch
    // between class libraries. Each class is its own separate section.
    function buildClassToggle(){
      var host = document.getElementById('classToggle');
      if (!DEMO){ host.style.display = 'none'; return; }
      var nums = Array.from(new Set(ALL.map(function(v){
        return (String(v.className||'').match(/\d+/) || [])[0];
      }).filter(Boolean))).sort(function(a,b){ return (+a)-(+b); });
      if (nums.length < 2){ host.style.display = 'none'; return; } // nothing to toggle
      if (nums.indexOf(classFilter) < 0) classFilter = nums[0];
      host.style.display = '';
      host.innerHTML = nums.map(function(n){
        return '<button class="'+(n===classFilter?'on':'')+'" data-c="'+n+'">Class '+n+'</button>';
      }).join('');
      host.querySelectorAll('button').forEach(function(b){
        b.addEventListener('click', function(){
          host.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});
          b.classList.add('on'); classFilter = b.getAttribute('data-c');
          document.getElementById('search').value=''; searchQ='';
          render();
        });
      });
    }

    function buildFilters(){
      var subjects = ['all'].concat(Array.from(new Set(ALL.map(function(v){return v.subject;}))).filter(Boolean));
      document.getElementById('filters').innerHTML = subjects.map(function(s,i){
        return '<button class="'+(i===0?'on':'')+'" data-s="'+esc(s)+'">'+(s==='all'?'All Subjects':esc(s))+'</button>';
      }).join('');
      document.querySelectorAll('#filters button').forEach(function(b){
        b.addEventListener('click', function(){
          document.querySelectorAll('#filters button').forEach(function(x){x.classList.remove('on');});
          b.classList.add('on'); subjectFilter = b.getAttribute('data-s'); render();
        });
      });
    }

    // A stray test upload ("science" under a bogus "cells" topic) belongs to a
    // different teacher account and can't be removed via the API, so hide it.
    function isJunk(v){
      var t=(v.topic||'').trim().toLowerCase(), ti=(v.title||'').trim().toLowerCase();
      return t==='cells' && ti==='science';
    }
    function visible(){
      return ALL.filter(function(v){
        if (isJunk(v)) return false;
        // Class scope: demo toggles between classes; real students are already
        // class-locked in ALL, so this is a harmless no-op for them.
        if (DEMO && classFilter!=='all'){
          var vn = (String(v.className||'').match(/\d+/) || [])[0];
          if (vn !== classFilter) return false;
        }
        if (subjectFilter!=='all' && v.subject!==subjectFilter) return false;
        if (searchQ){
          var hay = ((v.title||'')+' '+(v.topic||'')+' '+(v.subject||'')).toLowerCase();
          if (hay.indexOf(searchQ)<0) return false;
        }
        return true;
      });
    }

    // Group a list into chapters/topics. Falls back to subject when no topic.
    function groupBy(list, keyFn){
      var order=[], map={};
      list.forEach(function(v){ var k=keyFn(v)||'More lectures'; if(!map[k]){map[k]=[];order.push(k);} map[k].push(v); });
      return order.map(function(k){ return {key:k, items:sortByPart(map[k])}; });
    }
    // A part number embedded in the title ("Part 3 - …") drives ordering + labels.
    function partOf(v){ var m=String(v&&v.title||'').match(/\bpart\s*(\d+)/i); return m?parseInt(m[1],10):null; }
    // The chapter heading + a number badge already convey position, so show the
    // human title without the "Part N - " prefix.
    function cleanTitle(v){ return String(v&&v.title||'').replace(/^\s*part\s*\d+\s*[-–\u2014:.]\s*/i,''); }
    // Ascending by part number; un-numbered lectures keep their original order after.
    function sortByPart(items){
      return items.map(function(v,i){ var p=partOf(v); return {v:v,k:(p!=null?p:1000+i)}; })
                  .sort(function(a,b){ return a.k-b.k; })
                  .map(function(x){ return x.v; });
    }
    // Video topics are stored as curriculum slug-words (so the lesson page can
    // match them); map the known ones to their proper NCERT chapter name for a
    // clean heading. Anything not listed shows its own topic as-is.
    var CHAPTER_DISPLAY = {
      'adolescence': 'Adolescence: A Stage of Growth and Change',
      'metals nonmetals': 'The World of Metals and Non-metals',
      'physical chemical changes': 'Changes Around Us: Physical and Chemical',
      'electricity': 'Electricity: Circuits and their Components',
      'electricity circuits': 'Electricity: Circuits and their Components'
    };
    function chapterName(v){
      var t = (v && v.topic || '').trim();
      return CHAPTER_DISPLAY[t.toLowerCase()] || t || v.subject;
    }

    // ---------- cover card markup ----------
    function coverInner(v, sj, epLabel){
      var pct = pctOf(v.id);
      return '<div class="cover" style="background:'+sj.grad+'">'+
        '<div class="cglyph">'+sj.glyph+'</div>'+
        (epLabel?'<span class="ep">'+esc(epLabel)+'</span>':'')+
        (isWatched(v.id)?'<span class="watched-flag">'+ico('check',16)+'</span>':'')+
        (v.durationLabel?'<span class="dur">'+esc(v.durationLabel)+'</span>':'')+
        '<span class="playbadge">'+ico('play',22)+'</span>'+
        (pct>0&&pct<92?'<div class="prog"><span style="width:'+pct+'%"></span></div>':'')+
      '</div>';
    }
    function cardHTML(v, epLabel){
      var sj = subjOf(v);
      var initial = (v.uploadedByName||'T').trim().charAt(0).toUpperCase();
      var ct = cleanTitle(v);
      return '<div class="vcard" tabindex="0" role="button" data-id="'+v.id+'" data-title="'+esc(ct)+'" aria-label="Play '+esc(ct)+'">'+
        coverInner(v, sj, epLabel)+
        '<div class="vbody">'+
          '<div class="vtitle">'+esc(ct)+'</div>'+
          '<div class="vmeta"><span class="tag">'+esc(v.className)+'</span><span class="tag">'+esc(v.subject)+'</span>'+(v.topic?'<span>'+esc(v.topic)+'</span>':'')+'</div>'+
          '<div class="by"><span class="av">'+esc(initial)+'</span>'+esc(v.uploadedByName||'Teacher')+' · '+(v.views||0)+' views</div>'+
        '</div></div>';
    }

    // ---------- render dispatch ----------
    function render(){
      var stage = document.getElementById('stage');
      var list = visible();
      if (!list.length){
        stage.innerHTML = '<div class="empty"><div class="big">'+ico('film',44)+'</div>'+
          (searchQ ? 'No lectures match “'+esc(searchQ)+'”.' : 'No lectures here yet.')+
          (user.role==='teacher' ? ' <a href="upload.html">Upload one →</a>' : '')+'</div>';
        return;
      }
      if (view==='list') return renderList(stage, list);
      if (view==='grid') return renderGrid(stage, list);
      return renderRows(stage, list);
    }

    function renderGrid(stage, list){
      stage.innerHTML = '<div class="grid">'+list.map(function(v){return cardHTML(v);}).join('')+'</div>';
      wireCards();
    }

    function renderRows(stage, list){
      // Featured = most-viewed (ties → first). Rest grouped by topic/chapter.
      var featured = list.slice().sort(function(a,b){return (b.views||0)-(a.views||0);})[0];
      var groups = groupBy(list, function(v){ return chapterName(v); });
      var html = heroHTML(featured);
      groups.forEach(function(g, gi){
        var sj = subjOf(g.items[0]);
        html += '<section class="shelf">'+
          '<div class="shelf-head"><div class="shelf-title"><span class="pip" style="background:'+sj.pip+'"></span>'+esc(g.key)+'</div>'+
          '<span class="shelf-count">'+g.items.length+' '+(g.items.length===1?'lecture':'lectures')+'</span></div>'+
          '<div class="rail-outer"><button class="rail-btn prev" data-rail="'+gi+'" data-dir="-1" aria-label="Scroll left">'+ico('chevronLeft',18)+'</button>'+
          '<div class="rail" id="rail'+gi+'">'+
            g.items.map(function(v,i){ return cardHTML(v, 'Part '+(partOf(v)||(i+1))); }).join('')+
          '</div>'+
          '<button class="rail-btn next" data-rail="'+gi+'" data-dir="1" aria-label="Scroll right">'+ico('chevronRight',18)+'</button></div>'+
        '</section>';
      });
      stage.innerHTML = html;
      wireCards(); wireRails(); wireHero(featured);
    }

    function heroHTML(v){
      if(!v) return '';
      var sj = subjOf(v);
      // Light, minimal card: subject accent + title + class/views + Play. No
      // dark artwork, giant glyph or long blurb (per review).
      return '<div class="hero" id="heroCard" tabindex="0" role="button" aria-label="Play '+esc(cleanTitle(v))+'" style="--accent:'+sj.pip+'">'+
        '<div class="hero-inner">'+
          '<div class="hero-eyebrow"><span class="dot"></span>Featured · '+esc(v.subject||'Lecture')+'</div>'+
          '<h2>'+esc(cleanTitle(v))+'</h2>'+
          '<div class="hero-foot"><span class="hero-cta">'+ico('play',16)+'Play now</span>'+
          '<span class="hero-meta"><span>'+esc(v.className)+'</span><span>'+(v.views||0)+' views</span>'+(v.durationLabel?'<span>'+esc(v.durationLabel)+'</span>':'')+'</span></div>'+
        '</div></div>';
    }

    function renderList(stage, list){
      var groups = groupBy(list, function(v){ return chapterName(v); });
      var html = '';
      groups.forEach(function(g){
        var sj = subjOf(g.items[0]);
        html += '<div class="listwrap" style="margin-bottom:20px">'+
          '<div class="lgroup-head"><span class="pip" style="background:'+sj.pip+'"></span><b>'+esc(g.key)+'</b><span class="c">'+g.items.length+' videos</span></div>'+
          g.items.map(function(v,i){
            var s2 = subjOf(v); var pct=pctOf(v.id); var ct=cleanTitle(v);
            return '<div class="lrow" tabindex="0" role="button" data-id="'+v.id+'" data-title="'+esc(ct)+'" aria-label="Play '+esc(ct)+'">'+
              '<span class="lnum">'+(partOf(v)||(i+1))+'</span>'+
              '<div class="lthumb" style="background:'+s2.grad+'"><span class="cglyph">'+s2.glyph+'</span>'+
                (pct>0&&pct<92?'<div class="prog"><span style="width:'+pct+'%"></span></div>':'')+'</div>'+
              '<div class="linfo"><div class="t">'+esc(ct)+(isWatched(v.id)?' <span style="color:var(--teal);vertical-align:-2px">'+ico('check',14)+'</span>':'')+'</div>'+
                '<div class="m"><span class="tag">'+esc(v.subject)+'</span><span>'+esc(v.uploadedByName||'Teacher')+'</span><span>'+(v.views||0)+' views</span></div></div>'+
              (v.durationLabel?'<span class="ldur">'+esc(v.durationLabel)+'</span>':'')+
              '<span class="lplay">'+ico('play',18)+'</span>'+
            '</div>';
          }).join('')+
        '</div>';
      });
      stage.innerHTML = html;
      wireCards();
    }

    // ---------- wiring ----------
    function wireCards(){
      document.querySelectorAll('.vcard,.lrow').forEach(function(c){
        var go = function(){ play(c.getAttribute('data-id'), c.getAttribute('data-title')); };
        c.addEventListener('click', go);
        c.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
      });
    }
    function wireHero(v){
      var h=document.getElementById('heroCard'); if(!h||!v) return;
      var go=function(){ play(v.id, v.title); };
      h.addEventListener('click', go);
      h.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); go(); } });
    }
    function wireRails(){
      document.querySelectorAll('.rail-btn').forEach(function(b){
        b.addEventListener('click', function(){
          var rail=document.getElementById('rail'+b.getAttribute('data-rail'));
          if(rail) rail.scrollBy({left: parseInt(b.getAttribute('data-dir'))*rail.clientWidth*0.85, behavior:'smooth'});
        });
      });
    }

    // ---------- view toggle ----------
    function applyView(){
      document.getElementById('viewRows').classList.toggle('on', view==='rows');
      document.getElementById('viewGrid').classList.toggle('on', view==='grid');
      document.getElementById('viewList').classList.toggle('on', view==='list');
    }
    function setView(v){ view=v; localStorage.setItem('edulearn_videos_view', v); applyView(); render(); }
    document.getElementById('viewRows').addEventListener('click', function(){ setView('rows'); });
    document.getElementById('viewGrid').addEventListener('click', function(){ setView('grid'); });
    document.getElementById('viewList').addEventListener('click', function(){ setView('list'); });

    // ---------- search ----------
    var st;
    document.getElementById('search').addEventListener('input', function(){
      var val=this.value.trim().toLowerCase();
      clearTimeout(st); st=setTimeout(function(){ searchQ=val; render(); }, 160);
    });

    // ---------- player ----------
    var modal = document.getElementById('modal');
    var player = document.getElementById('player');
    var wrap = document.getElementById('vidwrap');
    var seek = document.getElementById('seek');
    var btnPlay = document.getElementById('btnPlay');
    var fmtT = fmtDur;
    var curId = null;

    function play(id, title){
      curId = id;
      document.getElementById('playerTitle').textContent = title;
      player.src = API + '/api/videos/' + id + '/stream?token=' + encodeURIComponent(EduAPI.getToken());
      modal.classList.add('open');
      // resume where they left off
      var saved = PROG[id];
      player.addEventListener('loadedmetadata', function once(){
        player.removeEventListener('loadedmetadata', once);
        if (saved && saved.pos && saved.pos < (player.duration||0)-2) player.currentTime = saved.pos;
      });
      player.play().catch(function(){});
      EduAPI.recordVideoView(id);
    }
    function closePlayer(){
      persist();
      player.pause(); player.removeAttribute('src'); player.load();
      modal.classList.remove('open'); curId=null;
    }
    function persist(){
      if(curId && player.duration){ PROG[curId]={pos:player.currentTime, dur:player.duration, t:Date.now()}; saveProg(PROG); }
    }
    function togglePlay(){ if (player.paused) player.play(); else player.pause(); }
    function skip(sec){ player.currentTime = Math.min(Math.max(0,(player.currentTime||0)+sec), player.duration||0); }

    player.addEventListener('play', function(){ btnPlay.innerHTML=ico('pause',20); wrap.classList.remove('paused'); });
    player.addEventListener('pause', function(){ btnPlay.innerHTML=ico('play',20); wrap.classList.add('paused'); persist(); });
    player.addEventListener('ended', function(){ persist(); });
    player.addEventListener('timeupdate', function(){
      if (player.duration){ seek.value = (player.currentTime/player.duration)*100; }
      document.getElementById('time').textContent = fmtT(player.currentTime)+' / '+fmtT(player.duration);
    });
    seek.addEventListener('input', function(){ if (player.duration) player.currentTime = (seek.value/100)*player.duration; });

    btnPlay.addEventListener('click', togglePlay);
    player.addEventListener('click', togglePlay);
    document.getElementById('centerPlay').addEventListener('click', togglePlay);
    document.getElementById('btnBack').addEventListener('click', function(){ skip(-10); });
    document.getElementById('btnFwd').addEventListener('click', function(){ skip(10); });
    document.getElementById('speed').addEventListener('change', function(){ player.playbackRate = parseFloat(this.value); });
    var vol = document.getElementById('volume'), btnMute = document.getElementById('btnMute');
    vol.addEventListener('input', function(){ player.volume = parseFloat(vol.value); player.muted = (vol.value==0); btnMute.innerHTML = ico(vol.value==0?'mute':'volume',20); });
    btnMute.addEventListener('click', function(){ player.muted = !player.muted; btnMute.innerHTML = ico(player.muted?'mute':'volume',20); vol.value = player.muted?0:player.volume; });
    document.getElementById('btnFull').addEventListener('click', function(){
      if (document.fullscreenElement) document.exitFullscreen();
      else wrap.requestFullscreen && wrap.requestFullscreen();
    });

    document.addEventListener('keydown', function(e){
      if (!modal.classList.contains('open')) return;
      if (e.key===' '){ e.preventDefault(); togglePlay(); }
      else if (e.key==='ArrowLeft'){ skip(-10); }
      else if (e.key==='ArrowRight'){ skip(10); }
      else if (e.key.toLowerCase()==='f'){ document.getElementById('btnFull').click(); }
      else if (e.key.toLowerCase()==='m'){ btnMute.click(); }
      else if (e.key==='Escape' && !document.fullscreenElement){ closePlayer(); }
    });
    // save progress if they close the tab mid-video
    window.addEventListener('beforeunload', persist);

    document.getElementById('closePlayer').addEventListener('click', closePlayer);
    modal.addEventListener('click', function(e){ if (e.target.id==='modal') closePlayer(); });

    applyView();
    load();
  
}
