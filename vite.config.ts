import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 相对路径 base，兼容 GitHub Pages 项目站点（https://<user>.github.io/<repo>/）
  base: './',
  server: {
    host: true,
  },
})
