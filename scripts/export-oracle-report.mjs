#!/usr/bin/env node
/**
 * Complete 6-book journey and export per-volume + holistic oracle report.
 * Usage: node scripts/export-oracle-report.mjs [email]
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { createApiClient } from './lib/apiClient.mjs'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const DB =
  process.env.SQLITE_PATH ??
  path.resolve(process.cwd(), 'data', 'psyche-tree.sqlite')
const EMAIL = process.argv[2] ?? `qa-oracle-report-${Date.now()}@example.com`
const USE_TEST_FALLBACK = process.env.PSYCHE_READING_TEST_FALLBACK !== '0'

const { req, createJourney } = createApiClient(BASE)

const BOOKS = [
  'psyche-tree',
  'emotional-flow',
  'mind-light',
  'bond-thread',
  'flow-balance',
  'direction-light',
]

const BOOK_LABELS = {
  'psyche-tree': '心象',
  'emotional-flow': '映心',
  'mind-light': '明思',
  'bond-thread': '缘书',
  'flow-balance': '流衡',
  'direction-light': '向光',
}

const BOOK_ANSWERS = {
  'psyche-tree': {
    'psyche-boundary': ['warm-hands'],
    'psyche-wave': ['still-lake'],
    'psyche-still': ['psyche-still-lake'],
    'attention-check': ['star-explorer'],
    'psyche-mirror': ['psyche-mirror-lake'],
    'psyche-guard': ['psyche-guard-tree'],
    'psyche-root': ['deep-root-tree'],
    'psyche-whole': ['psyche-whole-lake'],
  },
  'emotional-flow': {
    'flow-overall': ['ef-calm-lake'],
    'flow-expression': ['ef-soft-candle'],
    'flow-connection': ['ef-warm-hands'],
    'attention-check': ['ef-warm-hands'],
    'flow-body': ['ef-steady-river'],
    'flow-recovery': ['ef-still-mirror'],
    'flow-change': ['ef-seed'],
    'flow-whole': ['ef-whole-lake'],
  },
  'mind-light': {
    'mind-flow': ['ml-steady-river'],
    'mind-learn': ['ml-seeking'],
    'mind-focus': ['ml-still-lake'],
    'attention-check': ['ml-still-lake'],
    'mind-analyze': ['ml-steady-path'],
    'mind-create': ['ml-bloom'],
    'mind-decide': ['ml-mountain'],
    'mind-whole': ['ml-whole-star'],
  },
  'bond-thread': {
    'bond-near': ['bt-warm'],
    'bond-warm': ['bt-resonance'],
    'bond-distance': ['bt-stars2'],
    'attention-check': ['bt-stars2'],
    'bond-trust': ['bt-bridge'],
    'bond-guard': ['bt-mountain2'],
    'bond-repair': ['bt-seed'],
    'bond-whole': ['bt-whole-silk'],
  },
  'flow-balance': {
    'balance-split': ['fb-balance'],
    'balance-source': ['fb-mountain'],
    'balance-mist': ['fb-steady-path'],
    'attention-check': ['fb-star'],
    'balance-pace': ['fb-steady-river'],
    'balance-turn': ['fb-bloom'],
    'balance-boat': ['fb-mountain3'],
    'balance-whole': ['fb-whole-boat'],
  },
  'direction-light': {
    'dir-light': ['dl-deep-root'],
    'dir-meaning': ['dl-resonance'],
    'dir-step': ['dl-steady-path'],
    'attention-check': ['dl-star'],
    'dir-resonance': ['dl-resonance2'],
    'dir-vow': ['dl-mountain'],
    'dir-probe': ['dl-star2'],
    'dir-whole': ['dl-whole-star'],
  },
}

function sql(q) {
  return execSync(`sqlite3 "${DB}" "${q.replace(/"/g, '""')}"`, { encoding: 'utf8' }).trim()
}

function buildPayload(bookId) {
  const answers = BOOK_ANSWERS[bookId]
  const label = BOOK_LABELS[bookId] ?? bookId
  return {
    bookId,
    locale: 'zh',
    psychologyProfile: `【${label}】实测画像 — 雾中自照之一页。`,
    psychologyPromptInput: `[${label}] 用户完成 ${Object.keys(answers).length} 题，attention 通过。`,
    dimensions: Object.keys(answers)
      .filter((k) => k !== 'attention-check')
      .slice(0, 3)
      .map((id, i) => ({
        dimensionIndex: i + 1,
        title: id,
        averageScore: 1,
        level: 'mid-high',
        selectedCardIds: answers[id],
      })),
    answers,
    attentionPassed: true,
    attentionFailures: [],
  }
}

async function pollReading(fn, maxMs = 120_000) {
  const start = Date.now()
  let last = null
  while (Date.now() - start < maxMs) {
    last = await fn()
    if (last.status === 200 && last.data?.reading?.length > 0) return last
    if (last.status !== 202 && last.status !== 200) return last
    await new Promise((r) => setTimeout(r, 800))
  }
  return last ?? { status: 408, data: { error: 'timeout' } }
}

function escapeMd(s) {
  return (s ?? '').replace(/\|/g, '\\|')
}

async function main() {
  console.log('Oracle report run')
  console.log('BASE:', BASE)
  console.log('EMAIL:', EMAIL)
  console.log('Test fallback:', USE_TEST_FALLBACK ? 'on' : 'off (DeepSeek if configured)')

  const health = await fetch(BASE)
  if (!health.ok) throw new Error(`Server not reachable: ${health.status}`)

  const created = await createJourney(EMAIL, 'zh')
  const journeyId = created.journeyId

  const volumeResults = []

  for (const bookId of BOOKS) {
    const save = await req('POST', `/api/journeys/${journeyId}/assessments`, {
      body: buildPayload(bookId),
      journeyId,
    })
    if (save.status !== 201) {
      throw new Error(`${bookId} save: ${save.status} ${JSON.stringify(save.data)}`)
    }
    const aid = save.data.assessment.id
    const reading = await pollReading(() =>
      req('POST', `/api/assessments/${aid}/mystical-reading`, { journeyId }),
    )
    volumeResults.push({
      bookId,
      label: BOOK_LABELS[bookId],
      assessmentId: aid,
      saveStatus: save.status,
      readingStatus: reading.status,
      source: reading.data?.source ?? sql(
        `SELECT mystical_reading_source FROM book_assessments WHERE id='${aid}'`,
      ),
      reading: reading.data?.reading ?? sql(
        `SELECT mystical_reading_zh FROM book_assessments WHERE id='${aid}'`,
      ),
    })
    console.log(`  ✓ ${BOOK_LABELS[bookId]} (${bookId}) oracle len=${volumeResults.at(-1).reading?.length ?? 0}`)
  }

  const holistic = await pollReading(() =>
    req('POST', `/api/journeys/${journeyId}/holistic-reading`, { journeyId }),
  )

  const holRow = sql(
    `SELECT holistic_reading_status, holistic_reading_source, holistic_reading_zh FROM journeys WHERE id='${journeyId}'`,
  )
  const holParts = holRow.split('|')
  const holisticText =
    holistic.data?.reading ??
    (holParts.length >= 3 ? holParts.slice(2).join('|') : holRow)

  const ts = new Date().toISOString()
  const lines = [
    '# 雾岸六卷 · 神谕测试报告',
    '',
    `**生成时间：** ${ts}`,
    `**测试邮箱：** ${EMAIL}`,
    `**Journey ID：** \`${journeyId}\``,
    `**BASE：** ${BASE}`,
    `**神谕来源：** ${USE_TEST_FALLBACK ? 'QA test fallback' : 'DeepSeek / fallback（见各卷 source）'}`,
    '',
    '---',
    '',
    '## 六卷单卷神谕',
    '',
  ]

  for (const v of volumeResults) {
    lines.push(`### ${v.label} · \`${v.bookId}\``)
    lines.push('')
    lines.push(`- Assessment: \`${v.assessmentId}\``)
    lines.push(`- 保存: HTTP ${v.saveStatus} · 神谕: HTTP ${v.readingStatus} · source: **${v.source}**`)
    lines.push('')
    lines.push('> ' + (v.reading || '（无文本）').replace(/\n/g, '\n> '))
    lines.push('')
  }

  lines.push('---', '', '## 整象神谕（六卷完成后）', '')
  lines.push(`- Journey status: **${sql(`SELECT status FROM journeys WHERE id='${journeyId}'`)}**`)
  lines.push(
    `- 整象 HTTP ${holistic.status} · source: **${holistic.data?.source ?? holParts[1] ?? 'unknown'}**`,
  )
  lines.push('')
  lines.push('> ' + (holisticText || '（无文本）').replace(/\n/g, '\n> '))
  lines.push('')
  lines.push('---', '', '## SQLite 摘要', '')
  lines.push('')
  lines.push('| 卷 | book_id | myst_status | source | len |')
  lines.push('|----|---------|-------------|--------|-----|')
  for (const v of volumeResults) {
    const row = sql(
      `SELECT mystical_reading_status, mystical_reading_source, length(mystical_reading_zh) FROM book_assessments WHERE id='${v.assessmentId}'`,
    )
    const [st, src, len] = row.split('|')
    lines.push(
      `| ${v.label} | ${v.bookId} | ${st} | ${src} | ${len} |`,
    )
  }
  lines.push('')
  lines.push(
    `整象: ${sql(`SELECT holistic_reading_status, holistic_reading_source, length(holistic_reading_zh) FROM journeys WHERE id='${journeyId}'`)}`,
  )

  const report = lines.join('\n')
  const outDir = path.resolve(process.cwd(), 'logs')
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, `oracle-report-${Date.now()}.md`)
  fs.writeFileSync(outFile, report, 'utf8')

  console.log('\n' + report)
  console.log('\n✓ Report saved:', outFile)
}

main().catch((err) => {
  console.error('✗', err.message)
  process.exit(1)
})
