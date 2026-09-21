/* =====================================================================
   SourceVerdict — behaviour
   Vanilla JS, progressive enhancement. Nothing here charges a card.
   Custom services use an inquiry → scope-confirm → secure payment-link
   flow. Public cases are editorial, not products for sale.
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.SV_CONFIG || {};
  var REPORTS = window.SV_REPORTS || [];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = function (n) { return "$" + Number(n).toLocaleString("en-US"); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  /* ---------- Analytics (loads only if IDs configured) ---------- */
  var A = CFG.analytics || {};
  (function () {
    if (A.ga4Id) {
      var s = document.createElement("script");
      s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + A.ga4Id;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", A.ga4Id);
    }
    if (A.metaPixelId) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', A.metaPixelId); window.fbq('track', 'PageView');
      /* eslint-enable */
    }
  })();
  window.svTrack = function (name, params) {
    params = params || {};
    if (window.gtag) window.gtag("event", name, params);
    if (window.fbq) window.fbq("trackCustom", name, params);
    if (!A.ga4Id && !A.metaPixelId && window.console) console.debug("[svTrack]", name, params);
  };

  /* ---------- Header scroll state ---------- */
  var header = $(".site-header");
  if (header) { var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); }; onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); }

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav__toggle"), links = $(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () { var open = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", open ? "true" : "false"); });
    $$(".nav__links a").forEach(function (a) { a.addEventListener("click", function () { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && links.classList.contains("open")) { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus(); } });
  }

  /* ---------- Reveal on scroll ---------- */
  function observeReveals() {
    var reveals = $$(".reveal:not(.in)");
    if (reveals.length && "IntersectionObserver" in window && !reduce) {
      var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      reveals.forEach(function (el) { io.observe(el); });
    } else { reveals.forEach(function (el) { el.classList.add("in"); }); }
  }

  /* ---------- Verdict / example gallery ---------- */
  (function () {
    var track = $(".gallery__track"); if (!track) return;
    var step = function () { var f = track.querySelector("figure"); return f ? f.getBoundingClientRect().width + 16 : 300; };
    var prev = $(".gallery__nav [data-dir='prev']"), next = $(".gallery__nav [data-dir='next']");
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  })();

  /* ---------- CTA tracking ---------- */
  $$("[data-sample-download]").forEach(function (a) { a.addEventListener("click", function () { window.svTrack("sample_report_download"); }); });
  $$("[data-full-report]").forEach(function (a) { a.addEventListener("click", function () { window.svTrack("full_report_clicked"); }); });
  $$("[data-order]").forEach(function (a) { a.addEventListener("click", function () { window.svTrack("order_cta_clicked", { offer: a.getAttribute("data-order") }); }); });

  /* ---------- Payment link lookup (custom services only) ---------- */
  function stripeLink(ref) { return (ref && CFG.stripe && CFG.stripe.paymentLinks && CFG.stripe.paymentLinks[ref]) || ""; }

  /* =====================================================================
     SAMPLE & CASES  — free sample + editorial public cases (not for sale)
     ===================================================================== */
  function catalogCard(r) {
    if (r.status === "unpublished") return "";
    var meta = [r.caseNumber && r.caseNumber !== "—" ? r.caseNumber : "", r.country, r.channel, r.researchDate].filter(Boolean)
      .map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
    var href = r.href || ("report.html?id=" + r.id);
    var isSample = r.status === "sample";
    var thumb = (r.previews && r.previews[0]) ? r.previews[0].img : "assets/img/watch-hero.png";
    var badge = isSample ? '<span class="badge badge--sample">Free sample</span>' : '<span class="badge badge--soon">Case study</span>';
    var cta = isSample
      ? '<a class="btn btn--blue" href="' + esc(href) + '" data-full-report>View the sample</a>'
      : '<a class="btn btn--outline" href="' + esc(href) + '">Read the case</a>';
    return '<article class="report-card">' +
      '<a class="report-card__thumb" href="' + esc(href) + '">' + badge + '<img src="' + esc(thumb) + '" alt="' + esc(r.title) + ' preview" loading="lazy"></a>' +
      '<div class="report-card__body"><div class="report-card__title">' + esc(r.title) + '</div>' +
      '<div class="report-card__meta">' + meta + '</div>' + cta + '</div></article>';
  }
  function renderCatalog() {
    var grid = $("#catalog-grid"); if (!grid) return;
    var list = REPORTS.filter(function (r) { return r.status !== "unpublished"; });
    grid.innerHTML = list.map(catalogCard).join("");
    var count = $("#catalog-count");
    if (count) {
      var cases = list.filter(function (r) { return r.status !== "sample"; }).length;
      count.textContent = cases ? ("Free sample + " + cases + " public case stud" + (cases === 1 ? "y" : "ies")) : "Free sample available";
    }
  }

  /* ---------- Case / sample detail (report.html?id=) ---------- */
  function renderReportDetail() {
    var root = $("#report-detail"); if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    var r = REPORTS.find(function (x) { return x.id === id; });
    document.title = (r ? r.title : "Case study") + " — SourceVerdict";
    var customBlock = '<div class="mt-3 callout"><h2 class="h3">Have a product in mind?</h2><p class="muted mt-1">Submit your product photo and purchase link — we’ll investigate the exact product you want to sell.</p><div class="btn-row mt-2"><a class="btn btn--primary" href="submit.html">Submit your product</a><a class="btn btn--outline" href="sample-report.html" data-full-report>View the free sample</a></div></div>';
    if (!r) {
      root.innerHTML = '<div class="soon-panel"><h1 class="h2">Case not found</h1><p class="muted mt-1">That page isn’t published. Start with our free sample, or submit your own product for a personalized investigation.</p><div class="btn-row mt-2" style="justify-content:center"><a class="btn btn--blue" href="sample-report.html" data-full-report>View the free sample</a><a class="btn btn--outline" href="submit.html">Submit your product</a></div></div>';
      window.svTrack("case_not_found", { id: id || "" });
      return;
    }
    var facts = [["Case", r.caseNumber], ["Country", r.country], ["Channel", r.channel], ["Research date", r.researchDate || ""], ["Version", r.version || ""]]
      .filter(function (f) { return f[1] && f[1] !== "—"; })
      .map(function (f) { return '<li><div class="k">' + esc(f[0]) + '</div><div class="v">' + esc(f[1]) + "</div></li>"; }).join("");
    var previews = (r.previews && r.previews.length)
      ? '<div class="preview-panels">' + r.previews.map(function (p) { return '<figure><img src="' + esc(p.img) + '" alt="' + esc(p.caption) + '" loading="lazy"><figcaption>' + esc(p.caption) + "</figcaption></figure>"; }).join("") + "</div>"
      : "";
    var included = (r.included && r.included.length) ? '<ul class="deliverables">' + r.included.map(function (i) { return '<li><span class="tick" aria-hidden="true">✓</span><span>' + esc(i) + "</span></li>"; }).join("") + "</ul>" : "";
    var action = r.status === "sample"
      ? '<a class="btn btn--blue btn--lg" href="' + esc(r.href || "sample-report.html") + '" data-full-report>View the full sample</a>'
      : '<a class="btn btn--primary btn--lg" href="submit.html">Submit your product</a>';
    var verdictBlock = r.verdict ? '<p class="note"><strong>' + esc(r.verdict) + '</strong> — ' + esc(r.verdictNote || "") + "</p>" : "";
    root.innerHTML =
      '<div class="report-hero">' +
        '<div>' + previews + "</div>" +
        '<div><span class="eyebrow">' + esc(r.status === "sample" ? "Free sample" : "Worked example") + (r.caseNumber && r.caseNumber !== "—" ? " · " + esc(r.caseNumber) : "") + "</span>" +
        '<h1 class="h1 mt-1">' + esc(r.title) + "</h1>" +
        '<p class="lead mt-1">' + esc(r.product) + "</p>" +
        (r.decisionAssessed ? '<p class="mt-1"><strong>Decision assessed:</strong> ' + esc(r.decisionAssessed) + "</p>" : "") +
        (facts ? '<ul class="report-facts">' + facts + "</ul>" : "") +
        '<div class="mt-2">' + action + "</div>" + verdictBlock + "</div>" +
      "</div>" +
      (included ? '<div class="mt-3"><h2 class="h3">What this example covers</h2>' + included + "</div>" : "") +
      (r.limits ? '<div class="mt-2"><h2 class="h3">Evidence &amp; limits</h2><p class="note mt-1">' + esc(r.limits) + "</p></div>" : "") +
      customBlock;
    window.svTrack("case_view", { id: r.id, status: r.status });
    observeReveals();
  }

  /* =====================================================================
     FORMS — real submission only. With no endpoint we open an honest
     email DRAFT (not "received"); the image is not auto-attached.
     ===================================================================== */
  function genericLeadForm(form, opts) {
    var statusEl = $(".form-status", form) || $(".form-status");
    var hasEndpoint = !!opts.endpoint();
    function setError(el, on) { var w = el.closest(".field") || el.parentNode; w.classList.toggle("invalid", !!on); }
    function valid(el) { return el.type === "email" ? /.+@.+\..+/.test(el.value.trim()) : el.value.trim() !== ""; }
    $$("[data-required]", form).forEach(function (el) { el.addEventListener("blur", function () { setError(el, !valid(el)); }); });
    var started = false;
    form.addEventListener("focusin", function () { if (!started) { started = true; window.svTrack(opts.eventPrefix + "_started"); } });

    // Honest button label when there is no server endpoint
    var submitBtn = $('[type="submit"]', form);
    if (submitBtn && !hasEndpoint) { submitBtn.dataset.label = submitBtn.textContent; submitBtn.textContent = "Open email draft"; }

    // file UX
    var fileInput = $('input[type="file"]', form), drop = $(".file-drop", form), fileName = $(".file-name", form);
    if (drop && fileInput) {
      drop.addEventListener("click", function () { fileInput.click(); });
      drop.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); } });
      ["dragover", "dragenter"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("drag"); }); });
      ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("drag"); }); });
      drop.addEventListener("drop", function (e) { if (e.dataTransfer.files.length) { fileInput.files = e.dataTransfer.files; showFile(); } });
      fileInput.addEventListener("change", showFile);
    }
    function showFile() {
      var f = fileInput.files[0]; if (!f) { fileName.textContent = ""; return; }
      var max = (CFG.forms.maxUploadMB || 10);
      if (f.size > max * 1024 * 1024) { fileName.textContent = "That file is over " + max + " MB — choose a smaller image."; fileName.style.color = "#c62828"; fileInput.value = ""; return; }
      fileName.style.color = ""; fileName.textContent = "Selected: " + f.name;
    }

    function status(kind, msg) { statusEl.className = "form-status " + kind; statusEl.innerHTML = msg; statusEl.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      $$("[data-required]", form).forEach(function (el) { var v = valid(el); setError(el, !v); if (!v) { ok = false; firstBad = firstBad || el; } });
      $$("[data-required-group]", form).forEach(function (g) { var has = g.querySelector("input:checked"); g.classList.toggle("invalid", !has); if (!has) { ok = false; firstBad = firstBad || g.querySelector("input"); } });
      if (!ok) { if (firstBad && firstBad.focus) firstBad.focus(); status("err", "Please complete the highlighted fields."); return; }

      var endpoint = opts.endpoint();
      var btn = $('[type="submit"]', form);
      var payLink = opts.payLink ? opts.payLink(form) : "";

      // No server endpoint → open an HONEST email draft. Not delivery.
      if (!endpoint) {
        var to = CFG.forms.fallbackEmail || "hello@sourceverdict.net";
        window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(opts.subject(form)) + "&body=" + encodeURIComponent(opts.summary(form));
        status("ok", "<strong>Your email draft is ready.</strong> Attach your product photo and send the email to submit your request. Nothing is uploaded or received until you send it.");
        window.svTrack(opts.eventPrefix + "_draft", { path: "mailto" });
        return;
      }

      // Real endpoint → only confirm after server acknowledgement.
      btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) { if (!res.ok) throw new Error("bad"); form.reset(); if (fileName) fileName.textContent = ""; status("ok", opts.successMsg(form, payLink)); window.svTrack(opts.eventPrefix + "_completed", { path: "endpoint" }); })
        .catch(function () { status("err", "Something went wrong sending that. Please email <a href='mailto:" + (CFG.forms.fallbackEmail) + "'>" + (CFG.forms.fallbackEmail) + "</a> and we’ll take it from there."); })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  /* ---------- Custom research order (submit.html) ---------- */
  function initOrderForm() {
    var form = $("#order-form"); if (!form) return;
    var params = new URLSearchParams(location.search);
    var tier = params.get("tier");
    if (tier) { var t = form.querySelector('input[name="tier"][value="' + tier + '"]'); if (t) t.checked = true; }
    $$(".radio-card[data-tier]", form).forEach(function (card) {
      var key = card.getAttribute("data-tier"), o = CFG.offers[key];
      var pr = card.querySelector(".rc-price"); if (pr && o) pr.textContent = o.priceLabel;
    });
    // Retired: old report-pack links. Explain rather than silently reinterpret.
    if (params.get("intent") === "pack") {
      var banner = $("#order-context");
      if (banner) { banner.style.display = "block"; banner.innerHTML = "<strong>Report packs are no longer offered.</strong> Tell us the product you want to sell and we’ll investigate it as a custom request — choose a service below."; }
      window.svTrack("legacy_pack_link");
    }
    genericLeadForm(form, {
      eventPrefix: "custom_order",
      endpoint: function () { return CFG.forms.customEndpoint; },
      subject: function (f) { var t = (f.querySelector('input[name="tier"]:checked') || {}).value || "custom"; return "Product investigation request — " + t; },
      payLink: function (f) { var t = (f.querySelector('input[name="tier"]:checked') || {}).value; return stripeLink(t); },
      successMsg: function (f, pay) {
        var base = "Request received. We’ll confirm the scope and send a secure payment link before any work begins.";
        if (pay) base += ' <a class="btn btn--primary" style="margin-top:10px" href="' + esc(pay) + '">Continue to secure payment →</a>';
        return base;
      },
      summary: function (f) {
        var g = function (n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value : ""; };
        var chk = function (n) { var el = f.querySelector('[name="' + n + '"]'); return el && el.checked ? "yes" : "no"; };
        return [
          "Service: " + ((f.querySelector('input[name="tier"]:checked') || {}).value || ""),
          "Name: " + g("name"),
          "Email: " + g("email"),
          "Product description: " + g("product"),
          "Purchase / supplier link: " + g("product_link"),
          "Business based in: " + g("business_country"),
          "Plan to sell in: " + g("sell_market"),
          "Import destination (if different): " + g("import_destination"),
          "Channel: " + g("channel"),
          "Target customer / use: " + g("customer"),
          "Approx. budget: " + g("budget") + " " + g("currency"),
          "Starting quantity: " + g("quantity"),
          "Preferred approach: " + g("approach"),
          "Decision needed: " + g("decision"),
          "Marketing consent: " + chk("marketing_consent")
        ].join("\n");
      }
    });
  }

  /* ---------- Supplier validation & negotiation inquiry ---------- */
  function initSupplierForm() {
    var form = $("#supplier-form"); if (!form) return;
    genericLeadForm(form, {
      eventPrefix: "supplier_inquiry",
      endpoint: function () { return CFG.forms.supplierEndpoint; },
      subject: function () { return "Supplier validation & negotiation inquiry"; },
      successMsg: function () { return "Inquiry received. We’ll reply with a written scope and quote (from " + money(CFG.offers.supplier.price) + "). Samples, testing, inspection, freight and goods are quoted separately."; },
      summary: function (f) {
        var g = function (n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value : ""; };
        var needs = $$('input[name="needs"]:checked', f).map(function (i) { return i.value; }).join(", ");
        return ["Name: " + g("name"), "Email: " + g("email"), "Company: " + g("company"), "Product: " + g("product"), "Target market: " + g("country"), "Channel: " + g("channel"), "Target quantity: " + g("quantity"), "Needs: " + needs, "Budget range: " + g("budget"), "Timeline: " + g("timeline"), "Notes: " + g("notes")].join("\n");
      }
    });
  }

  /* ---------- Partner module (INACTIVE unless real approved data) ---------- */
  function renderPartner() {
    var el = $("#partner-module"); if (!el) return;
    var p = CFG.partner || {};
    if (!p.active || !(p.items && p.items.length)) { el.classList.remove("is-active"); el.innerHTML = ""; return; }
    el.classList.add("is-active");
    el.innerHTML = '<div class="container"><span class="eyebrow">Partner resources</span><div class="grid-cards cols-3 mt-2">' +
      p.items.filter(function (i) { return i.status === "approved"; }).map(function (i) {
        return '<div class="card"><h3>' + esc(i.provider) + "</h3><p class='mt-1'>" + esc(i.benefit) + "</p><p class='muted' style='font-size:.82rem;margin-top:8px'>" + esc(i.disclosure || "") + "</p>" + (i.trackingUrl ? '<a class="btn btn--outline mt-2" href="' + esc(i.trackingUrl) + '" rel="nofollow sponsored">Learn more</a>' : "") + "</div>";
      }).join("") + "</div></div>";
  }

  /* ---------- Owner-only: missing-config report (console, not UI) ---------- */
  function reportMissingConfig() {
    if (!window.console) return;
    var miss = [];
    if (!CFG.forms.customEndpoint) miss.push("forms.customEndpoint → custom intake opens an email draft (not auto-sent; image not attached)");
    if (!CFG.forms.supplierEndpoint) miss.push("forms.supplierEndpoint → supplier inquiry opens an email draft");
    if (!Object.keys((CFG.stripe && CFG.stripe.paymentLinks) || {}).length) miss.push("stripe.paymentLinks → screen/full are not directly payable; flow is scope-confirm → payment link");
    if (!A.ga4Id && !A.metaPixelId) miss.push("analytics ids → tracking disabled");
    console.info("%c[SourceVerdict] launch config", "font-weight:bold;color:#244BEB", miss);
  }

  /* ---------- Retire obsolete pack session state ---------- */
  try { sessionStorage.removeItem("sv_pack"); sessionStorage.removeItem("sv_pack_size"); } catch (e) { }

  /* ---------- Boot ---------- */
  observeReveals();
  renderCatalog();
  renderReportDetail();
  initOrderForm();
  initSupplierForm();
  renderPartner();
  reportMissingConfig();
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
