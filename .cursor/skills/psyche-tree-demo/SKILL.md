---
name: psyche-tree-demo
description: >-
  Develop and extend the 心象生命之树探索 demo (React/Vite psychological card
  quiz with Kabbalah tree, book UX, DeepSeek mystical reading). Use when working
  in psyche-tree-demo, editing questions/cards/scoring, tree animations, book
  flow, card image scripts, or DeepSeek API integration.
---

# 心象生命之树探索 Demo

## Product intent

Interactive self-exploration: 7 psychology dimensions via monochrome card choices, progressive **organic Tree of Life** background, book-style Q&A, layered results (psychology prose + DeepSeek mystical reading). Sacred aesthetic: black `#0a0a0a`, white/silver lines, subtle gold.

## Non-negotiable UX rules

1. **One card per page** — selecting replaces any prior choice on that page.
2. **Auto page flip** ~420ms after selection; last page auto-completes. Footer: back only (`showNext={false}`), hint「择一即翻页」.
3. **Results show interpretation only** — no selected card names, no scores, no dimension tables. Pages: 心象画像 → 神谕之页 → 合书.
4. **Psychology copy format**: `【维度名】解读句` via `generatePsychologyProfile()` — never expose 均分 to users.
5. **Card art**: smooth B&W gradients — **no** `feTurbulence` / film grain. PNG preferred (`CardImage` falls back to SVG).
6. **Tree background** must read as a **real tree** (trunk/branches/canopy in `treeOrganic.ts`), not only Kabbalah circles. Sephirot = glowing nodes on branches.
7. **Tree sync**: `countCompletedDimensions(index, answers, allQuestions)` drives `treeRevealStage`. Stage **up** → `TreeAwakeningOverlay`; stage **down** (上一页) → `treeRecoilKey` dim animation on `TreeOfLifeBackground`.

## Attention checks

Two interleaved checks (after dims 2 & 5) require specific cards (`star-explorer`, `stable-mountain`). Failure sets `attentionPassed: false` and shows「部分对话确认未能匹配…」on results — does not block generation. Scoring in `scoring.ts`; decoys via `getAttentionCheckCards()`.

## Architecture map

| Area | Path |
|------|------|
| App phases | `src/App.tsx` — welcome → questions → result |
| Book Q&A | `src/components/book/BookQuestionFlow.tsx` |
| Book results | `src/components/book/BookResult.tsx` |
| 3D flip | `src/components/book/useBookFlip.ts`, `BookShell.tsx` |
| Organic + Kabbalah tree | `src/components/TreeOfLifeBackground.tsx`, `src/components/tree/treeOrganic.ts`, `treeData.ts` |
| Tree HUD / awakening | `TreeProgress.tsx`, `TreeAwakeningOverlay.tsx` |
| Questions | `src/data/questions.ts` — `buildQuestionFlow()` interleaves attention |
| Scoring | `src/data/scoring.ts` |
| Psychology text | `src/data/psychologyProfile.ts` |
| Mystical (local fallback) | `src/data/mysticalReading.ts` |
| DeepSeek API | `server/deepseek.ts`, `src/services/mysticalReadingApi.ts`, Vite middleware in `vite.config.ts` |
| Card images | `scripts/generate-card-images.mjs`, `export-cards-png.mjs`, `generate-card-images-ai.mjs`, `card-prompts.mjs` |
| Static cards | `public/cards/{pattern}.png` |

## Common tasks

### Add / edit a dimension question

Edit `src/data/questions.ts` → `dimensions` array. Each card needs `id`, `label`, `description`, `score` (-2..2), `pattern` matching `public/cards/`. Regenerate cards if new pattern: `npm run generate:cards`.

### Change tree reveal timing

`treeData.ts`: each `Sephira.revealStage` (1–7 bottom→top). Organic parts in `treeOrganic.ts` use matching `revealStage` on roots/branches/canopy.

### DeepSeek

`.env.local`: `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL=deepseek-v4-pro`. Thinking mode disabled in server. Never commit keys.

### Card pipeline

```bash
npm run generate:cards      # SVG + PNG (runs on build)
npm run export:cards:png    # PNG only
npm run generate:cards:ai   # DALL-E 3, needs OPENAI_API_KEY
```

### Verify

```bash
npm run dev    # http://localhost:5173
npm run build
```

## Styling

Book/paper: `src/index.css` (`.book-*`, page flip ~1050ms). Tree: `.tree-*`, `.tree-organic-recoil`. Book pages semi-transparent so tree shows through.

## Deployment note

DeepSeek middleware lives in Vite dev/preview server — production needs equivalent backend or the mystical page falls back to local template.

## Additional detail

See [reference.md](reference.md) for question flow order, score levels, and API shape.
