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
    // Backdrop photo behind the masthead — rendered as its own layer div so
    // it can slowly zoom (Ken Burns) without moving the text. Only applied
    // if the image file actually loads; always under a heavy navy overlay.
    if (siteData.hero.backdropImage) {
      var bgTest = new Image();
      bgTest.onload = function () {
        var mast = document.querySelector(".masthead");
        var layer = el("div", "masthead-bg");
        layer.setAttribute("aria-hidden", "true");
        layer.style.backgroundImage =
          "linear-gradient(rgba(10,14,24,0.78), rgba(10,14,24,0.92) 60%, #0a0e18 96%), " +
          "url('" + siteData.hero.backdropImage + "')";
        mast.insertBefore(layer, mast.firstChild);
      };
      bgTest.src = siteData.hero.backdropImage;
    }

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
      if (!reducedMotion) countUp(num, s.value, s.suffix);
    });
  }

  function countUp(node, target, suffix) {
    var duration = 1400;                       // ms
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);      // ease-out cubic
      node.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
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
        if (tc) drawTerminalChart(tc);
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

  /* ---------- 5. models gallery + sector filter --------------------------- */

  var activeSector = "All";

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

  function drawSpark(c) {
    var env = setupCanvas(c, 52);
    if (!env) return;
    var ctx = env.ctx, w = env.w, h = env.h;
    var data = chartSeries(c.getAttribute("data-seed") || "x", 44, parseFloat(c.getAttribute("data-trend")) || 0);
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var X = function (i) { return (i / (data.length - 1)) * w; };
    var Y = function (v) { return h - 4 - ((v - min) / (max - min || 1)) * (h - 8); };
    var up = data[data.length - 1] >= data[0];
    var col = up ? CHART_UP : CHART_DN, colA = up ? CHART_UP_A : CHART_DN_A;
    // faint area fill
    ctx.beginPath();
    ctx.moveTo(X(0), Y(data[0]));
    for (var i = 1; i < data.length; i++) ctx.lineTo(X(i), Y(data[i]));
    ctx.lineTo(X(data.length - 1), h); ctx.lineTo(X(0), h); ctx.closePath();
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(" + colA + ",0.14)");
    g.addColorStop(1, "rgba(" + colA + ",0)");
    ctx.fillStyle = g; ctx.fill();
    // line
    ctx.beginPath();
    ctx.moveTo(X(0), Y(data[0]));
    for (var j = 1; j < data.length; j++) ctx.lineTo(X(j), Y(data[j]));
    ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
  }

  function drawTerminalChart(c) {
    var env = setupCanvas(c, 220);
    if (!env) return;
    var ctx = env.ctx, w = env.w, h = env.h;
    var data = chartSeries((c.getAttribute("data-seed") || "x") + "-D", 46, parseFloat(c.getAttribute("data-trend")) || 0);
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    var padL = 6, padR = 6, padT = 12, padB = 16;
    var X = function (i) { return padL + (i / (data.length - 1)) * (w - padL - padR); };
    var Y = function (v) { return h - padB - ((v - min) / (max - min || 1)) * (h - padT - padB); };
    // horizontal grid lines
    ctx.strokeStyle = "rgba(174,185,201,0.08)"; ctx.lineWidth = 1;
    for (var gy = 0; gy <= 3; gy++) {
      var yy = padT + (gy / 3) * (h - padT - padB);
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(w - padR, yy); ctx.stroke();
    }
    var up = data[data.length - 1] >= data[0];
    var col = up ? CHART_UP : CHART_DN, colA = up ? CHART_UP_A : CHART_DN_A;
    // area
    ctx.beginPath(); ctx.moveTo(X(0), Y(data[0]));
    for (var i = 1; i < data.length; i++) ctx.lineTo(X(i), Y(data[i]));
    ctx.lineTo(X(data.length - 1), h - padB); ctx.lineTo(X(0), h - padB); ctx.closePath();
    var g = ctx.createLinearGradient(0, padT, 0, h - padB);
    g.addColorStop(0, "rgba(" + colA + ",0.18)");
    g.addColorStop(1, "rgba(" + colA + ",0)");
    ctx.fillStyle = g; ctx.fill();
    // line + last dot
    ctx.beginPath(); ctx.moveTo(X(0), Y(data[0]));
    for (var j = 1; j < data.length; j++) ctx.lineTo(X(j), Y(data[j]));
    ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.stroke();
    ctx.beginPath(); ctx.arc(X(data.length - 1), Y(data[data.length - 1]), 2.5, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
  }

  function drawAllSparks() {
    var grid = byId("models-grid");
    if (!grid) return;
    grid.querySelectorAll("canvas.spark").forEach(function (c) {
      if (c.getAttribute("data-drawn") === "1") return;
      drawSpark(c);
      c.setAttribute("data-drawn", "1");
    });
  }

  // Redraw charts on resize (canvas is pixel-based, so it must be re-rendered)
  function setupChartResize() {
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var grid = byId("models-grid");
        if (grid) grid.querySelectorAll("canvas.spark").forEach(function (c) { c.removeAttribute("data-drawn"); });
        drawAllSparks();
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
        body.appendChild(el("p", "modal-detail", item.detail));
        if (item.rating || item.targetPrice || item.impliedValue) {
          var ro2 = el("div", "model-readout");
          if (item.rating)      { ro2.appendChild(el("span", "ro-label", "RATING"));  ro2.appendChild(el("span", ratingClass(item.rating), item.rating)); }
          if (item.targetPrice) { ro2.appendChild(el("span", "ro-label", "TP"));      ro2.appendChild(el("span", "ro-val", item.targetPrice)); }
          if (item.impliedValue){ ro2.appendChild(el("span", "ro-label", "IMPLIED")); ro2.appendChild(el("span", "ro-val", item.impliedValue)); }
          body.appendChild(ro2);
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
      if (activeSector === "All" || item.sector === activeSector) {
        grid.appendChild(renderModelCard(item));
      }
    });
    // draw the sparklines once the new cards have layout
    requestAnimationFrame(drawAllSparks);
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

  /* Animated terminal wallpaper behind the masthead: a faint grid plus three
     slow-drifting seeded "market lines". Restores the hero canvas the site
     carried before. Under reduced motion it draws a single static frame. */
  function drawHeroFrame(c, t) {
    // Size from the PARENT (masthead), never from the canvas's own box —
    // measuring itself and then resizing itself feeds back and runs away.
    var mast = c.parentNode;
    if (!mast) return;
    var w = mast.clientWidth, h = mast.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (c.width !== pw || c.height !== ph) {
      c.width = pw; c.height = ph;
      c.style.width = w + "px"; c.style.height = h + "px";
    }
    var ctx = c.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);   // fresh scale each frame
    ctx.clearRect(0, 0, w, h);
    // faint grid
    ctx.strokeStyle = "rgba(174,185,201,0.05)";
    ctx.lineWidth = 1;
    var gs = 56, x, y;
    for (x = 0; x < w; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (y = 0; y < h; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    // drifting market lines
    var lines = [
      { seed: "hero-a", color: "rgba(174,185,201,0.30)", amp: 60, speed: 0.00016, trend: 0.9 },
      { seed: "hero-b", color: "rgba(233,235,239,0.16)", amp: 44, speed: 0.00011, trend: 0.5 },
      { seed: "hero-c", color: "rgba(150,158,171,0.12)", amp: 70, speed: 0.00007, trend: 0.2 }
    ];
    lines.forEach(function (L) {
      var r = chartRng(L.seed);
      var phase = t * L.speed;
      var n = 90, i, xx, base, wob, yy;
      ctx.beginPath();
      for (i = 0; i <= n; i++) {
        xx = (i / n) * w;
        base = h * 0.62 - (i / n) * L.trend * h * 0.22;
        wob = Math.sin(i * 0.55 + phase * 6 + r() * 4) * L.amp * 0.35 +
              Math.sin(i * 0.13 + phase * 2.4) * L.amp * 0.65;
        yy = base + wob;
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.strokeStyle = L.color;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    });
  }

  function startHeroCanvas() {
    var mast = document.querySelector(".masthead");
    if (!mast) return;
    var c = el("canvas", "masthead-canvas");
    c.setAttribute("aria-hidden", "true");
    mast.insertBefore(c, mast.firstChild);   // behind text, above skyline
    if (reducedMotion) { drawHeroFrame(c, 0); return; }
    function loop(ts) { drawHeroFrame(c, ts); requestAnimationFrame(loop); }
    requestAnimationFrame(loop);
  }

  /* Cursor-follow light on cards. Delegation means it also covers cards
     rebuilt by the sector filter. Skipped on touch / reduced motion. */
  function setupCardSpotlight() {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    document.addEventListener("pointermove", function (e) {
      var card = e.target && e.target.closest ? e.target.closest(".card") : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
    }, { passive: true });
  }

  /* ---------- boot -------------------------------------------------------- */

  runBoot();
  renderMeta();
  renderHero();
  startHeroCanvas();
  renderStats();
  renderMarketClock();
  renderTicker();
  startTickerPulse();
  setupModal();
  renderEducation();
  renderLeadership();
  renderExperience();
  renderFilters();
  renderModels();
  renderCredentials();
  renderSkills();
  renderContact();
  renderFooter();
  setupReveals();        // after all cards exist
  setupCardSpotlight();  // after all cards exist
  setupChartResize();    // keep sparklines crisp when the window resizes

})();
