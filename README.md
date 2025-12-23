# Anu ⇄ Unicode Telugu Converter (static, GitHub Pages)

A **static** Next.js website you can host on **GitHub Pages** to convert:

- **Anu 6.0 (non‑Unicode) ⇄ Unicode**
- **Anu 7.0 (non‑Unicode) ⇄ Unicode**

✅ Next.js static export (`output: "export"`)  
✅ Offline conversion (no server / no PHP needed)  
✅ Dropdown for Anu version + conversion direction  
⚠️ You must provide the real mapping tables for accurate results.

---

## Why not PHP on GitHub Pages?

GitHub Pages is **static hosting**. It does not execute PHP.
This project is designed specifically to work on GitHub Pages.

---

## Mapping files (replace these)

This repo ships with **placeholder** mappings just to prove wiring.

Replace these JSON files with the real mappings:

- `maps/anu6_to_unicode.json`
- `maps/unicode_to_anu6.json`
- `maps/anu7_to_unicode.json`
- `maps/unicode_to_anu7.json`

### Mapping format

Each file is a JSON object:

```json
{
  "someAnuSequence": "యే",
  "anotherSequence": "క్ష",
  "...": "..."
}
```

- Keys can be **multi‑character sequences** (important).
- This project uses a greedy **longest match** algorithm to handle that.
- Any keys starting with `_` are ignored (you can keep `_meta`).

---

## Run locally

```bash
npm i
npm run dev
```

---

## Deploy to GitHub Pages

### 1) Set repo basePath

Edit `next.config.js` and set these to your repo name:

```js
basePath: "/<REPO_NAME>",
assetPrefix: "/<REPO_NAME>/",
```

Example if repo is `anu-unicode-converter`:

```js
basePath: "/anu-unicode-converter",
assetPrefix: "/anu-unicode-converter/",
```

### 2) Add GitHub Actions workflow

Create: `.github/workflows/pages.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Build (static export)
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3) Enable Pages

GitHub → **Settings → Pages** → Source = **GitHub Actions**

---

## Notes / limitations

- Unicode → Anu output is only useful if the destination app uses the correct **Anu font**.
- If you want “exactly like eemaata / font2unicode”, you must use an accurate mapping for the specific Anu version.
