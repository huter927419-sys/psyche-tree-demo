import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createApiMiddleware } from './server/api/router.js'
import { DEFAULT_DEEPSEEK_MODEL } from './server/deepseek.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.DEEPSEEK_API_KEY
  const model = env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL

  const testReadingFallback = env.PSYCHE_READING_TEST_FALLBACK === '1'

  const apiMiddleware = createApiMiddleware({ apiKey, model, testReadingFallback })

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'psyche-api',
        configureServer(server) {
          server.middlewares.use(apiMiddleware)
        },
        configurePreviewServer(server) {
          server.middlewares.use(apiMiddleware)
        },
      },
    ],
  }
})
