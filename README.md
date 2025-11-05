# LearnSphere — Real‑time Audio → Text Platform

A demo-friendly prototype focused on turning real‑world speech (meetings, classes, community events) into live text. No video calls, no camera—just audio to text, with highlights, follow‑ups, Q&A, and a searchable Knowledge Base.

## What it does

- Live transcription (Speaker Mode)
  - Start a session, talk naturally, see interim + finalized text
  - Mark entries as Important or Follow‑up
  - End the session to save transcripts
- Knowledge Base
  - Saved sessions list with languages, status
  - Per‑session transcript viewer with search and export (.txt)
- Chat with dictation
  - Dictate messages via mic; edit and send
- Q&A (during sessions)
  - Post questions; view the list per session
- Personas supported
  - Corporate meetings, university lectures, community/religious talks, and everyday personal notes

## Tech

- Frontend: React + Vite + Tailwind (client/)
- Runtime: Browser Web Speech API (no external models)
- API: In‑memory storage, served by:
  - Local dev Express server (server/*)
  - Vercel serverless API (api/[...path].ts) for deployment

## Local development

Port 5000 may be in use on macOS (Control Center), so use another port:

```bash
# 1) Install
npm install

# 2) Run dev server
PORT=5050 npm run dev

# App: http://localhost:5050
# Navigate to Speaker Mode, start a session, and allow mic permissions.
```

## Deploy to Vercel

- Repo: GitHub connected (main branch)
- Vercel detects `api/` functions and the Vite build
- Build command: `npm run build`
- Output directory: `dist/public`

`vercel.json` is included:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api/$1" }]
}
```

## Demo script

1) Speaker Mode
   - Start Session → allow mic
   - Talk → watch interim + finalized lines
   - Mark a few as Important / Follow‑up
   - End Session → saved
2) Knowledge Base
   - Open Knowledge Base → select the session
   - Use search and Export
3) Chat
   - Dictate a message via the mic → stop to send

## Notes

- Works best in Chrome/Edge (Web Speech API support). Safari varies.
- Data is in memory; redeploy or restart resets seed
- The app is intentionally audio‑only (no video calls)
