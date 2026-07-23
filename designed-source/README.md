# Case design sources

Place **EPS** (and optional companion **JPG** fallback) files here before running conversion.

```bash
npm run convert:designed
```

## Workflow

1. Copy `.eps` files into this folder (slug = filename without extension, e.g. `palm-tree-leaves.eps`).
2. Optional: add matching `.jpg` only when EPS conversion fails (same basename).
3. Run `npm run convert:designed` — outputs go to `public/designed/` (web) and `public/designed/thumbs/` (gallery WebP).
4. Edit metadata in `public/designed/designed.meta.json` for titles, descriptions, and tags.

**Do not commit EPS/JPG originals** — they stay local or in cloud storage. Only converted assets in `public/designed/` belong in git (or on CDN via `NEXT_PUBLIC_DESIGNED_CDN_URL`).
