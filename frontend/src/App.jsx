import { Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import './app.css'; 
import Register from "./pages/Register";
import PortectedRoute from "./protectedRoute/ProtectedRoute";
export default function App(){
  return(
    <>
      <Routes>
          <Route path="/" element={
            <PortectedRoute>
              <Home/>
            </PortectedRoute>
          }/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  )
}