#!/usr/bin/env node
/**
 * Build docs/theory/雾岸理论全书.md
 * - Full 简体 extraction from theory stack
 * - TOC links use line numbers (work in Cursor/VS Code editor Cmd+click)
 * - Native markdown headings (work in Markdown preview)
 */
const fs = require('fs');
const path = require('path');

const theoryRoot = path.join(__dirname);
const outPath = path.join(theoryRoot, '雾岸理论全书.md');

function countScripts(text) {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  const jp = (text.match(/[\u3040-\u30ff]/g) || []).length;
  return { cjk, latin, jp };
}

function isJapaneseLine(line) {
  const { jp } = countScripts(line);
  if (jp >= 2) return true;
  if (/[のはをがにでとへもかなりより]|実践問|世界観|観照|非ず|できる|すべての/.test(line) && jp >= 1) return true;
  if (/^\*.*\*$/.test(line.trim()) && /より|に非ず|どう|なぜ|か？/.test(line)) return true;
  return false;
}

function shouldSkipLine(line) {
  const t = line.trim();
  if (!t || /^```/.test(t) || /^<!--/.test(t)) return false;
  if (isJapaneseLine(t)) return true;
  if (/^\*[^*].*\*$/.test(t)) {
    const inner = t.slice(1, -1);
    const { cjk, latin, jp } = countScripts(inner);
    if (jp >= 1 && jp >= cjk * 0.15) return true;
    if (latin > cjk * 1.2 && cjk < 8) return true;
  }
  const { cjk, latin } = countScripts(t);
  if (latin > 0 && cjk === 0) return true;
  if (latin > cjk * 2 && cjk < 8) return true;
  return false;
}

function cleanLine(line, { asQuote = false } = {}) {
  let s = line
    .replace(/^>\s?/, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .trim();
  if (s.includes('·') && !/\*\*/.test(s)) {
    const parts = s.split('·').map(p => p.trim()).filter(p => {
      if (isJapaneseLine(p) || shouldSkipLine(p)) return false;
      const { cjk, latin } = countScripts(p);
      return cjk > 0 && !(latin > cjk && cjk < 3);
    });
    if (parts.length) s = parts.join(' · ');
  }
  if (asQuote && s) s = `> ${s}`;
  return s;
}

function extractChinese(md) {
  const lines = md.split('\n');
  const blocks = [];
  let mode = 'body';
  let buf = [];
  let inBq = false;

  const flushBuf = (asQuote = false) => {
    const text = buf
      .map(l => cleanLine(l, { asQuote }))
      .filter(Boolean)
      .join(asQuote ? '\n' : '\n\n')
      .trim();
    if (text) blocks.push(text);
    buf = [];
    inBq = false;
  };

  for (const raw of lines) {
    const line = raw;
    if (/^>\s*\*\*简体\*\*/.test(line)) {
      flushBuf();
      mode = 'zh';
      continue;
    }
    if (/^>\s*\*\*English\*\*/.test(line) || /^>\s*\*\*英語\*\*/.test(line)) {
      flushBuf(true);
      mode = 'en';
      continue;
    }
    if (/^>\s*\*\*日本語\*\*/.test(line)) {
      flushBuf(true);
      mode = 'ja';
      continue;
    }
    if (line.startsWith('>')) {
      inBq = true;
      if (mode === 'zh' || mode === 'body') {
        if (!shouldSkipLine(line)) buf.push(line);
      }
      continue;
    }
    if (inBq || mode !== 'body') {
      flushBuf(mode === 'zh' || (mode === 'body' && buf.length));
      mode = 'body';
    }
    if (/^---\s*$/.test(line)) continue;
    if (shouldSkipLine(line)) continue;
    if (countScripts(line).cjk === 0) continue;
    blocks.push(cleanLine(line));
  }
  flushBuf();
  return blocks.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

function demoteHeadings(text, baseLevel) {
  return text
    .split('\n')
    .map(line => {
      const m = line.match(/^(#{1,6})\s+(.*)/);
      if (!m) return line;
      return '#'.repeat(Math.min(6, m[1].length + baseLevel)) + ' ' + m[2];
    })
    .join('\n');
}

function stripNav(text) {
  return text
    .split('\n')
    .filter(l => {
      const t = l.trim();
      return !(t.startsWith('→') && /实践篇索引|回\s*理论栈|从\s*01\s*存在论|交叉读索引/.test(t));
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripDuplicateChapterTitle(text) {
  return text.replace(/^#{1,3}\s+第[一二三四五六七八]章[^\n]*\n\n/, '');
}

function load(rel, { implement = false } = {}) {
  const md = fs.readFileSync(path.join(theoryRoot, rel), 'utf8');
  let text = stripNav(demoteHeadings(extractChinese(md), implement ? 2 : 1));
  if (implement) text = stripDuplicateChapterTitle(text);
  return text;
}

/** 《关系论·总纲》：古文 · 白话并置；栈外基础，非三语 blockquote 体例 */
function loadOverview() {
  const md = fs.readFileSync(path.join(theoryRoot, '..', '关系论·总纲.md'), 'utf8');
  const lines = md.split('\n');
  const blocks = [];
  let buf = [];
  let inEnJa = false;

  const flush = () => {
    const text = buf
      .map(l => cleanLine(l))
      .filter(Boolean)
      .join('\n\n')
      .trim();
    if (text) blocks.push(text);
    buf = [];
  };

  for (const raw of lines) {
    const line = raw;
    if (/^## 往下读什么/.test(line)) break;
    if (/^>\s*\*\*English\*\*/.test(line) || /^>\s*\*\*日本語\*\*/.test(line)) {
      flush();
      inEnJa = true;
      continue;
    }
    if (inEnJa) {
      if (line.startsWith('>')) continue;
      inEnJa = false;
    }
    if (/^---\s*$/.test(line)) {
      flush();
      continue;
    }
    if (/^#{1,6}\s/.test(line)) {
      flush();
      blocks.push(cleanLine(line));
      continue;
    }
    if (/^\*\*古文\*\*\s*$/.test(line.trim()) || /^\*\*白话\*\*\s*$/.test(line.trim())) {
      flush();
      blocks.push(line.trim());
      continue;
    }
    const t = line.trim();
    if (!t) continue;
    if (shouldSkipLine(line) && !t.startsWith('|') && !t.startsWith('-') && !t.startsWith('>')) continue;
    if (countScripts(line).cjk === 0 && !t.startsWith('|') && !t.startsWith('-') && !t.startsWith('>')) continue;
    buf.push(line);
  }
  flush();
  let text = stripNav(demoteHeadings(blocks.join('\n\n').replace(/\n{3,}/g, '\n\n').trim(), 1));
  // 构建脚本已包「前置 · 《关系论·总纲》」外壳，去掉源文一级标题与副题
  text = text.replace(/^#{1,2}\s+《关系论[^]*?\n\n(?=\#{1,3}\s+一、)/m, '');
  return text;
}

function vscodeSlug(header) {
  return header
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
}

const MARK = (id) => `<!-- @${id} -->\n`;

const worldview = [
  { id: 'part-01', file: '01-本源.md', title: '本源', ask: '我是谁？世界是什么？为什么会变化？', eye: '变 → 态 → 命 → 觉 → 世' },
  { id: 'part-02', file: '02-观照.md', title: '观照', ask: '我如何认识自己？', eye: '息间 · 照见开叉于接缘链' },
  { id: 'part-03', file: '03-流动.md', title: '流动', ask: '为什么生命一直在变化？', eye: '稳者变中归息' },
  { id: 'part-04', file: '04-因应.md', title: '因应', ask: '为什么同一件事，每个人都不同？', eye: '命是回应的编织' },
  { id: 'part-05', file: '05-共生.md', title: '共生', ask: '为什么人与人会互相影响？', eye: '真连接仍各自回应' },
  { id: 'part-06', file: '06-向光.md', title: '向光', ask: '为什么人需要方向？', eye: '今息知所重、诚行一步' },
];

const practice = [
  { id: 'practice-01', file: 'implement/01-存在论.md', title: '存在论', eye: '读态，不贴型', from: '01 本源' },
  { id: 'practice-02', file: 'implement/02-意识论.md', title: '意识论', eye: '先觉，再答', from: '02 观照' },
  { id: 'practice-03', file: 'implement/03-流动论.md', title: '流动论', eye: '一息可留，一生不可截', from: '03 流动' },
  { id: 'practice-04', file: 'implement/04-关系论.md', title: '关系论', eye: '连接，而不占有', from: '05 共生' },
  { id: 'practice-05', file: 'implement/05-因应论.md', title: '因应论', eye: '留应，不留命', from: '04 因应' },
  { id: 'practice-06', file: 'implement/06-生成论.md', title: '生成论', eye: '鸣其已生，不造其未生', from: '跨章' },
  { id: 'practice-07', file: 'implement/07-意义论.md', title: '意义论', eye: '归树，不归终', from: '06 向光' },
  { id: 'practice-08', file: 'implement/08-整合论.md', title: '整合论', eye: '见整体，而非见部分', from: '附录 · U' },
];

const tocEntries = [];

let doc = '';
doc += '# 雾岸理论全书\n\n';
doc += '> 雾岸（Psyche Tree）理论体系 · 简体中文整体版\n>\n';
doc += '> **目录用法：** 在编辑器中 **Cmd+点击**（Mac）或 **Ctrl+点击**（Win）目录链接即可跳转；亦可在 Markdown 预览（`Cmd+Shift+V`）中点击 `#` 锚点链接。\n\n';
doc += '---\n\n';
doc += '## 总目录\n\n';

// placeholder TOC — filled in second pass
const tocPlaceholder = '<!-- TOC -->';
doc += tocPlaceholder + '\n\n---\n\n';

tocEntries.push({ label: '前置 · 关系论总纲', id: 'overview', heading: '前置 · 《关系论·总纲》' });
doc += MARK('overview') + '## 前置 · 《关系论·总纲》\n\n';
doc += '**定位：** 理解雾岸的基础；**非**上编世界观、**非**下编实践论、**非**附录。读上编之前，先立「万物因关系而在」。\n\n';
doc += loadOverview() + '\n\n---\n\n';

tocEntries.push({ label: '理论两层', id: 'guide', heading: '导读' });
doc += MARK('guide') + '## 导读\n\n';
doc += '雾岸理论以**叙事与象**为第一语言写成。**读上编之前**，可先读 **[前置 · 关系论总纲](#前置--关系论总纲)**（栈外基础，古文 · 白话十节）。全文分两层：\n\n';
doc += '| 层 | 问什么 |\n|----|--------|\n';
doc += '| **世界观**（上编 01–06） | 变、照、流、应、连、向——人如何存在于世 |\n';
doc += '| **实践论**（下编 01–08） | 态、觉、续、接、应、生、向、整——体验如何践行 |\n\n';
doc += '**建议读序：** 前置 · 关系论总纲（可选）→ 上编 01→06 → 附录一（可穿插）→ 下编 01→08。\n\n';

tocEntries.push({ label: '六篇成环', id: 'six-ring', heading: '六篇成环' });
doc += MARK('six-ring') + '### 六篇成环\n\n';
doc += '> 本源问**变**，观照问**见**，流动问**行**，因应问**答**，共生问**连**，向光问**往**。\n\n';
doc += '| 篇 | 核心问 | 章眼 |\n|----|--------|------|\n';
for (let i = 0; i < worldview.length; i++) {
  const w = worldview[i];
  doc += `| ${i + 1} ${w.title} | ${w.ask} | ${w.eye} |\n`;
}

tocEntries.push({ label: '践行读序', id: 'practice-order', heading: '践行读序' });
doc += '\n' + MARK('practice-order') + '### 践行读序\n\n';
doc += '```\n01 存在 → 02 意识 → 03 流动 → 04 关系 → 05 因应 → 06 生成 → 07 意义 → 08 整合\n```\n\n';
doc += '| 章 | 章眼 | 承世界观 |\n|----|------|----------|\n';
for (const p of practice) {
  doc += `| ${p.id.replace('practice-', '')} ${p.title} | ${p.eye} | ${p.from} |\n`;
}
doc += '\n### 从理论到一次留痕\n\n';
doc += '```\n前置 · 关系论总纲（理解雾岸的基础）\n    ↓\n六篇理论（变·见·行·答·连·往）\n    ↓\n八章践行（态·觉·续·接·应·生·向·整）\n    ↓\n六卷同旅：入卷 → 问印择印 → 留痕 → 归树 → 整象\n```\n\n';
doc += '---\n\n';

tocEntries.push({ label: '上编 · 世界观', id: 'worldview', heading: '上编 · 世界观' });
doc += MARK('worldview') + '# 上编 · 世界观\n\n';
doc += '六篇成环，每篇一问、正文展开。从**变**立根，至**往**收束。\n\n';
for (let i = 0; i < worldview.length; i++) {
  const w = worldview[i];
  const heading = `第${i + 1}部 · ${w.title}`;
  tocEntries.push({ label: `第${i + 1}部 ${w.title}`, id: w.id, heading, sub: w.ask });
  doc += MARK(w.id) + `## ${heading}\n\n`;
  doc += `**核心问：** ${w.ask}  \n**章眼：** ${w.eye}\n\n`;
  doc += load(w.file) + '\n\n';
}
doc += '---\n\n';

tocEntries.push({ label: '附录一 · 现代对应与读态符号', id: 'appendix-01', heading: '附录一 · 现代对应与读态符号' });
doc += MARK('appendix-01') + '# 附录一 · 现代对应与读态符号\n\n';
doc += load('appendix-现代对应.md') + '\n\n---\n\n';

tocEntries.push({ label: '下编 · 实践论', id: 'practice', heading: '下编 · 实践论' });
doc += MARK('practice') + '# 下编 · 实践论\n\n';
doc += '世界观的对其实践：存在论 → 整合论。改体验、流程、鸣示前，须守各章**不可与可**。\n\n';

// implement README summary
const implReadme = extractChinese(fs.readFileSync(path.join(theoryRoot, 'implement/README.md'), 'utf8'));
const implSections = implReadme.split(/\n\n+/).filter(Boolean);
doc += '## 实践篇索引\n\n';
doc += implSections.slice(0, Math.min(8, implSections.length)).join('\n\n') + '\n\n';
doc += '**践行链：** `01 存在 → 02 意识 → 03 流动 → 04 关系 → 05 因应 → 06 生成 → 07 意义 → 08 整合`\n\n';

for (const p of practice) {
  const num = p.id.replace('practice-', '');
  const heading = `第${num}章 · ${p.title}`;
  tocEntries.push({ label: `第${num}章 ${p.title}`, id: p.id, heading, sub: p.eye });
  doc += MARK(p.id) + `## ${heading}\n\n`;
  doc += `**章眼：** ${p.eye}  \n**承世界观：** ${p.from}\n\n`;
  doc += load(p.file, { implement: true }) + '\n\n';
}

doc += '### 改体验前 · 四问\n\n';
doc += '1. 是否在贴型或判对错？→ 01 存在论 · 05 因应论\n';
doc += '2. 是否在催促改而跳过照见？→ 02 意识论\n';
doc += '3. 是否把结果焊死或拼接？→ 03 流动论 · 08 整合论\n';
doc += '4. 是否在绑人或替人应？→ 04 关系论\n\n---\n\n';

const cross = load('cross/Taves2018-雾岸交叉读.md');
if (cross) {
  tocEntries.push({ label: '附录二 · 与 Taves 2018 交叉读', id: 'appendix-02', heading: '附录二 · 与 Taves 2018 交叉读' });
  doc += MARK('appendix-02') + '# 附录二 · 与 Taves 2018 交叉读\n\n' + cross + '\n\n';
}
doc += '---\n\n';
doc += '*全书完 · 生成自 `docs/theory/` · ' + new Date().toISOString().slice(0, 10) + '*\n';

// Pass 2: resolve line numbers & build TOC
const lines = doc.split('\n');
const lineOf = {};
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^<!-- @(.+) -->$/);
  if (m) lineOf[m[1]] = i + 1;
}

