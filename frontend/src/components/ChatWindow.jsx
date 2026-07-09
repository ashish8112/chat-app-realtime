import API from "../api/axios"
import { useState,useEffect } from "react"
import { getSocket } from "../socket";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
export default function ChatWindow({room,user,onClose}){
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(true);
    const [content,setContent] = useState("");
    const messageEnd = useRef(null);
    const {user:me} = useAuth(); // rename user to me insted of this const auth = useAuth(); const me = auth.user;
    const [isUserOnline,setIsUserOnline]=useState(user?.isOnline||false) //this user is selected user not useAuth main user means It's not me or logged in user it's recipient
    function scrollToBottom(){
        messageEnd.current?.scrollIntoView({behavior:"smooth"})
    }
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    useEffect(()=>{
        if(!user) return;
        setIsUserOnline(user.isOnline);
        const socket = getSocket();
        socket.on("userOnline",({userId})=>{
            if(user._id===userId) setIsUserOnline(true);
        })
        socket.on("userOffline",({userId})=>{
            if(user._id===userId) setIsUserOnline(false);
        })
        return()=>{
            socket.off("userOnline");
            socket.off("userOffline");
        }
    },[user])
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
        if(!content.trim()) return alert("Write Something first");
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
        <div className="chat-header">
            <div className="name-avatar">
                <img src={room?room.createdBy.avatar:user.avatar}/>
                <div>
                    <p>{room? room.name : user.username}</p>
                    {user&&<p className="status-indicator">{isUserOnline?"Online":"Offline"}</p>}
                </div>
                
            </div>
            <div className="description">
                <p>{room && room.description }</p>
                <button onClick={onClose}>&times;</button>
            </div>
        </div>
        <div className="messages-container">
        {messages.length===0?<p style={{marginBottom:"0.6rem"}}>Type first Message in this Room</p>: 
        messages.map((message)=>(
            <div key={message._id} className={`message-box ${message.sender?.username===me.username?"my-message":"other-message"}`}>
            {message.sender?.username}: {message.content}
            <span className="timestamp">
                {new Date(message.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
            </span>
            </div>
        ))}
        <div ref={messageEnd} />
        </div>
        <div className="input-send">
        <input value={content} onChange={(e)=>setContent(e.target.value)} onKeyDown={(e)=>{if(e.key==="Enter")sendMessage()}}/>
        <button onClick={sendMessage}>Send</button>
        </div>
        </div>
    )
}