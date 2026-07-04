# psyche-tree-demo — Reference

## Locale & reading cache

| Code | UI label | SQLite columns |
|------|----------|----------------|
| `zh` | 简体 | `mystical_reading_zh`, `holistic_reading_zh` |
| `zhTw` | 繁體 | `mystical_reading_zh_tw`, `holistic_reading_zh_tw` |
| `en` | English | `mystical_reading_en`, `holistic_reading_en` |
| `ja` | 日本語 | `mystical_reading_ja`, `holistic_reading_ja` |

First oracle request generates all four in parallel; locale switch reads cache only.

**zh vs zhTw (esoteric copy)**

| Layer | `zh` | `zhTw` | Same meaning? |
|-------|------|--------|---------------|
| Shelf, books, guides, theory prefixes, questions | Simplified source | OpenCC `cn→tw` (incl. function return strings) | Yes |
| Volume + holistic oracle | DeepSeek simplified | DeepSeek **Traditional** (separate cache) | No — wording may differ |
| Psychology profile templates | Simplified dim text | OpenCC from book content | Yes |

Fonts: `html[lang="zh-CN"]` → Noto Serif SC; `html[lang="zh-Hant"]` → Noto Serif TC; mystic titles → Zhi Mang Xing (both).

Traditional UI text: `opencc-js` in `src/i18n/traditionalChinese.ts` (+ server mirror).

Homepage screenshots: `docs/screenshots/homepage/homepage-{zh,zh-tw,en,ja}.png` — regenerate with `node scripts/capture-homepage-screenshots.mjs` (dev server required).

Migration: `server/db/migrations/007_locale_zh_tw.sql`

## Book page flow

| Page | Content |
|------|---------|
| 1–3 | Dimensions 1–3 |
| 4 | Attention check |
| 5–7 | Dimensions 4–6 |
| 8 | Integration (dimensionIndex 7) |

Built by `buildBookQuestionFlow()` in `books/shared/questionFlow.ts`.

## Documentation map · 文档索引

| Doc | 简体 | English | 日本語 |
|-----|------|---------|--------|
| [README.md](../../../README.md) | 产品与运维 | Product + ops | 製品+運用 |
| [docs/volume-rite-copy.md](../../../docs/volume-rite-copy.md) | 修持三语全文 | Full rite zh/en/ja | 導き三語全文 |
| [docs/theory/](../../../docs/theory/) | 五层理论 | Five theory layers | 五層理論 |
| [SKILL.md](../SKILL.md) | Agent 约定 | Agent conventions | Agent 規約 |
| [reference.md](./reference.md) | 路径与数据流 | Paths & data flow | パスとデータ流 |

## Volume rite sections

| BookId | Facet | Sections |
|--------|-------|----------|
| `psyche-tree` | 照见自我 | 静坐三分钟 · 允许沉默 · 无风湖面 |
| `emotional-flow` | 照见情感 | 只流动不控制 · 落叶顺河 |
| `mind-light` | 照见思维 | 减噪 · 夜空北极星 |
| `bond-thread` | 照见关系 | 靠近时的心 · 丝线仪式 |
| `flow-balance` | 照见节奏 | 力量流向 · 船心在中流 |
| `direction-light` | 照见方向 | 今天一小步 · 远方微光 |

## Dimension titles by book

### 心象 `psyche-tree`
界石 · 映波 · 定息 · 自照 · 内守 · 根息 → **观·整象**

### 映心 `emotional-flow`
流势 · 流言 · 流联 · 流身 · 流息 · 流变 → **流·整湖**

### 明思 `mind-light`
思流 · 学纹 · 专镜 · 辨光 · 创泉 · 择印 → **脉·归光**

### 缘书 `bond-thread`
丝近 · 丝温 · 丝距 · 丝信 · 丝守 · 丝复 → **缘·整丝**

### 流衡 `flow-balance`
分力 · 守源 · 雾行 · 急缓 · 转势 · 定舟 → **衡·整流**

### 向光 `direction-light`
光向 · 光义 · 步履 · 共振 · 持愿 · 探径 → **向·整光**

## Client paths

```
src/App.tsx                         # phase: shelf | cover | questions | result
src/books/registry.ts
src/books/{id}/content.ts
src/books/shared/createBook.ts
src/components/bookshelf/           # Bookshelf, HolisticOracleOverlay, UltimateOracle, ReturnToTreeOverlay
src/components/book/BookReader.tsx  # save assessment, fetch mystical reading, volume rites
src/components/book/VolumeRiteOverlay.tsx
src/i18n/ui.ts                      # UI strings zh (+ zhTw via OpenCC), en, ja
src/i18n/traditionalChinese.ts      # OpenCC + convertStringsDeep (incl. functions)
src/i18n/questionGuide.ts           # + questionGuide.ja.ts
src/i18n/openingGuide.ts           # brief field tags (legacy flash; rites in volumeRite.ts)
src/i18n/volumeRite.ts              # entry / exit / return-to-tree / core proposition
src/i18n/treeLabels.ts
src/services/assessmentApi.ts
src/services/journeyApi.ts
src/audio/backgroundMusic.ts        # welcome / questions / result tracks
```

