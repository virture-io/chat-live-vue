import { ref } from "vue";

const messages = ref([]);
const openChat = ref(false);
const custom_style = ref({});

export const useChatMessages = () => {
  const addMessage = (newMessage) => {
    setValueOpenChat(true);
    messages.value.push(newMessage);
  };

  const setValueMessages = (val) => {
    messages.value = val;
  };

  const setValueOpenChat = (value) => {
    openChat.value = value;
  };

  const setCustomStyle = (val) => {
    custom_style.value = val;
  };

  return {
    messages,
    addMessage,
    setValueMessages,
    openChat,
    setValueOpenChat,
    custom_style,
    setCustomStyle,
  };
};
