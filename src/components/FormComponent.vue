<template>
  <Transition name="slide-fade">
    <div
      v-if="isVisible"
      class="fixed inset-0 w-[100vw] h-[100dvh] rounded-none m-0 flex flex-col overflow-hidden lg:relative lg:bottom-20 lg:left-0 lg:h-[80dvh] lg:w-[40vw] xl:w-[30vw] lg:rounded-[12px] lg:shadow-xl lg:m-0"
      :style="{ backgroundColor: chatPanelBackground }"
    >
      <div
        class="flex p-2 w-full h-[10%] justify-between items-center relative font-sans"
        :style="{
          color: chatHeaderTextColor,
          backgroundColor: chatHeaderBackground,
        }"
      >
        <div
          class="w-12 h-12 rounded-full overflow-hidden"
          v-if="icon_button_url"
        >
          <!-- <SvgComponent type="hello" :color="sendButtonBackground" /> -->

          <img
            :src="icon_button_url ? icon_button_url : ''"
            alt="img"
            class="w-full h-full object-cover rounded-full"
          />
        </div>
        <div class="flex p-2 flex-grow gap-1 items-center">
          <div
            class="flex flex-col justify-center items-start gap-1 font-sans"
            :style="{ color: chatHeaderTextColor }"
          >
            <div class="flex justify-center items-center gap-1 text-base">
              <strong class="">Bienvenido a</strong>
              <strong v-if="instanceName" class="">{{ instanceName }}</strong>
            </div>
            <span class="text-sm"
              >Inicia un chat, estamos aquí para ayudarte.</span
            >
          </div>
        </div>
        <button
          class="absolute top-2 right-2 bg-transparent border-none text-[22px] font-bold cursor-pointer p-1 rounded-full w-[40px] h-[40px] flex items-center justify-center transition-colors duration-200 hover:bg-white/20"
          @click="handleClose"
          :style="{
            color: chatHeaderTextColor,
          }"
        >
          ✕
        </button>
      </div>
      <div class="w-full h-[2px] bg-gray-200"></div>
      <div class="w-full flex flex-col p-2" v-if="!closeModalOption">
        <div class="border border-gray-200 rounded-md hover:bg-gray-50">
          <div class="flex w-full justify-end items-center">
            <button
              @click="onCloseModalOption"
              class="hover:bg-gray-200 text-lg rounded-full w-8 h-8 justify-center items-center"
            >
              x
            </button>
          </div>
          <div class="flex gap-1 p-2">
            <button
              v-if="!stateBtnUbication"
              @click="handleLocationPermission"
              class="flex gap-1 justify-center items-center border border-blue-500 text-gray-600 hover:text-white px-3 py-1 rounded-md hover:bg-blue-600 flex-grow"
            >
              <div class="w-8 h-8">
                <SvgComponent type="ubication" :color="'#454545'" />
              </div>

              <p>Compartir ubicación</p>
            </button>

            <button
              v-if="!stateBtnAlerts"
              @click="handleAudioPermission"
              class="flex gap-1 justify-center items-center border border-purple-500 text-gray-600 hover:text-white px-3 py-1 rounded-md hover:bg-purple-600 flex-grow"
            >
              <div class="w-8 h-8">
                <SvgComponent :color="'#454545'" type="alerts" />
              </div>
              <p>Recibir alertas</p>
            </button>
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-grow overflow-y-auto bg-transparent p-2">
        <ChatBubbleComponent
          :userMessageBackground="userMessageBackground"
          :userMessageTextColor="userMessageTextColor"
          :botMessageBackground="botMessageBackground"
          :botMessageTextColor="botMessageTextColor"
        />
      </div>
      <div
        class="flex gap-2 items-center p-2 h-[10%]"
        :style="{ backgroundColor: chatInputBackground }"
      >
        <textarea
          ref="textareaRef"
          type="text"
          v-model="message"
          placeholder="Empieza a preguntar..."
          @keyup.enter="handleEnterKey"
          class="flex-grow p-2 outline-none bg-transparent resize-none border border-gray-300 rounded-lg text-[16px] text-gray-700"
          :style="{
            backgroundColor: chatInputBackground,
            color: chatInputTextColor,
            borderColor: chatInputBorderColor,
          }"
        ></textarea>
        <button
          class="w-[50px] h-[50px] lg:hidden rounded-md bg-[#131844] text-white flex items-center justify-center transition-transform duration-200 hover:scale-105 hover:bg-[#1a205a]"
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
import { ref, onMounted, watch } from "vue";
import SvgComponent from "./SvgComponent.vue";
import ChatBubbleComponent from "./ChatBubbleComponent.vue";
import { useChatMessages } from "../composable/useMessages";
import { useSessionMetrics } from "../composable/useSessionMetrics";
import { useSound } from "../composable/useSound";
import { sendFlexibleEvent, CHAT_EVENTS } from "../utils/dataLayer";
import { Filter } from "bad-words";
import { bad_words_spanish_list } from "../utils/bad-words-spanish";
import { soundInstance } from "../composable/soundInstance";

