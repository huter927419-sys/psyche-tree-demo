---
name: psyche-tree-demo
description: >-
  Develop the 雾岸六卷 demo (React 19 / Vite 8 / SQLite): six mystical books +
  序卷《同观》guide, quad-lingual UI (zh / zhTw / en / ja), bookshelf + flip-book
  flow, volume rite cycle (entry / exit / Return to Tree), Tree progress, DeepSeek
  per-book and holistic readings, QA test-fallback for verify scripts. Use when editing
  psyche-tree-demo, books, guide volume, i18n, volumeRite, server API, assessments,
  or card art.
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
| **序卷《同观》** | Pre-volume guide on shelf—mirror before six books; read-only, no assessment/oracle |

Docs: [README](../../../README.md) · [theory 01–06](../../../docs/theory/README.md) · [appendix](../../../docs/theory/appendix-现代对应.md) · [rite copy](../../../docs/volume-rite-copy.md).

## Theory stack (product docs)

Read **01–06** for meaning; read **implement/01–08** before changing flow, rites, or oracles—**theory → practice**, not a code index: [docs/theory/implement/README.md](../../../docs/theory/implement/README.md).

| Layer | Files |
|-------|-------|
| Read态 + 世界观 | [appendix](../../../docs/theory/appendix-现代对应.md) · [01–06](../../../docs/theory/01-本源.md) |
| **Practice layer** | [implement/01–08](../../../docs/theory/implement/README.md) — seven-section template; read before flow/rite/oracle changes |

## 序卷《同观》· guide volume (homepage)

**Not** a seventh `BookId`—a read-only prologue before the six volumes. Shelf slot sits **above** the six-book row (`BookshelfGuideSlot`).

| Aspect | Detail |
|--------|--------|
| Title | 同观 · 序卷 (`guideCoverTitle` / `guideCoverSubtitle`) |
| Shelf tagline | 照见同观先 (`guideCoverShelfTagline`; cover uses full `guideCoverTagline`) |
| Spreads | **39** total: 序 2 + 肆章×9 + 封底 1 |
| Enter CTA | Last spread →「进入雾岸」(`enterSpreadIndex` = final spread) |
| Persistence | `localStorage` only—no server row, no journey assessment |
| UI state | **No**「已读过」badge; progress dot only while `inProgress` |

### App phase

`AppPhase`: `shelf` | **`guide`** | `cover` | `questions`

```
shelf → click 同观 → **in-place on mist shelf** (no pickup / center zoom) → cover copy under same slot book → 展卷 → reader opens in guide block above six volumes
  → 进入雾岸 on last spread → back to shelf + volume handoff beacon on six books
```

- `guideStep`: `cover` | `reading`; reuses `BookJourneyStage` + `BookShell` like six volumes
- `readingFocus` true during guide reading (dims tree/sky; `ShoreZenAmbience` subdued)
- `isWelcomeAtmosphere` on shelf and guide cover; photo backdrop + crossfade on shelf/guide cover

### Guide navigation (序卷 UX)

Shared **息间翻页** vocabulary for 同观 **and** six volumes — do not reintroduce「上一页 / 翻页 / Next page」on book footers.

| Action | 简体 label | en | ja | Implementation |
|--------|------------|-----|-----|----------------|
| Previous spread | **溯息** | Turn back | 前息へ | `ui.guideTurnPrev` — footer `BookNav`; guide also: click **left page** |
| Next spread | **展息** | Turn forward | 次息へ | `ui.guideTurnNext` — footer; guide also: click **right page** |
| Restart from opening | **归序首** | Return to opening | 序首に還る | `ui.guideRestartReading` — **guide only**; resets spread via `saveGuideSpreadIndex(0)` |
| Pick seal (no next btn) | **择一即展息** | Choose one—the spread breathes forward | 一つ選べ、息自ら展ず | `ui.selectOneHint` — six-volume question spreads |

