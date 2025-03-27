<script setup>
import { onMounted, ref } from "vue";
import FormComponent from "./components/FormComponent.vue";
import SvgComponent from "./components/SvgComponent.vue";
import { socketConnection } from "./composable/socket-connection";

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

const isChatOpen = ref(false);

onMounted(() => {
  socketConnection();
});
</script>

<template>
  <div class="chat-container">
    <button
      class="chat-button"
      @click="toggleChat"
      :class="{ active: isChatOpen }"
    >
      <SvgComponent v-if="!isChatOpen" type="iconBtn" />
      <span v-else>✕</span>
    </button>

    <div v-if="isChatOpen" class="">
      <FormComponent />
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
</style>
