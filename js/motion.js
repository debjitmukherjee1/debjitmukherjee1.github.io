/* ============================================================================
   motion.js — GSAP motion layer, loaded by all four pages after app.js.
   ----------------------------------------------------------------------------
   app.js stands its own boot, masthead count-up and IntersectionObserver
   reveals down when it sees GSAP; this file runs them as one choreography:
     1. Boot: the counter runs to 100%, then the panel wipes up like a
        curtain and hands straight into the page intro (first visit only)
     2. Intro: the name (Overview) or page title (Research / Deals / Tools)
        rises letter by letter, the rest follows, the stats count up
     3. Section heads: rules ink in, index and title rise, the index drifts
     4. Cards, credentials, skills, steps: batched rise as they scroll in;
        the featured research cards rise on a scrub, staggered by column
     5. "Screen. Model. Value. Publish." lights word by word, held in place
        on wide screens while it happens
     6. Coverage bar grows when it comes into view; filtered research cards
        fade in; scroll positions are re-measured whenever content changes
   Elements fade with opacity only (never visibility), so keyboard users can
   still tab to anything that hasn't scrolled in yet.
   Reduced motion: app.js already shows everything at rest; this file exits.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  if (!window.gsap || !window.ScrollTrigger) { root.classList.remove("gsap"); return; }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  // Keep animations on real time even when frames drop (the canvas backdrop
  // is heavy on slow phones): content must never stay hidden for longer.
  gsap.ticker.lagSmoothing(0);

  var EASE = "power3.out";
  var wide = window.matchMedia("(min-width: 900px)").matches;
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return gsap.utils.toArray(sel); }

  /* Split a heading into masked letters; screen readers get the label. */
  function splitChars(node) {
    var chars = [];
    var text = node.textContent.trim();
    node.setAttribute("aria-label", text);
    node.textContent = "";
    text.split(/(\s+)/).forEach(function (w) {
      if (!w) return;
      if (/^\s+$/.test(w)) { node.appendChild(document.createTextNode(" ")); return; }
      var wd = document.createElement("span");
      wd.className = "wd";
      wd.setAttribute("aria-hidden", "true");
      w.split("").forEach(function (c) {
        var ch = document.createElement("span");
        ch.className = "ch";
        ch.textContent = c;
        wd.appendChild(ch);
        chars.push(ch);
      });
      node.appendChild(wd);
    });
    return chars;
  }

  /* ---------- 2. intro: masthead (Overview) or page header (other pages) -- */

  function buildIntro() {
    var intro = gsap.timeline({ paused: true, defaults: { ease: EASE } });
    var head = $(".masthead") || $(".page-header");
    if (!head) return intro;

    var title = $("#hero-name") || $(".page-title");
    var parts = gsap.utils.toArray(head.children).filter(function (n) {
      return n !== title && !n.classList.contains("masthead-bg") && !n.classList.contains("masthead-canvas");
    });
    if (title) {
      var chars = splitChars(title);
      gsap.set(title, { opacity: 1 });
      intro.fromTo(chars, { yPercent: 115, rotation: 6 }, { yPercent: 0, rotation: 0, duration: 1, stagger: 0.03 }, 0.05);
    }
    intro.fromTo(parts, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, clearProps: "transform" }, 0.35);

    var kicker = $(".page-kicker");
    if (kicker) intro.fromTo(kicker, { letterSpacing: "0.9em" }, { letterSpacing: "0.32em", duration: 1.2, ease: "expo.out" }, 0.3);

    // Stats count up once their row appears (app.js wrote the final values).
    $$(".stat-value").forEach(function (node, i) {
      var m = node.textContent.match(/^(\d+)(.*)$/);
      if (!m) return;
      var o = { v: 0 }, suffix = m[2];
      node.textContent = "0" + suffix;
      intro.to(o, {
        v: +m[1], duration: 1.4, ease: "power2.out", snap: { v: 1 },
        onUpdate: function () { node.textContent = o.v + suffix; }
      }, 0.75 + i * 0.1);
    });

    // On the way out the name shrinks back into the page.
    if (title && title.id === "hero-name") {
      gsap.fromTo(title, { y: 0, scale: 1, opacity: 1 }, {
        y: -70, scale: 0.9, opacity: 0.35, ease: "none", immediateRender: false,
        scrollTrigger: { trigger: head, start: "top top", end: "bottom top", scrub: 1 }
      });
    }
    return intro;
  }

  /* ---------- 1. boot ------------------------------------------------------ */

  var intro = buildIntro();
  var boot = $("#boot");
  var seen = false;
  try { seen = sessionStorage.getItem("dm-booted") === "1"; } catch (e) { /* private mode */ }

  if (boot && !seen) {
    var pct = $("#boot-pct"), fill = $("#boot-fill"), o = { p: 0 };
    gsap.timeline({
      onComplete: function () {
        boot.remove();
        try { sessionStorage.setItem("dm-booted", "1"); } catch (e) { /* ignore */ }
      }
    })
      .to(o, {
        p: 100, duration: 0.95, ease: "power2.out", snap: { p: 1 },
        onUpdate: function () { pct.textContent = o.p + "%"; fill.style.width = o.p + "%"; }
      })
      .to(".boot-inner", { y: -28, opacity: 0, duration: 0.35, ease: "power2.in" }, "+=0.1")
      .to(boot, { yPercent: -100, duration: 0.75, ease: "power4.inOut" }, "-=0.15")
      .add(function () { intro.play(); }, "-=0.45");
  } else {
    if (boot) boot.remove();
    intro.play();
  }

  /* ---------- 3. section heads -------------------------------------------- */

  $$(".section-head").forEach(function (head) {
    head.classList.add("pre-ink");   // CSS draws the rules on .inked
    var tl = gsap.timeline({
      defaults: { ease: EASE },
      scrollTrigger: { trigger: head, start: "top 85%", once: true, onEnter: function () { head.classList.add("inked"); } }
    });
    var idx = head.querySelector(".section-index"), title = head.querySelector(".section-title");
    if (title) tl.fromTo(title, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, clearProps: "transform" }, 0.08);
    if (idx) {
      tl.fromTo(idx, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.6 }, 0);
      // The index numeral drifts a touch faster than the page.
      gsap.fromTo(idx, { y: 18 }, {
        y: -18, ease: "none",
        scrollTrigger: { trigger: head, start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  });

  /* ---------- 4. batched rises -------------------------------------------- */

  // Their own CSS transitions are paused during the entrance so they don't
  // chase GSAP's frames, then handed back (hover lift etc.) when it ends.
  function batchRise(items, stagger, distance) {
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: distance || 28, transition: "none" });
    ScrollTrigger.batch(items, {
      start: "top 92%", once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.75, ease: EASE, stagger: stagger, overwrite: true, clearProps: "transform,transition" });
      }
    });
  }
  batchRise($$(".section .card").filter(function (c) { return !c.closest(".card-grid-compact"); }), 0.07);
  batchRise($$(".credential-item"), 0.06);
  batchRise($$(".skill-tags li"), 0.025, 14);
  batchRise($$(".approach-step"), 0.1);
  batchRise($$(".section-note, .coverage-tally, .models-preview-cta, .contact-block, .desk-strip, .filter-row2, .filter-bar, .models-count, .pipe-head, .tracker-scroll"), 0.08, 18);

  // Featured research: each card rises with the scroll, later columns travelling further.
  $$(".card-grid-compact").forEach(function (grid) {
    gsap.utils.toArray(grid.children).forEach(function (card, i) {
      gsap.fromTo(card, { "--rise": (60 + i * 45) + "px", opacity: 0.25 }, {
        "--rise": "0px", opacity: 1, ease: "none",
        scrollTrigger: { trigger: grid, start: "top bottom", end: "top 45%", scrub: 0.8 }
      });
    });
  });

  /* ---------- 5. the four verbs ------------------------------------------- */

  var band = $(".reveal-band"), line = $(".reveal-line");
  if (band && line) {
    var words = line.querySelectorAll(".rw");
    var light = function (n) { words.forEach(function (w, i) { w.classList.toggle("lit", i < n); }); };
    var scrub = gsap.fromTo(line, { scale: 0.9 }, { scale: 1.06, ease: "none", paused: true });
    ScrollTrigger.create({
      trigger: wide ? band : line,
      start: wide ? "center center" : "top 85%",
      end: wide ? "+=70%" : "bottom 50%",
      pin: wide,
      onUpdate: function (self) {
        light(Math.round(self.progress * words.length + 0.25));
        scrub.progress(self.progress);
      },
      onLeave: function () { light(words.length); }
    });
  }

  /* ---------- 6. coverage bar, filters, late content ---------------------- */

  var segs = $$(".ct-seg");
  if (segs.length) {
    gsap.set(segs, { transition: "none" });
    gsap.to(segs, {
      width: function (i, s) { return s.getAttribute("data-w"); },
      duration: 1, ease: "power2.out", stagger: 0.14,
      scrollTrigger: { trigger: ".coverage-tally", start: "top 88%", once: true }
    });
  }

  // Research filters rebuild the grid: fade the new set in quickly so the
  // change reads as a change rather than a blink.
  var refresh = gsap.delayedCall(0.2, function () { ScrollTrigger.refresh(); }).pause();
  var grid = $("#models-grid");
  if (grid && "MutationObserver" in window) {
    new MutationObserver(function () {
      var cards = gsap.utils.toArray(grid.children);
      gsap.fromTo(cards, { opacity: 0, y: 12, transition: "none" }, {
        opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.025, overwrite: true, clearProps: "transform,transition"
      });
      refresh.restart(true);
    }).observe(grid, { childList: true });
  }
  // The deal tracker and other late renders change the page height.
  var main = $("main");
  if (main && "MutationObserver" in window) {
    new MutationObserver(function () { refresh.restart(true); }).observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden"] });
  }

  // Web fonts change line lengths; re-measure once they're in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
