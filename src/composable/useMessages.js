import { ref } from "vue";

const messages = ref([]);
const openChat = ref(false);

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

  return { messages, addMessage, setValueMessages, openChat, setValueOpenChat };
};
