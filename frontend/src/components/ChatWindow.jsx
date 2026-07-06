import API from "../api/axios"
import { useState,useEffect } from "react"
import { getSocket } from "../socket";
export default function ChatWindow({room,user}){
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(true);
    const [content,setContent] = useState("");
    useEffect(()=>{
        setMessages([]) // when chat window  changed during interval of async function laod fresh new message it should be clean
        setLoading(true)
         if(room)
         {
            fetchRoomMessages();
            const socket = getSocket();
            socket.emit("joinRoom",room._id);
            socket.on("newMessage",(msg)=>{
                setMessages((preMesg)=>[...preMesg,msg])
            })
            return()=>{
                socket.emit("leaveRoom",room._id);
                socket.off("newMessage");
            }
         }
         if(user)
         {
            fetchUserMessages();
            const socket = getSocket();
            socket.on("directMessage",(msg)=>{
                setMessages(prev=>[...prev,msg]) // because we need array not object
            })
            return()=>{
                socket.off("directMessage")
            }
         }
         async function fetchRoomMessages(){
            try{
                const roomId=room._id;
                const {data} =await API.get(`/rooms/${roomId}/messages`)
                setMessages(data); // it replace entire messages variable as it is not callback function with spread operator
                setLoading(false);
            }
            catch(err)
            {
                setLoading(false);
                setMessages([]);
                alert(err.response?.data?.message||"Message Fetch Failed")
               
            }
         }

         async function fetchUserMessages(){
            try{
                const recipientId=user._id;
                const {data} = await API.get(`/rooms/${recipientId}/dm`);
                setMessages(data); // it replace entire messages variable as it is not callback function with spread operator
                setLoading(false);
            }
            catch(err){
                setLoading(false);
                setMessages([]);
                alert(err.response?.data?.message||"Message fetch Failed");
            }
         }
        
    },[room,user]) //[room] is necessary because useEffect has executed one time while rendering so if a user choosed another room it must re render again for chatwindow.
    function sendMessage(){
        if(!content) return;
        const socket = getSocket();
        if(room) socket.emit("sendMessage", { roomId: room._id, content })
        if(user) socket.emit("sendDirect", { recipientId: user._id, content })
        setContent("");
    }

    if(!room&&!user)
        return <p>Select a room or user to start Chatting</p>
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