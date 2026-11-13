/* ============================================================================
   access.js — the research access page (access.html).
   ----------------------------------------------------------------------------
   Recruiters ask for the private Indian notes here. The form shows the facts
   and the terms (all text in `access:` in js/data.js), checks the answers, and
   sends them to the Google Form "Research access requests (website)" in the
   site owner's Google account. Google emails the owner on every request; the
   owner then shares the private Drive folder with the email given. Nothing is
   shared automatically.
   ========================================================================== */
(function () {
  "use strict";
  var DM = window.DM; if (!DM) return;
  var A = DM.D.access || {}, esc = DM.esc, h = DM.D.hero || {};
  function $(s) { return document.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* ---------- the facts and the terms ----------------------------------- */
  var facts = (A.facts || []).filter(function (f) { return !f.needsConfirming || f.confirmed; });
  $("#ax-facts").innerHTML = facts.map(function (f, i) { return "<li><span class=\"mono\">" + ("0" + (i + 1)).slice(-2) + "</span><p>" + esc(f.text) + "</p></li>"; }).join("");
  $("#ax-terms").innerHTML = (A.terms || []).map(function (t, i) { return "<li><span class=\"mono\">" + String.fromCharCode(97 + i) + "</span><p><b>" + esc(t.title) + ".</b> " + esc(t.text) + "</p></li>"; }).join("");
  $("#ax-privacy").textContent = A.privacy || "";
  $("#ax-version").textContent = "Terms version " + (A.termsVersion || "");
  $("#ax-time").textContent = A.responseTime || "";

  /* ---------- which notes ------------------------------------------------ */
  var notes = DM.MODELS.filter(function (m) { return m.note; });
  var want = (new URLSearchParams(location.search).get("note") || "").toUpperCase();
  $("#ax-notes").innerHTML = '<label class="ax-check ax-all"><input type="checkbox" value="All Indian notes" data-all' + (want ? "" : " checked") + '><span>All Indian notes and the track record</span></label>' +
    notes.map(function (m) { return '<label class="ax-check"><input type="checkbox" value="' + esc(m.tk) + '"' + (want === m.tk ? " checked" : "") + "><span><b>" + esc(m.tk) + "</b> " + esc(m.name) + "</span></label>"; }).join("");
  $("#ax-notes").addEventListener("change", function (e) {
    var all = $("#ax-notes [data-all]");
    if (e.target === all && all.checked) $$("#ax-notes input:not([data-all])").forEach(function (c) { c.checked = false; });
    else if (e.target !== all && e.target.checked) all.checked = false;
  });

  /* ---------- send ------------------------------------------------------- */
  var form = $("#ax-form"), out = $("#ax-status");
  function fail(msg, el) { out.className = "ax-status err"; out.textContent = msg; if (el) el.focus(); return false; }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.website.value) return;                                  // spam trap: people never see this field
    var v = function (n) { return (form[n].value || "").trim(); };
    if (!v("name")) return fail("Please give your name.", form.name);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))) return fail("Please give a valid work email.", form.email);
    if (/@(gmail|yahoo|outlook|hotmail|icloud|proton(mail)?|live|aol)\./i.test(v("email")) && !v("linkedin"))
      return fail("For a personal email address, please add your LinkedIn profile so I can confirm who you are.", form.linkedin);
    if (!v("firm")) return fail("Please give your firm.", form.firm);
    if (!v("role")) return fail("Please give your role.", form.role);
    var picked = $$("#ax-notes input:checked").map(function (c) { return c.value; });
    if (!picked.length) return fail("Please choose at least one note.", $("#ax-notes input"));
    if (!form.agree.checked || !form.capacity.checked || !form.privacyok.checked) return fail("Please confirm all three statements to continue.", form.agree);

    var F = A.fields || {}, body = new URLSearchParams();
    body.append(F.name, v("name")); body.append(F.email, v("email")); body.append(F.firm, v("firm")); body.append(F.role, v("role"));
    body.append(F.linkedin, v("linkedin") || "—"); body.append(F.notes, picked.join(", ")); body.append(F.message, v("message") || "—");
    body.append(F.terms, "Agreed to terms " + A.termsVersion + ", professional capacity and privacy notice · " + new Date().toISOString());
    body.append(F.source, location.href);
    var btn = form.querySelector("button[type=submit]"); btn.disabled = true; btn.textContent = "Sending…";
    // Google Forms does not allow reading its reply from another site, so a sent request cannot be confirmed here;
    // a network failure still shows up as an error.
    fetch(A.formAction, { method: "POST", mode: "no-cors", body: body }).then(function () {
      form.hidden = true;
      $("#ax-done").hidden = false;
      $("#ax-done-email").textContent = v("email");
      if (typeof window.gtag === "function") window.gtag("event", "research_access_request", { notes: picked.length });
    }).catch(function () {
      btn.disabled = false; btn.textContent = "Send request";
      fail("That did not send (network error). Please try again, or email " + h.email + ".");
    });
  });
  if (DM.reveal) DM.reveal(document);
})();
