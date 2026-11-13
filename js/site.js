/* ============================================================================
   site.js — renders every page from js/data.js and runs all behaviour.
   ----------------------------------------------------------------------------
   Content lives in data.js; this file never needs editing for content.
   Each page sets <body data-page="home|research|deals|tools|lab">. The shared
   chrome (nav, menu, detail sheet, command palette, contact, footer) is
   injected here so the five HTML files stay small.
   Live data: Ledger (/ledger/data/calls.json) for prices and the track record,
   data/deal-tracker.json for merger spreads. If either fails to load, the
   parts that need it simply don't appear.
   Motion: GSAP + ScrollTrigger + Lenis from a CDN. If they fail to load, or
   the visitor prefers reduced motion, everything is shown at rest.
   ========================================================================== */
(function () {
  "use strict";

  var D = (typeof siteData !== "undefined" && siteData) || {};   // data.js declares a top-level const
  var PAGE = document.body.getAttribute("data-page") || "home";
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HAS_GSAP = !!(window.gsap && window.ScrollTrigger) && !REDUCED;
  var root = document.documentElement;
  var lenis = null;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function pct(v, dp) { if (v == null || isNaN(v)) return "—"; return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(dp == null ? 1 : dp) + "%"; }
  function cls(v) { return v > 0 ? "up" : v < 0 ? "down" : ""; }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00Z"); if (isNaN(d)) return iso;
    return d.getUTCDate() + " " + ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()] + " " + d.getUTCFullYear();
  }
  var ARROW = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10 10 2M4 2h6v6" stroke="currentColor" stroke-width="1.4"/></svg>';

  /* ---------- models: derive ticker, name, fair value, upside ---------- */
  var MODELS = (D.models || []).map(function (m, i) {
    var tk = (/\(([A-Z0-9.&-]+)\)/.exec(m.title || "") || [])[1] || null;
    var parts = (m.title || "").split(" — ");
    var name = parts[0].replace(/\s*\([^)]*\)\s*$/, "").trim();
    var raw = m.targetPrice || m.impliedValue || "";
    var um = /\(([~+−-]?)\s*([\d.]+)%\)/.exec(raw);
    var upside = um ? (um[1] === "−" || um[1] === "-" ? -1 : 1) * parseFloat(um[2]) : null;
    var fv = m.rating ? ((/~?[$₹][\d,]+/.exec(raw) || [""])[0]) : "";
    // Notes on Indian listed companies are published as valuation exercises: no rating, no price target
    // (SEBI treats ratings and targets on listed securities as research-analyst activity).
    var note = m.market === "India" && !!m.rating;
    return { i: i, src: m, id: tk || slug(name), tk: tk, name: name, kind: (parts[1] || "").trim(),
      fv: note ? "" : fv, upside: note ? null : upside, modelValue: note ? fv : "", note: note,
      rating: note ? "NOTE" : (m.rating || ""), market: m.market || "", sector: m.sector || "", date: m.date || "", macro: !m.rating };
  });
  var COVERED = MODELS.filter(function (m) { return !m.macro; });                 // every company with a note
  var RATED = MODELS.filter(function (m) { return !m.macro && !m.note; });        // companies that carry a rating (US)
  function rClass(r) { return "r-" + (r && r !== "NOTE" ? r.toLowerCase() : "macro"); }
  function pill(r) { return '<span class="pill ' + rClass(r) + '">' + esc(r === "NOTE" ? "Valuation note" : (r || "Macro")) + "</span>"; }
  function num(sv) { var x = parseFloat(String(sv || "").replace(/[^\d.]/g, "")); return isFinite(x) ? x : null; }
  // When was the rating set, and at what price (from Ledger's latest call on that ticker)
  function asOf(m) {
    var c = LED && m.tk && LED[m.tk];
    if (c && c.rating === m.rating) return "Rated " + fmtDate(c.call_date) + " at " + (c.currency === "INR" ? "₹" : "$") + Number(c.price_at_call).toLocaleString();
    return m.date ? "Published " + m.date : "";
  }
  // Has the price moved through the rating since it was set? Compares the published fair value with today's price.
  function review(m) {
    var c = LED && m.tk && LED[m.tk], fvn = num(m.fv);
    if (!c || !fvn || m.note || m.macro || c.rating !== m.rating || !c.live_price) return null;
    var implied = (fvn / c.live_price - 1) * 100, r = m.rating, out = false;
    if (r === "BUY" || r === "ACCUMULATE") out = implied < 5;
    else if (r === "HOLD") out = implied < -5 || implied > 15;
    else if (r === "REDUCE") out = implied > 5;
    return out ? { implied: implied, price: c.live_price, cur: c.currency === "INR" ? "₹" : "$", asof: c.as_of } : null;
  }
  function reviewPill(m) { return review(m) ? '<span class="pill r-review" title="The price has moved through this rating since it was set">Under review</span>' : ""; }

  /* ---------- live data ------------------------------------------------- */
  var LED = null, CALLS = [];
  function getJSON(urls) {
    var u = urls.shift();
    var ctl = window.AbortController ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 5000) : 0;
    return fetch(u, { cache: "no-cache", signal: ctl ? ctl.signal : undefined }).then(function (r) { clearTimeout(timer); if (!r.ok) throw 0; return r.json(); })
      .catch(function (e) { if (urls.length) return getJSON(urls); throw e; });
  }
  var ledgerReady = window.fetch ? getJSON(["/ledger/data/calls.json", "https://debjitmukherjee1.github.io/ledger/data/calls.json"]).then(function (d) {
    CALLS = (d.calls || []).filter(function (c) { return c.series && c.series.length > 1; });
    LED = {};
    CALLS.forEach(function (c) { var p = LED[c.ticker]; if (!p || c.call_date > p.call_date) LED[c.ticker] = c; });
    LED._updated = d.updated_at;
    return LED;
  }).catch(function () { LED = null; return null; }) : Promise.resolve(null);
  var TRACK = null;
  var trackReady = window.fetch && (D.deals || []).length ? getJSON(["data/deal-tracker.json"]).then(function (j) { TRACK = j; return j; }).catch(function () { return null; }) : Promise.resolve(null);

  /* ---------- charts (SVG, pixel-space, themeable) ---------------------- */
  function sparkSVG(call) {
    if (!call) return "";
    var s = call.series.map(function (p) { return p.c; }), mn = Math.min.apply(0, s), mx = Math.max.apply(0, s), w = 110, h = 30;
    var d = s.map(function (v, i) { return (i ? "L" : "M") + (i / (s.length - 1) * w).toFixed(1) + " " + (h - 3 - (v - mn) / (mx - mn || 1) * (h - 6)).toFixed(1); }).join("");
    return '<svg class="spark" viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + '" vector-effect="non-scaling-stroke" stroke="' + (s[s.length - 1] >= s[0] ? "var(--pos)" : "var(--neg)") + '"/></svg>';
  }
  function bigChart(call, host) {
    function draw() {
      var w = host.clientWidth || 600, h = 220, pr = 58, pb = 18, pt = 8;
      var s = call.series, vals = s.map(function (p) { return p.c; }).concat([call.price_at_call, call.target].filter(function (v) { return typeof v === "number"; }));
      var mn = Math.min.apply(0, vals), mx = Math.max.apply(0, vals), pad = (mx - mn) * .08 || 1; mn -= pad; mx += pad;
      var X = function (i) { return i / (s.length - 1) * (w - pr); }, Y = function (v) { return pt + (1 - (v - mn) / (mx - mn)) * (h - pt - pb); };
      var d = s.map(function (p, i) { return (i ? "L" : "M") + X(i).toFixed(1) + " " + Y(p.c).toFixed(1); }).join("");
      var cur = call.currency === "INR" ? "₹" : "$";
      var refs = "";
      if (typeof call.target === "number") refs += '<line class="ref t" x1="0" x2="' + (w - pr) + '" y1="' + Y(call.target) + '" y2="' + Y(call.target) + '"/><text class="t" x="' + (w - pr + 8) + '" y="' + (Y(call.target) + 3) + '">FV ' + cur + call.target.toLocaleString() + "</text>";
      refs += '<line class="ref c" x1="0" x2="' + (w - pr) + '" y1="' + Y(call.price_at_call) + '" y2="' + Y(call.price_at_call) + '"/><text x="' + (w - pr + 8) + '" y="' + (Y(call.price_at_call) + (Math.abs(Y(call.price_at_call) - Y(call.target || 0)) < 12 ? 14 : 3)) + '">CALL</text>';
      host.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Price since the call">' +
        '<path class="a" d="' + d + "L" + X(s.length - 1) + " " + (h - pb) + "L0 " + (h - pb) + 'Z"/>' + refs + '<path class="p" d="' + d + '"/>' +
        '<text x="0" y="' + (h - 2) + '">' + esc(fmtDate(s[0].d)) + '</text><text x="' + (w - pr) + '" y="' + (h - 2) + '" text-anchor="end">' + esc(fmtDate(s[s.length - 1].d)) + "</text></svg>";
    }
    draw();
  }

  /* ---------- shared chrome -------------------------------------------- */
  var NAV = [["./", "Overview", "home"], ["research", "Research", "research"], ["deals", "Deals", "deals"], ["tools", "Tools", "tools"], ["lab", "Workbench", "lab"], ["about", "Profile", "about"]];
  var hero = D.hero || {};
  function buildChrome() {
    var links = NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === PAGE ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("");
    var nav = document.createElement("header");
    nav.className = "nav"; nav.id = "nav";
    nav.innerHTML =
      '<a class="brand" href="./" aria-label="' + esc(hero.name) + ' — home"><span class="brand-mark" aria-hidden="true">dm</span><span>' + esc(hero.name) + "<small>Independent equity research</small></span></a>" +
      '<nav class="nav-links" aria-label="Site pages">' + links + "</nav>" +
      '<div class="nav-right"><div class="clock" id="clock" aria-hidden="true"></div>' +
      '<button class="icon-btn pal-btn" id="pal-btn" type="button" aria-label="Search the site (Ctrl or Command K)"><svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.4"/><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" stroke-width="1.4"/></svg><span>Search</span><kbd>⌘K</kbd></button>' +
      '<button class="icon-btn menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu">Menu</button></div>';
    document.body.insertBefore(nav, document.body.firstChild);

    var skip = document.createElement("a"); skip.className = "skip"; skip.href = "#main"; skip.textContent = "Skip to content";
    document.body.insertBefore(skip, nav);

    var mm = document.createElement("div"); mm.className = "mobile-menu"; mm.id = "mobile-menu";
    mm.innerHTML = "<div>" + NAV.map(function (n, i) { return '<a class="big" href="' + n[0] + '">' + n[1] + "<span>0" + (i + 1) + "</span></a>"; }).join("") + "</div>" +
      '<div class="mm-foot"><a class="btn btn-solid" href="' + esc(hero.resumeUrl) + '" target="_blank" rel="noopener">Download CV</a><a class="btn" href="mailto:' + esc(hero.email) + '">Email</a><a class="btn" href="' + esc(hero.linkedinUrl) + '" target="_blank" rel="noopener">LinkedIn</a></div>';
    document.body.appendChild(mm);

    var tail = document.createElement("div");
    tail.innerHTML =
      '<div class="scrim" id="scrim"></div>' +
      '<aside class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" data-lenis-prevent><div class="sheet-bar"><span class="mono" id="sheet-kicker"></span><button class="icon-btn" id="sheet-close" type="button" aria-label="Close">Close ✕</button></div><div class="sheet-body" id="sheet-body"></div></aside>' +
      '<div class="pal" id="pal" role="dialog" aria-modal="true" aria-label="Search the site" data-lenis-prevent><input id="pal-in" type="text" placeholder="Search a ticker, a deal, a tool, a page…" autocomplete="off" spellcheck="false" aria-controls="pal-list"><div class="pal-list" id="pal-list" role="listbox"></div><div class="pal-foot mono"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></div></div>';
    while (tail.firstChild) document.body.appendChild(tail.firstChild);
    // liquid glass: a displacement map bends whatever sits behind the dock and panels (Chromium only; others keep the frosted look)
    if (window.chrome && !REDUCED && window.innerWidth > 820 && window.CSS && CSS.supports("backdrop-filter", "blur(1px)")) {
      var lg = document.createElement("div");
      lg.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="lg" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.006 0.011" numOctaves="2" seed="11" result="n"/><feGaussianBlur in="n" stdDeviation="3" result="nb"/><feDisplacementMap in="SourceGraphic" in2="nb" scale="46" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
      document.body.appendChild(lg.firstChild); root.classList.add("lg-ok");
    }

    // contact + footer close every page
    var first = (hero.name || "").split(" ")[0], last = (hero.name || "").split(" ").slice(1).join(" ");
    var c = document.createElement("section");
    c.className = "contact"; c.id = "contact"; c.setAttribute("aria-labelledby", "contact-title");
    c.innerHTML = '<div class="wrap"><div class="contact-top"><div><p class="sec-label mono">Contact</p><h2 class="display" id="contact-title">Have a desk that needs <em>an analyst?</em></h2></div>' +
      '<div class="contact-links" data-r>' +
      '<a href="mailto:' + esc(hero.email) + '">' + esc(hero.email) + "<span>EMAIL ↗</span></a>" +
      '<a href="' + esc(hero.linkedinUrl) + '" target="_blank" rel="noopener">LinkedIn<span>CONNECT ↗</span></a>' +
      '<a href="' + esc(hero.resumeUrl) + '" target="_blank" rel="noopener">Curriculum vitae<span>PDF ↓</span></a>' +
      '<a href="https://debjitmukherjee1.github.io/ledger/" target="_blank" rel="noopener">Public track record<span>LEDGER ↗</span></a></div></div>' +
      '<p class="wordmark" aria-hidden="true">' + esc(first) + " <em>" + esc(last) + "</em></p></div>" +
      '<footer class="foot"><div class="wrap" style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 32px"><p>© ' + new Date().getFullYear() + " " + esc(hero.name) + ". Student valuation work from public filings, published for learning and discussion. Nothing on this site is a recommendation to buy, sell or hold any security, or investment advice. I am not registered with SEBI as a research analyst or investment adviser, or with any other regulator. Notes on Indian listed companies are valuation exercises and carry no rating or price target. Check each note for its holdings disclosure.</p><p>" + esc(hero.personalLine || "") + "</p></div></footer>";
    document.body.appendChild(c);
  }

  /* ---------- theme, nav behaviour, clocks ------------------------------ */
  function setupTheme() {
    if (!$("#theme-btn")) return;
    $("#theme-btn").addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      var apply = function () { root.setAttribute("data-theme", next); };
      if (document.startViewTransition && !REDUCED && !document.hidden) { var vt = document.startViewTransition(apply); if (vt && vt.finished) vt.finished.catch(function () {}); if (vt && vt.ready) vt.ready.catch(function () {}); } else apply();
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }
  function setupNav() {
    var nav = $("#nav"), last = 0, mm = $("#mobile-menu"), mb = $("#menu-btn");
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      nav.classList.toggle("scrolled", y > 30);
      nav.classList.toggle("hide", PAGE !== "lab" && y > last && y > 400 && !mm.classList.contains("open"));
      last = y;
    }, { passive: true });
    mb.addEventListener("click", function () {
      var open = mm.classList.toggle("open");
      mb.setAttribute("aria-expanded", open); mb.textContent = open ? "Close" : "Menu";
      lock(open);
    });
  }
  function lock(on) { if (lenis) { on ? lenis.stop() : lenis.start(); } document.body.style.overflow = on ? "hidden" : ""; }
  function setupClock() {
    var host = $("#clock"); if (!host || !window.Intl) return;
    var mk = [["NSE", "Asia/Kolkata", 555, 930], ["NYSE", "America/New_York", 570, 960]];
    function tick() {
      host.innerHTML = mk.map(function (m) {
        var p = {}; new Intl.DateTimeFormat("en-GB", { timeZone: m[1], weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
        var mins = (+p.hour % 24) * 60 + +p.minute, open = p.weekday !== "Sat" && p.weekday !== "Sun" && mins >= m[2] && mins < m[3];
        return '<span class="' + (open ? "open" : "") + '"><i></i>' + m[0] + " " + p.hour + ":" + p.minute + "</span>";
      }).join("");
    }
    tick(); setInterval(tick, 30000);
  }

  /* ---------- detail sheet ---------------------------------------------- */
  var sheetReturn = null;
  function openSheet(kicker, html, after) {
    var sh = $("#sheet"), body = $("#sheet-body");
    sheetReturn = document.activeElement;
    $("#sheet-kicker").textContent = kicker;
    body.innerHTML = html; body.scrollTop = 0;
    sh.classList.add("on"); $("#scrim").classList.add("on"); lock(true);
    if (after) after(body);
    setTimeout(function () { $("#sheet-close").focus(); }, 60);
  }
  function closeSheet() {
    var sh = $("#sheet"); if (!sh.classList.contains("on")) return;
    sh.classList.remove("on"); $("#scrim").classList.remove("on"); lock(false);
    if (PAGE === "research" && location.hash) history.replaceState(null, "", location.pathname + location.search);
    if (sheetReturn && sheetReturn.focus) sheetReturn.focus();
  }
  function setupSheet() {
    $("#sheet-close").addEventListener("click", closeSheet);
    $("#scrim").addEventListener("click", function () { closeSheet(); closePal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closePal(); closeSheet(); }
      if (e.key === "Tab" && $("#sheet").classList.contains("on")) {
        var f = $$("a[href],button,input", $("#sheet")); if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function bullets(list) { return list && list.length ? '<ul class="bul">' + list.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : ""; }
  function photos(list) {
    return list && list.length ? '<h4>Photos</h4><div class="photos">' + list.map(function (p) { return '<figure><img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '" loading="lazy" onerror="this.closest(\'figure\').remove()"><figcaption>' + esc(p.caption) + "</figcaption></figure>"; }).join("") + "</div>" : "";
  }
  function paras(text) {
    // long research blurbs read better in short paragraphs: break every ~3 sentences
    var t = String(text || ""), out = [], start = 0, last = 0, re = /[.!?]["”)]?\s+(?=[A-Z0-9$₹“"(])/g, m;
    while ((m = re.exec(t))) { var end = m.index + m[0].length; if (end - start > 300) { out.push(t.slice(start, end).trim()); start = end; } last = end; }
    if (start < t.length) out.push(t.slice(start).trim());
    return out.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
  }
  function openResearch(m) {
    var s = m.src, call = LED && m.tk && LED[m.tk];
    var html = '<p class="mono mute">' + esc([m.sector, m.market, m.date].filter(Boolean).join(" · ")) + "</p>" +
      '<h2 id="sheet-title">' + esc(m.name) + "</h2>" +
      '<div class="sheet-meta">' + pill(m.rating) + reviewPill(m) +
        (m.note ? '<span class="fv">Model output ' + esc(m.modelValue) + " · " + esc(m.date) + "</span>" : (s.targetPrice || s.impliedValue ? '<span class="fv">' + esc(s.targetPrice || s.impliedValue) + "</span>" : "")) +
        (!m.note && !m.macro && asOf(m) ? '<span class="mono mute">' + esc(asOf(m)) + "</span>" : "") + (m.kind ? '<span class="mono mute">' + esc(m.kind) + "</span>" : "") + "</div>" +
      (call ? '<div class="big-chart"><div id="bc"></div><div class="chart-stats"><div><small>Since the call</small><b class="' + cls(call.return_pct) + '">' + pct(call.return_pct) + "</b></div><div><small>" + esc(call.benchmark) + '</small><b>' + pct(call.benchmark_return_pct) + "</b></div><div><small>Called " + esc(fmtDate(call.call_date)) + "</small><b>" + (call.currency === "INR" ? "₹" : "$") + Number(call.price_at_call).toLocaleString() + "</b></div></div></div>" : "") +
      (review(m) ? (function (rv) { return '<p class="sheet-flag">Under review. Since this rating was set the price has moved to ' + rv.cur + Number(rv.price).toLocaleString() + " (" + esc(fmtDate(rv.asof)) + "), where the published fair value implies " + pct(rv.implied) + ". That is outside the " + esc(m.rating) + " band; the rating has not yet been updated.</p>"; })(review(m)) : "") +
      (m.note ? '<p class="sheet-flag">Valuation exercise, recorded as of its date. Notes on Indian listed companies are published for study and discussion only: they carry no rating or price target and are not a recommendation to buy, sell or hold. I am not registered with SEBI as a research analyst.</p>' : "") +
      '<p class="quote">' + esc(s.thesis) + "</p>" +
      '<div class="body">' + paras(s.detail) + "</div>" +
      (s.methodologyNote ? "<h4>How it's valued</h4><div class=\"body\"><p>" + esc(s.methodologyNote) + "</p></div>" : "") +
      (s.methods ? bullets(s.methods.map(function (x) { return x.role + " — " + x.method + (x.detail ? ": " + x.detail : ""); })) : "") +
      '<div class="sheet-actions">' +
      (s.fileUrl ? '<a class="btn btn-solid" href="' + esc(s.fileUrl) + '" target="_blank" rel="noopener">' + esc(s.fileLabel || "Read the report") + ' <span class="arr">↗</span></a>' : "") +
      (s.fileUrl2 ? '<a class="btn" href="' + esc(s.fileUrl2) + '" download>' + esc(s.fileLabel2 || "Download the model") + " ↓</a>" : "") +
      (call ? '<a class="btn" href="https://debjitmukherjee1.github.io/ledger/" target="_blank" rel="noopener">Track record ↗</a>' : "") + "</div>" +
      '<p class="note">' + esc("Student valuation work from public filings, published for learning and discussion. Nothing on this site is a recommendation to buy, sell or hold any security, or investment advice. I am not registered with SEBI as a research analyst or investment adviser, or with any other regulator. Notes on Indian listed companies are valuation exercises and carry no rating or price target. Check each note for its holdings disclosure.") + " Prices are daily closes from Ledger.</p>";
    openSheet("Research · " + (m.tk || "Macro"), html, function () { if (call) bigChart(m.note ? Object.assign({}, call, { target: null }) : call, $("#bc")); });
    if (PAGE === "research") history.replaceState(null, "", "#" + m.id);
  }
  function liveLine(t) {
    return t.ticker + " $" + t.price.toFixed(2) + " against a $" + t.offer.toFixed(2) + " offer · spread " + pct(t.gross_spread * 100, 2) + " (" + (t.annualised * 100).toFixed(1) + "% annualised) · implied odds of closing " + Math.round(t.implied_prob * 100) + "%";
  }
  function arbLink(t) {
    return "lab#arb?offer=" + t.offer + "&price=" + t.price + "&div=" + (t.dividends_expected || 0) + "&days=" + t.days_to_close + "&brk=" + t.break_price.toFixed(2) + "&rf=" + ((TRACK.risk_free || 0) * 100).toFixed(2);
  }
  function openDeal(d) {
    var t = TRACK && d.live && TRACK.deals && TRACK.deals[d.id];
    var html = '<p class="mono mute">' + esc("Deal Decoded #" + d.series + " · " + d.market + " · " + d.sector) + "</p>" +
      '<h2 id="sheet-title">' + esc(d.title) + "</h2>" +
      '<div class="sheet-meta"><span class="pill ' + (d.status === "Pending" ? "live r-accumulate" : "r-hold") + '">' + esc(d.status) + '</span><span class="fv">' + esc(d.size) + "</span></div>" +
      '<dl class="keys">' + (d.keyNumbers || []).map(function (k) { return "<div><dt>" + esc(k.label) + "</dt><dd>" + esc(k.value) + "</dd></div>"; }).join("") + "</dl>" +
      '<p class="quote">' + esc(d.hook) + "</p>" +
      "<h4>Verdict</h4><div class=\"body\"><p>" + esc(d.verdict) + "</p></div>" +
      '<h4>Timeline</h4><div class="body"><p>' + esc("Announced " + fmtDate(d.announced) + " · " + d.closeLabel + " · " + d.acquirer + " → " + d.target + " · figures as of " + fmtDate(d.asOf)) + "</p></div>" +
      (t ? '<h4>Live spread</h4><p class="live-line">' + esc(liveLine(t)) + " · prices at the " + esc(fmtDate(t.as_of)) + " close</p>" : "") +
      '<div class="sheet-actions">' +
      (d.fileUrl ? '<a class="btn btn-solid" href="' + esc(d.fileUrl) + '" target="_blank" rel="noopener">' + esc((d.fileLabel || "Read the note").replace(" ↗", "")) + ' <span class="arr">↗</span></a>' : "") +
      (d.fileUrl2 ? '<a class="btn" href="' + esc(d.fileUrl2) + '" download>' + esc(d.fileLabel2 || "Download model") + " ↓</a>" : "") +
      (t ? '<a class="btn" href="' + esc(arbLink(t)) + '">Open in the spread calculator</a>' : "") + "</div>" +
      '<p class="note">Independent analysis from public filings; the author had no involvement in this transaction. Spread figures are informational, not a recommendation.</p>';
    openSheet("Deal Decoded #" + d.series, html);
  }
  function openGeneric(kicker, meta, title, sub, summary, list, pics, link) {
    openSheet(kicker, '<p class="mono mute">' + esc(meta) + '</p><h2 id="sheet-title">' + esc(title) + "</h2>" +
      (sub ? '<div class="sheet-meta"><span class="fv">' + esc(sub) + "</span></div>" : "") +
      (summary ? '<p class="quote">' + esc(summary) + "</p>" : "") + bullets(list) + photos(pics) +
      (link ? '<div class="sheet-actions"><a class="btn btn-solid" href="' + esc(link[0]) + '" target="_blank" rel="noopener">' + esc(link[1]) + "</a></div>" : ""));
  }

  /* ---------- command palette ------------------------------------------ */
  var palItems = [], palSel = 0, palShown = [];
  function buildPalIndex() {
    palItems = [];
    NAV.forEach(function (n) { palItems.push({ g: "Pages", k: "GO", t: n[1], h: "Page", run: function () { location.href = n[0]; } }); });
    MODELS.forEach(function (m) { palItems.push({ g: "Research", k: m.tk || "MACRO", t: m.name + (m.note ? " — valuation note" : m.rating ? " — " + m.rating + (m.fv ? " · FV " + m.fv : "") : ""), h: m.sector, q: m.src.thesis, run: function () { openResearch(m); } }); });
    (D.deals || []).filter(function (d) { return d.published; }).forEach(function (d) { palItems.push({ g: "Deals", k: "DEAL #" + d.series, t: d.title, h: d.status, run: function () { openDeal(d); } }); });
    (D.workbench || []).forEach(function (w) { palItems.push({ g: "Workbench", k: "CALC", t: w.name + " — " + w.type, h: "Open", run: function () { location.href = "lab#" + w.id; if (PAGE === "lab") location.reload(); } }); });
    (D.tools || []).filter(function (t) { return t.url; }).forEach(function (t) { palItems.push({ g: "Live tools", k: "APP", t: t.name + " — " + t.type, h: "Launch ↗", run: function () { window.open(t.url, "_blank", "noopener"); } }); });
    palItems.push({ g: "Actions", k: "CV", t: "Download the CV (PDF)", h: "File", run: function () { window.open(hero.resumeUrl, "_blank", "noopener"); } });
    palItems.push({ g: "Actions", k: "MAIL", t: "Email " + hero.email, h: "Contact", run: function () { location.href = "mailto:" + hero.email; } });
    palItems.push({ g: "Actions", k: "IN", t: "Open LinkedIn", h: "Contact", run: function () { window.open(hero.linkedinUrl, "_blank", "noopener"); } });
  }
  function renderPal(q) {
    q = (q || "").trim().toLowerCase();
    var words = q.split(/\s+/).filter(Boolean);
    palShown = palItems.filter(function (it) {
      var hay = (it.k + " " + it.t + " " + it.h + " " + it.g + " " + (it.q || "")).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    });
    if (!q) palShown = palShown.filter(function (it) { return it.g !== "Research" || MODELS.filter(function (m) { return m.src.featured; }).slice(0, 6).some(function (m) { return it.k === (m.tk || "MACRO") && it.t.indexOf(m.name) === 0; }); });
    palSel = 0;
    var list = $("#pal-list"), g = "";
    list.innerHTML = palShown.length ? palShown.map(function (it, i) {
      var head = it.g !== g ? '<p class="pal-group mono">' + esc(g = it.g) + "</p>" : "";
      return head + '<button class="pal-item' + (i === 0 ? " sel" : "") + '" type="button" role="option" data-i="' + i + '"><span class="k">' + esc(it.k) + '</span><span class="t">' + esc(it.t) + '</span><span class="h">' + esc(it.h) + "</span></button>";
    }).join("") : '<p class="pal-empty">Nothing matches “' + esc(q) + "”.</p>";
  }
  function openPal() { var p = $("#pal"); p.classList.add("on"); $("#scrim").classList.add("on"); lock(true); var i = $("#pal-in"); i.value = ""; renderPal(""); i.focus(); }
  function closePal() { var p = $("#pal"); if (!p.classList.contains("on")) return; p.classList.remove("on"); if (!$("#sheet").classList.contains("on")) { $("#scrim").classList.remove("on"); lock(false); } }
  function runPal(i) { var it = palShown[i]; if (!it) return; closePal(); it.run(); }
  function setupPal() {
    buildPalIndex();
    $("#pal-btn").addEventListener("click", openPal);
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#pal").classList.contains("on") ? closePal() : openPal(); }
      else if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openPal(); }
    });
    var inp = $("#pal-in"), list = $("#pal-list");
    inp.addEventListener("input", function () { renderPal(inp.value); });
    inp.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); if (!palShown.length) return;
        palSel = (palSel + (e.key === "ArrowDown" ? 1 : -1) + palShown.length) % palShown.length;
        $$(".pal-item", list).forEach(function (b, i) { b.classList.toggle("sel", i === palSel); if (i === palSel) b.scrollIntoView({ block: "nearest" }); });
      } else if (e.key === "Enter") { e.preventDefault(); runPal(palSel); }
    });
    list.addEventListener("click", function (e) { var b = e.target.closest(".pal-item"); if (b) runPal(+b.getAttribute("data-i")); });
  }

  /* ---------- tape ------------------------------------------------------ */
  function renderTape() {
    var host = $("#tape"); if (!host || !(D.ticker || []).length) return;
    var glyph = { up: "▲", down: "▼", flat: "■" };
    var items = D.ticker.map(function (t) {
      var page = (t.page || "index.html").replace(".html", ""); if (page === "index") page = "./";
      var m = MODELS.filter(function (x) { return x.tk === t.label; })[0];
      if (m && m.note) t = { label: t.label, value: "VALUATION NOTE · " + m.date.toUpperCase(), direction: "flat" };
      else if (m && review(m)) t = { label: t.label, value: t.value + " · UNDER REVIEW", direction: t.direction };
      return '<a href="' + esc(m ? "research#" + m.id : page + (t.sectionId ? "#" + t.sectionId : "")) + '"' + (m ? ' data-open="' + esc(m.id) + '"' : "") + '><i class="' + esc(t.direction) + '">' + (glyph[t.direction] || "■") + "</i><b>" + esc(t.label) + "</b>" + esc(t.value) + "</a>";
    }).join("");
    host.innerHTML = '<div class="tape-track">' + items + '</div><div class="tape-track" aria-hidden="true">' + items.replace(/<a /g, '<a tabindex="-1" ') + "</div>";
  }
  // any [data-open="TICKER"] opens the research sheet in place
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-open]"); if (!a) return;
    var m = MODELS.filter(function (x) { return x.id === a.getAttribute("data-open"); })[0];
    if (m) { e.preventDefault(); openResearch(m); }
  });

  /* ---------- hero ------------------------------------------------------ */
  function splitWords(node, emLast) {
    var words = node.textContent.trim().split(/\s+/);
    node.setAttribute("aria-label", words.join(" "));
    node.innerHTML = words.map(function (w, i) { var inner = emLast && i === words.length - 1 ? "<em>" + esc(w) + "</em>" : esc(w); return '<span class="w" aria-hidden="true"><span>' + inner + "</span></span>"; }).join(" ");
    return $$(".w > span", node);
  }
  function renderHero() {
    var host = $("#hero"); if (!host) return;
    var status = (D.ticker || []).filter(function (t) { return t.label === "STATUS"; })[0];
    $("#hero-kicker").innerHTML = '<h1 class="mono">' + esc(hero.name) + '</h1><span class="mono">Independent equity research · India &amp; US large caps</span>' + (status ? '<span class="pill live r-accumulate">' + esc(status.value) + "</span>" : "");
    $("#hero-display").textContent = hero.tagline || "";
    $("#hero-bio").textContent = hero.bio || "";
    $("#hero-cta").innerHTML = '<a class="btn btn-solid" href="research">Read the research <span class="arr">↗</span></a><a class="btn" href="' + esc(hero.resumeUrl) + '" target="_blank" rel="noopener">Download CV ↓</a><a class="btn" href="' + esc(hero.linkedinUrl) + '" target="_blank" rel="noopener">LinkedIn</a>';
    $("#hero-stats").innerHTML = (hero.stats || []).map(function (s) { return '<div><b class="count" data-to="' + s.value + '" data-suffix="' + esc(s.suffix || "") + '">' + s.value + esc(s.suffix || "") + '</b><span class="mono">' + esc(s.label) + "</span></div>"; }).join("");
  }
  function heroChart() {
    var host = $("#hero-chart"); if (!host || !CALLS.length) { if (host) host.style.display = "none"; return; }
    var svgNS = "http://www.w3.org/2000/svg", tip = $("#chart-tip"), lines = [];
    var t0 = Infinity, t1 = -Infinity, lo = 0, hi = 0;
    var data = CALLS.map(function (c) {
      var base = c.series[0].c, pts = c.series.map(function (p) { var t = Date.parse(p.d), v = (p.c / base - 1) * 100; if (t < t0) t0 = t; if (t > t1) t1 = t; if (v < lo) lo = v; if (v > hi) hi = v; return [t, v]; });
      return { c: c, pts: pts };
    });
    var span = Math.max(hi, -lo) * 1.08; lo = -span * (Math.abs(lo) / Math.max(hi, -lo) < .5 ? .6 : 1); hi = span * (hi / Math.max(hi, -lo * 1) < .5 ? .6 : 1);
    function draw(animate) {
      var w = host.clientWidth, h = host.clientHeight, pr = Math.max(56, w * .04), pl = parseFloat(getComputedStyle(host).getPropertyValue("--pl")) || 0, pb = 26, pt = 30;
      var X = function (t) { return pl + (t - t0) / (t1 - t0) * (w - pr - pl); }, Y = function (v) { return pt + (1 - (v - lo) / (hi - lo)) * (h - pt - pb); };
      var out = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Every published call, as percentage return since its call date"><line class="zero" x1="0" x2="' + w + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
      [hi * .75, 0, lo * .75].forEach(function (v) { v = Math.round(v / 5) * 5; out += '<text class="axis" x="' + (w - 8) + '" y="' + (Y(v) - 6) + '" text-anchor="end">' + (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v) + "%</text>"; });
      var d0 = new Date(t0); d0 = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1));
      for (; d0.getTime() < t1; d0 = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1))) out += '<text class="axis" x="' + X(d0.getTime()) + '" y="' + (h - 6) + '">' + ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][d0.getUTCMonth()] + "</text>";
      lines = data.map(function (o, i) {
        var px = o.pts.map(function (p) { return [X(p[0]), Y(p[1])]; });
        out += '<path class="ln" data-i="' + i + '" pathLength="1" d="' + px.map(function (p, j) { return (j ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join("") + '"/><circle class="dot" data-i="' + i + '" r="3" cx="' + px[px.length - 1][0].toFixed(1) + '" cy="' + px[px.length - 1][1].toFixed(1) + '"/>';
        return px;
      });
      host.querySelector(".plot").innerHTML = out + "</svg>";
      if (animate && HAS_GSAP) {
        gsap.fromTo($$(".ln", host), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", stagger: .035, delay: .5, onComplete: function () { $$(".ln", host).forEach(function (p) { p.removeAttribute("stroke-dasharray"); p.style.strokeDasharray = "none"; }); } });
        gsap.from($$(".dot", host), { scale: 0, transformOrigin: "center", duration: .5, stagger: .035, delay: 2.2 });
      }
    }
    draw(true);
    var rt; new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { draw(false); }, 120); }).observe(host);
    var cur = -1;
    function hover(e) {
      var r = host.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, best = -1, bd = 40, bp = null;
      lines.forEach(function (px, i) {
        if (mx < px[0][0] - 12 || mx > px[px.length - 1][0] + 12) return;
        var j = 0; while (j < px.length - 1 && px[j + 1][0] < mx) j++;
        var a = px[j], b = px[Math.min(j + 1, px.length - 1)], f = b[0] === a[0] ? 0 : Math.max(0, Math.min(1, (mx - a[0]) / (b[0] - a[0]))), y = a[1] + (b[1] - a[1]) * f, dist = Math.abs(y - my);
        if (dist < bd) { bd = dist; best = i; bp = [Math.max(a[0], Math.min(mx, px[px.length - 1][0])), y]; }
      });
      if (best === cur && best > -1) { tip.style.left = bp[0] + "px"; tip.style.top = bp[1] + "px"; return; }
      cur = best;
      $$(".on", host).forEach(function (n) { n.classList.remove("on", "neg-line"); });
      host.classList.toggle("has-hover", best > -1); tip.classList.toggle("on", best > -1); host.style.cursor = best > -1 ? "pointer" : "";
      if (best < 0) return;
      var c = data[best].c;
      $$('[data-i="' + best + '"]', host).forEach(function (n) { n.classList.add("on"); if (c.return_pct < 0) n.classList.add("neg-line"); n.parentNode.appendChild(n); });
      tip.innerHTML = "<b>" + esc(c.ticker) + "</b> · " + esc(c.rating) + (c.status === "closed" ? " (closed)" : "") + "<br>" + pct(c.return_pct) + " since " + esc(fmtDate(c.call_date)) + "<br>" + esc(c.benchmark) + " " + pct(c.benchmark_return_pct);
      tip.style.left = bp[0] + "px"; tip.style.top = bp[1] + "px";
    }
    host.addEventListener("pointermove", hover);
    host.addEventListener("pointerleave", function () { cur = -1; host.classList.remove("has-hover"); tip.classList.remove("on"); $$(".on", host).forEach(function (n) { n.classList.remove("on", "neg-line"); }); });
    host.addEventListener("click", function () { if (cur < 0) return; var tk = data[cur].c.ticker, m = MODELS.filter(function (x) { return x.tk === tk; })[0]; if (m) openResearch(m); });
  }

  /* ---------- home sections --------------------------------------------- */
  function rowHTML(m) {
    return '<button class="row" type="button" data-open="' + esc(m.id) + '" data-r>' +
      '<span class="row-tk">' + esc(m.tk || "Macro") + "</span>" +
      '<span class="row-name">' + esc(m.name) + "<small>" + esc(m.sector + " · " + m.date) + "</small></span>" +
      '<span class="row-thesis">' + esc(m.src.thesis) + "</span>" + pill(m.rating) +
      '<span class="row-fv">' + (m.fv ? "FV " + esc(m.fv) : "") + (m.upside != null ? '<small class="' + cls(m.upside) + '">' + pct(m.upside) + " vs price</small>" : "") + "</span>" +
      '<span class="row-go" aria-hidden="true">' + ARROW + "</span></button>";
  }
  function renderLatest() {
    var host = $("#latest"); if (!host) return;
    host.innerHTML = RATED.filter(function (m) { return m.src.featured; }).slice(0, 7).map(rowHTML).join("");
    var n = $("#latest-all"); if (n) n.innerHTML = "All " + MODELS.length + ' notes <span class="arr">↗</span>';
  }
  function distHTML(list) {
    var order = ["BUY", "ACCUMULATE", "HOLD", "REDUCE"], n = {};
    list.forEach(function (m) { n[m.rating] = (n[m.rating] || 0) + 1; });
    return '<div class="dist" role="img" aria-label="' + order.map(function (r) { return (n[r] || 0) + " " + r; }).join(", ") + '">' + order.filter(function (r) { return n[r]; }).map(function (r) { return '<span class="d-' + r.toLowerCase() + '" style="flex:' + n[r] + '">' + n[r] + "</span>"; }).join("") + "</div>" +
      '<div class="dist-legend mono">' + order.filter(function (r) { return n[r]; }).map(function (r) { return "<span>" + r + " " + n[r] + "</span>"; }).join("") + "</div>";
  }
  function renderRecord() {
    var host = $("#record"); if (!host) return;
    var dist = $("#record-dist"); if (dist) dist.innerHTML = distHTML(RATED);
    ledgerReady.then(function () {
      if (!CALLS.length) { host.style.display = "none"; return; }
      var dir = CALLS.filter(function (c) { return c.direction; }), ahead = dir.filter(function (c) { return c.signed_alpha > 0; }).length;
      var al = dir.map(function (c) { return c.signed_alpha; }).sort(function (a, b) { return a - b; }), med = al.length ? (al.length % 2 ? al[(al.length - 1) / 2] : (al[al.length / 2 - 1] + al[al.length / 2]) / 2) : 0;
      var worst = dir.slice().sort(function (a, b) { return a.signed_alpha - b.signed_alpha; })[0];
      host.innerHTML =
        '<div class="kpi" data-r><span class="mono mute">Calls on the record</span><b>' + CALLS.length + "</b><p>Every published rating, including the ones later changed. Nothing is removed.</p></div>" +
        '<div class="kpi" data-r><span class="mono mute">Ahead of benchmark</span><b>' + ahead + "<small style=\"font-size:.45em\"> / " + dir.length + "</small></b><p>Directional calls (everything except HOLD) that are beating their index, in the direction of the call.</p></div>" +
        '<div class="kpi" data-r><span class="mono mute">Median alpha</span><b class="' + cls(med) + '">' + pct(med) + "</b><p>Median return against the local index across directional calls, signed for the rating.</p></div>" +
        '<div class="kpi" data-r><span class="mono mute">Worst call so far</span><b class="down">' + esc(worst.ticker) + "</b><p>" + esc(worst.rating) + " on " + esc(fmtDate(worst.call_date)) + ", " + pct(worst.signed_alpha) + " against the " + esc(worst.benchmark) + ". Losers are shown as plainly as winners.</p></div>";
      var u = $("#record-updated"); if (u && LED._updated) u.textContent = "Prices updated " + LED._updated;
      reveal(host);
    });
  }
  var GLYPHS = {
    line: '<path class="g-m" d="M0 90h400M0 60h400M0 30h400"/><path class="g-s" d="M0 96 40 80 80 86 120 58 160 66 200 40 240 50 280 26 320 34 360 14 400 20"/>',
    bars: '<g class="g-d">' + [50, 72, 38, 84, 60, 92, 46, 70, 30, 64, 80, 54].map(function (h, j) { return '<rect x="' + (14 + j * 32) + '" y="' + (108 - h) + '" width="18" height="' + h + '" rx="2"' + (j === 5 ? ' class="g-f"' : "") + "/>"; }).join("") + "</g>",
    curve: '<path class="g-m" d="M20 100 380 100M20 20v80"/><path class="g-s" d="M20 96C120 92 160 30 380 22"/><circle class="g-f" cx="186" cy="56" r="4"/>',
    heat: '<g class="g-d">' + Array.apply(0, Array(40)).map(function (_, j) { var on = [3, 12, 13, 22, 23, 24, 33].indexOf(j) > -1; return '<rect x="' + (16 + (j % 10) * 37) + '" y="' + (14 + Math.floor(j / 10) * 24) + '" width="33" height="20" rx="3"' + (on ? ' class="g-f"' : ' opacity="' + (.25 + ((j * 7) % 10) / 14) + '"') + "/>"; }).join("") + "</g>",
    flow: [0, 1, 2, 3, 4].map(function (j) { return '<path class="' + (j === 2 ? "g-s" : "g-m") + '" d="M0 ' + (20 + j * 20) + "C100 " + (10 + j * 26) + " 200 " + (60 - j * 6) + " 400 " + (16 + j * 22) + '"/>'; }).join(""),
    ten: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (j) { return '<path class="' + (j === 3 ? "g-s" : "g-m") + '" d="M0 ' + (104 - j * 6) + " C140 " + (100 - j * 7) + " 260 " + (90 - j * 9) + " 400 " + (84 - j * 8) + '"/>'; }).join(""),
    field: '<g class="g-d">' + [[60, 220], [120, 180], [90, 150], [150, 190]].map(function (b, j) { return '<rect x="' + b[0] + '" y="' + (18 + j * 24) + '" width="' + b[1] + '" height="14" rx="3"' + (j === 1 ? ' class="g-f"' : "") + "/>"; }).join("") + '</g><path class="g-s" d="M228 8v104" stroke-dasharray="3 4"/>',
    sweep: '<g class="g-d">' + [92, 78, 63, 47, 30, 14].map(function (h, j) { return '<rect x="' + (40 + j * 58) + '" y="' + (108 - h) + '" width="30" height="' + h + '" rx="3"/>'; }).join("") + '</g><path class="g-s" d="M40 96 98 84 156 70 214 54 272 38 330 20 370 10"/>',
    merge: '<circle class="g-m" cx="160" cy="60" r="44"/><circle class="g-s" cx="240" cy="60" r="44"/><path class="g-f" d="M200 41.700000000000003a44 44 0 0 1 0 36.6a44 44 0 0 1 0-36.6Z" opacity=".7"/>',
    spread: '<path class="g-m" d="M0 30H400"/><path class="g-s" d="M0 96C80 92 120 60 180 52S300 38 400 32"/><path class="g-m" d="M300 30v9" /><circle class="g-f" cx="400" cy="32" r="4"/><circle class="g-f" cx="180" cy="52" r="3"/>',
    band: '<rect class="g-d" x="30" y="48" width="90" height="24" rx="4" opacity=".5"/><rect class="g-d" x="124" y="48" width="110" height="24" rx="4"/><rect class="g-f" x="238" y="48" width="60" height="24" rx="4" opacity=".55"/><rect class="g-f" x="302" y="48" width="68" height="24" rx="4"/><path class="g-s" d="M212 34v52"/>'
  };
  var GLYPH_FOR = { Meridian: "flow", MarketPulse: "bars", Ledger: "line", Abacus: "heat", Tenline: "ten", rdcf: "curve", lbo: "sweep", merger: "merge", arb: "spread", ff: "field", hurdle: "band" };
  function glyph(key, i) {
    var keys = Object.keys(GLYPHS), g = GLYPHS[GLYPH_FOR[key]] || GLYPHS[keys[i % keys.length]];
    return '<div class="tool-glyph" aria-hidden="true"><svg viewBox="0 0 400 120" preserveAspectRatio="none">' + g + "</svg></div>";
  }
  function toolCard(t, i) {
    return '<button class="card" type="button" data-tool="' + i + '" data-r>' + glyph(t.name, i) + '<div class="card-top mono"><span>' + esc(t.type) + '</span><span class="pill ' + (t.status === "live" ? "live r-accumulate" : "r-macro") + '">' + esc(t.status) + "</span></div><h3>" + esc(t.name) + "</h3><p>" + esc(t.summary) + '</p><div class="card-foot mono"><span>How it works</span><span class="go">' + ARROW + "</span></div></button>";
  }
  function benchCard(w, i) {
    return '<a class="card" href="lab#' + esc(w.id) + '" data-r>' + glyph(w.id, i) + '<div class="card-top mono"><span>' + esc(w.type) + '</span><span class="pill r-hold">In-site</span></div><h3>' + esc(w.name) + "</h3><p>" + esc(w.summary) + '</p><div class="card-foot mono"><span>Open calculator</span><span class="go">' + ARROW + "</span></div></a>";
  }
  function renderTools() {
    var a = $("#tools-grid"), b = $("#bench-grid");
    if (a) {
      var list = (D.tools || []); if (a.hasAttribute("data-limit")) list = list.slice(0, +a.getAttribute("data-limit"));
      a.innerHTML = list.map(toolCard).join("");
      a.addEventListener("click", function (e) {
        var c = e.target.closest("[data-tool]"); if (!c) return; var t = D.tools[+c.getAttribute("data-tool")];
        openGeneric("Live tool", t.type, t.name, t.status === "live" ? "Live — runs in the browser, no sign-up" : "In build", t.summary, t.features, null, t.url ? [t.url, "Launch " + t.name + " ↗"] : null);
      });
    }
    if (b) b.innerHTML = (D.workbench || []).map(benchCard).join("");
  }
  function dealCard(d) {
    return '<button class="card deal" type="button" data-deal="' + esc(d.id) + '" data-r><div class="card-top mono"><span>' + esc("Deal Decoded #" + d.series + " · " + d.market + " · " + d.sector) + '</span><span class="pill ' + (d.status === "Pending" ? "live r-accumulate" : "r-hold") + '">' + esc(d.status) + "</span></div>" +
      '<div class="deal-grid"><div style="display:flex;flex-direction:column;gap:16px"><h3>' + esc(d.title) + '</h3><p class="mono mute">' + esc(d.size) + '</p><p class="hook">' + esc(d.hook) + '</p><p class="live-line" data-live></p></div>' +
      '<dl class="keys">' + (d.keyNumbers || []).map(function (k) { return "<div><dt>" + esc(k.label) + "</dt><dd>" + esc(k.value) + "</dd></div>"; }).join("") + "</dl></div>" +
      '<div class="card-foot mono"><span>' + esc(d.closeLabel) + ' · read the verdict</span><span class="go">' + ARROW + "</span></div></button>";
  }
  function renderDeals() {
    var host = $("#deals-grid"); if (!host) return;
    var list = (D.deals || []).filter(function (d) { return d.published; }).sort(function (a, b) { return b.series - a.series; });
    host.innerHTML = list.map(dealCard).join("");
    host.addEventListener("click", function (e) { var c = e.target.closest("[data-deal]"); if (!c) return; openDeal(list.filter(function (d) { return d.id === c.getAttribute("data-deal"); })[0]); });
    var cnt = $("#deals-count"); if (cnt) cnt.textContent = list.length + " breakdowns · " + list.filter(function (d) { return d.status === "Pending"; }).length + " live";
    trackReady.then(function (T) {
      var body = $("#tracker-body"), sec = $("#tracker");
      var rows = list.filter(function (d) { return d.live && T && T.deals && T.deals[d.id]; });
      rows.forEach(function (d) { var t = T.deals[d.id], n = $('[data-deal="' + d.id + '"] [data-live]'); if (n) n.textContent = "LIVE · " + liveLine(t); });
      if (!body || !sec) return;
      if (!rows.length) { sec.hidden = true; return; }
      sec.hidden = false;
      body.innerHTML = rows.map(function (d) {
        var t = T.deals[d.id];
        return '<tr tabindex="0" data-deal-row="' + esc(d.id) + '"><td class="nm">' + esc(d.title) + "<small>" + esc(t.ticker) + '</small></td><td class="r" data-label="Offer">$' + t.offer.toFixed(2) + '</td><td class="r" data-label="Price">$' + t.price.toFixed(2) + '</td><td class="r up" data-label="Gross spread">' + pct(t.gross_spread * 100, 2) + '</td><td class="r" data-label="Annualised">' + (t.annualised * 100).toFixed(1) + '%</td><td class="r" data-label="Implied odds">' + Math.round(t.implied_prob * 100) + '%</td><td class="r" data-label="Expected close">' + esc(fmtDate(t.expected_close)) + '</td><td class="r" data-label="To go">' + t.days_to_close + 'd</td><td class="r" data-label="Model it"><a class="btn btn-sm" href="' + esc(arbLink(t)) + '">Calculator</a></td></tr>';
      }).join("");
      var u = $("#tracker-updated"); if (u && T.updated_at) u.textContent = "Updated " + T.updated_at + ".";
      body.addEventListener("click", function (e) { if (e.target.closest("a")) return; var r = e.target.closest("[data-deal-row]"); if (r) openDeal(list.filter(function (d) { return d.id === r.getAttribute("data-deal-row"); })[0]); });
    });
  }
  function renderExperience() {
    if (PAGE === "home" || PAGE === "about") return;   // drawn by js/home.js and js/about.js
    var host = $("#experience"); if (!host) return;
    host.innerHTML = (D.experience || []).map(function (x, i) {
      return '<button class="tl-item" type="button" data-x="' + i + '" data-r><span class="mono mute">' + esc(x.dates) + "<br>" + esc(x.location || "") + "</span><span><h3>" + esc(x.company) + '</h3><p class="mono">' + esc(x.role) + '</p></span><span class="tl-sum">' + esc(x.summary) + '</span><span class="row-go" aria-hidden="true">' + ARROW + "</span></button>";
    }).join("");
    host.addEventListener("click", function (e) { var b = e.target.closest("[data-x]"); if (!b) return; var x = D.experience[+b.getAttribute("data-x")]; openGeneric("Experience", x.dates + " · " + (x.location || ""), x.company, x.role, x.summary, x.bullets, x.photos, x.link ? [x.link, x.linkLabel || "Open ↗"] : null); });
  }
  function renderLeadership() {
    if (PAGE === "home" || PAGE === "about") return;   // drawn by js/home.js and js/about.js
    var f = $("#lead-feature"), g = $("#lead-grid"); if (!g) return;
    var feat = (D.leadership || []).filter(function (l) { return l.featured; })[0], rest = (D.leadership || []).filter(function (l) { return !l.featured; });
    if (f && feat) f.innerHTML = '<div class="feature" data-r><div><span class="pill live r-accumulate">' + esc(feat.years) + "</span><h3>" + esc(feat.role + ", " + feat.organization) + '</h3><p style="color:var(--ink-2)">' + esc(feat.summary) + "</p></div><ul>" + (feat.bullets || []).map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul></div>";
    g.innerHTML = rest.map(function (l, i) {
      var p = (l.photos || [])[0];
      return '<button class="card" type="button" data-l="' + i + '" data-r>' + (p ? '<div class="photos" style="grid-template-columns:1fr"><figure style="border:0"><img src="' + esc(p.src) + '" alt="' + esc(p.caption) + '" loading="lazy" onerror="this.closest(\'.photos\').remove()"></figure></div>' : "") +
        '<div class="card-top mono"><span>' + esc(l.years) + "</span></div><h3>" + esc(l.role) + '</h3><p class="mono mute" style="font-size:11px">' + esc(l.organization) + "</p><p>" + esc(l.summary) + '</p><div class="card-foot mono"><span>Details</span><span class="go">' + ARROW + "</span></div></button>";
    }).join("");
    g.addEventListener("click", function (e) { var b = e.target.closest("[data-l]"); if (!b) return; var l = rest[+b.getAttribute("data-l")]; openGeneric("Leadership", l.years, l.role, l.organization, l.summary, l.bullets, l.photos); });
  }
  function renderEducation() {
    if (PAGE === "home" || PAGE === "about") return;   // drawn by js/home.js and js/about.js
    var host = $("#education"); if (!host) return;
    host.innerHTML = (D.education || []).map(function (x, i) {
      return '<button class="tl-item" type="button" data-e="' + i + '" data-r><span class="mono mute">' + esc(x.years) + "</span><span><h3>" + esc(x.institution) + '</h3><p class="mono">' + esc(x.degree) + '</p></span><span class="tl-sum">' + esc(x.focus) + '</span><span class="row-go" aria-hidden="true">' + ARROW + "</span></button>";
    }).join("");
    host.addEventListener("click", function (e) { var b = e.target.closest("[data-e]"); if (!b) return; var x = D.education[+b.getAttribute("data-e")]; openGeneric("Education", x.years, x.institution, x.degree, x.detail, x.bullets); });
    var c = $("#credentials");
    if (c) c.innerHTML = (D.credentials || []).map(function (x) {
      return '<div class="cred" data-r><div><b>' + esc(x.name) + "</b><small>" + esc(x.detail) + '</small></div><div class="mono mute">' + esc(x.issuer) + '</div><div><span class="mono">' + esc(x.status) + "</span>" + (x.progress != null && x.progress < 100 ? '<div class="bar" style="margin-top:8px"><i style="width:' + x.progress + '%"></i></div>' : "") + "</div></div>";
    }).join("");
    var s = $("#skills");
    if (s && D.skills) s.innerHTML = (D.skills.technical || []).concat(D.skills.soft || []).map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("");
  }

  /* ---------- research library ------------------------------------------ */
  function renderLibrary() {
    var host = $("#library"); if (!host) return;
    var st = { q: "", market: "All", rating: "All", sector: "All", sort: "date", dir: 1, view: window.innerWidth < 700 ? "cards" : "table" };
    $$('[data-f="view"]').forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-v") === st.view); });
    var sectors = ["All"]; MODELS.forEach(function (m) { if (sectors.indexOf(m.sector) < 0) sectors.push(m.sector); });
    $("#sector-row").innerHTML = sectors.map(function (s) { return '<button type="button" data-f="sector" data-v="' + esc(s) + '" aria-pressed="' + (s === "All") + '">' + esc(s) + "</button>"; }).join("");
    function grp(r) { return r === "ACCUMULATE" ? "BUY" : r; }
    function list() {
      var q = st.q.toLowerCase();
      var out = MODELS.filter(function (m) {
        return (st.market === "All" || m.market === st.market) && (st.rating === "All" || grp(m.rating) === st.rating) && (st.sector === "All" || m.sector === st.sector) &&
          (!q || (m.name + " " + (m.tk || "") + " " + m.sector + " " + m.src.thesis).toLowerCase().indexOf(q) > -1);
      });
      var key = { date: function (m) { return m.i; }, name: function (m) { return m.name.toLowerCase(); }, tk: function (m) { return (m.tk || "zzz"); }, sector: function (m) { return m.sector; }, rating: function (m) { return ["BUY", "ACCUMULATE", "HOLD", "REDUCE", ""].indexOf(m.rating); },
        upside: function (m) { return m.upside == null ? -1e9 : m.upside; }, since: function (m) { var c = LED && m.tk && LED[m.tk]; return c ? c.return_pct : -1e9; } }[st.sort];
      return out.sort(function (a, b) { var x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : 0) * st.dir; });
    }
    function draw() {
      var L = list(); $("#lib-count").textContent = L.length + " of " + MODELS.length + " notes";
      if (!L.length) { host.innerHTML = '<p class="pal-empty">No notes match those filters.</p>'; return; }
      if (st.view === "table") {
        var th = function (k, label, r) { return '<th scope="col"' + (r ? ' class="r"' : "") + (st.sort === k ? ' aria-sort="' + (st.dir > 0 ? "ascending" : "descending") + '"' : "") + '><button type="button" data-sort="' + k + '">' + label + "</button></th>"; };
        host.innerHTML = '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + th("tk", "Ticker") + th("name", "Company") + th("rating", "Rating") + th("upside", "Fair value", 1) + th("upside", "vs price", 1) + '<th scope="col">Since call</th>' + th("since", "Return", 1) + th("date", "Published", 1) + "</tr></thead><tbody>" +
          L.map(function (m) {
            var c = LED && m.tk && LED[m.tk];
            return '<tr tabindex="0" data-open="' + esc(m.id) + '"><td class="tk">' + esc(m.tk || "—") + '</td><td class="nm">' + esc(m.name) + "<small>" + esc(m.sector + " · " + m.market) + "</small></td><td>" + pill(m.rating) + reviewPill(m) + '</td><td class="r">' + esc(m.fv || "—") + '</td><td class="r ' + cls(m.upside) + '">' + (m.upside == null ? "—" : pct(m.upside)) + "</td><td>" + sparkSVG(c) + '</td><td class="r ' + (c ? cls(c.return_pct) : "") + '">' + (c ? pct(c.return_pct) : "—") + '</td><td class="r mute">' + esc(m.date) + "</td></tr>";
          }).join("") + "</tbody></table></div>";
      } else {
        host.innerHTML = '<div class="grid g-3 r-cards">' + L.map(function (m) {
          var c = LED && m.tk && LED[m.tk];
          return '<button class="card" type="button" data-open="' + esc(m.id) + '"><div class="card-top mono"><span>' + esc(m.sector + " · " + m.date) + "</span><span>" + pill(m.rating) + reviewPill(m) + "</span></div><h3>" + esc(m.name) + '</h3><p class="thesis">' + esc(m.src.thesis) + "</p>" + sparkSVG(c) +
            '<div class="card-foot mono"><span>' + esc(m.fv ? "FV " + m.fv : m.kind) + (m.upside != null ? ' · <span class="' + cls(m.upside) + '">' + pct(m.upside) + "</span>" : "") + '</span><span class="go">' + ARROW + "</span></div></button>";
        }).join("") + "</div>";
      }
      if (HAS_GSAP) gsap.from(host.querySelectorAll("tbody tr, .card"), { opacity: 0, y: 14, duration: .45, stagger: .015, ease: "power2.out", clearProps: "all" });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    $("#lib-search").addEventListener("input", function (e) { st.q = e.target.value; draw(); });
    $("#lib-tools").addEventListener("click", function (e) {
      var b = e.target.closest("[data-f]"); if (!b) return;
      st[b.getAttribute("data-f")] = b.getAttribute("data-v");
      $$('[data-f="' + b.getAttribute("data-f") + '"]').forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      draw();
    });
    host.addEventListener("click", function (e) { var s = e.target.closest("[data-sort]"); if (!s) return; var k = s.getAttribute("data-sort"); st.dir = st.sort === k ? -st.dir : (k === "upside" || k === "since" ? -1 : 1); st.sort = k; draw(); });
    host.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.matches("tr[data-open]")) e.target.click(); });
    draw(); ledgerReady.then(draw);

    // coverage dashboard
    var dist = $("#lib-dist"); if (dist) {
      var india = COVERED.filter(function (m) { return m.market === "India"; }).length;
      dist.innerHTML = '<h3 class="mono mute">Ratings across ' + RATED.length + " US companies · India notes carry no rating</h3>" + distHTML(RATED) +
        '<dl class="keys" style="margin-top:22px"><div><dt>India</dt><dd>' + india + "</dd></div><div><dt>United States</dt><dd>" + (COVERED.length - india) + "</dd></div><div><dt>Sectors</dt><dd>" + (sectors.length - 1) + "</dd></div><div><dt>Macro notes</dt><dd>" + (MODELS.length - RATED.length) + "</dd></div></dl>";
    }
    var lad = $("#lib-ladder"); if (lad) {
      var drawLad = function () {
        var L = RATED.filter(function (m) { return m.upside != null; }).sort(function (a, b) { return b.upside - a.upside; });
        var w = lad.clientWidth || 700, h = 300, pt = 20, pb = 20, mx = Math.max.apply(0, L.map(function (m) { return m.upside; }).concat([5])), mn = Math.min.apply(0, L.map(function (m) { return m.upside; }).concat([-5]));
        var Y = function (v) { return pt + (mx - v) / (mx - mn) * (h - pt - pb); }, bw = w / L.length;
        var out = '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Fair value against price at publication, by company"><line x1="0" x2="' + w + '" y1="' + Y(0) + '" y2="' + Y(0) + '" stroke="var(--line-2)"/>';
        L.forEach(function (m, i) {
          var y0 = Y(Math.max(m.upside, 0)), hh = Math.max(2, Math.abs(Y(m.upside) - Y(0))), x = i * bw + bw * .18, col = m.rating === "REDUCE" ? "var(--neg)" : m.rating === "HOLD" ? "var(--mute)" : "var(--accent-text)";
          out += '<g class="bar" data-open="' + esc(m.id) + '"><title>' + esc(m.name + " — " + m.rating + " — " + pct(m.upside)) + '</title><rect x="' + (i * bw) + '" y="0" width="' + bw + '" height="' + h + '" fill="transparent"/><rect x="' + x + '" y="' + y0 + '" width="' + (bw * .64) + '" height="' + hh + '" rx="3" fill="' + col + '"/>' +
            (function () { var cx = i * bw + bw / 2 + 3.5, cy = m.upside >= 0 ? Y(0) + 7 : Y(0) - 7; return '<text class="lbl" transform="rotate(-90 ' + cx + ' ' + cy + ')" x="' + cx + '" y="' + cy + '" text-anchor="' + (m.upside >= 0 ? "end" : "start") + '">' + esc(m.tk || "") + "</text>"; })() + "</g>";
        });
        lad.innerHTML = out + '<text x="0" y="12">+' + Math.round(mx) + '%</text><text x="0" y="' + (h - 4) + '">−' + Math.abs(Math.round(mn)) + "%</text></svg>";
      };
      drawLad(); var lt; new ResizeObserver(function () { clearTimeout(lt); lt = setTimeout(drawLad, 120); }).observe(lad);
    }
    var pipe = $("#pipeline"); if (pipe) pipe.innerHTML = (D.pipeline || []).map(function (p) { return '<div class="card ghost" data-r><div class="card-top mono"><span>' + esc(p.label) + '</span><span class="pill r-macro">' + esc(p.tag) + "</span></div><h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p></div>"; }).join("");
    // deep link: research#XOM
    var id = decodeURIComponent(location.hash.slice(1)), dm = MODELS.filter(function (m) { return m.id === id; })[0];
    if (dm) ledgerReady.then(function () { openResearch(dm); });
  }

  /* ---------- motion ---------------------------------------------------- */
  function reveal(scope) {
    if (!HAS_GSAP) return;
    var els = $$("[data-r]", scope).filter(function (n) { return !n._rv; });
    els.forEach(function (n) { n._rv = 1; });
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 34 });
    ScrollTrigger.batch(els, { start: "top 92%", once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .9, ease: "power3.out", stagger: .07, overwrite: true, clearProps: "transform" }); } });
  }
  function setupMotion() {
    if (!HAS_GSAP) { root.classList.add("loaded"); window.DM.introDone = true; window.dispatchEvent(new Event("dm:intro")); return; }
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ lerp: .11, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    // intro: loader wipes up (first page of a visit), then the headline rises word by word
    var words = $$(".display").filter(function (n) { return !n.closest(".contact"); }).reduce(function (a, n) { return a.concat(splitWords(n, n.hasAttribute("data-em-last"))); }, []);
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    var loader = null, first = false;   // the loading counter was removed
    if (first && loader) {
      var n = { v: 0 }, num = $("#loader-n");
      tl.to(n, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: function () { num.textContent = ("00" + Math.round(n.v)).slice(-3); } })
        .to(loader, { yPercent: -100, duration: .9, ease: "power4.inOut", onComplete: function () { root.classList.add("loaded"); } });
      try { sessionStorage.setItem("seen", "1"); } catch (e) {}
    }
    tl.add(function () { window.DM.introDone = true; window.dispatchEvent(new Event("dm:intro")); }, first ? "-=.6" : 0);
    if (words.length) tl.from(words, { yPercent: 115, duration: 1.15, stagger: .045 }, first ? "-=.55" : 0)
      .from(".page-head .lede, .page-head .sec-label", { opacity: 0, y: 18, duration: .8, stagger: .07, clearProps: "transform" }, "<.25");
    $$(".count").forEach(function (c) {
      var o = { v: 0 }, to = +c.getAttribute("data-to"), suf = c.getAttribute("data-suffix") || "";
      tl.to(o, { v: to, duration: 1.6, ease: "power3.out", onUpdate: function () { c.textContent = Math.round(o.v) + suf; } }, "<");
    });
    // section titles rise; contact headline too
    $$(".sec-title, .contact .display, .lab-intro h2").forEach(function (t) {
      gsap.from(t, { opacity: 0, y: 50, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: t, start: "top 90%", once: true } });
    });
    // manifesto lights word by word
    $$(".manifesto").forEach(function (m) {
      var w = [];
      (function walk(node) { Array.prototype.slice.call(node.childNodes).forEach(function (c) { if (c.nodeType === 3) { var f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(function (p) { if (/^\s*$/.test(p)) f.appendChild(document.createTextNode(p)); else { var s = document.createElement("span"); s.className = "mw"; s.textContent = p; f.appendChild(s); w.push(s); } }); node.replaceChild(f, c); } else walk(c); }); })(m);
      gsap.to(w, { opacity: 1, stagger: .1, ease: "none", scrollTrigger: { trigger: m, start: "top 78%", end: "bottom 45%", scrub: true } });
    });
    if ($(".wordmark")) gsap.from(".wordmark", { yPercent: 40, opacity: 0, ease: "none", scrollTrigger: { trigger: ".wordmark", start: "top bottom", end: "bottom bottom", scrub: true } });
    $$(".dist").forEach(function (d) { gsap.from(d.children, { scaleX: 0, duration: 1, ease: "power3.out", stagger: .08, scrollTrigger: { trigger: d, start: "top 88%", once: true } }); });
    var hc = $("#hero-chart"); if (hc) gsap.to(hc, { yPercent: 14, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    reveal(document);
    setTimeout(function () { root.classList.add("loaded"); }, 3200);
  }
  function setupSpotlight() {
    document.addEventListener("pointermove", function (e) {
      var c = e.target.closest && e.target.closest(".card, .cc-side, .deal-x, .nav-links, .ld, .tp-bench, .panel, .sheet"); if (!c) return;
      var r = c.getBoundingClientRect(); c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }
  function setupAnalytics() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]"); if (!a || typeof window.gtag !== "function") return;
      var href = a.getAttribute("href") || "", file = href.split("/").pop();
      if (/\.(pdf|xlsx)(\?|$)/i.test(href)) window.gtag("event", /resume|cv/i.test(file) ? "cv_download" : "file_download", { file_name: file, file_extension: file.split(".").pop(), link_text: (a.textContent || "").trim().slice(0, 80), page: PAGE });
      else if (/^https?:/i.test(href) && href.indexOf(location.host) === -1) window.gtag("event", "outbound_click", { link_url: href, link_text: (a.textContent || "").trim().slice(0, 80), page: PAGE });
    }, true);
  }

  /* ---------- boot ------------------------------------------------------ */
  if (PAGE === "home" && D.meta) {
    document.title = D.meta.siteTitle || document.title;
    var md = $('meta[name="description"]'); if (md && D.meta.description) md.setAttribute("content", D.meta.description);
  }
  var WORLDS = {     // [glow, base] — grey everywhere except inside a call chapter, which takes its rating's colour
    open: ["#6a6e78", "#050505"], BUY: ["#19e68c", "#050907"], ACCUMULATE: ["#1fd8c4", "#05090a"], HOLD: ["#8f7dff", "#07060d"],
    REDUCE: ["#ff5a36", "#0b0605"], record: ["#7c808a", "#050505"], calm: ["#3c3e44", "#050505"]
  };
  window.DM = { D: D, MODELS: MODELS, RATED: RATED, COVERED: COVERED, WORLDS: WORLDS, asOf: asOf, review: review, models: MODELS, HAS_GSAP: HAS_GSAP, REDUCED: REDUCED, introDone: false,
    ledgerReady: ledgerReady, trackReady: trackReady, calls: function () { return CALLS; }, led: function () { return LED; }, lenis: function () { return lenis; },
    openResearch: openResearch, openDeal: openDeal, openGeneric: openGeneric, reveal: function (scope) { reveal(scope); }, liveLine: liveLine, pct: pct, cls: cls, esc: esc, fmtDate: fmtDate, pill: pill };
  buildChrome();
  setupTheme(); setupNav(); setupClock(); setupSheet(); setupPal(); setupSpotlight(); setupAnalytics();
  renderHero(); renderTape(); ledgerReady.then(renderTape);   // redraw once prices arrive, to flag stale ratings renderLatest(); renderRecord(); renderDeals(); renderTools();
  renderExperience(); renderLeadership(); renderEducation(); renderLibrary();
  setupMotion();
  ledgerReady.then(heroChart);

})();
