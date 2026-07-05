import {io} from "socket.io-client"
const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"
let socket;
export const connectSocket = (token) => {
    socket = io(url,{auth:{token}})
    return socket; // to provide socket object to calling method, if it needs.
}
export const getSocket = () => socket;

export const disconnectSocket = () =>{
    if(socket) socket.disconnect();
    
}