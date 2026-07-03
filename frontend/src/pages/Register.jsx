import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
export default function Register(){
    const{register,login} = useAuth();
    const navigate = useNavigate();
    const [formData,setformData] = useState({username:"",name:"",email:"",password:"",avatar:""});
    async function handleSubmit(e){
        e.preventDefault();
        if(!formData.username||!formData.name||!formData.email||!formData.password||!formData.avatar)
            return alert("Please Enter the all field");
        try{
            await register(formData);
            alert("Register Succesfully")
            await login(formData)
            navigate("/");
        }
        catch(err){
            return alert(err.response?.data?.message||"Register Failed");
        }
    }
    function handleChange(e){
        setformData({...formData,[e.target.name]:e.target.value})
    }
    return(
        <>
            <div className="registerContainer">
            <form onSubmit={handleSubmit} className="register-form">
            <h2>Signup</h2>
                <div className="inputGroup">
                <input type="text" name="username" value={formData.username} onChange={handleChange}/>
                <label>Username</label>
                </div>
                <div className="inputGroup">
                <input type="text" name="name" value={formData.name} onChange={handleChange}/>
                <label>Name</label>
                </div>
                <div className="inputGroup">
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                <label>Email</label>
                </div>
                <div className="inputGroup">
                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                <label>Password</label>
                </div>
                <div className="inputGroup">
                <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} />
                <label>Avatar</label>
                </div>
            <button className="signup-btn" type="submit">Sign up</button>
           <Link to="/login" className="login-text">Already Have an account ? Login</Link>
            </form>
            </div>
        </>
    )
}