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
      requestAnimationFrame(function () { backdrop.classList.add("open"); });
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

  function ratingClass(rating) {
    if (rating === "BUY") return "ro-buy";
    if (rating === "SELL") return "ro-sell";
    return "ro-hold";
  }

  function renderModelCard(item) {
    var card = el("button", "card");
    card.type = "button";
    card.appendChild(el("p", "sector-tag", item.sector + (item.date ? "  ·  " + item.date : "")));
    card.appendChild(el("h3", "card-title", item.title));
    card.appendChild(el("p", "card-summary", item.thesis));

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

  /* ---------- boot -------------------------------------------------------- */

  runBoot();
  renderMeta();
  renderHero();
  renderStats();
  renderTicker();
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
  setupReveals();   // must run last, after all cards exist

})();
