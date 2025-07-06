import { ref } from "vue";

const messages = ref([]);
const openChat = ref(false);
const custom_style = ref({});
const closeModalOption = ref(false);
const stateBtnAlerts = ref(false);
const stateBtnUbication = ref(false);

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

  const onCloseModalOption = () => {
    closeModalOption.value = true;
  };

  const setStateBtnAlert = (val) => {
    stateBtnAlerts.value = val;

    if (stateBtnAlerts.value && stateBtnUbication.value) {
      closeModalOption.value = true;
    }
  };

  const setStateBtnUbication = (val) => {
    stateBtnUbication.value = val;
    if (stateBtnAlerts.value && stateBtnUbication.value) {
      closeModalOption.value = true;
    }
  };

  return {
    messages,
    addMessage,
    setValueMessages,
    openChat,
    setValueOpenChat,
    custom_style,
    setCustomStyle,
    closeModalOption,
    onCloseModalOption,
    stateBtnAlerts,
    stateBtnUbication,
    setStateBtnAlert,
    setStateBtnUbication,
  };
};
