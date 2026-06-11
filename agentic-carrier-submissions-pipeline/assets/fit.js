/* fit.js — scale fixed-size .sheet elements to fit their container width on
   screen, keeping native size for print. Auto-wraps each .sheet in a .fit. */
(function () {
  'use strict';
  function wrap() {
    document.querySelectorAll('.sheet').forEach(function (s) {
      if (!s.parentElement || !s.parentElement.classList.contains('fit')) {
        var w = document.createElement('div');
        w.className = 'fit';
        s.parentElement.insertBefore(w, s);
        w.appendChild(s);
      }
    });
  }
  function fit() {
    document.querySelectorAll('.fit').forEach(function (f) {
      var s = f.querySelector(':scope > .sheet');
      if (!s) return;
      s.style.transform = 'none';
      var avail = f.clientWidth;
      var sw = s.offsetWidth;
      var scale = Math.min(1, avail / sw);
      s.style.transformOrigin = 'top center';
      s.style.transform = 'scale(' + scale + ')';
      f.style.height = (s.offsetHeight * scale) + 'px';
    });
  }
  function init() { wrap(); fit(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
  window.addEventListener('load', fit);
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fit); }
  window.__fit = fit;
})();
