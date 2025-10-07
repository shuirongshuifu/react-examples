import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

import versionPlugin from './src/plugins/vite-plugin-version';

// https://vite.dev/config/
export default defineConfig({
  base: '/reactExamples/',
  plugins: [react(), versionPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 将 @ 指向 src 目录
    },
  },
  server: {
    port: 9521, // 指定端口号
    open: false, // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'https://ashuai.work/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ollama': {
        target: 'https://ashuai.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ollama/, '/ollama'),
        secure: false,
      },
    },
  },
})