## Server paths

```
server/api/router.ts
server/readingTestFallback.ts       # PSYCHE_READING_TEST_FALLBACK + X-Psyche-Reading-Test-Fallback
server/db/schema.sql
server/db/repositories/journeys.ts    # BOOK_IDS, buildHolisticPromptInput, completion
server/db/repositories/assessments.ts # save, mystical reading cache columns
server/services/mysticalReadingService.ts
server/services/holisticReadingService.ts
server/bookPrompts.ts
```

## QA reading test fallback

| Trigger | Where |
|---------|--------|
| `PSYCHE_READING_TEST_FALLBACK=1` | `.env.local`; wired in `vite.config.ts` middleware ctx |
| `X-Psyche-Reading-Test-Fallback: 1` | Per-request; default in `verify-full-flow.mjs` |

Writes four-locale fallback text with `source=fallback`, skips DeepSeek. Use for CI/local smoke only.

## Holistic UI flow (bookshelf)

```
journey.status === completed && 6 unique bookIds
  → BookshelfUltimateOracle renders trigger
  → click (or holisticFlashSignal after 6th book close)
  → ReturnToTreeOverlay if sessionStorage psyche-return-tree-{id} unset
  → HolisticOracleOverlay with cached or fetched reading
```

## Reading data flow

```
answers → computeResults() → dimensions + psychology_prompt_input
  → save book_assessments
  → resolveMysticalReading (zh / zhTw / en / ja parallel, cached)

six books complete → journey.status = completed
  → user opens whole oracle on shelf
  → Return to Tree overlay (once per journey, sessionStorage)
  → resolveHolisticReading
  → ensureVolumeOraclesForHolistic (all 6 mystical readings)
  → buildHolisticPromptInput (portrait + 已示神谕 per book)
  → DeepSeek holistic template → holistic_reading_{zh,zh_tw,en,ja}
  (or test fallback when PSYCHE_READING_TEST_FALLBACK / header set)
```

## Tree progress

`countCompletedDimensions()` counts only `dimensionIndex <= 6`. Integration does not advance tree stage. `treeProgressMax: 6` on all books.

## Field, energy, flow (玄义)

| Term | Meaning | Code / UX |
|------|---------|-----------|
| **场域** field | Mist-shore + per-volume sub-field; density peaks during seals/oracle | shelf, `SkyAtmosphere`, book open |
| **能量** energy | Spirit-tide (灵息), not score; root→crown on tree | openingGuide “能量之波”, `treeEnergyFlow.tsx` |
| **心流** flow state | Immersive one-seal/page rite; ≠ `flow-balance` book facet | auto flip, no scores, dialogue check restores presence |

Do not conflate **心流** (consciousness flow) with **流衡** `flow-balance` (balance facet).

## Scoring

`computeResults()` in `scoring.ts`. Attention decoys via `getAttentionCheckCards(q, book)` scoped to current book.

## Background music (Mixkit)

| Phase | File | Track |
|-------|------|-------|
| welcome (shelf/cover) | `nature-meditation.mp3` | #345 |
| questions | `spirit-woods.mp3` | #139 |
| result | `rest-now.mp3` | #584 |

## Verification scripts

| Script | Purpose |
|--------|---------|
| `scripts/reset-db.mjs` | Wipe SQLite |
| `scripts/verify-full-flow.mjs` | API + reading poll + test fallback header |
| `scripts/verify-rite-flow.mjs` | Playwright UI: entry/exit rites + Return to Tree |
| `scripts/verify-e2e.mjs` | Browser-oriented checks |
| `scripts/test-locale-switch.mjs` | zh / zhTw / en / ja reading cache |
| `scripts/capture-homepage-screenshots.mjs` | Four homepage PNGs for README |
| `scripts/complete-user-journey.mjs` | Fill 6 books for an email |
| `scripts/test-multi-user-concurrent.mjs` | Isolation |

**Expected green runs (dev up):** `verify-full-flow` 39/39 with test-fallback header; `verify-rite-flow` 14/14 with Playwright + Chrome.

## Card images

`public/cards/{pattern}.png` — `npm run generate:cards` (`scripts/generate-card-images.mjs`)
