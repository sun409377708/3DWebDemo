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
    assetsInclude: ['**/*.glb'],  // 将.glb文件作为资源处理
    rollupOptions: {
      input: {
        main: 'index.html',
      }
    }
  }
})
