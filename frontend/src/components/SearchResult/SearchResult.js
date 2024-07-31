// SearchResult.js

import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

/**
 * SearchResult Component
 * 
 * This component displays a search result item with a title, subtitle, and link.
 * It supports both internal and external links, using MUI components for styling.
 * 
 * @param {Object} props - The component props
 * @param {string} props.title - The main title of the search result
 * @param {string} props.subtitle - Additional information about the search result
 * @param {string} props.link - The URL or path for the result link
 * @param {boolean} props.isExternal - Flag indicating if the link is external (true) or internal (false)
 * @returns {JSX.Element} The rendered component
 */
const SearchResult = ({ title, subtitle, link, isExternal }) => {
  /**
   * Helper function to truncate a string if it exceeds a specified length.
   * 
   * @param {string} title - The title or string to truncate
   * @param {number} maxLength - The maximum allowed length of the string
   * @returns {string} The truncated string with ellipsis if necessary
   */
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
