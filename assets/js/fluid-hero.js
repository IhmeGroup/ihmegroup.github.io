/**
 * fluid-hero.js
 *
 * 2D incompressible Navier–Stokes fluid simulation for the homepage hero.
 * Visual style inspired by amandaghassaei/gpu-io fluid demo:
 *   · Warm cream/linen background
 *   · Dark navy ink swirling in the flow
 *   · "FX LAB" text = solid no-slip obstacle (calm letters in swirling ink)
 *   · Mouse *hover* (no click needed) stirs the fluid
 *   · Vorticity confinement keeps swirls alive without inflow
 *
 * Numerics: semi-Lagrangian advection, Jacobi pressure projection,
 *           vorticity confinement, no-slip obstacle BCs.
 * Requires: WebGL + OES_texture_half_float (or OES_texture_float).
 * Falls back gracefully to the static image carousel when unavailable.
 */

(function () {
  'use strict';

  /* ── Configuration ──────────────────────────────────────────────────────── */
  var SIM_RES         = 720;    // sim grid height; width ∝ canvas aspect ratio
  var PRESSURE_ITER   = 20;     // Jacobi iterations per frame
  var VEL_DECAY       = 0.9995; // velocity dissipation per frame
  var DYE_DECAY       = 0.99999;  // dye dissipation per frame
  var VORTICITY       = 0.4;    // vorticity confinement strength
  var SPLAT_RADIUS    = 0.020;  // Gaussian splat radius in UV space
  var SPLAT_FORCE     = 80.0;  // mouse velocity force magnitude
  var AUTO_SPLAT_MS   = 4000;   // ms between automatic stirring splats

  /* Cream / linen palette matching the gpu-io fluid demo */
  var BG_COLOR     = [0.98, 0.922, 0.843];  // warm cream background
  var INK_COLOR    = [0.00, 0.00,  0.20 ];  // dark navy ink
  var LETTER_COLOR = [0.98, 0.922, 0.843];  // letter fill — set independently, e.g. [1,1,1] for white
  var BORDER_COLOR = [0.08, 0.06, 0.18 ];  // letter outline colour (dark navy by default)
  var BORDER_WIDTH = 0.000;               // border width in UV space (~3 px at 1000 px wide)

  /* ── GLSL Shaders ────────────────────────────────────────────────────────── */

  /* Shared vertex shader — fullscreen quad */
  var VS = [
    'attribute vec2 aPos;',
    'varying   vec2 vUv;',
    'void main() {',
    '  vUv = aPos * 0.5 + 0.5;',
    '  gl_Position = vec4(aPos, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Semi-Lagrangian advection of any scalar / vector field */
  var FS_ADVECT = [
    'precision highp float;',
    'uniform sampler2D uField;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uObstacle;',
    'uniform vec2  uTexel;',
    'uniform float uDt;',
    'uniform float uDissipation;',
    'varying vec2 vUv;',
    'void main() {',
    '  if (texture2D(uObstacle, vUv).r > 0.5) { gl_FragColor = vec4(0.0); return; }',
    '  vec2 vel  = texture2D(uVelocity, vUv).xy;',
    '  vec2 prev = vUv - uDt * vel;',
    '  prev = clamp(prev, uTexel, 1.0 - uTexel);',
    '  gl_FragColor = uDissipation * texture2D(uField, prev);',
    '}'
  ].join('\n');

  /* Divergence of the velocity field (obstacle cells contribute zero velocity) */
  var FS_DIVERGENCE = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uObstacle;',
    'uniform vec2 uTexel;',
    'varying vec2 vUv;',
    '#define obs(off) (texture2D(uObstacle, vUv + off).r > 0.5)',
    'void main() {',
    '  vec2 L = texture2D(uVelocity, vUv - vec2(uTexel.x, 0.0)).xy;',
    '  vec2 R = texture2D(uVelocity, vUv + vec2(uTexel.x, 0.0)).xy;',
    '  vec2 B = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).xy;',
    '  vec2 T = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).xy;',
    '  if (obs(vec2(-uTexel.x, 0.0))) L = vec2(0.0);',
    '  if (obs(vec2( uTexel.x, 0.0))) R = vec2(0.0);',
    '  if (obs(vec2(0.0, -uTexel.y))) B = vec2(0.0);',
    '  if (obs(vec2(0.0,  uTexel.y))) T = vec2(0.0);',
    '  gl_FragColor = vec4(0.5 * (R.x - L.x + T.y - B.y), 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Jacobi iteration for the pressure Poisson equation */
  var FS_PRESSURE = [
    'precision highp float;',
    'uniform sampler2D uPressure;',
    'uniform sampler2D uDivergence;',
    'uniform sampler2D uObstacle;',
    'uniform vec2 uTexel;',
    'varying vec2 vUv;',
    'void main() {',
    '  float C = texture2D(uPressure,   vUv).r;',
    '  float L = texture2D(uPressure,   vUv - vec2(uTexel.x, 0.0)).r;',
    '  float R = texture2D(uPressure,   vUv + vec2(uTexel.x, 0.0)).r;',
    '  float B = texture2D(uPressure,   vUv - vec2(0.0, uTexel.y)).r;',
    '  float T = texture2D(uPressure,   vUv + vec2(0.0, uTexel.y)).r;',
    '  float div = texture2D(uDivergence, vUv).r;',
    '  /* Neumann BC at obstacles */',
    '  if (texture2D(uObstacle, vUv-vec2(uTexel.x,0.0)).r>0.5) L=C;',
    '  if (texture2D(uObstacle, vUv+vec2(uTexel.x,0.0)).r>0.5) R=C;',
    '  if (texture2D(uObstacle, vUv-vec2(0.0,uTexel.y)).r>0.5) B=C;',
    '  if (texture2D(uObstacle, vUv+vec2(0.0,uTexel.y)).r>0.5) T=C;',
    '  gl_FragColor = vec4((L+R+B+T - div)*0.25, 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Subtract pressure gradient to enforce incompressibility */
  var FS_GRADIENT = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uPressure;',
    'uniform sampler2D uObstacle;',
    'uniform vec2 uTexel;',
    'varying vec2 vUv;',
    'void main() {',
    '  if (texture2D(uObstacle, vUv).r > 0.5) { gl_FragColor = vec4(0.0); return; }',
    '  float C = texture2D(uPressure, vUv).r;',
    '  float L = texture2D(uPressure, vUv-vec2(uTexel.x,0.0)).r;',
    '  float R = texture2D(uPressure, vUv+vec2(uTexel.x,0.0)).r;',
    '  float B = texture2D(uPressure, vUv-vec2(0.0,uTexel.y)).r;',
    '  float T = texture2D(uPressure, vUv+vec2(0.0,uTexel.y)).r;',
    '  if (texture2D(uObstacle, vUv-vec2(uTexel.x,0.0)).r>0.5) L=C;',
    '  if (texture2D(uObstacle, vUv+vec2(uTexel.x,0.0)).r>0.5) R=C;',
    '  if (texture2D(uObstacle, vUv-vec2(0.0,uTexel.y)).r>0.5) B=C;',
    '  if (texture2D(uObstacle, vUv+vec2(0.0,uTexel.y)).r>0.5) T=C;',
    '  vec2 vel = texture2D(uVelocity, vUv).xy;',
    '  vel -= 0.5 * vec2(R-L, T-B);',
    '  gl_FragColor = vec4(vel, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Enforce no-slip at obstacle cells; slip walls at domain edges */
  var FS_BOUNDARY = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uObstacle;',
    'uniform vec2 uTexel;',
    'varying vec2 vUv;',
    'void main() {',
    '  if (texture2D(uObstacle, vUv).r > 0.5) { gl_FragColor = vec4(0.0); return; }',
    '  vec2 vel = texture2D(uVelocity, vUv).xy;',
    '  /* Slip walls at domain edges */',
    '  if (vUv.x < uTexel.x * 1.5) vel.x = max(vel.x, 0.0);',
    '  if (vUv.x > 1.0 - uTexel.x * 1.5) vel.x = min(vel.x, 0.0);',
    '  if (vUv.y < uTexel.y * 1.5) vel.y = max(vel.y, 0.0);',
    '  if (vUv.y > 1.0 - uTexel.y * 1.5) vel.y = min(vel.y, 0.0);',
    '  /* Velocity cap to prevent CFL blow-up */',
    '  float spd = length(vel);',
    '  if (spd > 25.0) vel *= 25.0 / spd;',
    '  gl_FragColor = vec4(vel, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Compute scalar 2D vorticity: ω = ∂v/∂x − ∂u/∂y */
  var FS_CURL = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform vec2 uTexel;',
    'varying vec2 vUv;',
    'void main() {',
    '  float vR = texture2D(uVelocity, vUv + vec2(uTexel.x,  0.0)).y;',
    '  float vL = texture2D(uVelocity, vUv - vec2(uTexel.x,  0.0)).y;',
    '  float uT = texture2D(uVelocity, vUv + vec2(0.0, uTexel.y)).x;',
    '  float uB = texture2D(uVelocity, vUv - vec2(0.0, uTexel.y)).x;',
    '  float curl = 0.5 * ((vR - vL) - (uT - uB));',
    '  gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Vorticity confinement: reinforce existing vortices to resist dissipation */
  var FS_VORTICITY = [
    'precision highp float;',
    'uniform sampler2D uVelocity;',
    'uniform sampler2D uCurl;',
    'uniform sampler2D uObstacle;',
    'uniform vec2  uTexel;',
    'uniform float uConfinement;',
    'uniform float uDt;',
    'varying vec2 vUv;',
    'void main() {',
    '  if (texture2D(uObstacle, vUv).r > 0.5) { gl_FragColor = vec4(0.0); return; }',
    '  float cL = texture2D(uCurl, vUv - vec2(uTexel.x,  0.0)).r;',
    '  float cR = texture2D(uCurl, vUv + vec2(uTexel.x,  0.0)).r;',
    '  float cB = texture2D(uCurl, vUv - vec2(0.0,  uTexel.y)).r;',
    '  float cT = texture2D(uCurl, vUv + vec2(0.0,  uTexel.y)).r;',
    '  float curl = texture2D(uCurl, vUv).r;',
    '  /* Gradient of |ω|, normalised */',
    '  vec2 dC = vec2(abs(cR) - abs(cL), abs(cT) - abs(cB));',
    '  vec2 N  = dC / (length(dC) + 1e-5);',
    '  /* Force perpendicular to ∇|ω|, proportional to ω: f = ε·ω·(N⊥) */',
    '  vec2 force = uConfinement * curl * vec2(N.y, -N.x);',
    '  vec2 vel   = texture2D(uVelocity, vUv).xy + uDt * force;',
    '  gl_FragColor = vec4(vel, 0.0, 1.0);',
    '}'
  ].join('\n');

  /* Gaussian splat of velocity or dye at a point (aspect-ratio corrected) */
  var FS_SPLAT = [
    'precision highp float;',
    'uniform sampler2D uBase;',
    'uniform vec2  uPoint;',
    'uniform vec3  uValue;',
    'uniform float uRadius;',
    'uniform float uAspect;',
    'varying vec2 vUv;',
    'void main() {',
    '  vec2 p = vUv - uPoint;',
    '  p.x *= uAspect;',
    '  float s = exp(-dot(p, p) / uRadius);',
    '  gl_FragColor = vec4(texture2D(uBase, vUv).rgb + s * uValue, 1.0);',
    '}'
  ].join('\n');

  /* Render dye: cream bg + dark ink + smooth letter border.
   * uObsD is full-canvas-resolution with LINEAR filtering, so the border
   * is always crisp regardless of simulation grid resolution. */
  var FS_DISPLAY = [
    'precision highp float;',
    'uniform sampler2D uDye;',
    'uniform sampler2D uObsD;',
    'uniform vec3  uBg;',
    'uniform vec3  uInk;',
    'uniform vec3  uLetterColor;',
    'uniform vec3  uBorderColor;',
    'uniform float uBorderW;',
    'varying vec2 vUv;',
    'void main() {',
    '  float obs = texture2D(uObsD, vUv).r;',
    '  if (obs > 0.5) { gl_FragColor = vec4(uLetterColor, 1.0); return; }',
    '  float d  = uBorderW, d2 = d * 0.707;',
    '  float n0 = texture2D(uObsD, vUv+vec2( d,  0.0)).r;',
    '  float n1 = texture2D(uObsD, vUv+vec2(-d,  0.0)).r;',
    '  float n2 = texture2D(uObsD, vUv+vec2(0.0,  d )).r;',
    '  float n3 = texture2D(uObsD, vUv+vec2(0.0, -d )).r;',
    '  float n4 = texture2D(uObsD, vUv+vec2( d2,  d2)).r;',
    '  float n5 = texture2D(uObsD, vUv+vec2(-d2,  d2)).r;',
    '  float n6 = texture2D(uObsD, vUv+vec2( d2, -d2)).r;',
    '  float n7 = texture2D(uObsD, vUv+vec2(-d2, -d2)).r;',
    '  float near   = max(max(max(n0,n1),max(n2,n3)),max(max(n4,n5),max(n6,n7)));',
    '  float border  = smoothstep(0.2, 0.85, near);',
    '  vec3  dye    = texture2D(uDye, vUv).rgb;',
    '  float c      = clamp(length(dye) * 5.5, 0.0, 1.0);',
    '  vec3  fluid  = mix(uBg, uInk, c);',
    '  gl_FragColor = vec4(mix(fluid, uBorderColor, border), 1.0);',
    '}'
  ].join('\n');

  /* ── WebGL helpers ───────────────────────────────────────────────────────── */

  function mkShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[fluid-hero] shader compile error:\n', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function mkProg(gl, vsrc, fsrc) {
    var p = gl.createProgram();
    var vs = mkShader(gl, gl.VERTEX_SHADER,   vsrc);
    var fs = mkShader(gl, gl.FRAGMENT_SHADER, fsrc);
    if (!vs || !fs) return null;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('[fluid-hero] link error:', gl.getProgramInfoLog(p));
      return null;
    }
    p.u = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var info = gl.getActiveUniform(p, i);
      p.u[info.name] = gl.getUniformLocation(p, info.name);
    }
    return p;
  }

  function mkFBO(gl, w, h, fmt, type, filter) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, type, null);
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex: tex, fb: fb, w: w, h: h };
  }

  function mkDouble(gl, w, h, fmt, type, filter) {
    var a = mkFBO(gl, w, h, fmt, type, filter);
    var b = mkFBO(gl, w, h, fmt, type, filter);
    return {
      read:  a,
      write: b,
      swap:  function () { var t = this.read; this.read = this.write; this.write = t; }
    };
  }

  /* Render "Fₓ" (F with subscript X) to a 2D canvas → obstacle texture.
   * White = solid obstacle / letter interior; black = fluid domain. */
  /* smooth=false → NEAREST (for physics, snaps to grid)
   * smooth=true  → LINEAR  (for display, gives anti-aliased edges & border) */
  function mkObstacleTex(gl, w, h, smooth) {
    var oc  = document.createElement('canvas');
    oc.width = w; oc.height = h;
    var ctx = oc.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    ctx.textBaseline = 'alphabetic';
    ctx.textAlign    = 'left';

    var fSize   = Math.floor(h * 0.70);
    var subSize = Math.floor(fSize * 0.60);
    var FONT    = '"Arial Black", "Helvetica Neue", Arial, sans-serif';

    function measurePair() {
      ctx.font = '900 ' + fSize + 'px ' + FONT;
      var fw = ctx.measureText('F').width;
      ctx.font = '900 ' + subSize + 'px ' + FONT;
      var xw = ctx.measureText('X').width;
      /* Subscript X left edge is placed at 78% of F's width —
       * tight LaTeX-style, sitting just inside the right side of F */
      return { fw: fw, xw: xw, total: fw * 0.78 + xw };
    }

    var m = measurePair();
    if (m.total > w * 0.55) {
      var scale = (w * 0.55) / m.total;
      fSize   = Math.floor(fSize   * scale);
      subSize = Math.floor(subSize * scale);
      m = measurePair();
    }

    /* Vertical centre: account for cap heights of both glyphs */
    var baseline = h * 0.5 + 0.36 * (fSize - subSize);
    var startX   = (w - m.total) * 0.5;

    ctx.fillStyle = '#fff';

    /* Main "F" */
    ctx.font = '900 ' + fSize + 'px ' + FONT;
    ctx.fillText('F', startX, baseline);

    /* Subscript "X": tucked close, positioned at 78% of F width horizontally
     * and dropped 30% of main font size vertically */
    ctx.font = '900 ' + subSize + 'px ' + FONT;
    ctx.fillText('X', startX + m.fw * 0.78, baseline + fSize * 0.30);

    var filter = smooth ? gl.LINEAR : gl.NEAREST;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    /* Flip Y so canvas top-down matches WebGL bottom-up UV space */
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oc);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
  }

  /* ── Main initialisation ─────────────────────────────────────────────────── */
  function init() {
    var winDiv = document.querySelector('.homepage-hero__window');
    if (!winDiv) return;

    var carousel = winDiv.querySelector('.homepage-carousel');
    if (carousel) carousel.style.display = 'none';

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;aspect-ratio:11/5;cursor:crosshair;';
    winDiv.appendChild(canvas);

    var gl = canvas.getContext('webgl',
               { alpha: false, antialias: false, preserveDrawingBuffer: false })
          || canvas.getContext('experimental-webgl',
               { alpha: false, antialias: false });

    if (!gl) { canvas.remove(); if (carousel) carousel.style.display = ''; return; }

    /* Float texture support */
    var halfExt  = gl.getExtension('OES_texture_half_float');
    var halfLin  = gl.getExtension('OES_texture_half_float_linear');
    var floatExt = gl.getExtension('OES_texture_float');
    var floatLin = gl.getExtension('OES_texture_float_linear');
    var FTYPE, FFILTER;
    if (halfExt) {
      FTYPE = halfExt.HALF_FLOAT_OES; FFILTER = halfLin ? gl.LINEAR : gl.NEAREST;
    } else if (floatExt) {
      FTYPE = gl.FLOAT;                FFILTER = floatLin ? gl.LINEAR : gl.NEAREST;
    } else {
      canvas.remove(); if (carousel) carousel.style.display = ''; return;
    }

    /* ── Compile programs ──────────────────────────────────────────── */
    var P = {
      advect:    mkProg(gl, VS, FS_ADVECT),
      diverge:   mkProg(gl, VS, FS_DIVERGENCE),
      pressure:  mkProg(gl, VS, FS_PRESSURE),
      gradient:  mkProg(gl, VS, FS_GRADIENT),
      boundary:  mkProg(gl, VS, FS_BOUNDARY),
      curl:      mkProg(gl, VS, FS_CURL),
      vorticity: mkProg(gl, VS, FS_VORTICITY),
      splat:     mkProg(gl, VS, FS_SPLAT),
      display:   mkProg(gl, VS, FS_DISPLAY),
    };
    for (var k in P) { if (!P[k]) { canvas.remove(); if (carousel) carousel.style.display=''; return; } }

    /* ── Fullscreen quad ───────────────────────────────────────────── */
    var qBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    function blit(target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null);
      gl.viewport(0, 0, target ? target.w : canvas.width, target ? target.h : canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function use(prog) {
      gl.useProgram(prog);
      var loc = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      return prog.u;
    }

    function t(tex, unit) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    }

    /* ── FBO management ────────────────────────────────────────────── */
    var vel, pres, dye, div, curl;
    var obsP; // physics obstacle — sim resolution, NEAREST (for fluid BCs)
    var obsD; // display obstacle — canvas resolution, LINEAR  (for smooth border)
    var simW, simH;

    function rebuildFBOs(W, H) {
      var aspect = W / H;
      simW = Math.round(SIM_RES * aspect);
      simH = SIM_RES;
      vel  = mkDouble(gl, simW, simH, gl.RGBA, FTYPE,   FFILTER);
      pres = mkDouble(gl, simW, simH, gl.RGBA, FTYPE,   gl.NEAREST);
      dye  = mkDouble(gl, simW, simH, gl.RGBA, FTYPE,   FFILTER);
      div  = mkDouble(gl, simW, simH, gl.RGBA, FTYPE,   gl.NEAREST);
      curl = mkDouble(gl, simW, simH, gl.RGBA, FTYPE,   gl.NEAREST);
      obsP = mkObstacleTex(gl, simW, simH, false); // physics: coarse + sharp
      obsD = mkObstacleTex(gl, W,    H,    true);  // display: full-res + smooth
    }

    function resizeCanvas() {
      var r  = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W  = Math.round(r.width  * dpr);
      var H  = Math.round(r.height * dpr);
      if (canvas.width === W && canvas.height === H) return;
      canvas.width  = W;
      canvas.height = H;
      rebuildFBOs(W, H);
    }

    resizeCanvas();
    var _rt; window.addEventListener('resize', function () { clearTimeout(_rt); _rt = setTimeout(resizeCanvas, 160); });

    /* ── Simulation step ───────────────────────────────────────────── */
    function step(dt) {
      var tx = 1.0 / simW, ty = 1.0 / simH;
      var asp = simW / simH;
      var u;

      /* 1. Advect velocity */
      u = use(P.advect);
      t(vel.read.tex,0); gl.uniform1i(u.uField,0);
      t(vel.read.tex,1); gl.uniform1i(u.uVelocity,1);
      t(obsP,2);         gl.uniform1i(u.uObstacle,2);
      gl.uniform2f(u.uTexel,tx,ty); gl.uniform1f(u.uDt,dt); gl.uniform1f(u.uDissipation,VEL_DECAY);
      blit(vel.write); vel.swap();

      /* 2. Vorticity: compute curl */
      u = use(P.curl);
      t(vel.read.tex,0); gl.uniform1i(u.uVelocity,0);
      gl.uniform2f(u.uTexel,tx,ty);
      blit(curl.write); curl.swap();

      /* 3. Vorticity confinement */
      u = use(P.vorticity);
      t(vel.read.tex, 0);  gl.uniform1i(u.uVelocity,0);
      t(curl.read.tex,1);  gl.uniform1i(u.uCurl,1);
      t(obsP,2);           gl.uniform1i(u.uObstacle,2);
      gl.uniform2f(u.uTexel,tx,ty);
      gl.uniform1f(u.uConfinement, VORTICITY);
      gl.uniform1f(u.uDt, dt);
      blit(vel.write); vel.swap();

      /* 4. Boundary: obstacle no-slip + domain slip walls + velocity cap */
      u = use(P.boundary);
      t(vel.read.tex,0); gl.uniform1i(u.uVelocity,0);
      t(obsP,1);         gl.uniform1i(u.uObstacle,1);
      gl.uniform2f(u.uTexel,tx,ty);
      blit(vel.write); vel.swap();

      /* 5. Divergence */
      u = use(P.diverge);
      t(vel.read.tex,0); gl.uniform1i(u.uVelocity,0);
      t(obsP,1);         gl.uniform1i(u.uObstacle,1);
      gl.uniform2f(u.uTexel,tx,ty);
      blit(div.write); div.swap();

      /* 6. Clear pressure */
      gl.bindFramebuffer(gl.FRAMEBUFFER, pres.read.fb);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);

      /* 7. Jacobi pressure solve */
      for (var i = 0; i < PRESSURE_ITER; i++) {
        u = use(P.pressure);
        t(pres.read.tex,0); gl.uniform1i(u.uPressure,0);
        t(div.read.tex,1);  gl.uniform1i(u.uDivergence,1);
        t(obsP,2);          gl.uniform1i(u.uObstacle,2);
        gl.uniform2f(u.uTexel,tx,ty);
        blit(pres.write); pres.swap();
      }

      /* 8. Gradient subtraction */
      u = use(P.gradient);
      t(vel.read.tex, 0); gl.uniform1i(u.uVelocity,0);
      t(pres.read.tex,1); gl.uniform1i(u.uPressure,1);
      t(obsP,2);          gl.uniform1i(u.uObstacle,2);
      gl.uniform2f(u.uTexel,tx,ty);
      blit(vel.write); vel.swap();

      /* 9. Advect dye */
      u = use(P.advect);
      t(dye.read.tex, 0); gl.uniform1i(u.uField,0);
      t(vel.read.tex, 1); gl.uniform1i(u.uVelocity,1);
      t(obsP,2);          gl.uniform1i(u.uObstacle,2);
      gl.uniform2f(u.uTexel,tx,ty); gl.uniform1f(u.uDt,dt); gl.uniform1f(u.uDissipation,DYE_DECAY);
      blit(dye.write); dye.swap();

      /* 10. Display */
      u = use(P.display);
      t(dye.read.tex, 0); gl.uniform1i(u.uDye,  0);
      t(obsD,         1); gl.uniform1i(u.uObsD, 1);
      gl.uniform3f(u.uBg,          BG_COLOR[0],     BG_COLOR[1],     BG_COLOR[2]);
      gl.uniform3f(u.uInk,         INK_COLOR[0],    INK_COLOR[1],    INK_COLOR[2]);
      gl.uniform3f(u.uLetterColor, LETTER_COLOR[0], LETTER_COLOR[1], LETTER_COLOR[2]);
      gl.uniform3f(u.uBorderColor, BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
      gl.uniform1f(u.uBorderW,     BORDER_WIDTH);
      blit(null);
    }

    /* ── Splat helpers ─────────────────────────────────────────────── */
    function addSplat(x, y, dx, dy, col) {
      var asp = simW / simH;
      var r2  = SPLAT_RADIUS * SPLAT_RADIUS;

      /* Velocity */
      var u = use(P.splat);
      t(vel.read.tex,0); gl.uniform1i(u.uBase,0);
      gl.uniform2f(u.uPoint,x,y);
      gl.uniform3f(u.uValue, dx * SPLAT_FORCE, dy * SPLAT_FORCE, 0.0);
      gl.uniform1f(u.uRadius,r2); gl.uniform1f(u.uAspect,asp);
      blit(vel.write); vel.swap();

      /* Dye — dark ink, full magnitude */
      u = use(P.splat);
      t(dye.read.tex,0); gl.uniform1i(u.uBase,0);
      gl.uniform2f(u.uPoint,x,y);
      gl.uniform3f(u.uValue, col[0], col[1], col[2]);
      gl.uniform1f(u.uRadius, r2 * 1.6); gl.uniform1f(u.uAspect,asp);
      blit(dye.write); dye.swap();
    }

    /* ── Pre-warm: seed a few vortices before first render ─────────── */
    function prewarm() {
      /* Scatter 6 rotational splats to seed initial turbulence */
      var seeds = [
        [0.18, 0.35,  0.09, -0.12],
        [0.35, 0.70, -0.10,  0.09],
        [0.55, 0.28,  0.12,  0.10],
        [0.72, 0.65, -0.09, -0.11],
        [0.85, 0.40,  0.10, -0.08],
        [0.42, 0.50, -0.11,  0.09],
      ];
      for (var i = 0; i < seeds.length; i++) {
        var s = seeds[i];
        addSplat(s[0], s[1], s[2], s[3], INK_COLOR);
      }
      /* Run a few invisible frames to develop initial vortex structure */
      for (var j = 0; j < 25; j++) step(0.016);
    }

    /* ── Mouse / touch interaction ─────────────────────────────────── */
    /* Hover (pointermove) creates flow — same as gpu-io demo */
    var _lastX = -1, _lastY = -1;

    function onPointerMove(e) {
      var r  = canvas.getBoundingClientRect();
      var cx = (e.clientX !== undefined) ? e.clientX : e.touches[0].clientX;
      var cy = (e.clientY !== undefined) ? e.clientY : e.touches[0].clientY;
      var x  = (cx - r.left) / r.width;
      var y  = 1.0 - (cy - r.top) / r.height;

      if (_lastX >= 0) {
        var dx = x - _lastX;
        var dy = y - _lastY;
        if (Math.abs(dx) + Math.abs(dy) > 0.0005) {
          /* Colour: rotate hue based on cursor position */
          var col = hsvToRgb(((x + y) * 0.5) % 1.0, 0.6, 0.5);
          /* Scale col down to stay in dark-ink range */
          col[0] *= 0.22; col[1] *= 0.22; col[2] *= 0.22;
          /* Bias toward dark navy */
          col[0] += INK_COLOR[0] * 0.5;
          col[1] += INK_COLOR[1] * 0.5;
          col[2] += INK_COLOR[2] * 0.5;
          addSplat(x, y, dx, dy, col);
        }
      }
      _lastX = x; _lastY = y;
    }

    function onPointerLeave() { _lastX = -1; _lastY = -1; }

    canvas.addEventListener('pointermove',  onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('touchmove', function (e) { e.preventDefault(); onPointerMove(e); }, { passive: false });
    canvas.addEventListener('touchend',  onPointerLeave);

    /* ── Auto-splats: keep fluid alive when idle ───────────────────── */
    var _autoPositions = [
      [0.12, 0.22], [0.25, 0.72], [0.45, 0.30], [0.60, 0.75],
      [0.78, 0.35], [0.90, 0.65], [0.35, 0.15], [0.70, 0.85],
    ];
    var _autoIdx = 0;

    function doAutoSplat() {
      var pos = _autoPositions[_autoIdx % _autoPositions.length];
      _autoIdx++;
      var angle = Math.random() * Math.PI * 2;
      var mag   = 0.04 + Math.random() * 0.04;
      addSplat(pos[0], pos[1], Math.cos(angle) * mag, Math.sin(angle) * mag, INK_COLOR);
    }

    var _autoTimer = setInterval(doAutoSplat, AUTO_SPLAT_MS);

    /* ── Animation loop ────────────────────────────────────────────── */
    var _lastTime = null;

    function loop(now) {
      requestAnimationFrame(loop);
      resizeCanvas();
      var dt = _lastTime ? Math.min((now - _lastTime) / 1000, 0.033) : 0.016;
      _lastTime = now;
      step(dt);
    }

    /* Prewarm off the render path, then kick off the loop */
    prewarm();
    requestAnimationFrame(loop);
  }

  /* ── Colour utility ──────────────────────────────────────────────────────── */
  function hsvToRgb(h, s, v) {
    var i = Math.floor(h * 6), f = h * 6 - i;
    var p = v * (1 - s), q = v * (1 - f * s), tk = v * (1 - (1 - f) * s);
    var r, g, b;
    switch (i % 6) {
      case 0: r=v;  g=tk; b=p;  break;
      case 1: r=q;  g=v;  b=p;  break;
      case 2: r=p;  g=v;  b=tk; break;
      case 3: r=p;  g=q;  b=v;  break;
      case 4: r=tk; g=p;  b=v;  break;
      default:r=v;  g=p;  b=q;  break;
    }
    return [r, g, b];
  }

  /* ── Boot ────────────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
