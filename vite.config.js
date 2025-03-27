import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        // Habilita el modo Web Component
        isCustomElement: tag => tag.includes('-')
      }
    },
    customElement: true // Esto es importante para el manejo de estilos
  })],
  build: {
    lib: {
      entry: 'src/components/ChatWidget.js',
      name: 'ChatWidget',
      fileName: (format) => `chat-widget.${format}.js`,
      formats: ['es', 'umd']
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
