---
name: psyche-tree-demo
description: >-
  Develop the 雾岸六卷 demo (React 19 / Vite 8 / SQLite): six mystical books,
  quad-lingual UI (zh / zhTw / en / ja), bookshelf + flip-book flow, volume rite
  cycle (entry / exit / Return to Tree), Tree progress, DeepSeek per-book and
  holistic readings, QA test-fallback for verify scripts. Use when editing
  psyche-tree-demo, books, i18n, volumeRite, server API, assessments, or card art.
---

# 雾岸六卷 · psyche-tree-demo

## Esoteric system (see README)

The product follows a full mystical **system**, not only symbols:

| Pillar | In app |
|--------|--------|
| **Core proposition** 核心命题 | Calibration of seeing—not hunting answers; `volumeRite.ts`, Return to Tree before holistic oracle |
| **Volume rite cycle** 修持环 | Entry / exit overlays per book (`VolumeRiteOverlay`); six volumes → 归树 → 整象 |
| **Worldview** 世界观 | Mist shore, light pillar, tree, sacred time |
| **Field · Energy · Flow** 场域·能量·心流 | Sky/tree field, spirit-tide rite, one seal/page flow, treeEnergyFlow root→crown; enhanced theory maps **Φ·A·F** to rite / attention-oracle / mist field |
| **Meditation** 冥想 | Opening rite per book, one seal/page, tree awakening |
| **Prayer** 祈祷 | Email seal, dialogue check, closing blessing, whole oracle |
| **Reflection** 反思 | Portrait + oracle pages, return to shelf, review mode |
| **Symbol + revelation** | Sixfold facets → volume oracle → holistic oracle |

