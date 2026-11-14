/* ============================================================================
   data.js — THE ONLY FILE YOU (OR A FUTURE AI) NEED TO EDIT FOR CONTENT.
   ----------------------------------------------------------------------------
   Every piece of text, every link, every image path on the site lives here.
   The site is six pages — index.html (Overview), research.html (the full
   report library), deals.html (Deal Decoded), tools.html (the tools grid),
   lab.html (the Workbench calculators) and about.html (Profile, a digital CV) — all reading from this one
   file, styled by css/site.css and rendered by js/site.js. None of those
   ever need to change for routine content updates.

   RULES OF THUMB
   - To ADD an entry (a model, an internship, a credential…): copy an existing
     object in the relevant list, paste it below, and edit the values.
   - To REMOVE an entry: delete its whole { ... } block, including the comma.
   - Image paths are relative to the site root, e.g. "assets/images/photo.jpg".
   - File links (models, resume) point to files in "assets/files/".
   - Keep the quotes. If your text itself contains a double quote, use \" .
   - Each entry in `models:` carries a `market` field ("India" / "US" / "Macro")
     used by the library's market filter and the desk strip, and a `featured`
     flag — set true on the handful you want shown in the compact preview on
     the Overview page (index.html); the full list always lives on
     research.html regardless.
   - `tools:` lists the interactive web apps shown on tools.html — status:
     "live" (needs a url) or "building" (leave url ""); `features` is a short
     bullet list shown in the "how it works" detail view.
   - `workbench:` lists the in-site calculators on lab.html (card text only;
     the maths lives in js/lab.js).
   - `pipeline:` lists upcoming coverage shown as ghost cards under the
     research library on research.html.
   ========================================================================== */

