import React, { useContext, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard,
  People,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Society from "@mui/icons-material/Diversity2TwoTone";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SoftwareIcon from "@mui/icons-material/Apps"; // Replace with your logo or custom icon
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../../MainPage/AuthContext";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
const drawerWidth = 300;

export default function AdminNavbar() {
  const [userOpen, setUserOpen] = useState(false);
  const [societyOpen, setSocietyOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();
  const handleUserClick = () => setUserOpen(!userOpen);
  const handleSocietyClick = () => setSocietyOpen(!societyOpen);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    // Redirect or open Profile
    handleClose();
  };

  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    context.logout();
    handleClose();
    navigate("/");
  };
  const selectedItemStyle={
    "&.Mui-selected": {
      backgroundColor: "rgba(243, 243, 243, 0.56)", // soft light indigo
      backdropFilter: "blur(6px)",
      color: "#3949ab",
      fontWeight: "bold",
    },
    "&.Mui-selected:hover": {
      backgroundColor: "rgba(243, 243, 243, 0.56)",
      backdropFilter: "blur(6px)",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "white",
    },
    borderRadius: "4px",
  };
  
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "white", zIndex: 1400 }}>
        <div className="row">
          <div className="col-10">
            {/* AppBar */}

            <Toolbar>
              <IconButton edge="start" onClick={handleDrawerToggle}>
                {drawerOpen ? (
                  <MenuOpenIcon sx={{ color: "black" }} />
                ) : (
                  <MenuIcon sx={{ color: "black" }} />
                )}
              </IconButton>
              {/* <Typography variant="h6" sx={{ color: "black", ml: 1 }}>
              Admin Panel
            </Typography> */}
              <img src="./Images/logo3.png" style={{ width: "15%" }} />
            </Toolbar>
          </div>
          <div className="col-2" >
            <IconButton onClick={handleAvatarClick} style={{backgroundColor:"rgb(243, 240, 240)"}}>
              <Avatar alt="Admin" src="/Images/admin.jpg" />
            </IconButton>
          </div>
        </div>
      </AppBar>

      <Menu
        style={{ width: "80%" }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon sx={{ color: "black", fontSize: "small" }}>
            <AccountBoxIcon />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ color: "black", fontSize: "small" }}>
            <LogoutIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            backgroundColor: "#001323",
            color: "white",
            zIndex: 1300,
          },
        }}
      >
        <Toolbar />
        {/* Software Icon */}
        {/* <Box display="flex" alignItems="center" justifyContent="center" py={2}>
      <img src="./Images/logo3.png" style={{ width: "55%" }} />
    </Box> */}

        <Divider sx={{ borderColor: "#3949ab", mb: 1 }} />

        <List>
          <ListItemButton
            component={Link}
            to="/Admin"
            selected={location.pathname === "/Admin"}
            sx={{...(location.pathname==="/Admin")?selectedItemStyle:{}}}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: "inherit" }} />
          </ListItemButton>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />

          <ListItemButton onClick={handleUserClick} style={{cursor:"pointer"}}>
            <ListItemIcon sx={{ color: "inherit" }}>
              <People />
            </ListItemIcon>
            <ListItemText primary="User" sx={{ color: "inherit" }} />
            {userOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse
            in={userOpen}
            timeout="auto"
            sx={{ backgroundColor: "#F8F8F8" }}
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItemButton
                component={Link}
                to="/Admin/Member" 
                selected={location.pathname === "/Admin/Member"}
                sx={{pl:4,color:"inherit",
                  ...(location.pathname === "/Admin/Member" ? selectedItemStyle : {})
                }}
                
              >
                <ListItemText primary="-  Member" sx={{ color: "black" }} />
              </ListItemButton>
              <ListItemButton
            
                component={Link}
                to="/Admin/WatchmenRecord"
                selected={location.pathname === "/Admin/Member"}
                sx={{pl:4,color:"inherit",
                  ...(location.pathname === "/Admin/Member" ? selectedItemStyle : {})
                }}
                
              >
                <ListItemText primary="-  Watchmen" sx={{ color: "black" }} />
              </ListItemButton>
            </List>
          </Collapse>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />

          <ListItem button onClick={handleSocietyClick}>
            <ListItemIcon sx={{ color: "inherit" }}>
              <Society />
            </ListItemIcon>
            <ListItemText primary="Society Committee" sx={{ color: "inherit",cursor:"pointer" }} />
            {societyOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse
            in={societyOpen}
            timeout="auto"
            sx={{ backgroundColor: "#F8F8F8" }}
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem
                button
                sx={{ pl: 4 }}
                component={Link}
                to="/Admin/SocietyCommitteType"
              >
                <ListItemText
                  primary="-  Committee Type"
                  sx={{ color: "black" }}
                />
              </ListItem>
              <ListItem
                button
                sx={{ pl: 4 }}
                component={Link}
                to="/Admin/SocietyCommitteMember"
              >
                <ListItemText
                  primary="-  Committee Member"
                  sx={{ color: "black" }}
                />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
}
