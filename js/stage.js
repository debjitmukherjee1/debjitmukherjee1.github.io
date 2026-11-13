/* ============================================================================
   stage.js — the 3D landscape behind every page.
   ----------------------------------------------------------------------------
   Each published call from Ledger is one ridge: left edge = the day of the
   call, height = return since, depth = order of publication (newest nearest).
   Exports the scene controls used by home.js (camera views, focusing a ridge,
   changing the colour of the "world") and by the small ambient script on the
   inner pages. Pointing at the landscape names the nearest call; clicking it
   opens the note. three.js is free (MIT) and served from js/vendor/ on this site.
   ========================================================================== */
import * as THREE from "./vendor/three.module.min.js";

const DM = window.DM;
const $ = (s, r) => (r || document).querySelector(s);
const MOTION = DM.HAS_GSAP, gsap = window.gsap, root = document.documentElement;

/* ---------- worlds: the colour of the page at each point ------------------ */
export const WORLDS = DM.WORLDS;   // defined in site.js so the page can colour itself before this module loads
const world = { a: new THREE.Color(WORLDS.open[0]), b: new THREE.Color(WORLDS.open[1]) };
export function setWorld(name, dur) {
  const w = WORLDS[name] || WORLDS.calm, a = new THREE.Color(w[0]), b = new THREE.Color(w[1]);
  if (MOTION) { gsap.to(world.a, { r: a.r, g: a.g, b: a.b, duration: dur == null ? 1.2 : dur, ease: "power2.out", overwrite: true }); gsap.to(world.b, { r: b.r, g: b.g, b: b.b, duration: dur == null ? 1.2 : dur, ease: "power2.out", overwrite: true }); }
  else { world.a.copy(a); world.b.copy(b); }
  root.style.setProperty("--w1", w[0]); root.style.setProperty("--w2", w[1]);
}

