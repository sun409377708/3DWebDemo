import { defineConfig } from 'vite'

export default defineConfig({
  base: '/3DWebDemo/',
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
        format: 'es',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      },
    },
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  optimizeDeps: {
    include: ['three', '@tweenjs/tween.js']
  },
  publicDir: 'public'
})
