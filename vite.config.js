import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Domínio próprio (anagayer.com.br) → base na raiz
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('@react-three') || id.includes('postprocessing') || id.includes('troika')) return 'r3f'
          if (id.includes('gsap') || id.includes('lenis') || id.includes('/motion') || id.includes('framer-motion')) return 'motion'
        },
      },
    },
  },
})
