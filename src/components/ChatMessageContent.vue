<template>
  <div class="message-content" v-html="formattedContent"></div>
</template>

<script setup>
import { computed } from "vue";
import DOMPurify from "dompurify"; // ¡Importante para seguridad!

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: "",
  },
});

// Expresiones regulares
const urlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
const imageRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\.(?:png|jpg|jpeg|gif|webp|bmp|svg)\b/gi;
const boldRegex = /\*\*(.*?)\*\*/g;

const formattedContent = computed(() => {
  let html = props.content || "";

  html = html.replace(/\n/g, "<br>");

  // 3. Procesar imágenes
  html = html.replace(imageRegex, (match) => {
    return `<div class="image-container"><img src="${match}" alt="Imagen cargada" loading="lazy" class="chat-image loading" onload="this.classList.remove('loading'); this.classList.add('loaded');" onerror="this.parentElement.style.display='none';"></div>`;
  });

  // 4. Procesar enlaces (que no sean ya imágenes)
  html = html.replace(urlRegex, (match) => {
    if (!/\.(?:png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(match)) {
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    }
    return match;
  });

  // 5. Procesar negritas
  html = html.replace(boldRegex, "<strong>$1</strong>");

  // 7. ¡Sanitizar el HTML final con DOMPurify!

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["strong", "em", "code", "br", "a", "img", "div"],
    ADD_ATTR: [
      "href",
      "target",
      "rel",
      "src",
      "alt",
      "loading",
      "class",
      "style",
      "onload",
      "onerror",
    ], // Atributos que usamos
  });

  return cleanHtml;
});
</script>

<style scoped>
.message-content :deep(a) {
  color: #15be86;
  text-decoration: underline;
  word-break: break-all;
}

.message-content :deep(a:hover) {
  opacity: 0.8;
}

.message-content :deep(strong) {
  font-weight: bold;
}

.message-content :deep(img.chat-image) {
  max-width: 100%;
  max-height: 300px;
  height: auto;
  border-radius: 8px;
  margin: 4px 0;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.message-content :deep(img.chat-image.loading) {
  min-height: 100px;
  background-color: #f0f0f0;
  opacity: 1;
}

.message-content :deep(img.chat-image.loaded) {
  opacity: 1;
}

.message-content :deep(.image-container) {
  margin: 8px 0;
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.message-content :deep(.link-preview) {
  margin: 8px 0;
  width: 100%;
}

.message-content :deep(.preview-container) {
  display: flex;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s ease;
}

.message-content :deep(.preview-container:hover) {
  background-color: rgba(0, 0, 0, 0.07);
}

.message-content :deep(.preview-content) {
  flex: 1;
  overflow: hidden;
}

.message-content :deep(.preview-title) {
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-content :deep(.preview-url) {
  font-size: 0.9em;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555;
}

.message-content :deep(.preview-icon) {
  flex-shrink: 0;
  opacity: 0.7;
}

.message-content :deep(br) {
  content: "";
  display: block;
  margin-bottom: 0.5em;
}
</style>
