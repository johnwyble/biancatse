# Bianca Tse for Judge — Campaign Website

A config-driven CCS campaign site. The whole site renders from `site-config.json`; you rarely need to touch `index.html`.

## Files
- `index.html` — the template engine. Reads `site-config.json` and builds every section. Don't edit unless adding a new feature.
- `site-config.json` — all the content, colors, fonts, and section order. **Edit this to change the site.**
- `build.js` / `package.json` / `netlify.toml` / `_redirects` — deploy tooling. `build.js` optimizes images and copies everything into `dist/`.
- `images/` — source photos (full size). The build resizes and converts them to WebP automatically.
- `preview.html` — a self-contained preview with the config and photos baked in. **Double-click to open in a browser** — no server needed.

## Previewing
Easiest: open `preview.html`.

To preview the real config-driven version, run a local server (the engine loads `site-config.json` over HTTP):
```
cd biancaforjudge-site
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing content
Open `site-config.json`. Change text, swap image paths, reorder `sectionOrder`, add endorsements, adjust colors under `style.colors`. Use `\n` inside `about.body` for paragraph breaks.

## Deploying to Netlify (Git-connected)
1. Push this folder to a GitHub repo.
2. Netlify → New site → Import from Git → select the repo.
3. Build settings auto-detect from `netlify.toml` (build: `npm install && npm run build`, publish: `dist`).
4. Point the domain (see the skill's deployment reference). The volunteer form works automatically as a Netlify form.

## Notes
- Palette and tagline come from the campaign style guide (navy #152243, gold #C2993E, "Experience. Integrity. Fairness.").
- Washington requires the "Paid for by" line — it's in the footer.
- The donate button points to the Anedot page.
