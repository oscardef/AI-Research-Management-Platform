// ProfileResult.js
import React from 'react';
import { Box, Avatar, Typography, Link, Chip } from '@mui/material';
import { NavLink } from 'react-router-dom';

/**
 * ProfileResult Component
 * 
 * This component renders a summarized view of a user profile, including profile picture,
 * name, institution, department, and research interests. It provides a navigational link
 * to the user's detailed dashboard.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.profile - The profile object containing user details
 * @returns {JSX.Element} The rendered component
 */
const ProfileResult = ({ profile }) => {
  /**
   * Truncate the title if it exceeds the maximum length, appending ellipses.
   * @param {string} title - The title to truncate
   * @param {number} maxLength - The maximum length of the title
   * @returns {string} The truncated title
   */
  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  /**
   * Get the URL for the user's profile picture from PocketBase.
   * @param {string} userId - The user ID
   * @param {string} filename - The filename of the profile picture
   * @returns {string} The URL to the profile picture
   */
  const getProfilePictureUrl = (userId, filename) => {
    const baseUrl = 'http://127.0.0.1:8090/api/files/_pb_users_auth_'; // Change this to your actual Pocketbase URL if different
    return `${baseUrl}/${userId}/${filename}`;
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
      {/* Display user's avatar */}
      <Avatar
        src={profile.profile_picture ? getProfilePictureUrl(profile.user, profile.profile_picture) : ''}
        alt={profile.name}
        sx={{ width: 56, height: 56, mr: 2 }}
      />
      <Box sx={{ flex: 1 }}>
        {/* Display user's name as a link to their dashboard */}
        <Typography variant="h6">
          <Link component={NavLink} to={`/dashboard/${profile.user}`} underline="hover">
            {truncateTitle(profile.name, 50)}
          </Link>
        </Typography>
        {/* Display the user's institution and department */}
        <Typography variant="body1">{profile.institution || 'No institution available'}</Typography>
        <Typography variant="body2" color="textSecondary">{profile.department || 'No department available'}</Typography>
        {/* Display the user's research interests as chips */}
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
