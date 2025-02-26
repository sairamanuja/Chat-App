import { WebSocket,WebSocketServer } from "ws";

const wss = new WebSocketServer({port:8080});

interface User{
    socket : WebSocket;
    roomId:string;
}

let allSockets : User[] =[];
//@ts-ignore
wss.on("connection",(socket)=>{
    socket.on("message",(message)=>{
//@ts-ignore
        
        const parsedMessage = JSON.parse(message);

        if(parsedMessage.type === "join"){
        allSockets.push({
            socket,
            roomId: parsedMessage.payload.roomId
        })
       }

       if(parsedMessage.type=="chat"){
        let currentuserRoom: string | null = null;

        for(let i = 0; i < allSockets.length; i++){
            if(allSockets[i].socket === socket){
                currentuserRoom = allSockets[i].roomId;
            }
        }
        for(let i =0; i<allSockets.length; i++){
            if(allSockets[i].roomId === currentuserRoom){
                allSockets[i].socket.send(parsedMessage.payload.message)
            }
        }

       }
   

    })

})