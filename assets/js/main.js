/* =====================================================================
   SourceVerdict — behaviour
   Vanilla JS, progressive enhancement. Nothing here charges a card.
   Purchase appears only when a real Stripe link + delivery exist.
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.SV_CONFIG || {};
  var REPORTS = window.SV_REPORTS || [];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var money = function (n) { return "$" + Number(n).toLocaleString("en-US"); };

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

  /* ---------- Verdict gallery ---------- */
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

  /* =====================================================================
     AVAILABILITY  — a report is buyable only with a real Stripe link +
     a delivery method, and never if it is freely available.
     ===================================================================== */
  function stripeLink(ref) { return (ref && CFG.stripe && CFG.stripe.paymentLinks && CFG.stripe.paymentLinks[ref]) || ""; }
  function hasDelivery(r) { return !!(r.deliveryRef || (CFG.delivery && CFG.delivery.method)); }
  function reportBuyable(r) { return r.status === "available" && r.price > 0 && !!stripeLink(r.checkoutRef || r.id) && hasDelivery(r) && !r.freelyAvailable; }
  function availableReports() { return REPORTS.filter(reportBuyable); }
  window.SV = { reportBuyable: reportBuyable, availableReports: availableReports, stripeLink: stripeLink };

  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); };

  /* ---------- Catalog (reports.html) ---------- */
  function catalogCard(r) {
    var meta = [r.caseNumber && r.caseNumber !== "—" ? r.caseNumber : "", r.country, r.channel, r.researchDate].filter(Boolean)
      .map(function (m) { return "<span>" + esc(m) + "</span>"; }).join("");
    if (r.status === "sample") {
      var thumb = r.previews[0] ? r.previews[0].img : "assets/img/watch-hero.png";
      return '<article class="report-card">' +
        '<a class="report-card__thumb" href="' + esc(r.href || ("report.html?id=" + r.id)) + '"><span class="badge badge--sample">Free sample</span><img src="' + esc(thumb) + '" alt="' + esc(r.title) + ' preview" loading="lazy"></a>' +
        '<div class="report-card__body"><div class="report-card__title">' + esc(r.title) + '</div>' +
        '<div class="report-card__meta">' + meta + '</div>' +
        '<a class="btn btn--blue" href="' + esc(r.href || ("report.html?id=" + r.id)) + '" data-full-report>View the sample</a></div></article>';
    }
    if (reportBuyable(r)) {
      var link = stripeLink(r.checkoutRef || r.id);
      return '<article class="report-card">' +
        '<a class="report-card__thumb" href="report.html?id=' + esc(r.id) + '"><span class="badge badge--available">Available</span>' + (r.verdict ? '<span class="badge badge--' + esc(r.verdict.toLowerCase()) + '" style="left:auto;right:12px">' + esc(r.verdict) + '</span>' : "") + '<img src="' + esc(r.previews[0] ? r.previews[0].img : "assets/img/og-image.png") + '" alt="' + esc(r.title) + ' preview" loading="lazy"></a>' +
        '<div class="report-card__body"><div class="report-card__title">' + esc(r.title) + '</div><div class="report-card__meta">' + meta + '</div>' +
        '<a class="btn btn--outline" href="report.html?id=' + esc(r.id) + '">Details</a>' +
        '<a class="btn btn--primary" href="' + esc(link) + '" data-buy="' + esc(r.id) + '">Buy this report — ' + money(r.price) + '</a></div></article>';
    }
    if (r.status === "coming-soon") {
      return '<article class="report-card report-card--soon"><div class="report-card__thumb">Coming soon</div>' +
        '<div class="report-card__body"><div class="report-card__title">' + esc(r.title) + '</div>' +
        '<div class="report-card__meta"><span>In research</span></div>' +
        '<p class="muted" style="font-size:.9rem;margin-top:6px">' + esc(r.product) + '</p></div></article>';
    }
    return ""; // unpublished
  }
  function renderCatalog() {
    var grid = $("#catalog-grid"); if (!grid) return;
    grid.innerHTML = REPORTS.map(catalogCard).join("");
    var avail = availableReports().length;
    var count = $("#catalog-count"); if (count) count.textContent = avail === 0 ? "1 free sample available · paid case reports in research" : (avail + " report" + (avail === 1 ? "" : "s") + " available");
    renderPack();
    $$('[data-buy]', grid).forEach(function (b) { b.addEventListener("click", function () { window.svTrack("buy_report_clicked", { id: b.getAttribute("data-buy") }); }); });
  }

  /* ---------- Report detail (report.html?id=) ---------- */
  function renderReportDetail() {
    var root = $("#report-detail"); if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    var r = REPORTS.find(function (x) { return x.id === id; });
    document.title = (r ? r.title : "Report") + " — SourceVerdict";
    if (!r) {
      root.innerHTML = '<div class="soon-panel"><h1 class="h2">Report not found</h1><p class="muted mt-1">That report isn’t published. Browse the catalog or order research on your own product.</p><div class="btn-row mt-2" style="justify-content:center"><a class="btn btn--blue" href="reports.html">Browse reports</a><a class="btn btn--outline" href="submit.html">Order custom research</a></div></div>';
      return;
    }
    if (r.status === "sample" && r.href && r.href !== location.pathname.split("/").pop()) {
      // sample has a dedicated rich page
    }
    var facts = [["Case", r.caseNumber], ["Country", r.country], ["Channel", r.channel], ["Research date", r.researchDate || "—"], ["Version", r.version || "—"], ["Status", r.status]]
      .map(function (f) { return '<li><div class="k">' + esc(f[0]) + '</div><div class="v">' + esc(f[1]) + "</div></li>"; }).join("");
    var previews = (r.previews && r.previews.length)
      ? '<div class="preview-panels">' + r.previews.map(function (p) { return '<figure><img src="' + esc(p.img) + '" alt="' + esc(p.caption) + '" loading="lazy"><figcaption>' + esc(p.caption) + "</figcaption></figure>"; }).join("") + "</div>"
      : '<p class="note">Preview panels are published with the finished report.</p>';
    var included = (r.included && r.included.length) ? '<ul class="deliverables">' + r.included.map(function (i) { return '<li><span class="tick" aria-hidden="true">✓</span><span>' + esc(i) + "</span></li>"; }).join("") + "</ul>" : "";
    var buyable = reportBuyable(r);
    var action;
    if (r.status === "sample") action = '<a class="btn btn--blue btn--lg" href="' + esc(r.href) + '" data-full-report>View the sample</a>';
    else if (buyable) action = '<a class="btn btn--primary btn--lg" href="' + esc(stripeLink(r.checkoutRef || r.id)) + '" data-buy="' + esc(r.id) + '">Buy this report — ' + money(r.price) + '</a>';
    else action = '<div class="avail-note">This report isn’t on sale yet. Want this exact decision now? Order custom research below.</div>';
    var verdictBlock = r.verdict ? '<p class="note"><strong>' + esc(r.verdict) + '</strong> — ' + esc(r.verdictNote || "") + "</p>" : "";
    root.innerHTML =
      '<div class="report-hero">' +
        '<div>' + previews + "</div>" +
        '<div><span class="eyebrow">' + esc(r.caseNumber) + " · Case report</span>" +
        '<h1 class="h1 mt-1">' + esc(r.title) + "</h1>" +
        '<p class="lead mt-1">' + esc(r.product) + "</p>" +
        '<p class="mt-1"><strong>Decision assessed:</strong> ' + esc(r.decisionAssessed) + "</p>" +
        '<ul class="report-facts">' + facts + "</ul>" +
        '<div class="mt-2">' + action + "</div>" + verdictBlock + "</div>" +
      "</div>" +
      (included ? '<div class="mt-3"><h2 class="h3">What’s included</h2>' + included + "</div>" : "") +
      (r.limits ? '<div class="mt-2"><h2 class="h3">Evidence &amp; limits</h2><p class="note mt-1">' + esc(r.limits) + "</p></div>" : "") +
      '<div class="mt-3 callout"><h2 class="h3">Have another product in mind?</h2><p class="muted mt-1">Order research on your own product — a Custom Screen or a Full Decision Report.</p><div class="btn-row mt-2"><a class="btn btn--blue" href="submit.html">Order custom research</a><a class="btn btn--outline" href="reports.html">Back to catalog</a></div></div>';
    window.svTrack("report_view", { id: r.id, status: r.status });
    observeReveals();
  }

  /* ---------- Pack selector (reports.html #pack) ---------- */
  function renderPack() {
    var wrap = $("#pack"); if (!wrap) return;
    var avail = availableReports();
    if (avail.length < 3) {
      wrap.innerHTML = '<div class="soon-panel"><span class="badge badge--soon">Packs</span><h3 class="h3 mt-1">Report packs unlock at 3+ reports</h3><p class="muted mt-1">Buy any 3 for ' + money(CFG.packs.three.price) + ' or 5 for ' + money(CFG.packs.five.price) + ' once more case reports are published. Need a specific product now?</p><div class="btn-row mt-2" style="justify-content:center"><a class="btn btn--blue" href="submit.html">Order custom research</a></div></div>';
      return;
    }
    // Real selector (active once >=3 reports exist)
    var picks = new Set(JSON.parse(sessionStorage.getItem("sv_pack") || "[]").filter(function (id) { return avail.some(function (r) { return r.id === id; }); }));
    var packKey = sessionStorage.getItem("sv_pack_size") || "three";
    function need() { return CFG.packs[packKey].count; }
    function draw() {
      wrap.innerHTML =
        '<h3 class="h3">Build a pack</h3><p class="muted mt-1">Pick exactly ' + need() + ' distinct reports. Total is fixed by the pack — the price is never set in your browser.</p>' +
        '<div class="pack__options" role="radiogroup" aria-label="Pack size">' +
          '<label class="pack__option"><input type="radio" name="packsize" value="three"' + (packKey === "three" ? " checked" : "") + "> 3 for " + money(CFG.packs.three.price) + "</label>" +
          '<label class="pack__option"><input type="radio" name="packsize" value="five"' + (packKey === "five" ? " checked" : "") + "> 5 for " + money(CFG.packs.five.price) + "</label>" +
        "</div>" +
        '<div class="pack__picks">' + avail.map(function (r) {
          var on = picks.has(r.id);
          return '<label class="pick"><input type="checkbox" value="' + esc(r.id) + '"' + (on ? " checked" : "") + '><span>' + esc(r.title) + ' <span class="muted">· ' + esc(r.country) + "</span></span><span class=\"muted\">" + money(r.price) + "</span></label>";
        }).join("") + "</div>" +
        '<div class="pack__total"><span class="muted" id="pack-status"></span><span class="amount">' + money(CFG.packs[packKey].price) + "</span></div>" +
        '<button class="btn btn--primary btn--block mt-2" id="pack-continue" type="button">Continue with these ' + need() + "</button>" +
        '<p class="avail-note">Your selection is saved with the order; we confirm eligibility and send a secure payment link for the exact pack total.</p>';
      $$('input[name="packsize"]', wrap).forEach(function (i) { i.addEventListener("change", function () { packKey = i.value; sessionStorage.setItem("sv_pack_size", packKey); if (picks.size > need()) picks = new Set(Array.from(picks).slice(0, need())); persist(); draw(); }); });
      $$('.pack__picks input', wrap).forEach(function (c) {
        c.addEventListener("change", function () {
          if (c.checked) { if (picks.size >= need()) { c.checked = false; status(); return; } picks.add(c.value); }
          else picks.delete(c.value);
          persist(); status();
        });
      });
      $("#pack-continue", wrap).addEventListener("click", function () {
        if (picks.size !== need()) { status(); return; }
        window.svTrack("pack_selected", { size: packKey, ids: Array.from(picks) });
        location.href = "submit.html?intent=pack&size=" + packKey + "&reports=" + encodeURIComponent(Array.from(picks).join(","));
      });
      status();
    }
    function persist() { sessionStorage.setItem("sv_pack", JSON.stringify(Array.from(picks))); }
    function status() { var s = $("#pack-status", wrap); if (s) s.textContent = picks.size + " of " + need() + " selected"; var b = $("#pack-continue", wrap); if (b) b.disabled = picks.size !== need(); }
    draw();
  }

  /* =====================================================================
     FORMS — real submission only; honest confirmation; delivery is a
     separate verified process (never the success URL alone).
     ===================================================================== */
  function genericLeadForm(form, opts) {
    var statusEl = $(".form-status", form) || $(".form-status");
    function setError(el, on) { var w = el.closest(".field") || el.parentNode; w.classList.toggle("invalid", !!on); }
    function valid(el) { return el.type === "email" ? /.+@.+\..+/.test(el.value.trim()) : el.value.trim() !== ""; }
    $$("[data-required]", form).forEach(function (el) { el.addEventListener("blur", function () { setError(el, !valid(el)); }); });
    var started = false;
    form.addEventListener("focusin", function () { if (!started) { started = true; window.svTrack(opts.eventPrefix + "_started"); } });

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

    function status(kind, msg) { statusEl.className = "form-status " + kind; statusEl.innerHTML = msg; }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      $$("[data-required]", form).forEach(function (el) { var v = valid(el); setError(el, !v); if (!v) { ok = false; firstBad = firstBad || el; } });
      // radio groups marked required via [data-required-group]
      $$("[data-required-group]", form).forEach(function (g) { var has = g.querySelector("input:checked"); g.classList.toggle("invalid", !has); if (!has) { ok = false; firstBad = firstBad || g.querySelector("input"); } });
      if (!ok) { if (firstBad && firstBad.focus) firstBad.focus(); status("err", "Please complete the highlighted fields."); return; }

      var endpoint = opts.endpoint();
      var btn = $('[type="submit"]', form);
      var payLink = opts.payLink ? opts.payLink(form) : "";
      var doneMsg = opts.successMsg(form, payLink);

      if (!endpoint) {
        var to = CFG.forms.fallbackEmail || "hello@sourceverdict.com";
        var body = opts.summary(form);
        window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(opts.subject(form)) + "&body=" + encodeURIComponent(body);
        status("ok", doneMsg + " <span class='muted'>(Opening your email app — a form endpoint sends this automatically once configured.)</span>");
        window.svTrack(opts.eventPrefix + "_completed", { path: "mailto" });
        return;
      }
      btn.disabled = true; var label = btn.textContent; btn.textContent = "Sending…";
      fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) { if (!res.ok) throw new Error("bad"); form.reset(); if (fileName) fileName.textContent = ""; status("ok", doneMsg); window.svTrack(opts.eventPrefix + "_completed", { path: "endpoint" }); statusEl.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }); })
        .catch(function () { status("err", "Something went wrong sending that. Please email <a href='mailto:" + (CFG.forms.fallbackEmail) + "'>" + (CFG.forms.fallbackEmail) + "</a> and we’ll take it from there."); })
        .finally(function () { btn.disabled = false; btn.textContent = label; });
    });
  }

  /* ---------- Custom research order (submit.html) ---------- */
  function initOrderForm() {
    var form = $("#order-form"); if (!form) return;
    var params = new URLSearchParams(location.search);
    // tier preselect
    var tier = params.get("tier");
    if (tier) { var t = form.querySelector('input[name="tier"][value="' + tier + '"]'); if (t) t.checked = true; }
    // fill tier prices from config
    $$(".radio-card[data-tier]", form).forEach(function (card) {
      var key = card.getAttribute("data-tier"), o = CFG.offers[key === "full" ? "full" : "screen"];
      var pr = card.querySelector(".rc-price"); if (pr && o) pr.textContent = o.priceLabel;
    });
    // pack intent (from catalog pack selector)
    if (params.get("intent") === "pack") {
      var size = params.get("size") === "five" ? "five" : "three";
      var ids = (params.get("reports") || "").split(",").filter(Boolean);
      var banner = $("#order-context");
      if (banner) {
        banner.style.display = "block";
        var titles = ids.map(function (id) { var r = REPORTS.find(function (x) { return x.id === id; }); return r ? r.title : id; });
        banner.innerHTML = "<strong>" + CFG.packs[size].label + " — " + money(CFG.packs[size].price) + "</strong><br>Selected: " + esc(titles.join(", ") || "(choose on the reports page)") + '<input type="hidden" name="pack_size" value="' + esc(size) + '"><input type="hidden" name="pack_reports" value="' + esc(ids.join(",")) + '">';
      }
    }
    genericLeadForm(form, {
      eventPrefix: "custom_order",
      endpoint: function () { return CFG.forms.customEndpoint; },
      subject: function (f) { var t = (f.querySelector('input[name="tier"]:checked') || {}).value || "custom"; return "Custom research request — " + t; },
      payLink: function (f) { var t = (f.querySelector('input[name="tier"]:checked') || {}).value; return stripeLink(t); },
      successMsg: function (f, pay) {
        var base = "Request received. We’ll confirm the scope and send a secure payment link before any work begins.";
        if (pay) base += ' <a class="btn btn--primary" style="margin-top:10px" href="' + esc(pay) + '">Continue to secure payment →</a>';
        return base;
      },
      summary: function (f) {
        var g = function (n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value : ""; };
        return ["Tier: " + ((f.querySelector('input[name="tier"]:checked') || {}).value || ""), "Name: " + g("name"), "Email: " + g("email"), "Product link/description: " + g("product"), "Target country: " + g("country"), "Channel: " + g("channel"), "Target customer / use: " + g("customer"), "Budget / quantity: " + g("budget"), "Decision needed: " + g("decision"), "Marketing consent: " + (f.querySelector('[name="marketing_consent"]') && f.querySelector('[name="marketing_consent"]').checked ? "yes" : "no")].join("\n");
      }
    });
  }

  /* ---------- Supplier validation inquiry (supplier-validation.html) ---------- */
  function initSupplierForm() {
    var form = $("#supplier-form"); if (!form) return;
    genericLeadForm(form, {
      eventPrefix: "supplier_inquiry",
      endpoint: function () { return CFG.forms.supplierEndpoint; },
      subject: function () { return "Supplier validation inquiry"; },
      successMsg: function () { return "Inquiry received. We’ll reply with a scope and quote (from " + money(CFG.offers.supplier.price) + "). Samples, testing, inspection, freight and goods are quoted separately."; },
      summary: function (f) {
        var g = function (n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value : ""; };
        var needs = $$('input[name="needs"]:checked', f).map(function (i) { return i.value; }).join(", ");
        return ["Name: " + g("name"), "Email: " + g("email"), "Company: " + g("company"), "Product: " + g("product"), "Target country: " + g("country"), "Channel: " + g("channel"), "Target quantity: " + g("quantity"), "Needs: " + needs, "Budget range: " + g("budget"), "Timeline: " + g("timeline"), "Notes: " + g("notes")].join("\n");
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
    if (!CFG.forms.customEndpoint) miss.push("forms.customEndpoint → custom intake uses mailto fallback");
    if (!CFG.forms.supplierEndpoint) miss.push("forms.supplierEndpoint → supplier inquiry uses mailto fallback");
    if (!Object.keys((CFG.stripe && CFG.stripe.paymentLinks) || {}).length) miss.push("stripe.paymentLinks → no item is directly buyable");
    if (!(CFG.stripe && CFG.stripe.checkoutSessionEndpoint)) miss.push("stripe.checkoutSessionEndpoint → report packs cannot be charged (quote-only)");
    if (!A.ga4Id && !A.metaPixelId) miss.push("analytics ids → tracking disabled");
    miss.push("paid reports available: " + availableReports().length + " (target 10; need status:'available' + stripe link + delivery, and not freelyAvailable)");
    console.info("%c[SourceVerdict] launch config", "font-weight:bold;color:#244BEB", miss);
  }

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
