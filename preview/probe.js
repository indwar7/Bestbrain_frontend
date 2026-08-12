(function(){
  function api(){try{return localStorage.getItem('edulearn_api')||location.origin}catch(e){return location.origin}}
  function tok(){try{return localStorage.getItem('edulearn_token')}catch(e){return null}}
  var step=(location.search.match(/step=(\w+)/)||[])[1];

  if(!tok()){
    var n=Math.floor(Math.random()*100000);
    fetch(api()+'/api/auth/signup/teacher',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:'T3',email:'t3'+n+'@bestbrain.local',phone:'9'+(320000000+n),
        password:'Passw0rd!23',teacherId:'TCH3-'+n,className:'Class 6',section:'A',subject:'Science'})})
      .then(function(r){return r.json()}).then(function(d){
        if(!d.accessToken){document.title='PROBE|signup failed';return;}
        localStorage.setItem('edulearn_token',d.accessToken);
        localStorage.setItem('edulearn_user',JSON.stringify(d.user));
        location.href='create-test.html?__probe=1&step=fill';
      });
    return;
  }

  if(step==='fill'){
    setTimeout(function(){
      var card = document.querySelector('.qcard');
      var rows = function(){ return card.querySelectorAll('.opt-row').length; };
      var log = ['start=' + rows()];

      card.querySelectorAll('.opt-remove')[0].click();
      log.push('afterRemove=' + rows());
      card.querySelector('.opt-add').click();
      log.push('afterAdd=' + rows());

      document.getElementById('title').value = 'QA T-09 test';
      var sel = document.getElementById('classSubject');
      if (sel.options.length) sel.selectedIndex = 0;
      document.getElementById('seconds').value = '20';
      document.getElementById('numQuestions').value = '1';
      card.querySelector('.q-text').value = 'What is 2 + 2?';
      var opts = card.querySelectorAll('.opt-input');
      var vals = ['3','4','5','6'];
      opts.forEach(function(inp, i){ inp.value = vals[i] || ('opt' + i); });
      card.querySelectorAll('input[type=radio]')[1].checked = true;

      log.push('radios=' + Array.prototype.map.call(card.querySelectorAll('input[type=radio]'), function(r){return r.value}).join(','));

      setTimeout(function(){
        document.getElementById('form').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
        setTimeout(function(){
          var linkEl = document.getElementById('testLink');
          var link = linkEl ? linkEl.textContent : '';
          var msgEl = document.getElementById('msg') || document.querySelector('.msg');
          document.title = 'PROBE|' + log.join(' ') + ' link=' + (link || 'NONE') +
            (link ? '' : ' errMsg=' + (msgEl ? msgEl.textContent.slice(0,80) : '?'));
        }, 2500);
      }, 300);
    }, 2000);
  }
})();
