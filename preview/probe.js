/* ============================================================
   Preview probe — opt-in via ?__probe=1, read-only.
   Never loads during ordinary browsing. Reports what the skin
   actually rendered, so a regression is caught by measurement
   rather than by eye:

     white  — surfaces still painted light on the dark canvas
     ink    — text that fails contrast against what sits behind it
     sky    — stars / icons / formulas that reached the page
     order  — chapters lifted for having real content
   ============================================================ */
(function () {
  function lum(str) {
    var n = (str || '').match(/[\d.]+/g);
    if (!n || n.length < 3) return null;
    var f = str.indexOf('color(srgb') === 0 ? 255 : 1;
    if (n.length > 3 && parseFloat(n[3]) < .5) return null;
    return (0.2126 * n[0] * f + 0.7152 * n[1] * f + 0.0722 * n[2] * f) / 255;
  }
  function ownsText(n) {
    for (var i = 0; i < n.childNodes.length; i++)
      if (n.childNodes[i].nodeType === 3 && n.childNodes[i].nodeValue.trim()) return true;
    return false;
  }
  function surface(n) {
    var w = n, hops = 0;
    while (w && w !== document.documentElement && hops < 10) {
      var cs = getComputedStyle(w);
      if (!w.classList.contains('kid-seam')) {
        var l = lum(cs.backgroundColor);
        if (l !== null) return l;
        var bi = cs.backgroundImage;
        if (bi && bi.indexOf('gradient') !== -1) {
          var st = bi.match(/rgba?\([^)]+\)/g);
          if (st) {
            var t = 0, k = 0;
            for (var q = 0; q < st.length; q++) { var v = lum(st[q]); if (v !== null) { t += v; k++; } }
            if (k) return t / k;
          }
        }
      }
      w = w.parentElement; hops++;
    }
    return 0.02;
  }
  setTimeout(function () {
    var all = document.body.querySelectorAll('*'), white = 0, low = 0;
    for (var i = 0; i < all.length; i++) {
      var n = all[i];
      if (n.closest('.kb-sky')) continue;
      var cs = getComputedStyle(n), r = n.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      var bl = lum(cs.backgroundColor);
      if (bl === null && cs.backgroundImage && cs.backgroundImage.indexOf('gradient') !== -1) {
        /* a light gradient is a light surface — a colour-only test walks past
           the sticky header that is exactly that */
        var st = cs.backgroundImage.match(/rgba?\([^)]+\)/g), t = 0, k = 0;
        if (st) for (var q = 0; q < st.length; q++) { var v = lum(st[q]); if (v !== null) { t += v; k++; } }
        if (k) bl = t / k;
      }
      if (bl !== null && bl > .8 && r.width > 90 && r.height > 22) white++;
      if (ownsText(n) && cs.visibility !== 'hidden' && cs.opacity !== '0') {
        var tc = lum(cs.webkitTextFillColor || cs.color);
        if (tc !== null) {
          var sb = surface(n);
          if ((Math.max(tc, sb) + .05) / (Math.min(tc, sb) + .05) < 3) low++;
        }
      }
    }
    var sky = document.querySelector('body > .kb-sky');
    document.title = 'PROBE| white=' + white + ' lowcontrast=' + low +
      ' stars=' + (sky ? sky.querySelectorAll('.kb-star').length : 0) +
      ' icons=' + (sky ? sky.querySelectorAll('.kb-i').length : 0) +
      ' formulas=' + (sky ? sky.querySelectorAll('.kb-f').length : 0) +
      ' contentTags=' + document.querySelectorAll('.kc-tag').length;
  }, 9000);
})();
