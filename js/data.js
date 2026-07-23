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
    { label: "GOOGL",      value: "BUY · TP $400",           direction: "up",   sectionId: "models" },
    { label: "TCS",        value: "BUY · TP ₹2,525",         direction: "up",   sectionId: "models" },
    { label: "V",          value: "HOLD · TP $355",          direction: "flat", sectionId: "models" },
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

     MULTI-METHOD VALUATION (optional — safe to omit on any entry):
       methodologyNote: one plain-English sentence on WHY this business is
         valued the way it is (e.g. "Valued sum-of-the-parts…"). Shown in the
         detail view above the methods list.
       methods: a list of the valuation approaches used, primary first. Each:
         { method: "FCFF discounted cash flow",   // the technique
           role:   "Primary",                     // "Primary" | "Cross-check"
           detail: "one line on how it's applied here" }
       Both are ignored if absent, so existing entries render unchanged.
       See the Alphabet entry below for a worked example, and the site's
       "Valuation Methodology" section (siteData.methodology) for the
       business-type framework these choices follow.
     -------------------------------------------------------------------- */
  models: [
    {
      title: "Alphabet Inc. (GOOGL) — Equity Research Note",
      sector: "Technology",
      date: "Jun 2026",
      thesis: "The fastest-growing, most AI-advantaged mega-cap, trading at a market multiple.",
      rating: "BUY",
      targetPrice: "$400",
      impliedValue: "SOTP $398 · blended $400 · +8% vs $370",
      detail: "Now valued sum-of-the-parts as the primary anchor: Google Services at 25x net income (~$2.83tn), Cloud at 21x its revenue run-rate (~$1.79tn, growing 40–63% on a $462bn RPO backlog), Other Bets/Waymo at ~$150bn, plus ~$95bn of net cash — summing to a SOTP of ~$398. A forward P/E (~$410) and the Street (~$430) sit above, while a DCF sets a conservative floor at ~$345 as heavy 2026 capex depresses near-term FCF. Blending to a $400 target (trimmed from $410 on the SOTP), we maintain BUY. The Q1 2026 blowout (revenue +21.8%, Cloud +63%) and Buffett's ~$41bn stake support the case.",
      fileUrl: "assets/files/alphabet-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/alphabet-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      /* --- Multi-method valuation (worked example of the optional schema) --- */
      methodologyNote: "A conglomerate is best valued sum-of-the-parts — pricing Cloud as the standalone hyperscaler it is, which a blended P/E masks.",
      methods: [
        { method: "Sum-of-the-parts", role: "Primary", detail: "Services 25x NI + Cloud 21x rev + Waymo + net cash → $398" },
        { method: "Forward P/E", role: "Cross-check", detail: "30x × FY26E EPS $13.7 → $410" },
        { method: "DCF", role: "Conservative floor", detail: "heavy 2026 capex depresses near-term FCF → $345" }
      ]
    },
    {
      title: "Amazon.com (AMZN) — Equity Research Note",
      sector: "Consumer",
      date: "Jul 2026",
      thesis: "A high-margin business wearing a low-margin costume — AWS and advertising carry the value.",
      rating: "BUY",
      targetPrice: "$270",
      impliedValue: "SOTP $265 · target $270 · +9% vs $248",
      detail: "Valued sum-of-the-parts now — the blended retail multiple hides a high-margin business in a low-margin costume. AWS is the crown jewel at 15x revenue (~$1.93tn) on $128.7bn revenue and $45.6bn operating income, growing 20–24% with an AI tailwind. Advertising is ~$63bn of revenue at ~50% margin, hidden inside retail, at 8x revenue (~$0.50tn). Core retail carries a thin-margin logistics moat at 0.6x revenue (~$0.35tn). Adding ~$45bn of net cash, the parts sum to a SOTP of ~$265, supporting a $270 target (trimmed from $275 on the segment SOTP). Free cash flow is suppressed by ~$200bn of AI and logistics capex. BUY.",
      fileUrl: "assets/files/amazon-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/amazon-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "Valued sum-of-the-parts — AWS and Advertising are high-value businesses the blended retail multiple hides.",
      methods: [
        { method: "Sum-of-the-parts", role: "Primary", detail: "AWS 15x rev + Ads 8x rev + Retail 0.6x rev + net cash → $265" },
        { method: "AWS (crown jewel)", role: "Key driver", detail: "$128.7bn rev, $45.6bn op income, +20-24% → ~$1.93tn" },
        { method: "Advertising", role: "Hidden value", detail: "~$63bn rev, ~50% margin, +22% → ~$0.50tn" }
      ]
    },
    {
      title: "Apple Inc. (AAPL) — Investment Report & DCF",
      sector: "Technology",
      date: "Jul 2026",
      thesis: "Upgraded from an over-bearish REDUCE to HOLD — a DCF-only view under-priced a 40x compounder, but ~40x still leaves no margin of safety.",
      rating: "HOLD",
      targetPrice: "$302",
      impliedValue: "Blended $302 · −9% vs $333",
      detail: "Now valued on four methods, not a single DCF. A stand-alone DCF is a conservative floor that structurally under-prices a 40x quality compounder, so we weight relatives and a Services/Products SOTP more heavily and treat the DCF as a lower bound. That blend lifts fair value to $302 and upgrades Apple from an over-bearish REDUCE to HOLD — the franchise was never the problem, the single-method output was. Even so, at ~40x trailing earnings there is no margin of safety, and the Street median of ~$310 sits below the ~$333 spot. HOLD.",
      fileUrl: "assets/files/apple-investment-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/apple-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      /* --- Multi-method valuation --- */
      methodologyNote: "A DCF alone values a 40x quality compounder at ~$156 — not credible. We blend four methods and weight relatives + a Services/Products SOTP higher.",
      methods: [
        { method: "Justified P/E", role: "Primary", detail: "38x × FY26E EPS $9.30 → $353" },
        { method: "EV/EBITDA", role: "Cross-check", detail: "28x × FY26E EBITDA → $322" },
        { method: "Sum-of-the-parts (Services + Products)", role: "Cross-check", detail: "Services 13x rev + Products 5.5x rev → $244" },
        { method: "DCF", role: "Conservative floor", detail: "WACC 9.85%, g 3.5% → $156 (structurally lowballs quality)" }
      ]
    },
    {
      title: "Tesla, Inc. (TSLA) — Equity Research Note",
      sector: "Autos & EV",
      date: "Jun 2026",
      thesis: "Respect the optionality — but don't underwrite a trillion-dollar autonomy narrative with a spreadsheet.",
      rating: "HOLD",
      targetPrice: "~$389 (scenario-weighted)",
      impliedValue: "Range $117–$787 · weighted $389 vs $379",
      detail: "Valued now on scenario / real options, not a multiple. The core business — automotive at 2.2x revenue, energy at 7x, services at 4x, plus ~$36bn of net cash — is worth roughly $87 per share. Everything above that is a probability-weighted option on autonomy and Optimus: a Bear case at 32% ($117), a Base case at 46% ($387) and a Bull case at 22% ($787), which weight to ~$389 — almost exactly the price. Robotaxi is now live with no safety driver in 5+ cities. The $117–$787 range is the message: outcomes here are near-binary, so size the position to conviction, not to a spreadsheet. A conventional multiple (~375x earnings) is not meaningful. HOLD.",
      fileUrl: "assets/files/tesla-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/tesla-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "Not valued on a multiple (~375x earnings) — core-business SOTP plus a probability-weighted real option on autonomy and Optimus.",
      methods: [
        { method: "Core business SOTP", role: "Base", detail: "Auto 2.2x + Energy 7x + Services 4x + net cash → ~$87/share" },
        { method: "Autonomy/Optimus real option", role: "Swing", detail: "Bear $30 / Base $300 / Bull $700 per share of optionality" },
        { method: "Probability-weighted", role: "Primary", detail: "32/46/22 → ~$389; range $117–$787" }
      ]
    },
    {
      title: "Visa Inc. (V) — Equity Research Report",
      sector: "Payments",
      date: "Jun 2026",
      thesis: "A toll-booth on the cash-to-digital shift, with ~50% net margins and a fortress model.",
      rating: "HOLD",
      targetPrice: "$355",
      impliedValue: "Blended $355 · fairly valued vs $356",
      detail: "Downgraded BUY→HOLD on valuation, not fundamentals, after the stock ran from $324 to ~$356. Now valued three ways: a P/E against Mastercard (29x × FY26E adjusted EPS $13.09) gives $380, an EV/EBITDA read (23x) implies $340 and a DCF sets a conservative floor at $315 — blending to a $355 target, essentially in line with the current price. The wide-moat toll-booth franchise is intact, but with no margin of safety left we step to the sidelines and look to re-engage on a pullback toward the $320s.",
      fileUrl: "assets/files/visa-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/visa-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "A payments network is best valued on forward earnings vs Mastercard; EV/EBITDA and a DCF floor sit lower as they under-price the toll-booth moat.",
      methods: [
        { method: "P/E (vs Mastercard)", role: "Primary", detail: "29x × FY26E adj EPS $13.09 → $380" },
        { method: "EV/EBITDA", role: "Cross-check", detail: "23x × FY26E EBITDA → $340" },
        { method: "DCF", role: "Conservative floor", detail: "WACC 8%, term g 4% → $315" }
      ]
    },
    {
      title: "Coca-Cola (KO) — Equity Research Note",
      sector: "Consumer",
      date: "Jun 2026",
      thesis: "The archetypal quality defensive — pricing power does the heavy lifting; the dividend pays you to wait.",
      rating: "ACCUMULATE",
      targetPrice: "$85",
      impliedValue: "Blended $85 · +6% total return vs $82",
      detail: "A dividend aristocrat, now valued four ways DDM-first: a Gordon dividend discount model (Ke 7.25%, g 5%) is the primary anchor at $99, a relative P/E (27x × FY26E EPS $3.15) gives $85, an EV/EBITDA read (24x × FY26E EBITDA) implies $77 and a DCF (WACC 7%, terminal g 3%) sets a conservative floor at $59 — blending to a $85 target. That is ~4% price upside plus a 2.6% growing yield, or roughly 6% total return. The target is trimmed from $87 after the run to all-time highs; an income compounder to build on weakness rather than chase.",
      fileUrl: "assets/files/coca-cola-research-note.pdf",
      fileLabel: "Read the research note (PDF)",
      fileUrl2: "assets/files/coca-cola-business-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "A dividend aristocrat is valued DDM-first; relative multiples capture the staple premium and the DCF is a conservative floor. Rated on total return (price + yield).",
      methods: [
        { method: "Dividend discount (Gordon)", role: "Primary", detail: "Ke 7.25%, g 5% → $99" },
        { method: "P/E (relative)", role: "Cross-check", detail: "27x × FY26E EPS $3.15 → $85" },
        { method: "EV/EBITDA", role: "Cross-check", detail: "24x × FY26E EBITDA → $77" },
        { method: "DCF", role: "Conservative floor", detail: "WACC 7%, term g 3% → $59" }
      ]
    },
    {
      title: "Hindustan Unilever (HINDUNILVR) — Investment Report",
      sector: "Consumer",
      date: "Jul 2026",
      thesis: "A high-quality franchise, fairly valued — hold what you own, don't chase it here.",
      rating: "HOLD",
      targetPrice: "₹2,190",
      impliedValue: "Blended ₹2,190 · ~fair vs ₹2,140",
      detail: "India's largest FMCG company, reaching nine of ten Indian households across 35+ brands. HUL is now valued four ways: a DCF (WACC 11%, g 4.5%) at ₹712, a two-stage dividend discount model at ₹1,034, an EV/EBITDA read (30x) at ₹1,928 and a relative P/E (56.5x median) at ₹2,826 — blending to a fair value of ₹2,190. The cash-flow methods (DCF and DDM) structurally under-price HUL's quality premium; only the multiple-based methods (EV/EBITDA and P/E) capture it. Fairly valued against the ₹2,140 market price — a core defensive HOLD.",
      fileUrl: "assets/files/hul-investment-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/hul-business-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "A premium FMCG compounder: DCF and DDM under-price the quality, so we weight relative P/E and EV/EBITDA higher in the blend.",
      methods: [
        { method: "P/E (relative)", role: "Primary", detail: "56.5x median × fwd EPS → ₹2,826" },
        { method: "EV/EBITDA", role: "Cross-check", detail: "30x × FY26 EBITDA → ₹1,928" },
        { method: "Dividend discount (2-stage)", role: "Cross-check", detail: "H-model on ₹41 dividend → ₹1,034" },
        { method: "DCF", role: "Conservative floor", detail: "WACC 11%, g 4.5% → ₹712 (under-prices quality)" }
      ]
    },
    {
      title: "Tata Consultancy Services (TCS) — Equity Research Report",
      sector: "IT Services",
      date: "Jun 2026",
      thesis: "The de-rating has overshot the fundamentals — highest operating margins in four years at ~16x earnings.",
      rating: "BUY",
      targetPrice: "₹2,525",
      impliedValue: "Blended ₹2,525 · +15% vs ₹2,190",
      detail: "A three-method triangulation now anchors the valuation: an FCFF DCF (WACC 11.4%, terminal growth 5%) values the stock at ₹2,502, a peer P/E (18.5x × FY26 EPS ₹134) gives ₹2,478 and an EV/EBITDA read (13x × FY26 EBITDA) implies ₹2,681 — blending to a fair value of ₹2,525, about 15% above the ₹2,190 market price, supported by a 6.7% FY27E FCF yield. The de-rating to ~16x earnings has over-discounted AI-disruption risk for the highest-quality name in IT services.",
      fileUrl: "assets/files/tcs-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/tcs-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "IT services: a FCFF DCF anchored, cross-checked against peer P/E and EV/EBITDA, with FCF yield as support.",
      methods: [
        { method: "FCFF DCF", role: "Primary", detail: "WACC 11.4%, terminal g 5% → ₹2,502" },
        { method: "Peer P/E", role: "Cross-check", detail: "Peer-median 18.5x × FY26 EPS ₹134 → ₹2,478" },
        { method: "EV/EBITDA", role: "Cross-check", detail: "13x (de-rated) × FY26 EBITDA → ₹2,681" },
        { method: "FCF yield", role: "Support", detail: "FY27E FCFF / market cap → 6.7%" }
      ]
    },
    {
      title: "Infosys (INFY) — Equity Research Report",
      sector: "IT Services",
      date: "Jul 2026",
      thesis: "Upgraded to ACCUMULATE — the price has fallen far more than the fundamentals have.",
      rating: "ACCUMULATE",
      targetPrice: "₹1,195",
      impliedValue: "Blended ₹1,195 · +9% vs ₹1,096",
      detail: "A three-method triangulation now anchors the valuation: an FCFF DCF values the shares at ₹1,186, a peer P/E (16.8x) cross-check gives ₹1,220 and an EV/EBITDA (12x, de-rated) cross-check ₹1,217 — blending to a fair value of ₹1,195, about 9% above the ₹1,096 market price. Support from a 6.8% FCF yield plus a ~4.4% dividend yield. The de-rating has over-corrected for a high-quality IT franchise; we expect a gradual recovery.",
      fileUrl: "assets/files/infosys-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/infosys-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "IT services: a FCFF DCF anchored, cross-checked against peer P/E and EV/EBITDA, with FCF yield as support.",
      methods: [
        { method: "FCFF DCF", role: "Primary", detail: "WACC ~11.4%, terminal g 5% → ₹1,186" },
        { method: "Peer P/E", role: "Cross-check", detail: "Peer-median 16.8x × FY26 EPS ₹72.6 → ₹1,220" },
        { method: "EV/EBITDA", role: "Cross-check", detail: "12x (de-rated) × FY26 EBITDA → ₹1,217" },
        { method: "FCF yield", role: "Support", detail: "FY27E FCFF / market cap → 6.8%" }
      ]
    },
    {
      title: "HDFC Bank (HDFCBANK) — Equity Research Report",
      sector: "Banking",
      date: "Jun 2026",
      thesis: "The ROE recovery is real — and already in the price.",
      rating: "HOLD",
      targetPrice: "₹780",
      impliedValue: "Blended ₹780 · −0.7% vs ₹785",
      detail: "A four-method triangulation now anchors the valuation: residual income (excess return) values the equity at ₹737, a justified P/B on normalized ROE gives ₹754, peer P/B implies ₹894 and peer P/E ₹826 — blending to a fair value of ₹780, essentially in line with the ₹785 market price. HDFC Bank looks fairly valued; the swing factor from here is the pace of ROE recovery back toward 16% as high-cost merger-legacy borrowings run off.",
      fileUrl: "assets/files/hdfc-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/hdfc-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "Banks can't be valued with a corporate DCF — we triangulate residual income, a justified P/B from ROE, and peer P/B and P/E.",
      methods: [
        { method: "Residual income (excess return)", role: "Primary", detail: "Book value + PV of returns above cost of equity → ₹737" },
        { method: "Justified P/B (Gordon, normalized ROE)", role: "Cross-check", detail: "(ROE 16% − g)/(Ke − g) = 1.91x book → ₹754" },
        { method: "Peer P/B", role: "Cross-check", detail: "Peer-median P/B × BVPS → ₹894" },
        { method: "Peer P/E", role: "Cross-check", detail: "Peer-median P/E × EPS → ₹826" }
      ]
    },
    {
      title: "ICICI Bank (ICICIBANK) — Equity Research Report",
      sector: "Banking",
      date: "Jul 2026",
      thesis: "Superb franchise — but the price has now run ahead of it.",
      rating: "REDUCE",
      targetPrice: "₹1,136",
      impliedValue: "Blended ₹1,136 · −22% vs ₹1,460",
      detail: "India's second-largest private-sector bank and the sector's execution benchmark — FY2026 standalone PAT of ₹50,147 crore (+6.2%), a Q4 NIM expanding to 4.32%, and net NPAs of just 0.33%. But after a run to ₹1,460 (~2.8x book), a four-method triangulation — residual income (₹1,199), a justified P/B from ROE (₹1,095), peer P/B (₹1,054) and peer P/E (₹1,164) — blends to a fair value of ₹1,136, about 22% below market. Rated REDUCE on entry price, not the business; a buyer again toward ₹1,150.",
      fileUrl: "assets/files/icici-research-report.pdf",
      fileLabel: "Read the report (PDF)",
      fileUrl2: "assets/files/icici-financial-model.xlsx",
      fileLabel2: "Download the model (Excel)",
      thumbnail: "",
      methodologyNote: "Banks can't be valued with a corporate DCF — we triangulate residual income, a justified P/B from ROE, and peer P/B and P/E.",
      methods: [
        { method: "Residual income (excess return)", role: "Primary", detail: "Book value + PV of returns above cost of equity → ₹1,199" },
        { method: "Justified P/B (Gordon, ROE-driven)", role: "Cross-check", detail: "(ROE 17% − g)/(Ke − g) = 2.16x book → ₹1,095" },
        { method: "Peer P/B", role: "Cross-check", detail: "Peer-median P/B × BVPS → ₹1,054" },
        { method: "Peer P/E", role: "Cross-check", detail: "Peer-median P/E × EPS → ₹1,164" }
      ]
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
     VALUATION METHODOLOGY — the framework behind the coverage. Explains why
     different businesses are valued with different methods. Rendered as its
     own section of cards; each card opens a detail view.
       intro:      one short paragraph shown under the section title.
       approaches: one object per business archetype. Each:
         businessType — the card title (e.g. "Banks & Financials")
         examples     — covered names this applies to (mono kicker)
         primary      — the leading method
         crossChecks  — the supporting cross-checks
         avoid        — (optional) a method that is inappropriate here
         summary      — one line shown on the card
         detail       — the full explanation shown in the detail view
     If this whole block is removed, the section simply hides itself.
     -------------------------------------------------------------------- */
  methodology: {
    intro: "One method does not value every business. A bank, a software compounder, a diversified platform and a bet on autonomy earn money in fundamentally different ways, so each is valued on the approach its economics actually justify — always with two or more independent cross-checks, never a single number. The framework below shows which method leads for which kind of business, and why.",
    approaches: [
      {
        businessType: "Banks & Financials",
        examples: "HDFC Bank · ICICI Bank",
        primary: "Residual income (excess-return)",
        crossChecks: "Justified P/B vs ROE · P/E · Dividend discount",
        avoid: "Enterprise / FCFF DCF",
        summary: "For a bank, debt is raw material, not financing — so free cash flow to the firm has no clean meaning. Value the equity directly off the returns it earns above its cost of capital.",
        detail: "A bank does not have \"free cash flow to the firm\" in any usable sense: deposits and borrowings are the raw material of the business, not a financing choice sitting outside operations, and capital is tied up to meet regulatory ratios. That makes an enterprise DCF meaningless for banks. The right anchor is a residual-income (excess-return) model, which values the equity as book value plus the present value of returns earned above the cost of equity — it rewards a bank only for the ROE it generates in excess of what shareholders require. The cleanest cross-check is the justified price-to-book that a bank's sustainable ROE implies through the Gordon relationship (P/B rises with ROE and falls with cost of equity), backed by a P/E read and a dividend discount model. When ROE equals the cost of equity, fair P/B is 1.0 — a discipline no earnings multiple enforces on its own."
      },
      {
        businessType: "IT Services",
        examples: "TCS · Infosys",
        primary: "FCFF discounted cash flow",
        crossChecks: "P/E vs peers · EV/EBITDA · FCF yield",
        summary: "Asset-light, cash-generative compounders with high, predictable cash conversion — the textbook case for a discounted-cash-flow anchor, disciplined by where peers trade.",
        detail: "Large-cap IT-services firms are asset-light, throw off cash with high and stable conversion, and grow at rates that can be forecast with reasonable confidence — exactly the conditions under which a free-cash-flow-to-the-firm DCF is most reliable. The DCF carries the valuation; the debate lives in the assumptions (revenue growth, margin trajectory, and how generative AI reshapes demand), not the method. Because the two majors are close comparables, a forward P/E against peers, an EV/EBITDA cross-check and a free-cash-flow yield keep the DCF honest and flag when the market has de-rated the sector past what the fundamentals justify."
      },
      {
        businessType: "FMCG & Consumer Staples",
        examples: "Hindustan Unilever · Coca-Cola",
        primary: "DCF & dividend discount",
        crossChecks: "P/E vs staples peers · EV/EBITDA",
        summary: "Stable, dividend-rich franchises whose value is pricing power and cash returned. A DCF captures the compounding; for the highest-payout names the dividend discount model leads.",
        detail: "Consumer staples are defined by durable brands, pricing power and steady, cash-returning economics — so their value can be modelled with confidence over long horizons. A DCF captures the slow compounding, cross-checked against staples-peer P/E and EV/EBITDA. Where a business pays out most of its earnings and grows dividends predictably, the dividend discount model moves to the front: for Coca-Cola the DDM leads, because the dividend is the clearest expression of the cash the franchise actually returns, with a DCF and multiples in support. For Hindustan Unilever the DCF and peer multiples lead, with a DDM and EV/EBITDA alongside. Same family of methods, weighted to how each name creates value for shareholders."
      },
      {
        businessType: "Payments Networks",
        examples: "Visa",
        primary: "FCFF discounted cash flow",
        crossChecks: "P/E vs Mastercard · EV/EBITDA · FCF yield",
        summary: "A near-50%-margin toll booth on the cash-to-digital shift — value the cash it compounds, then sanity-check against its one true comparable.",
        detail: "A payment network is an asset-light, roughly-50%-net-margin toll booth that scales with the secular shift from cash to digital — highly predictable volumes and enormous free-cash-flow conversion make a DCF the natural anchor. The strongest cross-check is relative: a forward P/E against Mastercard, the only genuinely comparable business, plus an EV/EBITDA read and a free-cash-flow yield. The pairing matters because two near-identical duopolists should not trade far apart without a fundamental reason, so the peer multiple disciplines the DCF's growth and margin assumptions."
      },
      {
        businessType: "Diversified Technology",
        examples: "Apple · Alphabet · Amazon",
        primary: "Sum-of-the-parts (SOTP)",
        crossChecks: "DCF · P/E · segment EV/EBITDA",
        summary: "When one company houses businesses with very different growth and margins — Search vs Cloud, Products vs Services, AWS vs retail — a blended multiple hides more than it reveals. Value each part, then add them up.",
        detail: "A single consolidated multiple assumes every part of a business earns the same return — false for the diversified platforms. Alphabet's Cloud and Other Bets look nothing like Search or YouTube; Apple's high-multiple Services annuity is buried inside lower-multiple hardware; Amazon's profits come from AWS and advertising while retail runs near breakeven. Sum-of-the-parts values each segment on the growth, margin and multiple its own economics justify, then adds them — surfacing value a blended P/E conceals (Amazon's advertising and AWS, Apple's Services). A consolidated DCF, a group P/E and segment-level EV/EBITDA cross-check the pieces back to the whole. The output is both a fair value and a map of where that value actually sits."
      },
      {
        businessType: "Hyper-Growth & Optionality",
        examples: "Tesla",
        primary: "Scenario & real-options DCF",
        crossChecks: "Sum-of-the-parts (auto · energy · autonomy)",
        avoid: "Trailing multiples (not meaningful)",
        summary: "Most of the value sits in outcomes that may or may not happen. A single point estimate is false precision — the honest answer is a probability-weighted range, with comparables set aside.",
        detail: "For a company whose valuation rests on outcomes that may or may not materialise — full autonomy, robotaxi, energy at scale — a single point-estimate DCF is false precision, and a trailing P/E of several hundred times is simply not meaningful. The honest approach is a scenario / real-options DCF: model distinct futures (autonomy arrives on schedule, slips, or fails), value each, and probability-weight them into a range rather than one number. A sum-of-the-parts frames the pieces — the established automotive business, the fast-growing energy segment, and the optionality of autonomy — so the reader can see how much of the price depends on the narrative versus the cash the company generates today. Comparables are set aside as not meaningful; the discipline is being explicit about probabilities, not pretending they are known."
      }
    ]
  },

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
