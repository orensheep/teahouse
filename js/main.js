// Scroll-triggered reveals, light parallax, nav state and reading progress.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Children of [data-stagger] reveal one after another.
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => {
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", group.dataset.stagger || "");
      child.style.setProperty("--i", i);
    });
  });

  const revealables = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    revealables.forEach((el) => observer.observe(el));
  }

  // Swipe carousels: native scroll-snap does the swiping, the dots follow along.
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const slides = [...track.children];
    const dotsWrap = carousel.querySelector(".carousel__dots");
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("aria-label", `Show step ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const current = () => Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    const goTo = (i) => {
      const index = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
    };
    const sync = () => {
      const active = current();
      dots.forEach((dot, i) => dot.setAttribute("aria-current", i === active ? "true" : "false"));
      slides.forEach((slide, i) => slide.setAttribute("aria-hidden", i === active ? "false" : "true"));
    };

    let frame = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    }, { passive: true });
    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      goTo(current() + (event.key === "ArrowRight" ? 1 : -1));
    });
    sync();
  });

  const nav = document.querySelector(".nav");
  const progress = document.querySelector(".progress");
  const parallax = reduceMotion ? [] : [...document.querySelectorAll("[data-parallax]")];
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;

    if (nav) {
      nav.classList.toggle("is-scrolled", y > 24);
      // Tuck the nav away while reading downward, bring it back on any upward scroll.
      nav.classList.toggle("is-hidden", y > 400 && y > lastY + 2);
      if (y < lastY - 2) nav.classList.remove("is-hidden");
    }

    if (progress) {
      const max = document.documentElement.scrollHeight - vh;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }

    // Blocks at the very end of the page can't scroll past the reveal threshold.
    if (y + vh >= document.documentElement.scrollHeight - 4) {
      document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => el.classList.add("is-in"));
    }

    parallax.forEach((el) => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
})();
