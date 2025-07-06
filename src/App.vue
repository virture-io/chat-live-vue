<script setup>
import { onMounted, ref, watch } from "vue";
import FormComponent from "./components/FormComponent.vue";
import SvgComponent from "./components/SvgComponent.vue";
import { useSocketConnection } from "./composable/socket-connection";
import { useChatMessages } from "./composable/useMessages";
import "./assets/style.css";
import {
  initializeGoogleAnalytics,
  sendFlexibleEvent,
  CHAT_EVENTS,
} from "./utils/dataLayer";

const props = defineProps({
  socketUrl: {
    type: String,
    required: true,
  },
  idAgent: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
  },
  nameSpace: {
    type: String,
    required: true,
  },
  gaTrackingId: {
    type: String,
  },
  welcomeMessage: {
    type: String,
    required: true,
  },
  iconButton: {
    type: String,
    required: true,
  },
  welcomeBackgroundColor: {
    type: String,
    default: "#333",
  },
  welcomeTextColor: {
    type: String,
    default: "#fff",
  },
  welcomeButtonColor: {
    type: String,
    default: "#007bff",
  },
  welcomeButtonHoverColor: {
    type: String,
    default: "#0056b3",
  },
  welcomeMessageButton: {
    type: String,
    default: "start chat",
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
  svgName: {
    type: String,
    default: "",
  },
  soundName: {
    type: String,
    default: "sound1",
  },
  instanceName: {
    type: String,
  },
});

const chatButtonRef = ref(null);
const showGreetingModal = ref(false);
const showTypingIndicator = ref(false);
const { openChat, setValueOpenChat, custom_style } = useChatMessages();

// Inicializar la conexión del socket
const { socket: chatSocket } = useSocketConnection(
  props.socketUrl,
  props.idAgent,
  props.api_key,
  props.nameSpace,
  props.soundName,
  props.gaTrackingId
);

const toggleChat = () => {
  if (showGreetingModal.value) {
    showGreetingModal.value = false;
  }
  if (showTypingIndicator.value) {
    showTypingIndicator.value = false;
  }
  setValueOpenChat(!openChat.value);
  chatButtonRef.value?.classList.remove("chat-button-greet-animation");
};

const dismissGreeting = () => {
  showGreetingModal.value = false;
  chatButtonRef.value?.classList.remove("chat-button-greet-animation");
};

const client_Clic_Start = () => {
  clicStartChat();
};

const clicStartChat = () => {
  showGreetingModal.value = false;
  setValueOpenChat(true);
  chatButtonRef.value?.classList.remove("chat-button-greet-animation");
};

let typingTimer = null;
let modalTimer = null;
let autoDismissTimer = null;
let unwatchChatOpen = null;

const cleanupEffects = () => {
  clearTimeout(typingTimer);
  clearTimeout(modalTimer);
  clearTimeout(autoDismissTimer);
  if (chatButtonRef.value) {
    chatButtonRef.value.classList.remove("chat-button-greet-animation");
  }
  showTypingIndicator.value = false;
  showGreetingModal.value = false;
  if (unwatchChatOpen) {
    unwatchChatOpen();
  }
};

const setupTimers = () => {
  cleanupEffects();

  if (chatButtonRef.value && custom_style.value.visibility_welcome_modal) {
    typingTimer = setTimeout(() => {
      if (!openChat.value && !showGreetingModal.value) {
        showTypingIndicator.value = true;
      }
    }, 1000);

    modalTimer = setTimeout(() => {
      if (!openChat.value) {
        showTypingIndicator.value = false;
        showGreetingModal.value = true;
        chatButtonRef.value?.classList.add("chat-button-greet-animation");
      }
    }, 3500);

    autoDismissTimer = setTimeout(() => {
      if (showGreetingModal.value) {
        dismissGreeting();
      }
      chatButtonRef.value?.classList.remove("chat-button-greet-animation");
    }, custom_style.value?.time_active_welcome_modal * 1000 + 4500 || 15000);
  }
};

// Observar cambios en custom_style
watch(
  custom_style,
  (newValue) => {
    if (newValue && !openChat.value) {
      setupTimers();
    }
  },
  { deep: true }
);

watch(openChat, (newValue, oldValue) => {
  if (newValue) {
    clicStartChat();
  }

  newValue
    ? sendFlexibleEvent(CHAT_EVENTS.WIDGET_OPENED, {
        chat_form_open: true,
      })
    : sendFlexibleEvent(CHAT_EVENTS.WIDGET_CLOSED, {
        chat_form_close: true,
      });
});

// Watch para inicializar GA4 si el trackingId cambia y es válido
watch(
  () => props.gaTrackingId,
  (newVal, oldVal) => {
    if (newVal && oldVal !== newVal) {
      initializeGoogleAnalytics(newVal);
    }
  }
);

