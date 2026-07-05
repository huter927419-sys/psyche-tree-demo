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
| **Worldview** 世界观 | Mist shore, six volumes, tree — [appendix](../../../docs/theory/appendix-现代对应.md) · [01–06](../../../docs/theory/01-本源.md) |
| **Mirroring & rites** 照见与修持 | [02 观照](../../../docs/theory/02-观照.md) [03 流动](../../../docs/theory/03-流动.md) [06 向光](../../../docs/theory/06-向光.md) ↔ [volume-rite-copy](../../../docs/volume-rite-copy.md) |
| **Meditation · Prayer · Reflection** | Opening rite, one seal/page, dialogue check, portrait + oracle |
| **Symbol + revelation** | Six facets → volume oracle → holistic oracle (shelf only) |

Docs: [README](../../../README.md) · [theory 01–06](../../../docs/theory/README.md) · [appendix](../../../docs/theory/appendix-现代对应.md) · [rite copy](../../../docs/volume-rite-copy.md).

## Theory stack (product docs)

Read **01–06** for meaning; read **implement/01–08** before changing flow, rites, or oracles—**theory → practice**, not a code index: [docs/theory/implement/README.md](../../../docs/theory/implement/README.md).

| Layer | Files |
|-------|-------|
| Read态 + 世界观 | [appendix](../../../docs/theory/appendix-现代对应.md) · [01–06](../../../docs/theory/01-本源.md) |
| **Practice layer** | [implement/01–08](../../../docs/theory/implement/README.md) — seven-section template; read before flow/rite/oracle changes |

## Six books (one facet each)

| BookId | 卷 · Vol. | 简体 | English | 日本語 |
|--------|-----------|------|---------|--------|
| `psyche-tree` | 心象 | 自我内在 | Inner self | 自我の内在 |
| `emotional-flow` | 映心 | 情感流动 | Emotional flow | 感情の流れ |
| `mind-light` | 明思 | 思维脉动 | Mind patterns | 思考の脈 |
| `bond-thread` | 缘书 | 联结之丝 | Connection | 縁の糸 |
| `flow-balance` | 流衡 | 守衡应变 | Balance & adapt | 流れの均衡 |
| `direction-light` | 向光 | 方向步履 | Direction & steps | 方向と歩み |

## Per-book structure (8 pages)

```
Dim 1–3 → attention check → Dim 4–6 → integration (dimensionIndex 7)
```

- **6 dimensions**: main facet (`dimensionIndex` 1–6); tree progress counts these only
- **Theory layer**: `books/shared/theoryLayer.ts` enriches **prompts** + question **guide notes** (zh/en/ja source; zhTw via OpenCC); answer cards stay psychology-only. Concept mapping: [appendix-现代对应.md](../../../docs/theory/appendix-现代对应.md) — not the narrative theory stack.
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

**Full rite copy (zh / en / ja)** — [docs/volume-rite-copy.md](../../../docs/volume-rite-copy.md). Theory: [README §三理论栈](../../../README.md#三理论栈) · [implement/01–08](../../../docs/theory/implement/README.md). Regenerate: `npm run generate:rite-docs`. Source: `volumeRite.ts`.

| BookId | 卷 | 理论 | 修持 MD |
|--------|-----|------|---------|
| `psyche-tree` | 心象 | [02 观照](../../../docs/theory/02-观照.md) | [§心象](../../../docs/volume-rite-copy.md#第一卷-心象) |
| `emotional-flow` | 映心 | [02 观照](../../../docs/theory/02-观照.md) · [03 流动](../../../docs/theory/03-流动.md) | [§映心](../../../docs/volume-rite-copy.md#第二卷-映心) |
| `mind-light` | 明思 | [02 观照](../../../docs/theory/02-观照.md) | [§明思](../../../docs/volume-rite-copy.md#第三卷-明思) |
| `bond-thread` | 缘书 | [05 共生](../../../docs/theory/05-共生.md) | [§缘书](../../../docs/volume-rite-copy.md#第四卷-缘书) |
| `flow-balance` | 流衡 | [03 流动](../../../docs/theory/03-流动.md) | [§流衡](../../../docs/volume-rite-copy.md#第五卷-流衡) |
| `direction-light` | 向光 | [06 向光](../../../docs/theory/06-向光.md) | [§向光](../../../docs/volume-rite-copy.md#第六卷-向光) |

**Do not** reintroduce `BookOpeningGuide` flash for entry—the entry rite overlay replaces it.

## Product red lines · 产品红线（实践层）

Read [02 观照 · 息间](../../../docs/theory/02-观照.md) and [implement/02 意识论](../../../docs/theory/implement/02-意识论.md) before changing entry flow, seals, or oracles.

| Red line | Rationale |
|----------|-----------|
| **Entry opens in 息间** | Every volume prepends a shared breath-interval step in `volumeRite.ts`—mirror before response, not after explanation |
| **Do not rush past 息间** | First entry step waits `ENTRY_BREATH_INTERVAL_MS` (~4s) before「下一段」; final button reads「在息间后，进入问印」 |
| **Aware before answer** | No scores, no verdict copy on seals; entry/exit rites guard the fork before old groove answers |
| **Do not remove entry overlay** | Skipping `VolumeRiteOverlay` entry breaks theory↔product chain ([02 意识 · 实践原则](../../../docs/theory/implement/02-意识论.md)) |
| **Do not substitute post-hoc explanation** | Holistic/oracle copy reflects what was mirrored—never replace pre-response pause with「学会内观」tips |

Theory term **息间** = breath between person and response; **回息** = return to this breath (entry rite copy + pause UX).

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
