import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import AdminNavbar from "./Components/AdminNavbar";
const drawerWidth=90;
export default function AdminPanel()
{

    return(
        <>
       <Box sx={{ display: "flex",}}>
      {/* Navbar + Sidebar */}
      <AdminNavbar />

      {/* Main content area beside the drawer */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px", // below AppBar height
          ml: `${drawerWidth}px`, // align beside permanent drawer
          width: `calc(100% - ${drawerWidth}px)`,
          
        }}
      >
        <Outlet />
      </Box>
    </Box>
        </>
    )
}