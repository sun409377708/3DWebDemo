import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/3DWebDemo/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      'three': 'three',
      'three/examples/jsm/controls/OrbitControls': resolve(__dirname, './node_modules/three/examples/jsm/controls/OrbitControls.js'),
      'three/examples/jsm/loaders/GLTFLoader': resolve(__dirname, './node_modules/three/examples/jsm/loaders/GLTFLoader.js')
    }
  },
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
