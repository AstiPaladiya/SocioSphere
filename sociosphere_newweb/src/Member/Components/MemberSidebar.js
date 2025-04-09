import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
export default function MemberSidebar()
{
    const menuItems = [{ text: "Dashboard", path: "/member/dashboard" }];

    return(
        <>
         <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List>
        {menuItems.map(({ text, path }) => (
          <ListItem button key={text} component={Link} to={path}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
        </>
    )
}