import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import AdminNavbar from "./Components/MemberNavbar";
// const drawerWidth=80;
export default function MemberPanel()
{
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Adjust drawer width based on open/close
  const drawerWidth = drawerOpen ? 240 : 70;
    return(
        <>
       <div style={{ display:"flex",height:"100vh",overflow:"hidden",   backgroundColor:"whitesmoke"}}>
      {/* Navbar + Sidebar */}
      <AdminNavbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Main content area beside the drawer */}
      <main
        
        style={{
          flexGrow: 1,
          padding: "20px",
          marginTop: "64px", // Adjust if your Navbar height differs
          // marginLeft: "5px",
          width: `calc(100% - ${drawerWidth}px)`,
          height: "calc(100vh - 64px)", // Prevent extra height
          overflowY: "auto",  overflowX:"auto",transition:"margin-left 0.3s,width 0.3s"     }}
       
      >
        <Outlet />
      </main>
    </div>
        </>
    )
}