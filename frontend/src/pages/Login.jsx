import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";


export default function Login(){
    const [formData,setFormData] = useState({
        email:"",
        password:""
    })
    const {login} = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        if(!formData.email||!formData.password)
            return alert("Please Enter every field");
        try{
            await login(formData);
            alert("Logged In Succesfully");
            navigate("/");
        }
        catch(err){
            alert(err.response?.data?.message||"LogIn Failed")
        }
    }
    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    return (
        <>
        <div className="loginContainer">
        <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome Back</h2>
        <div className="input-group">
            <input type="text" name="email" value={formData.email} onChange={handleChange}/>
            <label>Username</label>
        </div>
        <div className="input-group">
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
            <label>Password</label>
        </div>
        <button className="login-btn" type="submit">Log In</button>
        <p className="signup-text">Don't have an account? <Link to="/register">Sign up</Link> </p>
        </form>
        </div>
        </>
    )
}