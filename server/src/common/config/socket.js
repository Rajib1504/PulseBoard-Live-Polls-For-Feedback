import { Server } from "socket.io";

let io;

const initSocket = (server) => {
    io = new Server(server, {//create server
        cors: {
            origin: "*", // origin set now for all
            methods: ["GET", "POST"]
        }
    });
//showing connection 
    io.on("connection", (socket) => {
        console.log(` New client connected: ${socket.id}`);

        //  Room Scoping:
        socket.on("joinPollRoom", (pollId) => {
            socket.join(pollId);
            console.log(`User ${socket.id} joined room: ${pollId}`);
        });

        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};

export { initSocket, getIo };