import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
     tailwindcss(),
  ],  
  server: {
    host: 'localhost',   // or '0.0.0.0' to expose on local network
    port: 5175 
  }
});

