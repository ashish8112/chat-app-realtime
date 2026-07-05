import API from "../api/axios"
import { useState,useEffect } from "react"
import { getSocket } from "../socket";
export default function ChatWindow({room}){
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(true);
    const [content,setContent] = useState("");
    useEffect(()=>{
         if(!room)
            return;
         async function fetchMessages(){
            try{
                const roomId=room._id;
                const {data} =await API.get(`/rooms/${roomId}/messages`)
                setMessages(data);
                setLoading(false);
            }
            catch(err)
            {
                setLoading(false);
                setMessages([]);
                alert(err.response?.data?.message||"Message Fetch Failed")
               
            }
         }
         fetchMessages();
         const socket = getSocket();
         socket.emit("joinRoom",room._id);
         socket.on("newMessage",(msg)=>{
            setMessages((preMesg)=>[...preMesg,msg])
         })
         return()=>{
            socket.emit("leaveRoom",room._id);
            socket.off("newMessage");
         }
    },[room]) //[room] is necessary because useEffect has executed one time so if there would be no room in dependency useEffect method will not execute
    function sendMessage(){
        if(!content) return;
        const socket = getSocket();
        socket.emit("sendMessage",{roomId:room._id,content})
        setContent("");
    }

    if(!room)
        return <p>Select a room to start Chatting</p>
    if(loading)
        return <p>Loading Messages ...</p>
        
    return(
        <div className="chat-window">
        <h1>Chat window</h1>
        {messages.length===0?<p style={{marginBottom:"0.6rem"}}>Type first Message in this Room</p>: 
        messages.map((message)=>(
            <div key={message._id} className="message-box">
            {message.sender.username}: {message.content}
            </div>
        ))}
        <input value={content} onChange={(e)=>setContent(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
        </div>
    )
}