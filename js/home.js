/* ============================================================================
   home.js — the Overview page (index.html): a scroll-driven film.
   ----------------------------------------------------------------------------
   One fixed WebGL scene (js/stage.js) sits behind the whole page. Every published call from
   Ledger becomes a ridge in a 3D landscape (x = time since the call, height = return since
   the call, depth = order of publication). Scrolling moves a camera through
   it and changes the colour of the world:
     intro     wide view, then a dive toward the horizon as the headline
               grows and passes
     calls     one full-screen chapter per call; the camera flies to that
               call's ridge and the world takes the colour of its rating
     record    top-down view with the live track-record numbers
     the rest  the landscape dims and drifts behind tools, deals and the CV
   Text comes from js/data.js (hero.headline, models, tools…).
   If WebGL or the motion libraries are unavailable, or the visitor prefers
   reduced motion, every chapter is shown as an ordinary stacked section.
   three.js, GSAP and Lenis are free and served from js/vendor/ on this site.
   ========================================================================== */
// The 3D stage is loaded on demand (see boot). Everything readable renders first, without it,
// so a blocked or slow network still shows the whole page.
let S = null;
const ST = () => S ? S.stage : { ok: false, ridges: [], views: {} };
function goView(v) { if (S && v) S.goView(v); }
function blendView(a, b, t) { if (S && a && b) S.blendView(a, b, t); }
function focusRidge(i) { if (S) S.focusRidge(i); }
function setWorld(name, dur) {
  if (S) return S.setWorld(name, dur);
  const w = DM.WORLDS[name] || DM.WORLDS.calm;
  document.documentElement.style.setProperty("--w1", w[0]); document.documentElement.style.setProperty("--w2", w[1]);
}

const DM = window.DM;
const D = DM.D, hero = D.hero || {}, esc = DM.esc, pct = DM.pct, cls = DM.cls;
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const MOTION = DM.HAS_GSAP;
const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
const root = document.documentElement;
const ARROW = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" stroke="currentColor" stroke-width="1.4"/></svg>';

