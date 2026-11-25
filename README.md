# ohyyp.github.io

Personal website of [Ohyyp](https://github.com/Ohyyp), hosted at [https://ohyyp.github.io](https://ohyyp.github.io).

Built with [Astro](https://astro.build) and the open-source [Fuwari](https://github.com/saicaca/fuwari) theme (MIT, baseline `6d39b0d`), with clean bilingual routing (`/` for Simplified Chinese, `/en/` for English), Pagefind search, Mermaid diagrams, and customizable theme colors.

## Features

- **Bilingual Static Routes**: `/` (default `zh_CN`) and `/en/` (`en`) with isolated post feeds (`src/content/posts/zh/` & `en/`), `hreflang` tags, per-locale RSS, and a `中 / EN` navbar switch.
- **Standalone Pages & Toggles**: Projects, Timeline, Moments, Archive, and About controlled centrally via `featurePagesConfig` in `src/config.ts`.
- **Reading & Writing**: Expressive Code, KaTeX math, Mermaid diagrams, reading progress bar, desktop focus/immersive mode, mobile TOC, last-updated/outdated banners, List/Grid post view toggle, and optional Giscus comments.

## Repository Layout (Core vs Free Zone)

- **Core Zone (100% untouched upstream `saicaca/fuwari@6d39b0d`)**: `src/styles/`, `src/plugins/`, `src/constants/`, `src/components/control/`, `src/components/misc/`, `scripts/`, `public/`, and root toolchain configs (`.npmrc`, `biome.json`, `frontmatter.json`, `pagefind.yml`, `postcss.config.mjs`, `svelte.config.js`, `tailwind.config.cjs`, `tsconfig.json`).
- **Free Zone (customized & extended)**: `src/components/custom/`, `src/data/`, `src/content/`, `src/pages/`, `src/layouts/`, `src/components/` (top-level & `widget/`), `src/i18n/`, `src/utils/`, `src/types/`, `src/config.ts`, `.github/workflows/deploy.yml`, and project docs.

## Local Development

Prerequisites: Node.js (`>=20` / `22` / `24`) and `pnpm` (enable via `corepack enable`, or use `pnpm.cmd` on Windows PowerShell).

```bash
pnpm install --frozen-lockfile   # Install dependencies
pnpm dev                         # Start local dev server (http://localhost:4321)
pnpm check                       # Run Astro & TypeScript checks
pnpm build                       # Build static site + Pagefind search index to ./dist/
pnpm preview                     # Preview production build (required for Pagefind search)
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml` (`withastro/action@v6` + `actions/deploy-pages@v4`). Ensure **Settings → Pages → Source** is set to **GitHub Actions** on GitHub.

## License & Attribution

- Licensed under the [GNU General Public License v3.0](./LICENSE).
- Built upon [Fuwari](https://github.com/saicaca/fuwari) by `saicaca` (MIT License; see [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md)).
