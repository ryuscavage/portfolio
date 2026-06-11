/* =========================================================
   flow-engine.js — accurate SVG flowchart renderer
   Shapes: io (parallelogram), process, worker, chip (rect),
           decision (diamond), terminal (stadium)
   Edges : spine (straight), loops & branches (explicit waypoints)
   Colours come from CSS classes so concepts can re-theme freely.
   ========================================================= */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  /* ---- geometry helpers ---- */
  function box(n){ return { l:n.x-n.w/2, r:n.x+n.w/2, t:n.y-n.h/2, b:n.y+n.h/2, cx:n.x, cy:n.y }; }
  function anchor(n, side){
    var b = box(n);
    if (n.type === 'decision'){
      switch(side){
        case 'top':    return [n.x, b.t];
        case 'bottom': return [n.x, b.b];
        case 'left':   return [b.l, n.y];
        case 'right':  return [b.r, n.y];
      }
    }
    switch(side){
      case 'top':    return [n.x, b.t];
      case 'bottom': return [n.x, b.b];
      case 'left':   return [b.l, n.y];
      case 'right':  return [b.r, n.y];
      default:       return [n.x, n.y];
    }
  }

  /* rounded-corner polyline path from an array of [x,y] points */
  function roundedPath(pts, r){
    if (pts.length < 2) return '';
    if (pts.length === 2){
      return 'M' + pts[0][0] + ',' + pts[0][1] + ' L' + pts[1][0] + ',' + pts[1][1];
    }
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length - 1; i++){
      var p0 = pts[i-1], p1 = pts[i], p2 = pts[i+1];
      var v1 = norm(p0, p1), v2 = norm(p1, p2);
      var d1 = Math.min(r, dist(p0,p1)/2), d2 = Math.min(r, dist(p1,p2)/2);
      var a = [p1[0] - v1[0]*d1, p1[1] - v1[1]*d1];
      var b = [p1[0] + v2[0]*d2, p1[1] + v2[1]*d2];
      d += ' L' + a[0] + ',' + a[1] + ' Q' + p1[0] + ',' + p1[1] + ' ' + b[0] + ',' + b[1];
    }
    var last = pts[pts.length-1];
    d += ' L' + last[0] + ',' + last[1];
    return d;
  }
  function dist(a,b){ return Math.hypot(b[0]-a[0], b[1]-a[1]); }
  function norm(a,b){ var dx=b[0]-a[0], dy=b[1]-a[1], m=Math.hypot(dx,dy)||1; return [dx/m, dy/m]; }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---- shape renderers ---- */
  function shape(n){
    var b = box(n);
    switch(n.type){
      case 'io': {
        var s = (n.skew != null ? n.skew : 18);
        var p = [ [b.l+s, b.t], [b.r, b.t], [b.r-s, b.b], [b.l, b.b] ];
        return '<polygon class="fl-shape fl-io" points="' + p.map(function(q){return q.join(',');}).join(' ') + '"/>';
      }
      case 'decision': {
        var p2 = [ [n.x, b.t], [b.r, n.y], [n.x, b.b], [b.l, n.y] ];
        return '<polygon class="fl-shape fl-dec" points="' + p2.map(function(q){return q.join(',');}).join(' ') + '"/>';
      }
      case 'terminal': {
        return '<rect class="fl-shape fl-term" x="'+b.l+'" y="'+b.t+'" width="'+n.w+'" height="'+n.h+'" rx="'+(n.h/2)+'" ry="'+(n.h/2)+'"/>';
      }
      default: {
        var cls = 'fl-shape ' + ({process:'fl-proc',worker:'fl-worker',chip:'fl-chip'}[n.type] || 'fl-proc');
        if (n.variant) cls += ' fl-' + n.variant;
        return '<rect class="'+cls+'" x="'+b.l+'" y="'+b.t+'" width="'+n.w+'" height="'+n.h+'" rx="2" ry="2"/>';
      }
    }
  }

  function label(n){
    var lines = n.lines || [String(n.label||'')];
    var fs = n.fs || (n.type==='chip' ? 12.5 : (n.type==='worker' ? 13.5 : 15));
    var lh = n.lh || (fs + 3.5);
    var startY = n.y - (lines.length-1) * lh/2;
    var cls = 'fl-label fl-label--' + n.type + (n.textCls ? ' '+n.textCls : '');
    var t = '<text class="'+cls+'" x="'+n.x+'" y="'+startY+'" text-anchor="middle" dominant-baseline="middle" style="font-size:'+fs+'px">';
    for (var i=0;i<lines.length;i++){
      t += '<tspan x="'+n.x+'" dy="'+(i===0?0:lh)+'">'+esc(lines[i])+'</tspan>';
    }
    t += '</text>';
    return t;
  }

  /* ---- edge renderer ---- */
  function edge(e, nmap, prefix){
    var from = nmap[e.from], to = nmap[e.to];
    var start = anchor(from, e.fromPt || 'bottom');
    var end   = anchor(to,   e.toPt   || 'top');
    var pts = [start].concat(e.waypoints || []).concat([end]);
    var cls = 'fl-edge ' + (e.cls || 'fl-edge--spine') + (e.dashed ? ' fl-edge--dashed' : '');
    var d = roundedPath(pts, e.r != null ? e.r : 9);
    var out = '<path class="'+cls+'" d="'+d+'" marker-end="url(#'+prefix+'-arrow)" fill="none"/>';
    if (e.label){
      var lx = e.labelXY[0], ly = e.labelXY[1];
      out += '<text class="fl-elabel '+(e.labelCls||'')+'" x="'+lx+'" y="'+ly+'" text-anchor="'+(e.labelAnchor||'middle')+'" dominant-baseline="middle">'+esc(e.label)+'</text>';
    }
    return out;
  }

  /* ---- main ---- */
  function flowSVG(spec){
    var prefix = spec.id;
    var nmap = {};
    spec.nodes.forEach(function(n){ nmap[n.id]=n; });

    var defs = '<defs>'
      + '<marker id="'+prefix+'-arrow" viewBox="0 0 12 12" refX="9.5" refY="6" '
      + 'markerWidth="9" markerHeight="9" orient="auto-start-reverse" markerUnits="userSpaceOnUse">'
      + '<path d="M1,1 L11,6 L1,11 L3.4,6 z" fill="context-stroke"/></marker>'
      + '</defs>';

    var edgesSVG = (spec.edges||[]).map(function(e){ return edge(e, nmap, prefix); }).join('');
    var nodesSVG = spec.nodes.map(function(n){ return '<g class="fl-node">' + shape(n) + label(n) + '</g>'; }).join('');
    var extra = spec.overlay || '';

    return '<svg class="flow-svg" viewBox="0 0 '+spec.width+' '+spec.height+'" '
      + 'preserveAspectRatio="xMidYMin meet" xmlns="'+NS+'" role="img" aria-label="'+esc(spec.aria||'process flow diagram')+'">'
      + defs + '<g class="fl-edges">' + edgesSVG + '</g>' + nodesSVG + extra + '</svg>';
  }

  global.FlowEngine = { flowSVG: flowSVG, anchor: anchor, box: box };
})(window);
