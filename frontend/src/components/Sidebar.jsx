import { useState,useEffect } from "react"
import API from "../api/axios"
export default function Sidebar({onRoomSelect}){
    const [rooms,setRooms] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(()=>{
        async function getRooms(){
            try{
                const {data} = await API.get("/rooms/");
                setRooms(data);
                setLoading(false);
            }
            catch(err){
                alert(err.response?.data?.message||"Failed to Fetch Rooms");
                setLoading(false);
            }
        }
        getRooms();
    },[])
    if(loading)
        return <p>Loading ....</p>
    return (
        <div className="sidebar-container">
        <div id="sidebar-heading">
        <h1 id="public-heading">Public Chat</h1>
        <button id="public-btn">Create Room</button>
        </div>
        
        <ul className="publicRoom-container">
        {rooms.map((room)=>(
            <li key={room.name} className="publicRoom-list" onClick={()=>onRoomSelect(room)}>
            {room.name}
            </li>
        ))}
        </ul>
        </div>
    )
}