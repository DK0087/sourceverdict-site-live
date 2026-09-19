/* =====================================================================
   SourceVerdict — report catalog (data-driven records)
   Production target: 1 complete sample + 10 paid titles.
   RULES enforced by the UI (see main.js `reportBuyable`):
     - A queue entry is NOT an available product.
     - A purchase button appears ONLY when status==="available" AND a
       Stripe link exists (config.stripe.paymentLinks[checkoutRef]) AND
       a delivery method exists (record.deliveryRef or config.delivery).
     - Never invent previews, findings, prices or download assets.
     - A GO for a sample/pilot is NOT a GO for inventory.
     - Do not sell a document that is freely available.
   status: "sample" | "available" | "coming-soon" | "unpublished"
   ===================================================================== */
window.SV_REPORTS = [
  {
    id: "wooden-watch",
    caseNumber: "SV-001",
    title: "Printed wooden wristwatch",
    product: "A printed wooden wristwatch sourced from an overseas marketplace listing.",
    decisionAssessed: "Order the catalog design unchanged, or negotiate a small custom pilot?",
    country: "US + Canada",
    channel: "Amazon / DTC",
    researchDate: "2026-09-17",
    version: "1.0",
    status: "sample",
    price: 0,
    verdict: "GO",
    verdictNote: "GO for a small custom pilot — not a GO for committing inventory.",
    href: "sample-report.html",
    freelyAvailable: true,          // the online sample is free to read
    checkoutRef: "",                // free — no checkout
    deliveryRef: "view",            // delivered by reading it on the page
    previews: [
      { img: "assets/img/verdict/03-market-snapshot.png", caption: "Market snapshot — the same image appears across Alibaba & AliExpress" },
      { img: "assets/img/verdict/04-what-customers-hate.png", caption: "Customer complaints from comparable products" },
      { img: "assets/img/verdict/09-verdict.png", caption: "The verdict — GO for a small custom pilot" }
    ],
    included: [
      "The product and the exact decision being assessed",
      "Market snapshot and competitor context",
      "Customer-complaint themes from comparable products",
      "Commercial reality — costs before profit",
      "A Make It Sellable redesign concept",
      "A clear GO / PASS with reasoning"
    ],
    limits: "Public-source evidence, dated to the research date. Complaint examples are individual reports about comparable products, not measured defect rates. Supplier currency and full landed cost were unconfirmed. A GO for a pilot is not a GO for inventory."
  },

  /* --- Queue: clearly-marked coming soon. No previews/prices/downloads
         are invented. Replace with real finished records to publish. --- */
  { id: "queue-1", caseNumber: "—", title: "Case report in research", product: "Announced on publish.", country: "TBA", channel: "TBA", researchDate: null, version: null, status: "coming-soon", price: null, verdict: null, previews: [], included: [], limits: "", checkoutRef: "", deliveryRef: "" },
  { id: "queue-2", caseNumber: "—", title: "Case report in research", product: "Announced on publish.", country: "TBA", channel: "TBA", researchDate: null, version: null, status: "coming-soon", price: null, verdict: null, previews: [], included: [], limits: "", checkoutRef: "", deliveryRef: "" },
  { id: "queue-3", caseNumber: "—", title: "Case report in research", product: "Announced on publish.", country: "TBA", channel: "TBA", researchDate: null, version: null, status: "coming-soon", price: null, verdict: null, previews: [], included: [], limits: "", checkoutRef: "", deliveryRef: "" }
];
