import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'serve-downloaded-videos',
      configureServer(server) {
        server.middlewares.use('/downloaded videos', (req, res, next) => {
          const decodedUrl = decodeURIComponent(req.url)
          const filePath = path.join(process.cwd(), 'downloaded videos', decodedUrl)
          
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.setHeader('Content-Type', 'video/mp4')
            fs.createReadStream(filePath).pipe(res)
          } else {
            next()
          }
        })
      }
    }
  ],
})
