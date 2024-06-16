import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { supabase } from '../supabaseClient';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const MyAccountPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({
    first_name: false,
    last_name: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Authenticated user:', user);
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          console.log('Fetched profile data:', data);
          setProfile(data);
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    console.log('Profile data before update:', profile);
    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq('user_id', profile.user_id);
    console.log('Profile data after update:', data);
    if (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } else {
      alert('Profile updated successfully');
      console.log('Updated profile data:', data);
    }
  };

  const toggleEdit = (field) => {
    setEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">My Account</Typography>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          name="first_name"
          value={profile.first_name || ''}
          onChange={handleChange}
          disabled={!editing.first_name}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => toggleEdit('first_name')}>
                {editing.first_name ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          name="last_name"
          value={profile.last_name || ''}
          onChange={handleChange}
          disabled={!editing.last_name}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => toggleEdit('last_name')}>
                {editing.last_name ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Profile
        </Button>
      </Box>
    </Box>
  );
};

export default MyAccountPage;
