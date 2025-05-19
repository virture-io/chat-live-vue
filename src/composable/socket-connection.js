import { Manager } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useChatMessages } from "./useMessages";
import { get_utm } from "./get_utm";

let socket = null;
let manager = null;

export const socketConnection = (socketUrl, idAgent, api_key = "") => {
  if (socket) return socket;

  const { setValueMessages, addMessage } = useChatMessages();
  let currentUrl = window.location.href;
  get_utm(currentUrl);

  // Obtener o generar un UUID persistente para el usuario
  let userUUID = localStorage.getItem("userUUID");
  if (!userUUID) {
    userUUID = uuidv4();
    localStorage.setItem("userUUID", userUUID);
  }

  // Obtener el ID del chat si existe
  let idThread = localStorage.getItem("userUUID") ?? "";

  manager = new Manager(socketUrl, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: { idOwner: userUUID, api_key: api_key },
  });

  socket = manager.socket("/chat");

  socket.on("connect", () => {
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

  const interval = setInterval(() => {
    let urlCurrent = window.location.href;
    let now = new Date();
    let userNavigation = {
      urlPath: urlCurrent,
      time: now.toISOString(),
      clientId: idThread,
    };
    socket.emit("navigation-path-chat", userNavigation);
  }, 2000);

  socket.on("disconnect", () => {});

  socket.on("response", (val) => {
    addMessage(val);
  });

  return socket;
};

export const useSocket = () => socket;
