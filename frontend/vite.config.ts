import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // Suppress noisy connection-reset / aborted errors during dev
            if (
              err.message.includes('ECONNABORTED') ||
              err.message.includes('ECONNRESET') ||
              err.message.includes('ECONNREFUSED')
            ) {
              return
            }
            console.warn('[proxy /api error]', err.message)
          })
        },
      },
      '/socket.io': {
        target: 'http://127.0.0.1:4000',
        ws: true,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // Suppress transient WebSocket proxy errors during dev
            if (
              err.message.includes('ECONNABORTED') ||
              err.message.includes('ECONNRESET') ||
              err.message.includes('ECONNREFUSED') ||
              err.message.includes('write')
            ) {
              return
            }
            console.warn('[proxy /socket.io error]', err.message)
          })
        },
      },
    },
  },
})
