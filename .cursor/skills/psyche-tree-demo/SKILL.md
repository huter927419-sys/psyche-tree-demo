---
name: psyche-tree-demo
description: >-
  Develop the 雾岸六卷 demo (React 19 / Vite 8 / SQLite): six mystical books,
  trilingual UI (zh/en/ja), bookshelf + flip-book flow, Tree progress,
  DeepSeek per-book and holistic readings. Use when editing psyche-tree-demo,
  books, i18n, server API, assessments, or card art.
---

# 雾岸六卷 · psyche-tree-demo

## Esoteric system (see README)

The product follows a full mystical **system**, not only symbols:

| Pillar | In app |
|--------|--------|
| **Worldview** 世界观 | Mist shore, light pillar, tree, sacred time |
| **Field · Energy · Flow** 场域·能量·心流 | Sky/tree field, spirit-tide rite, one seal/page flow, treeEnergyFlow root→crown |
| **Meditation** 冥想 | Opening rite per book, one seal/page, tree awakening |
| **Prayer** 祈祷 | Email seal, dialogue check, closing blessing, whole oracle |
| **Reflection** 反思 | Portrait + oracle pages, return to shelf, review mode |
| **Symbol + revelation** | Sixfold facets → volume oracle → holistic oracle |

Full trilingual theory: [README.md](../../../README.md#玄学理论体系--mystical-framework--玄義体系).

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
- **1 integration**: `dimensionIndex: 7` (e.g. 观·整象 / 流·整湖)
- **1 attention**: after dim 3; decoy cards scoped to current book
- **Results**: psychology profile + per-book DeepSeek mystical reading (zh/en/ja cached)

## Journey & holistic oracle

- User email → one `journey` row; six `book_assessments` (one per book, any order)
- Journey `completed` when all six `BOOK_IDS` present (order-independent)
- **整象神谕** only on **bookshelf** (`BookshelfUltimateOracle` / `HolisticOracleOverlay`), not on book result last page
- Holistic prompt = six sections × (底层画像 `psychology_prompt_input` + **已示神谕** `mystical_reading_{locale}`)
- Before holistic generation, server ensures all six volume mystical readings exist

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
server/bookPrompts.ts         # prompt templates zh/en/ja
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
npm run dev                    # needs .env.local DEEPSEEK_API_KEY
npm run build
node scripts/verify-full-flow.mjs
node scripts/test-locale-switch.mjs
node scripts/complete-user-journey.mjs [email]
```

See [reference.md](reference.md) for file index and data flow.
