# Debjit's Portfolio Website — Maintenance Guide

This is a plain HTML/CSS/JavaScript website. No build step, no framework, no
backend. Open `index.html` in a browser and it works. It's written so that a
non-developer (or an AI assistant in a fresh conversation) can update it safely.

## The one rule

**All content lives in `js/data.js`. For routine updates, edit only that file.**
Never touch the HTML pages, `css/site.css`, `js/site.js` or `js/lab.js` unless
you're deliberately changing the design or behaviour.

The site is six pages: `index.html` (Overview), `research.html`, `deals.html`,
`tools.html`, `lab.html` (the Workbench: six in-browser calculators) and
`about.html` (Profile: a digital CV drawn from `hero`, `experience`,
`leadership`, `education`, `credentials` and `skills` by `js/about.js`). Each
page holds only its section shells; `js/site.js` fills them from `js/data.js`
and adds the shared nav, search palette (Ctrl/Cmd-K), detail drawer, contact
block and footer. Motion uses GSAP, ScrollTrigger and Lenis, and the 3D scene
uses three.js; all four are free and served from `js/vendor/` on this site, not a
CDN. If the 3D scene can't load, every page still shows all of its content.

## Folder structure

```
portfolio/
├── index.html, research.html, deals.html, tools.html, lab.html, about.html
│                       ← page shells (don't edit for content)
├── favicon.svg         ← browser-tab icon
├── css/
│   ├── site.css        ← shared styling; colours are the tokens at the top
│   └── home.css        ← the Overview page only
├── js/
│   ├── data.js         ← ★ ALL CONTENT — the only file you edit
│   ├── site.js         ← rendering + behaviour for every page
│   ├── stage.js        ← the 3D landscape of every call (shared by all pages)
│   ├── home.js         ← the Overview: scroll chapters that drive the landscape
│   ├── ambient.js      ← inner pages: the landscape drifting behind the content
│   └── lab.js          ← the Workbench calculators (maths lives here)
├── data/               ← deal-tracker.json, refreshed by a GitHub Action
└── assets/
    ├── images/         ← photos (compressed JPG/PNG go here)
    └── files/          ← resume PDF, report PDFs, Excel models
```

**Live data.** The hero chart, the track-record figures and the price charts
read Ledger (`/ledger/data/calls.json`); the deal tracker reads
`data/deal-tracker.json`. If either is unavailable those parts hide themselves.

**The Overview's opening lines** are `hero.headline` (one entry per line) in
`data.js`.
The colour the page takes for each rating is the `WORLDS` table at the top of
`js/stage.js`; each inner page picks its colour with `data-world` on `<body>`. Tool screenshots live in `assets/images/tools/<name>.jpg`
(lower-case tool name); retake one whenever a tool's look changes.

**Indian notes:** the public site shows Indian listed companies as valuation notes
with no rating, target or files (`access: "private"` in `data.js`). The full notes,
their targets, PDFs and models, and the Indian track record live outside this
repository in `../PRIVATE/` (a recruiter pack to share privately, plus
`india-notes.json`). Each note becomes public 12 months after its call
(`revealAfter`). That happens automatically: the GitHub Action
`.github/workflows/india-reveal.yml` runs every morning, opens the encrypted copy of
`../PRIVATE` in `private/india-vault.tar.gz.enc` with the repository secret
`INDIA_VAULT_KEY`, runs `scripts/reveal_matured.py` and commits the note as a
"Matured call" with its PDF and model. After adding or changing an Indian note in
`../PRIVATE`, run `sh scripts/seal_private.sh` and commit the vault.
`python3 scripts/build_india_pack.py` refreshes the private recruiter pack (PDF).

**Recruiter access page (`access.html`):** recruiters read the facts and terms and
request the Indian notes. Each request goes to the Google Form "Research access
requests (website)" in your Google account, which emails you; you then share the
Drive folder "India Research Pack (private)" with the email given. The text (facts,
terms, privacy note) is the `access:` section of `data.js`; bump `termsVersion`
whenever the terms change. Facts marked `needsConfirming` stay hidden until you set
`confirmed: true`. The site's live track record shows Indian calls only once they
are a year old. US ratings show the date and price they were set at, and an
"Under review" flag when the price has since moved through the rating.

