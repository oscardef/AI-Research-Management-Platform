import React from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { pb } from '../../services/pocketbaseClient';
import { useAuth } from '../../context/AuthContext.js'

/**
 * NavBar Component
 * 
 * This component serves as the main navigation bar for the application. It includes links to 
 * different sections of the platform and provides user-specific options such as viewing the account 
 * and logging out.
 * 
 * @component
 * @returns {JSX.Element} The rendered component
 */
const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null); // State to manage the anchor element for the user menu
  const { session } = useAuth(); // Fetching the current user session from the authentication context

  /**
   * Opens the user menu when the account icon is clicked.
   * 
   * @param {Object} event - The event object triggered by clicking the account icon.
   */
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user menu.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Logs out the current user by clearing the authentication store and redirecting to the login page.
   */
  const handleLogout = async () => {
    pb.authStore.clear(); // Clear the authentication store
    window.location.href = '/login'; // Redirect to the login page
  };

  return (
    <AppBar position="static"> {/* AppBar for the navigation bar, positioned statically */}
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Navigation buttons linking to different sections */}
          <Button component={NavLink} to="/search" color="inherit">
            Search
          </Button>
          <Button component={NavLink} to="/profiles" color="inherit">
            Profiles
          </Button>
          <Button component={NavLink} to="/research-projects" color="inherit">
            Research Projects
          </Button>
          <Button component={NavLink} to="/models" color="inherit">
            Models
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Account icon button to open the user menu */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
          >
            <AccountCircleIcon />
          </IconButton>
          {/* User menu with options for account, dashboard, and logout */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {/* Link to the user's account page */}
            <MenuItem component={NavLink} to="/account">
              My Account
            </MenuItem>
            {/* Link to the user's dashboard */}
            <MenuItem component={NavLink} to={`/dashboard/${session?.id}`}>
              Dashboard
            </MenuItem>
            {/* Logout option */}
            <MenuItem onClick={handleLogout} style={{ color: 'red' }}>
              <ExitToAppIcon style={{ marginRight: 8 }} /> Log Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
