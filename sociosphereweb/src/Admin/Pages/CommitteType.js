import React, { useState } from "react";
import $ from "jquery";

export default function CommitteType()
{
    const [formData,setFormData]=useState({
        committeName:"",
        description:""
    });
    const [error,setError]=useState({});
    const [message,setMessage]=useState("");

    //Handle inpute change
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
        if(error[e.target.name])
        {
            setError({
                ...error,[e.target.name]:""
            });
        }
    };

    //form validation
    const validateForm=()=>{
        let newError={};
        if(!formData.committeName.trim())
        {
            newError.committeName="Committe name is required";
        }else if(formData.committeName.length < 3)
        {
            newError.committeName="Committee Name must be at least 3 characters long.";
        }
        if(!formData.description.trim())
        {
                newError.description="description name is required";
        }
            setError(newError);
            return Object.keys(newError).length === 0;
    }

    //Api call using jquery ajax
    const submitForm=(e)=>{
        e.preventDefault();
        setMessage("");
        if(!validateForm())
        {
            return;
        }
        $.ajax({
            url:"http://localhost:5175/api/SocietyCommitte",
            type:"POST",
            contentType:"application/json",
            data:JSON.stringify(formData),
            success:function(response)
            {
                setMessage("Committe added successfully");
                setFormData({committeName:"",description:""});
                // Clear success message after 3 seconds
                setTimeout(() => setMessage(""), 3000);
            },error:function(xhr){
                setMessage(xhr.responseJSON?.message || "failed to add committe");
            }

        });
    };
    return(
        <>
            <h1>This is CommitteType page.</h1>
           {message && <p style={{color:"red"}}>{message}</p>}
            <form>
                <label>Name :</label>
                <input id="txtName" name="committeName" value={formData.committeName} onChange={handleChange} />
                {error.committeName && <p style={{color:"red"}}>{error.committeName}</p>}
                <label>Description :</label>
                <input id="txtDes" name="description" value={formData.description} onChange={handleChange}/>
                {error.description && <p style={{color:"red"}}>{error.description}</p>}
                <button type="submit" id="btnSubmit" name="btnSubmit" onClick={submitForm}>Submit</button>
            </form>
        </>
    )
}