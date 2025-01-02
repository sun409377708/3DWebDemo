import { defineConfig } from 'vite'

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
    commonjsOptions: {
      include: [/three/, /node_modules/]
    }
  }
})
