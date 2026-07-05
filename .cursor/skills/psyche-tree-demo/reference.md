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

## 序卷《同观》· guide volume

| Item | Detail |
|------|--------|
| Role | Read-only prologue on shelf; explains what six volumes mirror |
| Not in | `BookId`, `BOOK_IDS`, journey assessments, tree progress, DeepSeek |
| Spreads | 39 — see `buildGuideContent()` in `content.ts` |
| Resume | `psyche-guide-spread-index`, `psyche-guide-opened`, `psyche-guide-completed` |
| Handoff | `psyche-guide-volume-handoff` → beacon on six books until one opens |

### localStorage keys (`storage.ts`)

| Key | Purpose |
|-----|---------|
| `psyche-guide-opened` | User opened guide at least once |
| `psyche-guide-spread-index` | Last spread index (0-based) |
| `psyche-guide-completed` | Reached「进入雾岸」 |
| `psyche-guide-volume-handoff` | Post-complete nudge toward six volumes |

### Guide UI CSS (`index.css`)

- `.guide-spread-panel`, `.guide-spread-rite`, `.guide-spread-verse`, `.guide-spread-body`
- `.guide-spread-rite--sigil` — single-char section labels (起/序); zh ~1.02rem, other rites ~0.72rem
- `.guide-spread-panel--breath` → `@keyframes guide-breath-cycle` (verse fade cycle)
- `.guide-spread-panel--rest` → `.guide-spread-void`, glyph 息
- `.book-page--interactive` — guide click-to-turn (left=溯息, right=展息)
- `.home-bg-slideshow`, `.home-bg-slide` — homepage photo crossfade
- `.tree-bg-root--photo-backdrop` — faint tree over ink-wash backgrounds
- `.shore-zen-*` — atmospheric layer (wrapped in `.ambient-atmosphere-stack` in `App.tsx`)

### Guide i18n keys (`ui.ts`)

`guideCover*`, `guideSection*`, `guideAxisEast` / `guideAxisModern`, `guideEnterShore`, `guideTurnPrev` (溯息), `guideTurnNext` (展息), `guideRestartReading` (归序首), `guidePageTurnPrevAria`, `guidePageTurnNextAria`, `guideVolumeHandoffHint`, `guideFirstVisitHint` — zh source; zhTw OpenCC; en/ja tables in `ui.ts`.

### Six-volume book nav keys (`ui.ts`)

Same **息间翻页** labels as guide — wired in `BookReader` → `BookNav`:

| Key | 简体 | Used when |
|-----|------|-----------|
| `guideTurnPrev` | 溯息 | Footer back on questions + results + review |
| `guideTurnNext` | 展息 | Footer forward on results + review |
| `selectOneHint` | 择一即展息 | Question spread — no forward button until seal picked |
| `reviewModeHint` | …可溯息、展息细读 | Review mode footer hint |
| `coverReviewHint` | …溯息、展息细读… | Cover when volume already mirrored |

`BookShell` / `BookNav` defaults: 溯息 / 展息 / 择一即展息 (fallback if caller omits labels).

## Documentation map · 文档索引

| Doc | 说明 |
|-----|------|
| [README.md](../../../README.md) | 产品概览、体验路径、开发 |
| [docs/theory/README.md](../../../docs/theory/README.md) | 理论：01–06 + 附录 + implement |
| [appendix-现代对应.md](../../../docs/theory/appendix-现代对应.md) | 读态总论 |
| [implement/README.md](../../../docs/theory/implement/README.md) | 实现层 01–08 索引 |
| [01-本源.md](../../../docs/theory/01-本源.md) | 世界观：变与本 |
| [02-观照.md](../../../docs/theory/02-观照.md) | 认识自己 |
| [03-流动.md](../../../docs/theory/03-流动.md) | 变化与节奏 |
| [04-因应.md](../../../docs/theory/04-因应.md) | 回应与差异 |
| [05-共生.md](../../../docs/theory/05-共生.md) | 连接与相互影响 |
| [06-向光.md](../../../docs/theory/06-向光.md) | 方向与整象 |
| [appendix-现代对应.md](../../../docs/theory/appendix-现代对应.md) | 现代符号与概念 |
| [volume-rite-copy.md](../../../docs/volume-rite-copy.md) | 修持三语文案 |
| [SKILL.md](./SKILL.md) | Agent 约定 |
| [reference.md](./reference.md) | 本文件：路径与数据流 |

## Volume rite ↔ theory

