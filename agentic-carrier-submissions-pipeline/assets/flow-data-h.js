/* =========================================================
   flow-data-h.js — HORIZONTAL variant of the submission flows.
   Spine runs left-to-right. Wide 2360-unit viewBox: full-width
   panels render short (so two stack inside 1024px) while nodes
   keep generous spacing. Loads AFTER flow-data.js and BEFORE
   render.js; overwrites FLOW.BEFORE / FLOW.AFTER. Labels verbatim.
   ========================================================= */
(function (global) {
  'use strict';
  if (!global.FLOW) return;

  /* ---------- BEFORE (manual) — spine left→right at y=130 ---------- */
  var BEFORE = {
    id: 'before',
    width: 2360, height: 212,
    aria: 'Manual submission flow, before automation',
    nodes: [
      { id:'b1', type:'io',      x:115,  y:66, w:150, h:52, fs:14, lines:['Source','documents'] },
      { id:'b2', type:'process', x:345,  y:66, w:172, h:66, fs:14, lines:['Build Standard','submission','by hand'] },
      { id:'b3', type:'process', x:575,  y:66, w:172, h:62, fs:14, lines:['Convert to','Horizon format'] },
      { id:'b4', type:'process', x:805,  y:66, w:172, h:62, fs:14, lines:['Create letters','of intent'] },
      { id:'b5', type:'process', x:1035, y:66, w:172, h:62, fs:14, lines:['Load to CRM','by hand'] },
      { id:'b6', type:'process', x:1265, y:66, w:172, h:62, fs:14, variant:'human', lines:['Human QA','review'] },
      { id:'b7', type:'process', x:1495, y:66, w:172, h:66, fs:14, lines:['Email carriers','and submit','to portals'] },
      { id:'b8', type:'process', x:1725, y:66, w:172, h:62, fs:14, lines:['Log and track','by hand'] },
      { id:'b9', type:'decision',x:1955, y:66, w:160, h:104, fs:14, lines:['Carrier','returns','errors?'] },
      { id:'b10',type:'terminal',x:2208, y:66, w:170, h:52, fs:14, lines:['Submission','complete'] },
      { id:'bR', type:'worker',  x:1495, y:170, w:170, h:56, fs:13.5, variant:'rework', lines:['Rework','by hand'] }
    ],
    edges: [
      { from:'b1', to:'b2', fromPt:'right', toPt:'left' },
      { from:'b2', to:'b3', fromPt:'right', toPt:'left' },
      { from:'b3', to:'b4', fromPt:'right', toPt:'left' },
      { from:'b4', to:'b5', fromPt:'right', toPt:'left' },
      { from:'b5', to:'b6', fromPt:'right', toPt:'left' },
      { from:'b6', to:'b7', fromPt:'right', toPt:'left' },
      { from:'b7', to:'b8', fromPt:'right', toPt:'left' },
      { from:'b8', to:'b9', fromPt:'right', toPt:'left' },
      { from:'b9', to:'b10', fromPt:'right', toPt:'left',
        label:'No', labelXY:[2090, 46], labelAnchor:'middle' },
      /* rework loop: decision -> rework (below) -> back to email step */
      { from:'b9', to:'bR', fromPt:'bottom', toPt:'right', cls:'fl-edge--loop',
        waypoints:[[1955,170]], label:'Yes · ~15%', labelXY:[1772,150], labelAnchor:'middle', labelCls:'fl-elabel--loop' },
      { from:'bR', to:'b7', fromPt:'top', toPt:'bottom', cls:'fl-edge--loop' }
    ]
  };

  /* ---------- AFTER (automated) — spine left→right at y=158 ---------- */
  var AFTER = {
    id: 'after',
    width: 2360, height: 340,
    aria: 'Automated submission pipeline, after automation',
    nodes: [
      { id:'a1', type:'io',      x:108,  y:158, w:150, h:52, fs:14,   lines:['Source','documents'] },
      { id:'a2', type:'process', x:300,  y:158, w:170, h:66, fs:13.5, variant:'auto',      lines:['Extract into one','canonical','data model'] },
      { id:'a3', type:'process', x:492,  y:158, w:170, h:62, fs:13.5, variant:'auto',      lines:['Auto-generate','carrier files'] },
      /* fan column of four carrier files — wide slot with clear bus gutters */
      { id:'c1', type:'chip', x:712, y:54,  w:156, h:40, fs:12.5, lines:['Standard'] },
      { id:'c2', type:'chip', x:712, y:122, w:156, h:40, fs:12.5, lines:['Horizon'] },
      { id:'c3', type:'chip', x:712, y:190, w:156, h:40, fs:12.5, lines:['CRM import'] },
      { id:'c4', type:'chip', x:712, y:258, w:156, h:40, fs:12.5, lines:['Letters of intent'] },
      { id:'a4', type:'process', x:932,  y:158, w:170, h:66, fs:13.5, variant:'auto',      lines:['Validate: rules','and address API'] },
      { id:'a5', type:'process', x:1130, y:158, w:170, h:62, fs:13.5, variant:'human',     lines:['Human QA','review'] },
      { id:'a6', type:'decision',x:1330, y:158, w:158, h:100, fs:14,  lines:['Approved?'] },
      { id:'a7', type:'process', x:1535, y:158, w:178, h:66, fs:13,   variant:'auto',      lines:['Dispatch: update CRM','via API, submit','to carriers'] },
      { id:'a8', type:'process', x:1745, y:158, w:178, h:66, fs:13,   variant:'auto',      lines:['Track to closure','and Horizon','error-cure'] },
      { id:'a9', type:'decision',x:1955, y:158, w:160, h:104, fs:14,  lines:['Carrier','returns','errors?'] },
      { id:'a10',type:'terminal',x:2208, y:158, w:170, h:52, fs:14,   lines:['Submission','complete'] },
      { id:'aR', type:'worker',  x:1745, y:296, w:178, h:58, fs:13,   variant:'autorev',   lines:['Auto-revise','and resubmit'] },
      { id:'aK', type:'worker',  x:1745, y:60,  w:182, h:54, fs:13,   variant:'knowledge', lines:['Self-improving','knowledge loop'] }
    ],
    edges: [
      { from:'a1', to:'a2', fromPt:'right', toPt:'left' },
      { from:'a2', to:'a3', fromPt:'right', toPt:'left' },
      /* fan-out to four carrier files via a vertical bus at x=600 */
      { from:'a3', to:'c1', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[600,54]] },
      { from:'a3', to:'c2', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[600,122]] },
      { from:'a3', to:'c3', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[600,190]] },
      { from:'a3', to:'c4', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[600,258]] },
      /* fan-in to validate via a vertical bus at x=824 */
      { from:'c1', to:'a4', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[824,54]] },
      { from:'c2', to:'a4', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[824,122]] },
      { from:'c3', to:'a4', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[824,190]] },
      { from:'c4', to:'a4', fromPt:'right', toPt:'left', cls:'fl-edge--branch', waypoints:[[824,258]] },
      { from:'a4', to:'a5', fromPt:'right', toPt:'left' },
      { from:'a5', to:'a6', fromPt:'right', toPt:'left' },
      { from:'a6', to:'a7', fromPt:'right', toPt:'left', label:'Yes', labelXY:[1424,143], labelAnchor:'middle' },
      /* approved? -> No, loop back (below spine) to canonical model */
      { from:'a6', to:'a2', fromPt:'bottom', toPt:'bottom', cls:'fl-edge--loop',
        waypoints:[[1330,304],[300,304]], label:'No', labelXY:[815,288], labelAnchor:'middle', labelCls:'fl-elabel--loop' },
      { from:'a7', to:'a8', fromPt:'right', toPt:'left' },
      /* track -> self-improving knowledge loop (above spine, dashed) */
      { from:'a8', to:'aK', fromPt:'top', toPt:'bottom', cls:'fl-edge--know' },
      { from:'a8', to:'a9', fromPt:'right', toPt:'left' },
      { from:'a9', to:'a10', fromPt:'right', toPt:'left', label:'No', labelXY:[2079,138], labelAnchor:'middle' },
      /* carrier errors? -> Yes, auto-revise (below), back to track */
      { from:'a9', to:'aR', fromPt:'bottom', toPt:'right', cls:'fl-edge--loop',
        waypoints:[[1955,296]], label:'Yes · <2%', labelXY:[1887,278], labelAnchor:'middle', labelCls:'fl-elabel--loop' },
      { from:'aR', to:'a8', fromPt:'top', toPt:'bottom', cls:'fl-edge--loop' }
    ]
  };

  global.FLOW.BEFORE = BEFORE;
  global.FLOW.AFTER  = AFTER;
})(window);
