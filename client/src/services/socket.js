import { io } from "socket.io-client";

// Get backend URL. Fallback to localhost:3000 if not defined.
const BACKEND_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace("/api/v1", "") 
  : "http://localhost:3000";

const socket = io(BACKEND_URL, {
  autoConnect: false, // Don't connect until we need it
  reconnection: true,
});

export default socket;
