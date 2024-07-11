// SearchResult.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const SearchResult = ({ title, subtitle, link, isExternal }) => {
  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      {isExternal ? (
        <Link href={link} target="_blank" rel="noopener noreferrer">
          <Typography variant="h6" color="primary">{truncateTitle(title, 50)}</Typography>
        </Link>
      ) : (
        <Typography variant="h6">
          <Link component={NavLink} to={link} underline="hover">
            {truncateTitle(title, 50)}
          </Link>
        </Typography>
      )}
      <Typography variant="body1">{subtitle}</Typography>
    </Box>
  );
};

export default SearchResult;
