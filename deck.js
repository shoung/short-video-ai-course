(async function () {
  const host = document.getElementById("deck");
  const mdFile = document.body.dataset.md;
  const day = document.body.dataset.day;
  let slides = [];
  let index = 0;

  const visualSets = {
    "01": [
      "https://images.pexels.com/photos/8371391/pexels-photo-8371391.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/5081918/pexels-photo-5081918.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80"
    ],
    "02": [
      "https://images.pexels.com/photos/8371391/pexels-photo-8371391.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
      "https://images.pexels.com/photos/9317525/pexels-photo-9317525.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
    ],
    "03": [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      "https://images.pexels.com/photos/9317525/pexels-photo-9317525.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=80"
    ],
    "04": [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80"
    ]
  };

  const toolLinks = [
    { label: "Google Trends", href: "https://trends.google.com/trends/" },
    { label: "YouTube", href: "https://www.youtube.com/feed/trending" },
    { label: "TikTok", href: "https://www.tiktok.com/" },
    { label: "抖音", href: "https://www.douyin.com/" },
    { label: "Reels", href: "https://www.instagram.com/reels/" },
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "LINE", href: "https://line.me/" },
    { label: "Canva", href: "https://www.canva.com/" },
    { label: "CapCut", href: "https://www.capcut.com/" },
    { label: "剪映", href: "https://www.capcut.cn/" },
    { label: "ChatGPT", href: "https://chatgpt.com/" },
    { label: "Claude", href: "https://claude.ai/" },
    { label: "Gemini", href: "https://gemini.google.com/" },
    { label: "Runway", href: "https://runwayml.com/" },
    { label: "Pika", href: "https://pika.art/" },
    { label: "Veo", href: "https://deepmind.google/technologies/veo/" },
    { label: "YouTube Create", href: "https://www.youtube.com/create/" },
    { label: "Instagram Edits", href: "https://creators.instagram.com/edits" }
  ];

  function escapeHtml(text) {
    return text
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function linkify(text) {
    let html = escapeHtml(text);
    const replacements = [];
    const sortedTools = [...toolLinks].sort((a, b) => b.label.length - a.label.length);
    for (const tool of sortedTools) {
      const safeLabel = tool.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      html = html.replace(new RegExp(safeLabel, "g"), () => {
        const token = `__TOOL_LINK_${replacements.length}__`;
        replacements.push(`<a class="inline-link" href="${tool.href}" target="_blank" rel="noopener noreferrer">${tool.label}</a>`);
        return token;
      });
    }
    replacements.forEach((replacement, i) => {
      html = html.replace(`__TOOL_LINK_${i}__`, replacement);
    });
    return html;
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

  function splitLead(lines) {
    return {
      lead: lines[0] || "",
      rest: lines.slice(1)
    };
  }

  function renderParagraphs(lines) {
    return lines.map((line) => `<p>${linkify(line)}</p>`).join("");
  }

  function renderCards(lines) {
    return `<div class="content-cards">${lines.map((line, i) => {
      const parts = line.split("：");
      const heading = parts.length > 1 ? parts.shift() : `Point ${i + 1}`;
      const body = parts.join("：") || line;
      return `<article><span>${String(i + 1).padStart(2, "0")}</span><strong>${linkify(heading)}</strong><p>${linkify(body)}</p></article>`;
    }).join("")}</div>`;
  }

  function renderChecklist(lines) {
    return `<div class="checklist">${lines.map((line) => `<div><i>✓</i><span>${linkify(line.replace(/^\d+\.\s*/, ""))}</span></div>`).join("")}</div>`;
  }

  function renderProcess(lines) {
    return `<div class="process-line">${lines.map((line, i) => `<div><span>${i + 1}</span><p>${linkify(line.replace(/^\d+\.\s*/, ""))}</p></div>`).join("")}</div>`;
  }

  function imageFor(i, offset = 0) {
    return visualSets[day][(i + offset) % visualSets[day].length];
  }

  function renderVisual(slide, i, layout) {
    const image = imageFor(i);
    const label = layout === "audio" ? "AUDIO FIRST" : layout === "lab" ? "HANDS ON" : `DAY ${day}`;
    return `
      <figure class="visual-panel ${layout === "audio" ? "sound-card" : ""}">
        <img src="${image}" alt="" loading="lazy">
        <figcaption>${label}</figcaption>
      </figure>
    `;
  }

  function renderBigNumber(lines, i) {
    const numberMatch = `${slides[i]?.title || ""} ${lines.join(" ")}`.match(/[一二三四五六七八九十]|\d+/);
    const number = numberMatch ? numberMatch[0] : String(i + 1).padStart(2, "0");
    return `
      <div class="big-number-block">
        <span>${number}</span>
        <div>${renderParagraphs(lines)}</div>
      </div>
    `;
  }

  function renderQuote(lines) {
    const quote = lines[0] || "";
    const rest = lines.slice(1);
    return `
      <div class="quote-block">
        <p>${linkify(quote)}</p>
        ${rest.length ? `<div class="slide-body compact">${renderParagraphs(rest)}</div>` : ""}
      </div>
    `;
  }

  function renderCollage(i) {
    return `
      <div class="photo-collage" aria-hidden="true">
        <img src="${imageFor(i, 0)}" alt="" loading="lazy">
        <img src="${imageFor(i, 1)}" alt="" loading="lazy">
        <img src="${imageFor(i, 2)}" alt="" loading="lazy">
        <img src="${imageFor(i, 3)}" alt="" loading="lazy">
      </div>
    `;
  }

  function renderIndexList(lines) {
    return `
      <div class="mag-index">
        ${lines.map((line, i) => `<div><span>${String(i + 1).padStart(2, "0")}</span><p>${linkify(line.replace(/^\d+\.\s*/, ""))}</p></div>`).join("")}
      </div>
    `;
  }

  function renderUtilityLinks(slide) {
    const titleAndBody = `${slide.title} ${slide.body.join(" ")}`;
    const matched = toolLinks.filter((tool) => titleAndBody.includes(tool.label));
    if (!matched.length) return "";
    return `<div class="tool-strip">${matched.map((tool) => `<a href="${tool.href}" target="_blank" rel="noopener noreferrer">${tool.label} ↗</a>`).join("")}</div>`;
  }

  function layoutFor(slide, i) {
    const title = slide.title;
    if (i === 0) return "cover";
    if (title.includes("聲音收音")) return "audio";
    if (title.includes("實作")) return "lab";
    if (title.includes("Google Trends") || title.includes("排行榜")) return "full-bleed";
    if (title.includes("收尾") || title.includes("不是學拍好玩") || title.includes("不想露臉")) return "quote";
    if (title.includes("景別") || title.includes("B-roll") || title.includes("素材") || title.includes("作品優化")) return "collage";
    if (title.includes("流程") || title.includes("公式") || title.includes("位置")) return "process";
    if (title.includes("檢查") || title.includes("清單") || title.includes("規格")) return "check";
    if (title.includes("三個") || title.includes("四種") || title.includes("五個")) return "big-number";
    if (title.includes("平台") || title.includes("四種") || title.includes("來源") || title.includes("策略")) return "cards";
    if (i % 7 === 0) return "index";
    return i % 5 === 0 ? "photo-right" : i % 5 === 1 ? "cards" : i % 5 === 2 ? "big-number" : i % 5 === 3 ? "photo-left" : "process";
  }

  function renderSlide(slide, i) {
    const layout = layoutFor(slide, i);
    const title = slide.title.replace(/^\d+\.\s*/, "");
    const { lead, rest } = splitLead(slide.body);
    const usefulLines = rest.length ? rest : slide.body;
    const links = renderUtilityLinks(slide);
    let content = "";

    if (layout === "cover") {
      content = `
        <div class="cover-grid">
          <div>
            <div class="deck-kicker">DAY ${day} · SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
            <div class="slide-body compact">${renderParagraphs(rest)}</div>
            ${links}
          </div>
          ${renderVisual(slide, i, layout)}
        </div>`;
    } else if (layout === "full-bleed") {
      content = `
        <div class="full-bleed-frame" style="--slide-image: url('${imageFor(i)}')">
          <div class="full-bleed-copy">
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
            <div class="slide-body compact">${renderParagraphs(rest)}</div>
            ${links}
          </div>
        </div>`;
    } else if (layout === "quote") {
      content = `
        <div class="quote-layout">
          <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
          <h2>${linkify(title)}</h2>
          ${renderQuote(slide.body)}
          ${links}
        </div>`;
    } else if (layout === "collage") {
      content = `
        <div class="collage-layout">
          <div>
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
            <div class="slide-body compact">${renderParagraphs(rest)}</div>
            ${links}
          </div>
          ${renderCollage(i)}
        </div>`;
    } else if (layout === "big-number") {
      content = `
        <div class="number-layout">
          <div>
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
          </div>
          ${renderBigNumber(usefulLines, i)}
          ${links}
        </div>`;
    } else if (layout === "index") {
      content = `
        <div class="index-layout">
          <div>
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
          </div>
          ${renderIndexList(usefulLines)}
          ${links}
        </div>`;
    } else if (layout === "photo-right" || layout === "photo-left" || layout === "audio") {
      content = `
        <div class="split-grid ${layout}">
          ${layout === "photo-left" ? renderVisual(slide, i, layout) : ""}
          <div>
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
            <div class="slide-body compact">${renderParagraphs(rest)}</div>
            ${links}
          </div>
          ${layout !== "photo-left" ? renderVisual(slide, i, layout) : ""}
        </div>`;
    } else if (layout === "cards") {
      content = `
        <div class="stack-layout">
          <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
          <h2>${linkify(title)}</h2>
          <div class="slide-lead">${linkify(lead)}</div>
          ${renderCards(usefulLines)}
          ${links}
        </div>`;
    } else if (layout === "check") {
      content = `
        <div class="split-grid">
          <div>
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
          </div>
          <div>
            ${renderChecklist(usefulLines)}
            ${links}
          </div>
        </div>`;
    } else if (layout === "process") {
      content = `
        <div class="stack-layout">
          <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
          <h2>${linkify(title)}</h2>
          <div class="slide-lead">${linkify(lead)}</div>
          ${renderProcess(usefulLines)}
          ${links}
        </div>`;
    } else {
      content = `
        <div class="lab-layout">
          <div>
            <div class="deck-kicker">SLIDE ${String(i + 1).padStart(2, "0")}</div>
            <h2>${linkify(title)}</h2>
            <div class="slide-lead">${linkify(lead)}</div>
          </div>
          <div class="lab-board">
            ${renderChecklist(usefulLines)}
            ${links}
          </div>
        </div>`;
    }

    return `<section class="slide ${layout}${i === 0 ? " active" : ""}" data-layout="${layout}"><div class="slide-inner">${content}</div></section>`;
  }

  function draw(direction = 1) {
    const slide = slides[index];
    const all = document.querySelectorAll(".slide");
    all.forEach((node, i) => {
      node.classList.toggle("active", i === index);
      node.classList.toggle("leaving-left", i < index && direction > 0);
      node.classList.toggle("leaving-right", i > index && direction < 0);
    });
    document.querySelector("[data-count]").textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    document.querySelector("[data-progress]").style.width = `${((index + 1) / slides.length) * 100}%`;
    document.title = `Day ${day}｜${slide.title.replace(/^\d+\.\s*/, "")}`;
  }

  function go(nextIndex) {
    const old = index;
    index = Math.max(0, Math.min(slides.length - 1, nextIndex));
    draw(index >= old ? 1 : -1);
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
      ${slides.map((slide, i) => renderSlide(slide, i)).join("")}
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
