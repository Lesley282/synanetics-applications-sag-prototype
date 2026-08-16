import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9091,
    // TODO: once this prototype has a Cloud Run URL, add it here so the Vite
    // dev/preview server accepts requests coming through that host.
    allowedHosts: [],
  },
})
