import GridViewIcon from "@mui/icons-material/GridView";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import { redirect } from "react-router-dom";

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    if (newValue !== value) {
      setValue(newValue);

      if (newValue === 0) {
        redirect("/");
      } else if (newValue === 1) {
      } else if (newValue === 2) {
      }
    }
  };

  return (
    <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
      <BottomNavigationAction label="Home" icon={<GridViewIcon />} />
      <BottomNavigationAction label="Home" icon={<SearchIcon />} />
      <BottomNavigationAction label="Home" icon={<PersonIcon />} />
    </BottomNavigation>
  );
}
