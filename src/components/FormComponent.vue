<template>
  <div class="chat-panel">
    <div class="chat-header">
      <div class="hello">
        <p>Hola!</p>
        <SvgComponent :type="'hello'" />
      </div>
      <div class="restart-header">
        <p class="subtitle">Inicia un chat, estamos aquí para ayudarte.</p>
        <button>
          <SvgComponent />
        </button>
      </div>
    </div>
    <div class="chat-messages">
      <ChatBubbleComponent />
    </div>
    <div class="chat-input">
      <textarea
        type="text"
        v-model="message"
        placeholder="Empieza a preguntar..."
        @keyup.enter="sendMessage"
      ></textarea>
      <button class="send-button" @click="sendMessage">
        <SvgComponent type="sendBtn" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SvgComponent from "./SvgComponent.vue";
import ChatBubbleComponent from "./ChatBubbleComponent.vue";
import { useChatMessages } from "../composable/useMessages";
import { useSocket } from "../composable/socket-connection";

const props = defineProps({
  idAgent: {
    type: String,
    required: true,
  },
});

const { addMessage } = useChatMessages();
const message = ref("");
const socket = useSocket();
const id = localStorage.getItem("userUUID");

const sendMessage = () => {
  if (message.value.trim()) {
    const form = {
      content: message.value.trim(),
      role: "user",
    };
    addMessage(form);
    socket.emit(
      "send-chat-message",
      {
        userUUID: id ?? "",
        message: message.value.trim(),
        agentId: props.idAgent,
      },
      (val) => {
        console.log(val);
      }
    );
    message.value = "";
  }
};
</script>

<style scoped>
/* contenedor principal */
.chat-panel {
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 80vw;
  height: 80vh;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  font-family: Arial, Helvetica, sans-serif;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .chat-panel {
    width: 80vw;
  }
}

@media (min-width: 1025px) {
  .chat-panel {
    width: 30vw;
    height: 70vh;
  }
}

/* encabezado saludo */
.chat-header {
  padding: 20px;
  background-color: #131844;
  color: white;
  height: 20%;
}

.hello {
  display: flex;
  gap: 2px;
  justify-items: center;
  align-items: center;
}

.hello p {
  font-size: 2rem;
}

.restart-header {
  display: flex;
  justify-content: space-between;
}

.restart-header button {
  border: none;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
}

.restart-header button:hover {
  background-color: #252842;
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

/* Panel mensajes */

.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: #f8f9fc;
  height: 80%;
}

.message {
  background-color: white;
  padding: 12px 16px;
  border-radius: 5px;
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
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.quick-reply-btn:hover {
  background-color: #d2e3fc;
}

/* contenedor enviar */
.chat-input {
  padding: 5px;
  display: flex;
  gap: 5px;
  height: 5%;
}

.send-button {
  width: auto;
  height: auto;
  border-radius: 5px;
  background-color: #131844;
  color: white;
  padding: 5px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-items: center;
  transition: all 0.2s ease;
}

.send-button:hover {
  transform: scale(1.05);
}

textarea {
  width: 100%;
  height: 100%;
  padding: 5px;
  outline: none;
  background-color: #fff;
  resize: none;
  border-top: 1px solid #ddd;
  border-right: none;
  border-bottom: none;
  border-left: none;
  line-height: 1.2;
  text-align: justify;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #474747;
}
</style>
