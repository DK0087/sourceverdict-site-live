/* =====================================================================
   SourceVerdict — site configuration (single source of truth)
   Edit these values; no build step required.
   Prices are USD, before applicable taxes.
   Nothing here charges a card. Paid services use an inquiry →
   scope-confirm → secure payment-link flow (see main.js).
   Approved direction: 2026-09-25 (DK).
   ===================================================================== */
window.SV_CONFIG = {
  site: {
    name: "SourceVerdict",
    origin: "https://www.sourceverdict.net",
    contactEmail: "hello@sourceverdict.net", // TODO: real inbox (never the owner's personal address publicly)
    currency: "USD"
  },

  /* ---------------------------------------------------------------
     THE OFFERS — one FREE sample + exactly THREE paid offers.
       sample        Free  — Everyday Tech Pouch (email-gated report)
       case          $29   — Weekly Case Report (SourceVerdict-selected,
                             NOT personalized). One new case per week is
                             PLANNED. Show a buy button only for a released
                             case with a configured price + delivery; else
                             "Coming soon". Never charge $29 for the sample.
       personalized  $49   — Personalized Product Report: ONE customer-
                             submitted product, one market, one channel.
       consultation  $249  — Personal Launch Consultation (highlighted):
                             in-depth report + consultation + agreed supplier
                             validation + business finance suggestions.
     Retired everywhere: $49 two-product pack, $29 custom report, $99 screen,
     public "$750" supplier offer. Keep historical orders/entitlements.
     Do NOT add a 4th paid offer. IDs are stable.
     --------------------------------------------------------------- */
  offers: {
    sample: {
      id: "sample", order: 1, kind: "sample",
      name: "The Everyday Tech Pouch", priceLabel: "Free", price: 0,
      summary: "A real, complete 12-page worked example: research, as-sourced vs an optional improvement, buyer feedback, supplier questions, a 100–500-unit sensitivity, and qualified launch-finance planning. Sent to your email.",
      cta: "Get the free report", href: "sample-report.html", checkoutRef: ""
    },
    case: {
      id: "case", order: 2, kind: "catalog",
      name: "Weekly Case Report", priceLabel: "$29", price: 29,
      summary: "A researched report on one product selected and published by SourceVerdict — not personalized to you. New cases are planned weekly; each is $29 when released.",
      cta: "See the cases", href: "reports.html", checkoutRef: "" // per-case link set on each released case
    },
    personalized: {
      id: "personalized", order: 3, kind: "custom",
      name: "Personalized Product Report", priceLabel: "$49", price: 49,
      summary: "The complete written investigation of ONE product you submit — one target market, one channel: verified visual matches and same-category alternatives, observed prices and qualified demand signals, review themes and unmet needs, a fair sell-as-sourced route, an optional custom-design suggestion, preliminary sourcing/negotiation/price/contribution scenarios, risks and next tests.",
      cta: "Submit your product", href: "submit.html?tier=personalized", checkoutRef: "personalized"
    },
    consultation: {
      id: "consultation", order: 4, kind: "custom", highlight: true,
      name: "Personal Launch Consultation", priceLabel: "$249", price: 249,
      summary: "One chosen product: in-depth report plus a personal consultation. Includes agreed supplier validation (identity/listing/document checks and quote-comparability review with findings and gaps), a development and small-order negotiation plan, launch budget and cash-flow/downside assessment, and relevant business finance options by borrower country and stage. Format, timing, document checks and any contact authority are confirmed before payment.",
      cta: "Start a launch consultation", href: "submit.html?tier=consultation", checkoutRef: "consultation"
    }
  },

  /* Weekly cadence is PLANNED, not active. Flip to true only once real
     weekly case releases begin (changes homepage copy to "New case every week"). */
  caseCadenceActive: false,

  /* Legacy ?tier= values → current offer key (main.js shows a note). */
  legacyTierMap: { single: "personalized", two: "personalized", screen: "personalized", full: "consultation" },

  /* ---------------------------------------------------------------
     STRIPE — real integration only. No fictional links, keys or IDs.
     Add hosted Payment Link URLs keyed by checkoutRef (personalized /
     consultation) and per released case id. A legacy $29 product built
     for another service is NOT the new offer — verify amount + product
     before reusing any link.
     --------------------------------------------------------------- */
  stripe: {
    mode: "test",
    paymentLinks: {
      // personalized: "https://buy.stripe.com/....",  // $49
      // consultation: "https://buy.stripe.com/....",  // $249
      // "case-YYYY-WW":  "https://buy.stripe.com/...." // a released weekly case
    }
  },

  /* ---------------------------------------------------------------
     FORMS / EMAIL — real submission only.
       customEndpoint      : $49 / $249 intake (server receipt).
       sampleEmailEndpoint : free-sample email capture → server sends a
                             branded link to the interactive report on
                             sourceverdict.net (signed/expiring), which
                             offers a PDF download. NO public/guessable
                             PDF URL may bypass this. Empty => the UI is
                             honest that delivery is being set up (never
                             shows "Sent" without a real provider ack).
     Secrets/keys live ONLY in the deployment environment, never here.
     --------------------------------------------------------------- */
  forms: {
    customEndpoint: "",
    sampleEmailEndpoint: "",
    fallbackEmail: "hello@sourceverdict.net",
    maxUploadMB: 10
  },

  /* DELIVERY — manual for launch; never unlock files on a success URL alone. */
  delivery: { method: "manual" },

  /* ANALYTICS — placeholders only; loads only when set. Never log image/email content. */
  analytics: { ga4Id: "", metaPixelId: "" },

  /* PARTNER RESOURCES — INACTIVE. Finance help in the $249 service is
     SourceVerdict's own consultation, not a lender relationship. Never
     advertise guaranteed approval, free capital or specific lender terms. */
  partner: { active: false, items: [] }
};