- `BookShell` optional `pageClickEnabled` + `onPageClick('left'|'right')` — **guide only**; six-volume quiz keeps card selection on right page
- **BookReader** footer: always `ui.guideTurnPrev` / `ui.guideTurnNext` (not hardcoded Chinese)
- `ui.prevPage` / `ui.nextPage` — legacy aliases kept in sync with guide labels; prefer `guideTurnPrev` / `guideTurnNext` in new code
- Review-mode hints (`coverReviewHint`, `reviewModeHint`): say 溯息、展息 — not 翻页

### Guide typography (zh / zhTw)

Section rites (`起`, `序`, 同观, …) use `.guide-spread-rite`. Single-character labels get `.guide-spread-rite--sigil` (auto when `rite.length <= 1` in `GuidePageContent`).

| Locale | Normal rite | Sigil (起/序) |
|--------|-------------|---------------|
| zh-CN / zh-Hant | ~0.72rem mystic | ~1.02rem |

Tune in `index.css` under `html[lang="zh-CN"]` / `html[lang="zh-Hant"]` — avoid reverting to ~0.62rem (too small).

### Chapter spread template (×4)

Each chapter (`chapterTemplate.ts`) → **9 spreads**:

```
起 → 现象 → 转问 → 同观(东/现代) → 雾岸观 → 雾岸问(现实+内观) → 此息停 → 入卷义 → 收束
```

Right pages often `pause` (rest: 息 glyph + void mist). Block kinds: `hook`, `phenomenon`, `turn`, `tongguanEast` / `tongguanModern`, `shoreView`, `shoreQuestion`, `breath`, `volumeMeaning`, `close`, `lines`, `part`, `pause`, `illustration`.

**Guide illustrations** (`GuideIllustration.tsx`): all five ids (`01-shore-near` … `05-enter-mist`) share one walk-in — scale + drift, white mist lifts, image clears from blur; starts after page turn rests (`ready={!flipping}`) and image load. Prefetch via `prefetchGuideIllustrations()`. Timing: `illustrationMotion.ts` (`22s` + `2.6s` hold).

**Guide auto turn** (`GuideReader.tsx`, `guideAutoTurn.ts`): **同观序卷 only** — six volumes (`BookReader`) have no reading auto-turn; their ~420ms flip is card-selection only. Default **on** for guide (`psyche-guide-auto-turn`); illustration spreads wait for walk-in + hold, text spreads use estimated reading dwell; last enter spread stops auto. Toggle: 自动展息 / 手动展息. Manual 溯息/展息 always works.

### Guide red lines

| Do | Don't |
|----|-------|
| Mirror-only copy; 同观 quotes; two 雾岸问 per chapter | Scores, per-book oracle, holistic oracle |
| Fixed section labels via `ui.guideSection*` | Assessment save, `BookId`, tree `revealStage` from guide |
| Resume spread index locally |「已读过」shelf badge or completion mark text |

### Key paths

```
src/books/guide/content.ts       # zh / en / ja source; zhTw via OpenCC
src/books/guide/chapterTemplate.ts
src/books/guide/storage.ts       # psyche-guide-* localStorage keys
src/books/guide/meta.ts          # getGuideCoverBook() — cover stub only
src/components/guide/GuideCover.tsx | GuideReader.tsx | GuidePageContent.tsx
src/components/bookshelf/BookshelfGuideSlot.tsx | BookshelfVolumeCover.tsx
src/components/ambient/ShoreZenAmbience.tsx   # mist / cloud / wind (atmospheric only)
```

Handoff: `markGuideCompleted()` sets `psyche-guide-volume-handoff` → six volumes get `bookshelf-book--beacon` until first volume opened (`clearGuideVolumeHandoff` in `App.tsx`).

## Homepage atmosphere (书架背景)

Six ink-wash **photo backdrops** crossfade on welcome phases (`shelf`, guide cover, volume cover, closing).

