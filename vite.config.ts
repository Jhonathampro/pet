import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // em desenvolvimento, /api vai para a API (pasta api/, porta 3333)
    proxy: {
      '/api': 'http://localhost:3333',
    },
  },
})
