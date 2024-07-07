import React from 'react';
import { AppBar, Toolbar, Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { pb } from '../../services/pocketbaseClient';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

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
          <Button component={NavLink} to="/research" color="inherit">
            Research
          </Button>
          <Button component={NavLink} to="/ai-models" color="inherit">
            AI Models
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
            <MenuItem component={NavLink} to="/settings">
              Settings
            </MenuItem>
            <MenuItem component={NavLink} to="/research-projects">
              My Research Projects
            </MenuItem>
            <MenuItem component={NavLink} to="/models">
              My Models
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
