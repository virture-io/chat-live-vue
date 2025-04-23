<script setup>
import { onMounted, ref } from "vue";
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
});

const isChatOpen = ref(false);
const chatButtonRef = ref(null);
const showGreetingModal = ref(false);

const toggleChat = () => {
  if (showGreetingModal.value) {
    showGreetingModal.value = false;
  }
  isChatOpen.value = !isChatOpen.value;
};

const dismissGreeting = () => {
  showGreetingModal.value = false;
};

onMounted(() => {
  if (chatButtonRef.value) {
    chatButtonRef.value.classList.add("chat-button-greet-animation");

    setTimeout(() => {
      if (chatButtonRef.value) {
        chatButtonRef.value.classList.remove("chat-button-greet-animation");
      }
    }, 10000);

    setTimeout(() => {
      showGreetingModal.value = true;
    }, 500);
  }

  setTimeout(() => {
    if (showGreetingModal.value) {
      dismissGreeting();
    }
  }, 10000);
  socketConnection(props.socketUrl, props.idAgent, props.api_key);
});
</script>

<template>
  <div class="chat-container">
    <transition name="greet-modal-fade">
      <div v-if="showGreetingModal" class="greeting-modal">
        <SvgComponent type="helloSpan" />
        <p>
          {{
            props.welcomeMessage ??
            "Hola!, si necesitas asistencia incia un chat"
          }}
        </p>
        <button @click="dismissGreeting" class="greeting-ok-button">
          Entendido
        </button>
      </div>
    </transition>
    <button
      ref="chatButtonRef"
      class="chat-button"
      @click="toggleChat"
      :class="{ active: isChatOpen }"
    >
      <SvgComponent v-if="!isChatOpen" type="iconBtn" />
      <span v-else>✕</span>
    </button>

    <div v-if="isChatOpen" class="form-container">
      <FormComponent :idAgent="props.idAgent" />
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
  left: 20px;
  z-index: 1000;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: transparent;
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
    transform: rotate(0deg) scale(1);
  }
  25% {
    transform: rotate(15deg) scale(1.1);
  }
  50% {
    transform: rotate(-10deg) scale(1.1);
  }
  75% {
    transform: rotate(5deg) scale(1.1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

/* Clase que aplica la animación al botón */
.chat-button-greet-animation {
  animation-name: greet-wave;
  animation-duration: 1s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 10;
  transform-origin: center center;
}

/* --- Estilos para el Modal de Saludo --- */
.greeting-modal {
  position: relative;
  bottom: 40px;
  right: 0;
  width: auto;
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
    width: 40vw;
  }
}

@media (min-width: 801px) {
  .greeting-modal {
    width: 13vw;
  }
}

.greeting-modal p {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
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

/* --- Transición para el Modal de Saludo (Fade) --- */
.greet-modal-fade-enter-active,
.greet-modal-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.greet-modal-fade-enter-from,
.greet-modal-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
