import { defineCustomElement } from "vue";
import Chat from "../App.vue";

// Convertir el componente Vue en un Custom Element
const ChatElement = defineCustomElement(Chat, {
  props: {
    socketUrl: String,
    idAgent: String,
    api_key: String,
    welcomeMessage: String,
    iconButton: String,
    // Welcome message colors
    welcomeBackgroundColor: String,
    welcomeTextColor: String,
    welcomeButtonColor: String,
    welcomeButtonHoverColor: String,
    // Chat panel colors
    chatPanelBackground: String,
    chatHeaderBackground: String,
    chatHeaderTextColor: String,
    chatMessagesBackground: String,
    chatInputBackground: String,
    chatInputTextColor: String,
    chatInputBorderColor: String,
    sendButtonBackground: String,
    sendButtonHoverBackground: String,
    // Message colors
    userMessageBackground: String,
    userMessageTextColor: String,
    botMessageBackground: String,
    botMessageTextColor: String
  },
});

// Registrar el elemento personalizado
customElements.define("vue-chat-widget", ChatElement);

export default ChatElement;
