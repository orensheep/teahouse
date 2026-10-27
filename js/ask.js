/* ==========================================================================
   Ask Oren: a floating button that opens a small chat of pre-written
   answers (content lives in js/ask-data.js). Visitors pick a question, the
   answer appears as a reply, and follow-up questions are offered next.
   ========================================================================== */

(() => {
  const data = window.ASK_OREN;
  if (!data) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const byId = new Map(data.questions.filter((item) => item.a).map((item) => [item.id, item]));
  if (!byId.size) return;

  const UI = {
    en: {
      button: "Ask Oren",
      title: "Ask Oren",
      subtitle: "Answers I wrote myself, not a live chat.",
      hello: "Hi, I'm Oren. Curious about my work? Pick a question.",
      more: "Other questions",
      contact: "Still curious? Message me",
      close: "Close",
      lang: "中文",
      langLabel: "切換成中文",
    },
    zh: {
      button: "問問 Oren",
      title: "問問 Oren",
      subtitle: "這些是我親自寫好的回答，不是即時聊天。",
      hello: "嗨，我是 Oren。對我的作品有興趣嗎？選一個問題吧。",
      more: "其他問題",
      contact: "還想多聊？傳訊息給我",
      close: "關閉",
      lang: "EN",
      langLabel: "Switch to English",
    },
  };

  const storage = {
    get: (key) => { try { return localStorage.getItem(key); } catch { return null; } },
    set: (key, value) => { try { localStorage.setItem(key, value); } catch { /* private mode */ } },
  };

  let lang = storage.get("ask-oren-lang")
    || ((navigator.language || "").toLowerCase().startsWith("zh") ? "zh" : "en");

  const page = ["hightable", "teahouse", "tearex"].find((name) => document.body.classList.contains(`theme-${name}`));
  const asked = new Set();
  const history = []; // ids asked so far, so the log can be redrawn in another language

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  // ---- Markup ----
  const toggle = el("button", "ask__toggle");
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "ask-panel");
  const toggleLabel = el("span");
  toggle.append(el("span", "ask__dot"), toggleLabel);

  const panel = el("section", "ask__panel");
  panel.id = "ask-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");

  const head = el("header", "ask__head");
  const titles = el("div");
  const title = el("p", "ask__title");
  const subtitle = el("p", "ask__subtitle");
  titles.append(title, subtitle);
  const langButton = el("button", "ask__lang");
  langButton.type = "button";
  const closeButton = el("button", "ask__close", "×");
  closeButton.type = "button";
  head.append(titles, langButton, closeButton);

  const log = el("div", "ask__log");
  log.setAttribute("aria-live", "polite");
  const chips = el("div", "ask__chips");
  const foot = el("footer", "ask__foot");
  const contact = el("a", "ask__contact");
  contact.target = "_blank";
  contact.rel = "noopener";
  if (data.contactUrl) {
    contact.href = data.contactUrl;
    foot.append(contact);
  }

  panel.append(head, log, chips, foot);
  const root = el("div", "ask");
  root.append(panel, toggle);
  document.body.append(root);

  // ---- Rendering ----
  const bubble = (who, text) => {
    const node = el("div", `ask__msg ask__msg--${who}`);
    text.split(/\n\n+/).forEach((para) => node.append(el("p", null, para)));
    log.append(node);
    return node;
  };

  const scrollDown = () => log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });

  const offer = (ids) => {
    chips.replaceChildren();
    const unasked = [...byId.keys()].filter((id) => !asked.has(id));
    let shown = ids.filter((id) => unasked.includes(id)).slice(0, 3);
    if (!shown.length) shown = unasked.slice(0, 3);
    shown.forEach((id) => {
      const chip = el("button", "ask__chip", byId.get(id).q[lang]);
      chip.type = "button";
      chip.addEventListener("click", () => ask(id));
      chips.append(chip);
    });
    const rest = unasked.filter((id) => !shown.includes(id));
    if (rest.length) {
      const more = el("button", "ask__chip ask__chip--more", UI[lang].more);
      more.type = "button";
      more.addEventListener("click", () => offer(rest));
      chips.append(more);
    }
  };

  const firstQuestions = () => {
    const own = data.questions.find((item) => item.page === page && byId.has(item.id));
    return [own?.id, ...data.starters].filter(Boolean);
  };

  const ask = (id) => {
    const item = byId.get(id);
    asked.add(id);
    history.push(id);
    chips.replaceChildren();
    bubble("you", item.q[lang]);
    const typing = el("div", "ask__msg ask__msg--oren ask__typing");
    typing.setAttribute("aria-label", "…");
    typing.append(el("span"), el("span"), el("span"));
    log.append(typing);
    scrollDown();
    setTimeout(() => {
      typing.remove();
      bubble("oren", item.a[lang]);
      offer(item.next || []);
      scrollDown();
    }, reduceMotion ? 0 : 650);
  };

  const render = () => {
    const t = UI[lang];
    toggleLabel.textContent = t.button;
    panel.setAttribute("aria-label", t.title);
    panel.lang = lang === "zh" ? "zh-Hant" : "en";
    title.textContent = t.title;
    subtitle.textContent = t.subtitle;
    langButton.textContent = t.lang;
    langButton.setAttribute("aria-label", t.langLabel);
    closeButton.setAttribute("aria-label", t.close);
    contact.textContent = `${t.contact} →`;
    log.replaceChildren();
    bubble("oren", t.hello);
    history.forEach((id) => {
      bubble("you", byId.get(id).q[lang]);
      bubble("oren", byId.get(id).a[lang]);
    });
    const last = byId.get(history[history.length - 1]);
    offer(last ? last.next || [] : firstQuestions());
    log.scrollTop = log.scrollHeight;
  };

  // ---- Open / close ----
  const open = () => {
    panel.hidden = false;
    root.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    (chips.querySelector("button") || closeButton).focus({ preventScroll: true });
  };
  const close = () => {
    panel.hidden = true;
    root.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  };

  toggle.addEventListener("click", () => (panel.hidden ? open() : close()));
  closeButton.addEventListener("click", close);
  panel.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  langButton.addEventListener("click", () => {
    lang = lang === "en" ? "zh" : "en";
    storage.set("ask-oren-lang", lang);
    render();
    langButton.focus();
  });

  render();
})();
