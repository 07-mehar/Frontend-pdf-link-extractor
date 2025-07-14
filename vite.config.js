// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/upload': 'https://backend-pdf-link-extractor.onrender.com',
      '/download': 'https://backend-pdf-link-extractor.onrender.com',
    }
  }
})

