/* render.js — fills every [data-board] from the single FLOW data source.
   Works for the standalone concept files and the combined gallery. */
(function () {
  'use strict';
  var C = FLOW.CONTENT;
  var TITLE = 'Insurance carrier submissions, rebuilt as an <b>automated pipeline<span class="dot">.</span></b>';

  function flow(kind, prefix) {
    var spec = (kind === 'before') ? FLOW.BEFORE : FLOW.AFTER;
    return FlowEngine.flowSVG(Object.assign({}, spec, { id: prefix + '-' + kind }));
  }

  function fill(root) {
    var prefix = root.getAttribute('data-prefix') || 'b';
    var q = function (s) { return root.querySelector(s); };

    var el;
    if ((el = q('.slot-ttl'))) el.innerHTML = TITLE;
    if ((el = q('.slot-sub'))) el.textContent = C.subhead;
    if ((el = q('.slot-time-before'))) el.innerHTML = '<b>6 to 8 hours</b> per submission';
    if ((el = q('.slot-time-after')))  el.innerHTML = '<b>1 to 2 hours</b> per submission';
    if ((el = q('.slot-flow-before'))) el.innerHTML = flow('before', prefix);
    if ((el = q('.slot-flow-after')))  el.innerHTML = flow('after', prefix);
    if ((el = q('.slot-m0'))) el.innerHTML =
      '<span class="num">' + C.metrics[0].num + '</span><span class="cap">' + C.metrics[0].cap + '</span>';
    if ((el = q('.slot-m1'))) el.innerHTML =
      '<span class="num">15% to <span class="hl">under 2%</span></span><span class="cap">' + C.metrics[1].cap + '</span>';

    root.querySelectorAll('.caps').forEach(function (c) {
      if (c.tagName === 'UL' || c.classList.contains('as-list')) {
        c.innerHTML = C.capabilities.map(function (x) { return '<li>' + x + '</li>'; }).join('');
      } else {
        c.innerHTML = C.capabilities.map(function (x) { return '<span class="cap-tag">' + x + '</span>'; }).join('');
      }
    });
  }

  function all() { document.querySelectorAll('[data-board]').forEach(fill); }
  window.fillBoard = fill;
  window.fillAllBoards = all;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all);
  else all();
})();
