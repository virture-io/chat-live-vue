import { defineCustomElement } from 'vue'
import Chat from '../App.vue'

// Convertir el componente Vue en un Custom Element
const ChatElement = defineCustomElement(Chat)

// Registrar el elemento personalizado
customElements.define('vue-chat-widget', ChatElement)

export default ChatElement 