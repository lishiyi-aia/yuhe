import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env?: { NODE_ENV?: string } }

const isProd = process.env?.NODE_ENV === 'production'

export default defineConfig({
  // GitHub Pages 部署时使用仓库子路径，确保静态资源可正确加载
  base: '/yuhe/',
  cacheDir: './.vite-cache',
  plugins: [react()],
  server: { host: true, port: 5206 },
})
