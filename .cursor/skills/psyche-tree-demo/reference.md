# psyche-tree-demo — Reference

## Books

| ID | Title (zh/en) | Questions source |
|----|---------------|------------------|
| `psyche-tree` | 心象 / Mindscape | `src/data/questions.ts` |
| `emotional-flow` | 映心 / Heart Mirror | `src/books/emotional-flow/` + EN bundle |

Registry: `src/books/registry.ts` → `getBook(id, locale)`.

## App phases

| Phase | Component | Notes |
|-------|-----------|-------|
| `shelf` | `Bookshelf` | Two volumes, music, lang toggle |
| `cover` | `BookCover`, `BookJourneyStage` | Pickup animation, `BookClosedVisual` |
| `reading` | `BookReader` | Opening guide → quiz spreads |
| `result` | `BookResult` | 3 pages, then close to shelf |

## Question flow (9 pages per book)

| Index | Type | Notes |
|-------|------|-------|
| 0 | Dim 1 | |
| 1 | Dim 2 | |
| 2 | Attention | Must pick 星光探索者 / star-explorer |
| 3 | Dim 3 | |
| 4 | Dim 4 | |
| 5 | Dim 5 | |
| 6 | Attention | Must pick 稳固之山 / stable-mountain |
| 7 | Dim 6 | |
| 8 | Dim 7 | Auto-complete → results |

Built by `buildQuestionFlow()` in `questions.ts`.

## Left page content stack

1. `book-chapter-tag` — dimension title or「对话确认」
2. `book-question-mystical` — rite / guide / note from `questionGuide.ts`
3. `book-question-divider`
4. `QuestionSealReveal` — tap seal → scenario label + `q.prompt` → auto-hide
5. `book-page-hint--action` — right-page instruction

## Question seal strings (ui.ts)

| Key | zh | en |
|-----|----|----|
| `scenarioLabel` | 问印 | Question Seal |
| `sealMark` | 问 | Q |
| `sealRevealHint` | 点以观问 | Tap to reveal |

Default `autoHideMs`: 4200.

## Score → level

`scoring.ts` `scoreLevel()`:

| Average | Level |
|---------|-------|
| ≥ 1.5 | high |
| ≥ 0.5 | mid-high |
| ≥ -0.5 | mid |
| ≥ -1.5 | mid-low |
| else | low |

Single-card selection: average = that card's score.

## Tree stages

1 根 · 2 基 · 3 脉 · 4 干 · 5 枝 · 6 冠 · 7 光 — `Sephira.revealStage` bottom→top.

## Visual tier

| Surface | Tier | Effects reduced |
|---------|------|-----------------|
| Shelf | `full` | All ambient effects |
| Cover | `balanced` | Some blur/ghost trimmed |
| Quiz | `minimal` | No card backdrop-blur, minimal SVG blur |

Hook: `src/hooks/useVisualTier.ts`.

## DeepSeek

POST `/api/mystical-reading` — psychology prompt (interpretations only). Server: `server/deepseek.ts`, per-book prompts in `server/bookPrompts.ts`. Thinking disabled.

## Card pipeline

```bash
npm run generate:cards       # PNG via card-art-renderer.mjs
npm run generate:cards:ai    # DALL-E 3, needs OPENAI_API_KEY
```

Patterns in `scripts/generate-card-images.mjs` `PATTERNS` — must match question `pattern` fields. SVG fallbacks removed; PNG only.

## Key new files (2025–2026 refactor)

```
src/components/book/BookReader.tsx
src/components/book/BookOpeningGuide.tsx
src/components/book/QuestionSealReveal.tsx
src/components/book/BookClosedVisual.tsx
src/components/book/BookJourneyStage.tsx
src/components/bookshelf/Bookshelf.tsx
src/components/i18n/LanguageToggle.tsx
src/components/i18n/AmbientPhraseLayer.tsx
src/components/SkyAtmosphere.tsx
src/hooks/useVisualTier.ts
src/i18n/
src/books/
scripts/card-art-renderer.mjs
server/bookPrompts.ts
```

## Mac demo recording (optional)

⇧⌘5 → record → Desktop `.mov`. Convert:

```bash
ffmpeg -i ~/Desktop/录屏.mov -c:v libx264 -c:a aac ~/Desktop/录屏.mp4
```
