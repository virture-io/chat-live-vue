import { ref } from "vue";

const messages = ref([]);

export const useChatMessages = () => {
  const addMessage = (newMessage) => {
    messages.value.push(newMessage);
  };

  const setValueMessages = (val) => {
    messages.value = val;
  };

  return { messages, addMessage, setValueMessages };
};
