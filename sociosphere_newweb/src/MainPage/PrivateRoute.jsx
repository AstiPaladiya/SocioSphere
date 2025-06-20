import React, { useContext } from "react";
import {Navigate,Outlet} from "react-router-dom";
import AuthContext from "./AuthContext";


const PrivateRoute=({allowedRole})=>{
    const {auth}=useContext(AuthContext);
    if(!auth.token)
    {
        return <Navigate to="/"/>
    }
    if(allowedRole && auth.role!==allowedRole)
    {
        return <Navigate to="/"/>
    }
        return <Outlet/>;
    
};
export default PrivateRoute;