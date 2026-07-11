#!/usr/bin/env node
/**
 * Build standalone HTML from docs/theory/雾岸理论全书.md
 * Output: docs/theory/雾岸理论全书.html (single file, offline-ready)
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const theoryDir = __dirname;
const mdPath = path.join(theoryDir, '雾岸理论全书.md');
const outPath = path.join(theoryDir, '雾岸理论全书.html');

const md = fs.readFileSync(mdPath, 'utf8');

/** @type {{ id: string, text: string, level: number, group?: string }[]} */
const nav = [];

function scanNav(raw) {
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const marker = lines[i].match(/^<!-- @([\w-]+) -->$/);
    if (!marker) continue;
    const id = marker[1];
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    const h = lines[j]?.match(/^(#{1,6})\s+(.+)$/);
    if (h) nav.push({ id, text: h[2].trim(), level: h[1].length });
  }
}

scanNav(md);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
}

function preprocess(raw) {
  const lines = raw.split('\n');
  const out = [];
  let skipTocUsage = false;
  let inInlineToc = false;

  const labelToId = {
    '前置 · 关系论总纲': 'overview',
    '理论两层': 'guide',
    '六篇成环': 'six-ring',
    '践行读序': 'practice-order',
    '第1部 本源': 'part-01',
    '第2部 观照': 'part-02',
    '第3部 流动': 'part-03',
    '第4部 因应': 'part-04',
    '第5部 共生': 'part-05',
    '第6部 向光': 'part-06',
    '下编 · 实践论': 'practice',
    '下编 · 实践论（总述）': 'practice',
    '第01章 存在论': 'practice-01',
    '第02章 意识论': 'practice-02',
    '第03章 流动论': 'practice-03',
    '第04章 关系论': 'practice-04',
    '第05章 因应论': 'practice-05',
    '第06章 生成论': 'practice-06',
    '第07章 意义论': 'practice-07',
    '第08章 整合论': 'practice-08',
    '附录一 · 现代对应与读态符号': 'appendix-01',
    '附录二 · 与 Taves 2018 交叉读': 'appendix-02',
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line === '## 总目录') {
      inInlineToc = true;
      out.push(line);
      continue;
    }
    if (inInlineToc && line === '---') {
      inInlineToc = false;
      out.push(line);
      continue;
    }

    if (line.includes('**目录用法：**')) {
      skipTocUsage = true;
      continue;
    }
    if (skipTocUsage) {
      if (line.startsWith('>')) continue;
      skipTocUsage = false;
    }

    const marker = line.match(/^<!-- @([\w-]+) -->$/);
    if (marker) {
      const id = marker[1];
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      const h = lines[j]?.match(/^(#{1,6})\s+(.+)$/);
      if (h) {
        const level = h[1].length;
        const text = h[2].trim();
        out.push(`<h${level} id="${id}">${escapeHtml(text)}</h${level}>`);
        i = j;
        continue;
      }
    }

    let l = line;
    if (inInlineToc) {
      const m = l.match(/^- \[([^\]]+)\]\([^)]+\)(?:\s*·\s*\[预览锚点\]\([^)]+\))?(.*)/);
      if (m) {
        const label = m[1];
        const tail = m[2];
        const href = labelToId[label] || labelToId[label.replace(/（总述）/, '')] || slugify(label);
        l = `- [${label}](#${href})${tail}`;
      }
    }

    out.push(l);
  }

  return out.join('\n');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function mdToHtml(processed) {
  const tmp = path.join(theoryDir, '.全书-tmp.md');
  fs.writeFileSync(tmp, processed, 'utf8');
  try {
    const html = execFileSync(
      'npx',
      ['--yes', 'marked', '--gfm', '--breaks', tmp],
      { encoding: 'utf8', cwd: theoryDir, maxBuffer: 10 * 1024 * 1024 }
    );
    return html;
  } finally {
    try { fs.unlinkSync(tmp); } catch (_) {}
  }
}

