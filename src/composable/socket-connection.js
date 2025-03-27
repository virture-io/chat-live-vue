import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useChatMessages } from "./useMessages";

let socket = null;

export const socketConnection = () => {
  if (socket) return socket;

  const { setValueMessages, addMessage } = useChatMessages();
  const userUUID = uuidv4();
  const id = localStorage.getItem("idThread") ?? "";

  socket = io("http://localhost:7777", {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: { idOwner: userUUID },
  });

  socket.on("connect", () => {
    console.log("✅ Socket conectado correctamente");

    socket.emit("connected-chat", id, (val) => {
      if ("listMessage" in val) {
        setValueMessages(val.listMessage);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket desconectado");
  });

  socket.on("response", (val) => {
    if (!val.isContinue) {
      localStorage.setItem("idThread", val.idThread);
    }
    addMessage({ role: "assistant", message: val.message });
  });

  return socket;
};

export const useSocket = () => socket;
