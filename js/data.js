/* ============================================================================
   data.js — THE ONLY FILE YOU (OR A FUTURE AI) NEED TO EDIT FOR CONTENT.
   ----------------------------------------------------------------------------
   Every piece of text, every link, every image path on the site lives here.
   The site is three pages — index.html (Overview), research.html (the full
   report library) and tools.html (the tools grid) — all reading from this
   one file, styled by css/styles.css and rendered by js/app.js. None of
   those three ever need to change for routine content updates.

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
    bio: "B.Com (Honours & Research) student at Amity University Kolkata and CFA Program Level I candidate, targeting equity research and investment banking. I independently research, model, and publish full equity reports — DCF and excess-return valuations across technology, consumer, payments, banking and IT services — alongside sector and macro studies. Founder of my university's Finance & Research Club.",
    email: "m.debjit2007@gmail.com",
    linkedinUrl: "https://www.linkedin.com/in/debjit-mukherjee101/",
    resumeUrl: "assets/files/Debjit_Mukherjee_Resume.pdf",
    /* Portrait photo shown framed above your name. Set to "" to hide. */
    portraitImage: "",
    /* Backdrop photo behind the masthead (heavily darkened by the site
       so text stays readable). Set to "" for a plain background. */
    backdropImage: "assets/images/skyline.jpg",
    /* A short human line shown near the footer. Set to "" to hide. */
    personalLine: "Languages: English, Hindi, Bengali · Interests: financial modelling, industry research, football, Tae Kwon Do",
    /* Stats shown under the bio — the numbers count up when the page loads.
       value must be a plain number; suffix is text glued after it ("+", "%", ""). */
    stats: [
      { value: 16, suffix: "",  label: "Companies covered" },
      { value: 17, suffix: "",  label: "Research reports & models" },
      { value: 3,  suffix: "",  label: "Internships" },
      { value: 9,  suffix: "",  label: "Bank job simulations" }
    ]
  },

  /* --------------------------------------------------------------------
     TICKER — the scrolling tape under the masthead (the site's signature),
     shown on all three pages. Each item: label, value, direction ("up" |
     "down" | "flat"), sectionId to jump to, and page — the file that
     section actually lives on ("index.html" | "research.html" |
     "tools.html"). Clicking scrolls same-page if you're already on that
     page, otherwise navigates there first. Valid sectionIds: education,
     leadership, experience, models, credentials, skills, contact.
     -------------------------------------------------------------------- */
  ticker: [
    { label: "COVERAGE",   value: "16 COMPANIES",            direction: "up",   sectionId: "models",      page: "research.html" },
    { label: "MARUTI",     value: "REDUCE · FV ₹12,978",     direction: "down", sectionId: "models",      page: "research.html" },
    { label: "JPM",        value: "REDUCE · FV $323",        direction: "down", sectionId: "models",      page: "research.html" },
    { label: "BAJFINANCE", value: "REDUCE · FV ₹1,007",        direction: "down", sectionId: "models",      page: "research.html" },
    { label: "MSFT",       value: "HOLD · FV $488",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "RELIANCE",   value: "HOLD · FV ₹1,361",        direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "GOOGL",      value: "HOLD · FV $384",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "TCS",        value: "BUY · TP ₹2,502",         direction: "up",   sectionId: "models",      page: "research.html" },
    { label: "V",          value: "HOLD · TP $355",          direction: "flat", sectionId: "models",      page: "research.html" },
    { label: "CFA L1",     value: "CANDIDATE · 2027",        direction: "up",   sectionId: "credentials", page: "index.html" },
    { label: "FIN & RESEARCH CLUB", value: "FOUNDER",        direction: "up",   sectionId: "leadership",  page: "index.html" },
    { label: "B.COM (H&R)", value: "AMITY KOLKATA",          direction: "flat", sectionId: "education",   page: "index.html" },
    { label: "INTERNSHIPS", value: "3 COMPLETED",            direction: "up",   sectionId: "experience",  page: "index.html" },
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
        "Award winner at MAGNAFEST 3.0, the School of Business fest (April 2026)",
        "Founder of the university's Finance & Research Club"
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
      organization: "Finance & Research Club, Amity University Kolkata",
      years: "2026 — present",
      summary: "Founded and lead the university's finance & research club — charter, research agenda and member onboarding built from the ground up. Official launch coming soon.",
      bullets: [
        "Drafted the club's charter and research agenda, and secured institutional backing",
        "Designed the member onboarding pipeline and first-semester programme: model-building workshops, research publications, and speaker sessions",
        "Building a core team ahead of the official campus launch"
      ],
      photos: [],
      featured: true
    },
    {
      role: "Award Winner — Business Fest",
      organization: "MAGNAFEST 3.0, Amity School of Business",
      years: "April 2026",
      summary: "Team award at the School of Business's annual fest, competing in business and finance events.",
      bullets: [
        "Awarded at MAGNAFEST 3.0, organised by the School of Business (April 2026)",
        "Competed with a four-member team across business strategy and finance events"
      ],
      photos: [
        { src: "assets/images/magnafest-1.jpg", caption: "Receiving the MAGNAFEST 3.0 award — Amity School of Business, April 2026" },
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
      summary: "Independent equity research contributor — authoring U.S.-listed company reports and valuation models for editorial review and publication.",
      bullets: [
        "Author full equity research notes and DCF/comps valuation models on U.S.-listed companies, rebuilt to Vireo's house template and methodology",
        "Reconcile each valuation against an independent model — intrinsic value and blended target within ±2%, rating identical — before editorial submission",
        "Apply Vireo's house approach: a DCF-driven intrinsic value with a 70/30 blended target, comps as a cross-check, and any divergence explained in the thesis"
      ],
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
       leave any of them "" to hide that line.
     fileUrl / fileLabel:   primary link (research report PDF).
     fileUrl2 / fileLabel2: optional second link (Excel model download).
     -------------------------------------------------------------------- */
  models: [
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
      featured: true,
      date: "Aug 2026",
      thesis: "Best operating quarter in years, worst financial one. The margin is cyclical — but it is already paid for.",
      rating: "REDUCE",
      targetPrice: "₹12,978 (−5.2%)",
      impliedValue: "",
      detail: "Q1 FY2027 was a paradox. Volumes +29.3%, small cars +34.1%, SUVs +44.6%, exports +28.6%, domestic share +2.3pp to 41.2% — the best competitive quarter in years, on 13 days of network inventory. Yet profit fell 9.1% and operating margin fell 376bp to 8.22%, the lowest since FY2022. The company's own words: material costs \"seriously aggravated during the war.\" A sell-side bridge puts 300 of the 380bp on commodity — cyclical, and that argues against this rating. Two findings shape the call. Other income of ₹1,972 crore funded 44% of pre-tax profit: the ₹76,838 crore investment book, not the cars, carried the quarter. And that book yields 6.13% pre-tax, below the 6.82% G-sec, so stripping it out makes the shares dearer, not cheaper — the core auto business trades on 32.9x against a headline 29.9x. Valued three ways: five-year DCF at an 11.92% cost of equity → ₹11,666; 24x normalised FY2028E EPS of ₹605 → ₹14,531; 12x FY2028E EBITDA → ₹12,904. Blended 40/35/25 to ₹12,978. At 11.92% the current price solves to a 13.6% terminal margin against 13% actually achieved in FY2024–25 and an 11.5% ten-year average — demanding, not absurd, which is why this is narrow. Sixty basis points of terminal margin flips it to HOLD. Bull case ₹16,579 and a BUY. Third-party estimates span ₹6,463 to ₹17,496, a 2.7x spread; ours sits nearest Nomura's ₹14,070, the one Neutral house and the only one of six to raise rather than cut after the quarter.",
      fileUrl: "assets/files/maruti-suzuki-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/maruti-suzuki-financial-model.xlsx",
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
      featured: true,
      date: "Aug 2026",
      thesis: "India's best lending franchise, with no margin of safety left to absorb the risks it names.",
      rating: "REDUCE",
      targetPrice: "₹1,007 (−6.6%)",
      impliedValue: "",
      detail: "Q1 FY2027 was excellent — AUM +23.9% to ₹5.47 lakh crore, NII +22.9%, attributable profit +27.4% to ₹5,986 crore, with gross NPA improving to 0.96% and credit cost to 1.31% ex a one-off provision. But return on equity has fallen from 23% (FY2023) to 18.2% (FY2026) while the multiple stayed elevated. Valued three ways: justified forward P/E at 30x FY27E EPS of ₹39 → ₹1,170; peer-set 28x → ₹1,092; a 15-year excess-return model at a 12.22% cost of equity → ₹471. Blended 50/30/20 to ₹1,007. On 7 August the RBI released draft norms restricting NBFCs to term loans and discontinuing revolving credit; Bajaj — with ~15% of AUM in revolving products, the highest of any large NBFC — fell 5.8% to ₹1,078. Scenarios for a 5–15% earnings hit give ₹960 to ₹869, all REDUCE. Our ₹1,007 sits with Emkay (₹1,000) in a bear cluster against bulls at ₹1,250–1,300.",
      fileUrl: "assets/files/bajaj-finance-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/bajaj-finance-financial-model.xlsx",
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
      sector: "Consumer",
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
      sector: "Autos & EV",
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
      sector: "Payments",
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
      sector: "Consumer",
      market: "US",
      featured: false,
      date: "Jul 2026",
      thesis: "A wonderful business to own and a frustrating one to chase — after a Q2 beat it hit a record high and ran past fair value.",
      rating: "HOLD",
      targetPrice: "$86 (−1%)",
      impliedValue: "",
      detail: "Q2 FY2026 (reported 28 Jul) beat on both lines — comparable EPS $0.97 vs $0.93, revenue $13.4bn (+7%) — and management raised full-year guidance, sending the stock ~3.5% higher to a fresh all-time high near $87. Valued four ways, DDM-led for a 64-year dividend King (Gordon ~$99, 27x P/E ~$87, EV/EBITDA ~$78, DCF floor ~$59): blended fair value ~$86, essentially the price. With a ~2.4% yield, total return is ~+1%; the DDM leans on a generous 5% perpetual-growth assumption, so risk is skewed down. Moved to HOLD (from ACCUMULATE) — quality fully priced; I'd build again toward the high-$70s.",
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
      featured: true,
      date: "Aug 2026",
      thesis: "Four businesses in one holding structure — and an expected return below the government bond yield.",
      rating: "HOLD",
      targetPrice: "₹1,361 (+4.5%)",
      impliedValue: "",
      detail: "India's largest company, valued sum-of-the-parts on FY27E EBITDA because a refinery, a telecom network and a grocery chain do not share a multiple: Jio at 15x but only 66.4% owned, Retail at 24x on ~85%, O2C at 7x, upstream at 5x, New Energy at invested capital — less ₹1.23 lakh crore net debt, giving ₹1,423. A DCF returns ₹1,156, below the market price, because a decade of heavy capex has held ROE at 8.9% against a ~12–13% cost of equity. Blended fair value ₹1,361 versus ₹1,302. The rating is a hurdle-rate call: a ~5% expected total return sits below India's 7.1% ten-year G-sec, so the Street's ₹1,640–1,690 (which needs Jio at 17–19x and Retail at 28–32x simultaneously) is a bet on a re-rating the Jio IPO has yet to confirm.",
      fileUrl: "assets/files/reliance-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/reliance-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Hindustan Unilever (HINDUNILVR) — Investment Report",
      sector: "Consumer",
      market: "India",
      featured: false,
      date: "Jul 2026",
      thesis: "A high-quality franchise, fairly valued — hold what you own, don't chase it here.",
      rating: "HOLD",
      targetPrice: "₹2,190 (+2.8%)",
      impliedValue: "",
      detail: "India's largest FMCG company, reaching nine of ten Indian households across 35+ brands. Gross margins held at 43.9% in FY2026 while EBITDA margins compressed to 23.4% on palm-oil inflation. At a 40.3x forward P/E, the blended fair value (70% comps, 30% DCF) is ₹2,190 — in line with the market. A core defensive hold; add only on dips toward ₹1,900–₹2,000.",
      fileUrl: "assets/files/hul-investment-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/hul-business-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Tata Consultancy Services (TCS) — Equity Research Report",
      sector: "IT Services",
      market: "India",
      featured: true,
      date: "Jun 2026",
      thesis: "The de-rating has overshot the fundamentals — highest operating margins in four years at ~16x earnings.",
      rating: "BUY",
      targetPrice: "₹2,502 (+13.8%)",
      impliedValue: "",
      detail: "FY2026 revenue of ₹2,67,021 crore (+4.6%) with the strongest quarterly print in Q4 and ~25% operating margins. DCF (WACC 11.4%, terminal growth 5%) values the stock at ₹2,502 — the key debate is whether generative AI deflates IT services revenue faster than it creates new demand.",
      fileUrl: "assets/files/tcs-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/tcs-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Infosys (INFY) — Equity Research Report",
      sector: "IT Services",
      market: "India",
      featured: false,
      date: "Jul 2026",
      thesis: "Upgraded to ACCUMULATE — the price has fallen far more than the fundamentals have.",
      rating: "ACCUMULATE",
      targetPrice: "₹1,190 (+14.3%)",
      impliedValue: "",
      detail: "Down ~38% over twelve months on real but over-discounted concerns. Assumptions deliberately cut — FY2027 revenue growth of ~3% recovering to ~7% by FY2031 — and the stock still screens cheap. Upgraded from HOLD with a ₹1,190 target.",
      fileUrl: "assets/files/infosys-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/infosys-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "HDFC Bank (HDFCBANK) — Equity Research Report",
      sector: "Banking",
      market: "India",
      featured: false,
      date: "Jun 2026",
      thesis: "The ROE recovery is real — and already in the price.",
      rating: "HOLD",
      targetPrice: "₹737 (−6.1%)",
      impliedValue: "",
      detail: "Excess-return valuation (cost of equity 11.0%, terminal growth 5.5%) values the bank at ₹737, ~6% below market. ROE expansion back toward 15–16% as high-cost borrowings run off is credible, but the re-rating has front-run it.",
      fileUrl: "assets/files/hdfc-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/hdfc-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "ICICI Bank (ICICIBANK) — Equity Research Report",
      sector: "Banking",
      market: "India",
      featured: false,
      date: "Jul 2026",
      thesis: "Superb franchise — but the price has now run ahead of it.",
      rating: "REDUCE",
      targetPrice: "₹1,199 (−15.0%)",
      impliedValue: "",
      detail: "India's second-largest private-sector bank and the sector's execution benchmark — FY2026 standalone PAT of ₹50,147 crore (+6.2%), a Q4 NIM expanding to 4.32%, and net NPAs of just 0.33%. But after a run to ₹1,411 (~2.8x book) the excess-return model (cost of equity 10.8%, terminal growth 5.5%) values it at ₹1,199 — about 15% below market, leaving negative margin of safety. Downgraded from HOLD to REDUCE on entry price, not the business; a buyer again toward ₹1,200.",
      fileUrl: "assets/files/icici-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/icici-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
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
     PIPELINE — upcoming coverage, shown as ghost cards under the library.
     tag: short mono label e.g. "IN BUILD" | "QUEUED" | "SCHEDULED".
     -------------------------------------------------------------------- */
  pipeline: [
    { label: "India · Nifty 50 · Expected Aug 2026", title: "Next India name",
      summary: "Full model and research note in build — publishing on the regular schedule.", tag: "IN BUILD" },
    { label: "US · S&P 500 · Expected Aug 2026", title: "Next US name",
      summary: "Sector chosen for variety against existing coverage.", tag: "QUEUED" },
    { label: "Thematic · Macro · Oct 2026", title: "Quarterly macro report",
      summary: "The next seasonal deep-dive, tied back to the coverage universe.", tag: "SCHEDULED" }
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
      progress: 35,
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
