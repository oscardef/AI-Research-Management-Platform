import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import './NavBar.css';

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''}>
            <Button sx={{ color: 'white' }}>SEARCH</Button>
          </NavLink>
          <NavLink to="/research" className={({ isActive }) => isActive ? 'active' : ''}>
            <Button sx={{ color: 'white' }}>RESEARCH</Button>
          </NavLink>
          <NavLink to="/models" className={({ isActive }) => isActive ? 'active' : ''}>
            <Button sx={{ color: 'white' }}>AI MODELS</Button>
          </NavLink>
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>
            <Button sx={{ color: 'white' }}>MY ACCOUNT</Button>
          </NavLink>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            <Button sx={{ color: 'white' }}>HOME</Button>
          </NavLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
