import React from 'react';
import { Box, Typography } from '@mui/material';

const ProfileResult = ({ profile }) => {
  const { name, email } = profile || {};

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6">{name ? `${name}` : 'No Name'}</Typography>
      <Typography variant="body1">{email || 'No Email'}</Typography>
    </Box>
  );
};

export default ProfileResult;
