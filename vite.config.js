import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    assetsInclude: ['**/*.glb'],
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    fs: {
      strict: false,
      allow: ['..']
    }
  }
})
