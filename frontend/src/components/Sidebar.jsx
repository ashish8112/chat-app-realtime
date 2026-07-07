import { useState,useEffect } from "react"
import API from "../api/axios"
import CreateRoom from "./CreateRoom";
import { getSocket } from "../socket";

export default function Sidebar({onRoomSelect,onUserSelect}){
    const [rooms,setRooms] = useState([]);
    const [loading,setLoading] = useState(true);
    const [users,setUsers] = useState([]);
      async function getRooms(){
            try{
                const {data} = await API.get("/rooms/");
                setRooms(data);
                setLoading(false);
            }
            catch(err){
                setLoading(false);
                alert(err.response?.data?.message||"Failed to Fetch Rooms");   
            }
        }
    useEffect(()=>{
      
        getRooms();
        async function getUsers(){
            try{
                const {data} = await API.get("/auth/users");
                setUsers(data);
            }
            catch(err){
                alert(err.response?.data?.message||"Failed to fetch Direct Message Rooms")
            }
        }
        getUsers();
    },[])
    useEffect(()=>{
        const socket = getSocket();
        socket.on("userOnline",({userId})=>{
            setUsers(prev=>prev.map(u=>u._id===userId?{...u,isOnline:true}:u))
        })
        socket.on("userOffline",({userId})=>{
            setUsers(prev=>prev.map(u=>u._id===userId?{...u,isOnline:false}:u))
        })
        return()=>{
            socket.off("userOnline")
            socket.off("userOffline")
        }
    },[]) 
    if(loading)
        return <p>Loading ....</p>
    return (
        <div className="sidebar-container">
            <div id="sidebar-heading">
                <h1 id="public-heading">Group Chat</h1>
                <CreateRoom onRoomCreated={getRooms}/>
            </div>
        
        <ul className="publicRoom-container">
        {rooms.map((room)=>(
            <li key={room.name} className="publicRoom-list" onClick={()=>{onRoomSelect(room);onUserSelect(null)}}>
            {room.name}
            </li>
        ))}
        </ul>
        <hr></hr>
            <div className="sidebar-secondaryHeading">
                <h1 className="private-heading" style={{textAlign:"center",marginBottom:"0.5rem"}}>Direct Message</h1>
                <ul className="publicRoom-container">
                {users.map((user)=>(
                    <li key={user.username} className="publicRoom-list" onClick={()=>{onUserSelect(user);onRoomSelect(null)}}>
                        {user.username}
                    </li>
                ))} 
                </ul>
            </div>
        
        </div>
    )
}