import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function PortectedRoute({children}){
    const {user} = useAuth();
    if(!user)
    {
        return <Navigate to="/login" replace="true"/>
    }
    return children;
}