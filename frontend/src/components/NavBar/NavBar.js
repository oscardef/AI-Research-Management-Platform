import React from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { pb } from '../../services/pocketbaseClient';
import { useAuth } from '../../context/AuthContext.js'

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { session } = useAuth();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    pb.authStore.clear();
    window.location.href = '/login';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
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
            <MenuItem component={NavLink} to="/account">
              My Account
            </MenuItem>
            <MenuItem component={NavLink} to={`/dashboard/${session?.id}`}>
              Dashboard
            </MenuItem>
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
