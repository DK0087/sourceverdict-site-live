/* =====================================================================
   SourceVerdict — site configuration (single source of truth)
   Edit these values; no build step required.
   Prices are USD, before applicable taxes.
   Nothing here charges a card. Live purchase requires a real Stripe
   Payment Link in `stripe.paymentLinks` AND a delivery method; until
   both exist for an item it stays inquiry-only (see main.js availability).
   ===================================================================== */
window.SV_CONFIG = {
  site: {
    name: "SourceVerdict",
    origin: "https://www.sourceverdict.net", // TODO: set live domain
    contactEmail: "hello@sourceverdict.net", // TODO: real inbox (never the owner's personal address publicly)
    currency: "USD"
  },

  /* ---------------------------------------------------------------
     THE FIVE OFFERS (do not add a sixth, memberships or subscriptions)
     `checkoutRef` maps into stripe.paymentLinks. Empty => not directly
     buyable; the offer routes to its inquiry/order flow instead.
     --------------------------------------------------------------- */
  offers: {
    sample: {
      id: "sample", order: 1, kind: "sample",
      name: "Complete Sample Report", priceLabel: "Free", price: 0,
      summary: "One complete, existing worked case — the whole thing, free to read.",
      cta: "View the sample", href: "sample-report.html", checkoutRef: ""
    },
    caseReport: {
      id: "case", order: 2, kind: "catalog",
      name: "Existing Case Report", priceLabel: "$29", price: 29,
      packs: { three: 69, five: 99 },
      summary: "Buy an already-researched report. Stated country, channel, research date and included files.",
      cta: "Browse reports", href: "reports.html", checkoutRef: "" // per-report links live on each report record
    },
    screen: {
      id: "screen", order: 3, kind: "custom",
      name: "Custom Screen", priceLabel: "$99", price: 99,
      summary: "One product, one country, one channel. Public-source demand & competition, initial scenario economics, major risks, evidence gaps and the next test to run.",
      cta: "Order a custom screen", href: "submit.html?tier=screen", checkoutRef: "screen"
    },
    full: {
      id: "full", order: 4, kind: "custom", highlight: true,
      name: "Full Decision Report", priceLabel: "$249", price: 249,
      summary: "Deeper evidence, review themes, supplier screening, an economics model, product-improvement recommendations, a Design Change Request, a supplier-message kit and a next-test plan.",
      cta: "Order a full decision report", href: "submit.html?tier=full", checkoutRef: "full"
    },
    supplier: {
      id: "supplier", order: 5, kind: "inquiry",
      name: "Supplier Validation", priceLabel: "From $750", price: 750,
      summary: "Separately scoped outreach, comparable quotations, document collection and sample coordination. Samples, testing, inspection, freight and goods cost extra.",
      cta: "Discuss supplier validation", href: "supplier-validation.html", checkoutRef: ""
    }
  },

  /* ---------------------------------------------------------------
     PACKS — existing (ready) reports only. Buyer picks exactly N
     DISTINCT available reports; the total is fixed below (never taken
     from the browser). A pack cannot be charged without backend
     enforcement of eligibility + total, so packs stay selection+quote
     until `stripe.checkoutSessionEndpoint` (a trusted backend) is set.
     --------------------------------------------------------------- */
  packs: {
    three: { count: 3, price: 69, label: "3-report pack" },
    five:  { count: 5, price: 99, label: "5-report pack" }
  },

  /* ---------------------------------------------------------------
     STRIPE — real integration only. No fictional links, keys or IDs.
     Add hosted Payment Link URLs here; a per-item link makes that item
     buyable (Stripe owns the price, so the browser never sets it).
     Packs need a trusted backend (Checkout Session) — not a Payment Link.
     --------------------------------------------------------------- */
  stripe: {
    mode: "test",                 // "test" | "live" — keep separate
    paymentLinks: {
      // screen: "https://buy.stripe.com/....",   // Custom Screen $99
      // full:   "https://buy.stripe.com/....",   // Full Decision Report $249
      // "SV-002": "https://buy.stripe.com/...."  // a finished case report by id
    },
    checkoutSessionEndpoint: ""   // trusted backend for pack totals; empty => packs are quote-only
  },

  /* ---------------------------------------------------------------
     FORMS — real submission only. Paste an endpoint (Formspree/Getform/
     your handler). Empty => honest mailto fallback so nothing is lost.
     Report DELIVERY is a separate verified process, not the success URL.
     --------------------------------------------------------------- */
  forms: {
    customEndpoint: "",           // custom research intake (screen / full)
    supplierEndpoint: "",         // supplier validation inquiry
    fallbackEmail: "hello@sourceverdict.net",
    maxUploadMB: 10
  },

  /* ---------------------------------------------------------------
     DELIVERY — how a paid report actually reaches the buyer. A report
     is only buyable when it has a delivery method here or on its record.
     "manual" = clearly-stated manual delivery for launch (allowed).
     --------------------------------------------------------------- */
  delivery: {
    method: "manual"              // "manual" | "" (none). Do NOT unlock files on the success URL alone.
  },

  /* ---------------------------------------------------------------
     ANALYTICS — placeholders only, no fake IDs. Loads only when set.
     --------------------------------------------------------------- */
  analytics: { ga4Id: "", metaPixelId: "" },

  /* ---------------------------------------------------------------
     PARTNER RESOURCES — prepared, INACTIVE by default. Renders nothing
     customer-facing until `active:true` AND real approved items exist.
     Never claim acceptance into a program; never advertise free capital,
     a guaranteed voucher, or customer financing. Faire goods are not
     Amazon-resale inventory. No Stripe Connect/Capital in checkout.
     Item schema: { status, provider, country, channel, benefit, cap,
       currency, expiry, disclosure, trackingUrl, lastReviewed }
     --------------------------------------------------------------- */
  partner: {
    active: false,
    items: []
  }
};
