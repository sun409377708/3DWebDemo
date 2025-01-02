import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/3DWebDemo/',  // 添加base配置，值为仓库名
  server: {
    port: 5173,
    strictPort: true,
    open: true
  },
  optimizeDeps: {
    include: ['three']
  },
  build: {
    assetsInclude: ['**/*.glb'],  // 将.glb文件作为资源处理
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.glb')) {
            return 'models/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  publicDir: 'models'  // 添加这行，确保models目录被复制到dist
})