| Item | Detail |
|------|--------|
| Assets | `public/backgrounds/01-mist-arrival.png` … `06-night-shore.png` (2560×1440) |
| Registry | `src/books/backgroundScenes.ts` — `BACKGROUND_SCENE_ORDER`, bump `BACKGROUND_SCENE_VERSION` on cache bust |
| Import | `node scripts/import-background-image.mjs <id> <path>` |
| UI | `HomeBackgroundSlideshow` — ~9s hold, ~3.2s crossfade, Ken Burns drift |
| Layering | Slideshow z-0 → `TreeOfLifeBackground` (`photoBackdrop` dims base/crown) → `SkyAtmosphere` + `ShoreZenAmbience` in `.ambient-atmosphere-stack` (~38% opacity when photos active) |
| When active | `showPhotoBackdrop` in `App.tsx` — shelf, cover, guide, **and in-book reading**; `subdued` + lighter scrim when `readingFocus` |

**Tree on photo backdrop:** SVG ~36% opacity, soft blur — mist sigil, not foreground. CSS: `.tree-bg-root--photo-backdrop`.

**Cover typography:** hero closed book titles `.book-cover-title-mystic` + `.book-page-title` bumped for readability (zh mystic fonts).

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
- **Results**: psychology profile + per-book DeepSeek mystical reading (zh / zhTw / en / ja cached separately); each oracle = **照见** + **`【雾中一步】`** (one symbolic micro-practice, not command)

## Journey & holistic oracle

- User email → one `journey` row; six `book_assessments` (one per book, any order)
- Journey `completed` when all six `BOOK_IDS` present (order-independent)
- **整象神谕** only on **bookshelf** (`BookshelfUltimateOracle` / `HolisticOracleOverlay`), not on book result last page
- **归树 (Return to Tree)** before first holistic open per journey: `ReturnToTreeOverlay` → core proposition → closing → holistic; once per journey via `sessionStorage` key `psyche-return-tree-${journeyId}`
- Holistic prompt = six sections × (底层画像 `psychology_prompt_input` + **已示神谕** `mystical_reading_{locale}`); response ends with **`【整树之微行】`**
- Before holistic generation, server ensures all six volume mystical readings exist

## API auth (Bearer access token)

Journey reads/writes require **`Authorization: Bearer <psk_…>`** — not bare `journeyId` or email lookup.

| Topic | Detail |
|-------|--------|
| Issue token | `POST /api/journeys` `{ email, locale }` → `accessToken` (`psk_` prefix) |
| Resume | Same `POST` with `{ email, locale, accessToken }` when client still has token |
| Bootstrap | Existing users without token: one-time `POST` with email only issues token |
| Storage | Client `localStorage`: `psyche-access-token` (+ `psyche-journey-id`, email, user id) |
| Deprecated | `GET /api/journeys?email=` → **410**; `X-Journey-Id` header → ignored |
| Legacy | `POST /api/mystical-reading` → **410** unless `PSYCHE_ALLOW_LEGACY_MYSTICAL=1` |

Server: `server/auth/token.ts`, `server/api/auth.ts`, migration `008_journey_access_token.sql` (`access_token_hash` SHA-256).

**QA scripts** share `scripts/lib/apiClient.mjs` — `createApiClient()`, `createJourney()`, auto Bearer + optional `X-Psyche-Reading-Test-Fallback`.

**Mobile typography:** shelf covers use `aspect-ratio: 2/3`, mystic title stack; zh-Hant uses `Ma Shan Zheng` + `Long Cang` via `html[lang="zh-Hant"]` rules in `index.css`.

## Production deploy (`sixfacets.com`)

| Item | Value |
|------|-------|
| SSH | `ssh remote-177` → `root@177.3.32.202` |
| App dir | `/mydata/psyche-tree-demo` |
| Static | nginx serves `dist/` |
| API | systemd `psyche-tree-demo` → `npm run start:api` (`server/production.ts` on `127.0.0.1:5173`) |
| DB | `SQLITE_PATH=/mydata/psyche-tree-demo/data/psyche-tree.sqlite` in `.env.local` |

