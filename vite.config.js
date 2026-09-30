import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// base: './' keeps asset paths relative so the build works on GitHub Pages
// regardless of the repository name (e.g. https://user.github.io/vitasync/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
