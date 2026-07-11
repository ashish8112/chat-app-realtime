import { Routes,Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import './app.css'; 
import Register from "./pages/Register";
import PortectedRoute from "./protectedRoute/ProtectedRoute";
import Navbar from "./components/Navbar";
import AppErrorBoundary from "./components/ErrorBoundary";
export default function App(){
  return(
    <>
    <AppErrorBoundary>
      <Navbar/>
    </AppErrorBoundary>
      
      <Routes>
          <Route path="/" element={
            <AppErrorBoundary>
            <PortectedRoute>
              <Home/>
            </PortectedRoute>
            </AppErrorBoundary>
          }/>
          <Route path="/login" element={<AppErrorBoundary><Login/></AppErrorBoundary>}/>
          <Route path="/register" element={<AppErrorBoundary><Register/></AppErrorBoundary>}/>
      </Routes>
    </>
  )
}