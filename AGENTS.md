# Repository Guide

`ohyyp.github.io` is an Astro v5 + Fuwari bilingual static site (`/` zh-CN, `/en/` en), managed with `pnpm`, deployed to GitHub Pages via `.github/workflows/deploy.yml`, and licensed under GNU GPL-3.0.

## Layout

- **Core Zone** (default upstream-verbatim `saicaca/fuwari@6d39b0d`): `src/styles/`, `src/plugins/`, `src/constants/`, `src/components/control/`, `src/components/misc/`, `scripts/`, `public/`, and root toolchain configs (`.npmrc`, `biome.json`, `frontmatter.json`, `pagefind.yml`, `postcss.config.mjs`, `svelte.config.js`, `tailwind.config.cjs`, `tsconfig.json`). Confirm before modifying or moving a directory out of Core Zone.
- **Free Zone** (customize freely): `src/components/custom/`, `src/components/` (top-level & `widget/`), `src/layouts/`, `src/pages/`, `src/content/`, `src/data/`, `src/assets/`, `src/i18n/`, `src/utils/`, `src/types/`, `src/config.ts`, and root project/CI/doc files.
- `CONTEXT.md`: optional local, Git-ignored notes for session context (read if present).

## Workflow & Style

- Use `pnpm`; never edit `pnpm-lock.yaml` manually. On Windows PowerShell, use `pnpm.cmd`.
- Verify changes with `pnpm run check` and `pnpm run build` (keep `README.md` <= 300 lines and `AGENTS.md` <= 30 lines).
- Keep Free Zone code strictly comment-free (excluding required compiler directives like `/// <reference>`); rely on clear naming and small modules.
- Avoid committing private URLs, personal details, secrets, or local OS paths into tracked files or public pages.
- Keep third-party dependencies and vendored code compatible with GPL-3.0, and record vendored upstream notices in `THIRD_PARTY_LICENSES.md`.

## Commits

- Follow Conventional Commits (`type(scope): description`, e.g. `feat(i18n): add bilingual routing`).
- Commit and push only when explicitly requested; leave working-tree changes local by default.
