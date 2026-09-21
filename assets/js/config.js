/* =====================================================================
   SourceVerdict — site configuration (single source of truth)
   Edit these values; no build step required.
   Prices are USD, before applicable taxes.
   Nothing here charges a card. Paid services use an inquiry →
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
     THE OFFERS — one free sample + exactly THREE paid services.
     All paid work investigates the customer's SUBMITTED product(s).
     We do NOT sell premade case reports. Do not add a 4th paid offer
     or a separate finance tier (finance is inside the $249 service).
     `checkoutRef` maps into stripe.paymentLinks; empty => the offer
     routes to its inquiry/order flow (no direct checkout).
     IDs (sample/single/two/consultation) are stable — used by query
     params and records. Legacy ?tier=screen|full map to these in main.js.
     --------------------------------------------------------------- */
  offers: {
    sample: {
      id: "sample", order: 1, kind: "sample",
      name: "Complete Sample Report", priceLabel: "Free", price: 0,
      summary: "One complete worked example — free to read, so you can see how we investigate a product.",
      cta: "View free sample", href: "sample-report.html", checkoutRef: ""
    },
    single: {
      id: "single", order: 2, kind: "custom",
      name: "Single Product Report", priceLabel: "$29", price: 29,
      summary: "A focused research report on the product you want to sell: comparable products, competition and pricing, demand signals, customer-review themes, preliminary costs and margins, supplier questions, key risks and your next step. One product, one target market, one channel.",
      cta: "Investigate my product", href: "submit.html?tier=single", checkoutRef: "single"
    },
    two: {
      id: "two", order: 3, kind: "custom",
      name: "Two Product Reports", priceLabel: "$49", price: 49,
      summary: "The same research as the Single Product Report on two submitted products, plus a side-by-side comparison of costs, competition and opportunity and a recommendation on which to test first. Two products, one shared target market and channel. Saves $9 versus two separate reports.",
      cta: "Compare my two products", href: "submit.html?tier=two", checkoutRef: "two"
    },
    consultation: {
      id: "consultation", order: 4, kind: "custom", highlight: true,
      name: "Complete Business Launch Consultation", priceLabel: "$249", price: 249,
      summary: "An in-depth product investigation and personalized consultation for one selected product: competition, demand and review analysis; sell-as-sourced vs optional customization with costs and pricing scenarios; an optional design concept and supplier development brief; supplier screening and a price/small-order negotiation kit; a startup budget, cash-flow plan and business finance suggestions; and a practical launch action plan.",
      cta: "Start my complete consultation", href: "submit.html?tier=consultation", checkoutRef: "consultation"
    }
  },

  /* Legacy ?tier= values → current offer key (main.js shows a note). */
  legacyTierMap: { screen: "single", full: "consultation" },

  /* ---------------------------------------------------------------
     STRIPE — real integration only. No fictional links, keys or IDs.
     Add hosted Payment Link URLs keyed by checkoutRef (single/two/
     consultation) to enable pay-after-scope. Stripe owns the price,
     so the browser never sets it. A legacy $29 premade-case product
     is NOT the new $29 custom report — verify amount + description
     before reusing any link.
     --------------------------------------------------------------- */
  stripe: {
    mode: "test", // "test" | "live" — keep separate
    paymentLinks: {
      // single:       "https://buy.stripe.com/....",  // Single Product Report $29
      // two:          "https://buy.stripe.com/....",  // Two Product Reports $49
      // consultation: "https://buy.stripe.com/...."   // Complete Business Launch Consultation $249
    }
  },

  /* ---------------------------------------------------------------
     FORMS — real submission only. Paste an endpoint (Formspree/Getform/
     your handler). Empty => the form opens an honest email DRAFT (it is
     NOT sent automatically and images are NOT attached — see main.js).
     Report DELIVERY is a separate verified process, not the success URL.
     --------------------------------------------------------------- */
  forms: {
    customEndpoint: "",   // product research + consultation intake
    fallbackEmail: "hello@sourceverdict.net",
    maxUploadMB: 10
  },

  /* ---------------------------------------------------------------
     DELIVERY — how a paid report reaches the buyer.
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
     until `active:true` AND real approved items exist. Never advertise
     free capital, guaranteed approvals, active lender partnerships or
     specific finance-program terms without verified support. Financial
     consultation in the $249 service is SourceVerdict's own advice,
     shown independently of this module.
     --------------------------------------------------------------- */
  partner: { active: false, items: [] }
};
