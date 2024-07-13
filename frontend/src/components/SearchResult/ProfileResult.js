import React from 'react';
import { Box, Avatar, Typography, Link, Chip } from '@mui/material';
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

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
      <Avatar
        src={profile.profile_picture ? getProfilePictureUrl(profile.user, profile.profile_picture) : ''}
        alt={profile.name}
        sx={{ width: 56, height: 56, mr: 2 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6">
          <Link component={NavLink} to={`/dashboard/${profile.user}`} underline="hover">
            {truncateTitle(profile.name, 50)}
          </Link>
        </Typography>
        <Typography variant="body1">{profile.institution || 'No institution available'}</Typography>
        <Typography variant="body2" color="textSecondary">{profile.department || 'No department available'}</Typography>
        <Box sx={{ mt: 1, mb: 1 }}>
          {Array.isArray(profile.research_interests) && profile.research_interests.map((interest, index) => (
            <Chip key={index} label={interest} sx={{ mr: 1, mb: 1, backgroundColor: 'primary.main', color: '#fff' }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileResult;
