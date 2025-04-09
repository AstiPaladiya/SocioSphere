import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
} from "@mui/material";
import {
  Dashboard,
  People,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Society from "@mui/icons-material/Diversity2TwoTone";
import { Link } from "react-router-dom";
import SoftwareIcon from "@mui/icons-material/Apps"; // Replace with your logo or custom icon

const drawerWidth = 300;

export default function AdminNavbar() {
  const [userOpen, setUserOpen] = useState(false);
  const [societyOpen, setSocietyOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleUserClick = () => setUserOpen(!userOpen);
  const handleSocietyClick = () => setSocietyOpen(!societyOpen);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "white", zIndex: 1400 }}>
        <Toolbar>
          <IconButton edge="start" onClick={handleDrawerToggle}>
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography variant="h6" sx={{ color: "black", ml: 1 }}>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

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
        <Box display="flex" alignItems="center" justifyContent="center" py={2}>
          <img src="./Images/fulllogo.png" style={{width:"50%"}}/>
        </Box>

        <Divider sx={{ borderColor: "#3949ab", mb: 1 }} />

        <List>
          <ListItem button component={Link} to="/Admin">
            <ListItemIcon sx={{ color: "white" }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: "white" }} />
          </ListItem>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />

          <ListItem button onClick={handleUserClick}>
            <ListItemIcon sx={{ color: "white" }}>
              <People />
            </ListItemIcon>
            <ListItemText primary="User" />
            {userOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse
            in={userOpen}
            timeout="auto"
            sx={{ backgroundColor: "#F8F8F8" }}
            unmountOnExit
          >
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/Admin/Member">
                <ListItemText primary="-  Member" sx={{ color: "black" }} />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} component={Link} to="/Admin/User">
                <ListItemText primary="-  Watchmen" sx={{ color: "black" }} />
              </ListItem>
            </List>
          </Collapse>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />

          <ListItem button onClick={handleSocietyClick}>
            <ListItemIcon sx={{ color: "white" }}>
              <Society />
            </ListItemIcon>
            <ListItemText primary="Society Committee" />
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
