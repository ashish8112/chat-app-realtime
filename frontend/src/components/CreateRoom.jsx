import { useState } from "react"
import API from "../api/axios"
export default function CreateRoom({onRoomCreated}){
    const[isOpen,setIsOpen] = useState(false);
    const [formData,setFormData] = useState({
        name:"",
        description:"",
        isPrivate:false
    })
    function handleChange(e){
       setFormData({...formData,[e.target.name]:e.target.type==="checkbox"?e.target.checked:e.target.value}) 
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            const {data} = await API.post("/rooms/",formData);
            onRoomCreated();
            setIsOpen(false);
            setFormData({name:"",description:"",isPrivate:false})

        }
        catch(err){
            alert(err.response?.data?.message||"Failed to create Room");
        }
    }
    
    return(
        <div className="create-room-container">
            <button className="btn-trigger" onClick={()=>setIsOpen(true)}>
                Create New Room
            </button>
            {isOpen&&(
                <div className="modal-overlay" onClick={()=>setIsOpen(false)}>
                    <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
                        <div className="modal-header">
                           <h3>Create Room</h3>
                           <button className="btn-close" onClick={()=>setIsOpen(false)}>&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="name">Room Name * </label>
                                <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Project Discussion"
                                value={formData.name}
                                onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                             <label htmlFor="description">Description</label>   
                             <textarea
                             id="description"
                             name="description"
                             placeholder="Tell something about room"
                             rows="3"
                             value={formData.description}
                             onChange={handleChange}
                             />
                            </div>

                            <div className="form-group checkbox-group">
                                <input 
                                id="isPrivate"
                                type="checkbox"
                                name="isPrivate"
                                checked={formData.isPrivate}
                                onChange={handleChange}
                                />
                                <label htmlFor="isPrivate">Make Room Private</label>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={()=>setIsOpen(false)}>
                                    CANCEL
                                </button>
                                <button type="submit" className="btn-primary">
                                    CREATE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

//e.stopProgagation it stops event bubbling when we click on an element it goes to it's all ancestor parent's event 
//automatically , so when we click outside the overlay  then it should closed but not inside the 
//overlay because parent and child have both click event so while clicking child event which is floating 
// shouldn't trigger parent event which is causing to isOpen = false  because child is inside parent 
// so clicking in child will automatically trigger parent container click event also to stop this we use 
// e.stopPropagation

//&time;  is used to display (X) sign 

//checked store true or false , if it is checked means true else it is false best for toggle