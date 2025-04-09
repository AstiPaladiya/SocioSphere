import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MemberNavbar()
{
    const { user, logout } = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      logout();
      navigate("/");
    };
    return(
        <>
            <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Member Panel
        </Typography>
        {user && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
        </>
    )
}