import React, { useState, useEffect } from 'react';
import { pb } from '../services/pocketbaseClient';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Stores the user's email input
  const [password, setPassword] = useState(''); // Stores the user's password input
  const [error, setError] = useState(''); // Stores error messages, if any
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuth = async () => {
      const authData = pb.authStore.isValid; // Checks if there's a valid session
      if (authData) {
        navigate('/search'); // Redirect if already authenticated
      }
    };
    checkAuth(); // Call authentication check on component mount
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents default form submission
    try {
      await pb.collection('users').authWithPassword(email, password); // Attempt to authenticate
      navigate('/search'); // Redirect to search page upon successful login
    } catch (error) {
      setError(error.message); // Display error message on failure
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          margin="normal"
          required
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
