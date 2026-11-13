/* ============================================================================
   about.js — the Profile page (about.html): a digital CV.
   ----------------------------------------------------------------------------
   Everything here is read from js/data.js: hero (name, bio, links, stats,
   personalLine), experience, leadership, education, credentials and skills.
   To change the CV, edit those lists; this file never needs touching.
   Photos attached to a role appear as small thumbnails; clicking a role opens
   the detail sheet with the full pictures.
   ========================================================================== */
(function () {
  "use strict";
  var DM = window.DM; if (!DM) return;
  var D = DM.D, h = D.hero || {}, esc = DM.esc;
  function $(s) { return document.querySelector(s); }
  function list(items) { return items && items.length ? "<ul>" + items.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : ""; }

  /* ---------- the fixed column: who, where to reach, the PDF ------------- */
  var side = $("#cv-side");
  if (side) {
    var now = (D.experience || [])[0], study = (D.education || [])[0];
    var status = (D.ticker || []).filter(function (t) { return t.label === "STATUS"; })[0];
    var facts = (h.personalLine || "").split(" · ").map(function (x) { var p = x.split(": "); return p.length > 1 ? "<div><dt>" + esc(p[0]) + "</dt><dd>" + esc(p.slice(1).join(": ")) + "</dd></div>" : ""; }).join("");
    side.innerHTML =
      (status ? '<span class="pill live r-accumulate">' + esc(status.value) + "</span>" : "") +
      '<h1 class="cv-name">' + esc(h.name) + "</h1>" +
      '<p class="cv-title">' + esc(now ? now.role + ", " + now.company : "") + (study ? "<br>" + esc(study.degree) + ", " + esc(study.institution) : "") + "</p>" +
      '<div class="cv-actions"><a class="btn btn-solid" href="' + esc(h.resumeUrl) + '" target="_blank" rel="noopener">Download the CV (PDF) ↓</a></div>' +
      '<div class="cv-links"><a href="mailto:' + esc(h.email) + '">' + esc(h.email) + "<span>Email</span></a>" +
      '<a href="' + esc(h.linkedinUrl) + '" target="_blank" rel="noopener">LinkedIn<span>↗</span></a>' +
      '<a href="research">Research library<span>' + DM.MODELS.length + " notes</span></a>" +
      '<a href="https://debjitmukherjee1.github.io/ledger/" target="_blank" rel="noopener">Track record<span>Ledger ↗</span></a>' +
      '<a href="access">Indian notes (private)<span>Request</span></a></div>' +
      '<dl class="cv-facts">' + (h.stats || []).map(function (s) { return "<div><dt>" + esc(s.label) + "</dt><dd>" + s.value + esc(s.suffix || "") + "</dd></div>"; }).join("") + facts + "</dl>";
  }

  /* ---------- the scrolling column --------------------------------------- */
  var p = $("#cv-profile"); if (p) p.textContent = h.bio || "";

  var exp = $("#cv-exp");
  if (exp) exp.innerHTML = (D.experience || []).map(function (x) {
    return '<article class="cv-item" data-r><p class="cv-when mono">' + esc(x.dates) + (x.location ? "<br>" + esc(x.location) : "") + "</p><div><h3>" + esc(x.company) + '</h3><p class="cv-role">' + esc(x.role) + '</p><p class="cv-sum">' + esc(x.summary) + "</p>" + list(x.bullets) +
      (x.link ? '<a class="cv-link" href="' + esc(x.link) + '" target="_blank" rel="noopener">' + esc(x.linkLabel || "Open ↗") + "</a>" : "") + "</div></article>";
  }).join("");

  var lead = $("#cv-lead");
  if (lead) {
    lead.innerHTML = (D.leadership || []).map(function (l, i) {
      var pics = (l.photos || []).map(function (ph) { return '<img src="' + esc(ph.src) + '" alt="' + esc(ph.caption) + '" loading="lazy" onerror="this.remove()">'; }).join("");
      return '<article class="cv-item" data-r><p class="cv-when mono">' + esc(l.years) + "</p><div><h3>" + esc(l.role) + '</h3><p class="cv-role">' + esc(l.organization) + '</p><p class="cv-sum">' + esc(l.summary) + "</p>" + list(l.bullets) +
        (pics ? '<button class="cv-ph" type="button" data-l="' + i + '" aria-label="View photographs: ' + esc(l.role) + '">' + pics + "<span>View photographs</span></button>" : "") + "</div></article>";
    }).join("");
    lead.addEventListener("click", function (e) { var b = e.target.closest("[data-l]"); if (!b) return; var l = D.leadership[+b.getAttribute("data-l")]; DM.openGeneric("Leadership", l.years, l.role, l.organization, l.summary, null, l.photos); });
  }

  var edu = $("#cv-edu");
  if (edu) edu.innerHTML = (D.education || []).map(function (x) {
    return '<article class="cv-item" data-r><p class="cv-when mono">' + esc(x.years) + "</p><div><h3>" + esc(x.institution) + '</h3><p class="cv-role">' + esc(x.degree) + '</p><p class="cv-sum">' + esc(x.detail) + "</p>" + list(x.bullets) + "</div></article>";
  }).join("");

  var cred = $("#cv-cred");
  if (cred) cred.innerHTML = (D.credentials || []).map(function (x) {
    return '<article class="cv-item" data-r><p class="cv-when mono">' + esc(x.status) + "</p><div><h3>" + esc(x.name) + '</h3><p class="cv-role">' + esc(x.issuer) + '</p><p class="cv-sum">' + esc(x.detail) + "</p>" +
      (x.progress != null && x.progress < 100 ? '<div class="cv-bar" role="img" aria-label="' + x.progress + ' percent complete"><i style="width:' + x.progress + '%"></i></div>' : "") + "</div></article>";
  }).join("");

  var sk = $("#cv-skills");
  if (sk && D.skills) sk.innerHTML = '<div><h3 class="mono mute">Technical</h3><div class="chips">' + (D.skills.technical || []).map(function (s) { return '<span class="chip">' + esc(s) + "</span>"; }).join("") + "</div></div>";

  if (DM.reveal) DM.reveal(document);
  if (location.hash && document.querySelector(location.hash)) setTimeout(function () { document.querySelector(location.hash).scrollIntoView(); }, 400);
})();
