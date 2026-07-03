import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {
  createMysticalReadingMiddleware,
  DEFAULT_DEEPSEEK_MODEL,
} from './server/deepseek.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.DEEPSEEK_API_KEY
  const model = env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL

  const mysticalMiddleware = createMysticalReadingMiddleware(apiKey, model)

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'deepseek-api',
        configureServer(server) {
          server.middlewares.use(mysticalMiddleware)
        },
        configurePreviewServer(server) {
          server.middlewares.use(mysticalMiddleware)
        },
      },
    ],
  }
})
