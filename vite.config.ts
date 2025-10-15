import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  root: '.',
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})


