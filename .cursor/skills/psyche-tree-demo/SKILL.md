---
name: psyche-tree-demo
description: >-
  Develop the 雾岸书架 demo (React/Vite): two mystical books (心象 psyche-tree,
  映心 emotional-flow), bilingual zh/en, bookshelf→cover→quiz→results, Tree of
  Life background, question seal reveal, DeepSeek reading. Use when editing
  psyche-tree-demo, books/i18n, BookReader, cards, scoring, tree visuals, or
  performance tiers.
---

# 雾岸书架 · psyche-tree-demo

## Product intent

Two floating memory volumes on a mist shelf. Each book: **shelf → cover → opening guide → quiz → 3 result pages → close**. Sacred monochrome aesthetic (`#0a0a0a`, silver lines, subtle gold). Psychology prose + optional DeepSeek mystical layer. **Never expose scores or selected card names** in results.

| Book ID | 中文 | English |
|---------|------|---------|
| `psyche-tree` | 心象 | Mindscape |
| `emotional-flow` | 映心 | Heart Mirror |

## Flow (App.tsx)

```
shelf → cover → reading (BookReader) → result → shelf
```

- **Shelf**: `Bookshelf.tsx` — pick book, language toggle, ambient phrases
- **Cover**: `BookCover.tsx` + `BookJourneyStage.tsx` — closed book scales to open
- **Quiz**: `BookReader.tsx` — replaces old `BookQuestionFlow` as main reader
- **Results**: `BookResult.tsx` — 心象画像 → 神谕 → 合书

## Non-negotiable UX rules

1. **One card per page** — select replaces prior choice; auto flip ~420ms; footer back only.
2. **Results**: interpretation only — no card names, scores, dimension tables.
3. **Psychology copy**: `【维度名】…` via `generatePsychologyProfile()` — never show averages.
4. **Card art**: smooth B&W gradients, **no** `feTurbulence` / grain. **PNG only** in `public/cards/` (`CardImage` uses `.png`).
5. **Tree**: organic trunk/branches/canopy (`treeOrganic.ts`); sephirot = glowing nodes. `treeRevealStage` from `countCompletedDimensions()`. Stage up → `TreeAwakeningOverlay`; stage down → recoil on `TreeOfLifeBackground`.
6. **Question left page order**: chapter tag → mystical guide → divider → **QuestionSealReveal** → action hint. Scenario prompt hidden until user taps seal.
7. **Reading focus**: dim sky/tree/cards during quiz only (`readingFocus` in App), not on results.

## Question seal (问印)

`QuestionSealReveal.tsx` — default hidden scenario; tap **问** (zh) / **Q** (en) stamp to reveal label + prompt; auto-hide ~4.2s. Styles: `.book-question-seal-*` in `index.css`. Reset per question via `key={q.id}`.

Mystical copy per dimension: `src/i18n/questionGuide.ts`. Opening ritual copy: `src/i18n/openingGuide.ts` → `BookOpeningGuide.tsx` (~2.8s overlay, Strict Mode safe).

## i18n

| Path | Role |
|------|------|
| `src/i18n/locale.ts` | `Locale`, persistence |
| `src/i18n/ui.ts` | UI strings (seal, hints, shelf) |
| `src/i18n/treeLabels.ts` | Tree stage labels |
| `src/i18n/questionGuide.ts` | Per-question mystical guides |
| `src/i18n/openingGuide.ts` | Book opening overlay |
| `src/data/*.en.ts` | EN question/profile/mystical data |
| `src/books/` | Book registry + per-book bundles |

`getBook(id, locale)` drives content. `LanguageToggle` on shelf, cover, reader. `AmbientPhraseLayer` crossfades background phrases (shelf/cover only).

## Performance (`useVisualTier`)

Tier ladder: shelf `full` → cover `balanced` → quiz `minimal`. Controls blur, ghost SVG blur, sacred illumination. **Bug to avoid**: `preferred: 'minimal'` must resolve to `'minimal'`, not fall through to `'balanced'`.

## Architecture map

| Area | Path |
|------|------|
| App state | `src/App.tsx` |
| Books | `src/books/registry.ts`, `psyche-tree/book.ts`, `emotional-flow/book.ts` |
| Reader | `src/components/book/BookReader.tsx` |
| Opening guide | `BookOpeningGuide.tsx` |
| Question seal | `QuestionSealReveal.tsx` |
| 3D flip | `useBookFlip.ts`, `BookShell.tsx` |
| Tree | `TreeOfLifeBackground.tsx`, `tree/treeOrganic.ts`, `treeData.ts` |
| Sky | `SkyAtmosphere.tsx` |
| Questions | `src/data/questions.ts` + `questions.en.ts` |
| Scoring | `src/data/scoring.ts` |
| DeepSeek | `server/deepseek.ts`, `server/bookPrompts.ts`, `mysticalReadingApi.ts` |
| Cards | `scripts/generate-card-images.mjs`, `card-art-renderer.mjs`, `card-prompts.mjs` |

## Attention checks

Two interleaved checks (after dims 2 & 5): `star-explorer`, `stable-mountain`. Failure → `attentionPassed: false` + disclaimer on results; does not block generation.

## Common tasks

### Add dimension question

Edit `questions.ts` (+ `questions.en.ts`). Card `pattern` must exist in `public/cards/{pattern}.png`. Regenerate: `npm run generate:cards`.

### Edit mystical question guide

`src/i18n/questionGuide.ts` — `rite`, `guide`, `note` per book/dimension/locale. Reference 「下方问印」 not plain 「读情境」.

### Edit seal UX

`QuestionSealReveal.tsx` + `ui.ts` (`sealMark`, `sealRevealHint`) + `.book-question-seal-*` CSS.

### DeepSeek

`.env.local`: `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL=deepseek-v4-pro`. Never commit keys. Production needs backend proxy.

### Verify

```bash
npm run dev
npm run build
```

## Styling

Book/paper: `src/index.css` (`.book-*`, flip ~1050ms). Left page mystical block: `.book-question-mystical`. Pages semi-transparent so tree shows through.

## Additional detail

See [reference.md](reference.md) for question flow, API shape, and file index.
