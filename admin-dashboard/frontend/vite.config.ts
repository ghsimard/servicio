import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PORTS } from '../config/ports'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: PORTS.FRONTEND,
    strictPort: true
  }
})