Full trilingual theory: [README.md](../../../README.md#玄学理论体系--mystical-framework--玄義体系).  
Concise state-system theory (zh/en/ja): [README.md](../../../README.md#psyche-tree--六维书--简明理论--concise-theory--簡明理論).  
Advanced generalization layer (State · Force · Field): [README.md](../../../README.md#psyche-tree-system--进阶泛化层--advanced-generalization--進階汎化層).  
Enhanced theory (Flow · Awareness · Field unified): [README.md](../../../README.md#psyche-tree-system--增强理论版--enhanced-theory--拡張理論).  
Metaphysical extension (Stream · Origin · Causality): [README.md](../../../README.md#psyche-tree-system--形而上扩展层--metaphysical-extension--形而上拡張層).  
Locales & SQLite (zh / zhTw / en / ja): [README.md](../../../README.md#语言与数据库--locales--sqlite--言語と-db).

## Six books (one facet each)

| BookId | 卷 | 测向 |
|--------|-----|------|
| `psyche-tree` | 心象 | 自我内在 |
| `emotional-flow` | 映心 | 情感流动 |
| `mind-light` | 明思 | 思维脉动 |
| `bond-thread` | 缘书 | 联结之丝 |
| `flow-balance` | 流衡 | 守衡应变 |
| `direction-light` | 向光 | 方向步履 |

## Per-book structure (8 pages)

```
Dim 1–3 → attention check → Dim 4–6 → integration (dimensionIndex 7)
```

- **6 dimensions**: main facet (`dimensionIndex` 1–6); tree progress counts these only
- **Theory layer**: `books/shared/theoryLayer.ts` enriches **prompts** + question **guide notes** (zh/en/ja source; zhTw via OpenCC); answer cards stay psychology-only for layout
- **1 integration**: `dimensionIndex: 7` (e.g. 观·整象 / 流·整湖)
- **1 attention**: after dim 3; decoy cards scoped to current book
- **Results**: psychology profile + per-book DeepSeek mystical reading (zh / zhTw / en / ja cached separately)

## Journey & holistic oracle

- User email → one `journey` row; six `book_assessments` (one per book, any order)
- Journey `completed` when all six `BOOK_IDS` present (order-independent)
- **整象神谕** only on **bookshelf** (`BookshelfUltimateOracle` / `HolisticOracleOverlay`), not on book result last page
- **归树 (Return to Tree)** before first holistic open per journey: `ReturnToTreeOverlay` → core proposition → closing → holistic; once per journey via `sessionStorage` key `psyche-return-tree-${journeyId}`
- Holistic prompt = six sections × (底层画像 `psychology_prompt_input` + **已示神谕** `mystical_reading_{locale}`)
- Before holistic generation, server ensures all six volume mystical readings exist

## Volume rite cycle (修持环)

| Phase | Component | Copy |
|-------|-----------|------|
| Entry | `VolumeRiteOverlay` mode=`entry` in `BookReader` | `getVolumeEntryRite(bookId, locale)` |
| Questions | existing flip-book flow | — |
| Exit | `VolumeRiteOverlay` mode=`exit` after last seal saved | `getVolumeExitRite(bookId, locale)`; 心象 exit has optional journal textarea |
| Return to Tree | `ReturnToTreeOverlay` in `BookshelfUltimateOracle` | `getReturnToTreeRite` + `getCoreProposition` |

Copy lives in `src/i18n/volumeRite.ts` (zh / en / ja; zhTw via OpenCC). Styles: `.volume-rite-overlay`, `.return-tree-overlay` in `index.css`.

**Do not** reintroduce `BookOpeningGuide` flash for entry—the entry rite overlay replaces it.

## Reading test fallback (QA only)

Instant mystical/holistic readings for verify scripts—**never enable in production**.

| Switch | Effect |
|--------|--------|
| `PSYCHE_READING_TEST_FALLBACK=1` in `.env.local` | All reading requests skip DeepSeek |
| Header `X-Psyche-Reading-Test-Fallback: 1` | Same, per request (used by `verify-full-flow.mjs`) |

Implementation: `server/readingTestFallback.ts` → early return in `mysticalReadingService` / `holisticReadingService`; `router.ts` passes `readingOptions(req, ctx)`; `vite.config.ts` sets ctx default from env.

## Adding a book

1. `src/books/{id}/content.ts` — `LocalizedBookPack`
2. `src/books/{id}/book.ts` — `createLocalizedBook(pack)`
3. `src/books/types.ts` — extend `BookId`
4. `src/books/registry.ts` — register factory
5. `src/i18n/openingGuide.ts`, `questionGuide.ts`, `questionGuide.ja.ts`
6. `src/i18n/treeLabels.ts` — stage labels + ambient phrases
7. `server/bookPrompts.ts` — per-book + holistic DeepSeek templates

Shared: `books/shared/createBook.ts`, `questionFlow.ts`, `card.ts`, `profileHelpers.ts`, `findCard.ts`

## Server (Vite middleware)

```
server/api/router.ts          # REST: journeys, assessments, readings, holistic
server/db/                    # SQLite schema + migrations + repositories
server/services/              # mysticalReadingService, holisticReadingService
server/readingTestFallback.ts # QA instant readings (env / header)
server/bookPrompts.ts         # prompt templates zh / zhTw / en / ja
server/deepseek.ts            # DeepSeek chat calls
```

DB path: `data/psyche-tree.sqlite` (or `SQLITE_PATH`). Reset: `node scripts/reset-db.mjs`.

## Non-negotiable UX

- One card per page, auto flip ~420ms, no scores shown
- Question seal reveal for scenario prompt
- `useVisualTier`: shelf full / cover balanced / quiz minimal
- Psychology copy: `【title】desc`; integration last
- Locale switch reads cached readings; does not re-score

## Verify

```bash
npm run dev                    # needs .env.local DEEPSEEK_API_KEY (optional PSYCHE_READING_TEST_FALLBACK=1)
npm run build
node scripts/verify-full-flow.mjs      # 39 checks; default test-fallback header; polls 202
node scripts/verify-rite-flow.mjs      # Playwright: entry/exit rites + 归树 + holistic (needs Chrome)
node scripts/test-locale-switch.mjs
node scripts/complete-user-journey.mjs [email]
node scripts/capture-homepage-screenshots.mjs   # docs/screenshots/homepage/*.png
```

Optional env for scripts: `READING_POLL_MS=90000`, `BASE_URL`, `SQLITE_PATH`.

See [reference.md](reference.md) for file index and data flow.
