import React from 'react';
import { Box, Avatar, Typography, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const ProfileResult = ({ profile }) => {
  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const getProfilePictureUrl = (userId, filename) => {
    const baseUrl = 'http://127.0.0.1:8090/api/files/_pb_users_auth_'; // Change this to your actual Pocketbase URL if different
    return `${baseUrl}/${userId}/${filename}`;
  };

  console.log('Profile:', profile); // Debug information to check profile fields

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
      <Avatar
        src={profile.profile_picture ? getProfilePictureUrl(profile.user, profile.profile_picture) : ''}
        alt={profile.name}
        sx={{ width: 56, height: 56, mr: 2 }}
      />
      <Box>
        <Typography variant="h6">
          <Link component={NavLink} to={`/dashboard/${profile.user}`} underline="hover">
            {truncateTitle(profile.name, 50)}
          </Link>
        </Typography>
        <Typography variant="body1">{profile.institution || 'No institution available'}</Typography>
        <Typography variant="body2" color="textSecondary">{profile.department || 'No department available'}</Typography>
      </Box>
    </Box>
  );
};

export default ProfileResult;
