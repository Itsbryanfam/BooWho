<div align="center">

<img src="docs/hero.svg" alt="BooWho? — drop a selfie, Boo figures out who you should be for Halloween" width="100%" />

### A vision-AI Halloween costume recommender, narrated by a friendly ghost.

[**Live demo →**](https://boowho.onrender.com)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![InstantDB](https://img.shields.io/badge/InstantDB-orange?style=for-the-badge)](https://www.instantdb.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

</div>

---

## ✨ What it does

Upload a selfie. **Boo** — the resident ghost — analyzes your features and suggests four Halloween costumes you'd actually look great as: one **celebrity**, one **fictional character**, one **historical figure**, and one **pop-culture archetype**. Each suggestion comes with a reference photo and a short, specific reason ("your sharp jawline", "the warmth in your smile") — never generic praise.

Boo reacts in real time as you go: **curious** when you hover the upload, **excited** when you drag a file in, **thinking** while Gemini works, **happy** when results come back.

## 🧠 How it works

```
selfie  ──►  client-side resize to ≤1024px
        ──►  Next.js Server Action
        ──►  Gemini 2.5 Flash (vision + structured JSON output)
        ──►  Wikipedia REST API for each suggestion's thumbnail
        ──►  InstantDB stores result keyed by 8-char shortId
        ──►  redirect to /r/<shortId>
```

The selfie never touches disk. It's processed in memory and discarded the moment Gemini responds.

## 🛠️ Tech

| Layer | Choice | Why |
|---|---|---|
| **Frontend** | Next.js 16 App Router, TypeScript, Tailwind v4 | Server Actions remove the need for a separate API layer |
| **Vision + reasoning** | Google Gemini 2.5 Flash with `responseSchema` | One call does vision, reasoning, and structured JSON output |
| **Reference images** | Wikipedia REST API (`/page/summary/{title}`) | Free, unlimited, photographs for nearly any famous subject |
| **Database** | InstantDB | Serverless, schema-versioned, 5-line setup |
| **Animation** | `motion` (formerly framer-motion) | Mascot mood transitions, card stagger, page reveals |
| **Hosting** | Render free tier with `render.yaml` Blueprint | One-click deploy, auto-deploys on push |

## 🎬 Highlights

- **Boo, the mascot** — a hand-drawn SVG ghost with six animated mood states. Eyes follow your hover, mouth morphs between expressions via `motion`'s spring physics, sparkles fly when results arrive.
- **Reasoning, not similarity** — Gemini doesn't just match face shapes. It reasons about *vibe* (calm/intense, warm/sharp) and pairs you with subjects whose energy fits.
- **Strict structured output** — Gemini's response is locked to a JSON schema with category enums, validated again client-side with Zod. No JSON-parse failures, no hallucinated categories.
- **Graceful degradation** — when Wikipedia has no photo for a suggestion (often happens with niche archetypes), the server filters that suggestion out before persisting. Users get fewer cards, never broken ones.
- **Polished motion** — staggered card reveals, hover physics, page transitions, all respecting `prefers-reduced-motion`.

## 🚀 Run it locally

```bash
git clone https://github.com/Itsbryanfam/BooWho.git
cd BooWho
npm install
cp .env.example .env       # then fill in the four values
npx instant-cli push       # push schema to InstantDB
npm run dev
```

Visit http://localhost:3000.

### Environment

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_INSTANT_APP_ID` | [instantdb.com/dash](https://www.instantdb.com/dash) → create app, copy ID |
| `INSTANT_APP_ADMIN_TOKEN` | Same dashboard → app settings → admin tokens |
| `GEMINI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) — free, no card |
| `WIKIPEDIA_USER_AGENT` | Any descriptive string identifying your fork |

## ☁️ Deploy

This repo includes a `render.yaml` Blueprint. To deploy:

1. [Render dashboard](https://dashboard.render.com) → **New +** → **Blueprint**
2. Connect this repo — Render auto-detects the Blueprint
3. Paste the four env vars when prompted
4. Apply → first build takes 3–5 minutes

Auto-deploys are enabled on every push to `main`.

## 📁 Project structure

```
src/
├── app/
│   ├── page.tsx                  · upload UI · mascot reactions · loading state
│   ├── actions/analyze.ts        · server action: Gemini → Wikipedia → InstantDB
│   ├── r/[shortId]/page.tsx      · results page (SSR from InstantDB)
│   ├── layout.tsx                · fonts (Fredoka + Caveat) · atmosphere mount
│   └── globals.css               · palette · decor animations
├── components/
│   ├── Atmosphere.tsx            · floating candy corn, stars, bats, sparkles
│   ├── Boo.tsx                   · the ghost mascot · six mood states
│   ├── CandyButton.tsx           · chunky candy-coated button
│   ├── PhotoFrame.tsx            · drag-and-drop upload frame
│   ├── CostumeCard.tsx           · individual suggestion card
│   └── CostumeStack.tsx          · results layout · stagger entrance
├── lib/
│   ├── gemini.ts                 · system prompt · JSON schema · client
│   ├── wiki.ts                   · Wikipedia thumbnail helper
│   ├── db.ts                     · InstantDB react client
│   └── db-admin.ts               · InstantDB admin (server-side)
├── instant.schema.ts             · sessions entity definition
└── instant.perms.ts              · view & create only
```

---

<div align="center">

Made with 🧡 by [Itsbryanfam](https://github.com/Itsbryanfam)

</div>
