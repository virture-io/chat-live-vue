import { Manager } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useChatMessages } from "./useMessages";
import { get_utm } from "./get_utm";
import { pushToDataLayer, CHAT_EVENTS } from "../utils/dataLayer";
import { useSessionMetrics } from "./useSessionMetrics";
import { areObjectsDeepEqual } from "./compare-objects";

const { sessionInfo } = useSessionMetrics();
let socket = null;
let manager = null;

export const socketConnection = (
  socketUrl,
  idAgent,
  api_key = "",
  nameSpace
) => {
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

    // Track new session creation
    pushToDataLayer({
      event: CHAT_EVENTS.SESSION_STARTED,
      chat_session_id: userUUID,
      chat_source: "user_initiated",
    });
  }

  // Obtener el ID del chat si existe
  let idThread = localStorage.getItem("userUUID") ?? "";

  manager = new Manager(socketUrl, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: {
      idOwner: userUUID,
      api_key: api_key,
      idClient: userUUID,
      instance: idAgent,
    },
  });

  socket = manager.socket(nameSpace);

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
        utms: {
          utm_source: localStorage.getItem("utm_source"),
          utm_medium: localStorage.getItem("utm_medium"),
          campaign: localStorage.getItem("campaign"),
          utm_term: localStorage.getItem("utm_term"),
          utm_content: localStorage.getItem("utm_content"),
          gclid: localStorage.getItem("gclid"),
          wbraid: localStorage.getItem("wbraid"),
          gbraid: localStorage.getItem("gbraid"),
          crm_link: localStorage.getItem("crm_link"),
          adSet: localStorage.getItem("adSet"),
          ad: localStorage.getItem("ad"),
          form: localStorage.getItem("form"),
          gad_campaignid: localStorage.getItem("gad_campaignid"),
          gad_source: localStorage.getItem("gad_source"),
        },
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
      if (!haveSameValues(style, custom_style.value)) {
        setCustomStyle({ ...style });
      }
    });
  }, 1000);

  let val;
  setInterval(() => {
    if (
      !areObjectsDeepEqual(val, { idClient: idThread, ...sessionInfo.value })
    ) {
      socket.emit("metrics-chat", { idClient: idThread, ...sessionInfo.value });
      val = { idClient: idThread, ...sessionInfo.value };
    }
  }, 10000);

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
