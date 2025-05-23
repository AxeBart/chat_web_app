import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['socket.io-client'], // Ajoutez cette ligne
    },
  },
  plugins: [react(), tailwindcss()],
})
