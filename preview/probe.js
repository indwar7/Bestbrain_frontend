(function(){
  if(location.pathname.indexOf('login')===-1)return;
  function box(){var b=document.querySelector('#ka-slot button[type=submit]');
    if(!b)return '-';var r=b.getBoundingClientRect();return Math.round(r.width)+'x'+Math.round(r.height);}
  setTimeout(function(){
    var before=box();
    var b=document.querySelector('#ka-slot button[type=submit]');
    var span=b.querySelector('span')||b;
    span.textContent='Signing in…';
    setTimeout(function(){
      document.title='PROBE| btn '+before+' -> '+box()+
        ' busy='+(b.classList.contains('is-busy')?'y':'n');
    },800);
  },3500);
})();
