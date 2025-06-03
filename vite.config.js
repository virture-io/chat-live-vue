//Production
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Habilita el modo Web Component
          isCustomElement: (tag) => tag.includes("-"),
        },
      },
      customElement: true, // Esto es importante para el manejo de estilos
    }),
  ],
  build: {
    lib: {
      entry: "src/components/ChatWidget.js",
      name: "ChatWidget",
      fileName: (format) => `chat-widget.${format}.js`,
      formats: ["es", "umd"],
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.mp3')) {
            return 'assets/sound/[name][extname]'
          }
          return assetInfo.name
        }
      },
    },
  },
  assetsInclude: ['**/*.mp3']
});

//Dev
// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";

// export default defineConfig({
//   plugins: [vue()],
//   build: {
//     lib: {
//       entry: "src/App.vue",
//       name: "VueChatWidget",
//       fileName: (format) => `vue-chat-widget.${format}.js`,
//     },
//     rollupOptions: {
//       output: {
//         // Asegúrate de que los estilos se extraigan correctamente
//         assetFileNames: (assetInfo) => {
//           if (assetInfo.name === "style.css") return "vue-chat-widget.css";
//           return assetInfo.name;
//         },
//       },
//     },
//     cssCodeSplit: false,
//   },
// });
