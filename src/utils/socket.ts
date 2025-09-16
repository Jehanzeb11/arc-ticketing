// utils/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://192.168.10.40:5051", {
      transports: ["websocket", "polling"], // 👈 try forcing both
      //   reconnectionAttempts: 5,
      //   reconnectionDelay: 1000,
    });
  }
  return socket;
};
