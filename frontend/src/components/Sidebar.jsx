import { useState,useEffect } from "react"
import API from "../api/axios"
import CreateRoom from "./CreateRoom";

export default function Sidebar({onRoomSelect}){
    const [rooms,setRooms] = useState([]);
    const [loading,setLoading] = useState(true);
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
    },[])
    if(loading)
        return <p>Loading ....</p>
    return (
        <div className="sidebar-container">
            <div id="sidebar-heading">
                <h1 id="public-heading">Public Chat</h1>
                <CreateRoom onRoomCreated={getRooms}/>
            </div>
        
        <ul className="publicRoom-container">
        {rooms.map((room)=>(
            <li key={room.name} className="publicRoom-list" onClick={()=>onRoomSelect(room)}>
            {room.name}
            </li>
        ))}
        </ul>
            <div className="sidebar-secondaryHeading">
                <h1 className="private-heading" style={{textAlign:"center"}}>Private Chat</h1>
                <ul className="privateRoom-container">

                </ul>
            </div>
        
        </div>
    )
}