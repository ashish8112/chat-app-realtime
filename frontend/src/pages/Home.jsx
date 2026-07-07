import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow";
import { useState } from "react";
export default function Home(){
    const [selectedRoom,setSelectedRoom] = useState(null);
    const [selectedUser,setSelectedUser] = useState(null);
    function resetChat(){
        setSelectedRoom(null);
        setSelectedUser(null);
    }
    return (
        <>
        <div className="home-container">
            <div className={selectedRoom||selectedUser ? "hide-mobile":""}>
                <Sidebar onRoomSelect={setSelectedRoom} onUserSelect={setSelectedUser}/>
            </div>
            <div className={!selectedRoom&&!selectedUser?"hide-mobile":""}>
                <ChatWindow room={selectedRoom} user={selectedUser} onClose={resetChat}/>
            </div>
            </div>
        </>
    )
}
 //if group chat or direct message is selected display none of sidebar .and if both are not selected display none chatwindow

// send setSelectedRoom method in sidebar as props so we can change selectedRoom from there
//when selectedRoom changed because of setSelectedRoom method in sidebar this chatwindow 
// will re render because of selectedRoom state in that.