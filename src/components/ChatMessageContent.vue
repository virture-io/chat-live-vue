<template>
  <div class="message-content" v-html="formattedContent"></div>
</template>

<script setup>
import { computed } from "vue";
import DOMPurify from "dompurify";

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: "",
  },
});

const markdownImageRegex =
  /!\[(.*?)\]\(((https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]\.(?:png|jpg|jpeg|gif|webp|bmp|svg))\b\)/gi;
const markdownLinkRegex =
  /\[(.*?)\]\((((https?|ftp|file):\/\/)[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\)/gi;
const standaloneImageUrlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]\.(?:png|jpg|jpeg|gif|webp|bmp|svg))\b/gi;
const standaloneUrlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(?!.*\.(?:png|jpg|jpeg|gif|webp|bmp|svg)\b)/gi;

const boldRegex = /\*\*(.*?)\*\*/g;

const formattedContent = computed(() => {
  if (!props.content) return "";
  let html = props.content;

  const processedUrls = new Set();

  html = html.replace(/\n/g, "<br>");

  html = html.replace(markdownImageRegex, (match, altText, fullUrl) => {
    if (processedUrls.has(fullUrl)) return altText || "";
    processedUrls.add(fullUrl);
    const alt = altText || "Imagen cargada";
    return (
      `<div class="image-container">` +
      `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">` +
      `<img src="${fullUrl}" alt="${alt}" loading="lazy" class="chat-image loading" onload="this.classList.remove('loading'); this.classList.add('loaded');" onerror="this.closest('.image-container').style.display='none';">` +
      `</a>` +
      `</div>`
    );
  });

  html = html.replace(markdownLinkRegex, (match, linkText, fullUrl) => {
    if (processedUrls.has(fullUrl)) return linkText;
    if (processedUrls.has(match)) return match;

    processedUrls.add(fullUrl);
    processedUrls.add(match);
    return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
  });

  html = html.replace(standaloneImageUrlRegex, (match) => {
    if (processedUrls.has(match)) return match;
    processedUrls.add(match);
    const fullUrl = match;
    const alt = "Imagen cargada";
    return (
      `<div class="image-container">` +
      `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">` +
      `<img src="${fullUrl}" alt="${alt}" loading="lazy" class="chat-image loading" onload="this.classList.remove('loading'); this.classList.add('loaded');" onerror="this.closest('.image-container').style.display='none';">` +
      `</a>` +
      `</div>`
    );
  });

  html = html.replace(standaloneUrlRegex, (match) => {
    if (processedUrls.has(match)) return match;
    processedUrls.add(match);
    return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });

  html = html.replace(boldRegex, "<strong>$1</strong>");

  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["strong", "br", "a", "img", "div"],
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
    ],
  });

  return cleanHtml;
});
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
.message-content :deep(a) {
  color: #15be86;
  text-decoration: underline;
  word-break: break-all;
}

/* .message-content :deep(a:hover) {
  opacity: 0.5;
} */

/* .message-content :deep(.image-container > a:hover) {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  opacity: 1;
} */


.message-content :deep(.image-container > a:hover img.chat-image) {
  transform: scale(1.02);
  filter: brightness(65%)
}

.message-content :deep(strong) {
  font-weight: bold;
}

.message-content :deep(img.chat-image) {
  max-width: 100%;
  max-height: 300px;
  height: auto;
  border-radius: 8px;
  margin: 0;
  display: block;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
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

.message-content :deep(.image-container > a) {
  display: block;
  text-decoration: none;
  border-radius: 8px;
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
