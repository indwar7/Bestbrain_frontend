/* Lifted verbatim from edulearn-frontend/upload.html, do not hand-edit.
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
    var user = EduAPI.getUser();
    // Only teachers (admin role-as-teacher) may upload.
    if (!user || user.role !== 'teacher') {
      document.getElementById('form').style.display = 'none';
      document.getElementById('gate').style.display = 'block';
    }

    // Pre-select the teacher's OWN class + subject so a lecture is uploaded for
    // the class they actually teach, students of that class then see it.
    (function preselectTeacherClass(){
      if (!user || user.role !== 'teacher') return;
      var teaches = (user.teaches && user.teaches.length) ? user.teaches
                  : (user.className ? [{ className: user.className, subject: user.subject }] : []);
      if (!teaches.length) return;
      var t = teaches[0];
      function setSelect(id, val){
        var sel = document.getElementById(id);
        if (!sel || !val) return;
        var want = String(val).trim().toLowerCase();
        for (var i = 0; i < sel.options.length; i++){
          if (sel.options[i].text.trim().toLowerCase() === want){ sel.selectedIndex = i; return; }
        }
      }
      setSelect('className', t.className);
      setSelect('subject', t.subject);
      // If the teacher teaches multiple subjects/classes, let them pick, but
      // limit the class dropdown to classes they actually teach.
      var classSel = document.getElementById('className');
      if (classSel){
        var myClasses = {};
        teaches.forEach(function(x){ if (x.className) myClasses[String(x.className).trim().toLowerCase()] = true; });
        Array.prototype.slice.call(classSel.options).forEach(function(o){
          if (!myClasses[o.text.trim().toLowerCase()]) o.disabled = true;
        });
        setSelect('className', t.className);
      }
    })();

    /* Chapter picker. An upload shows under a chapter only when its topic
       matches that chapter, and a hand-typed topic is easy to get slightly
       wrong, so the chapter is picked from the syllabus for the chosen class
       and subject. "Other topic" keeps the free-text box for anything else. */
    var SUBJECT_KEY = { 'maths':'maths', 'science':'science', 'english':'english',
                        'social science':'social', 'social studies':'social', 'hindi':'hindi' };
    var topicInput = document.getElementById('topic');
    var chapterPick = document.getElementById('chapterPick');
    function syncTopic(){
      var other = chapterPick.value === '__other';
      topicInput.style.display = other ? '' : 'none';
      topicInput.value = other ? '' : chapterPick.value;
      if (other) topicInput.focus();
    }
    function fillChapters(){
      var C = window.EduCurriculum && window.EduCurriculum.CURRICULUM;
      var cls = C && C[parseInt(String(document.getElementById('className').value).replace(/\D/g, ''), 10)];
      var list = cls && cls[SUBJECT_KEY[String(document.getElementById('subject').value).trim().toLowerCase()]];
      chapterPick.innerHTML = '';
      function add(value, text){
        var o = document.createElement('option');
        o.value = value; o.textContent = text;
        chapterPick.appendChild(o);
      }
      add('', 'Choose the chapter');
      (Array.isArray(list) ? list : []).forEach(function(ch, i){
        var slug = Array.isArray(ch) ? ch[0] : ch.slug;
        var name = Array.isArray(ch) ? ch[1] : ch.name;
        // The words of the slug are exactly what the lesson page searches for.
        add(String(slug).replace(/-/g, ' '), (i + 1) + '. ' + name);
      });
      add('__other', 'Other topic (type it)');
      syncTopic();
    }
    if (chapterPick && topicInput){
      chapterPick.addEventListener('change', syncTopic);
      document.getElementById('className').addEventListener('change', fillChapters);
      document.getElementById('subject').addEventListener('change', fillChapters);
      // curriculum.js is deferred and can land after this script under the router.
      (function waitForCurriculum(tries){
        if ((window.EduCurriculum && window.EduCurriculum.CURRICULUM) || tries <= 0) { fillChapters(); return; }
        setTimeout(function(){ waitForCurriculum(tries - 1); }, 120);
      })(25);
    }

    var fileInput = document.getElementById('file');
    var drop = document.getElementById('drop');
    drop.addEventListener('click', function(){ fileInput.click(); });
    fileInput.addEventListener('change', function(){
      if (fileInput.files[0]) document.getElementById('fileName').textContent = '✓ ' + fileInput.files[0].name;
    });
    ['dragover','dragenter'].forEach(function(e){ drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave','drop'].forEach(function(e){ drop.addEventListener(e, function(ev){ ev.preventDefault(); drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function(ev){
      if (ev.dataTransfer.files[0]){ fileInput.files = ev.dataTransfer.files; document.getElementById('fileName').textContent = '✓ ' + ev.dataTransfer.files[0].name; }
    });

    function msg(text, ok){ var m = document.getElementById('msg'); m.textContent = text; m.className = 'msg ' + (ok?'ok':'err'); }

    // Upload type, a lecture video or chapter notes. Both share the same
    // metadata fields (class/subject/topic); only the endpoint, file field,
    // accepted types and copy differ, so it's one form with a toggle rather
    // than two.
    var TYPES = {
      video: { ep:'/api/videos', field:'video', accept:'video/*',
        kind:'Video Lecture', titleLabel:'Video Title *', fileLabel:'Video File *',
        dropText:'Click or drop a video here', dropHint:'MP4, up to 500 MB',
        btn:'Upload Lecture', need:'Please choose a video file.',
        ok:'✓ Uploaded! Students in this class can now watch it.' },
      note: { ep:'/api/notes', field:'note', accept:'.pdf,application/pdf,image/*',
        kind:'Notes', titleLabel:'Notes Title *', fileLabel:'Notes File *',
        dropText:'Click or drop a PDF here', dropHint:'PDF or image, up to 50 MB',
        btn:'Upload Notes', need:'Please choose a PDF or image file.',
        ok:'✓ Uploaded! Students in this class can now open these notes.' }
    };
    var uploadType = 'video';

    function applyType(t){
      uploadType = TYPES[t] ? t : 'video';
      var cfg = TYPES[uploadType];
      var set = function(id, text){ var el = document.getElementById(id); if (el) el.textContent = text; };
      set('uploadKind', cfg.kind);
      set('titleLabel', cfg.titleLabel);
      set('fileLabel', cfg.fileLabel);
      set('dropText', cfg.dropText);
      set('dropHint', cfg.dropHint);
      var sb = document.getElementById('submit'); if (sb && !sb.disabled) sb.textContent = cfg.btn;
      fileInput.setAttribute('accept', cfg.accept);
      // A file chosen for the other type may not fit, clear the selection.
      fileInput.value = ''; document.getElementById('fileName').textContent = '';
      Array.prototype.forEach.call(document.querySelectorAll('.utype__tab'), function(tab){
        var on = tab.getAttribute('data-utype') === uploadType;
        tab.classList.toggle('on', on);
        tab.setAttribute('aria-selected', String(on));
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll('.utype__tab'), function(tab){
      tab.addEventListener('click', function(){ applyType(tab.getAttribute('data-utype')); });
    });

    document.getElementById('submit').addEventListener('click', function(){
      var cfg = TYPES[uploadType];
      var title = document.getElementById('title').value.trim();
      var file = fileInput.files[0];
      if (!title){ msg('Please enter a title.', false); return; }
      if (!document.getElementById('topic').value.trim()){ msg('Please choose the chapter this belongs to.', false); return; }
      if (!file){ msg(cfg.need, false); return; }

      var fd = new FormData();
      fd.append('title', title);
      fd.append('className', document.getElementById('className').value);
      fd.append('subject', document.getElementById('subject').value);
      fd.append('topic', document.getElementById('topic').value.trim());
      fd.append('description', document.getElementById('description').value.trim());
      fd.append('uploaderName', user.name || '');
      fd.append(cfg.field, file);

      var btn = document.getElementById('submit'); btn.disabled = true; btn.textContent = 'Uploading…';
      var bar = document.getElementById('bar'); bar.style.display = 'block';
      var fill = document.getElementById('barFill');

      // XHR for real upload progress.
      var xhr = new XMLHttpRequest();
      xhr.open('POST', API + cfg.ep);
      xhr.setRequestHeader('Authorization', 'Bearer ' + EduAPI.getToken());
      xhr.upload.onprogress = function(e){ if (e.lengthComputable) fill.style.width = Math.round(e.loaded/e.total*100) + '%'; };
      xhr.onload = function(){
        btn.disabled = false; btn.textContent = cfg.btn;
        if (xhr.status === 201){
          msg(cfg.ok, true);
          document.getElementById('title').value=''; document.getElementById('fileName').textContent=''; fileInput.value='';
          setTimeout(function(){ fill.style.width='0'; bar.style.display='none'; }, 1200);
        } else {
          try { msg(JSON.parse(xhr.responseText).error || 'Upload failed', false); } catch(e){ msg('Upload failed ('+xhr.status+')', false); }
        }
      };
      xhr.onerror = function(){ btn.disabled=false; btn.textContent=cfg.btn; msg('Cannot reach server. Is the backend running?', false); };
      xhr.send(fd);
    });
  
}
