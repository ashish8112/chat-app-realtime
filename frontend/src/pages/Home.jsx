import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";
export default function Home(){
    const navigate = useNavigate();
    const [selectedRoom,setSelectedRoom] = useState(null);
    const [selectedUser,setSelectedUser] = useState(null);
    return (
        <>
        <div className="home-container">
        <Sidebar onRoomSelect={setSelectedRoom} onUserSelect={setSelectedUser}/>
        <ChatWindow room={selectedRoom} user={selectedUser}/>
        </div>
        </>
    )
}

// send setSelectedRoom method in sidebar as props so we can change selectedRoom from there
//when selectedRoom changed because of setSelectedRoom method in sidebar this chatwindow 
// will re render because of selectedRoom state in that.