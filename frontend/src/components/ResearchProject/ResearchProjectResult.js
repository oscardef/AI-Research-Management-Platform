import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ResearchProjectResult = ({ project }) => {
  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
      <Typography variant="h6">
        <Link to={`/research/${project.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
          {project.title}
        </Link>
      </Typography>
      <Typography variant="body1">{project.description}</Typography>
    </Box>
  );
};

export default ResearchProjectResult;
