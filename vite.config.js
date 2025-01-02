import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // 如果端口被占用，则会抛出错误而不是尝试下一个端口
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
