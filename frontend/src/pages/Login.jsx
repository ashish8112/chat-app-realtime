import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
export default function Login(){
    const [fromData,setFormData] = useState({
        email:"",
        password:""
    })

    function handleSubmit(e){
        e.preventDefault();
    }
    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    return (
        <>
        <div className="loginContainter">
        <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <div className="input-group">
            <input type="text" name="email" value={FormData.email} onChange={handleChange}/>
            <label>Username</label>
        </div>
        <div className="input-group">
            <input type="password" name="password" value={FormData.password} onChange={handleChange} />
            <label>Password</label>
        </div>
        <button className="login-btn" type="submit">Log In</button>
        <p className="signup-text">Don't have an account? <Link to="/register">Sign up</Link> </p>
        </form>
        </div>
        </>
    )
}