const siteData = {

  /* --------------------------------------------------------------------
     META — browser tab title + description used when the link is shared.
     -------------------------------------------------------------------- */
  meta: {
    siteTitle: "Debjit Mukherjee — Equity Research & Financial Modelling Portfolio",
    description: "Independent equity research and DCF valuation models by Debjit Mukherjee — B.Com (Honours & Research) student at Amity University Kolkata and CFA Program Level I candidate. Coverage across technology, consumer, payments, banking and IT services."
  },

  /* --------------------------------------------------------------------
     HERO — the masthead at the top of the page.
     -------------------------------------------------------------------- */
  hero: {
    name: "Debjit Mukherjee",
    tagline: "Building institutional-grade equity research and valuation models, independently.",
    /* The Overview's opening lines: headline is shown one line per entry
       (the last line is set in white, the others in grey). */
    headline: ["Equity research", "on Indian and US", "large caps."],
    /* The two lines under the name on the Overview: who you are, and what you want.
       Add the intake you are applying for (e.g. "summer 2027") when you know it. */
    status: "Second-year B.Com (Honours & Research), Amity University Kolkata · Class of 2029",
    seeking: "Looking for equity research and investment banking internships · Kolkata, India",
    bio: "B.Com (Honours & Research), Amity University Kolkata · CFA Program Level I candidate. I research, model and publish full equity reports on Indian and US large caps, each with its Excel model.",
    email: "m.debjit2007@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/debjit-mukherjee101/",
    resumeUrl: "assets/files/Debjit_Mukherjee_Resume.pdf",
    /* Portrait photo shown framed above your name. Set to "" to hide. */
    portraitImage: "",
    /* Backdrop photo behind the masthead (heavily darkened by the site
       so text stays readable). Set to "" for a plain background. */
    /* A short human line shown near the footer. Set to "" to hide. */
    personalLine: "Languages: English, Hindi, Bengali · Interests: financial modelling, industry research, football, Tae Kwon Do",
    /* Stats shown under the bio — the numbers count up when the page loads.
       value must be a plain number; suffix is text glued after it ("+", "%", ""). */
    stats: [
      { value: 23, suffix: "",  label: "Companies covered" },
      { value: 12, suffix: "",  label: "US calls on the public record" },
      { value: 11, suffix: "",  label: "Indian notes (private until a year old)" },
      { value: 3,  suffix: "",  label: "Internships" }
    ]
  },

  /* --------------------------------------------------------------------
     TICKER — the scrolling tape under the masthead (the site's signature),
     shown on all three pages. Each item: label, value, direction ("up" |
     "down" | "flat"), sectionId to jump to, and page — the file that
     section actually lives on ("index.html" | "research.html" |
     "tools.html" | "about.html" for the personal sections). Clicking scrolls same-page if you're already on that
     page, otherwise navigates there first. Valid sectionIds: education,
     leadership, experience, models, credentials, skills, contact.
     -------------------------------------------------------------------- */
  ticker: [
    { label: "COVERAGE",   value: "23 COMPANIES",            direction: "up",   sectionId: "models",      page: "research.html" },
    { label: "XOM",        value: "REDUCE · FV $154",        direction: "down", sectionId: "models",      page: "research.html" },
    { label: "ITC",        value: "VALUATION NOTE · NOV 2026",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "LLY",        value: "REDUCE · FV $854",        direction: "down", sectionId: "models",      page: "research.html" },
    { label: "COST",       value: "HOLD · FV $977",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "LT",         value: "VALUATION NOTE · SEP 2026",      direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "SUNPHARMA",  value: "VALUATION NOTE · SEP 2026",      direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "NVDA",       value: "REDUCE · FV $200",        direction: "down", sectionId: "models",      page: "research.html" },
    { label: "MARUTI",     value: "VALUATION NOTE · AUG 2026",     direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "JPM",        value: "REDUCE · FV $323",        direction: "down", sectionId: "models",      page: "research.html" },
    { label: "BAJFINANCE", value: "VALUATION NOTE · AUG 2026",      direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "MSFT",       value: "HOLD · FV $488",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "RELIANCE",   value: "VALUATION NOTE · AUG 2026",        direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "GOOGL",      value: "HOLD · FV $384",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "TCS",        value: "VALUATION NOTE · JUN 2026",         direction: "flat",   sectionId: "models",      page: "research.html" },
    { label: "V",          value: "HOLD · FV $355",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "CFA L1",     value: "CANDIDATE · 2027",        direction: "up",   sectionId: "credentials", page: "about.html" },
    { label: "FINANCE SOCIETY", value: "FOUNDER",        direction: "up",   sectionId: "leadership",  page: "about.html" },
    { label: "B.COM (H&R)", value: "AMITY KOLKATA",          direction: "flat", sectionId: "education",   page: "about.html" },
    { label: "INTERNSHIPS", value: "3 COMPLETED",            direction: "up",   sectionId: "experience",  page: "about.html" },
    { label: "STATUS",     value: "OPEN TO OPPORTUNITIES",   direction: "up",   sectionId: "contact",     page: "index.html" }
  ],

  /* --------------------------------------------------------------------
     EDUCATION — one object per institution/programme.
     -------------------------------------------------------------------- */
  education: [
    {
      institution: "Amity University, Kolkata",
      degree: "Bachelor of Commerce (Honours & Research)",
      years: "2025 – 2029 (expected)",
      focus: "Finance · Accounting · Investment Analysis · Business Research",
      detail: "Second-year undergraduate on the Honours & Research track, combining core commerce coursework with an independent research agenda in equity valuation and sector analysis.",
      bullets: [
        "Focus areas: corporate finance, accounting, investment analysis and business research",
        "Award winner at MAGNAFEST 3.0, organised by Adamas University (April 2026)",
        "Founder of the university's Finance Society"
      ]
    },
    {
      institution: "CFA Institute",
      degree: "CFA Program — Level I Candidate",
      years: "Target exam: 2027",
      focus: "Ethics · FRA · Equity · Fixed Income · Quantitative Methods",
      detail: "Registered Level I candidate, studying alongside the degree. The curriculum's financial reporting & analysis and equity valuation material feeds directly into my independent research work.",
      bullets: [
        "Level I candidate with a 2027 target window",
        "Strongest areas: financial reporting & analysis, equity valuation"
      ]
    },
    {
      institution: "St. James' School, Kolkata",
      degree: "Senior Secondary (Class XII)",
      years: "Completed 2025",
      focus: "Commerce",
      detail: "Completed senior secondary at St. James' School, Kolkata, where I also held leadership roles in the Interact Club, the school MUN, and the annual business event.",
      bullets: [
        "Director of the Interact Club (under Rotary International)",
        "Head of Internal Affairs, JACO Model United Nations",
        "Treasurer, JACO Corp business event"
      ]
    }
  ],

  /* --------------------------------------------------------------------
     LEADERSHIP & ACTIVITIES — set featured: true on exactly one item to
     pin it at the top at full width. photos: list of { src, caption }.
     -------------------------------------------------------------------- */
  leadership: [
    {
      role: "Founder",
      organization: "Finance Society, Amity University Kolkata",
      years: "2026 — present",
      summary: "Founded and lead the university's Finance Society — charter, research agenda and member onboarding built from the ground up. Official launch coming soon.",
      bullets: [
        "Drafted the society's charter and research agenda, and secured institutional backing",
        "Designed the member onboarding pipeline and first-semester programme: model-building workshops, research publications, and speaker sessions",
        "Building a core team ahead of the official campus launch"
      ],
      photos: [],
      featured: true
    },
    {
      role: "Award Winner — Business Fest",
      organization: "MAGNAFEST 3.0, Adamas University",
      years: "April 2026",
      summary: "Team award at Adamas University's annual business fest, competing in business and finance events.",
      bullets: [
        "Awarded at MAGNAFEST 3.0, organised by Adamas University (April 2026)",
        "Competed with a four-member team across business strategy and finance events"
      ],
      photos: [
        { src: "assets/images/magnafest-1.jpg", caption: "Receiving the MAGNAFEST 3.0 award — Adamas University, April 2026" },
        { src: "assets/images/magnafest-2.jpg", caption: "With the winning team, MAGNAFEST 3.0" },
        { src: "assets/images/magnafest-3.jpg", caption: "Trophy lineup at MAGNAFEST 3.0" }
      ],
      featured: false
    },
    {
      role: "Director",
      organization: "Interact Club (under Rotary International), St. James' School",
      years: "2024 – 2025",
      summary: "Led charitable initiatives including the Festival of Lights; contributed to the club's \"Care of Especially Abled\" recognition.",
      bullets: [
        "Led the Festival of Lights charitable initiative end-to-end",
        "Organised outreach visits and donation drives for differently-abled residents",
        "Contributed to the club's \"Care of Especially Abled\" recognition"
      ],
      photos: [
        { src: "assets/images/interact-club-1.jpg", caption: "Interact Club, St. James' School" }
      ],
      featured: false
    },
    {
      role: "Head of Internal Affairs",
      organization: "JACO Model United Nations, St. James' School",
      years: "2024 – 2025",
      summary: "Oversaw logistics, transportation and delegate coordination for a large-scale MUN conference.",
      bullets: [
        "Ran logistics, transportation and delegate coordination for the full conference",
        "Managed scheduling and internal communications across committees"
      ],
      photos: [
        { src: "assets/images/jaco-mun-1.jpg", caption: "JACO Model United Nations, St. James' School" }
      ],
      featured: false
    },
    {
      role: "Treasurer",
      organization: "JACO Corp, annual school business event",
      years: "2023",
      summary: "Managed all event finances end-to-end with full accuracy and transparency.",
      bullets: [
        "Owned the event budget end-to-end — collections, disbursements and reconciliation",
        "Delivered a fully transparent post-event financial account"
      ],
      photos: [],
      featured: false
    }
  ],

  /* --------------------------------------------------------------------
     EXPERIENCE / INTERNSHIPS — one object per role, newest first.
     -------------------------------------------------------------------- */
  experience: [
    {
      company: "Vireo Capital Research",
      role: "Student Equity Research Analyst",
      dates: "Jul 2026 – present",
      location: "Remote",
      summary: "Vireo is a student-run equity research collective. I author reports and valuation models on U.S.-listed companies, which go through its editorial review before publication.",
      bullets: [
        "Author full equity research notes and DCF/comps valuation models on U.S.-listed companies, rebuilt to Vireo's house template and methodology",
        "Reconcile each valuation against an independent model — intrinsic value and blended target within ±2%, rating identical — before editorial submission",
        "Apply Vireo's house approach: a 60/20/20 blend of intrinsic value (DCF, DDM or sum-of-the-parts, by business type), EV/EBITDA and P/E, with any gap between methods explained in the thesis"
      ],
      link: "https://www.vireocapitalresearch.com/research",
      linkLabel: "Read published research at Vireo Capital Research ↗",
      photos: []
    },
    {
      company: "Prasuta Capital (Prasuta Ventures Pvt. Ltd.)",
      role: "Finance Consultant Intern",
      dates: "Summer 2026",
      location: "Kolkata",
      summary: "Research and consulting internship across the firm's public- and private-market verticals.",
      bullets: [
        "Authored a 20-page research report on Prasuta Ventures' business verticals and public- and private-market operations, including its partnership with Motilal Oswal Financial Services",
        "Built financial statement, balance-sheet and cash-flow analyses of the Indian IT sector, presented through an interactive Excel dashboard with dynamic charts and peer comparables",
        "Completed training on financial products (PMS, investment tools) and research frameworks; supported client-outreach and consulting workflows across retail and HNI segments"
      ],
      photos: []
    },
    {
      company: "Alpine Distilleries Pvt. Ltd.",
      role: "Finance & Accounts Intern",
      dates: "Jan – Feb 2026",
      location: "Kolkata",
      summary: "Hands-on accounting internship in the finance & accounts department.",
      bullets: [
        "Maintained ledgers and recorded vouchers in TallyPrime, supporting month-end accuracy and reporting",
        "Used Excel (lookups, pivot tables) to organise, reconcile and analyse operational and accounting data"
      ],
      photos: []
    },
    {
      company: "Younity",
      role: "Business Development Intern",
      dates: "Nov 2025",
      location: "Remote",
      summary: "Client outreach and business development; recognised as a star performer.",
      bullets: [
        "Supported client-outreach and business-development initiatives",
        "Commended by the Founder & CEO for work ethic and initiative (star performer certificate)"
      ],
      photos: []
    }
  ],

  /* --------------------------------------------------------------------
     MODELS & EQUITY RESEARCH — the centerpiece gallery.
     sector: used for the filter buttons (new sectors appear automatically).
     market: "India" | "US" | "Macro" — used by the library's market filter
       and the desk strip's coverage count.
     featured: true shows this entry in the compact preview on the Overview
       page (index.html) — keep it to a handful across sectors/markets.
     rating / targetPrice / impliedValue: shown in the mono data readout —
       leave any of them "" to hide that line. For market "India" the site
       shows neither the rating nor the target: those notes appear as
       dated valuation exercises (SEBI treats ratings and price targets on
       listed securities as research-analyst activity). Indian entries carry
       access: "private" and revealAfter: the full versions live outside this
       repository in PRIVATE/india-notes.json, and scripts/reveal_matured.py
       publishes each one, marked as a matured call, once its date has passed.
     fileUrl / fileLabel:   primary link (research report PDF).
     fileUrl2 / fileLabel2: optional second link (Excel model download).
     -------------------------------------------------------------------- */
  models: [
    {
      title: "ExxonMobil (XOM) — Equity Research Report",
      sector: "Energy",
      market: "US",
      featured: true,
      date: "Nov 2026",
      thesis: "Its best quarter of the year, and the stock still prices about $78 real Brent from 2028: above our $70, XOM's own $65 plan and the futures curve.",
      rating: "REDUCE",
      targetPrice: "$154 (−6.5%)",
      impliedValue: "",
      detail: "3Q26 adjusted EPS $4.23 against $4.04 expected; Energy Products earned $9.1bn on a $50 refining margin. We value on a mid-cycle deck ($84 Brent in 2027, then $70 real; refining margins $16, then $12 real), starting from XOM's plan at XOM's prices plus its own sensitivities, scaled by what 2026 actually delivered. DCF $178, EV/EBITDA on 2028E against Chevron and ConocoPhillips (6.6x, post-3Q) $128 and P/E on 2028E $133, weighted 50/25/25 to $154: with the 2.6% dividend, a −3.9% total return at the $164.47 10-Nov close. The call rests on a beta of 1.0; on my bottom-up beta (0.60) fair value is $183, a BUY, and the note prints both. Bear $134 (Hormuz reopens), bull $183. All eight broker targets after the print were raises (median $188).",
      fileUrl: "assets/files/exxonmobil-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/exxonmobil-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "ITC Ltd (ITC) — Equity Research Report",
      sector: "Consumer Staples",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-11-05",
      featured: true,
      date: "Nov 2026",
      thesis: "Cigarette profit fell 26% and the stock rose 5%: the market is right on the recovery, and the price has already paid for it.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 5 Nov 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Eli Lilly and Company (LLY) — Equity Research Report",
      sector: "Healthcare",
      market: "US",
      featured: true,
      date: "Nov 2026",
      thesis: "Earnings within 1% of the pre-print Street; the price needs Lilly still on ~30x them at the end of 2028.",
      rating: "REDUCE",
      targetPrice: "$854 (−39.7%)",
      impliedValue: "",
      detail: "Q3 2026 revenue rose 39% to $24.4bn and Lilly raised its 2026 guide by $5.5bn, with tirzepatide (Mounjaro and Zepbound) now two-thirds of sales. Our FY2027E EPS of $47.02 sits within 1% of the pre-print consensus, so the disagreement is the multiple: at the $1,417.54 30-Oct close Lilly trades on 30.1x it, against a peer median of 16.4x and a top quartile of 18.6x, and a growth line through the peers gives 21.8x for the ~10% growth we forecast at end-2028 — the price needs 29.7x then. FCFF DCF $777 (WACC 8.68%, 3% terminal growth, business development charged at 5% of revenue), P/E exit $895 and EV/EBITDA exit $987, weighted 50/30/20 to a $854 fair value, −39.2% total return. The DCF reaches the price only at a 6.22% WACC or with ~18 extra points of revenue growth a year to 2030. Bull $1,108, bear $583 — all REDUCE. Thirteen brokers raised targets after the print (median $1,600); the 29-analyst average ($1,398) sits below the price.",
      fileUrl: "assets/files/eli-lilly-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/eli-lilly-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Costco Wholesale (COST) — Equity Research Report",
      sector: "Consumer Staples",
      market: "US",
      featured: true,
      date: "Oct 2026",
      thesis: "Set out to show Costco is too expensive for a 5% Treasury; the numbers made it an earnings call, not a rates call.",
      rating: "HOLD",
      targetPrice: "$977 (−1.2%)",
      impliedValue: "",
      detail: "Costco's earnings yield is 2.08% against a 5.09% 10-year, and in October 2023 it traded at 39.3x — but that window was a market-wide drawdown, and through late-September 2026 the 10-year sat above 5% while Costco held ~44x. Valued against Walmart with today's 13.5% trailing-P/E premium kept in full (the lowest since 2022): forward P/E gives $971 and EV/EBITDA $989, weighted two-thirds/one-third to a $977 fair value, −0.7% total return after the dividend at the $989.11 16-Oct close. The band says REDUCE by 0.7 points; HOLD on one stated reason — with the premium kept the peer methods restate the price, so the call rests on FY2027 EPS, and HOLD needs $22.61, 22 cents above the model's $22.39 (consensus $22.82 gives +0.6%). The DCF ($501) is a floor with no weight: matching the price needs a 6.49% WACC, 1.40 points over the Treasury. Bear: the October 2023 multiple gives $811.",
      fileUrl: "assets/files/costco-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/costco-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Larsen & Toubro (LT) — Equity Research Report",
      sector: "Industrials",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-09-16",
      featured: true,
      date: "Sep 2026",
      thesis: "Strip out the listed subsidiaries and the core contractor costs 36.6x, not 31.7x — for a business whose margin keeps falling.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 16 Sep 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Sun Pharmaceutical Industries (SUNPHARMA) — Equity Research Report",
      sector: "Healthcare",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-09-04",
      featured: true,
      date: "Sep 2026",
      thesis: "A debt-free innovator turning into a levered consolidator — and the market is still paying for the version that's disappearing.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 4 Sep 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "NVIDIA Corporation (NVDA) — Equity Research Report",
      sector: "Technology",
      market: "US",
      featured: true,
      date: "Aug 2026",
      thesis: "The best business in the market — priced for a growth rate faster than the one it just guided to.",
      rating: "REDUCE",
      targetPrice: "$200 (−12.1%)",
      impliedValue: "",
      detail: "Q2 FY2027 (reported 26 Aug) was enormous — revenue $96.2bn (+106%) beat NVIDIA's own guide by 5.7%, Data Center $89.0bn (+117%), Q3 guided to $108bn — and the stock rose 8.74% the next session. Fair value rose from $190 to $200 on the print, but the price ran further, widening the gap rather than closing it. The whole rating is one forecast: management guided ~70% FY2028 revenue growth, our base case has 42%, and the current price already embeds ~56% — all strongly positive, but the price has bought more growth than the base case delivers. This is not a decline call: revenue still roughly doubles, $404bn to $907bn by FY2031. The honest qualification is that a five-year hold then turns on the exit multiple — 14x returns ~5%/yr, 18x ~11%, 20x ~14% — so only the top end clears the 11.4% cost of equity; a twelve-month call that price has outrun, not a bad business to own. Break-even FY2028 growth is 56%: the call survives our 42% and the Street's 44% and fails at management's 70% (where the model gives $251 and ACCUMULATE). 61 analysts rate it Strong Buy at a $320.77 average — we are the outlier.",
      fileUrl: "assets/files/nvidia-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/nvidia-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Alphabet Inc. (GOOGL) — Equity Research Note",
      sector: "Technology",
      market: "US",
      featured: true,
      date: "Aug 2026",
      thesis: "A better business than it was in July, at a price that already pays for it — the capex bill is now the story.",
      rating: "HOLD",
      targetPrice: "$384 (+6%)",
      impliedValue: "",
      detail: "Q2 2026 (reported 22 Jul) revenue of $119.8bn (+24%), with Google Cloud accelerating to +82% at $24.8bn on a $514bn backlog and group operating margin up two points to 34%. But 2026 capex guidance rose to $195–205bn from $180–190bn, free cash flow turned negative (−$5.9bn) for the first time in Alphabet's public life, and headline EPS of $9.11 is $6.26 of unrealised equity marks — recurring EPS was $2.85. On recurring FY26E EPS of ~$11.90 the stock trades at ~30.5x, a premium to the mega-cap median. Fair value $384 (SOTP $430, forward P/E $357, DCF floor $330) is ~6% above $363 — a total return short of the ~10.1% cost of equity. Downgraded from BUY.",
      fileUrl: "assets/files/alphabet-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/alphabet-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Maruti Suzuki India (MARUTI) — Equity Research Report",
      sector: "Automobiles",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-08-18",
      featured: true,
      date: "Aug 2026",
      thesis: "Best operating quarter in years, worst financial one. The margin is cyclical — but it is already paid for.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 18 Aug 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "JPMorgan Chase & Co. (JPM) — Equity Research Report",
      sector: "Financials",
      market: "US",
      featured: true,
      date: "Aug 2026",
      thesis: "The best-run bank in the world, priced for a return it has never sustained.",
      rating: "REDUCE",
      targetPrice: "$323 (−11.0%)",
      impliedValue: "",
      detail: "Q2 FY2026 was extraordinary — net revenue $57.3bn (+28%), net income $21.2bn (+41%), ROTCE 29%, every business at a record. But $4.2bn of after-tax gains (the Visa Class B-2 exchange plus equity marks) contributed $1.56 of the $7.70 EPS; management's own figures are $16.9bn, $6.14 and 23% ROTCE. Recurring EPS grew 3% sequentially, and the growth that remains is concentrated in Equity Markets (+86%) and IB fees (+30%) while NII ex-Markets grew 4%. At $362.84 the stock trades at 3.20x tangible book of $113.35 — which, at a 10.09% cost of equity anchored to the 4.70% US 10-year, implies a sustainable ROTCE of 22.4%. JPMorgan's own through-cycle target is 17%; the FY21–FY25 average was 20.4%. Valued three ways: five-year excess return on tangible book → $325; justified P/TBV of 2.59x on a normalised 19% ROTCE → $309; 13.5x FY27E EPS of $25.01 → $338. Blended 50/30/20 to $323, a total expected return of −9.2% on the $6.60 forward dividend. On peers JPMorgan is not the outlier — Morgan Stanley trades at 4.08x tangible book against JPM's 3.20x, and the five-peer average is 2.54x, a 26% premium; the comparison that holds is against JPM's own ten-year median of 2.00x. The rating rests on one input: at Kroll's 5.0% equity risk premium the blend is $348, and at Damodaran's implied 4.23% it is $399 and a BUY. The bull case — 20.5% ROTCE sustained at a 9.6% cost of equity — gives $432. This is a call on whether 22% is a peak or a plateau.",
      fileUrl: "assets/files/jpmorgan-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/jpmorgan-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Bajaj Finance (BAJFINANCE) — Equity Research Report",
      sector: "Financials",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-08-07",
      featured: true,
      date: "Aug 2026",
      thesis: "India's best lending franchise, with no margin of safety left to absorb the risks it names.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 7 Aug 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Microsoft Corporation (MSFT) — Equity Research Report",
      sector: "Technology",
      market: "US",
      featured: true,
      date: "Aug 2026",
      thesis: "Revenue grew 67% over four years. Free cash flow grew 3%. The capex cycle is the whole valuation question.",
      rating: "HOLD",
      targetPrice: "$488 (~0%)",
      impliedValue: "",
      detail: "FY2026 (to 30 Jun) revenue of $331.8bn (+18%) and operating income of $155.2bn (+21%) at a record 46.8% margin, with Azure accelerating to +43% and passing $100bn. Yet free cash flow was $67.0bn against $65.1bn in FY2022, because capex rose almost fivefold to $115.9bn — 35% of revenue. Valued three ways: segment sum-of-the-parts (Intelligent Cloud 30x EBIT) $537, forward P/E at 26x FY27E $507, and a DCF that must fund the capex before discounting it $404 — blending 40/30/30 to $488 against $488.63. Note too that GAAP EPS of $17.95 includes $0.67 of OpenAI gains, and the Q4 beat contains ~$0.27 of discrete items. Backlog up 84% to $678bn and a capex guidance cut to ~$175bn are the bull case; six of eight sensitivity tests turn the return negative.",
      fileUrl: "assets/files/microsoft-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/microsoft-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Amazon.com (AMZN) — Equity Research Note",
      sector: "Consumer Discretionary",
      market: "US",
      featured: false,
      date: "Jul 2026",
      thesis: "A high-margin business wearing a low-margin costume — AWS and advertising carry the value.",
      rating: "BUY",
      targetPrice: "$275 (+11%)",
      impliedValue: "",
      detail: "FY2025 revenue of $716.9bn (+13%), but the story is profitability: operating income jumped to $80.0bn with operating margin expanding to ~11% (from ~2% in 2022) as AWS, advertising and a leaner retail operation compound faster than sales. Free cash flow is temporarily depressed by a ~$132bn AI-infrastructure capex cycle. Valued sum-of-the-parts (~29x earnings, ~17x EV/EBITDA) — AWS carries the bulk of the value, advertising a ~$70bn high-incremental-margin business — supporting fair value near $275.",
      fileUrl: "assets/files/amazon-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/amazon-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Apple Inc. (AAPL) — Investment Report & DCF",
      sector: "Technology",
      market: "US",
      featured: false,
      date: "Jul 2026",
      thesis: "A great company — but at ~40x earnings, a great investment needs a margin of safety it doesn't offer here.",
      rating: "HOLD",
      targetPrice: "$302 (−9%)",
      impliedValue: "",
      detail: "Valued four ways to avoid a single-method trap: a conservative DCF (~$156), sum-of-the-parts (~$244), EV/EBITDA at 28x (~$322) and a justified 38x forward P/E (~$353). Weighting the relative and sum-of-the-parts methods that capture Apple's durable premium — a $109bn Services engine growing 14% at ~75% margins — the blended fair value is ~$302, about 9% below ~$333, with the Street's own median (~$310) also under the price. Exceptional business, no margin of safety at ~40x; a buyer on a pullback toward the high-$200s.",
      fileUrl: "assets/files/apple-investment-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/apple-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Tesla, Inc. (TSLA) — Equity Research Note",
      sector: "Automobiles",
      market: "US",
      featured: false,
      date: "Jul 2026",
      thesis: "Respect the optionality — but don't underwrite a trillion-dollar autonomy narrative with a spreadsheet.",
      rating: "HOLD",
      targetPrice: "",
      impliedValue: "~$297 prob-weighted (−5%)",
      detail: "After a Q2 FY2026 report (22 Jul) that beat on revenue but missed badly on profit, the stock fell ~15% in a day to ~$313, near its 52-week low. A multiple is meaningless at ~290x earnings, so Tesla is valued as core business plus a probability-weighted option on autonomy: the car/energy/services core plus net cash is worth only ~$77/share, so more than 70% of the price is the robotaxi + Optimus option. Weighting bear (~$125, 37%), base (~$305, 43%) and bull (~$600, 20%) gives a probability-weighted ~$297 — about 5% below market, and below the Street's ~$405 average. HOLD with a downside tilt; the $125–$600 range is the real message.",
      fileUrl: "assets/files/tesla-research-note-jul2026.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/tesla-financial-model-jul2026.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Visa Inc. (V) — Equity Research Report",
      sector: "Financials",
      market: "US",
      featured: true,
      date: "Jul 2026",
      thesis: "A flawless business at a full price — a toll-booth on cash-to-digital with ~50% net margins, but the valuation already reflects it.",
      rating: "HOLD",
      targetPrice: "$355 (~0%)",
      impliedValue: "",
      detail: "Valued four ways: P/E vs Mastercard (~29x FY26E EPS ~$13.1) → ~$380; EV/EBITDA (~23–24x) → ~$340–355; a conservative DCF floor near $315; blended and weighted toward the cash-flow methods → fair value ~$355, almost exactly today's price. The relative multiple still whispers cheap; the intrinsic methods say fully valued. Moved to HOLD (from BUY) — a valuation call, not a business call; I'd re-engage in the $320s. Swing factor: stablecoins and AI-agent payments.",
      fileUrl: "assets/files/visa-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/visa-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Coca-Cola (KO) — Equity Research Note",
      sector: "Consumer Staples",
      market: "US",
      featured: false,
      date: "Jul 2026",
      thesis: "A wonderful business to own and a frustrating one to chase — after a Q2 beat it hit a record high and ran past fair value.",
      rating: "HOLD",
      targetPrice: "$86 (−1%)",
      impliedValue: "",
      detail: "Q2 FY2026 (reported 28 Jul) beat on both lines — comparable EPS $0.97 vs $0.93, revenue $13.4bn (+7%) — and management raised full-year guidance, sending the stock ~3.5% higher to a fresh all-time high near $87. Valued four ways, DDM-led for a 64-year Dividend King (Gordon ~$99, 27x P/E ~$87, EV/EBITDA ~$78, DCF floor ~$59): blended fair value ~$86, essentially the price. With a ~2.4% yield, total return is ~+1%; the DDM leans on a generous 5% perpetual-growth assumption, so risk is skewed down. Moved to HOLD (from ACCUMULATE) — quality fully priced; I'd build again toward the high-$70s.",
      fileUrl: "assets/files/coca-cola-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/coca-cola-business-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Reliance Industries (RELIANCE) — Equity Research Report",
      sector: "Conglomerate",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-08-04",
      featured: true,
      date: "Aug 2026",
      thesis: "Four businesses in one holding structure — and an expected return below the government bond yield.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 4 Aug 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Hindustan Unilever (HINDUNILVR) — Investment Report",
      sector: "Consumer Staples",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-07-14",
      featured: false,
      date: "Jul 2026",
      thesis: "A high-quality franchise, fairly valued at today's multiple.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 14 Jul 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Tata Consultancy Services (TCS) — Equity Research Report",
      sector: "Technology",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-06-18",
      featured: true,
      date: "Jun 2026",
      thesis: "The de-rating has overshot the fundamentals — highest operating margins in four years at ~16x earnings.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 18 Jun 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Infosys (INFY) — Equity Research Report",
      sector: "Technology",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-07-02",
      featured: false,
      date: "Jul 2026",
      thesis: "The price has fallen far more than the fundamentals have.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 2 Jul 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "HDFC Bank (HDFCBANK) — Equity Research Report",
      sector: "Financials",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-06-25",
      featured: false,
      date: "Jun 2026",
      thesis: "The ROE recovery is real — and already in the price.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 25 Jun 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "ICICI Bank (ICICIBANK) — Equity Research Report",
      sector: "Financials",
      market: "India",
      access: "private",              /* full note in PRIVATE/india-notes.json */
      revealAfter: "2027-07-06",
      featured: false,
      date: "Jul 2026",
      thesis: "Superb franchise — but the price has now run ahead of it.",
      rating: "",
      targetPrice: "",
      impliedValue: "",
      detail: "The full note, with its valuation, price target and the Excel model behind it, is shared privately with recruiters and employers on request. It will be published here with its outcome once its 12-month horizon ends on 6 Jul 2027.",
      fileUrl: "",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "A 5% World — Quarterly Macro, Q4 2026",
      sector: "Macro",
      market: "Macro",
      featured: true,
      date: "Oct 2026",
      thesis: "The US 10-year above 5% is a real-rate shock, not an inflation scare — and it lands hardest on high-multiple compounders, not the index.",
      rating: "",
      targetPrice: "",
      impliedValue: "10-yr 5.12% · TIPS 2.77% · implied ERP 4.20%",
      detail: "Since January the US 10-year is up 94bp, and 84bp of that is real yield: breakevens moved only 10bp. An oil shock (Brent $114 in September, $126–130 in early October) turned the Fed from cutting to hiking, to 3.75–4.00% on 16 September. The S&P 500 at 19.0x forward still clears the bond by 0.14pp, but only if earnings grow 32.8% this year and 16.0% next; on trailing earnings the yield gap is −1.27pp, below every year-end since 2000. Names on 30–45x earnings carry the duration risk: a 25bp rise is worth about −11% at 44x. India imports the shock through a rupee near 95 and ~₹3 lakh crore of foreign selling. Every covered name is mapped to whether the macro supports or pressures its rating; three are flagged (Amazon, JPMorgan and Sun Pharma), none changed.",
      fileUrl: "assets/files/quarterly-macro-q4-2026.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/quarterly-macro-q4-2026-data.xlsx",
      fileLabel2: "Download the data (Excel)",
      thumbnail: ""
    },
    {
      title: "India Import Dependency — Sectoral Overview (FY 2024–25)",
      sector: "Macro",
      market: "Macro",
      featured: true,
      date: "2026",
      thesis: "The structural danger isn't the aggregate bill — it's the concentration of critical inputs in single suppliers.",
      rating: "",
      targetPrice: "",
      impliedValue: "$678.7bn import bill · $241.3bn deficit",
      detail: "Macro study of India's merchandise import dependency across ten sectors — from ~60% edible-oil import dependence to the 2025 fertilizer disruption — with strategic recommendations, built alongside a full Excel analysis workbook.",
      fileUrl: "assets/files/india-import-dependency.pdf",
      fileLabel: "Read the overview (PDF)",
      fileUrl2: "assets/files/india-import-dependency-analysis.xlsx",
      fileLabel2: "Download the analysis (Excel)",
      thumbnail: ""
    }
  ],

  /* --------------------------------------------------------------------
     DEALS — the "Deal Decoded" M&A series, rendered on deals.html.
     - published: ISO date the LinkedIn post went out; null keeps the deal
       off the site (draft). Set it on the day of posting.
     - status: "Closed" | "Pending" | "Terminated".
     - live: only for pending deals; the daily tracker (data/deal-tracker.json,
       refreshed by .github/workflows/deal-tracker.yml) adds price and spread.
     - keyNumbers: every figure comes from the deal's own model (DEALS/ folder
       on the desk), with the as-of date in asOf.
     -------------------------------------------------------------------- */
  deals: [
    {
      id: "sun-pharma-organon",
      series: 2,
      published: "2026-10-29",
      title: "Sun Pharma / Organon",
      acquirer: "Sun Pharma",
      target: "Organon (NYSE: OGN)",
      market: "India → US",
      sector: "Pharma",
      status: "Pending",
      announced: "2026-04-27",
      closeLabel: "Expected early 2027",
      size: "US$11.75bn EV · all cash · $14.00 a share",
      hook: "Organon's own banker valued it at $6.80–13.90 a share. Sun is paying $14.00.",
      verdict: "A cheap multiple and a full price. Organon's shareholders won the auction; on management's plan Sun keeps about a fifth of its guided synergies and needs ~82% of the $350m to break even.",
      keyNumbers: [
        { label: "Premium to unaffected", value: "+103%" },
        { label: "EV / LTM EBITDA", value: "6.3x" },
        { label: "Synergy value kept by Sun", value: "20%" },
        { label: "NPV to Sun", value: "+$361m" },
        { label: "Break-even delivery", value: "82%" },
        { label: "EPS accretion FY28, reported", value: "+12%" }
      ],
      asOf: "2026-10-28",
      live: { ticker: "OGN" },
      fileUrl: "assets/files/deal-sun-pharma-organon.pdf",
      fileLabel: "Read the note + model (PDF) ↗",
      fileUrl2: "assets/files/deal-sun-pharma-organon-model.xlsx",
      fileLabel2: "Download model (.xlsx)"
    },
    {
      id: "hdfc-ltd-hdfc-bank",
      series: 1,
      published: "2026-10-24",
      title: "HDFC Ltd into HDFC Bank",
      acquirer: "HDFC Bank",
      target: "HDFC Ltd",
      market: "India",
      sector: "Banking",
      status: "Closed",
      announced: "2022-04-04",
      closeLabel: "Closed 1 Jul 2023",
      size: "~US$40bn · all stock · 42 for 25",
      hook: "A 3.25% premium. Since the announcement HDFC Bank has returned +1.6%; Nifty Bank +49%.",
      verdict: "A fair price for a deal the regulator made expensive in its first years. Since then, neither set of shareholders has been paid for it.",
      keyNumbers: [
        { label: "Premium paid", value: "+3.25%" },
        { label: "Value to HDFC Ltd holders", value: "₹14,472 cr" },
        { label: "CRR/SLR bill, PV", value: "₹6,415 cr" },
        { label: "HDFC Bank TSR", value: "+1.6%" },
        { label: "Nifty Bank", value: "+49.4%" },
        { label: "ROE, pro forma → now", value: "14.9% → 13.5%" }
      ],
      asOf: "2026-10-19",
      fileUrl: "assets/files/deal-hdfc-ltd-hdfc-bank.pdf",
      fileLabel: "Read the note + model (PDF) ↗",
      fileUrl2: "assets/files/deal-hdfc-ltd-hdfc-bank-model.xlsx",
      fileLabel2: "Download model (.xlsx)"
    }
  ],

  /* --------------------------------------------------------------------
     TOOLS & LIVE TERMINALS — interactive apps. status: "live" | "building".
     Live tools need url; building slots may leave url "".
     -------------------------------------------------------------------- */
  tools: [
    {
      name: "Meridian",
      status: "live",
      url: "https://debjitmukherjee1.github.io/meridian/",
      type: "VALUATION + MACRO",
      summary: "A sentiment-adjusted valuation tool — blends fundamental fair value with a market-sentiment overlay across four markets, plus a macro-backdrop dashboard (inflation, growth, policy rates, FX).",
      features: [
        "Blends fundamental fair value with a live market-sentiment overlay",
        "Covers four markets side by side",
        "Standalone macro-backdrop dashboard — inflation, growth, policy rates, FX"
      ]
    },
    {
      name: "MarketPulse",
      status: "live",
      url: "https://debjitmukherjee1.github.io/marketpulse/",
      type: "MONITOR + SIM + RISK",
      summary: "A global index monitor with a Monte Carlo simulator, portfolio backtester, and risk suite (correlation matrix, rolling volatility, historical VaR) — all computed in the browser.",
      features: [
        "Global index monitor across major markets",
        "Monte Carlo simulator for portfolio-path stress-testing",
        "Backtester plus a risk suite — correlation matrix, rolling volatility, historical VaR"
      ]
    },
    {
      name: "Ledger",
      status: "live",
      url: "https://debjitmukherjee1.github.io/ledger/",
      type: "TRACK RECORD",
      summary: "A public, self-updating track record of every research call published — return since call, alpha vs benchmark, hit rate, upcoming earnings. Losers shown as prominently as winners.",
      features: [
        "Self-updating track record of every call published",
        "Return since call and alpha vs. benchmark, side by side",
        "Hit rate and upcoming earnings tracked live",
        "Losers shown as prominently as winners — no survivorship bias"
      ]
    },
    {
      name: "Abacus",
      status: "live",
      url: "https://debjitmukherjee1.github.io/abacus/",
      type: "TOOLKIT",
      summary: "The analyst's toolkit — six calculators (DCF with sensitivity heatmap, comps, Black-Scholes options, bond math, WACC/CAPM, SIP/compounding) computed live client-side.",
      features: [
        "Six calculators: DCF with a sensitivity heatmap, comps, Black-Scholes options, bond math, WACC/CAPM, SIP/compounding",
        "Every calculation runs client-side — nothing leaves the browser"
      ]
    },
    {
      name: "Tenline",
      status: "live",
      url: "https://debjitmukherjee1.github.io/tenline/",
      type: "FUNDAMENTALS",
      summary: "Ten years of any S&P 500 company's fundamentals — revenue, margins, FCF, ROIC, share count — charted straight from SEC filings. Ten years, ten lines, no narrative.",
      features: [
        "Ten years of fundamentals for any S&P 500 company",
        "Revenue, margins, FCF, ROIC and share count, charted straight from SEC filings",
        "No narrative overlay — just the ten lines"
      ]
    }
  ],

  /* --------------------------------------------------------------------
     RESEARCH ACCESS — the request page for the private Indian notes
     (access.html, rendered by js/access.js).
     - formAction / fields: the Google Form "Research access requests
       (website)" in your Google account that receives each request, and its
       field ids. Google emails you on every request; share the Drive folder
       "India Research Pack (private)" with the email given. Change these
       only if you make a new form.
     - facts: statements shown to every requester. The holdings fact is
       dated: if you buy shares in a covered company, update it (and the
       note) before sharing that note, and change the date. A fact with
       needsConfirming: true stays hidden until you check it is true and set
       confirmed: true.
     - terms: what the requester agrees to. If you change them, change
       termsVersion too, so each request records the version agreed to.
     -------------------------------------------------------------------- */
  access: {
    formAction: "https://docs.google.com/forms/d/e/1FAIpQLSf90-LrEAQgzzmOn6ugR0adsnt__piiA44GgiLkL5j9A7z2YA/formResponse",
    fields: {
      name: "entry.203199067", email: "entry.1788100854", firm: "entry.577196572", role: "entry.2114480373",
      linkedin: "entry.1042752667", notes: "entry.918227060", message: "entry.2080916818",
      terms: "entry.2085524100", source: "entry.1914732434"
    },
    termsVersion: "1.0 (13 Nov 2026)",
    responseTime: "I read every request myself and reply within two working days. If I share the notes, you will get a Google Drive invitation at the email you give.",
    facts: [
      { text: "I am Debjit Mukherjee, a second-year undergraduate on the B.Com (Honours & Research) programme at Amity University Kolkata, expected to graduate in 2029." },
      { text: "I am not registered with the Securities and Exchange Board of India (SEBI) as a research analyst or an investment adviser, and I am not registered with any other financial regulator." },
      { text: "The notes are student work. I prepared them myself from public information: company filings, results announcements, exchange data and published market prices. I did not use any non-public information." },
      { text: "Each rating and price target is the output of my own valuation model on the date of the note. It is not updated after publication unless the note says so, and it may now be out of date." },
      { text: "None of this is investment advice, a recommendation to buy, sell or hold any security, or an offer of any kind." },
      { text: "Every target is set on a 12-month horizon. None of the Indian calls is a year old yet, so their returns so far are early readings, not evidence of accuracy." },
      { text: "Each note is published in full on my website, with its outcome, once its 12-month horizon ends. Until then it is shared only privately, one person at a time." },
      { text: "As of 13 Nov 2026, I hold no shares in any company covered in these notes. My only investments are units in HDFC Mutual Fund schemes. HDFC Mutual Fund is run by HDFC Asset Management Company, a separate company from HDFC Bank, and I do not choose which stocks those schemes hold, so they may include companies covered here.", needsConfirming: true, confirmed: true },
      { text: "I have never been paid by any company covered in these notes, and I do not work for or advise any of them.", needsConfirming: true, confirmed: true }
    ],
    terms: [
      { title: "Purpose", text: "You are asking for these materials only to assess me for a job, an internship, or an academic or professional purpose of the same kind." },
      { title: "Keep them private", text: "You will not publish, post, forward or share the materials, or quote them in public, beyond the people at your firm involved in assessing me." },
      { title: "No investment use", text: "You will not use the materials, or let anyone use them, as a basis for buying, selling or holding any security, or for advising anyone else to." },
      { title: "No reliance", text: "The materials are provided as they are. They may contain errors, I give no warranty about them, and I accept no responsibility for any use of them." },
      { title: "Accurate details", text: "The details you give below are true, and you are asking in a professional capacity." },
      { title: "Access can be withdrawn", text: "I decide whether to share the materials, and I may withdraw access at any time. If I ask, you will delete any copies you have made." }
    ],
    privacy: "What I collect: the details in this form. Why: only to confirm who you are, reply to you and share the notes you ask for. Where it is kept: in a Google Form and its responses, in my own Google account. Who sees it: only me; I do not sell or share it. How long: until I have dealt with your request, and no more than 12 months after that. You can ask me to delete it at any time by emailing m.debjit2007@gmail.com."
  },

  /* --------------------------------------------------------------------
     WORKBENCH — the in-site calculators on lab.html (built in js/lab.js).
     Only the card text lives here: name, type and summary. id must match
     the calculator's id in lab.js (rdcf, lbo, merger, arb, ff, hurdle).
     -------------------------------------------------------------------- */
  workbench: [
    { id: "rdcf",   name: "Priced In",      type: "REVERSE DCF",
      summary: "Runs a DCF backwards: given today's price, it solves for the revenue growth the market is already paying for." },
    { id: "lbo",    name: "Paper LBO",      type: "LEVERAGED BUYOUT",
      summary: "Entry multiple, leverage, a cash sweep and an exit: IRR, money multiple, a debt schedule and where the return came from." },
    { id: "merger", name: "Merger Math",    type: "ACCRETION / DILUTION",
      summary: "Pro-forma EPS for a cash-and-stock deal, and the synergies it needs to break even." },
    { id: "arb",    name: "Spread",         type: "MERGER ARBITRAGE",
      summary: "Turns a deal spread into an annualised return and the market's implied odds of closing. Pre-filled from the live tracker." },
    { id: "ff",     name: "Football Field", type: "VALUATION SUMMARY",
      summary: "Build the pitch-book chart: every method as a range, the price through it, the weighted blend. Downloads as an image." },
    { id: "hurdle", name: "The Hurdle",     type: "RATING ENGINE",
      summary: "The rule behind every rating here: expected total return against the bond yield, and the prices at which the rating flips." }
  ],

  /* --------------------------------------------------------------------
     PIPELINE — upcoming coverage, shown as ghost cards under the library.
     tag: short mono label e.g. "IN BUILD" | "QUEUED" | "SCHEDULED".
     -------------------------------------------------------------------- */
  pipeline: [
    { label: "US · S&P 500 · Queued", title: "Next US name",
      summary: "Sector chosen for variety against existing coverage.", tag: "QUEUED" },
    { label: "India · Nifty 50 · Queued", title: "Next India name",
      summary: "Sector chosen for variety against existing coverage.", tag: "QUEUED" },
    { label: "Thematic · Macro · Q1 2027", title: "Quarterly macro report",
      summary: "The next seasonal deep-dive (India), tied back to the coverage universe.", tag: "SCHEDULED" }
  ],

  /* --------------------------------------------------------------------
     CREDENTIALS & CERTIFICATIONS — badge/progress list.
     progress: 0–100 (drawn as a small bar) or null to hide the bar.
     -------------------------------------------------------------------- */
  credentials: [
    {
      name: "CFA Program — Level I",
      issuer: "CFA Institute",
      status: "Candidate — target 2027",
      progress: null,
      detail: "Registered Level I candidate studying alongside the degree, with a 2027 exam target."
    },
    {
      name: "Discounted Cash Flow (DCF) Modelling",
      issuer: "Coursera",
      status: "Completed Jan 2026",
      progress: 100,
      detail: "Course covering full DCF construction: free cash flow forecasting, WACC derivation, terminal value and sensitivity analysis."
    },
    {
      name: "Finance Certificate",
      issuer: "SmartEd Innovations (STEM.org accredited; Skill India & NSDC recognised)",
      status: "Completed May 2026",
      progress: 100,
      detail: "Accredited finance program recognised under Skill India and NSDC."
    },
    {
      name: "National Financial Literacy Quiz 2026 — College Round",
      issuer: "NISM (an SEBI initiative)",
      status: "Participant 2026",
      progress: 100,
      detail: "College-round participant in NISM's National Financial Literacy Quiz, an initiative of SEBI."
    },
    {
      name: "Virtual Job Simulations — 9 completed",
      issuer: "Forage",
      status: "2025 – 2026",
      progress: 100,
      detail: "Completed nine bank and asset-manager simulations: J.P. Morgan (Investment Banking), Citi (Investment Banking), Bank of America (Investment Banking), Goldman Sachs (Risk), Vista Equity Partners (Private Equity), Fidelity International (Investment Management), PGIM (Fixed Income), Lloyd's, and Operations."
    }
  ],

  /* --------------------------------------------------------------------
     SKILLS — two flat lists of short strings.
     -------------------------------------------------------------------- */
  skills: {
    technical: [
      "Financial Modelling",
      "DCF Valuation",
      "Excess-Return (Bank) Valuation",
      "Equity Research & Report Writing",
      "Financial Statement & Ratio Analysis",
      "Forecasting & Sensitivity Analysis",
      "Peer Comparables",
      "Microsoft Excel (advanced)",
      "TallyPrime"
    ],
    soft: [
      "Analytical Thinking",
      "Problem Solving",
      "Written & Verbal Communication",
      "Team Leadership",
      "Event & Budget Management"
    ]
  }
};
