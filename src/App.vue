<script setup>
import { ref } from "vue";

const isChatOpen = ref(false);
const message = ref('');

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const sendMessage = () => {
  if (message.value.trim()) {
    // Aquí iría la lógica para enviar el mensaje
    message.value = '';
  }
};
</script>

<template>
  <div class="chat-container">
    <button
      class="chat-button"
      @click="toggleChat"
      :class="{ active: isChatOpen }"
    >
      <span v-if="!isChatOpen">💬</span>
      <span v-else>✕</span>
    </button>

    <div v-if="isChatOpen" class="chat-panel">
      <div class="chat-header">
        <h3>Hola! 👋</h3>
        <p class="subtitle">Start a chat. We're here to help you 24/7</p>
      </div>
      <div class="chat-messages">
        <div class="message">
          <p>Claro, ¿de qué te gustaría que hablemos? Puedo compartir información, responder preguntas o simplemente charlar sobre un tema de tu interés.</p>
        </div>
        <div class="quick-replies">
          <button class="quick-reply-btn">dime algo</button>
          <button class="quick-reply-btn">otra cosa</button>
          <button class="quick-reply-btn">hola</button>
        </div>
      </div>
      <div class="chat-input">
        <input 
          type="text" 
          v-model="message"
          placeholder="Empieza a preguntar..." 
          @keyup.enter="sendMessage"
        />
        <button class="send-button" @click="sendMessage">
          ➤
        </button>
      </div>
    </div>
  </div>
</template>

<style>
:host {
  display: block;
}

.chat-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #1a1f36;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.chat-button:hover {
  transform: scale(1.05);
  background-color: #2a2f46;
}

.chat-button.active {
  background-color: #1976d2;
}

.chat-panel {
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 340px;
  height: 500px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 20px;
  background-color: #1a1f36;
  color: white;
}

.chat-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.subtitle {
  margin: 8px 0 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f8f9fc;
}

.message {
  background-color: white;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.message p {
  margin: 0;
  color: #4a4a4a;
  font-size: 14px;
  line-height: 1.5;
}

.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.quick-reply-btn {
  background-color: #e8f0fe;
  color: #1a73e8;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.quick-reply-btn:hover {
  background-color: #d2e3fc;
}

.chat-input {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  background-color: white;
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.chat-input input:focus {
  border-color: #1a73e8;
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #1a73e8;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.send-button:hover {
  background-color: #1557b0;
  transform: scale(1.05);
}
</style>