onMounted(() => {
  setupTimers();

  // Inicializar Google Analytics solo aquí
  if (props.gaTrackingId) {
    initializeGoogleAnalytics(props.gaTrackingId);
  }

  unwatchChatOpen = watch(openChat, (newValue) => {
    if (newValue) {
      cleanupEffects();
    }
  });
});
</script>

<template>
  <div class="chat-container" :class="{ 'chat-open': openChat }">
    <transition name="typing-fade">
      <div
        v-if="showTypingIndicator"
        class="typing-indicator"
        :style="{
          backgroundColor: custom_style.welcomeBackgroundColor
            ? custom_style.welcomeBackgroundColor
            : welcomeBackgroundColor,
          color: custom_style.welcomeTextColor
            ? custom_style.welcomeTextColor
            : welcomeTextColor,
        }"
      >
        <span
          :style="{
            backgroundColor: custom_style.welcomeTextColor
              ? custom_style.welcomeTextColor
              : welcomeTextColor,
          }"
        ></span>
        <span
          :style="{
            backgroundColor: custom_style.welcomeTextColor
              ? custom_style.welcomeTextColor
              : welcomeTextColor,
          }"
        ></span>
        <span
          :style="{
            backgroundColor: custom_style.welcomeTextColor
              ? custom_style.welcomeTextColor
              : welcomeTextColor,
          }"
        ></span>
      </div>
    </transition>

    <transition name="greet-modal-fade">
      <div
        v-if="showGreetingModal"
        class="greeting-modal"
        :style="{
          backgroundColor: custom_style.welcomeBackgroundColor
            ? custom_style.welcomeBackgroundColor
            : welcomeBackgroundColor,
          color: custom_style.welcomeTextColor
            ? custom_style.welcomeTextColor
            : welcomeTextColor,
        }"
      >
        <div class="closeModal" v-if="custom_style.btn_close_welcome_modal">
          <button
            @click="dismissGreeting"
            :style="{
              color: custom_style.welcomeTextColor
                ? custom_style.welcomeTextColor
                : welcomeTextColor,
            }"
          >
            ✕
          </button>
        </div>
        <div @click="client_Clic_Start" style="cursor: pointer">
          <SvgComponent
            :type="
              custom_style.svgName ? custom_style.svgName : props.svgName ?? ''
            "
          />
          <p>
            {{
              custom_style.welcomeMessage
                ? custom_style.welcomeMessage
                : props.welcomeMessage ??
                  "¡Hola! Bienvenido. Si necesitas ayuda con tu búsqueda o tienes alguna consulta, no dudes en iniciar un chat. ¡Estamos aquí para asistirte!"
            }}
          </p>
          <button
            @click="client_Clic_Start"
            class="greeting-ok-button"
            :style="{
              backgroundColor: custom_style.welcomeButtonColor
                ? custom_style.welcomeButtonColor
                : welcomeButtonColor,
              '&:hover': {
                backgroundColor: custom_style.welcomeButtonHoverColor
                  ? custom_style.welcomeButtonHoverColor
                  : welcomeButtonHoverColor,
              },
            }"
          >
            {{
              custom_style.welcomeMessageButton
                ? custom_style.welcomeMessageButton
                : props.welcomeMessageButton ?? "¡Chatear Ahora!"
            }}
          </button>
        </div>
      </div>
    </transition>

    <button
      ref="chatButtonRef"
      v-if="!openChat"
      class="chat-button"
      @click="toggleChat"
      :class="{ active: openChat }"
      :style="
        openChat
          ? {
              backgroundColor: custom_style.chatHeaderBackground
                ? custom_style.chatHeaderBackground
                : chatHeaderBackground,
              color: '#fff',
            }
          : {}
      "
    >
      <template v-if="!openChat">
        <img
          v-if="props.iconButton || custom_style.icon_button_url"
          :src="
            custom_style.icon_button_url
              ? custom_style.icon_button_url
              : props.iconButton
          "
          alt="Chat logo"
          class="chat-button-icon chat-button-image"
        />

        <!-- <SvgComponent
          v-else
          type="iconBtn"
          class="chat-button-icon chat-button-svg"
        /> -->
      </template>

      <span
        v-else
        class="chat-button-close-icon"
        :style="{
          color: custom_style.chatHeaderTextColor
            ? custom_style.chatHeaderTextColor
            : chatHeaderTextColor,
        }"
        >✕</span
      >
    </button>

    <div v-if="openChat" class="form-container">
      <FormComponent
        :gaTrackingId="props.gaTrackingId"
        :socketUrl="props.socketUrl"
        :nameSpace="props.nameSpace"
        :idAgent="props.idAgent"
        :api_key="props.api_key"
        :socket="chatSocket"
        :chatPanelBackground="
          custom_style.chatPanelBackground || chatPanelBackground
        "
        :chatHeaderBackground="
          custom_style.chatHeaderBackground || chatHeaderBackground
        "
        :chatHeaderTextColor="
          custom_style.chatHeaderTextColor || chatHeaderTextColor
        "
        :chatMessagesBackground="
          custom_style.chatMessagesBackground || chatMessagesBackground
        "
        :chatInputBackground="
          custom_style.chatInputBackground || chatInputBackground
        "
        :chatInputTextColor="
          custom_style.chatInputTextColor || chatInputTextColor
        "
        :chatInputBorderColor="
          custom_style.chatInputBorderColor || chatInputBorderColor
        "
        :sendButtonBackground="
          custom_style.sendButtonBackground || sendButtonBackground
        "
        :sendButtonHoverBackground="
          custom_style.sendButtonHoverBackground || sendButtonHoverBackground
        "
        :userMessageBackground="
          custom_style.userMessageBackground || userMessageBackground
        "
        :userMessageTextColor="
          custom_style.userMessageTextColor || userMessageTextColor
        "
        :botMessageBackground="
          custom_style.botMessageBackground || botMessageBackground
        "
        :botMessageTextColor="
          custom_style.botMessageTextColor || botMessageTextColor
        "
        :instanceName="instanceName"
        :icon_button_url="custom_style.icon_button_url"
        @close="toggleChat"
      />
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
:host {
  display: block;
}

