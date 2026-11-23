(function () {
  "use strict";

  var head = document.getElementById("head");
  var onScroll = function () {
    if (window.scrollY > 40) head.classList.add("is-stuck");
    else head.classList.remove("is-stuck");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  var closeMenu = function () {
    burger.classList.remove("is-open");
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  burger.addEventListener("click", function () {
    var open = !menu.classList.contains("is-open");
    burger.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  Array.prototype.forEach.call(menu.querySelectorAll("a"), function (a) {
    a.addEventListener("click", closeMenu);
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("is-in"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add("is-in"); });
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var line = document.querySelector(".tab-line");
  var moveLine = function (tab) {
    if (!line || !tab) return;
    line.style.width = tab.offsetWidth + "px";
    line.style.transform = "translateX(" + tab.offsetLeft + "px)";
  };
  var activate = function (tab) {
    tabs.forEach(function (t) {
      var active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
    });
    var id = tab.getAttribute("data-tab");
    Array.prototype.forEach.call(document.querySelectorAll(".panel"), function (panel) {
      var active = panel.id === "panel-" + id;
      panel.classList.toggle("is-active", active);
      if (active) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    });
    moveLine(tab);
  };
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { activate(tab); });
  });
  var activeTab = document.querySelector(".tab.is-active") || tabs[0];
  if (activeTab) {
    requestAnimationFrame(function () { moveLine(activeTab); });
    window.addEventListener("resize", function () { moveLine(activeTab); });
  }

  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var index = 0;
  var openLb = function (i) {
    index = (i + shots.length) % shots.length;
    lbImg.src = shots[index].getAttribute("data-src");
    lbImg.alt = shots[index].querySelector("img").alt;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  var closeLb = function () {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  shots.forEach(function (shot, i) {
    shot.addEventListener("click", function () { openLb(i); });
  });
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", function () { openLb(index - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { openLb(index + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") openLb(index - 1);
    if (e.key === "ArrowRight") openLb(index + 1);
  });

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 10;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });
})();
