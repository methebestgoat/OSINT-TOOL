# OSINT Scope

OSINT Scope is a GitHub-ready, privacy-respecting web application for authorized security research, journalism, and legitimate investigations. It helps analysts organize **publicly accessible** signals from a username, email address, or phone number without bypassing authentication or accessing private information.

## What is included

The project uses a small Express API and a dependency-light static frontend. Provider modules live in `src/providers/`, so new lawful sources can be added without changing the UI or route contract. The shipped providers are intentionally safe demo providers: username lookups build public profile URLs for supported platforms, email lookups provide domain context and an optional Have I Been Pwned placeholder, and phone lookups provide calling-code context plus an optional carrier API placeholder. Every result includes a source URL, provider name, confidence level, and confidence explanation.

## Run locally

```bash
cp .env.example .env
npm install
npm run check
npm start
```

Open <http://localhost:3000>. The server binds to `0.0.0.0` for container and hosted development environments. Use `npm run dev` for Node's watch mode.

## Configuration and API keys

Copy `.env.example` to `.env`. `PORT`, `ALLOWED_ORIGIN`, logging, and rate-limit values are safe operational settings. `HIBP_API_KEY`, `NUMVERIFY_API_KEY`, and `ABUSEIPDB_API_KEY` are placeholders for future server-side integrations. Never put secrets in `public/`, frontend JavaScript, Git history, or client requests. The current demo providers do not claim live breach or carrier matches even when a key is present; implement and test each provider against its terms before enabling production queries.

## GitHub deployment

Create a repository, commit the project, and set the same environment variables in your hosting provider's secret manager:

```bash
git init
git add .
git commit -m "Initial OSINT Scope application"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/osint-scope.git
git push -u origin main
```

This app works on Node hosts that run `npm install` followed by `npm start` (Render, Railway, Fly.io, a VPS, or a container platform). GitHub Pages can host only the static frontend; use a separate HTTPS API and set `ALLOWED_ORIGIN` accordingly. Do not commit `.env`.

## API

`GET /api/health` returns a small health response. `POST /api/search` accepts `{ "type": "username|email|phone", "query": "..." }`. The endpoint validates input, applies a rate limit, logs request metadata without logging the submitted identifier, and returns normalized results with `sourceUrl`, `sourceLabel`, `provider`, `confidence`, `confidenceReason`, and `status` fields.

## Legal and ethical limitations

Use this tool only where you have a lawful basis and are authorized to investigate. It must not be used to stalk, harass, dox, impersonate, discriminate against, or target people. Do not bypass authentication, probe private accounts, scrape private information, purchase illicit datasets, or use leaked credentials. Provider terms, privacy laws, data-protection rules, and acceptable-use policies still apply. A public URL or metadata signal is not proof of identity. Verify important findings with the original source and document uncertainty. The application is a research aid, not a decision engine.
