# BooWho?

> Drop a selfie. Boo figures out who you should be for Halloween.

A small web app that takes a selfie, asks Google Gemini what costumes would suit you based on your visible features (face shape, hair, vibe), and returns four suggestions — one celebrity, one fictional character, one historical figure, one pop-culture archetype — each with a reference photo pulled from Wikipedia.

Boo is a friendly ghost who reacts as you go: curious when you hover the upload, excited when you drag a file in, thinking while Gemini works, happy when results come back.

## How it works

```
selfie → resize to ≤1024px in browser → server action
       → Gemini 2.5 Flash (vision + structured JSON)
       → Wikipedia REST API for each suggestion's thumbnail
       → InstantDB stores result keyed by 8-char shortId
       → redirect to /r/<shortId>
```

Photos never touch disk. They're sent to Gemini in-memory and discarded once the suggestions come back.

## Stack

- **Next.js 16** (App Router, Server Actions, Turbopack)
- **InstantDB** for storing session results
- **Google Gemini 2.5 Flash** for vision analysis + reasoning (free tier)
- **Wikipedia REST API** for reference photos (free, unlimited)
- **Tailwind CSS v4** + **motion** for animations
- **TypeScript** end-to-end

## Local setup

```bash
git clone https://github.com/Itsbryanfam/BooWho.git
cd BooWho
npm install
cp .env.example .env
# fill in the values (see below)
npm run dev
```

Then open http://localhost:3000.

### Environment variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_INSTANT_APP_ID` | Create an app at https://www.instantdb.com/dash, copy the App ID |
| `INSTANT_APP_ADMIN_TOKEN` | Same dashboard, in the app's settings → admin tokens |
| `GEMINI_API_KEY` | Free, no card required: https://aistudio.google.com/app/apikey |
| `WIKIPEDIA_USER_AGENT` | Any descriptive string identifying your fork (Wikimedia policy) |

After setting `NEXT_PUBLIC_INSTANT_APP_ID` and `INSTANT_APP_ADMIN_TOKEN`, push the schema once:

```bash
npx instant-cli push
```

## Deployment

A `render.yaml` Blueprint is included so Render can deploy this with one click:

1. https://dashboard.render.com → New + → Blueprint
2. Connect this repo
3. Paste the four env vars from `.env.example` when prompted
4. Apply

Auto-deploys are enabled on every push to `main`.

## Project layout

```
src/
├── app/
│   ├── page.tsx                  # upload UI, mascot reactions, loading state
│   ├── actions/analyze.ts        # server action: Gemini → Wikipedia → InstantDB
│   ├── r/[shortId]/page.tsx      # results page (server-rendered from InstantDB)
│   ├── layout.tsx                # fonts (Fredoka + Caveat), atmosphere
│   └── globals.css               # palette, decor animations
├── components/
│   ├── Atmosphere.tsx            # floating candy corn, stars, bats, sparkles
│   ├── Boo.tsx                   # the ghost mascot — six mood states
│   ├── CandyButton.tsx           # chunky candy-coated button
│   ├── PhotoFrame.tsx            # photo upload frame
│   ├── CostumeCard.tsx           # individual costume suggestion card
│   └── CostumeStack.tsx          # results page layout + entrance animations
├── lib/
│   ├── gemini.ts                 # system prompt + JSON schema + client
│   ├── wiki.ts                   # Wikipedia thumbnail helper
│   ├── db.ts                     # InstantDB react client
│   └── db-admin.ts               # InstantDB admin (server-side)
├── instant.schema.ts             # `sessions` entity definition
└── instant.perms.ts              # view/create only
```

## Caveats

- **Gemini free tier**: 1,500 requests/day. Don't share the URL anywhere it'll catch traffic.
- **Render free tier**: spins down after 15 min idle → 30-90s cold start on the next request.
- **Archetypes**: Wikipedia has photos for established subcultures (Cottagecore, Goth, Disco) but not made-up vibes. The server filters out suggestions without images and shows fewer cards rather than a placeholder.
