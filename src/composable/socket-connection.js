import { ref, onMounted, onUnmounted } from 'vue'
import { Manager } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useChatMessages } from "./useMessages";
import { get_utm } from "./get_utm";
import { pushToDataLayer, CHAT_EVENTS } from "../utils/dataLayer";
import { useSessionMetrics } from "./useSessionMetrics";
import { areObjectsDeepEqual } from "./compare-objects";
import { useSound } from "./useSound";

export const useSocketConnection = (
  socketUrl,
  idAgent,
  api_key = "",
  nameSpace,
  soundName = "sound1"
) => {
  const socket = ref(null);
  const manager = ref(null);
  const navigationInterval = ref(null);
  const widgetInterval = ref(null);
  const metricsInterval = ref(null);
  const lastPath = ref("");

  const { setValueMessages, addMessage, setCustomStyle, custom_style } = useChatMessages();
  const { playSound } = useSound();
  const { sessionInfo } = useSessionMetrics();

  // Obtener o generar un UUID persistente para el usuario
  const getUserUUID = () => {
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
    return userUUID;
  };

  const initializeSocket = () => {
    const userUUID = getUserUUID();
    const idThread = userUUID;

    manager.value = new Manager(socketUrl, {
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

    socket.value = manager.value.socket(nameSpace);

    socket.value.on("connect", () => {
      socket.value.emit(
      "connected-chat",
      { userUUID: idThread, agentId: idAgent },
      (val) => {
        if (val.messages) {
          setValueMessages(val.messages);
        }
      }
    );
  });

    socket.value.on("disconnect", () => {
      // Manejar desconexión si es necesario
    });

    socket.value.on("response", async (val) => {
      addMessage(val);
      playSound(
        custom_style.value.soundName
          ? custom_style.value.soundName
          : soundName ?? "sound1"
      );
    });
  };

  const setupNavigationTracking = () => {
    navigationInterval.value = setInterval(() => {
    const currentPath = window.location.href;

      if (currentPath !== lastPath.value) {
      const now = new Date();
      const userNavigation = {
        urlPath: currentPath,
        time: now.toISOString(),
          clientId: getUserUUID(),
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

        socket.value?.emit("navigation-path-chat", userNavigation);
        lastPath.value = currentPath;
    }
  }, 2000);
  };

  const setupWidgetConfig = () => {
    widgetInterval.value = setInterval(() => {
      socket.value?.emit("get-custom-widget", idAgent, (val) => {
        if (!haveSameValues(val, custom_style.value)) {
          setCustomStyle({ ...val });
      }
    });
  }, 1000);
  };

  const setupMetricsTracking = () => {
    let lastMetrics = null;
    metricsInterval.value = setInterval(() => {
      const currentMetrics = { idClient: getUserUUID(), ...sessionInfo.value };
      if (!areObjectsDeepEqual(lastMetrics, currentMetrics)) {
        socket.value?.emit("metrics-chat", currentMetrics);
        lastMetrics = currentMetrics;
    }
  }, 10000);
  };

  onMounted(() => {
    const currentUrl = window.location.href;
    get_utm(currentUrl);
    initializeSocket();
    setupNavigationTracking();
    setupWidgetConfig();
    setupMetricsTracking();
  });

  onUnmounted(() => {
    // Limpiar intervalos
    if (navigationInterval.value) clearInterval(navigationInterval.value);
    if (widgetInterval.value) clearInterval(widgetInterval.value);
    if (metricsInterval.value) clearInterval(metricsInterval.value);

    // Desconectar socket
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }

    // Limpiar manager
    if (manager.value) {
      manager.value = null;
    }
  });

  return {
    socket,
    manager
  };
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
