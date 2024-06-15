import React from 'react';
import { Box, Typography } from '@mui/material';

const ResearchProjectResult = ({ project }) => {
  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
      <Typography variant="h6">{project.title}</Typography>
      <Typography variant="body1">{project.description}</Typography>
    </Box>
  );
};

export default ResearchProjectResult;
