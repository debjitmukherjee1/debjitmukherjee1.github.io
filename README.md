# Debjit's Portfolio Website — Maintenance Guide

This is a plain HTML/CSS/JavaScript website. No build step, no framework, no
backend. Open `index.html` in a browser and it works. It's written so that a
non-developer (or an AI assistant in a fresh conversation) can update it safely.

## The one rule

**All content lives in `js/data.js`. For routine updates, edit only that file.**
Never touch `index.html`, `css/styles.css`, or `js/app.js` unless you're
deliberately changing the design or behaviour.

## Folder structure

```
portfolio/
├── index.html          ← page structure (don't edit for content)
├── favicon.svg         ← browser-tab icon
├── css/
│   └── styles.css      ← all styling (don't edit for content)
├── js/
│   ├── data.js         ← ★ ALL CONTENT — the only file you edit
│   └── app.js          ← behaviour/rendering (don't edit for content)
└── assets/
    ├── images/         ← photos (compressed JPG/PNG go here)
    └── files/          ← resume PDF, model PDFs/Excel files
```

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
