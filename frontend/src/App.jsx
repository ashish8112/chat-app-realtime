import { Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import './app.css'; 
import Register from "./pages/Register";
export default function App(){
  return(
    <>
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
      </Routes>
    </>
  )
}