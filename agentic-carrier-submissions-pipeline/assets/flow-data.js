/* =========================================================
   flow-data.js — verbatim content + flowchart geometry
   Shared by all five concepts. Labels match the brief exactly;
   shared-step labels are identical across BEFORE and AFTER.
   Coordinate space: 720 wide, spine centred at x=320.
   ========================================================= */
(function (global) {
  'use strict';

  var CX = 320;

  /* ---------- BEFORE (manual) ---------- */
  var BEFORE = {
    id: 'before',
    width: 720, height: 1010,
    aria: 'Manual submission flow, before automation',
    nodes: [
      { id:'b1', type:'io',      x:CX, y:36,  w:250, h:54, lines:['Source documents'] },
      { id:'b2', type:'process', x:CX, y:134, w:300, h:60, lines:['Build Standard submission','by hand'] },
      { id:'b3', type:'process', x:CX, y:232, w:300, h:58, lines:['Convert to Horizon format'] },
      { id:'b4', type:'process', x:CX, y:330, w:300, h:58, lines:['Create letters of intent'] },
      { id:'b5', type:'process', x:CX, y:428, w:300, h:58, lines:['Load to CRM by hand'] },
      { id:'b6', type:'process', x:CX, y:526, w:300, h:58, variant:'human', lines:['Human QA review'] },
      { id:'b7', type:'process', x:CX, y:624, w:300, h:60, lines:['Email carriers and','submit to portals'] },
      { id:'b8', type:'process', x:CX, y:722, w:300, h:58, lines:['Log and track by hand'] },
      { id:'b9', type:'decision',x:CX, y:840, w:226, h:112, lines:['Carrier returns','errors?'] },
      { id:'b10',type:'terminal',x:CX, y:962, w:250, h:54, lines:['Submission complete'] },
      { id:'bR', type:'worker',  x:578, y:668, w:170, h:58, variant:'rework', lines:['Rework by hand'] }
    ],
    edges: [
      { from:'b1', to:'b2' }, { from:'b2', to:'b3' }, { from:'b3', to:'b4' },
      { from:'b4', to:'b5' }, { from:'b5', to:'b6' }, { from:'b6', to:'b7' },
      { from:'b7', to:'b8' }, { from:'b8', to:'b9' },
      { from:'b9', to:'b10', fromPt:'bottom', toPt:'top',
        label:'No', labelXY:[338, 925], labelAnchor:'start' },
      /* rework loop */
      { from:'b9', to:'bR', fromPt:'right', toPt:'bottom', cls:'fl-edge--loop',
        waypoints:[[578,840]], label:'Yes · ~15%', labelXY:[470,808], labelCls:'fl-elabel--loop' },
      { from:'bR', to:'b7', fromPt:'top', toPt:'right', cls:'fl-edge--loop',
        waypoints:[[578,624]] }
    ]
  };

  /* ---------- AFTER (automated) ---------- */
  var AFTER = {
    id: 'after',
    width: 720, height: 1180,
    aria: 'Automated submission pipeline, after automation',
    nodes: [
      { id:'a1', type:'io',      x:CX, y:36,   w:250, h:54, lines:['Source documents'] },
      { id:'a2', type:'process', x:CX, y:134,  w:300, h:62, variant:'auto', lines:['Extract into one','canonical data model'] },
      { id:'a3', type:'process', x:CX, y:232,  w:300, h:58, variant:'auto', lines:['Auto-generate carrier files'] },
      /* branch row of four carrier files */
      { id:'c1', type:'chip', x:212, y:300, w:66, h:44, lines:['Standard'] },
      { id:'c2', type:'chip', x:286, y:300, w:66, h:44, lines:['Horizon'] },
      { id:'c3', type:'chip', x:360, y:300, w:66, h:44, lines:['CRM','import'] },
      { id:'c4', type:'chip', x:434, y:300, w:70, h:44, lines:['Letters of','intent'] },
      { id:'a4', type:'process', x:CX, y:452,  w:300, h:60, variant:'auto', lines:['Validate: rules and','address API'] },
      { id:'a5', type:'process', x:CX, y:550,  w:300, h:58, variant:'human', lines:['Human QA review'] },
      { id:'a6', type:'decision',x:CX, y:662,  w:206, h:104, lines:['Approved?'] },
      { id:'a7', type:'process', x:CX, y:794,  w:300, h:70, variant:'auto', lines:['Dispatch: update CRM via API','and submit to carriers'] },
      { id:'a8', type:'process', x:CX, y:898,  w:300, h:64, variant:'auto', lines:['Track to closure and','Horizon error-cure'] },
      { id:'a9', type:'decision',x:CX, y:1012, w:226, h:112, lines:['Carrier returns','errors?'] },
      { id:'a10',type:'terminal',x:CX, y:1138, w:250, h:54, lines:['Submission complete'] },
      { id:'aR', type:'worker',  x:578, y:962, w:172, h:58, variant:'autorev', lines:['Auto-revise','and resubmit'] },
      { id:'aK', type:'worker',  x:96,  y:1002,w:168, h:64, variant:'knowledge', lines:['Self-improving','knowledge loop'] }
    ],
    edges: [
      { from:'a1', to:'a2' }, { from:'a2', to:'a3' },
      /* fan-out to four carrier files */
      { from:'a3', to:'c1', cls:'fl-edge--branch', waypoints:[[CX,280],[212,280]] },
      { from:'a3', to:'c2', cls:'fl-edge--branch', waypoints:[[CX,280],[286,280]] },
      { from:'a3', to:'c3', cls:'fl-edge--branch', waypoints:[[CX,280],[360,280]] },
      { from:'a3', to:'c4', cls:'fl-edge--branch', waypoints:[[CX,280],[434,280]] },
      /* fan-in to validate */
      { from:'c1', to:'a4', cls:'fl-edge--branch', waypoints:[[212,344],[CX,344]] },
      { from:'c2', to:'a4', cls:'fl-edge--branch', waypoints:[[286,344],[CX,344]] },
      { from:'c3', to:'a4', cls:'fl-edge--branch', waypoints:[[360,344],[CX,344]] },
      { from:'c4', to:'a4', cls:'fl-edge--branch', waypoints:[[434,344],[CX,344]] },
      { from:'a4', to:'a5' },
      { from:'a5', to:'a6' },
      { from:'a6', to:'a7', fromPt:'bottom', toPt:'top', label:'Yes', labelXY:[338,748], labelAnchor:'start' },
      /* approved? -> No, loop back to canonical model */
      { from:'a6', to:'a2', fromPt:'left', toPt:'left', cls:'fl-edge--loop',
        waypoints:[[70,662],[70,134]], label:'No', labelXY:[60,420], labelAnchor:'middle', labelCls:'fl-elabel--loop' },
      { from:'a7', to:'a8' },
      /* track -> self-improving knowledge loop */
      { from:'a8', to:'aK', fromPt:'left', toPt:'top', cls:'fl-edge--know',
        waypoints:[[96,898]] },
      { from:'a8', to:'a9' },
      { from:'a9', to:'a10', fromPt:'bottom', toPt:'top', label:'No', labelXY:[338,1100], labelAnchor:'start' },
      /* carrier errors? -> Yes, auto-revise, back to track */
      { from:'a9', to:'aR', fromPt:'right', toPt:'bottom', cls:'fl-edge--loop',
        waypoints:[[578,1012]], label:'Yes · <2%', labelXY:[470,980], labelCls:'fl-elabel--loop' },
      { from:'aR', to:'a8', fromPt:'top', toPt:'right', cls:'fl-edge--loop',
        waypoints:[[578,898]] }
    ]
  };

  /* ---------- supporting content ---------- */
  var CONTENT = {
    title: 'Insurance carrier submissions, rebuilt as an automated pipeline',
    subhead: 'Every provider change must be reported to more than eleven insurance carriers. The same workflow, before and after automation.',
    beforeCaption: '6 to 8 hours per submission',
    afterCaption: '1 to 2 hours per submission',
    capabilities: [
      'One canonical data model',
      'Automated document generation',
      'CRM integration over API',
      'Address validation via API',
      'Built-in validation and error handling',
      'Tracking to closure',
      'Self-improving knowledge loop',
      '1,000+ automated tests',
      'Human QA on every batch'
    ],
    metrics: [
      { num:'70%', cap:'less hands-on prep time per submission' },
      { num:'15% to under 2%', cap:'carrier rework rate' }
    ]
  };

  global.FLOW = { BEFORE: BEFORE, AFTER: AFTER, CONTENT: CONTENT };
})(window);