| BookId | 理论 | 修持 MD |
|--------|------|---------|
| `psyche-tree` | [02 观照](../../../docs/theory/02-观照.md) | [§心象](../../../docs/volume-rite-copy.md#第一卷-心象) |
| `emotional-flow` | [02 观照](../../../docs/theory/02-观照.md) · [03 流动](../../../docs/theory/03-流动.md) | [§映心](../../../docs/volume-rite-copy.md#第二卷-映心) |
| `mind-light` | [02 观照](../../../docs/theory/02-观照.md) | [§明思](../../../docs/volume-rite-copy.md#第三卷-明思) |
| `bond-thread` | [05 共生](../../../docs/theory/05-共生.md) | [§缘书](../../../docs/volume-rite-copy.md#第四卷-缘书) |
| `flow-balance` | [03 流动](../../../docs/theory/03-流动.md) | [§流衡](../../../docs/volume-rite-copy.md#第五卷-流衡) |
| `direction-light` | [06 向光](../../../docs/theory/06-向光.md) | [§向光](../../../docs/volume-rite-copy.md#第六卷-向光) |
| 归树 / 整象 | [02 观照](../../../docs/theory/02-观照.md) · [06 向光](../../../docs/theory/06-向光.md) | [§归树](../../../docs/volume-rite-copy.md#归树-return-to-the-tree-帰樹) |

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
src/App.tsx                         # phase: shelf | guide | cover | questions; showPhotoBackdrop
src/books/backgroundScenes.ts       # homepage slideshow ids + version
src/books/volumeCovers.ts           # cover art ids (guide + six volumes)
src/books/guide/                    # 序卷 content, template, storage (local only)
src/books/registry.ts
src/books/{id}/content.ts
src/books/shared/createBook.ts
src/components/ambient/HomeBackgroundSlideshow.tsx
src/components/bookshelf/           # Bookshelf, BookshelfGuideSlot, BookshelfVolumeCover,
                                    # HolisticOracleOverlay, UltimateOracle, ReturnToTreeOverlay
src/components/book/BookCoverArt.tsx
src/components/guide/               # GuideCover, GuideReader, GuidePageContent, GuideIllustration
src/components/ambient/ShoreZenAmbience.tsx
src/components/book/BookShell.tsx   # flip + BookNav defaults 溯息/展息; pageClickEnabled (guide)
src/components/book/BookReader.tsx  # footer uses guideTurnPrev/Next; mystical reading + volume rites
src/components/book/BookClosedVisual.tsx
src/components/book/VolumeRiteOverlay.tsx
src/components/TreeOfLifeBackground.tsx  # photoBackdrop prop
src/i18n/ui.ts                      # guideTurnPrev/Next, selectOneHint, review hints; guideSection*
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
server/bookPrompts.ts                 # volume + holistic prompts; appends 雾中一步 / 整树之微行 guidance
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

## 体验 ↔ 理论（文档用语）

| 体验 | 读 |
|------|-----|
| **入卷息间** · 首段回息 · ~4s 后再续 | [02 观照 · 息间](../../../docs/theory/02-观照.md) · [02 意识论](../../../docs/theory/implement/02-意识论.md) · `ENTRY_BREATH_INTERVAL_MS` |
| 入卷慢、一页一印、不示分 | [03 流动](../../../docs/theory/03-流动.md) · [附录](../../../docs/theory/appendix-现代对应.md#修持-理论-产品) |
| 湖 / 河 / 星空等卷意象 | [appendix · U](../../../docs/theory/appendix-现代对应.md) · [02 观照](../../../docs/theory/02-观照.md) |
| 对话确认、归树 | [02 观照](../../../docs/theory/02-观照.md) · [06 向光](../../../docs/theory/06-向光.md) |
| U / Φ / A / F | [appendix-现代对应.md](../../../docs/theory/appendix-现代对应.md) |

勿混淆 **流衡卷**（守衡面向，03）与 **入卷顺畅**（附录 Φ，产品用语「心流」）。

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

## Visual assets & import scripts

| Asset | Path | Import script |
|-------|------|---------------|
| Card art (runtime) | `public/cards/{pattern}.png` | `scripts/import-card-image.mjs` |
| Card art (legacy SVG) | `public/cards-procedural/` | `scripts/generate-card-images.mjs` (not in build) |
| Volume covers | `public/covers/{id}.png` (1280×1680) | `scripts/import-cover-image.mjs` |
| Guide illustrations | `public/guide/01-shore-near.png` … `05-enter-mist.png` | `scripts/import-guide-illustration.mjs` |
| Homepage backgrounds | `public/backgrounds/01-mist-arrival.png` … `06-night-shore.png` | `scripts/import-background-image.mjs` |

Registry files: `src/books/volumeCovers.ts`, `src/books/guide/illustrations.ts`, `src/books/backgroundScenes.ts`. Bump `?v=` version constants after re-import.

Card prompts: `scripts/card-prompts.mjs` (ink-wash style prefix for AI generation).

## Card images (legacy note)

Runtime cards are **imported ink-wash PNGs** in `public/cards/`. Do not re-enable `generate:cards` in production build unless switching back to procedural art.
