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

| Doc | 说明 |
|-----|------|
| [README.md](../../../README.md) | 产品概览、体验路径、开发 |
| [docs/theory/README.md](../../../docs/theory/README.md) | 理论 01–10 索引 |
| [01-雾岸世界.md](../../../docs/theory/01-雾岸世界.md) | 世界 |
| [02-照见论.md](../../../docs/theory/02-照见论.md) | 照见 |
| [03-各人之雾.md](../../../docs/theory/03-各人之雾.md) | 差异 |
| [04-生长论.md](../../../docs/theory/04-生长论.md) | 生长 |
| [05-缘论.md](../../../docs/theory/05-缘论.md) | 缘 |
| [06-心流论.md](../../../docs/theory/06-心流论.md) | 心流 |
| [07-万象论.md](../../../docs/theory/07-万象论.md) | 万象 |
| [08-观论.md](../../../docs/theory/08-观论.md) | 观 |
| [09-命论.md](../../../docs/theory/09-命论.md) | 命 / 形而上学 |
| [10-整象论.md](../../../docs/theory/10-整象论.md) | 整象 |
| [appendix-现代对应.md](../../../docs/theory/appendix-现代对应.md) | 现代符号与概念 |
| [volume-rite-copy.md](../../../docs/volume-rite-copy.md) | 修持三语文案 |
| [SKILL.md](./SKILL.md) | Agent 约定 |
| [reference.md](./reference.md) | 本文件：路径与数据流 |

## Volume rite ↔ theory

| BookId | 理论 | 修持 MD |
|--------|------|---------|
| `psyche-tree` | [02 照见论](../../../docs/theory/02-照见论.md) | [§心象](../../../docs/volume-rite-copy.md#第一卷--心象) |
| `emotional-flow` | [02](../../../docs/theory/02-照见论.md) · [03](../../../docs/theory/03-各人之雾.md) | [§映心](../../../docs/volume-rite-copy.md#第二卷--映心) |
| `mind-light` | [02 照见论](../../../docs/theory/02-照见论.md) | [§明思](../../../docs/volume-rite-copy.md#第三卷--明思) |
| `bond-thread` | [05 缘论](../../../docs/theory/05-缘论.md) | [§缘书](../../../docs/volume-rite-copy.md#第四卷--缘书) |
| `flow-balance` | [06 心流论](../../../docs/theory/06-心流论.md) | [§流衡](../../../docs/volume-rite-copy.md#第五卷--流衡) |
| `direction-light` | [04 生长论](../../../docs/theory/04-生长论.md) | [§向光](../../../docs/volume-rite-copy.md#第六卷--向光) |
| 归树 / 整象 | [08 观论](../../../docs/theory/08-观论.md) · [10 整象论](../../../docs/theory/10-整象论.md) | [§归树](../../../docs/volume-rite-copy.md#归树--return-to-the-tree--帰樹) |

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

## 场域 · 心流 · 观（文档用语）

产品代码里仍可见 openingGuide「能量之波」、`treeEnergyFlow` 等命名；**读者向文档**请用新理论栈，勿从第一章推导：

| 体验 | 读 |
|------|-----|
| 入卷慢、一页一印、不示分 | [06 心流论](../../../docs/theory/06-心流论.md) |
| 湖 / 河 / 星空等卷场 | [01 雾岸世界](../../../docs/theory/01-雾岸世界.md) · [07 万象论](../../../docs/theory/07-万象论.md) |
| 对话确认、归树 | [08 观论](../../../docs/theory/08-观论.md) |
| U / Φ / A / F、State Object | [appendix-现代对应.md](../../../docs/theory/appendix-现代对应.md) |

勿混淆 **心流**（consciousness flow，06）与 **`flow-balance` 卷**（守衡面向，06 文中已分）。

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
