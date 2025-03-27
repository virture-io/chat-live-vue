import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

let socket = null;

export const socketConnection = () => {
  if (socket) return socket;

  const userUUID = uuidv4();

  socket = io("http://localhost:7777", {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    query: { idOwner: userUUID },
  });

  socket.on("Connected", (state) => {
    console.log("Conexion establecida con socket");
  });

  socket.on("Disconnected", (state) => {
    console.log("Conexion perdida con el socket");
  });

  return { socket };
};

export const useSocket = () => socket;
