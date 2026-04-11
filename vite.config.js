import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Finance-react/",
  server: {
    proxy: {
      '/api/exchange': {
        target: 'https://api.frankfurter.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exchange/, ''),
      },
      '/api/exchange2': {
        target: 'https://api.exchangerate.host',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/exchange2/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts')) return 'charts'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/react-toastify')) return 'toast'
          if (id.includes('node_modules/react-icons')) return 'icons'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