/* ---------- content -------------------------------------------------------- */
function chapters() {
  // two rounds of REDUCE → BUY-rated → HOLD, newest first within each, so the world keeps changing colour
  const withCall = DM.RATED.filter(m => m.tk);     // US notes; Indian notes carry no rating
  const g = { R: withCall.filter(m => m.rating === "REDUCE"), B: withCall.filter(m => m.rating === "BUY" || m.rating === "ACCUMULATE"), H: withCall.filter(m => m.rating === "HOLD") };
  const out = []; for (let k = 0; k < 2; k++) ["R", "B", "H"].forEach(x => { if (g[x][k]) out.push(g[x][k]); });
  return out;
}
function renderIntro() {
  const h = hero.headline || [hero.tagline || ""];
  $("#h-word").innerHTML = esc(hero.name || "").split(" ").map(w => "<span>" + esc(w) + "</span>").join(" ");
  $("#h-line").innerHTML = h.map((l, i) => '<span class="hl' + (i === h.length - 1 ? " em" : "") + '"><span>' + esc(l) + "</span></span>").join("");
  $("#h-cta").innerHTML = '<a class="btn btn-solid" href="research" data-cursor="Read">The research <span class="arr">↗</span></a><a class="btn" href="mailto:' + esc(hero.email) + '">Email</a><a class="btn" href="' + esc(hero.resumeUrl) + '" target="_blank" rel="noopener">CV (PDF)</a><a class="btn" href="' + esc(hero.linkedinUrl) + '" target="_blank" rel="noopener">LinkedIn</a>';
  $("#h-status").innerHTML = '<p class="h-who">' + esc(hero.status || "") + '</p><p class="h-seek"><span class="pill live r-accumulate">' + esc(hero.seeking || "Open to opportunities") + '</span><span id="h-live"></span></p>';
  fitWord();
}
function fitWord() {
  const el = $("#h-word"); if (!el) return;
  const avail = el.parentNode.clientWidth - 2 * parseFloat(getComputedStyle(el).left || 0);
  el.style.fontSize = "100px"; el.style.right = "auto"; el.style.width = "max-content";
  const w = el.offsetWidth;
  el.style.right = ""; el.style.width = "";
  if (w) el.style.fontSize = Math.floor(100 * avail / w * 0.985) + "px";
}
function renderCalls(list) {
  const host = $("#h-calls-inner"), LED = DM.led() || {};
  host.innerHTML = list.map((m, i) => {
    const s = m.src;
    return '<article class="call-ch" data-i="' + i + '" data-rating="' + esc(m.rating) + '" aria-label="' + esc(m.name) + '">' +
      '<p class="cc-top mono"><b>Call ' + ("0" + (i + 1)).slice(-2) + " / " + ("0" + list.length).slice(-2) + "</b><span>" + esc([m.sector, m.market, m.date].join(" · ")) + "</span></p>" +
      '<h3 class="cc-tk" aria-hidden="true" style="--n:' + m.tk.length + '">' + esc(m.tk).split("").map(ch => '<span><i>' + esc(ch) + "</i></span>").join("") + "</h3>" +
      '<div class="cc-side glass"><span class="cc-stamps"><span class="stamp s-' + m.rating.toLowerCase() + '">' + esc(m.rating) + '</span><span class="cc-asof mono" data-asof="' + esc(m.id) + '">' + esc(m.date ? "Published " + m.date : "") + "</span></span>" +
      '<p class="cc-name">' + esc(m.name) + "</p>" +
      '<p class="cc-thesis">' + esc(s.thesis) + "</p>" +
      '<dl class="cc-nums"><div><dt>Fair value</dt><dd>' + esc(m.fv || "—") + "</dd></div><div><dt>Against price</dt><dd>" + (m.upside == null ? "—" : pct(m.upside)) + "</dd></div>" +
      '<div class="cc-live" hidden><dt>Since the call</dt><dd data-since="' + esc(m.id) + '">—</dd></div><div class="cc-live" hidden><dt data-bench-l="' + esc(m.id) + '">Benchmark</dt><dd data-bench="' + esc(m.id) + '">—</dd></div></dl>' +
      '<button class="btn btn-solid" type="button" data-open="' + esc(m.id) + '" data-cursor="Open">Open the note <span class="arr">↗</span></button></div></article>';
  }).join("") +
    '<article class="call-ch call-more" data-i="' + list.length + '" data-rating="open"><p class="cc-top mono"><b>And the rest</b><span>' + DM.MODELS.length + ' notes · every model attached</span></p><h3 class="cc-tk cc-tk-sm" style="--n:2"><span><i>' + DM.COVERED.length + '</i></span></h3><div class="cc-side"><p class="cc-name">companies covered</p><p class="cc-thesis">Banks on excess return. Conglomerates on sum of the parts. Staples on dividends. US names are rated against the bond yield; Indian notes are shared privately and published in full once their 12-month horizon ends.</p><a class="btn btn-solid" href="research" data-cursor="Go">The full library <span class="arr">↗</span></a></div></article>';
  $("#h-rail").innerHTML = list.map((m, i) => '<button type="button" data-go="' + i + '">' + esc(m.tk) + "</button>").join("") + '<button type="button" data-go="' + list.length + '">ALL</button>';
}
function fillCalls() {
  const LED = DM.led() || {};
  list.forEach(m => {
    const c = LED[m.tk]; if (!c) return;
    const set = (sel, v) => { const n = $(sel); if (n) n.textContent = v; };
    set('[data-since="' + m.id + '"]', pct(c.return_pct)); set('[data-bench="' + m.id + '"]', pct(c.benchmark_return_pct)); set('[data-bench-l="' + m.id + '"]', c.benchmark);
    set('[data-asof="' + m.id + '"]', DM.asOf(m));
    const art = $('.call-ch[data-i="' + list.indexOf(m) + '"]');
    if (art) { $$(".cc-live", art).forEach(n => { n.hidden = false; }); if (DM.review(m)) { const st = $(".cc-stamps", art); if (st && !$(".r-review", st)) st.insertAdjacentHTML("beforeend", '<span class="pill r-review">Under review</span>'); } }
  });
}
function renderRecord() {
  const CALLS = DM.calls(), host = $("#h-record"); if (!host) return;
  if (!CALLS.length) { host.closest("section").style.display = "none"; return; }
  const first = CALLS.map(c => c.call_date).sort()[0], updated = DM.led()._updated;
  const months = Math.max(1, Math.round((Date.now() - Date.parse(first + "T00:00:00Z")) / (30.44 * 864e5)));
  const companies = new Set(CALLS.map(c => c.ticker)).size;
  host.innerHTML = '<p class="rec-big"><span class="count" data-to="' + CALLS.length + '">' + CALLS.length + '</span></p>' +
    '<p class="rec-cap">calls logged in public at the price on the day, including the ones that went wrong.</p>' +
    '<dl class="rec-row"><div><dt>Companies</dt><dd>' + companies + "</dd></div><div><dt>First call</dt><dd>" + esc(DM.fmtDate(first)) + "</dd></div><div><dt>Record so far</dt><dd>" + months + (months === 1 ? " month" : " months") + "</dd></div><div><dt>Target horizon</dt><dd>12 months</dd></div></dl>" +
    '<p class="note" style="margin-inline:auto;text-align:center;max-width:62ch">Targets are 12-month, and the oldest call is ' + months + " months old, so it is too early to judge accuracy. Every call stays on the log and is compared with its local index; Indian calls join it once they are a year old. " +
    '<a href="https://debjitmukherjee1.github.io/ledger/" target="_blank" rel="noopener" style="text-decoration:underline">Open the log</a>' + (updated ? " · prices updated " + esc(updated) : "") + ".</p>";
  const lv = $("#h-live"); if (lv) lv.textContent = CALLS.length + " calls logged in public";
}
function renderTools() {
  const host = $("#h-tools-track"); if (!host) return;
  const tools = (D.tools || []), bench = (D.workbench || []);
  host.innerHTML = '<div class="tp tp-lead"><p class="sec-label mono">Tools</p><h2>I also build<br>the <em>software.</em></h2><p>' + tools.length + " live apps and " + bench.length + ' calculators. Free, in the browser, no sign-up.</p><p class="mono mute tp-hint">Keep scrolling →</p></div>' +
    tools.map((t, i) => '<a class="tp" href="' + esc(t.url) + '" target="_blank" rel="noopener" data-cursor="Launch" style="--tilt:' + (i % 2 ? 1.6 : -1.6) + 'deg"><div class="tp-shot"><div class="tp-bar"><i></i><i></i><i></i><span>' + esc(t.url.replace("https://", "")) + '</span></div><img src="assets/images/tools/' + esc(t.name.toLowerCase()) + '.jpg" alt="Screenshot of ' + esc(t.name) + '" loading="lazy" onerror="this.remove()"></div><div class="tp-meta"><span class="mono">' + ("0" + (i + 1)).slice(-2) + " · " + esc(t.type) + "</span><h3>" + esc(t.name) + "</h3><p>" + esc(t.summary) + "</p></div></a>").join("") +
    '<div class="tp tp-bench"><p class="sec-label mono">Workbench</p><h3>Six calculators,<br>built into this site.</h3><ul>' + bench.map((w, i) => '<li><a href="lab#' + esc(w.id) + '" data-cursor="Open"><span class="mono">' + ("0" + (i + 1)).slice(-2) + "</span><b>" + esc(w.name) + "</b><i>" + esc(w.type) + "</i>" + ARROW + "</a></li>").join("") + "</ul></div>";
}
function renderDeals() {
  const host = $("#h-deals"); if (!host) return;
  const list = (D.deals || []).filter(d => d.published).sort((a, b) => b.series - a.series);
  host.innerHTML = list.map(d => '<button class="deal-x" type="button" data-deal-open="' + esc(d.id) + '" data-cursor="Open"><span class="mono dx-top"><span>Deal Decoded #' + d.series + " · " + esc(d.sector) + '</span><span class="pill ' + (d.status === "Pending" ? "live r-accumulate" : "r-hold") + '">' + esc(d.status) + "</span></span>" +
    '<h3>' + esc(d.acquirer) + '<em>×</em>' + esc(d.target.replace(/\s*\(.*\)/, "")) + "</h3>" +
    '<p class="dx-hook">' + esc(d.hook) + "</p>" +
    '<span class="dx-keys">' + (d.keyNumbers || []).slice(0, 3).map(k => "<span><b>" + esc(k.value) + "</b>" + esc(k.label) + "</span>").join("") + "</span>" +
    '<span class="mono dx-live" data-live="' + esc(d.id) + '">' + esc(d.size) + "</span></button>").join("");
  host.addEventListener("click", e => { const b = e.target.closest("[data-deal-open]"); if (b) DM.openDeal(list.find(d => d.id === b.getAttribute("data-deal-open"))); });
  DM.trackReady.then(T => { if (!T || !T.deals) return; list.forEach(d => { const t = T.deals[d.id], n = $('[data-live="' + d.id + '"]'); if (t && n) n.textContent = "LIVE · " + DM.liveLine(t); }); });
}
function renderAbout() {
  const exp = $("#h-exp");
  if (exp) exp.innerHTML = (D.experience || []).map(x => '<a class="xp" href="about#experience" data-cursor="Profile"><span class="mono">' + esc(x.dates) + "</span><h3>" + esc(x.company) + '</h3><span class="xp-role">' + esc(x.role) + "</span>" + ARROW + "</a>").join("");
  const sk = $("#h-skills");
  if (sk && D.skills) sk.innerHTML = '<div class="wrap"><h3 class="sec-label mono">Skills</h3><div class="chips">' + (D.skills.technical || []).map(s => '<span class="chip">' + esc(s) + "</span>").join("") + "</div></div>";
}

