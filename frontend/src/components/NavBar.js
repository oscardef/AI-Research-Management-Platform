import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, ExitToApp } from '@mui/icons-material';

const NavBar = ({ session, handleLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={NavLink} to="/search" exact="true">
            Search
          </Button>
          <Button color="inherit" component={NavLink} to="/research">
            Research
          </Button>
          <Button color="inherit" component={NavLink} to="/aimodels">
            AI Models
          </Button>
        </Box>
        <Box>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
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
            <MenuItem onClick={handleClose} component={NavLink} to="/settings">
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose} component={NavLink} to="/my-research-projects">
              My Research Projects
            </MenuItem>
            <MenuItem onClick={handleClose} component={NavLink} to="/my-models">
              My Models
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
              <ExitToApp sx={{ marginRight: 1, color: 'red' }} />
              Log Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
