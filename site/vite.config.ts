import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Plugin to serve static files from parent directory
function serveStaticPlugin() {
  return {
    name: 'serve-static',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const staticPaths = ['/data/', '/assets/', '/assets-thumbs/']
        if (staticPaths.some(p => req.url?.startsWith(p))) {
          const filePath = path.join(__dirname, '..', req.url)
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath)
            const ext = path.extname(filePath).toLowerCase()
            const mimeTypes: Record<string, string> = {
              '.json': 'application/json',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png': 'image/png',
              '.webp': 'image/webp',
              '.pdf': 'application/pdf',
              '.mp4': 'video/mp4',
              '.mov': 'video/quicktime',
            }
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
            res.end(content)
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveStaticPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
})