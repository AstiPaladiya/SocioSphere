import React, { useContext, useEffect, useState } from "react";

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
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"; // Gallery icon
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import API_BASE_URL from "../../config";
import { jwtDecode } from "jwt-decode";
import { FaMoneyBills } from "react-icons/fa6";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import axios from "axios";
const drawerWidth = 300;

export default function AdminNavbar() {
  const [userOpen, setUserOpen] = useState(false);
  const [societyOpen, setSocietyOpen] = useState(false);
  const [complainOpen, setComplainOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();
  const handleUserClick = () => setUserOpen(!userOpen);
  const handleSocietyClick = () => setSocietyOpen(!societyOpen);
  const handleComplainClick = () => setComplainOpen(!complainOpen);
  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, getUserData] = useState([]);
  const open = Boolean(anchorEl);
  const token = localStorage.getItem("token");

  let id = null;
  if (token) {
    const decode = jwtDecode(token);
    id = decode.UserId;

  }
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    // Redirect or open Profile
    navigate('/Member/Profile');
    handleClose();
  };

  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    context.logout();
    handleClose();
    navigate("/");
  };
  const handleSuggestion = () => {
    navigate("/Member/Suggestion");
    handleClose()
  }
  const selectedItemStyle = {
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
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Member/${id}`);
      console.log(res.data);
      if (Array.isArray(res.data)) {
        getUserData(res.data[0] || {});
      }
      else {
        getUserData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);
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
              <img src="/Images/logo3.png" style={{ width: "15%" }} />
            </Toolbar>
          </div>
          <div className="col-2" style={{ display: "flex" }} >
            {/* Notification Icon */}
            {/* <IconButton sx={{ mr: 1 }}>
              <NotificationsNoneIcon />
            </IconButton> */}

            {/* Gallery Icon */}
            {/* <IconButton sx={{ mr: 1 }}>
              <PhotoLibraryIcon />
            </IconButton> */}

            <IconButton onClick={handleAvatarClick} style={{ backgroundColor: "rgb(243, 240, 240)" }}>
              {userData.photo != null ? <Avatar alt="Admin" src={userData.photo} /> :
                <Avatar alt="Admin" src="/Images/admin.jpg" />}
            </IconButton>
          </div>
        </div>
      </AppBar>
      <Menu
        PaperProps={{
          sx: {
            width: 200, // Increased width (you can adjust as needed)
            borderRadius: 2,
            boxShadow: 3,
            p: 1,
            bgcolor: "#fff",
          },
        }}
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
          <ListItemIcon sx={{ fontSize: "small" }}>
            <PersonIcon />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleSuggestion}>
          <ListItemIcon sx={{ fontSize: "small" }}>
            <BiSolidMessageRoundedDetail style={{ fontSize: "22px" }} />
          </ListItemIcon>
          Suggestion
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon sx={{ fontSize: "small" }}>
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
            to="/Member"
            selected={location.pathname === "/Member"}
            sx={{ ...(location.pathname === "/Member") ? selectedItemStyle : {} }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: "inherit" }} />
          </ListItemButton>


          {/* <ListItemButton onClick={handleUserClick} style={{ cursor: "pointer" }}
            sx={{
              backgroundColor:
                ["/Admin/Member", "/Admin/WatchmenRecord"].includes(location.pathname)
                  ? "rgba(243, 243, 243, 0.56)"
                  : "inherit", // soft light indigo
              backdropFilter:
                ["/Admin/Member", "/Admin/WatchmenRecord"].includes(location.pathname)
                  ? "blur(6px)"
                  : "inherit",
              color:
                ["/Admin/Member", "/Admin/WatchmenRecord"].includes(location.pathname)
                  ? "#3949ab"
                  : "inherit",
              fontWeight:
                ["/Admin/Member", "/Admin/WatchmenRecord"].includes(location.pathname)
                  ? "bold"
                  : "normal",
              "&.Mui-selected:hover": {
                backgroundColor: "rgba(243, 243, 243, 0.56)",
                backdropFilter: "blur(6px)",
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
              borderRadius: "4px",
            }} >
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
                sx={{
                  pl: 4, color: "inherit",
                  ...(location.pathname === "/Admin/Member" ? selectedItemStyle : {})
                }}

              >
                <ListItemText primary="-  Member" sx={{ color: "black" }} />
              </ListItemButton>
              <ListItemButton

                component={Link}
                to="/Admin/WatchmenRecord"
                selected={location.pathname === "/Admin/WatchmenRecord"}
                sx={{
                  pl: 4, color: "inherit",
                  ...(location.pathname === "/Admin/WatchmenRecord" ? selectedItemStyle : {})
                }}

              >
                <ListItemText primary="-  Watchmen" sx={{ color: "black" }} />
              </ListItemButton>
            </List>
          </Collapse> */}

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />
          <ListItemButton
            component={Link}
            to="/Member/Maintenance"
            selected={location.pathname === "/Member/Maintenance"}
            sx={{ ...(location.pathname === "/Member/Maintenance") ? selectedItemStyle : {} }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <CurrencyRupeeIcon />
            </ListItemIcon>
            <ListItemText primary="Maintenance" sx={{ color: "inherit" }} />
          </ListItemButton>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />
          <ListItemButton
            component={Link}
            to="/Member/Complain"
            selected={location.pathname === "/Member/Complain"}
            sx={{ ...(location.pathname === "/Member/Complain") ? selectedItemStyle : {} }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <SyncProblemIcon />
            </ListItemIcon>
            <ListItemText primary="Complain" sx={{ color: "inherit" }} />
          </ListItemButton>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />
          <ListItemButton
            component={Link}
            to="/Member/Expenses"
            selected={location.pathname === "/Member/Expenses"}
            sx={{ ...(location.pathname === "/Member/Expenses") ? selectedItemStyle : {} }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <FaMoneyBillTrendUp />
            </ListItemIcon>
            <ListItemText primary="Expenses" sx={{ color: "inherit" }} />
          </ListItemButton>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />

          <ListItemButton
            component={Link}
            to="/Member/Agency"
            selected={location.pathname === "/Member/Agency"}
            sx={{ ...(location.pathname === "/Member/Agency") ? selectedItemStyle : {} }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>
              <RecentActorsIcon />
            </ListItemIcon>
            <ListItemText primary="Agency" sx={{ color: "inherit" }} />
          </ListItemButton>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />

          <ListItemButton
            component={Link}
            to="/Member/Visiter"
            selected={location.pathname === "/Member/Visiter"}
            sx={{ ...(location.pathname === "/Member/Visiter") ? selectedItemStyle : {} }}>
            <ListItemIcon sx={{ color: "inherit" }}>
              <TransferWithinAStationIcon />
            </ListItemIcon>
            <ListItemText primary="Visitor" sx={{ color: "inherit" }} />
          </ListItemButton>

          <Divider sx={{ borderColor: "#3949ab", my: 1 }} />
        </List>
      </Drawer>
    </>
  );
}
