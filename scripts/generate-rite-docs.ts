/**
 * Regenerate docs/volume-rite-copy.md (zh / en / ja) from volumeRite.ts
 * Run: npx tsx scripts/generate-rite-docs.ts
 */
import { writeFileSync } from 'node:fs'
import type { BookId } from '../src/books/types'
import {
  getCoreProposition,
  getReturnToTreeRite,
  getVolumeEntryRite,
  getVolumeExitRite,
} from '../src/i18n/volumeRite'
import type { RiteStep } from '../src/i18n/volumeRite'

const BOOKS: BookId[] = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

function triBlock(zh: string, en: string, ja: string): string {
  const fmt = (s: string) => s.split('\n').join('\n> ')
  return [
    '> **简体**',
    '> ' + fmt(zh),
    '>',
    '> **English**',
    '> ' + fmt(en),
    '>',
    '> **日本語**',
    '> ' + fmt(ja),
    '',
  ].join('\n')
}

function stepsBlock(zhSteps: RiteStep[], enSteps: RiteStep[], jaSteps: RiteStep[]): string {
  let out = ''
  for (let i = 0; i < zhSteps.length; i++) {
    const z = zhSteps[i]
    const e = enSteps[i]
    const j = jaSteps[i]
    out += `#### ${z.sectionLabel} · ${e.sectionLabel} · ${j.sectionLabel}\n\n`
    if (z.title) {
      out += triBlock(z.title, e.title ?? '', j.title ?? '') + '\n'
    }
    out += triBlock(z.paragraphs.join('\n'), e.paragraphs.join('\n'), j.paragraphs.join('\n')) + '\n'
    if (z.journalPrompt) {
      out += triBlock(z.journalPrompt, e.journalPrompt ?? '', j.journalPrompt ?? '') + '\n'
    }
  }
  return out
}

let md = `# 修持引导语三语全文 · Volume Rite Copy · 修持導き三語全文

源文件 [\`src/i18n/volumeRite.ts\`](../src/i18n/volumeRite.ts) · 理论 [01–10](./theory/README.md) · 对照 [appendix-现代对应.md](./theory/appendix-现代对应.md)

---

`

for (const id of BOOKS) {
  const zh = getVolumeEntryRite(id, 'zh')
  const en = getVolumeEntryRite(id, 'en')
  const ja = getVolumeEntryRite(id, 'ja')
  md += `## ${zh.volumeTitle}\n\n`
  md += triBlock(zh.volumeTitle, en.volumeTitle, ja.volumeTitle) + '\n'
  md += triBlock(zh.facetLabel, en.facetLabel, ja.facetLabel) + '\n'
  md += `### 入卷 · Entry rite · 入巻\n\n`
  md += stepsBlock(zh.steps, en.steps, ja.steps)
  md += `### 离卷 · Exit rite · 離巻\n\n`
  md += stepsBlock(
    getVolumeExitRite(id, 'zh'),
    getVolumeExitRite(id, 'en'),
    getVolumeExitRite(id, 'ja'),
  )
  md += '---\n\n'
}

const rtZ = getReturnToTreeRite('zh')
const rtE = getReturnToTreeRite('en')
const rtJ = getReturnToTreeRite('ja')
md += `## 归树 · Return to the Tree · 帰樹\n\n`
md += triBlock(rtZ.tag, rtE.tag, rtJ.tag) + '\n'
md += triBlock(rtZ.title, rtE.title, rtJ.title) + '\n'
md += triBlock(rtZ.subtitle, rtE.subtitle, rtJ.subtitle) + '\n'
md += stepsBlock(rtZ.steps, rtE.steps, rtJ.steps)
const cpZ = getCoreProposition('zh')
const cpE = getCoreProposition('en')
const cpJ = getCoreProposition('ja')
md += `### 核心命题 · Core proposition · 核心命題\n\n`
md += triBlock(cpZ.main, cpE.main, cpJ.main) + '\n'
md += triBlock(cpZ.sub, cpE.sub, cpJ.sub) + '\n'
md += triBlock(rtZ.closing, rtE.closing, rtJ.closing) + '\n'

writeFileSync('docs/volume-rite-copy.md', md)
console.log(`Wrote docs/volume-rite-copy.md (${md.length} chars)`)
