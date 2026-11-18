import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative paths, so the built site works on any host or sub-folder
  plugins: [react()],
})
