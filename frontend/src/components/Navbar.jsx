import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Navbar(){
    const navigate = useNavigate();
    const {user,logout} =  useAuth();
    if(user){
        return(
            <nav>
                <div className="app-name">
                <p style={{cursor:"pointer"}} onClick={()=>navigate("/")}>RealChatApp</p>
                </div>
                <ul className="user-details">
                <li><img src={user.avatar}/></li>
                <li>{user.name}</li>
                <li><Link to={"/login"} onClick={logout}>Logout</Link></li>
                </ul>
            </nav>
        )
    }
    return(
        <nav>
            <div className="app-name">
                <p>RealChatApp</p>
            </div>
            <ul>
                <li><Link to={"/register"}>Register</Link></li>
                <li><Link to={"/login"}>Login</Link></li>
            </ul>
        </nav>
    )
}