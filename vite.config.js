import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/3DWebDemo/',
  server: {
    port: 5173,
    strictPort: true,
    open: true
  },
  optimizeDeps: {
    include: ['three']
  },
  build: {
    assetsInclude: ['**/*.glb'],
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/glb/.test(extType)) {
            return `models/[name][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    }
  },
  publicDir: 'public'
})