.chat-container {
  position: fixed;
  bottom: 20px;
  left: 30px;
  z-index: 1000;
}

/* --- Estilos Indicador de Escritura (Nuevos) --- */
.typing-indicator {
  position: absolute;
  bottom: 80px;
  left: 80%;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 15px 15px 15px 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  border-radius: 50%;
  opacity: 0.4;
  animation: typing-dots 1.2s infinite ease-in-out;
}

@keyframes typing-dots {
  0%,
  100% {
    opacity: 0.4;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}
.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

.typing-fade-enter-active,
.typing-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.typing-fade-enter-from,
.typing-fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* --- Estilos Modal de Saludo (Ajustados) --- */
.greeting-modal {
  position: absolute;
  bottom: 85px;
  left: 5px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-size: 0.9rem;
  line-height: 1.4;
  z-index: 1001;
  flex-wrap: wrap;
}

@media (max-width: 800px) {
  .greeting-modal {
    width: 60vw;
  }

  .chat-container {
    left: 10px;
  }
}
@media (min-width: 801px) {
  .greeting-modal {
    width: 20vw;
  }
}

.greeting-modal p {
  margin: 10px 0 10px 0;
  font-size: 1.1rem;
  font-family: "Inter", "Segoe UI", "Open Sans", -apple-system,
    BlinkMacSystemFont, sans-serif;
}

.greeting-ok-button {
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-top: 5px;
  transition: background-color 0.2s ease;
}

.closeModal {
  display: flex;
  justify-content: end;
}
.closeModal button {
  border-style: none;
  border-bottom-style: none;
  background-color: transparent;
  font-size: 20px;
  padding: 0px;
  font-weight: bold;
  cursor: pointer;
}
.closeModal button:hover {
  opacity: 0.8;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  padding: 0;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1002;
}

.chat-button:hover {
  transform: scale(1.05);
  background-color: #131844;
}

.chat-button.active {
  background-color: v-bind(chatHeaderBackground);
}

.form-container {
  position: relative;
}

@keyframes greet-wave {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
}

.chat-button-greet-animation {
  animation-name: greet-wave;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform-origin: center center;
}

.chat-button-icon {
  display: block;
  width: 100%;
  height: 100%;
}

.chat-button-image {
  object-fit: cover;
}

.chat-button-svg :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.chat-button-close-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 24px;
  line-height: 1;
  position: relative;
  z-index: 1;
}

/* --- Estilos para dispositivos móviles --- */
@media (max-width: 768px) {
  .chat-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
  }

  .chat-container:not(.chat-open) {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: auto;
    top: auto;
  }

  .chat-container.chat-open .chat-button,
  .chat-container.chat-open .typing-indicator,
  .chat-container.chat-open .greeting-modal {
    display: none;
  }

  .chat-container.chat-open .form-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    height: 100vh; /* Esto se aplica primero */
    height: 100dvh;
    width: 100vw; /* Fallback para navegadores que no entienden dvw */
    width: 100dvw;
  }

  .chat-container.chat-open .form-container .chat-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    height: 100vh; /* Esto se aplica primero */
    height: 100dvh;
    width: 100vw; /* Fallback para navegadores que no entienden dvw */
    width: 100dvw;
    border-radius: 0;
    margin: 0;
  }
}
</style>
