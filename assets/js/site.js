/* Camargos & Camargos — protótipo 2026 */
(function () {
  var d = document, w = window;
  w.dataLayer = w.dataLayer || [];

  /* Cabeçalho sólido ao rolar */
  var header = d.querySelector(".site-header");
  if (header && !header.classList.contains("solid")) {
    var onScroll = function () { header.classList.toggle("is-scrolled", w.scrollY > 40); };
    onScroll();
    w.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menu mobile */
  var toggle = d.querySelector(".nav-toggle"), nav = d.getElementById("nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (header) header.classList.toggle("is-scrolled", open || w.scrollY > 40);
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    d.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* Conversões: cliques no WhatsApp e no telefone vão para o dataLayer (GTM) */
  d.addEventListener("click", function (e) {
    var a = e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (href.indexOf("https://wa.me/") === 0) {
      w.dataLayer.push({
        event: "whatsapp_click",
        wa_origem: a.getAttribute("data-origem") || "indefinido",
        wa_assunto: a.getAttribute("data-assunto") || "geral",
        wa_numero: href.replace(/^https:\/\/wa\.me\/(\d+).*$/, "$1")
      });
    } else if (href.indexOf("tel:") === 0) {
      w.dataLayer.push({ event: "telefone_click", tel_numero: href.slice(4), tel_origem: a.getAttribute("data-origem") || "indefinido" });
    }
  });

  /* Balão do WhatsApp: aparece depois de alguns segundos, uma vez por sessão */
  var bubble = d.querySelector(".wa-bubble");
  if (bubble) {
    var seen = false;
    try { seen = sessionStorage.getItem("wa-bubble") === "1"; } catch (err) {}
    if (!seen) {
      setTimeout(function () { bubble.classList.add("show"); }, 7000);
    }
    var close = bubble.querySelector("button");
    if (close) close.addEventListener("click", function () {
      bubble.classList.remove("show");
      try { sessionStorage.setItem("wa-bubble", "1"); } catch (err) {}
    });
  }

  /* Revelar ao rolar */
  var items = d.querySelectorAll(".reveal");
  if ("IntersectionObserver" in w && !w.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
})();