**Change the colours or fonts:** edit the `:root` tokens at the top of
`css/site.css` (dark theme) and the `:root[data-theme="light"]` block below it.

**Add a Workbench card:** the card text is the `workbench:` list in `data.js`;
the calculator itself is an entry in `TOOLS` in `js/lab.js`.

## Common edits (all in `js/data.js`)

**Add a financial model:** find the `models:` list. Copy one existing
`{ ... },` block, paste it into the list, and edit the values. Put the actual
PDF/Excel file in `assets/files/` and set `fileUrl` to match, e.g.
`"assets/files/infosys-dcf.pdf"`. New sectors automatically get a filter button.

**Show how a company is valued (multi-method):** each `models:` entry may
carry two optional fields (both safe to omit — leave them out and the card
renders exactly as before):
- `methodologyNote`: one plain sentence on *why* this business is valued the
  way it is (shown in the detail view under a "How it's valued" heading).
- `methods`: a list, primary method first, e.g.
  `{ method: "FCFF discounted cash flow", role: "Primary", detail: "one line" }`.
  Use `role: "Primary"` for the leading method and `role: "Cross-check"` for
  the supporting ones. The Alphabet entry is a worked example.

**Edit the "Valuation Methodology" section:** it is driven by the
`methodology:` object (an `intro` string plus an `approaches:` list, one card
per business archetype — banks, IT services, staples, payments, diversified
tech, hyper-growth). Copy an approach block to add one; delete the whole
`methodology:` object to hide the section entirely.

**Add an internship:** find the `experience:` list. Copy an existing block,
paste it at the top (newest first), edit the values.

**Add a leadership role:** same idea in the `leadership:` list. Exactly one
entry should have `featured: true` — that one is pinned full-width at the top.

**Add a certification:** copy a block in `credentials:`. `progress` is a number
0–100 for the small progress bar, or `null` for no bar.

**Swap/add a photo:** put the compressed image in `assets/images/`, then set
the `src` path in the relevant entry's `photos` list, e.g.
`{ src: "assets/images/club-launch.jpg", caption: "Club launch event" }`.
If an image path is wrong or the file is missing, the site shows a labelled
placeholder frame instead of breaking.

**Update the resume:** put the new PDF in `assets/files/` and update
`hero.resumeUrl` to its path.

**Change name / tagline / bio / email / LinkedIn:** edit the `hero:` section.

**Change the ticker items:** edit the `ticker:` list. `direction` must be
`"up"`, `"down"` or `"flat"`; `sectionId` (where clicking jumps to) must be one
of: `education`, `leadership`, `experience`, `models`, `credentials`, `skills`,
`contact`.

**Change the browser-tab title / share description:** edit the `meta:` section.

## Editing tips

- Keep the double quotes around every value. If your text contains a double
  quote, write it as `\"`.
- Every entry in a list ends with a comma except optionally the last one.
- After editing, open `index.html` in a browser. If the page comes up blank or
  a section is empty, you most likely deleted a comma, quote, or brace — check
  your last edit.
- Compress photos before adding them (aim for under ~300 KB each; any free
  online compressor works). Link model files, don't embed them.

## Putting it online for free (GitHub Pages)

1. Create a free account at github.com.
2. Create a new repository (e.g. `portfolio`), set it to Public.
3. Upload everything inside this `portfolio/` folder (keep the folder
   structure: `css/`, `js/`, `assets/` as-is).
4. In the repository: Settings → Pages → under "Branch" choose `main` and
   `/ (root)`, then Save.
5. After a minute your site is live at `https://<username>.github.io/portfolio/`.
6. To update the site later, edit/upload the changed files in the repository —
   the site refreshes automatically.

Netlify and Vercel also work: drag-and-drop the `portfolio` folder onto
app.netlify.com/drop for an instant free site.
