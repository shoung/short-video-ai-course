# 短影音趨勢與產業解析及短影音 AI 工具應用拍攝及實作

四天課程的靜態 HTML 簡報網站。

## Structure

- `index.html`: 課程首頁，提供四天簡報入口。
- `day01.html` - `day04.html`: 每日簡報頁。
- `Day01.md` - `Day04.md`: 每日投影片內容稿。
- `site.css`, `deck.js`, `theme.js`: 共用樣式與簡報互動。

## Visual Assets

The slide site uses remote images from free stock libraries:

- Pexels
- Unsplash

Tool names such as Google Trends, YouTube, TikTok, Canva, CapCut, ChatGPT, Claude, Gemini, Runway, Pika, and Veo are automatically rendered as external links in the slide deck.

## Local Preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.
