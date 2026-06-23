import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api-proxy': {
        target: 'https://www.online.xdsdata.com/XdsDataRestApi/Api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy/, '')
      }
    }
  }
})
