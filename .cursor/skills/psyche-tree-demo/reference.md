# psyche-tree-demo — Reference

## Book page flow

| Page | Content |
|------|---------|
| 1–3 | Dimensions 1–3 |
| 4 | Attention check |
| 5–7 | Dimensions 4–6 |
| 8 | Integration (dimensionIndex 7) |

Built by `buildBookQuestionFlow()` in `books/shared/questionFlow.ts`.

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
src/components/bookshelf/           # Bookshelf, HolisticOracleOverlay, UltimateOracle
src/components/book/BookReader.tsx  # save assessment, fetch mystical reading
src/i18n/ui.ts                      # all UI strings zh/en/ja
src/i18n/questionGuide.ts           # + questionGuide.ja.ts
src/i18n/openingGuide.ts
src/i18n/treeLabels.ts
src/services/assessmentApi.ts
src/services/journeyApi.ts
src/audio/backgroundMusic.ts        # welcome / questions / result tracks
```

## Server paths

```
server/api/router.ts
server/db/schema.sql
server/db/repositories/journeys.ts    # BOOK_IDS, buildHolisticPromptInput, completion
server/db/repositories/assessments.ts # save, mystical reading cache columns
server/services/mysticalReadingService.ts
server/services/holisticReadingService.ts
server/bookPrompts.ts
```

## Reading data flow

```
answers → computeResults() → dimensions + psychology_prompt_input
  → save book_assessments
  → resolveMysticalReading (zh/en/ja parallel, cached)

six books complete → journey.status = completed
  → resolveHolisticReading
  → ensureVolumeOraclesForHolistic (all 6 mystical readings)
  → buildHolisticPromptInput (portrait + 已示神谕 per book)
  → DeepSeek holistic template → holistic_reading_{zh,en,ja}
```

## Tree progress

`countCompletedDimensions()` counts only `dimensionIndex <= 6`. Integration does not advance tree stage. `treeProgressMax: 6` on all books.

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
| `scripts/verify-full-flow.mjs` | API + save + readings smoke test |
| `scripts/verify-e2e.mjs` | Browser-oriented checks |
| `scripts/test-locale-switch.mjs` | zh/en/ja reading cache |
| `scripts/complete-user-journey.mjs` | Fill 6 books for an email |
| `scripts/test-multi-user-concurrent.mjs` | Isolation |

## Card images

`public/cards/{pattern}.png` — `npm run generate:cards` (`scripts/generate-card-images.mjs`)
