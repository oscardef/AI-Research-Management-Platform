// ResearchProjectResult.js

import React from 'react';
import { Box, Typography, Link, Chip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/system';
import StatusBox from '../StatusBox';

/**
 * A styled component for collaborator links, using the MUI Link component.
 * Adds some margin to the right for spacing between links.
 */
const CollaboratorLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

/**
 * ResearchProjectResult Component
 * 
 * This component displays a brief overview of a research project, including
 * the project title, description, status, tags, and collaborators. It uses
 * MUI components for styling and layout.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.project - The project object containing details about the research project
 * @returns {JSX.Element} The rendered component
 */
const ResearchProjectResult = ({ project }) => {
  
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
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" component={NavLink} to={`/research/${project.id}`} underline="hover" color="primary">
          {truncateTitle(project.title, 50)}
        </Typography>
        <Typography variant="body1">{project.description}</Typography>
        <Typography variant="body2" color="textSecondary">
          Collaborators: {(project.collaborators || []).map((c, index) => (
            <CollaboratorLink key={c.id} component={NavLink} to={`/dashboard/${c.id}`} underline="hover">
              {c.name}
              {index < project.collaborators.length - 1 && ', '}
            </CollaboratorLink>
          ))}
        </Typography>
      </Box>
      <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
        <Box sx={{ mt: 1, mb: 1 }}>
          {(project.tags || []).map((tag, index) => (
            <Chip key={index} label={tag} sx={{ mr: 1, mb: 1, backgroundColor: 'primary.main', color: '#fff' }} />
          ))}
        </Box>
        <StatusBox status={project.status} />
      </Box>
    </Box>
  );
};

export default ResearchProjectResult;
