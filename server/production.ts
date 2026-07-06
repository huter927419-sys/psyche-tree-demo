import http from 'node:http'
import { createApiMiddleware } from './api/router.js'
import { DEFAULT_DEEPSEEK_MODEL } from './deepseek.js'

const host = process.env.HOST ?? '127.0.0.1'
const port = Number(process.env.PORT ?? 5173)

const middleware = createApiMiddleware({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  model: process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
  testReadingFallback: process.env.PSYCHE_READING_TEST_FALLBACK === '1',
})

http
  .createServer((req, res) => {
    void middleware(req, res, () => {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end('Not Found')
    })
  })
  .listen(port, host, () => {
    console.log(`[psyche-api] listening on http://${host}:${port}`)
  })
