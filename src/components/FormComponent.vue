<template>
  <div class="chat-panel">
    <div class="chat-header">
      <div>
        <div class="hello">
          <p>Hola!</p>
          <SvgComponent :type="'hello'" />
        </div>
        <div class="subtitle">
          <p>Inicia un chat, estamos aquí para ayudarte.</p>
        </div>
      </div>
    </div>
    <div class="chat-messages">
      <ChatBubbleComponent />
    </div>
    <div class="chat-input">
      <textarea
        ref="textareaRef"
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
import { ref, onMounted } from "vue";
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

const textareaRef = ref(null);

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
      (val) => {} // Callback opcional
    );
    message.value = "";

    // if (textareaRef.value) {
    //   textareaRef.value.focus();
    // }
  }
};

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
});
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
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .chat-panel {
    width: 80vw;
  }

  .hello p {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .subtitle {
    margin: 0 0 0 0;
    font-size: 0.8rem;
    opacity: 0.9;
  }
}

@media (min-width: 1025px) {
  .chat-panel {
    width: 30vw;
    height: 70vh;
  }

  .hello p {
    font-size: 2rem;
    font-weight: 600;
  }

  .subtitle {
    margin: 0 0 0 0;
    font-size: 1rem;
    opacity: 0.9;
  }
}

/* encabezado saludo */

.chat-header {
  padding: 0 4px 0 4px;
  background-color: #131844;
  color: white;
  height: auto;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
}

.hello {
  display: flex;
  gap: 1px;
  align-items: center;
}

/* Panel mensajes */

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  background-color: #f8f9fc;
  padding: 10px;
}

.message {
  background-color: white;
  padding: 12px 16px;
  border-radius: 5px;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  max-width: 80%;
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

.chat-input {
  padding: 10px;
  display: flex;
  gap: 10px;
  min-height: 50px;
  height: auto;
  background-color: #fff;
  align-items: center;
}

.send-button {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  background-color: #131844;
  color: white;
  padding: 5px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.send-button:hover {
  transform: scale(1.05);
  background-color: #1a205a;
}

textarea {
  flex-grow: 1;
  height: auto;
  min-height: 40px;
  max-height: 100px;
  padding: 8px 10px;
  outline: none;
  background-color: #fff;
  resize: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  line-height: 1.4;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #474747;
  overflow-y: auto;
}
</style>
