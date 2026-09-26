/* =====================================================================
   SourceVerdict — sample & cases (data-driven, editorial)
   These are NOT products for sale. The free sample is the Everyday Tech
   Pouch. Wooden-watch is an editorial case (method demo). Paid $29
   "Weekly Case Report" items are added here only when a case is actually
   released with a configured price + delivery (status "available").
   status: "sample" | "case" (editorial) | "available" (released $29 case)
           | "coming-soon" | "unpublished"
   Never invent cases, previews, findings or prices.
   ===================================================================== */
window.SV_REPORTS = [
  {
    id: "everyday-tech-pouch",
    caseNumber: "Free sample",
    title: "The Everyday Tech Pouch",
    product: "A double-layer zippered tech-organizer pouch — a familiar, widely-sold product, investigated end to end.",
    decisionAssessed: "Sell it as sourced, or improve it — and how much cash does it take to test?",
    country: "US + Canada",
    channel: "Amazon",
    researchDate: "2026-09",
    version: "12-page report",
    status: "sample",
    href: "sample-report.html",
    previews: [
      { img: "assets/img/pouch/family-reference.jpg", caption: "The product we investigated (as sourced)" },
      { img: "assets/img/pouch/pouch-usa-inspired.png", caption: "Optional custom-design concept — USA (styling concept, not a supplier sample)" },
      { img: "assets/img/pouch/pouch-elegant-floral.png", caption: "Optional custom-design concept — floral (styling concept)" }
    ],
    included: [
      "As-sourced vs an optional improvement, compared",
      "Buyer-review themes and unmet needs",
      "Observed prices and a captured 100-unit checkout",
      "A modeled price test with contribution per unit",
      "A 100–500-unit sensitivity (fixed assumptions)",
      "Supplier questions and qualified launch-finance planning"
    ],
    limits: "A complete free worked example. Numbers are labelled Observed / Modeled / Next to verify. The 100–500-unit results hold unit contribution and the selected $304.98 fixed pilot cost constant — they are not sales, cash-flow or profit forecasts, and existing sellers' real margins are unknown. Concept images are AI styling concepts, not physical samples or verified supplier options."
  },
  {
    id: "wooden-watch",
    caseNumber: "Editorial case",
    title: "Printed wooden wristwatch",
    product: "A printed wooden wristwatch sourced from an overseas marketplace listing.",
    decisionAssessed: "Sell the catalog design as sourced, or improve it before ordering?",
    country: "US + Canada",
    channel: "Amazon / DTC",
    researchDate: "2026-09-17",
    version: "1.0",
    status: "case",
    verdict: "GO",
    verdictNote: "GO for a small custom pilot — not a GO for committing inventory. An example of our reasoning and its limits.",
    href: "report.html?id=wooden-watch",
    previews: [
      { img: "assets/img/verdict/03-market-snapshot.png", caption: "Market snapshot — the same image appears across Alibaba & AliExpress" },
      { img: "assets/img/verdict/04-what-customers-hate.png", caption: "Customer complaints from comparable products" },
      { img: "assets/img/verdict/09-verdict.png", caption: "A reasoned next step, with limits stated" }
    ],
    included: [
      "Market snapshot and competitor context",
      "Customer-complaint themes from comparable products",
      "Commercial reality — costs before profit",
      "An optional improvement concept",
      "A reasoned next step, with limits"
    ],
    limits: "An earlier editorial example on public-source evidence, dated to the research date. Complaint examples are individual reports about comparable products, not measured defect rates."
  }
];