/* ---------- the 3D stage --------------------------------------------------- */
export const stage = { ok: false, hover: -1, canHover: true, goal: { p: new THREE.Vector3(0, 3.4, 18), l: new THREE.Vector3(0, .6, -14) }, ridges: [], active: -1, dim: 0, views: {} };
const W = 28, S = 1.7, FLOOR = -7, YS = .1;
export function buildStage(calls) {
  const canvas = $("#stage"); if (!canvas) return;
  const small = innerWidth < 760;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true }); renderer.setClearColor(0x000000, 0); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.25 : 1.5));
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(small ? 58 : 44, 1, .1, 400);
  const N = calls.length, DEPTH = N * S;
  let t0 = Infinity, t1 = -Infinity;
  calls.forEach(c => c.series.forEach(p => { const t = Date.parse(p.d); if (t < t0) t0 = t; if (t > t1) t1 = t; }));
  const X = t => (t - t0) / (t1 - t0) * W - W / 2;
  const U = { uA: { value: world.a }, uB: { value: world.b }, uNear: { value: 8 }, uFar: { value: 70 }, uTime: { value: 0 } };

  const fillVS = "uniform float uRise; varying float vH; varying float vD; varying float vX; varying float vY; void main(){ vH = uv.y; vec3 p0 = position; if (uv.y > 0.5) p0.y *= uRise; vX = p0.x; vY = p0.y; vec4 mv = modelViewMatrix * vec4(p0,1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }";
  const fillFS = [
    "uniform vec3 uA; uniform vec3 uB; uniform float uNear; uniform float uFar; uniform float uGlow; uniform vec3 uHot; uniform float uTime;",
    "varying float vH; varying float vD; varying float vX; varying float vY;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }",
    "void main(){",
    "  float near = 1.0 - smoothstep(uNear, uFar * 0.6, vD);",                                    // texture is for nearby ridges; far ones stay calm
    "  float hatch = smoothstep(0.62, 0.98, 0.5 + 0.5 * sin(vX * 44.0));",                         // fine vertical engraving lines
    "  float bands = smoothstep(0.80, 1.0, 0.5 + 0.5 * sin(vY * 7.5 + vX * 0.35 - uTime * 0.55));", // contour bands drifting down the wall
    "  float grain = noise(vec2(vX * 22.0, vY * 22.0 + uTime * 0.12)) - 0.5;",
    "  float flow = noise(vec2(vX * 0.9 - uTime * 0.18, vY * 1.6));",                              // slow light moving along the ridge
    "  float body = pow(vH, 3.2);",
    "  float tex = (hatch * 0.5 * pow(vH, 1.5) + bands * 0.22 * vH + grain * 0.3 * vH + (flow - 0.5) * 0.35 * pow(vH, 2.0)) * near;",
    "  float amt = clamp(body + tex * (0.4 + uGlow * 0.6), 0.0, 1.0);",
    "  vec3 top = mix(uB, uA, 0.32 + uGlow * 0.5);",
    "  vec3 c = mix(uB, top, amt);",
    "  c += uA * pow(vH, 16.0) * (0.22 + uGlow * 0.55);",                                          // glow just under the crest
    "  c = mix(c, uHot, uGlow * pow(vH, 9.0) * 0.3);",
    "  float f = smoothstep(uNear, uFar, vD);",
    "  gl_FragColor = vec4(mix(c, uB, f * 0.9), 1.0);",
    "}"].join("\n");
  const lineVS = "attribute float side; uniform float uThick; uniform float uRise; varying float vU; varying float vD; void main(){ vU = uv.x; vec3 p = position; p.y = p.y * uRise + side * uThick; vec4 mv = modelViewMatrix * vec4(p,1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }";
  const lineFS = "uniform vec3 uA; uniform vec3 uLine; uniform float uNear; uniform float uFar; uniform float uDraw; uniform float uAlpha; uniform float uPulse; uniform float uTime; varying float vU; varying float vD;" +
    "void main(){ if (vU > uDraw) discard; float f = smoothstep(uNear, uFar, vD); float d = abs(vU - fract(uTime * 0.16)); float pz = uPulse * smoothstep(0.09, 0.0, d); vec3 c = mix(uLine, uA, f * 0.55) + uA * pz * 1.4 + vec3(pz * 0.6); gl_FragColor = vec4(c, min(1.0, uAlpha * (1.0 - f * 0.75) + pz)); }";

  calls.forEach((c, i) => {
    const z = -i * S, base = c.series[0].c;
    // each ridge runs the full width: left edge = the day of the call, right edge = today (or the day it was closed)
    const m = c.series.length - 1, pts = c.series.map((p, j) => [j / m * W - W / 2, (p.c / base - 1) * 100 * YS]);
    const last = pts[pts.length - 1];
    const n = pts.length, fp = new Float32Array(n * 6), fuv = new Float32Array(n * 4), lp = new Float32Array(n * 6), luv = new Float32Array(n * 4), ls = new Float32Array(n * 2), idx = [];
    const endU = 1;
    pts.forEach((p, j) => {
      fp.set([p[0], p[1], z, p[0], FLOOR, z], j * 6); fuv.set([0, 1, 0, 0], j * 4);
      lp.set([p[0], p[1], z + .012, p[0], p[1], z + .012], j * 6); const u = (p[0] + W / 2) / W; luv.set([u, 1, u, 0], j * 4); ls.set([1, -1], j * 2);
      if (j < n - 1) idx.push(j * 2, j * 2 + 1, j * 2 + 2, j * 2 + 1, j * 2 + 3, j * 2 + 2);
    });
    const fg = new THREE.BufferGeometry(); fg.setAttribute("position", new THREE.BufferAttribute(fp, 3)); fg.setAttribute("uv", new THREE.BufferAttribute(fuv, 2)); fg.setIndex(idx);
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.BufferAttribute(lp, 3)); lg.setAttribute("uv", new THREE.BufferAttribute(luv, 2)); lg.setAttribute("side", new THREE.BufferAttribute(ls, 1)); lg.setIndex(idx);
    const rise = { value: MOTION ? 0 : 1 };
    const fm = new THREE.ShaderMaterial({ vertexShader: fillVS, fragmentShader: fillFS, side: THREE.DoubleSide, uniforms: Object.assign({ uGlow: { value: 0 }, uRise: rise, uHot: { value: new THREE.Color("#ffffff") } }, U) });
    const lm = new THREE.ShaderMaterial({ vertexShader: lineVS, fragmentShader: lineFS, side: THREE.DoubleSide, transparent: true, uniforms: Object.assign({ uThick: { value: .028 }, uRise: rise, uPulse: { value: 0 }, uLine: { value: new THREE.Color("#e9ebf5") }, uDraw: { value: MOTION ? 0 : 1 }, uAlpha: { value: .75 } }, U) });
    // a soft additive copy of the line: the glow that switches on when a call is in focus
    const gm = new THREE.ShaderMaterial({ vertexShader: lineVS, fragmentShader: lineFS, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: Object.assign({ uThick: { value: .34 }, uRise: rise, uPulse: { value: 0 }, uLine: { value: world.a }, uDraw: { value: 1 }, uAlpha: { value: 0 } }, U) });
    const glow = new THREE.Mesh(lg, gm); glow.renderOrder = i; glow.position.z = .02; scene.add(glow);
    const fill = new THREE.Mesh(fg, fm), line = new THREE.Mesh(lg, lm); fill.renderOrder = i; line.renderOrder = i;
    scene.add(fill, line);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.11, 16, 12), new THREE.MeshBasicMaterial({ color: "#f6eed9" })); dot.position.set(last[0], last[1], z + .02); dot.scale.setScalar(.6); scene.add(dot);
    stage.ridges.push({ call: c, fm, lm, gm, rise, dot, end: new THREE.Vector3(last[0], last[1], z), z, endU });
  });

  // a flat sun on the horizon and a little dust in the air
  // a black hole on the horizon: a dark core, a thin photon ring, and an accretion disk seen almost edge-on,
  // with the far side of the disk bent up and over the top by the hole's gravity. Drawn in one shader on a flat plane.
  const holeFS = [
    "uniform vec3 uA; uniform float uTime; varying vec2 vP;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }",
    "void main(){",
    "  vec2 p = vP; float r = length(p); const float R = 0.2;",
    "  float core = smoothstep(R, R - 0.006, r);",
    "  float ring = exp(-pow((r - R * 1.04) / 0.008, 2.0)) * 1.25;",                                   // photon ring
    "  float ang = atan(p.y, p.x);",
    "  float streak = 0.55 + 0.45 * noise(vec2(ang * 5.0 - uTime * 0.25, r * 26.0));",
    "  float arc = exp(-pow((r - R * 1.42) / 0.085, 2.0)) * 0.42 * streak * (0.45 + 0.55 * abs(p.y) / max(r, 0.001));",   // lensed far side of the disk
    "  vec2 q = vec2(p.x, p.y * 9.5 + p.x * 0.6); float d = length(q);",                              // the disk itself, nearly edge-on
    "  float qa = atan(q.y, q.x);",
    "  float lanes = noise(vec2(qa * 9.0 - uTime * 0.5 + d * 6.0, d * 46.0)) * (0.6 + 0.4 * noise(vec2(d * 90.0, qa * 3.0)));",
    "  float disk = smoothstep(R * 1.1, R * 1.4, d) * pow(smoothstep(R * 4.6, R * 1.5, d), 1.6) * (0.16 + 0.95 * lanes);",
    "  disk *= 1.0 + 0.42 * (-q.x / max(d, 0.001));",                                                 // the side turning toward us is brighter
    "  float front = disk * smoothstep(-0.004, 0.02, -(p.y * 9.5 + p.x * 0.6) / 9.5);",       // the near half passes in front of the core
    "  float back = disk * (1.0 - core);",
    "  float halo = 0.2 * exp(-max(r - R, 0.0) * 7.0) * (1.0 - core);",
    "  float lum = ring * (1.0 - core * 0.2) + arc * (1.0 - core) + max(front, back) + halo;",
    "  vec3 hot = mix(vec3(1.0), uA, 0.45); vec3 col = mix(uA, hot, clamp(lum, 0.0, 1.0)) * lum;",
    "  float alpha = clamp(max(core, lum), 0.0, 1.0);",
    "  col = mix(col, vec3(0.0), core * (1.0 - clamp(front * 1.4, 0.0, 1.0)) * (1.0 - clamp(ring, 0.0, 1.0)));",
    "  gl_FragColor = vec4(col, alpha);",
    "}"].join("\n");
  const HR = 13 / 0.2;
  const hole = new THREE.Mesh(new THREE.PlaneGeometry(HR * 2, HR * 2), new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uA: U.uA, uTime: U.uTime },
    vertexShader: "varying vec2 vP; void main(){ vP = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }", fragmentShader: holeFS }));
  hole.position.set(4, 3.4, -DEPTH - 26); hole.renderOrder = -5; scene.add(hole);
  function stars(n, size, opacity) {
    const pp = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pp.set([(Math.random() - .5) * 150, Math.random() * 56 - 8, 16 - Math.random() * (DEPTH + 90)], i * 3);
    const pts = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ color: "#ffffff", size, transparent: true, opacity, sizeAttenuation: true, depthWrite: false }));
    scene.add(pts); return pts;
  }
  const dust = stars(small ? 500 : 1700, .07, .75), bright = stars(small ? 60 : 170, .2, .9);
  // camera views
  const mid = -DEPTH / 2;
  stage.views.hero = { p: new THREE.Vector3(0, 3.6, 19), l: new THREE.Vector3(1.5, 1.1, mid) };
  stage.views.dive = { p: new THREE.Vector3(-2.5, 1.5, 1.5), l: new THREE.Vector3(5, 2.2, -DEPTH - 30) };
  stage.views.record = { p: new THREE.Vector3(0, 34, mid + 12), l: new THREE.Vector3(0, 0, mid - 1) };
  stage.views.calm = { p: new THREE.Vector3(-6, 6.5, 22), l: new THREE.Vector3(2, 1, mid) };
  stage.views.call = i => { const r = stage.ridges[i], e = r.end; return { p: new THREE.Vector3(e.x - (small ? 2.5 : 8.5), e.y + 3.4, r.z + (small ? 12 : 9)), l: new THREE.Vector3(e.x - (small ? 3 : 7), e.y * .5 + .3, r.z) }; };
  stage.goal.p.copy(stage.views.hero.p); stage.goal.l.copy(stage.views.hero.l);

  const cur = { p: stage.goal.p.clone().add(new THREE.Vector3(0, 9, 10)), l: stage.goal.l.clone() }, mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener("pointermove", e => { mouse.x = e.clientX / innerWidth - .5; mouse.y = e.clientY / innerHeight - .5; }, { passive: true });
  function size() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  size(); addEventListener("resize", size);

  const baseFov = cam.fov; let fov = baseFov;
  let last = performance.now(), running = true;
  // Slow machine (software rendering, an old integrated GPU): after a short sample, stop animating the
  // landscape and draw it only while the camera is moving. Glass effects are switched off too (.low-power).
  let sampleFrames = 0, sampleStart = 0, slow = false, frameNo = 0;
  document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(frame); } });
  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const k = 1 - Math.exp(-dt * 2.4);
    cur.p.lerp(stage.goal.p, k); cur.l.lerp(stage.goal.l, k);
    mouse.sx += (mouse.x - mouse.sx) * k; mouse.sy += (mouse.y - mouse.sy) * k;
    cam.position.set(cur.p.x + mouse.sx * 1.6, cur.p.y - mouse.sy * 1.0, cur.p.z);
    cam.lookAt(cur.l.x + mouse.sx * .6, cur.l.y, cur.l.z);
    U.uTime.value = now / 1000;
    stage.ridges.forEach(r => { r.dot.position.y = r.end.y * r.rise.value; });
    const ln = DM.lenis && DM.lenis(), vel = ln ? Math.abs(ln.velocity || 0) : 0;          // scroll faster, the lens opens up
    fov += ((baseFov + Math.min(16, vel * .28)) - fov) * k; if (Math.abs(cam.fov - fov) > .02) { cam.fov = fov; cam.updateProjectionMatrix(); }
    stage.cam = cam;
    dust.position.x = Math.sin(now * .00006) * 2; dust.rotation.y = now * .000008;
    bright.material.opacity = .6 + .35 * Math.sin(now * .0017); bright.rotation.y = now * .000005;
    frameNo++;
    if (!sampleStart) sampleStart = now;
    else if (!slow && now - sampleStart < 4000) sampleFrames++;
    else if (!slow && sampleFrames && sampleFrames / ((now - sampleStart) / 1000) < 24 && now - sampleStart < 4500) {
      slow = stage.slow = true; root.classList.add("low-power");
    }
    const moving = cur.p.distanceToSquared(stage.goal.p) + cur.l.distanceToSquared(stage.goal.l) > 1e-4;
    if (slow ? moving || frameNo % 30 === 0 : !(stage.quiet && frameNo % 2)) renderer.render(scene, cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  stage.ok = true;
  root.classList.add("has-stage");
  if (MOTION) stage.ridges.forEach((r, i) => {
    gsap.to(r.lm.uniforms.uDraw, { value: 1, duration: 2.2, delay: .2 + i * .045, ease: "power2.inOut" });
    gsap.to(r.rise, { value: 1, duration: 2.4, delay: .5 + i * .05, ease: "elastic.out(1, .55)" });     // the landscape rises out of a flat sea, nearest ridge first
  });
  // point at the landscape: the nearest call lights up and names itself; click opens the note
  const tip = document.createElement("div"); tip.className = "ridge-tip"; document.body.appendChild(tip);
  const v3 = new THREE.Vector3();
  function pick(e) {
    if (!stage.canHover || stage.active > -1 || (e.target.closest && e.target.closest("a,button,.sheet,.pal,.nav"))) return hoverRidge(-1);
    let best = -1, bd = 90 * 90, bx = 0, by = 0;
    stage.ridges.forEach((r, i) => { v3.set(r.end.x, r.end.y * r.rise.value, r.z).project(cam); if (v3.z > 1) return; const x = (v3.x + 1) / 2 * innerWidth, y = (1 - v3.y) / 2 * innerHeight, d = (x - e.clientX) ** 2 + (y - e.clientY) ** 2; if (d < bd) { bd = d; best = i; bx = x; by = y; } });
    hoverRidge(best);
    if (best > -1) { const c = stage.ridges[best].call; tip.innerHTML = "<b>" + DM.esc(c.ticker) + "</b> " + DM.esc(c.market === "India" ? "valuation note" : c.rating) + '<span>' + (c.return_pct > 0 ? "+" : c.return_pct < 0 ? "−" : "") + Math.abs(c.return_pct).toFixed(1) + "% since the call</span>"; tip.style.transform = "translate(" + bx + "px," + by + "px)"; }
    tip.classList.toggle("on", best > -1); document.body.classList.toggle("ridge-hot", best > -1);
  }
  function hoverRidge(i) {
    if (stage.hover === i) return; stage.hover = i;
    if (i < 0) { tip.classList.remove("on"); document.body.classList.remove("ridge-hot"); }
    if (stage.active > -1) return;
    stage.ridges.forEach((r, j) => { const on = j === i; r.lm.uniforms.uThick.value = on ? .07 : .028; r.lm.uniforms.uAlpha.value = on ? 1 : i > -1 ? .35 : .75; r.lm.uniforms.uPulse.value = on ? 1 : 0; r.gm.uniforms.uAlpha.value = on ? .16 : 0; r.fm.uniforms.uGlow.value = on ? .8 : 0; r.dot.scale.setScalar(on ? 1.7 : .6); });
  }
  stage.hoverOff = () => hoverRidge(-1);
  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    addEventListener("pointermove", pick, { passive: true });
    addEventListener("click", e => { if (stage.hover < 0 || stage.active > -1 || (e.target.closest && e.target.closest("a,button,input,.sheet,.pal,.nav,[data-open],tr"))) return; const tk = stage.ridges[stage.hover].call.ticker, m = DM.MODELS.find(x => x.tk === tk); if (m) DM.openResearch(m); });
  }
}
export function goView(v) { if (!stage.ok || !v) return; stage.goal.p.copy(v.p); stage.goal.l.copy(v.l); }
export function blendView(a, b, t) { if (!stage.ok) return; stage.goal.p.lerpVectors(a.p, b.p, t); stage.goal.l.lerpVectors(a.l, b.l, t); }
export function focusRidge(i) {
  if (!stage.ok || stage.active === i) return; stage.active = i; if (stage.hoverOff) stage.hoverOff();
  stage.ridges.forEach((r, j) => {
    const on = j === i, any = i > -1;
    const set = (o, v, d) => MOTION ? gsap.to(o, { value: v, duration: d || .9, ease: "power2.out", overwrite: true }) : (o.value = v);
    set(r.fm.uniforms.uGlow, on ? 1 : 0); set(r.lm.uniforms.uThick, on ? .075 : .028); set(r.lm.uniforms.uAlpha, on ? 1 : any ? .22 : .75); set(r.gm.uniforms.uAlpha, on ? .22 : 0); set(r.lm.uniforms.uPulse, on ? 1 : 0, .4);
    r.lm.uniforms.uLine.value.set(on ? "#ffffff" : "#e9ebf5");
    if (MOTION) gsap.to(r.dot.scale, { x: on ? 1.9 : .6, y: on ? 1.9 : .6, z: on ? 1.9 : .6, duration: .7, overwrite: true }); else r.dot.scale.setScalar(on ? 1.9 : .6);
    if (on && MOTION) gsap.fromTo(r.lm.uniforms.uDraw, { value: Math.max(0, r.endU - .55) }, { value: 1, duration: 1.5, ease: "power2.out", overwrite: true });
  });
}

