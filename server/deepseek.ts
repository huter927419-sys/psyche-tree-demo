import type { IncomingMessage, ServerResponse } from 'node:http'

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'

export const DEFAULT_DEEPSEEK_MODEL = 'deepseek-v4-pro'

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export const mysticalPromptTemplate = `你是一位深谙生命象征与内在智慧的玄学解读者。
请根据以下心理学底层画像，用庄严而诗意的语言进行玄学解读。
使用生命之树、河流、星光、丝线、山峰等象征元素。
语气神圣而温柔，像古老的智慧在低语。
不要直接说"你的选择是XX"，而是描述当前生命能量的状态与流动。
心理学画像：
[在此插入7个维度的得分与描述]
请生成一段连贯的玄学解读。`

export function buildMysticalPrompt(psychologyInput: string): string {
  return mysticalPromptTemplate.replace(
    '[在此插入7个维度的得分与描述]',
    psychologyInput,
  )
}

export async function callDeepSeekMysticalReading(
  psychologyInput: string,
  apiKey: string,
  model: string,
): Promise<string> {
  const prompt = buildMysticalPrompt(psychologyInput)

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt } satisfies DeepSeekMessage],
      temperature: 0.85,
      max_tokens: 1500,
      stream: false,
      thinking: { type: 'disabled' },
    }),
  })

  const data = (await response.json()) as DeepSeekChatResponse

  if (!response.ok) {
    const message = data.error?.message ?? `DeepSeek API 错误 (${response.status})`
    throw new Error(message)
  }

  const content = data.choices?.[0]?.message?.content?.trim()
  if (!content) {
    throw new Error('DeepSeek 返回内容为空')
  }

  return content
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function createMysticalReadingMiddleware(apiKey: string, model: string) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) => {
    if (req.url !== '/api/mystical-reading' || req.method !== 'POST') {
      next()
      return
    }

    if (!apiKey) {
      sendJson(res, 500, { error: '未配置 DEEPSEEK_API_KEY，请在 .env.local 中设置' })
      return
    }

    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw) as { psychologyInput?: string }

      if (!body.psychologyInput?.trim()) {
        sendJson(res, 400, { error: '缺少 psychologyInput' })
        return
      }

      const reading = await callDeepSeekMysticalReading(
        body.psychologyInput,
        apiKey,
        model,
      )

      sendJson(res, 200, { reading, model })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '生成玄学解读失败'
      sendJson(res, 500, { error: message })
    }
  }
}
