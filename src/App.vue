<script setup>
import { onMounted, ref, watch } from "vue";
import FormComponent from "./components/FormComponent.vue";
import SvgComponent from "./components/SvgComponent.vue";
import { socketConnection } from "./composable/socket-connection";

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
  welcomeMessage: {
    type: String,
    required: true,
  },
  iconButton: {
    type: String,
    required: true,
  },
});

const isChatOpen = ref(false);
const chatButtonRef = ref(null);
const showGreetingModal = ref(false);
const showTypingIndicator = ref(false);

const toggleChat = () => {
  if (showGreetingModal.value) {
    showGreetingModal.value = false;
  }
  if (showTypingIndicator.value) {
    showTypingIndicator.value = false;
  }
  isChatOpen.value = !isChatOpen.value;
  chatButtonRef.value?.classList.remove("chat-button-greet-animation");
};

const dismissGreeting = () => {
  showGreetingModal.value = false;
  chatButtonRef.value?.classList.remove("chat-button-greet-animation");
};

const clicStartChat = () => {
  showGreetingModal.value = false;
  isChatOpen.value = true;
  chatButtonRef.value?.classList.remove("chat-button-greet-animation");
};

onMounted(() => {
  let typingTimer = null;
  let modalTimer = null;
  let autoDismissTimer = null;
  let unwatchChatOpen = null;

  if (chatButtonRef.value) {
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

    typingTimer = setTimeout(() => {
      if (!isChatOpen.value && !showGreetingModal.value) {
        showTypingIndicator.value = true;
      }
    }, 1000);

    modalTimer = setTimeout(() => {
      if (!isChatOpen.value) {
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
    }, 15000);

    unwatchChatOpen = watch(isChatOpen, (newValue) => {
      if (newValue) {
        cleanupEffects();
      }
    });
  }

  // Establecer conexión del socket
  socketConnection(props.socketUrl, props.idAgent, props.api_key);
});
</script>

<template>
  <div class="chat-container">
    <transition name="typing-fade">
      <div v-if="showTypingIndicator" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </transition>

    <transition name="greet-modal-fade">
      <div v-if="showGreetingModal" class="greeting-modal">
        <div class="closeModal">
          <button @click="dismissGreeting">✕</button>
        </div>
        <SvgComponent type="helloSpan" />
        <p>
          {{
            props.welcomeMessage ??
            "¡Hola! Bienvenido. Si necesitas ayuda con tu búsqueda o tienes alguna consulta, no dudes en iniciar un chat. ¡Estamos aquí para asistirte!"
          }}
        </p>
        <button @click="clicStartChat" class="greeting-ok-button">
          ¡Chatear ahora!
        </button>
      </div>
    </transition>

    <button
      ref="chatButtonRef"
      class="chat-button"
      @click="toggleChat"
      :class="{ active: isChatOpen }"
    >
      <template v-if="!isChatOpen">
        <img
          v-if="props.iconButton"
          :src="props.iconButton"
          alt="Chat logo"
          class="chat-button-icon chat-button-image"
        />

        <SvgComponent
          v-else
          type="iconBtn"
          class="chat-button-icon chat-button-svg"
        />
      </template>

      <span v-else class="chat-button-close-icon">✕</span>
    </button>

    <div v-if="isChatOpen" class="form-container">
      <FormComponent :idAgent="props.idAgent" :api_key="props.api_key" />
    </div>
  </div>
</template>

<style scoped>
:host {
  display: block;
}

.chat-container {
  position: fixed;
  bottom: 20px;
  left: 2px;
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
  background-color: #333;
  border-radius: 15px 15px 15px 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  margin: 0 2px;
  background-color: #aeaeae;
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
  background-color: #333;
  color: white;
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
  background-color: #007bff;
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
.greeting-ok-button:hover {
  background-color: #0056b3;
}

.greet-modal-fade-enter-active,
.greet-modal-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.greet-modal-fade-enter-from,
.greet-modal-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.closeModal {
  display: flex;
  justify-content: end;
}
.closeModal button {
  border-style: none;
  border-bottom-style: none;
  background-color: transparent;
  color: white;
  font-size: 20px;
  padding: 0px;
  font-weight: bold;
  cursor: pointer;
}
.closeModal button:hover {
  color: rgb(216, 143, 143);
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
  background-color: #131844;
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
  color: white;
  background-color: transparent;
  position: relative;
  z-index: 1;
}
</style>
