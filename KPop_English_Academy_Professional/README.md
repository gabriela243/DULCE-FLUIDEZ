# K-Pop English Academy — Professional Starter

A responsive, polished English-learning website with a pink/lilac K-pop fashion aesthetic.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in Chrome or Edge.
3. For best microphone compatibility, serve the folder from localhost (for example with VS Code Live Server). Browser speech recognition support varies.

## Included
- Responsive dashboard and lesson catalog
- Six starter lessons with immediate answer feedback, retry hints, and explanations
- Browser text-to-speech pronunciation audio
- Optional browser speech recognition practice where supported
- Local progress, XP, completed lessons, and achievements using localStorage
- Progress page and reset control
- Accessible labels, responsive layouts, and no external dependencies

## Current limitations
This is a front-end starter, not a hosted SaaS product. It does not include user accounts, cloud sync, a server-side curriculum database, AI-generated corrections, or professional phoneme-level pronunciation scoring. Voice features depend on the browser and permissions. Progress stays in the browser/device used.

## Structure
- `index.html` — application entry point
- `styles.css` — visual design and responsive styles
- `app.js` — lessons, grading, speech features, and progress
- `assets/` — reserved for future local image assets
