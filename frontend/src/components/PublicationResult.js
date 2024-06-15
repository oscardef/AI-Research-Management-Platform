import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const PublicationResult = ({ publication }) => {
  const { title, author, journal, url } = publication;

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
      <Link href={url} target="_blank" rel="noopener noreferrer">
        <Typography variant="h6" color="primary">{title}</Typography>
      </Link>
      <Typography variant="body1">{author}</Typography>
      <Typography variant="body2">{journal}</Typography>
    </Box>
  );
};

export default PublicationResult;
