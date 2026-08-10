/* sign in for real, land on the tutor page, then drive the PDF Generator */
(function(){
  function api(){try{return localStorage.getItem('edulearn_api')||location.origin}catch(e){return location.origin}}
  function tok(){try{return localStorage.getItem('edulearn_token')}catch(e){return null}}
  if(!tok()){
    var n=Math.floor(Math.random()*100000);
    fetch(api()+'/api/auth/signup/student',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name:'PDF Probe',email:'pp'+n+'@bestbrain.local',phone:'9'+(110000000+n),
        password:'Passw0rd!23',rollNumber:'6P-'+n,className:'Class 6',section:'A'})})
      .then(function(r){return r.json()}).then(function(d){
        if(d.accessToken){localStorage.setItem('edulearn_token',d.accessToken);
          localStorage.setItem('edulearn_user',JSON.stringify(d.user));}
        location.href='tutor.html?__probe=1';});
    return;
  }
  if(location.pathname.indexOf('tutor')===-1){location.href='tutor.html?__probe=1';return;}
  setTimeout(function(){
    var b=document.getElementById('kp-open');
    if(!b){document.title='PROBE|no launcher';return;}
    b.click();
    setTimeout(function(){
      var i=document.getElementById('kp-topic');
      if(!i){document.title='PROBE|no input';return;}
      i.value='Photosynthesis';
      document.querySelector('#kp [data-act=go]').click();
      setTimeout(function(){
        document.title='PROBE| preview='+(document.querySelector('.kp-prev')?'y':'n')+
          ' sections='+document.querySelectorAll('.kp-prev-bd h4').length+
          ' btns='+Array.prototype.map.call(document.querySelectorAll('#kp-out .kp-btn'),
            function(x){return x.textContent}).join('/');
      },6000);
    },800);
  },2200);
})();