function buildSidebar(items) {
  const groups = [
    { key: 'overview', title: '前置 · 基础', ids: ['overview'] },
    { key: 'guide', title: '导读', ids: ['guide', 'six-ring', 'practice-order'] },
    { key: 'world', title: '上编 · 世界观', ids: ['worldview', 'part-01', 'part-02', 'part-03', 'part-04', 'part-05', 'part-06'] },
    { key: 'appendix1', title: '附录一', ids: ['appendix-01'] },
    { key: 'practice', title: '下编 · 实践论', ids: ['practice', 'practice-01', 'practice-02', 'practice-03', 'practice-04', 'practice-05', 'practice-06', 'practice-07', 'practice-08'] },
    { key: 'appendix2', title: '附录二', ids: ['appendix-02'] },
  ];

  const byId = Object.fromEntries(items.map(it => [it.id, it]));
  let html = '<nav class="sidebar" aria-label="全书目录">\n';
  html += '<div class="sidebar-inner">\n';
  html += '<p class="sidebar-title">雾岸理论全书</p>\n';

  for (const g of groups) {
    const entries = g.ids.map(id => byId[id]).filter(Boolean);
    if (!entries.length) continue;
    html += `<section class="nav-group"><h2 class="nav-group-title">${escapeHtml(g.title)}</h2><ul>\n`;
    for (const e of entries) {
      const cls = e.level <= 2 ? 'nav-item nav-item-major' : 'nav-item';
      html += `<li class="${cls}"><a href="#${e.id}">${escapeHtml(e.text)}</a></li>\n`;
    }
    html += '</ul></section>\n';
  }

  html += '</div></nav>\n';
  return html;
}

const processed = preprocess(md);
const bodyHtml = mdToHtml(processed);
const sidebar = buildSidebar(nav);

