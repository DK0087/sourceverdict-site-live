/* =====================================================================
   SourceVerdict — site configuration (single source of truth)
   Edit these values; no build step required.
   Prices are USD, before applicable taxes.
   Nothing here charges a card. Custom services use an inquiry →
   scope-confirm → secure payment-link flow (see main.js).
   ===================================================================== */
window.SV_CONFIG = {
  site: {
    name: "SourceVerdict",
    origin: "https://www.sourceverdict.net",
    contactEmail: "hello@sourceverdict.net", // TODO: real inbox (never the owner's personal address publicly)
    currency: "USD"
  },

  /* ---------------------------------------------------------------
     THE OFFERS — one free sample + three paid services.
     Do NOT add memberships, subscriptions, or premade reports for sale.
     `checkoutRef` maps into stripe.paymentLinks; empty => the offer
     routes to its inquiry/order flow instead (no direct checkout).
     IDs (sample/screen/full/supplier) are stable — used by query
     params and historical records. Do not rename the IDs.
     --------------------------------------------------------------- */
  offers: {
    sample: {
      id: "sample", order: 1, kind: "sample",
      name: "Complete Sample Report", priceLabel: "Free", price: 0,
      summary: "One complete, existing worked example — free to read, so you can see how we investigate a product.",
      cta: "View the sample", href: "sample-report.html", checkoutRef: ""
    },
    screen: {
      id: "screen", order: 2, kind: "custom",
      name: "Custom Product Screen", priceLabel: "$99", price: 99,
      summary: "A focused first assessment of one product, one target country and one primary channel: initial competition, demand and pricing, preliminary cost and selling-price scenarios, as-sourced potential and optional improvement ideas, key supplier questions, risks, the next test, and a brief funding-fit overview.",
      cta: "Submit your product", href: "submit.html?tier=screen", checkoutRef: "screen"
    },
    full: {
      id: "full", order: 3, kind: "custom", highlight: true,
      name: "Full Product Launch Report", priceLabel: "$249", price: 249,
      summary: "A personalized plan to source, position, price and test your product: visual-search matches and same-category competition, selling prices, estimated demand and review analysis, as-sourced vs optional custom routes with comparable economics, an optional design concept and supplier brief, a supplier screening and price/small-order negotiation kit, and a launch budget with financial consultation.",
      cta: "Get my product investigated", href: "submit.html?tier=full", checkoutRef: "full"
    },
    supplier: {
      id: "supplier", order: 4, kind: "inquiry",
      name: "Supplier Validation & Negotiation Support", priceLabel: "From $750", price: 750,
      summary: "Separately scoped supplier outreach, comparable quotations, price and pilot-order negotiations, customization discussions, document collection and sample coordination. Samples, testing, inspection, freight and goods cost extra.",
      cta: "Discuss supplier support", href: "supplier-validation.html", checkoutRef: ""
    }
  },

  /* ---------------------------------------------------------------
     STRIPE — real integration only. No fictional links, keys or IDs.
     Add hosted Payment Link URLs keyed by checkoutRef (screen / full)
     to enable pay-after-scope; Stripe owns the price, so the browser
     never sets it. Report packs and case sales have been removed.
     --------------------------------------------------------------- */
  stripe: {
    mode: "test", // "test" | "live" — keep separate
    paymentLinks: {
      // screen: "https://buy.stripe.com/....",   // Custom Product Screen $99
      // full:   "https://buy.stripe.com/...."    // Full Product Launch Report $249
    }
  },

  /* ---------------------------------------------------------------
     FORMS — real submission only. Paste an endpoint (Formspree/Getform/
     your handler). Empty => the form opens an honest email DRAFT (it is
     NOT sent automatically and the image is NOT attached — see main.js).
     Report DELIVERY is a separate verified process, not the success URL.
     --------------------------------------------------------------- */
  forms: {
    customEndpoint: "",   // custom research intake (screen / full)
    supplierEndpoint: "", // supplier validation & negotiation inquiry
    fallbackEmail: "hello@sourceverdict.net",
    maxUploadMB: 10
  },

  /* ---------------------------------------------------------------
     DELIVERY — how a paid report actually reaches the buyer.
     "manual" = clearly-stated manual delivery for launch (allowed).
     Do NOT unlock files on the success URL alone.
     --------------------------------------------------------------- */
  delivery: { method: "manual" },

  /* ---------------------------------------------------------------
     ANALYTICS — placeholders only, no fake IDs. Loads only when set.
     --------------------------------------------------------------- */
  analytics: { ga4Id: "", metaPixelId: "" },

  /* ---------------------------------------------------------------
     PARTNER RESOURCES — prepared, INACTIVE by default. Renders nothing
     customer-facing until `active:true` AND real approved items exist.
     Never claim acceptance into a program; never advertise free capital,
     a guaranteed voucher, universal Alibaba Pay Later, unverified
     Canadian availability, or automatic Stripe Capital. Financial
     consultation on the site is SourceVerdict's own advice, shown
     independently of this module.
     Item schema: { status, provider, country, channel, benefit, cap,
       currency, expiry, disclosure, trackingUrl, lastReviewed }
     --------------------------------------------------------------- */
  partner: { active: false, items: [] }
};
