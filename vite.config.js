import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-data-js',
      closeBundle() {
        // 构建完成后复制 data.js 到 dist 目录
        try {
          copyFileSync(
            join(__dirname, 'public/data.js'),
            join(__dirname, 'dist/data.js')
          )
        } catch (error) {
          console.warn('Failed to copy data.js:', error.message)
        }
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
})
