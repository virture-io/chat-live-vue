<template>
  <Transition name="slide-fade">
    <div
      v-if="isVisible"
      class="chat-panel"
      :style="{ backgroundColor: chatPanelBackground }"
    >
      <div
        class="chat-header"
        :style="{
          backgroundColor: chatHeaderBackground,
          color: chatHeaderTextColor,
        }"
      >
        <div class="sub-head">
          <span>Hola!</span>
          <SvgComponent :type="'hello'" />
        </div>
        <span>Inicia un chat, estamos aquí para ayudarte.</span>
      </div>
      <div
        class="chat-messages"
        :style="{ backgroundColor: chatMessagesBackground }"
      >
        <ChatBubbleComponent
          :userMessageBackground="userMessageBackground"
          :userMessageTextColor="userMessageTextColor"
          :botMessageBackground="botMessageBackground"
          :botMessageTextColor="botMessageTextColor"
        />
      </div>
      <div class="chat-input" :style="{ backgroundColor: chatInputBackground }">
        <textarea
          ref="textareaRef"
          type="text"
          v-model="message"
          placeholder="Empieza a preguntar..."
          @keyup.enter="sendMessage"
          :style="{
            backgroundColor: chatInputBackground,
            color: chatInputTextColor,
            borderColor: chatInputBorderColor,
          }"
        ></textarea>
        <button
          class="send-button"
          @click="sendMessage"
          :style="{
            backgroundColor: sendButtonBackground,
            '&:hover': {
              backgroundColor: sendButtonHoverBackground,
            },
          }"
        >
          <SvgComponent type="sendBtn" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SvgComponent from "./SvgComponent.vue";
import ChatBubbleComponent from "./ChatBubbleComponent.vue";
import { useChatMessages } from "../composable/useMessages";
import { useSocketConnection } from "../composable/socket-connection";
import { pushToDataLayer, CHAT_EVENTS } from "../utils/dataLayer";

const props = defineProps({
  idAgent: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
  },
  chatPanelBackground: {
    type: String,
    default: "#ffffff",
  },
  chatHeaderBackground: {
    type: String,
    default: "#131844",
  },
  chatHeaderTextColor: {
    type: String,
    default: "#ffffff",
  },
  chatMessagesBackground: {
    type: String,
    default: "#f8f9fc",
  },
  chatInputBackground: {
    type: String,
    default: "#ffffff",
  },
  chatInputTextColor: {
    type: String,
    default: "#474747",
  },
  chatInputBorderColor: {
    type: String,
    default: "#ccc",
  },
  sendButtonBackground: {
    type: String,
    default: "#131844",
  },
  sendButtonHoverBackground: {
    type: String,
    default: "#1a205a",
  },
  userMessageBackground: {
    type: String,
    default: "#15be86",
  },
  userMessageTextColor: {
    type: String,
    default: "#ffffff",
  },
  botMessageBackground: {
    type: String,
    default: "#f5f5f5",
  },
  botMessageTextColor: {
    type: String,
    default: "#3f3f3f",
  },

  socketUrl: {
    type: String,
    default: "",
  },

  nameSpace: {
    type: String,
    default: "",
  },
});

const textareaRef = ref(null);
const isVisible = ref(false);
const { addMessage } = useChatMessages();
const message = ref("");
const { socket } = useSocketConnection(
  props.socketUrl,
  props.idAgent,
  props.api_key,
  props.nameSpace
);
const id = localStorage.getItem("userUUID");

const sendMessage = () => {
  if (message.value.trim() && socket.value) {
    const form = {
      content: message.value.trim(),
      role: "user",
    };
    addMessage(form);
    socket.value.emit(
      "send-chat-message",
      {
        userUUID: id ?? "",
        message: message.value.trim(),
        agentId: props.idAgent,
        api_key: props.api_key,
        utms: {
          utm_source: localStorage.getItem("utm_source"),
          utm_medium: localStorage.getItem("utm_medium"),
          campaign: localStorage.getItem("campaign"),
          utm_term: localStorage.getItem("utm_term"),
          utm_content: localStorage.getItem("utm_content"),
          gclid: localStorage.getItem("gclid"),
          wbraid: localStorage.getItem("wbraid"),
          gbraid: localStorage.getItem("gbraid"),
          crm_link: localStorage.getItem("crm_link"),
          adSet: localStorage.getItem("adSet"),
          ad: localStorage.getItem("ad"),
          form: localStorage.getItem("form"),
          gad_campaignid: localStorage.getItem("gad_campaignid"),
          gad_source: localStorage.getItem("gad_source"),
        },
      },
      (val) => {}
    );

    // Track message sent event
    pushToDataLayer({
      event: CHAT_EVENTS.MESSAGE_SENT,
      chat_session_id: id,
      chat_message_length: message.value.trim().length,
      chat_message_type: "text",
    });

    message.value = "";
  }
};

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.focus();
  }

  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});

const closePanel = () => {
  isVisible.value = false;
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
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  margin: 0px;
}

@media (max-width: 1024px) {
  .chat-panel {
    width: 95vw;
  }

  .sub-head {
    font-size: 1.5rem;
  }
}

@media (min-width: 1025px) {
  .chat-panel {
    width: 25vw;
    height: 70vh;
  }

  .sub-head {
    font-size: 2rem;
  }
}

/* encabezado saludo */

.chat-header {
  width: 100%;
  height: auto;
  padding: 1px 4px 1px 4px;
  background-color: #131844;
  color: white;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px;
}

.sub-head {
  padding: 3px;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
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
  margin: 0px;
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

/* Animaciones */
.slide-fade-enter-active {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
  transform-origin: center;
}

.slide-fade-enter-from {
  transform: scale(0);
  opacity: 0;
}

.slide-fade-enter-to {
  transform: scale(1);
  opacity: 1;
}

.slide-fade-leave-from {
  transform: scale(1);
  opacity: 1;
}

.slide-fade-leave-to {
  transform: scale(0.8);
  opacity: 0;
}
</style>
