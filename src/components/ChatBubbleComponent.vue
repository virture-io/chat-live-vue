<template>
  <div ref="messagesContainer" class="messages-container">
    <div
      v-for="(item, index) in messages"
      :key="index"
      :class="[
        'message',
        item.role === 'user' ? 'message-sent' : 'message-received',
      ]"
    >
      <div>{{ item.message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useChatMessages } from "../composable/useMessages";

const { messages } = useChatMessages();
const messagesContainer = ref(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

onMounted(scrollToBottom);

watch(messages, scrollToBottom, { deep: true });
</script>

<style scoped>
.message {
  margin: 2px 0;
  padding: 5px 10px;
  border-radius: 3px;
  max-width: 70%;
  min-width: 40px;
  height: fit-content;
  overflow-wrap: break-word;
  word-break: break-word;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  text-align: justify;
  transform: translateY(-4px);
  transition: all 0.2s ease-in-out;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  font-size: 16px;
}

.messages-container {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: white;
}

.message:hover {
  transform: translateY(-6px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.07), 0 4px 8px rgba(0, 0, 0, 0.07),
    0 8px 16px rgba(0, 0, 0, 0.07), 0 16px 32px rgba(0, 0, 0, 0.07);
}

.message-content {
  width: 100%;
  line-height: 1;
  margin: 0;
  text-align: justify;
}

.message-sent {
  background-color: #15be86;
  color: var(--message-color-text-sender);
  margin-left: auto;
  padding: 1rem;
  color: white;
}

.message-received {
  background-color: #f5f5f5;
  color: #3f3f3f;
  margin-right: auto;
  padding: 1rem;
}

.timestamp {
  font-size: 8px;
  margin-top: 2px;
  opacity: 0.7;
  align-self: flex-end;
  color: #3f3f3f;
}

@media (max-width: 480px) {
  .message {
    max-width: 85%;
  }

  .messages-container {
    padding: 5px;
  }
}


@keyframes l3 {
  20% {
    background-position: 0% 0%, 50% 50%, 100% 50%;
  }
  40% {
    background-position: 0% 100%, 50% 0%, 100% 50%;
  }
  60% {
    background-position: 0% 50%, 50% 100%, 100% 0%;
  }
  80% {
    background-position: 0% 50%, 50% 50%, 100% 100%;
  }
}

.message-content a {
  color: var(--message-bg-color-sender);
  text-decoration: underline;
  word-break: break-word;
}

.message-content a:hover {
  opacity: 0.8;
}

.message-content h4 {
  font-size: 1.2em;
  margin: 0.5em 0;
  font-weight: 600;
  line-height: 1.3;
}

.message-content .image-container {
  margin: 8px 0;
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.message-content .image-container img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.message-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 4px 0;
}

.message-content img.loading {
  background-color: #f0f0f0;
  min-height: 200px;
}

.message-content img {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.message-content img.loaded {
  opacity: 1;
}

.link-preview {
  margin: 8px 0;
  width: 100%;
}

.preview-container {
  display: flex;
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s ease;
}

.preview-container:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.preview-content {
  flex: 1;
  overflow: hidden;
}

.preview-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.preview-url {
  font-size: 0.9em;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.message-content br {
  display: block;
  margin: 8px 0;
  content: "";
}
</style>
