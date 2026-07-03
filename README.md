# 心象生命之树探索

网页版自我探索 Demo：以**翻书式**问答收集七个心理学维度的意象选择，背景是一棵随进度**逐层展开的生命之树**；最终给出**心象画像**（心理学解读）与 **DeepSeek 神谕**（玄学象征层），不展示选了哪张卡、也不展示分数。

---

## 体验概览

| 阶段 | 内容 |
|------|------|
| 封面 | 揭开生命之书 |
| 问答 | 9 页（7 维度 + 2 道对话确认），每页**仅选 1 张卡**，选中后**自动翻页** |
| 背景 | 有机树干 / 枝叶 / 树冠 + 卡巴拉光点；完成维度时「树脉觉醒」，回退时树层收回 |
| 结果 | 3 页：心象画像 → 神谕之页 → 合书 |

视觉：深黑 `#0a0a0a`、黑白意象卡、淡金点缀、衬线中文。卡面为平滑渐变线稿（无颗粒噪点），每张卡背景有淡生命之树剪影。

---

## 功能要点

- **七维心理画像**：根据卡片分值映射为五档倾向，输出 `【维度名】…` 式解读（用户不可见均分）
- **DeepSeek 玄学层**：`deepseek-v4-pro` 生成象征性解读；失败时回退本地模板
- **注意力检查**：第 3、7 页要求指定卡片（星光探索者 / 稳固之山），未通过时结果页提示「部分对话确认未能匹配，以下解读仅供参考」
- **背景音乐**：Mixkit 免版税冥想 MP3（封面 / 问答 / 结果各一首，自动淡入切换），右下角可静音；树脉觉醒时叠加短铃
- **卡片资源**：`public/cards/` 下 PNG（1120×560）+ SVG 回退；可脚本批量生成或 DALL·E 3 单独生图

---

## 快速开始

```bash
git clone <repo>
cd psyche-tree-demo
npm install
cp .env.example .env.local   # 填入 DEEPSEEK_API_KEY
npm run dev                  # http://localhost:5173
```

### 环境变量（`.env.local`）

```env
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_MODEL=deepseek-v4-pro

# 可选：AI 生图
OPENAI_API_KEY=your_openai_api_key_here
```

API Key 仅由 Vite 开发服务器中间件使用，不会打进前端包。

---

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发 |
| `npm run build` | 生成卡图 + 类型检查 + 生产构建 |
| `npm run preview` | 预览构建结果 |
| `npm run generate:cards` | SVG 生成并导出 PNG |
| `npm run export:cards:png` | 仅 SVG → PNG |
| `npm run generate:cards:ai` | DALL·E 3 按 `card-prompts.mjs` 生图；`--force` / `--only=pattern1,pattern2` |

---

## 项目结构

```
psyche-tree-demo/
├── .cursor/skills/psyche-tree-demo/   # Cursor Agent 技能（架构与约定）
├── public/cards/                      # 题目卡图 pattern.png / .svg
├── scripts/
│   ├── generate-card-images.mjs       # 程序化 SVG（无噪点）
│   ├── export-cards-png.mjs           # sharp 导出 PNG
│   ├── generate-card-images-ai.mjs    # OpenAI 可选
│   └── card-prompts.mjs
├── server/deepseek.ts                 # DeepSeek 中间层
└── src/
    ├── App.tsx                        # welcome | questions | result
    ├── components/
    │   ├── book/                      # 翻书 UI、答题流、结果页
    │   ├── tree/                      # 有机树、觉醒动画、进度 HUD
    │   ├── TreeOfLifeBackground.tsx
    │   ├── CardImage.tsx
    │   └── QuestionCard.tsx
    ├── data/
    │   ├── questions.ts               # 题目 + 注意力检查穿插
    │   ├── scoring.ts
    │   ├── psychologyProfile.ts
    │   └── mysticalReading.ts
    └── services/mysticalReadingApi.ts
```

---

## 交互约定（维护时请保持）

1. 每页单选，选中后 ~420ms 自动翻页；底部仅「上一页」
2. 结果页不展示选项、分数、维度表
3. 卡图禁止 fractalNoise 颗粒；优先 PNG
4. 背景树形以 `treeOrganic.ts` 有机层为主，卡巴拉连线为辅
5. `treeRevealStage` 随当前页进度增减；增加触发觉醒 overlay，减少触发回缩动画

详细开发说明见 [.cursor/skills/psyche-tree-demo/SKILL.md](.cursor/skills/psyche-tree-demo/SKILL.md)。

---

## 部署说明

DeepSeek 接口当前挂在 **Vite dev/preview 中间件**上。上线生产环境需：

- 将 `server/deepseek.ts` 迁到独立后端，或
- 使用 Serverless 代理

否则神谕页会使用本地模板 fallback。

---

## 技术栈

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · DeepSeek API · sharp（卡图导出）

---

## 后续可扩展

- 结果导出 / 分享链接
- 移除或软化注意力检查
- 独立后端与正式部署
- 多语言
