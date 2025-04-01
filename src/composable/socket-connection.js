import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useChatMessages } from "./useMessages";

let socket = null;

export const socketConnection = (socketUrl, idAgent, api_key = "") => {
  if (socket) return socket;

  const { setValueMessages, addMessage } = useChatMessages();

  // Obtener o generar un UUID persistente para el usuario
  let userUUID = localStorage.getItem("userUUID");
  if (!userUUID) {
    userUUID = uuidv4();
    localStorage.setItem("userUUID", userUUID);
  }

  // Obtener el ID del chat si existe
  let idThread = localStorage.getItem("userUUID") ?? "";

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: { idOwner: userUUID, api_key: api_key },
  });

  socket.on("connect", () => {
    console.log("✅ Socket conectado correctamente");

    socket.emit(
      "connected-chat",
      { userUUID: idThread, agentId: idAgent },
      (val) => {
        if (val.messages) {
          setValueMessages(val.messages);
        }
      }
    );
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket desconectado");
  });

  socket.on("response", (val) => {
    addMessage(val);
  });

  return socket;
};

export const useSocket = () => socket;