const page = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="雾岸（Psyche Tree）理论体系 · 简体中文整体版" />
  <title>雾岸理论全书</title>
  <style>
    :root {
      --bg: #f7f3eb;
      --bg-sidebar: #efe8db;
      --paper: #fffdf8;
      --ink: #2c2825;
      --ink-muted: #5c554c;
      --accent: #6b5b4a;
      --accent-soft: #c4b5a0;
      --quote-bg: #f3ede3;
      --quote-border: #b8a48c;
      --border: #e0d6c8;
      --link: #5a4a38;
      --link-hover: #3d3025;
      --shadow: 0 2px 24px rgba(44, 40, 37, 0.06);
      --font-serif: "Songti SC", "STSong", "Noto Serif SC", "Source Han Serif SC", Georgia, serif;
      --font-sans: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif;
      --sidebar-w: 280px;
      --content-max: 46rem;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      font-family: var(--font-serif);
      font-size: 17px;
      line-height: 1.85;
      color: var(--ink);
      background: var(--bg);
    }

    .layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: var(--sidebar-w);
      height: 100vh;
      overflow-y: auto;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border);
      z-index: 10;
    }

    .sidebar-inner { padding: 1.25rem 1rem 2rem; }

    .sidebar-title {
      font-family: var(--font-sans);
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-muted);
      margin: 0 0 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .nav-group { margin-bottom: 1rem; }

    .nav-group-title {
      font-family: var(--font-sans);
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--accent);
      margin: 0 0 0.4rem;
      letter-spacing: 0.06em;
    }

    .nav-group ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-item a {
      display: block;
      padding: 0.28rem 0.5rem;
      font-family: var(--font-sans);
      font-size: 0.82rem;
      line-height: 1.45;
      color: var(--ink-muted);
      text-decoration: none;
      border-radius: 4px;
      transition: color 0.15s, background 0.15s;
    }

    .nav-item-major a {
      font-size: 0.88rem;
      color: var(--ink);
      font-weight: 500;
    }

    .nav-item a:hover,
    .nav-item a.active {
      color: var(--link-hover);
      background: rgba(255, 253, 248, 0.7);
    }

    .main {
      flex: 1;
      margin-left: var(--sidebar-w);
      padding: 2.5rem 2rem 4rem;
    }

    .content {
      max-width: var(--content-max);
      margin: 0 auto;
      background: var(--paper);
      padding: 2.5rem 3rem;
      border-radius: 2px;
      box-shadow: var(--shadow);
      border: 1px solid var(--border);
    }

    .content > h1:first-child {
      font-size: 2rem;
      font-weight: 600;
      margin-top: 0;
      letter-spacing: 0.04em;
      border-bottom: 2px solid var(--accent-soft);
      padding-bottom: 0.75rem;
    }

    h1 { font-size: 1.75rem; margin: 2.5rem 0 1rem; color: var(--accent); }
    h2 { font-size: 1.35rem; margin: 2rem 0 0.75rem; color: var(--ink); }
    h3 { font-size: 1.12rem; margin: 1.5rem 0 0.5rem; }
    h4 { font-size: 1rem; margin: 1.25rem 0 0.4rem; font-family: var(--font-sans); }

    h1, h2, h3, h4 { scroll-margin-top: 1.5rem; line-height: 1.4; }

    p { margin: 0.75rem 0; text-align: justify; }

    blockquote {
      margin: 1rem 0;
      padding: 0.75rem 1rem 0.75rem 1.1rem;
      background: var(--quote-bg);
      border-left: 3px solid var(--quote-border);
      color: var(--ink-muted);
    }

    blockquote p { margin: 0.35rem 0; }

    strong { color: var(--ink); font-weight: 600; }

    a { color: var(--link); text-decoration: underline; text-underline-offset: 2px; }
    a:hover { color: var(--link-hover); }

    ul, ol { margin: 0.75rem 0; padding-left: 1.4rem; }
    li { margin: 0.3rem 0; }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 2rem 0;
    }

    code {
      font-family: ui-monospace, monospace;
      font-size: 0.88em;
      background: var(--quote-bg);
      padding: 0.1em 0.35em;
      border-radius: 3px;
    }

    pre {
      background: #2c2825;
      color: #f0ebe3;
      padding: 1rem 1.1rem;
      overflow-x: auto;
      border-radius: 4px;
      font-size: 0.82rem;
      line-height: 1.55;
    }

    pre code { background: none; padding: 0; color: inherit; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-family: var(--font-sans);
      font-size: 0.88rem;
    }

    th, td {
      border: 1px solid var(--border);
      padding: 0.5rem 0.65rem;
      text-align: left;
      vertical-align: top;
    }

    th { background: var(--quote-bg); font-weight: 600; }

    .toc-inline {
      background: var(--quote-bg);
      border: 1px solid var(--border);
      padding: 1.25rem 1.5rem;
      margin: 1.5rem 0;
      border-radius: 4px;
    }

    .toc-inline h2 { margin-top: 0; font-size: 1.1rem; }
    .toc-inline h3 { font-size: 0.95rem; margin-top: 1rem; }

    .footer-note {
      max-width: var(--content-max);
      margin: 1.5rem auto 0;
      text-align: center;
      font-family: var(--font-sans);
      font-size: 0.78rem;
      color: var(--ink-muted);
    }

    .menu-toggle {
      display: none;
      position: fixed;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 20;
      padding: 0.5rem 0.75rem;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 4px;
      cursor: pointer;
      box-shadow: var(--shadow);
    }

    @media (max-width: 900px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.25s ease;
      }
      .sidebar.open { transform: translateX(0); }
      .main { margin-left: 0; padding: 3.5rem 1rem 2rem; }
      .content { padding: 1.5rem 1.25rem; }
      .menu-toggle { display: block; }
    }

    @media print {
      .sidebar, .menu-toggle { display: none !important; }
      .main { margin: 0; padding: 0; }
      .content { box-shadow: none; border: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <button class="menu-toggle" type="button" aria-label="打开目录">目录</button>
  <div class="layout">
    ${sidebar}
    <div class="main">
      <article class="content">
        ${bodyHtml}
      </article>
      <p class="footer-note">雾岸理论全书 · 单体网页 · 离线可阅</p>
    </div>
  </div>
  <script>
    (function () {
      var toggle = document.querySelector('.menu-toggle');
      var sidebar = document.querySelector('.sidebar');
      if (toggle && sidebar) {
        toggle.addEventListener('click', function () {
          sidebar.classList.toggle('open');
        });
        sidebar.querySelectorAll('a').forEach(function (a) {
          a.addEventListener('click', function () {
            if (window.innerWidth <= 900) sidebar.classList.remove('open');
          });
        });
      }

      var links = document.querySelectorAll('.sidebar a[href^="#"]');
      var sections = [];
      links.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        var el = document.getElementById(id);
        if (el) sections.push({ id: id, el: el, link: link });
      });

      function onScroll() {
        var pos = window.scrollY + 80;
        var current = sections[0];
        for (var i = 0; i < sections.length; i++) {
          if (sections[i].el.offsetTop <= pos) current = sections[i];
        }
        links.forEach(function (l) { l.classList.remove('active'); });
        if (current) current.link.classList.add('active');
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    })();
  </script>
</body>
</html>`;

fs.writeFileSync(outPath, page, 'utf8');
const sizeKb = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`Built ${outPath} (${sizeKb} KB, ${nav.length} nav items)`);
