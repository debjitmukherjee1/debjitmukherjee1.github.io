/* ============================================================================
   data.js — THE ONLY FILE YOU (OR A FUTURE AI) NEED TO EDIT FOR CONTENT.
   ----------------------------------------------------------------------------
   Every piece of text, every link, every image path on the site lives here.
   The layout (index.html), styling (css/styles.css) and behaviour (js/app.js)
   read from this file and never need to change for routine content updates.

   RULES OF THUMB
   - To ADD an entry (a model, an internship, a credential…): copy an existing
     object in the relevant list, paste it below, and edit the values.
   - To REMOVE an entry: delete its whole { ... } block, including the comma.
   - Image paths are relative to the site root, e.g. "assets/images/photo.jpg".
   - File links (models, resume) point to files in "assets/files/".
   - Keep the quotes. If your text itself contains a double quote, use \" .
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
      { value: 11, suffix: "",  label: "Companies covered" },
      { value: 12, suffix: "",  label: "Research reports & models" },
      { value: 3,  suffix: "",  label: "Internships" },
      { value: 9,  suffix: "",  label: "Bank job simulations" }
    ]
  },

  /* --------------------------------------------------------------------
     TICKER — the scrolling tape under the masthead (the site's signature).
     Each item: label, value, direction ("up" | "down" | "flat"), and
     optionally sectionId to jump to when clicked. Valid sectionIds:
     education, leadership, experience, models, credentials, skills, contact.
     -------------------------------------------------------------------- */
  ticker: [
    { label: "COVERAGE",   value: "11 COMPANIES",            direction: "up",   sectionId: "models" },
    { label: "GOOGL",      value: "BUY · TP $390",           direction: "up",   sectionId: "models" },
    { label: "TCS",        value: "BUY · TP ₹2,502",         direction: "up",   sectionId: "models" },
    { label: "V",          value: "BUY · TP $373",           direction: "up",   sectionId: "models" },
    { label: "CFA L1",     value: "CANDIDATE · 2027",        direction: "up",   sectionId: "credentials" },
    { label: "FIN & RESEARCH CLUB", value: "FOUNDER",        direction: "up",   sectionId: "leadership" },
    { label: "B.COM (H&R)", value: "AMITY KOLKATA",          direction: "flat", sectionId: "education" },
    { label: "INTERNSHIPS", value: "3 COMPLETED",            direction: "up",   sectionId: "experience" },
    { label: "STATUS",     value: "OPEN TO OPPORTUNITIES",   direction: "up",   sectionId: "contact" }
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
     rating / targetPrice / impliedValue: shown in the mono data readout —
       leave any of them "" to hide that line.
     fileUrl / fileLabel:   primary link (research report PDF).
     fileUrl2 / fileLabel2: optional second link (Excel model download).
     -------------------------------------------------------------------- */
  models: [
    {
      title: "Alphabet Inc. (GOOGL) — Equity Research Note",
      sector: "Technology",
      date: "Jun 2026",
      thesis: "The fastest-growing, most AI-advantaged mega-cap, trading at a market multiple.",
      rating: "BUY",
      targetPrice: "$390 (+9%)",
      impliedValue: "",
      detail: "FY2025 revenue crossed $400bn (+15%) with ~32% operating margins, led by re-accelerating Services and Cloud (+48%). At ~27x trailing earnings Alphabet sits below Apple and Amazon despite the strongest growth profile among the mega-caps. Valuation anchored on forward earnings, cross-checked against peers.",
      fileUrl: "assets/files/alphabet-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/alphabet-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Amazon.com (AMZN) — Equity Research Note",
      sector: "Consumer",
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
      date: "Jun 2026",
      thesis: "Moat, ecosystem lock-in and services mix justify the premium — for long-term holders.",
      rating: "BUY",
      targetPrice: "$285 – $315",
      impliedValue: "",
      detail: "Full investment report covering FY2021–2025: gross margin expansion to 44.9%, stable ~30% operating margins, and a DCF scenario analysis spanning $215–$355 with a base-case fair value near $292. Twelve-month target range $285–$315.",
      fileUrl: "assets/files/apple-investment-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/apple-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Tesla, Inc. (TSLA) — Equity Research Note",
      sector: "Autos & EV",
      date: "Jun 2026",
      thesis: "Respect the optionality — but don't underwrite a trillion-dollar autonomy narrative with a spreadsheet.",
      rating: "HOLD",
      targetPrice: "",
      impliedValue: "Scenario-dependent",
      detail: "Revenue fell 3% to $94.8bn as automotive softened, partly offset by a fast-growing ~$13bn energy segment. At ~350x earnings the valuation offers no support if the autonomy timeline slips; the stock trades on execution milestones rather than fundamentals. Rated HOLD with scenario-based fair values.",
      fileUrl: "assets/files/tesla-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/tesla-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Visa Inc. (V) — Equity Research Report",
      sector: "Payments",
      date: "Jun 2026",
      thesis: "A toll-booth on the cash-to-digital shift, with ~50% net margins and a fortress model.",
      rating: "BUY",
      targetPrice: "$373 (+15%)",
      impliedValue: "",
      detail: "Net revenue of $40bn (+11%) on broad-based payments, cross-border and processed-transaction growth. Valued at 29x estimated FY2026 adjusted EPS of ~$12.85, cross-checked against EV/EBITDA of ~22x, supporting a $373 target.",
      fileUrl: "assets/files/visa-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/visa-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Coca-Cola (KO) — Equity Research Note",
      sector: "Consumer",
      date: "Jun 2026",
      thesis: "The archetypal quality defensive — pricing power does the heavy lifting; the dividend pays you to wait.",
      rating: "ACCUMULATE",
      targetPrice: "$87 (+7%)",
      impliedValue: "",
      detail: "FY2025 net revenues of $47.9bn with organic growth of 5% driven by price/mix. Valued on forward earnings against staples peers with a DCF cross-check on its stable $10–11bn free cash flow. Fairly valued for its quality — a name to build on weakness rather than chase.",
      fileUrl: "assets/files/coca-cola-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/coca-cola-business-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Hindustan Unilever (HINDUNILVR) — Investment Report",
      sector: "Consumer",
      date: "May 2026",
      thesis: "A high-quality franchise at a stretched valuation — accumulate on dips, don't chase.",
      rating: "ACCUMULATE",
      targetPrice: "₹2,500 – ₹2,800",
      impliedValue: "",
      detail: "India's largest FMCG company, reaching nine of ten Indian households across 35+ brands. Gross margins recovered to 43.9% in FY2026 while EBITDA margins compressed to 23.4%. At 41x forward earnings the stock prices in near-perfection — suggested accumulation zone ₹1,900–₹2,000.",
      fileUrl: "assets/files/hul-investment-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/hul-business-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: ""
    },
    {
      title: "Tata Consultancy Services (TCS) — Equity Research Report",
      sector: "IT Services",
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
