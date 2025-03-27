import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/sessions': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/users': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/analytics': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      }
    },
  },
}); 