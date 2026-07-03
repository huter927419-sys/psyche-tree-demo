# psyche-tree-demo — Reference

## Question flow (9 pages)

| Index | Type | Notes |
|-------|------|-------|
| 0 | Dim 1 自主流动之感 | |
| 1 | Dim 2 生命方向之光 | |
| 2 | Attention | Must pick 星光探索者 |
| 3 | Dim 3 亲密联结之径 | |
| 4 | Dim 4 资源平衡之律 | |
| 5 | Dim 5 情绪安住之湖 | |
| 6 | Attention | Must pick 稳固之山 |
| 7 | Dim 6 变化适应之风 | |
| 8 | Dim 7 行动共振之步 | Auto-complete → results |

Built by `buildQuestionFlow()` in `questions.ts`.

## Score → level → copy

`scoring.ts` `scoreLevel()`:

| Average | Level |
|---------|-------|
| ≥ 1.5 | high |
| ≥ 0.5 | mid-high |
| ≥ -0.5 | mid |
| ≥ -1.5 | mid-low |
| else | low |

With single-card selection, average equals that card's score.

## Tree stages (STAGE_LABELS)

1 根 · 2 基 · 3 脉 · 4 干 · 5 枝 · 6 冠 · 7 光 — mapped to sephirot reveal bottom→top.

## DeepSeek request

Client POST `/api/mystical-reading` with psychology prompt input (dimension interpretations only, no user-facing scores). Server uses `DEEPSEEK_API_KEY`, model from env, `thinking: { type: 'disabled' }`.

## Card pattern list

All patterns in `scripts/generate-card-images.mjs` `PATTERNS` array — must match question card `pattern` fields.

## Mac demo recording (optional)

⇧⌘5 → 录制 → saves `.mov` to Desktop. Convert:

```bash
ffmpeg -i ~/Desktop/录屏.mov -c:v libx264 -c:a aac ~/Desktop/录屏.mp4
```