/* ---------- choreography --------------------------------------------------- */
let list = [], activeCh = -1;
function aim(i, dur) {
  const m = list[i];
  setWorld(m ? m.rating : "open", dur);
  if (m) { const ri = ST().ridges.findIndex(r => r.call === (DM.led() || {})[m.tk]); if (ri > -1) { goView(ST().views.call(ri)); focusRidge(ri); } }
  else { goView(ST().views.hero); focusRidge(-1); }
}
function showChapter(i) {
  if (i === activeCh) return; const prev = activeCh; activeCh = i;
  const chs = $$(".call-ch"), ch = chs[i];
  $$("#h-rail button").forEach((b, j) => b.classList.toggle("on", j === i));
  chs.forEach((c, j) => c.classList.toggle("on", j === i));
  if (!ch) return;
  aim(i, 1.1);
  if (!MOTION) return;
  if (chs[prev]) gsap.to(chs[prev], { autoAlpha: 0, duration: .3, overwrite: true });
  const dir = i > prev ? 1 : -1;
  gsap.set(ch, { autoAlpha: 1 });
  gsap.fromTo($$(".cc-tk i", ch), { yPercent: 115 * dir }, { yPercent: 0, duration: 1, ease: "power4.out", stagger: .05, overwrite: true });
  gsap.fromTo($$(".cc-top, .cc-side > *", ch).filter(n => !n.classList.contains("cc-side")), { y: 36 * dir, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "power3.out", stagger: .06, delay: .12, overwrite: true });
  $$(".cc-nums dd", ch).forEach(dd => {
    const full = dd.getAttribute("data-v") || dd.textContent; dd.setAttribute("data-v", full);
    const m = /^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/.exec(full); if (!m) return;
    const to = parseFloat(m[2].replace(/,/g, "")), dp = (m[2].split(".")[1] || "").length, o = { v: 0 };
    gsap.to(o, { v: to, duration: 1.1, delay: .25, ease: "power3.out", overwrite: true, onUpdate: () => { dd.textContent = m[1] + o.v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp }) + m[3]; }, onComplete: () => { dd.textContent = full; } });
  });
  gsap.fromTo($(".cc-side", ch), { y: 60 * dir, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .9, ease: "power3.out", overwrite: true });
}
function choreograph() {
  if (!MOTION) { root.classList.add("static-home"); setWorld("open", 0); return; }
  gsap.registerPlugin(ScrollTrigger);
  // intro: the headline grows and passes as the camera dives
  const intro = gsap.timeline({ scrollTrigger: { trigger: ".h-intro", start: "top top", end: "+=70%", pin: true, scrub: .6,
    onUpdate: s => { if (ST().ok) blendView(ST().views.hero, ST().views.dive, gsap.parseEase("power2.inOut")(s.progress)); },
    onLeave: () => {}, onEnterBack: () => { setWorld("open"); focusRidge(-1); } } });
  intro.to("#h-word", { yPercent: -130, opacity: 0, ease: "power2.in", duration: .22 }, 0)
    .to(".h-foot, .h-status", { autoAlpha: 0, y: 30, duration: .12 }, 0)
    .to("#h-line", { scale: 2.1, yPercent: -34, xPercent: 0, ease: "power2.inOut", duration: .55 }, 0)
    .to("#h-line", { scale: 9, opacity: 0, ease: "power2.in", duration: .4 }, .58);
  // calls: one chapter per step
  const n = list.length + 1;
  gsap.set(".call-ch", { autoAlpha: 0 });
  ScrollTrigger.create({ trigger: ".h-calls", start: "top top", end: "+=" + n * 55 + "%", pin: true,
    onUpdate: s => showChapter(Math.min(n - 1, Math.floor(s.progress * n))),
    onEnter: () => { root.classList.add("in-calls"); showChapter(0); }, onEnterBack: () => { root.classList.add("in-calls"); showChapter(n - 1); },
    onLeave: () => root.classList.remove("in-calls"), onLeaveBack: () => { root.classList.remove("in-calls"); const c = $$(".call-ch")[activeCh]; if (c) gsap.to(c, { autoAlpha: 0, duration: .3 }); activeCh = -1; setWorld("open"); focusRidge(-1); } });
  $("#h-rail").addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (!b) return; const st = ScrollTrigger.getAll().find(t => t.trigger && t.trigger.classList.contains("h-calls")); if (!st) return; const y = st.start + (st.end - st.start) * ((+b.getAttribute("data-go") + .5) / n); DM.lenis() ? DM.lenis().scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: "smooth" }); });
  // record: from above
  ScrollTrigger.create({ trigger: ".h-rec", start: "top 70%", end: "bottom 30%", onEnter: toRecord, onEnterBack: toRecord });
  function toRecord() { if (S) ST().quiet = false; setWorld("record"); goView(ST().views.record); focusRidge(-1); ST().canHover = true; gsap.to("#stage", { opacity: 1, duration: .8 }); }
  gsap.from(".rec-big > *", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: .08, scrollTrigger: { trigger: ".h-rec", start: "top 55%", once: true } });
  $$(".rec-big .count").forEach(c => { const o = { v: 0 }; gsap.to(o, { v: +c.getAttribute("data-to"), duration: 1.6, ease: "power3.out", onUpdate: () => { c.textContent = Math.round(o.v); }, scrollTrigger: { trigger: ".h-rec", start: "top 55%", once: true } }); });
  // everything after: the landscape dims and drifts
  ScrollTrigger.create({ trigger: ".h-deals-sec", start: "top 75%", onEnter: toCalm, onEnterBack: toCalm, onLeaveBack: toRecord });
  function toCalm() { if (S) ST().quiet = true; setWorld("calm"); goView(ST().views.calm); focusRidge(-1); ST().canHover = false; if (ST().hoverOff) ST().hoverOff(); gsap.to("#stage", { opacity: .55, duration: 1 }); }
  // tools: sideways
  const track = $("#h-tools-track");
  if (track && innerWidth > 760) {
    const dist = () => track.scrollWidth - innerWidth + 48;
    gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: ".h-tools", start: "top top", end: () => "+=" + dist(), pin: true, scrub: .5, invalidateOnRefresh: true } });
  } else if (track) root.classList.add("tools-swipe");
  gsap.from(".deal-x, .xp", { opacity: 0, y: 40, duration: .9, ease: "power3.out", stagger: { each: .06, from: "start" }, scrollTrigger: { trigger: ".h-deals-sec", start: "top 70%", once: true } });
  $$(".h-title").forEach(t => gsap.from(t, { yPercent: 60, opacity: 0, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: t, start: "top 88%", once: true } }));
  ScrollTrigger.refresh();
}
function introIn() {
  if (!MOTION) return;
  gsap.from("#h-word span", { yPercent: 105, duration: 1.3, ease: "power4.out", stagger: .09 });
  gsap.from("#h-line .hl > span", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .09, delay: .35 });
  gsap.from(".h-foot > *, .h-status > *", { opacity: 0, y: 18, duration: .8, stagger: .07, delay: .8 });
}
function tactile() {
  if (!MOTION || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  // tool screenshots lean toward the pointer
  $$(".tp-shot").forEach(shot => {
    const rx = gsap.quickTo(shot, "rotationX", { duration: .6, ease: "power3" }), ry = gsap.quickTo(shot, "rotationY", { duration: .6, ease: "power3" });
    gsap.set(shot, { transformPerspective: 1100 });
    shot.parentNode.addEventListener("pointermove", e => { const r = shot.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 14); rx(-((e.clientY - r.top) / r.height - .5) * 10); });
    shot.parentNode.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });
}

