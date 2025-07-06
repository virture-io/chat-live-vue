import { defineCustomElement } from "vue";
import Chat from "../App.vue";
import "../assets/style.css";

const ChatElement = defineCustomElement(Chat, {
  props: {
    socketUrl: String,
    idAgent: String,
    api_key: String,
    nameSpace: String,
    welcomeMessage: String,
    iconButton: String,
    gaTrackingId: String,
    // Welcome message colors
    welcomeBackgroundColor: String,
    welcomeTextColor: String,
    welcomeButtonColor: String,
    welcomeButtonHoverColor: String,
    welcomeMessageButton: String,
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
    botMessageTextColor: String,

    //svg
    svgName: String,
    soundName: String,
    instanceName: String,
  },
});

customElements.define("vue-chat-widget", ChatElement);

export default ChatElement;
