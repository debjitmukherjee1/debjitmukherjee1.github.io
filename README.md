# Debjit's Portfolio Website — Maintenance Guide

This is a plain HTML/CSS/JavaScript website — three pages, no build step, no
framework, no backend. Open `index.html` in a browser and it works. It's
written so that a non-developer (or an AI assistant in a fresh conversation)
can update it safely.

## The three pages

- **`index.html` — Overview.** The classy front door: who I am, education,
  leadership, experience, credentials, skills, contact — plus a compact
  preview of a few featured research reports.
- **`research.html` — Research.** How the work gets made (Approach), then
  the full report library: desk strip, market/sector/rating filters,
  search, and the pipeline of what's coming next.
- **`tools.html` — Tools.** The interactive web apps (Meridian, MarketPulse,
  etc.) — each card opens a detail view explaining how it works before you
  launch it.

All three read from the same `js/data.js`, are styled by the same
`css/styles.css`, and are driven by the same `js/app.js` (every renderer in
that file simply no-ops on a page that doesn't have the section it targets).

## The one rule

**All content lives in `js/data.js`. For routine updates, edit only that file.**
Never touch `index.html`, `research.html`, `tools.html`, `css/styles.css`, or
`js/app.js` unless you're deliberately changing the design or behaviour.

## Folder structure

```
portfolio/
├── index.html         ← Overview page structure (don't edit for content)
├── research.html      ← Research page structure (don't edit for content)
├── tools.html          ← Tools page structure (don't edit for content)
├── favicon.svg         ← browser-tab icon
├── css/
│   └── styles.css     ← all styling, all three pages (don't edit for content)
├── js/
│   ├── data.js        ← ★ ALL CONTENT — the only file you edit
│   └── app.js         ← behaviour/rendering, all three pages (don't edit for content)
└── assets/
    ├── images/         ← photos (compressed JPG/PNG go here)
    └── files/          ← resume PDF, model PDFs/Excel files
```

## Common edits (all in `js/data.js`)

**Add a financial model:** find the `models:` list. Copy one existing
`{ ... },` block, paste it into the list, and edit the values. Put the actual
PDF/Excel file in `assets/files/` and set `fileUrl` to match, e.g.
`"assets/files/infosys-dcf.pdf"`. New sectors automatically get a filter button
on `research.html`. Set `market` to `"India"`, `"US"` or `"Macro"` — it drives
the library's market filter and the auto-computed desk strip (coverage /
ratings / macro counts). Leave `sector: "Macro"` studies out of the coverage
count by using `market: "Macro"`. Set `featured: true` to show it in the
compact preview on `index.html` (Overview) — keep this to a handful; the full
list always lives on `research.html` regardless.

**Add a tool:** find the `tools:` list on `tools.html`. Copy one existing
block, paste it in, and edit the values. `status: "live"` needs a real `url`
and renders as a card that opens a "how it works" detail view (summary +
`features` bullet list + a Launch link); `status: "building"` should leave
`url: ""` and renders as a dashed "IN DEVELOPMENT" card with no link. Leaving
`tools:` out entirely (or emptying the list) hides the whole section.

**Add an upcoming name to the pipeline:** find the `pipeline:` list. Copy one
existing block, paste it in, and edit `label`, `title`, `summary` and `tag`
(a short mono status like `"IN BUILD"`, `"QUEUED"` or `"SCHEDULED"`). These
render as ghost cards under the research library. Emptying the list hides
that row.

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

**Change the ticker items:** edit the `ticker:` list (shown on all three
pages). `direction` must be `"up"`, `"down"` or `"flat"`; `sectionId` (where
clicking jumps to) must be one of: `education`, `leadership`, `experience`,
`models`, `credentials`, `skills`, `contact`. Set `page` to whichever file
that section actually lives on — `"index.html"` or `"research.html"` —
clicking navigates there first if you're not already on it, then scrolls.

**Change the browser-tab title / share description:** edit the `meta:` section.

## Editing tips

- Keep the double quotes around every value. If your text contains a double
  quote, write it as `\"`.
- Every entry in a list ends with a comma except optionally the last one.
- After editing, open `index.html`, `research.html` and `tools.html` in a
  browser. If a page comes up blank or a section is empty, you most likely
  deleted a comma, quote, or brace — check your last edit (a broken
  `data.js` breaks all three pages the same way, since they share it).
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
