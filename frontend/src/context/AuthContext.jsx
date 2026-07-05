import { useState } from "react";
import { createContext,useContext } from "react";
import API from "../api/axios"
import { connectSocket,disconnectSocket } from "../socket";

const AuthContext = createContext();

export default function AuthProvider({children}){
    const [user,setUser] = useState(() => {
        const saved = localStorage.getItem("chatUser")
        if(saved)
        {
            const parsedUser = JSON.parse(saved); // because saved is string
            connectSocket(parsedUser.token);// because connectSocket need token you can see in socket.js
            return parsedUser;
        }
        return null;
    })
    async function register({username,name,email,password,avatar}) {
        const {data} = await API.post("/auth/register",{username,name,email,password,avatar})
        return data;
    }
    async function login({email,password}){
        const {data} = await API.post("/auth/login",{email,password})
        localStorage.setItem("chatUser",JSON.stringify(data)) // to store in localstorage of browser of client
        setUser(data);
        connectSocket(data.token);
        return data;
    }
    
    async function logout(){
        localStorage.removeItem("chatUser");
        setUser(null);
        disconnectSocket();
    }
    return(
        <AuthContext.Provider value={{user,login,logout,register}}>
        {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}