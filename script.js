(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Los estados ocultos solo se aplican si el JS corre
  root.classList.add("js");

  // Header: línea sutil al hacer scroll
  var header = document.getElementById("header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
    if (!reduceMotion) {
      var bars = document.querySelector(".hero__bars");
      if (bars && window.scrollY < window.innerHeight) {
        bars.style.transform = "translateY(" + window.scrollY * 0.08 + "px)";
      }
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Aparición suave con el scroll
  var items = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      // Pequeño escalonado solo en los elementos del hero
      if (el.closest(".hero")) el.style.transitionDelay = (i * 80) + "ms";
      io.observe(el);
    });
  }

  // Inclinación leve del flyer con el cursor (solo mouse)
  var wrap = document.getElementById("flyerWrap");
  var flyer = document.getElementById("flyer");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (wrap && flyer && canHover && !reduceMotion) {
    wrap.addEventListener("pointermove", function (e) {
      var r = wrap.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      flyer.style.transform = "rotateY(" + (x * 6) + "deg) rotateX(" + (-y * 6) + "deg)";
    });
    wrap.addEventListener("pointerleave", function () {
      flyer.style.transform = "";
    });
  }
})();