/* ---------- boot ----------------------------------------------------------- */
// "Skip to the research": jump past the intro to the first report chapter
const skipBtn = $("#h-skip");
if (skipBtn) skipBtn.addEventListener("click", () => {
  const st = window.ScrollTrigger && ScrollTrigger.getAll().find(t => t.trigger && t.trigger.classList.contains("h-calls"));
  const y = st ? st.start + Math.min(60, (st.end - st.start) * .02) : $("#research").getBoundingClientRect().top + scrollY;
  DM.lenis() ? DM.lenis().scrollTo(y, { duration: 1 }) : scrollTo({ top: y, behavior: "smooth" });
});
setWorld("open", 0);
renderIntro(); renderTools(); renderDeals(); renderAbout();
list = chapters(); renderCalls(list);
choreograph(); tactile();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWord);
addEventListener("resize", fitWord);
if (DM.introDone) introIn(); else addEventListener("dm:intro", introIn, { once: true });
Promise.race([DM.ledgerReady, new Promise(r => setTimeout(r, 6000))]).then(() => {
  fillCalls(); renderRecord();
  if (window.ScrollTrigger) ScrollTrigger.refresh();
  const calls = DM.calls().slice().sort((a, b) => a.call_date < b.call_date ? 1 : -1);   // newest nearest the camera
  if (!calls.length || DM.REDUCED) return;
  import("./stage.js?v=110").then(mod => {
    S = mod; S.buildStage(calls);
    if (!ST().ok) { S = null; return; }
    if (activeCh > -1) aim(activeCh, 0); else setWorld("open", 0);
  }).catch(() => {});   // no 3D: the page is complete without it
});
