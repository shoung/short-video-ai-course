(async function () {
  const host = document.getElementById("deck");
  const mdFile = document.body.dataset.md;
  const day = document.body.dataset.day;
  let slides = [];
  let index = 0;

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function parseMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const parsed = [];
    let current = null;

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;

      if (line.startsWith("# ")) continue;

      if (line.startsWith("## ")) {
        if (current) parsed.push(current);
        current = { title: line.replace(/^##\s*/, ""), body: [] };
        continue;
      }

      if (current) current.body.push(line.replace(/\s{2,}$/, ""));
    }

    if (current) parsed.push(current);
    return parsed;
  }

  function renderBody(lines) {
    const items = [];
    const blocks = [];

    for (const line of lines) {
      const match = line.match(/^(\d+)\.\s+(.+)/);
      if (match) {
        items.push(match[2]);
        continue;
      }

      if (items.length) {
        blocks.push(`<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`);
        items.length = 0;
      }

      const className = line.length > 42 ? " class=\"small\"" : "";
      blocks.push(`<p${className}>${escapeHtml(line)}</p>`);
    }

    if (items.length) {
      blocks.push(`<ol>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`);
    }

    return blocks.join("");
  }

  function draw() {
    const slide = slides[index];
    const all = document.querySelectorAll(".slide");
    all.forEach((node, i) => node.classList.toggle("active", i === index));
    document.querySelector("[data-count]").textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    document.querySelector("[data-progress]").style.width = `${((index + 1) / slides.length) * 100}%`;
    document.title = `Day ${day}｜${slide.title.replace(/^\d+\.\s*/, "")}`;
  }

  function go(nextIndex) {
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    draw();
  }

  try {
    const response = await fetch(mdFile);
    const markdown = await response.text();
    slides = parseMarkdown(markdown);
  } catch (error) {
    host.innerHTML = `<main class="slide active"><div class="slide-inner"><h2>載入失敗</h2><div class="slide-body"><p>找不到 ${escapeHtml(mdFile)}</p></div></div></main>`;
    return;
  }

  host.innerHTML = `
    <button class="theme-toggle" type="button" aria-label="切換深淺色模式" data-theme-toggle>☼</button>
    <div class="deck-shell">
      <header class="deck-topbar">
        <a class="home-link" href="index.html">首頁</a>
        <span class="deck-kicker">DAY ${day} · SHORT VIDEO AI WORKSHOP</span>
      </header>
      ${slides
        .map((slide, i) => `
          <section class="slide${i === 0 ? " active" : ""}">
            <div class="slide-inner">
              <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
              <h2>${escapeHtml(slide.title.replace(/^\d+\.\s*/, ""))}</h2>
              <div class="slide-body">${renderBody(slide.body)}</div>
            </div>
          </section>
        `)
        .join("")}
      <div class="progress"><span data-progress></span></div>
      <div class="slide-count" data-count></div>
      <div class="deck-controls">
        <button type="button" aria-label="上一頁" data-prev>‹</button>
        <button type="button" aria-label="下一頁" data-next>›</button>
      </div>
    </div>
  `;

  document.querySelector("[data-prev]").addEventListener("click", () => go(index - 1));
  document.querySelector("[data-next]").addEventListener("click", () => go(index + 1));
  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === " ") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "Home") go(0);
    if (event.key === "End") go(slides.length - 1);
  });

  const themeButton = document.querySelector("[data-theme-toggle]");
  themeButton.addEventListener("click", () => {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("deck-theme", root.dataset.theme);
    themeButton.textContent = root.dataset.theme === "light" ? "☾" : "☼";
  });

  draw();
})();