const props = defineProps({
  idAgent: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
  },
  gaTrackingId: {
    type: String,
    default: "",
  },
  socket: {
    type: Object,
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
  // chatMessagesBackground: {
  //   type: String,
  //   default: "#f8f9fc",
  // },
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
  instanceName: {
    type: String,
  },
  icon_button_url: {
    type: String,
  },
});

const emit = defineEmits(["close"]);
const textareaRef = ref(null);
const isVisible = ref(false);
const {
  addMessage,
  closeModalOption,
  onCloseModalOption,
  stateBtnAlerts,
  stateBtnUbication,
  setStateBtnAlert,
  setStateBtnUbication,
} = useChatMessages();

// Importar composables de permisos
const { requestLocationPermission } = useSessionMetrics();
const { enableSound } = soundInstance;

const message = ref("");
const id = localStorage.getItem("userUUID");
const filter = new Filter();

// Enfocar el textarea cada vez que el panel se muestre
watch(isVisible, (val) => {
  if (val && textareaRef.value) {
    setTimeout(() => {
      textareaRef.value.focus();
    }, 100);
  }
});

const sendMessage = () => {
  const valueToSend = filter.clean(message.value.trim());
  const utms = JSON.parse(localStorage.getItem("utm_obj"));
  if (valueToSend && props.socket) {
    const form = {
      content: valueToSend,
      role: "user",
    };
    addMessage(form);

    props.socket.emit(
      "send-chat-message",
      {
        userUUID: id ?? "",
        message: valueToSend,
        agentId: props.idAgent,
        api_key: props.api_key,
        utms,
      },
      (val) => {}
    );

    const data = {
      chat_session_id: id,
      chat_message_length: valueToSend.length,
      chat_message_type: "text",
    };
    sendFlexibleEvent(CHAT_EVENTS.MESSAGE_SENT_CLIENT, data);

    message.value = "";
  }
};

const handleEnterKey = () => {
  // Solo enviar mensaje en pantallas lg o mayores
  if (window.innerWidth >= 1024) {
    sendMessage();
  }
};

onMounted(() => {
  filter.addWords(...bad_words_spanish_list);
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

const handleClose = () => {
  sendFlexibleEvent(CHAT_EVENTS.WIDGET_CLOSED, {
    chat_form_close: true,
  });
  closePanel();
  emit("close");
};

// Funciones para manejar los clics en los botones de permisos
const handleLocationPermission = async () => {
  try {
    await requestLocationPermission();
    setStateBtnUbication(true);
  } catch (error) {
    console.error("Error al solicitar permiso de ubicación:", error);
  }
};

const handleAudioPermission = () => {
  enableSound();
  setStateBtnAlert(true);
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
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
.line-separate {
  width: 100%;
  height: 2px;
  background-color: rgb(228, 229, 231);
}
</style>
