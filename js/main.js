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

  // NFT wall: while the grid is on screen, each tile swaps to a random piece
  // from the pool every 2–5 s. A piece is never shown in two tiles at once.
  document.querySelectorAll("[data-nft-pool]").forEach((grid) => {
    if (reduceMotion) return;
    let pool;
    try { pool = JSON.parse(grid.dataset.nftPool); } catch { return; }
    const tiles = [...grid.querySelectorAll(".thumb")];
    if (pool.length <= tiles.length) return;

    const showing = new Set(tiles.map((tile) => tile.querySelector("img").getAttribute("src")));
    const timers = new Map();
    let active = false;

    const randomDelay = () => 2000 + Math.random() * 3000;

    const swap = async (tile) => {
      const current = tile.querySelector("img:last-of-type");
      const choices = pool.filter((src) => !showing.has(src));
      const next = choices[Math.floor(Math.random() * choices.length)];
      showing.add(next);
      const img = new Image();
      img.src = next;
      img.alt = current.alt;
      img.className = "is-entering";
      try { await img.decode(); } catch { showing.delete(next); return; }
      if (!active) { showing.delete(next); return; }
      tile.appendChild(img);
      requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add("is-shown")));
      img.addEventListener("transitionend", () => {
        showing.delete(current.getAttribute("src"));
        current.remove();
      }, { once: true });
    };

    const schedule = (tile) => {
      timers.set(tile, setTimeout(async () => {
        if (!active) return;
        await swap(tile);
        if (active) schedule(tile);
      }, randomDelay()));
    };

    const start = () => {
      if (active) return;
      active = true;
      tiles.forEach(schedule);
    };
    const stop = () => {
      active = false;
      timers.forEach(clearTimeout);
      timers.clear();
    };

    let inView = false;
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView && !document.hidden ? start() : stop();
    }, { threshold: 0.2 }).observe(grid);
    document.addEventListener("visibilitychange", () => {
      inView && !document.hidden ? start() : stop();
    });
  });

  // Play-once videos: play when the section comes into view, stop on the last
  // frame, and only replay after the visitor scrolls away and back again.
  document.querySelectorAll(".once-video").forEach((video) => {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      video.controls = true; // still playable on demand
      return;
    }
    let armed = true;
    new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        armed = true;
        video.pause();
      } else if (armed && entry.intersectionRatio >= 0.6) {
        armed = false;
        video.currentTime = 0;
        video.play().catch(() => { armed = true; });
      }
    }, { threshold: [0, 0.6] }).observe(video);
  });

  // Live site embed: the screenshot stays until the visitor asks for the real
  // site, which then renders at its true width and is scaled to fit the frame.
  document.querySelectorAll("[data-live-embed]").forEach((frame) => {
    const view = frame.querySelector(".browser__view");
    const toggle = frame.parentElement.querySelector(".live-toggle");
    if (!toggle) return;
    let iframe = null;
    let observer = null;

    const fit = () => {
      if (!iframe) return;
      const virtualWidth = window.innerWidth < 768 ? 390 : 1200; // the site's own mobile / desktop layout
      const scale = view.clientWidth / virtualWidth;
      iframe.style.width = `${virtualWidth}px`;
      iframe.style.height = `${view.clientHeight / scale}px`;
      iframe.style.transform = `scale(${scale})`;
    };

    const open = () => {
      iframe = document.createElement("iframe");
      iframe.src = frame.dataset.liveEmbed;
      const preview = view.querySelector("img, video");
      iframe.title = `${preview?.alt || preview?.getAttribute("aria-label") || "Website"} (live)`;
      preview?.pause?.();
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "clipboard-write";
      view.appendChild(iframe);
      frame.classList.add("is-live");
      fit();
      observer = new ResizeObserver(fit);
      observer.observe(view);
      toggle.textContent = "Back to preview";
      toggle.setAttribute("aria-pressed", "true");
    };

    const close = () => {
      observer?.disconnect();
      iframe?.remove();
      iframe = null;
      frame.classList.remove("is-live");
      if (!reduceMotion) view.querySelector("video")?.play().catch(() => {});
      toggle.textContent = "Try the live site";
      toggle.setAttribute("aria-pressed", "false");
    };

    toggle.addEventListener("click", () => (iframe ? close() : open()));
  });

  // Background videos only play while on screen, and never under reduced motion.
  document.querySelectorAll(".cover__video, .loop-video").forEach((video) => {
    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }).observe(video);
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
