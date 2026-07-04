# 雾岸六卷 · 心象生命之树探索

网页版自我探索 Demo：**六卷 mystical books**（心象 / 映心 / 明思 / 缘书 / 流衡 / 向光），以**翻书式**问答收集六个心理学维度 + 整象封印，背景是一棵随进度**逐层展开的生命之树**；每卷给出**心象画像**与 **DeepSeek 单卷神谕**，六卷完成后在**雾岸书架**呈现**整象神谕**。支持 **中文 / English / 日本語**。

---

## 体验概览

| 阶段 | 内容 |
|------|------|
| 雾岸书架 | 六卷书、语言切换、完成六卷后「最终神谕」浮层 |
| 封面 | 揭开当前卷 |
| 问答 | 8 页（6 维度 + 1 注意力检查 + 1 整象封印），每页**仅选 1 张卡**，选中后**自动翻页** |
| 背景 | 有机生命之树 + 卡巴拉光点；完成维度时「树脉觉醒」 |
| 单卷结果 | 心象画像 → 神谕之页 → 合书（整象提示回书架） |
| 整象神谕 | 六卷全部完成后，仅在书架展示；与六卷已示神谕保持一致 |

视觉：深黑 `#0a0a0a`、黑白意象卡、淡金点缀；zh / en / ja 各用独立 mystic 字体。

---

## 功能要点

- **六卷独立测向**：每卷 6 维度 + 1 整象维度；完成顺序不影响 journey 完成判定
- **SQLite 持久化**：邮箱登录、journey、assessment、三语神谕缓存
- **DeepSeek 解读**：单卷与整象均走 API；失败时本地 fallback
- **整象逻辑**：prompt 含六卷「底层画像 + 已示神谕」，生成前确保六卷单卷神谕已就绪
- **注意力检查**：第 4 页（维度 3 后）， decoy 卡按当前卷隔离
- **背景音乐**：Mixkit 空灵 ambient（书架 / 答题 / 结果各一首，淡入切换）；树脉觉醒短铃
- **卡片资源**：`public/cards/` PNG（1120×560）；`npm run generate:cards`

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

# 可选
SQLITE_PATH=./data/psyche-tree.sqlite
OPENAI_API_KEY=...           # AI 生图
```

API Key 仅由 Vite 开发服务器中间件使用，不会打进前端包。

---

## 脚本

| 命令 | 说明 |
|------|------|
| `npm run dev` | 本地开发（含 API 中间件） |
| `npm run dev:lan` | 局域网访问 |
| `npm run build` | 生成卡图 + 类型检查 + 生产构建 |
| `npm run generate:cards` | 生成题目卡 PNG |
| `node scripts/reset-db.mjs` | 清空 SQLite |
| `node scripts/verify-full-flow.mjs` | API 全流程验证 |
| `node scripts/test-locale-switch.mjs` | 三语神谕缓存验证 |
| `node scripts/complete-user-journey.mjs [email]` | 为指定邮箱补全六卷 |

---

## 项目结构

```
psyche-tree-demo/
├── .cursor/skills/psyche-tree-demo/   # Cursor Agent 技能（架构与约定）
│   ├── SKILL.md                       # 主技能：六卷结构、添加新书、整象规则
│   └── reference.md                   # 路径索引、数据流、验证脚本
├── data/psyche-tree.sqlite            # 本地 DB（gitignore）
├── public/audio/                      # Mixkit 背景音乐
├── public/cards/                      # 题目卡 PNG
├── scripts/                           # 验证、重置、生图
├── server/
│   ├── api/router.ts                  # REST API
│   ├── db/                            # schema、migrations、repositories
│   ├── services/                      # mystical + holistic reading
│   ├── bookPrompts.ts                 # DeepSeek 模板 zh/en/ja
│   └── deepseek.ts
└── src/
    ├── App.tsx
    ├── books/                         # 六卷 content + registry
    ├── components/
    │   ├── bookshelf/                 # 书架、整象浮层
    │   ├── book/                      # 翻书、答题、结果
    │   └── tree/                      # 生命之树
    ├── i18n/                          # ui、guides、treeLabels
    └── services/                      # assessmentApi、journeyApi
```

---

## Cursor Skill 与文档对应关系

| 文档 | 用途 | 何时读 |
|------|------|--------|
| **SKILL.md** | Agent 工作流：六卷结构、加书步骤、整象规则、不可破坏的 UX | 改功能、加卷、调 i18n / 神谕 |
| **reference.md** | 文件路径、维度名表、reading 数据流、验证脚本、BGM 曲目 | 查具体文件、调试 API / DB |
| **README.md**（本文件） | 人类可读：体验说明、安装、脚本、部署 |  onboarding、演示、运维 |

---

## 交互约定（维护时请保持）

1. 每页单选，选中后 ~420ms 自动翻页
2. 结果页不展示选项、分数、维度表
3. 整象神谕只在书架展示，不在单卷最后一页生成
4. `treeRevealStage` 仅随维度 1–6 变化，整象维度不计入树进度
5. 三语切换读缓存，不重新计分

详细开发说明见 [.cursor/skills/psyche-tree-demo/SKILL.md](.cursor/skills/psyche-tree-demo/SKILL.md)。

---

## 部署说明

DeepSeek 与 SQLite 当前挂在 **Vite dev/preview 中间件**上。上线生产环境需独立后端或 Serverless 代理，否则神谕会使用本地 fallback。

---

## 技术栈

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · better-sqlite3 · DeepSeek API · sharp
