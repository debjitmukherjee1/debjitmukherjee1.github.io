/* ============================================================================
   app.js — behaviour only. Reads everything from siteData (js/data.js).
   ----------------------------------------------------------------------------
   You should NOT need to edit this file for content changes. It:
     1. Fills the masthead, meta tags, footer and contact block
     2. Builds the ticker (duplicated once for a seamless CSS loop)
     3. Renders every section's cards from siteData
     4. Runs the sector filter for the models gallery
     5. Runs the single reusable detail modal (open/close, focus trap, Esc)
   All code is intentionally plain and commented so a future AI or human can
   extend it safely.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- tiny helpers ------------------------------------------------ */

  // Shorthand for document.getElementById
  function byId(id) { return document.getElementById(id); }

  // Create an element with a class and optional text
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  // Escape nothing — we always use textContent, never innerHTML with data,
  // so content in data.js can safely contain any characters.

  /* ---------- 1. meta, masthead, footer, contact ------------------------- */

  function renderMeta() {
    document.title = siteData.meta.siteTitle;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", siteData.meta.description);
  }

  function renderHero() {
    // The masthead is now transparent so the fixed living backdrop (the
    // drifting market lines) shows through behind the name. The old opaque
    // skyline layer is intentionally not applied.

    // Framed portrait above the name — hidden if the file is missing.
    if (siteData.hero.portraitImage) {
      var frame = el("div", "masthead-portrait");
      var img = el("img");
      img.src = siteData.hero.portraitImage;
      img.alt = "Portrait of " + siteData.hero.name;
      img.addEventListener("error", function () { frame.remove(); });
      frame.appendChild(img);
      var kicker = byId("masthead-kicker");
      kicker.parentNode.insertBefore(frame, kicker.nextSibling);
    }

    byId("hero-name").textContent = siteData.hero.name;
    byId("hero-tagline").textContent = siteData.hero.tagline;
    byId("hero-bio").textContent = siteData.hero.bio;

    var links = byId("hero-links");
    links.appendChild(makeLink(siteData.hero.resumeUrl, "Download Resume", "mast-link mast-link-primary", true));
    links.appendChild(makeLink(siteData.hero.linkedinUrl, "LinkedIn", "mast-link", false));
    links.appendChild(makeLink("mailto:" + siteData.hero.email, "Email Me", "mast-link", false));
  }

  function makeLink(href, label, className, isDownload) {
    var a = el("a", className, label);
    a.href = href;
    if (isDownload) a.setAttribute("download", "");
    if (href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  // True when the user's OS asks for less motion — we then skip all
  // JS-driven animation (counters jump straight to their final value, etc.)
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Stats row under the bio: numbers count up when they become visible */
  function renderStats() {
    var wrap = byId("hero-stats");
    if (!siteData.hero.stats || siteData.hero.stats.length === 0) {
      wrap.remove();
      return;
    }
    siteData.hero.stats.forEach(function (s) {
      var box = el("div", "stat");
      var num = el("span", "stat-value", reducedMotion ? (s.value + s.suffix) : ("0" + s.suffix));
      box.appendChild(num);
      box.appendChild(el("span", "stat-label", s.label));
      wrap.appendChild(box);
      flapCount(num, s.value, s.suffix);
    });
  }

  /* Split-flap style counter: rolls upward toward the target, decelerating,
     and every time the shown integer changes it triggers a quick mechanical
     "flap" (a CSS keyframe) — like an airport/odometer board settling. */
  function flapCount(node, target, suffix) {
    if (reducedMotion) { node.textContent = target + suffix; return; }
    var duration = 1500, start = null, shown = -1;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var val = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (val !== shown) {
        shown = val;
        node.textContent = val + suffix;
        node.classList.remove("flap");
        void node.offsetWidth;                 // restart the flap keyframe
        node.classList.add("flap");
      }
      if (p < 1) requestAnimationFrame(tick);
      else node.classList.remove("flap");
    }
    requestAnimationFrame(tick);
  }

  /* Scroll reveal: cards and headers fade-rise in as they enter the
     viewport, staggered within each group. Classes are removed again after
     the entrance so they can't interfere with hover transitions. */
  function setupReveals() {
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    var groups = [
      ".section-head", ".card", ".credential-item",
      ".skills-col", ".contact-block", ".section-note", ".filter-bar"
    ];
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var node = entry.target;
        node.classList.add("revealed");
        observer.unobserve(node);
        // once the entrance has played, drop the classes so card hover
        // transitions behave normally again
        setTimeout(function () {
          node.classList.remove("reveal", "revealed");
          node.style.removeProperty("--reveal-delay");
        }, 1300);
      });
    }, { threshold: 0.12 });

    groups.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node, i) {
        node.classList.add("reveal");
        node.style.setProperty("--reveal-delay", ((i % 6) * 70) + "ms");
        observer.observe(node);
      });
    });
  }

  function renderFooter() {
    byId("footer-year").textContent = "© " + new Date().getFullYear() + " " + siteData.hero.name;
    var personal = byId("footer-personal");
    if (siteData.hero.personalLine) {
      personal.textContent = siteData.hero.personalLine;
    } else {
      personal.remove();
    }
  }

  function renderContact() {
    var block = byId("contact-block");
    var email = el("a", "contact-email", siteData.hero.email);
    email.href = "mailto:" + siteData.hero.email;
    block.appendChild(email);

    var row = el("div", "contact-links");
    row.appendChild(makeLink(siteData.hero.resumeUrl, "Download Resume", "mast-link mast-link-primary", true));
    row.appendChild(makeLink(siteData.hero.linkedinUrl, "LinkedIn", "mast-link", false));
    block.appendChild(row);
  }

  /* ---------- 2. the ticker ---------------------------------------------- */

  function renderTicker() {
    var tape = byId("ticker");
    var arrows = { up: "▲", down: "▼", flat: "—" };

    // Build the set twice: the CSS animation translates -50%, so a duplicate
    // set makes the loop seamless. Duplicates are aria-hidden + untabbable.
    [false, true].forEach(function (isDup) {
      siteData.ticker.forEach(function (item) {
        var btn = el("button", "ticker-item" + (isDup ? " ticker-item-dup" : ""));
        btn.type = "button";
        if (isDup) { btn.setAttribute("aria-hidden", "true"); btn.tabIndex = -1; }

        btn.appendChild(el("span", "ticker-label", item.label));
        btn.appendChild(el("span", "ticker-value", item.value));
        btn.appendChild(el("span", "ticker-dir-" + (item.direction || "flat"), arrows[item.direction] || arrows.flat));

        if (item.sectionId) {
          btn.setAttribute("aria-label", item.label + ": " + item.value + ". Jump to section.");
          btn.addEventListener("click", function () {
            var target = byId(item.sectionId);
            if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
        tape.appendChild(btn);
      });
    });
  }

  /* ---------- 3. the reusable detail modal ------------------------------- */

  var backdrop, modal, closeBtn, lastFocused = null;

  function openModal(buildBody) {
    var body = byId("modal-body");
    body.innerHTML = "";           // clear previous content
    buildBody(body);               // caller fills in the detail view

    lastFocused = document.activeElement;
    backdrop.hidden = false;
    // next frame, add .open so the CSS fade/rise transition plays
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        backdrop.classList.add("open");
        // draw the illustrative chart now that the modal has layout width
        var tc = modal.querySelector("canvas[data-terminal-chart]");
        if (tc) animateTerminalChart(tc);
      });
    });
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    // wait for the fade-out before actually hiding (instant if reduced motion)
    setTimeout(function () { backdrop.hidden = true; }, reducedMotion ? 0 : 260);
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function setupModal() {
    backdrop = byId("modal-backdrop");
    modal = byId("modal");
    closeBtn = byId("modal-close");

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();   // click outside the panel
    });

    document.addEventListener("keydown", function (e) {
      if (backdrop.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }

      // Simple focus trap: keep Tab cycling inside the modal
      if (e.key === "Tab") {
        var focusables = modal.querySelectorAll("a[href], button:not([disabled])");
        if (focusables.length === 0) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  // Shared pieces used by several modal builders --------------------------

  function modalHeader(body, kicker, title, sub) {
    body.appendChild(el("p", "modal-kicker", kicker));
    var h = el("h3", "modal-title", title);
    h.id = "modal-title";          // referenced by aria-labelledby on the dialog
    body.appendChild(h);
    if (sub) body.appendChild(el("p", "modal-sub", sub));
  }

  function modalBullets(body, bullets) {
    if (!bullets || bullets.length === 0) return;
    var ul = el("ul");
    bullets.forEach(function (b) { ul.appendChild(el("li", null, b)); });
    body.appendChild(ul);
  }

  // Photos: shows the image if it loads, otherwise a labelled placeholder
  // frame — so Phase 1 (no real photos yet) still looks intentional.
  function modalPhotos(body, photos) {
    if (!photos || photos.length === 0) return;
    var grid = el("div", "modal-photos");
    photos.forEach(function (p) {
      var fig = el("figure", "modal-photo");
      fig.style.margin = "0";
      var img = el("img");
      img.src = p.src;
      img.alt = p.caption || "Photo";
      img.loading = "lazy";
      img.addEventListener("error", function () {
        var ph = el("div", "photo-placeholder", "PHOTO PLACEHOLDER");
        fig.replaceChild(ph, img);
      });
      fig.appendChild(img);
      if (p.caption) fig.appendChild(el("figcaption", null, p.caption));
      grid.appendChild(fig);
    });
    body.appendChild(grid);
  }

  /* ---------- 4. section renderers ---------------------------------------
     Every card is a <button> so it is keyboard-operable by default.       */

  function makeCard(kicker, title, sub, summary, onOpen) {
    var card = el("button", "card");
    card.type = "button";
    if (kicker) card.appendChild(el("p", "card-kicker", kicker));
    card.appendChild(el("h3", "card-title", title));
    if (sub) card.appendChild(el("p", "card-sub", sub));
    if (summary) card.appendChild(el("p", "card-summary", summary));
    card.appendChild(el("span", "card-open-hint", "OPEN ↗"));
    card.addEventListener("click", onOpen);
    return card;
  }

  function renderEducation() {
    var grid = byId("education-grid");
    siteData.education.forEach(function (item) {
      grid.appendChild(makeCard(
        item.years, item.institution, item.degree, item.focus,
        function () {
          openModal(function (body) {
            modalHeader(body, "EDUCATION · " + item.years, item.institution, item.degree);
            body.appendChild(el("p", "modal-detail", item.detail));
            modalBullets(body, item.bullets);
          });
        }
      ));
    });
  }

  function renderLeadership() {
    var featuredWrap = byId("leadership-featured");
    var grid = byId("leadership-grid");

    siteData.leadership.forEach(function (item) {
      var openDetail = function () {
        openModal(function (body) {
          modalHeader(body, "LEADERSHIP · " + item.years, item.role, item.organization);
          if (item.summary) body.appendChild(el("p", "modal-detail", item.summary));
          modalBullets(body, item.bullets);
          modalPhotos(body, item.photos);
        });
      };

      if (item.featured) {
        // Featured card gets a "LAUNCHING" badge and full width
        var card = el("button", "card card-featured");
        card.type = "button";
        card.appendChild(el("p", "card-kicker", "FEATURED · " + item.years));
        var h = el("h3", "card-title", item.role + " — " + item.organization);
        h.appendChild(el("span", "badge-launching", "LAUNCHING SOON"));
        card.appendChild(h);
        if (item.summary) card.appendChild(el("p", "card-summary", item.summary));
        card.appendChild(el("span", "card-open-hint", "OPEN ↗"));
        card.addEventListener("click", openDetail);
        featuredWrap.appendChild(card);
      } else {
        grid.appendChild(makeCard(item.years, item.role, item.organization, item.summary, openDetail));
      }
    });
  }

  function renderExperience() {
    var grid = byId("experience-grid");
    siteData.experience.forEach(function (item) {
      grid.appendChild(makeCard(
        item.dates, item.company, item.role + (item.location ? " · " + item.location : ""), item.summary,
        function () {
          openModal(function (body) {
            modalHeader(body, "EXPERIENCE · " + item.dates, item.company, item.role);
            modalBullets(body, item.bullets);
            modalPhotos(body, item.photos);
          });
        }
      ));
    });
  }

  /* ---------- 4b. tools & live terminals ---------------------------------- */

  // Turns the text before the first " — " in a tool's summary into a
  // lower-cased descriptive clause for its aria-label, e.g. "A sentiment-
  // adjusted valuation tool — blends…" -> "a sentiment-adjusted valuation
  // tool" (mirrors the hand-written side-tab aria-labels above).
  function toolShortDesc(summary) {
    var idx = summary.indexOf(" — ");
    var phrase = idx === -1 ? summary : summary.slice(0, idx);
    return phrase.charAt(0).toLowerCase() + phrase.slice(1);
  }

  function toolChrome() {
    var chrome = el("div", "tool-chrome");
    chrome.setAttribute("aria-hidden", "true");
    chrome.appendChild(el("i"));
    chrome.appendChild(el("i"));
    chrome.appendChild(el("i"));
    return chrome;
  }

  // Builds the tools grid from siteData.tools. The whole section is removed
  // if the list is missing/empty, so older data.js files keep working.
  function renderTools() {
    var section = byId("tools");
    var grid = byId("tools-grid");
    if (!section || !grid || !siteData.tools || siteData.tools.length === 0) {
      if (section) section.remove();
      return;
    }

    siteData.tools.forEach(function (item) {
      if (item.status === "live") {
        var card = el("a", "card tool-card");
        card.href = item.url;
        card.target = "_blank";
        card.rel = "noopener";
        card.setAttribute("aria-label", "Open " + item.name + ", " + toolShortDesc(item.summary) + ", in a new tab");
        card.appendChild(toolChrome());
        card.appendChild(el("span", "tool-live", "LIVE"));
        card.appendChild(el("h3", "card-title", item.name));
        card.appendChild(el("p", "card-summary", item.summary));

        var ro = el("div", "model-readout");
        ro.appendChild(el("span", "ro-label", "TYPE"));
        ro.appendChild(el("span", "ro-val", item.type));
        ro.appendChild(el("span", "ro-label", "COST"));
        ro.appendChild(el("span", "ro-val", "FREE"));
        card.appendChild(ro);

        card.appendChild(el("span", "tool-launch card-open-hint", "LAUNCH ↗"));
        grid.appendChild(card);
      } else {
        var soon = el("div", "card tool-card is-soon");
        soon.appendChild(toolChrome());
        soon.appendChild(el("span", "tool-soon-tag", "IN DEVELOPMENT"));
        soon.appendChild(el("h3", "card-title", item.name));
        soon.appendChild(el("p", "card-summary", item.summary));

        var ro2 = el("div", "model-readout");
        ro2.appendChild(el("span", "ro-label", "STATUS"));
        ro2.appendChild(el("span", "ro-val", "BUILDING"));
        soon.appendChild(ro2);

        grid.appendChild(soon);
      }
    });
  }

  /* ---------- 5. models gallery + sector filter --------------------------- */

  var activeSector = "All";

  /* Cross-filter state shared by the sector buttons, the market/rating chips
     and the free-text search box (all added in the tools upgrade).
     renderModels() is the single place that consults all of it together. */
  var libraryFilter = { market: "All", rating: "All", query: "" };

  // Prefer the explicit market field on the model; fall back to inferring
  // it from the currency symbol in its price fields for entries that lack it.
  function marketOf(m) {
    if (m.market) return m.market;
    if (m.sector === "Macro") return "Macro";
    var s = (m.targetPrice || "") + (m.impliedValue || "");
    if (s.indexOf("₹") !== -1) return "India";
    if (s.indexOf("$") !== -1) return "US";
    return "Other";
  }

  // Collapses the four ratings into the three chip groups — BUY covers
  // ACCUMULATE, REDUCE covers SELL.
  function ratingGroup(r) {
    if (r === "BUY" || r === "ACCUMULATE") return "BUY";
    if (r === "REDUCE" || r === "SELL") return "REDUCE";
    if (r === "HOLD") return "HOLD";
    return "OTHER";
  }

  function passesLibraryFilter(item) {
    if (activeSector !== "All" && item.sector !== activeSector) return false;
    if (libraryFilter.market !== "All" && marketOf(item) !== libraryFilter.market) return false;
    if (libraryFilter.rating !== "All" && ratingGroup(item.rating) !== libraryFilter.rating) return false;
    if (libraryFilter.query) {
      var hay = (item.title + " " + item.thesis + " " + item.sector).toLowerCase();
      if (hay.indexOf(libraryFilter.query) === -1) return false;
    }
    return true;
  }

  /* ---- illustrative model charts ----------------------------------------
     Decorative "terminal" line charts: a deterministic random walk seeded
     from the company name and gently biased by the rating direction. These
     are NOT real price history (the real figures live in each linked report /
     model); every detail chart is labelled as illustrative. Restores the
     charts the site carried in an earlier version. Static images, so they're
     fine under reduced motion. */

  var CHART_UP = "#6fae85", CHART_UP_A = "111,174,133";
  var CHART_DN = "#bd6a5f", CHART_DN_A = "189,106,95";

  function chartRng(seedStr) {
    var h = 2166136261;
    for (var i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5;
      var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function chartSeries(seed, n, trend) {
    var r = chartRng(seed);
    var out = [100];
    for (var i = 1; i < n; i++) out.push(out[i - 1] + (r() - 0.5 + trend * 0.06) * 3.2);
    return out;
  }

  function trendForRating(rating) {
    if (rating === "BUY") return 1;
    if (rating === "ACCUMULATE") return 0.5;
    if (rating === "HOLD") return 0;
    if (rating === "SELL" || rating === "REDUCE") return -0.7;
    return 0.2;   // macro / unrated: gentle drift
  }

  function setupCanvas(c, cssH) {
    var dpr = window.devicePixelRatio || 1;
    var rect = c.getBoundingClientRect();
    var w = rect.width, h = cssH || rect.height;
    if (w === 0) return null;
    c.width = w * dpr;
    c.height = h * dpr;
    var ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx: ctx, w: w, h: h };
  }

  // Build the visible polyline up to fraction p (0..1) of the series, with a
  // smoothly interpolated head so the line appears to draw itself on.
  function partialPoints(data, X, Y, p) {
    var last = (data.length - 1) * p, full = Math.floor(last), frac = last - full, pts = [], i;
    for (i = 0; i <= full && i < data.length; i++) pts.push([X(i), Y(data[i])]);
    if (full < data.length - 1 && frac > 0) {
      pts.push([X(full) + (X(full + 1) - X(full)) * frac,
                Y(data[full]) + (Y(data[full + 1]) - Y(data[full])) * frac]);
    }
    return pts;
  }

  function drawSpark(c, p) {
    if (p === undefined) p = 1;
    var env = setupCanvas(c, 52);
    if (!env) return;
    var ctx = env.ctx, w = env.w, h = env.h;
    var data = chartSeries(c.getAttribute("data-seed") || "x", 44, parseFloat(c.getAttribute("data-trend")) || 0);
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var X = function (i) { return (i / (data.length - 1)) * w; };
    var Y = function (v) { return h - 4 - ((v - min) / (max - min || 1)) * (h - 8); };
    var up = data[data.length - 1] >= data[0];
    var col = up ? CHART_UP : CHART_DN, colA = up ? CHART_UP_A : CHART_DN_A;
    var pts = partialPoints(data, X, Y, p);
    if (pts.length < 2) return;
    // faint area fill under the drawn portion
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var a = 1; a < pts.length; a++) ctx.lineTo(pts[a][0], pts[a][1]);
    ctx.lineTo(pts[pts.length - 1][0], h); ctx.lineTo(pts[0][0], h); ctx.closePath();
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(" + colA + ",0.14)");
    g.addColorStop(1, "rgba(" + colA + ",0)");
    ctx.fillStyle = g; ctx.fill();
    // line
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (var b = 1; b < pts.length; b++) ctx.lineTo(pts[b][0], pts[b][1]);
    ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
  }

  function animateSpark(c) {
    if (reducedMotion) { drawSpark(c, 1); return; }
    var dur = 850, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      drawSpark(c, 1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function drawTerminalChart(c, p) {
    if (p === undefined) p = 1;
    var env = setupCanvas(c, 220);
    if (!env) return;
    var ctx = env.ctx, w = env.w, h = env.h;
    // same seed + length as the card sparkline so the modal shows the SAME
    // line (just larger), not a different path
    var data = chartSeries(c.getAttribute("data-seed") || "x", 44, parseFloat(c.getAttribute("data-trend")) || 0);
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var padL = 6, padR = 6, padT = 12, padB = 16;
    var X = function (i) { return padL + (i / (data.length - 1)) * (w - padL - padR); };
    var Y = function (v) { return h - padB - ((v - min) / (max - min || 1)) * (h - padT - padB); };
    // horizontal grid lines (always full)
    ctx.strokeStyle = "rgba(" + (typeof CHART_GRID !== "undefined" ? CHART_GRID : "174,185,201") + ",0.08)"; ctx.lineWidth = 1;
    for (var gy = 0; gy <= 3; gy++) {
      var yy = padT + (gy / 3) * (h - padT - padB);
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(w - padR, yy); ctx.stroke();
    }
    var up = data[data.length - 1] >= data[0];
    var col = up ? CHART_UP : CHART_DN, colA = up ? CHART_UP_A : CHART_DN_A;
    var pts = partialPoints(data, X, Y, p);
    if (pts.length < 2) return;
    // area under drawn portion
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineTo(pts[pts.length - 1][0], h - padB); ctx.lineTo(pts[0][0], h - padB); ctx.closePath();
    var g = ctx.createLinearGradient(0, padT, 0, h - padB);
    g.addColorStop(0, "rgba(" + colA + ",0.18)");
    g.addColorStop(1, "rgba(" + colA + ",0)");
    ctx.fillStyle = g; ctx.fill();
    // line + moving head dot
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var j = 1; j < pts.length; j++) ctx.lineTo(pts[j][0], pts[j][1]);
    ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.stroke();
    var head = pts[pts.length - 1];
    ctx.beginPath(); ctx.arc(head[0], head[1], 2.5, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
  }

  function animateTerminalChart(c) {
    if (reducedMotion) { drawTerminalChart(c, 1); return; }
    var dur = 900, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      drawTerminalChart(c, 1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function drawAllSparks() {
    var grid = byId("models-grid");
    if (!grid) return;
    grid.querySelectorAll("canvas.spark").forEach(function (c, i) {
      if (c.getAttribute("data-drawn") === "1") return;
      c.setAttribute("data-drawn", "1");
      if (reducedMotion) { drawSpark(c, 1); return; }
      setTimeout(function () { animateSpark(c); }, (i % 8) * 60);   // gentle stagger
    });
  }

  // Redraw charts on resize (canvas is pixel-based, so it must be re-rendered).
  // On resize we draw the final frame directly — no re-animation.
  function setupChartResize() {
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var grid = byId("models-grid");
        if (grid) grid.querySelectorAll("canvas.spark").forEach(function (c) { drawSpark(c, 1); });
      }, 200);
    });
  }

  function ratingClass(rating) {
    // Positive calls read muted-green, negative calls muted-red; anything
    // neutral (HOLD, or no rating) stays grey. ACCUMULATE and REDUCE are
    // buy-/sell-leaning, so they inherit the same directional colour.
    if (rating === "BUY" || rating === "ACCUMULATE") return "ro-buy";
    if (rating === "SELL" || rating === "REDUCE") return "ro-sell";
    return "ro-hold";
  }

  function renderModelCard(item) {
    var card = el("button", "card");
    card.type = "button";
    card.appendChild(el("p", "sector-tag", item.sector + (item.date ? "  ·  " + item.date : "")));
    card.appendChild(el("h3", "card-title", item.title));
    card.appendChild(el("p", "card-summary", item.thesis));

    // Illustrative sparkline (seeded from title, biased by rating direction)
    var spark = el("canvas", "spark");
    spark.setAttribute("data-seed", item.title);
    spark.setAttribute("data-trend", String(trendForRating(item.rating)));
    spark.setAttribute("aria-hidden", "true");
    card.appendChild(spark);

    // Terminal-style readout strip: only lines that have values
    if (item.rating || item.targetPrice || item.impliedValue) {
      var ro = el("div", "model-readout");
      if (item.rating) {
        ro.appendChild(el("span", "ro-label", "RATING"));
        ro.appendChild(el("span", ratingClass(item.rating), item.rating));
      }
      if (item.targetPrice) {
        ro.appendChild(el("span", "ro-label", "TP"));
        ro.appendChild(el("span", "ro-val", item.targetPrice));
      }
      if (item.impliedValue) {
        ro.appendChild(el("span", "ro-label", "IMPLIED"));
        ro.appendChild(el("span", "ro-val", item.impliedValue));
      }
      card.appendChild(ro);
    }

    card.appendChild(el("span", "card-open-hint", "OPEN ↗"));
    card.addEventListener("click", function () {
      openModal(function (body) {
        modalHeader(body, "MODEL · " + item.sector + (item.date ? " · " + item.date : ""), item.title, item.thesis);
        // Tear-sheet metric band — reads like the masthead of a one-page note
        if (item.rating || item.targetPrice || item.impliedValue) {
          var ts = el("div", "tearsheet");
          if (item.rating) {
            var tc1 = el("div", "ts-cell");
            tc1.appendChild(el("span", "ts-label", "Rating"));
            tc1.appendChild(el("span", "ts-badge " + ratingClass(item.rating), item.rating));
            ts.appendChild(tc1);
          }
          if (item.targetPrice) {
            var tc2 = el("div", "ts-cell");
            tc2.appendChild(el("span", "ts-label", "Target"));
            tc2.appendChild(el("span", "ts-value", item.targetPrice));
            ts.appendChild(tc2);
          }
          if (item.impliedValue) {
            var tc3 = el("div", "ts-cell");
            tc3.appendChild(el("span", "ts-label", "Implied"));
            tc3.appendChild(el("span", "ts-value", item.impliedValue));
            ts.appendChild(tc3);
          }
          body.appendChild(ts);
        }
        // Illustrative terminal chart — clearly labelled, not real price data
        var chartWrap = el("div", "model-chart");
        var tcanvas = el("canvas");
        tcanvas.setAttribute("data-terminal-chart", "");
        tcanvas.setAttribute("data-seed", item.title);
        tcanvas.setAttribute("data-trend", String(trendForRating(item.rating)));
        tcanvas.setAttribute("aria-hidden", "true");
        chartWrap.appendChild(tcanvas);
        chartWrap.appendChild(el("p", "model-chart-label", "Illustrative price path — actual figures in the linked report"));
        body.appendChild(chartWrap);
        // the written thesis / detail sits under the numbers, like a note body
        body.appendChild(el("p", "modal-detail", item.detail));
        // Primary file link (usually the research report PDF)…
        if (item.fileUrl) {
          var a = el("a", "modal-file-link", item.fileLabel || "View file");
          a.href = item.fileUrl;
          a.target = "_blank";
          a.rel = "noopener";
          body.appendChild(a);
        }
        // …and an optional second link (usually the Excel model download)
        if (item.fileUrl2) {
          var a2 = el("a", "modal-file-link modal-file-link-secondary", item.fileLabel2 || "Download model");
          a2.href = item.fileUrl2;
          a2.setAttribute("download", "");
          body.appendChild(a2);
        }
      });
    });
    return card;
  }

  function renderModels() {
    var grid = byId("models-grid");
    grid.innerHTML = "";
    siteData.models.forEach(function (item) {
      if (passesLibraryFilter(item)) {
        grid.appendChild(renderModelCard(item));
      }
    });
    // draw the sparklines once the new cards have layout
    requestAnimationFrame(drawAllSparks);
  }

  /* Wires the market/rating chip row and the search box added in the tools
     upgrade (static markup in index.html — .filter-row2). No-op if that
     markup isn't present, so older builds of index.html keep working. */
  function setupLibraryFilters() {
    var row = document.querySelector(".filter-row2");
    if (!row) return;

    function wire(selector, apply) {
      row.querySelectorAll(selector).forEach(function (btn) {
        btn.addEventListener("click", function () {
          apply(btn);
          row.querySelectorAll(selector).forEach(function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          renderModels();
        });
      });
    }
    wire(".fx-market", function (btn) { libraryFilter.market = btn.getAttribute("data-m"); });
    wire(".fx-rating", function (btn) { libraryFilter.rating = btn.getAttribute("data-r"); });

    var search = byId("lib-search");
    if (search) {
      search.addEventListener("input", function (e) {
        libraryFilter.query = e.target.value.trim().toLowerCase();
        renderModels();
      });
    }
  }

  /* Desk strip: coverage / ratings / macro / pipeline counts, computed live
     from siteData so the numbers can never drift out of sync with the
     library itself. No-op if the markup isn't present. */
  function renderDeskStrip() {
    var strip = byId("desk-strip");
    if (!strip) return;

    var counts = { BUY: 0, ACCUMULATE: 0, HOLD: 0, REDUCE: 0 };
    siteData.models.forEach(function (m) { if (counts[m.rating] !== undefined) counts[m.rating]++; });
    var covered = siteData.models.filter(function (m) { return m.sector !== "Macro"; }).length;
    var macroCount = siteData.models.length - covered;
    var pipelineCount = (siteData.pipeline || []).length;

    function stat(label, value) {
      var span = el("span");
      span.appendChild(document.createTextNode(label + " "));
      span.appendChild(el("b", null, value));
      strip.appendChild(span);
    }
    stat("COVERAGE", covered + " NAMES");
    stat("RATINGS", counts.BUY + " BUY · " + counts.ACCUMULATE + " ACC · " + counts.HOLD + " HOLD · " + counts.REDUCE + " REDUCE");
    stat("MACRO STUDIES", String(macroCount));
    stat("PIPELINE", pipelineCount + " IN BUILD");
  }

  /* Pipeline: ghost cards for "coming to coverage", from siteData.pipeline.
     The whole block (heading + grid) is removed if the list is empty/absent. */
  function renderPipeline() {
    var wrap = byId("pipeline-wrap");
    if (!wrap) return;
    if (!siteData.pipeline || siteData.pipeline.length === 0) { wrap.remove(); return; }

    var grid = byId("pipeline-grid");
    siteData.pipeline.forEach(function (item) {
      var card = el("div", "card pipe-card");
      card.appendChild(el("p", "sector-tag", item.label));
      card.appendChild(el("h3", "card-title", item.title));
      card.appendChild(el("p", "card-summary", item.summary));
      if (item.tag) card.appendChild(el("span", "pipe-tag", item.tag));
      grid.appendChild(card);
    });
  }

  function renderFilters() {
    var bar = byId("sector-filters");

    // Sector list is derived from the data, so new sectors in data.js
    // automatically get a filter button — no code change needed.
    var sectors = ["All"];
    siteData.models.forEach(function (m) {
      if (sectors.indexOf(m.sector) === -1) sectors.push(m.sector);
    });

    sectors.forEach(function (sector) {
      var btn = el("button", "filter-btn", sector);
      btn.type = "button";
      btn.setAttribute("aria-pressed", sector === activeSector ? "true" : "false");
      btn.addEventListener("click", function () {
        activeSector = sector;
        bar.querySelectorAll(".filter-btn").forEach(function (b) {
          b.setAttribute("aria-pressed", b.textContent === sector ? "true" : "false");
        });
        renderModels();
      });
      bar.appendChild(btn);
    });
  }

  /* ---------- 6. credentials & skills ------------------------------------ */

  function renderCredentials() {
    var list = byId("credentials-list");
    siteData.credentials.forEach(function (item) {
      var li = el("li", "credential-item");
      var btn = el("button", "credential-btn");
      btn.type = "button";
      btn.appendChild(el("span", "credential-name", item.name));
      btn.appendChild(el("span", "credential-status", item.status));
      btn.appendChild(el("span", "credential-issuer", item.issuer));

      if (typeof item.progress === "number") {
        var bar = el("div", "credential-bar");
        var fill = el("div", "credential-bar-fill");
        fill.style.width = Math.max(0, Math.min(100, item.progress)) + "%";
        bar.appendChild(fill);
        btn.appendChild(bar);
      }

      btn.addEventListener("click", function () {
        openModal(function (body) {
          modalHeader(body, "CREDENTIAL · " + item.issuer, item.name, item.status);
          if (item.detail) body.appendChild(el("p", "modal-detail", item.detail));
        });
      });

      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  function renderSkills() {
    siteData.skills.technical.forEach(function (s) {
      byId("skills-technical").appendChild(el("li", null, s));
    });
    siteData.skills.soft.forEach(function (s) {
      byId("skills-soft").appendChild(el("li", null, s));
    });
  }

  /* Boot overlay: quick 0→100% "loading market data" sequence, shown once
     per browser session. Removed instantly for reduced-motion users. */
  function runBoot() {
    var boot = byId("boot");
    if (!boot) return;

    var seen = false;
    try { seen = sessionStorage.getItem("dm-booted") === "1"; } catch (e) { /* private mode */ }

    if (reducedMotion || seen) { boot.remove(); return; }

    var pct = byId("boot-pct");
    var fill = byId("boot-fill");
    var duration = 950;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 2);
      var v = Math.round(eased * 100);
      pct.textContent = v + "%";
      fill.style.width = v + "%";
      if (p < 1) { requestAnimationFrame(tick); return; }
      boot.classList.add("done");
      setTimeout(function () { boot.remove(); }, 500);
      try { sessionStorage.setItem("dm-booted", "1"); } catch (e) { /* ignore */ }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- 7. atmosphere: clock, ticker pulse, cursor light ------------ */

  /* Live world-markets clock under the bio (MUM / LON / NYC). Decorative,
     so it's aria-hidden. Seconds tick only when motion is allowed. */
  function renderMarketClock() {
    var links = byId("hero-links");
    if (!links || typeof Intl === "undefined" || !Intl.DateTimeFormat) return;

    var clock = el("div", "market-clock");
    clock.setAttribute("aria-hidden", "true");
    links.parentNode.insertBefore(clock, links);

    var zones = [
      { label: "MUM", tz: "Asia/Kolkata" },
      { label: "LON", tz: "Europe/London" },
      { label: "NYC", tz: "America/New_York" }
    ];
    function paint() {
      var opts = { hour: "2-digit", minute: "2-digit", hour12: false };
      if (!reducedMotion) opts.second = "2-digit";
      var now = new Date();
      clock.textContent = zones.map(function (z) {
        opts.timeZone = z.tz;
        return z.label + " " + new Intl.DateTimeFormat("en-GB", opts).format(now);
      }).join("   ·   ");
    }
    paint();
    if (!reducedMotion) setInterval(paint, 1000);
  }

  /* Live "reprint": every few seconds a random tape item briefly flashes,
     the way a real ticker repaints a quote. Off under reduced motion. */
  function startTickerPulse() {
    if (reducedMotion) return;
    var tape = byId("ticker");
    if (!tape) return;
    var items = tape.querySelectorAll(".ticker-item");
    if (!items.length) return;
    setInterval(function () {
      var pick = items[Math.floor(Math.random() * items.length)];
      pick.classList.remove("ticker-item-pulse");
      void pick.offsetWidth;               // reflow so the animation restarts
      pick.classList.add("ticker-item-pulse");
    }, 2800);
  }

  /* ---- THE LIVING BACKDROP -----------------------------------------------
     One fixed, full-viewport canvas behind the whole page. It renders a
     single cohesive "after-hours trading floor" scene whose layers fade in
     and out as you scroll, so the background visibly shifts between sections
     while staying one consistent, palette-locked picture:
        top      → drifting market lines (the hero animation, kept)
        middle   → a slow candlestick field
        bottom   → soft out-of-focus "city / desk lights" (bokeh)
     Sized from the WINDOW (never from itself), dpr-clamped, and it respects
     reduced motion (draws a still frame and only re-renders on scroll). */

  // smoothstep 0→1 between edges a and b
  function sstep(a, b, x) {
    if (x <= a) return 0;
    if (x >= b) return 1;
    var t = (x - a) / (b - a);
    return t * t * (3 - 2 * t);
  }

  function sceneGrid(ctx, w, h, scrollY) {
    var gs = 64, off = (scrollY * 0.06) % gs, x, y;
    ctx.strokeStyle = "rgba(174,185,201,0.045)";
    ctx.lineWidth = 1;
    for (x = 0; x <= w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (y = -gs + off; y <= h + gs; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  }

  function sceneLines(ctx, w, h, t) {
    var lines = [
      { seed: "scene-a", color: "rgba(174,185,201,0.34)", amp: 66, speed: 0.00016, trend: 0.9 },
      { seed: "scene-b", color: "rgba(233,235,239,0.18)", amp: 48, speed: 0.00011, trend: 0.5 },
      { seed: "scene-c", color: "rgba(150,158,171,0.13)", amp: 78, speed: 0.00007, trend: 0.2 }
    ];
    lines.forEach(function (L) {
      var r = chartRng(L.seed), phase = t * L.speed, n = 100, i, xx, base, wob, yy;
      ctx.beginPath();
      for (i = 0; i <= n; i++) {
        xx = (i / n) * w;
        base = h * 0.5 - (i / n) * L.trend * h * 0.18;
        wob = Math.sin(i * 0.5 + phase * 6 + r() * 4) * L.amp * 0.35 +
              Math.sin(i * 0.12 + phase * 2.4) * L.amp * 0.65;
        yy = base + wob;
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.strokeStyle = L.color;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });
  }

  function sceneCandles(ctx, w, h, t, candles) {
    var n = candles.length, cw = w / n, baseline = h * 0.62, unit = h * 0.30;
    for (var i = 0; i < n; i++) {
      var cd = candles[i];
      var cx = i * cw + cw * 0.5;
      var sway = Math.sin(t * 0.5 + i * 0.6) * 0.5 + 0.5;             // 0..1 slow
      var oPx = baseline - (cd.o * 0.7 + sway * 0.3) * unit;
      var cPx = baseline - (cd.c * 0.7 + (1 - sway) * 0.3) * unit;
      var wickTop = Math.min(oPx, cPx) - cd.wick * unit * 0.5;
      var wickBot = Math.max(oPx, cPx) + (1 - cd.wick) * unit * 0.35;
      var col = cd.up ? "111,174,133" : "189,106,95";
      ctx.strokeStyle = "rgba(" + col + ",0.62)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, wickTop); ctx.lineTo(cx, wickBot); ctx.stroke();
      var bw = Math.max(2, cw * 0.5);
      ctx.fillStyle = "rgba(" + col + ",0.42)";
      ctx.fillRect(cx - bw / 2, Math.min(oPx, cPx), bw, Math.max(2, Math.abs(cPx - oPx)));
    }
  }

  function sceneBokeh(ctx, w, h, t, pts) {
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      var px = p.x * w + Math.sin(t * 0.15 + p.ph) * 24;
      var py = p.y * h + Math.cos(t * 0.11 + p.ph) * 20;
      var rad = 40 + p.r * 130;
      var a = 0.07 + p.s * 0.08;
      var g = ctx.createRadialGradient(px, py, 0, px, py, rad);
      g.addColorStop(0, "rgba(191,201,215," + a + ")");
      g.addColorStop(1, "rgba(191,201,215,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
    }
  }

  function startSceneEngine() {
    var c = byId("scene");
    if (!c) return;
    var ctx = c.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = window.innerWidth, h = window.innerHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      c.style.width = w + "px"; c.style.height = h + "px";
    }
    resize();
    window.addEventListener("resize", function () { resize(); if (reducedMotion) draw(0); });

    // seeded, stable props for candles + bokeh
    var rC = chartRng("scene-candles"), candles = [], i;
    for (i = 0; i < 56; i++) candles.push({ o: rC(), c: rC(), wick: rC(), up: rC() > 0.5 });
    var rB = chartRng("scene-bokeh"), bokeh = [];
    for (i = 0; i < 24; i++) bokeh.push({ x: rB(), y: rB(), r: rB(), s: rB(), ph: rB() * 6.283 });

    function draw(ts) {
      var w = window.innerWidth, h = window.innerHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var maxScroll = Math.max(1, document.documentElement.scrollHeight - h);
      var f = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      var t = ts * 0.001;

      sceneGrid(ctx, w, h, window.scrollY);

      var aLines = 1 - sstep(0.04, 0.30, f);
      if (aLines > 0.01) { ctx.globalAlpha = aLines; sceneLines(ctx, w, h, t); ctx.globalAlpha = 1; }

      var aCandles = sstep(0.14, 0.42, f) * (1 - sstep(0.66, 0.9, f));
      if (aCandles > 0.01) { ctx.globalAlpha = aCandles; sceneCandles(ctx, w, h, t, candles); ctx.globalAlpha = 1; }

      var aBokeh = sstep(0.58, 0.95, f);
      if (aBokeh > 0.01) { ctx.globalAlpha = aBokeh; sceneBokeh(ctx, w, h, t, bokeh); ctx.globalAlpha = 1; }
    }

    if (reducedMotion) {
      draw(0);
      window.addEventListener("scroll", function () { draw(0); }, { passive: true });
      return;
    }
    (function loop(ts) { draw(ts); requestAnimationFrame(loop); })(0);
  }

  /* Cursor-follow light + 3D tilt on cards. Delegation covers cards rebuilt
     by the sector filter. Skipped on touch / reduced motion. */
  function setupCardSpotlight() {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    var lastCard = null;
    function reset(card) {
      if (!card) return;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    }
    document.addEventListener("pointermove", function (e) {
      var card = e.target && e.target.closest ? e.target.closest(".card") : null;
      if (card !== lastCard) { reset(lastCard); lastCard = card; }
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      card.style.setProperty("--ry", ((px - 0.5) * 6).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
    }, { passive: true });
  }

  /* Magnetic hero / contact links — gently pull toward the cursor, spring
     back on leave (the spring comes from the CSS transform transition). */
  function setupMagnetic() {
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll(".mast-link").forEach(function (a) {
      a.addEventListener("pointermove", function (e) {
        var r = a.getBoundingClientRect();
        // gentler pull + hard clamp so it stays composed, not fidgety
        var mx = Math.max(-7, Math.min(7, (e.clientX - (r.left + r.width / 2)) * 0.15));
        var my = Math.max(-5, Math.min(5, (e.clientY - (r.top + r.height / 2)) * 0.15));
        a.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
      });
      a.addEventListener("pointerleave", function () { a.style.transform = ""; });
    });
  }

  /* Hero photo depth parallax — the masthead background drifts a few pixels
     opposite the cursor, eased. Only visibly affects the light-theme photo. */
  function setupHeroParallax() {
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) return;
    var mast = document.querySelector(".masthead");
    if (!mast) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    function apply() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      mast.style.backgroundPosition = "calc(50% + " + cx.toFixed(1) + "px) calc(38% + " + cy.toFixed(1) + "px)";
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(apply); else raf = null;
    }
    mast.addEventListener("pointermove", function (e) {
      var r = mast.getBoundingClientRect();
      tx = -((e.clientX - r.width / 2) / r.width) * 8;   /* much subtler drift */
      ty = -((e.clientY - r.height / 2) / r.height) * 5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    mast.addEventListener("pointerleave", function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
  }

  /* Grab-and-fling ticker: takes over from the CSS auto-scroll so the tape
     can be dragged and thrown, decelerating with friction, then resuming its
     drift. Under reduced motion the CSS static/scrollable tape is left alone. */
  function setupTickerDrive() {
    if (reducedMotion) return;
    var wrap = document.querySelector(".ticker-wrap"), tape = byId("ticker");
    if (!wrap || !tape) return;
    var setW = tape.scrollWidth / 2;
    if (!setW) return;
    tape.style.animation = "none";                 // take over from CSS
    var x = 0, vel = 0, autoSpeed = -0.55;
    var dragging = false, hovering = false, lastX = 0, moved = 0;
    function wrapX() { while (x <= -setW) x += setW; while (x > 0) x -= setW; }
    (function frame() {
      if (!dragging) {
        if (Math.abs(vel) > 0.05) { x += vel; vel *= 0.95; }
        else if (!hovering) { x += autoSpeed; }
      }
      wrapX();
      tape.style.transform = "translateX(" + x.toFixed(2) + "px)";
      requestAnimationFrame(frame);
    })();
    wrap.addEventListener("pointerenter", function () { hovering = true; });
    wrap.addEventListener("pointerleave", function () { hovering = false; dragging = false; });
    wrap.addEventListener("pointerdown", function (e) {
      dragging = true; lastX = e.clientX; moved = 0; vel = 0;
      if (wrap.setPointerCapture) { try { wrap.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    wrap.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      x += dx; vel = dx; moved += Math.abs(dx);
    });
    wrap.addEventListener("pointerup", function () { dragging = false; });
    wrap.addEventListener("pointercancel", function () { dragging = false; });
    // a real drag shouldn't also fire a jump-to-section click
    tape.addEventListener("click", function (e) {
      if (moved > 6) { e.stopPropagation(); e.preventDefault(); moved = 0; }
    }, true);
    function remeasure() { var nw = tape.scrollWidth / 2; if (nw) setW = nw; }
    window.addEventListener("resize", remeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  }

  /* Engraved section rules ink in left-to-right as each header scrolls into
     view. Rules are visible by default (no-JS safe); JS only adds the wipe. */
  function setupSectionRules() {
    if (reducedMotion || !("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("inked"); obs.unobserve(en.target); }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll(".section-head").forEach(function (h) {
      h.classList.add("pre-ink");
      obs.observe(h);
    });
  }

  /* Scroll-velocity shimmer — a --scroll-vel custom property (0..1) that the
     vignette lightens with, so the "room" brightens subtly while you move and
     settles when you stop. */
  function setupScrollShimmer() {
    if (reducedMotion) return;
    var lastY = window.scrollY, vel = 0, raf = null, root = document.documentElement;
    function loop() {
      vel *= 0.9;
      root.style.setProperty("--scroll-vel", Math.min(1, Math.abs(vel) / 42).toFixed(3));
      if (Math.abs(vel) > 0.3) raf = requestAnimationFrame(loop);
      else { raf = null; root.style.setProperty("--scroll-vel", "0"); }
    }
    window.addEventListener("scroll", function () {
      var y = window.scrollY; vel = y - lastY; lastY = y;
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* Display-case backdrop: one full-bleed layer behind everything that
     crossfades to a section's photograph as that section reaches the middle
     of the viewport — like walking a gallery. Light theme only. Each photo
     is loaded first and only used if it exists, so missing files leave the
     clean beige untouched (nothing to break). */
  function setupStage() {
    if (!document.documentElement.classList.contains("theme-light")) return;
    if (!("IntersectionObserver" in window)) return;
    var overlay = "linear-gradient(rgba(227,221,206,0.86), rgba(227,221,206,0.9)), ";
    var map = {
      leadership:  "assets/images/bg-hall.jpg",
      models:      "assets/images/bg-district.jpg",
      credentials: "assets/images/bg-ledger.jpg",
      contact:     "assets/images/bg-wallst.jpg"
    };
    var available = {};
    Object.keys(map).forEach(function (k) {
      var img = new Image();
      img.onload = function () { available[k] = map[k]; };
      img.src = map[k];
    });
    var a = el("div", "stage-layer"), b = el("div", "stage-layer");
    a.setAttribute("aria-hidden", "true"); b.setAttribute("aria-hidden", "true");
    document.body.insertBefore(b, document.body.firstChild);
    document.body.insertBefore(a, document.body.firstChild);
    var layers = [a, b], active = 0, currentSrc = "__init";
    function show(src) {
      if (src === currentSrc) return;
      currentSrc = src;
      if (src) {
        var incoming = layers[1 - active];
        incoming.style.backgroundImage = overlay + "url('" + src + "')";
        incoming.style.opacity = "1";
        layers[active].style.opacity = "0";
        active = 1 - active;
      } else {
        layers[0].style.opacity = "0";
        layers[1].style.opacity = "0";
      }
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) show(available[en.target.id] || null);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    document.querySelectorAll("main .section").forEach(function (s) { obs.observe(s); });
  }

  /* Sticky-scroll "Approach" walkthrough: as each step block reaches the
     middle of the viewport it becomes active, the pinned panel updates its
     big number/word, and the progress rail fills. No-JS + reduced-motion
     safe (all steps just read as a plain list). */
  function setupApproach() {
    var wrap = document.querySelector(".approach-wrap");
    if (!wrap) return;
    var steps = wrap.querySelectorAll(".approach-step");
    var ticks = wrap.querySelectorAll(".approach-tick");
    var numEl = byId("approach-num"), wordEl = byId("approach-word");
    var words = ["SCREEN", "MODEL", "VALUE", "PUBLISH"];
    function setActive(i) {
      steps.forEach(function (s, idx) { s.classList.toggle("active", idx === i); });
      ticks.forEach(function (t, idx) { t.classList.toggle("on", idx <= i); });
      if (numEl) numEl.textContent = "0" + (i + 1);
      if (wordEl) wordEl.textContent = words[i] || "";
    }
    if (reducedMotion || !("IntersectionObserver" in window)) { setActive(0); return; }
    wrap.classList.add("scrollytelling");
    setActive(0);
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) setActive(parseInt(en.target.getAttribute("data-step"), 10) || 0);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    steps.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- boot -------------------------------------------------------- */

  runBoot();
  renderMeta();
  startSceneEngine();
  renderHero();
  renderStats();
  renderMarketClock();
  renderTicker();
  startTickerPulse();
  setupModal();
  renderEducation();
  renderLeadership();
  renderExperience();
  renderTools();
  renderDeskStrip();
  renderFilters();
  setupLibraryFilters();
  renderModels();
  renderPipeline();
  renderCredentials();
  renderSkills();
  renderContact();
  renderFooter();
  setupReveals();        // after all cards exist
  setupCardSpotlight();  // after all cards exist
  setupChartResize();    // keep sparklines crisp when the window resizes
  setupMagnetic();       // magnetic hero / contact links
  setupHeroParallax();   // hero photo depth parallax
  setupTickerDrive();    // grab-and-fling ticker
  setupSectionRules();   // engraved rules ink in
  setupScrollShimmer();  // scroll-velocity vignette shimmer
  setupStage();          // crossfading photographic backdrop per section
  setupApproach();       // sticky-scroll research-process walkthrough

})();
