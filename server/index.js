import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let allSockets = [];

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                roomId: parsedMessage.payload.roomId
            });
        }

        if (parsedMessage.type === "chat") {
            let currentUserRoom = null;

            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket === socket) {
                    currentUserRoom = allSockets[i].roomId;
                    break;
                }
            }

            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].roomId === currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
