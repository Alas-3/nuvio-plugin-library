import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/notion': {
        target: 'https://notion-api.splitbee.io/v1/page',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/notion/, '')
      }
    }
  }
})
