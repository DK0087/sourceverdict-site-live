/* =====================================================================
   SourceVerdict — sample & public cases (data-driven, editorial)
   These are NOT products for sale. There is one free sample; public
   cases demonstrate our method. Paid work is prepared for the product
   a customer submits (see submit.html).
   status: "sample" (the free sample) | "case" (published editorial case)
           | "unpublished" (hidden). Never invent cases to fill a grid;
           add a record only when real editorial content exists.
   ===================================================================== */
window.SV_REPORTS = [
  {
    id: "wooden-watch",
    caseNumber: "SV-001",
    title: "Printed wooden wristwatch",
    product: "A printed wooden wristwatch sourced from an overseas marketplace listing.",
    decisionAssessed: "Sell the catalog design as sourced, or improve it before ordering?",
    country: "US + Canada",
    channel: "Amazon / DTC",
    researchDate: "2026-09-17",
    version: "1.0",
    status: "sample",
    verdict: "GO",
    verdictNote: "GO for a small custom pilot — not a GO for committing inventory. Shown as an example of our reasoning and its limits.",
    href: "sample-report.html",
    previews: [
      { img: "assets/img/verdict/03-market-snapshot.png", caption: "Market snapshot — the same image appears across Alibaba & AliExpress" },
      { img: "assets/img/verdict/04-what-customers-hate.png", caption: "Customer complaints from comparable products" },
      { img: "assets/img/verdict/09-verdict.png", caption: "A possible next step, with its limits stated" }
    ],
    included: [
      "The product and the decision being assessed",
      "Market snapshot and competitor context",
      "Customer-complaint themes from comparable products",
      "Commercial reality — costs before profit",
      "An optional improvement concept",
      "A reasoned next step, with limits"
    ],
    limits: "An earlier worked example on public-source evidence, dated to the research date. Complaint examples are individual reports about comparable products, not measured defect rates. New full reports also include a structured comparison of launch options and financial consultation."
  }
];