```bash
ssh remote-177 'cd /mydata/psyche-tree-demo && git fetch origin && git reset --hard origin/main && npm install && npm run build && systemctl restart psyche-tree-demo'
```

Clear test data (production only):

```bash
ssh remote-177 'node -e "const Database=require(\"better-sqlite3\");const db=new Database(\"/mydata/psyche-tree-demo/data/psyche-tree.sqlite\");db.exec(\"DELETE FROM book_assessments; DELETE FROM journeys; DELETE FROM users;\");db.close();"'
```

Verify against prod: `BASE_URL=https://www.sixfacets.com node scripts/verify-full-flow.mjs`

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
| **Oracle micro-practice is symbolic, not prescription** | `【雾中一步】` / `【整树之微行】` = one small breath-space gesture in metaphor; forbid「你应该/必须」; UI note in `ui.oracleContemplationNote` |

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

## Server (Vite middleware + production API)

```
server/api/router.ts          # REST: journeys, assessments, readings, holistic
server/api/auth.ts            # Bearer token verify + journey ownership
server/auth/token.ts          # psk_ issue / hash / verify
server/production.ts          # standalone API for nginx /api proxy (prod)
server/db/                    # SQLite schema + migrations + repositories
server/services/              # mysticalReadingService, holisticReadingService
server/readingTestFallback.ts # QA instant readings (env / header)
server/bookPrompts.ts         # prompt templates zh / zhTw / en / ja
server/deepseek.ts            # DeepSeek chat calls
```

DB path: `data/psyche-tree.sqlite` (or `SQLITE_PATH`). Reset: `node scripts/reset-db.mjs`.

### API surface (auth required unless noted)

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/api/journeys` | Public (returns `accessToken`) |
| `GET` | `/api/journeys/:id` | Bearer |
| `GET` | `/api/journeys?email=` | **410** deprecated |
| `POST` | `/api/journeys/:id/assessments` | Bearer |
| `GET` | `/api/assessments/:id` | Bearer (owner only) |
| `POST` | `/api/assessments/:id/mystical-reading` | Bearer |
| `POST` | `/api/journeys/:id/holistic-reading` | Bearer |

## Non-negotiable UX

- One card per page, auto flip ~420ms, no scores shown
- Question seal reveal for scenario prompt
- `useVisualTier`: shelf full / cover balanced / quiz minimal; guide reading uses `readingFocus`
- Psychology copy: `【title】desc`; integration last
- Locale switch reads cached readings; does not re-score
- Guide: click left/right page **or** footer 溯息/展息; 归序首 resets spread only (not logout)
- Six volumes: footer 溯息/展息 same keys as guide; question spreads show 择一即展息 until seal chosen
- Homepage: photo slideshow only when `availableBackgroundScenes().length > 0`

## Verify

```bash
npm run dev                    # needs .env.local DEEPSEEK_API_KEY (optional PSYCHE_READING_TEST_FALLBACK=1)
npm run build
node scripts/verify-full-flow.mjs      # A–F + auth + UI; Bearer via apiClient; test-fallback header
node scripts/verify-rite-flow.mjs      # Playwright: entry/exit rites + 归树 + holistic (needs Chrome)
node scripts/verify-e2e.mjs            # API smoke zh/en
node scripts/test-locale-switch.mjs
node scripts/complete-user-journey.mjs [email]
node scripts/log-cross-access-404.mjs  # verbose cross-user Bearer isolation log
node scripts/export-oracle-report.mjs [email]
node scripts/capture-homepage-screenshots.mjs   # docs/screenshots/homepage/*.png
```

Optional env for scripts: `READING_POLL_MS=90000`, `BASE_URL`, `SQLITE_PATH`. Shared client: `scripts/lib/apiClient.mjs`.

See [reference.md](reference.md) for file index and data flow.
