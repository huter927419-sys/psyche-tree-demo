#!/usr/bin/env node
/**
 * Generate card images via OpenAI DALL-E 3
 * Requires OPENAI_API_KEY in .env.local or environment
 * Run: npm run generate:cards:ai
 * Options: --force (overwrite)  --only=steady-river,fog-path
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CARDS, buildCardPrompt } from './card-prompts.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/cards')
const ENV_LOCAL = join(__dirname, '../.env.local')

function loadEnv() {
  if (process.env.OPENAI_API_KEY) return
  if (existsSync(ENV_LOCAL)) {
    for (const line of readFileSync(ENV_LOCAL, 'utf8').split('\n')) {
      const m = line.match(/^OPENAI_API_KEY=(.+)$/)
      if (m) process.env.OPENAI_API_KEY = m[1].trim()
    }
  }
}

async function generateImage(apiKey, prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      quality: 'hd',
      style: 'natural',
      response_format: 'b64_json',
    }),
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error?.message ?? `OpenAI API ${res.status}`)
  }

  const b64 = data.data?.[0]?.b64_json
  if (!b64) throw new Error('OpenAI 返回空图像')
  return Buffer.from(b64, 'base64')
}

async function main() {
  loadEnv()
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error(
      '请在 .env.local 中设置 OPENAI_API_KEY=sk-...\n' +
        '然后运行: npm run generate:cards:ai',
    )
    process.exit(1)
  }

  const force = process.argv.includes('--force')
  const onlyArg = process.argv.find((a) => a.startsWith('--only='))
  const only = onlyArg ? onlyArg.split('=')[1].split(',') : null

  mkdirSync(OUT_DIR, { recursive: true })

  const targets = only
    ? CARDS.filter((c) => only.includes(c.pattern))
    : CARDS

  if (targets.length === 0) {
    console.error('未找到匹配的卡片 pattern')
    process.exit(1)
  }

  console.log(`将生成 ${targets.length} 张 AI 卡片图（DALL-E 3 HD）\n`)

  for (const card of targets) {
    const pngPath = join(OUT_DIR, `${card.pattern}.png`)
    if (existsSync(pngPath) && !force) {
      console.log(`⊘ 跳过 ${card.pattern}.png（已存在，使用 --force 覆盖）`)
      continue
    }

    const prompt = buildCardPrompt(card)
    console.log(`… 生成 ${card.label} (${card.pattern})`)
    try {
      const buffer = await generateImage(apiKey, prompt)
      writeFileSync(pngPath, buffer)
      console.log(`✓ ${card.pattern}.png`)
    } catch (err) {
      console.error(`✗ ${card.pattern}: ${err.message}`)
    }

    await new Promise((r) => setTimeout(r, 1200))
  }

  console.log('\n完成。运行 npm run export:cards:png 可同步更新（若需从 SVG 批量导出）。')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
