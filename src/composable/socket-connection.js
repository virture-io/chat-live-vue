import { Manager } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useChatMessages } from "./useMessages";
import { get_utm } from "./get_utm";

let socket = null;
let manager = null;

export const socketConnection = (socketUrl, idAgent, api_key = "") => {
  if (socket) return socket;

  const { setValueMessages, addMessage, setCustomStyle, custom_style } =
    useChatMessages();
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

  let lastPath = "";

  setInterval(() => {
    const currentPath = window.location.href;

    if (currentPath !== lastPath) {
      const now = new Date();
      const userNavigation = {
        urlPath: currentPath,
        time: now.toISOString(),
        clientId: idThread,
        instance: idAgent,
      };

      socket.emit("navigation-path-chat", userNavigation);

      lastPath = currentPath;
    }
  }, 2000);

  //get config custo widget
  let style;
  setInterval(() => {
    socket.emit("get-custom-widget", idAgent, (val) => {
      style = val;
      if (!haveSameValues(style,custom_style.value)) {
        setCustomStyle({ ...style });
      }
    });
  }, 1000);

  socket.on("disconnect", () => {});

  socket.on("response", (val) => {
    addMessage(val);
  });

  return socket;
};

function haveSameValues(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

export const useSocket = () => socket;