const fileName = '雾岸理论全书.md';
function link(entry) {
  const line = lineOf[entry.id];
  const slug = vscodeSlug(entry.heading);
  const sub = entry.sub ? ` — ${entry.sub}` : '';
  return `- [${entry.label}](${fileName}#L${line}) · [预览锚点](#${slug})${sub}`;
}

let toc = '### 前置 · 目录\n\n';
for (const e of tocEntries.filter(e => e.id === 'overview')) {
  toc += link(e) + '\n';
}
toc += '\n### 导读 · 目录\n\n';
for (const e of tocEntries.filter(e => ['guide', 'six-ring', 'practice-order'].includes(e.id))) {
  toc += link(e) + '\n';
}
toc += '\n### 上编 · 目录\n\n';
for (const e of tocEntries.filter(e => e.id.startsWith('part-'))) toc += link(e) + '\n';
toc += '\n### 下编 · 目录\n\n';
for (const e of tocEntries.filter(e => e.id === 'practice' || /^practice-\d{2}$/.test(e.id))) toc += link(e) + '\n';
toc += '\n### 附录 · 目录\n\n';
for (const e of tocEntries.filter(e => e.id.startsWith('appendix-'))) toc += link(e) + '\n';

doc = doc.replace(tocPlaceholder, toc);
// strip orphan HTML anchors from source appendix
doc = doc.replace(/^<a id="[^"]+"><\/a>\n\n/gm, '');
fs.writeFileSync(outPath, doc, 'utf8');
console.log('Built', outPath);
console.log('Practice-01 line:', lineOf['practice-01']);
console.log('TOC entries:', tocEntries.length);
