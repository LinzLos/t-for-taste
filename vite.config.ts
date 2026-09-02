import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the project at /t-for-taste/. Vercel/Netlify would want '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/t-for-taste/',
})
