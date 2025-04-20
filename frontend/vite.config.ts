import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // 👇 This ensures routes like /appointment/doc10 don't break on refresh
    fs: {
      strict: false
    },
  }
})
