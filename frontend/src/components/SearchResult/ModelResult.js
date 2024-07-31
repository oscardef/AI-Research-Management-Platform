// ModelResult.js
import React from 'react';
import { Box, Typography, Link, Chip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/system';
import StatusBox from '../StatusBox';

// Styled component for displaying collaborator links with consistent margin
const CollaboratorLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

/**
 * ModelResult Component
 * 
 * This component renders a summarized view of an AI model, including its title, description,
 * collaborators, tags, status, and version. It provides navigational links to the model details
 * and collaborator profiles.
 * 
 * @param {Object} props - The component props
 * @param {Object} props.model - The model object containing its details
 * @returns {JSX.Element} The rendered component
 */
const ModelResult = ({ model }) => {
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

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1 }}>
        {/* Display the model name as a link to the model's detailed page */}
        <Typography variant="h6" component={NavLink} to={`/model/${model.id}`} underline="hover" color="primary">
          {truncateTitle(model.name, 50)}
        </Typography>
        {/* Display the model's description */}
        <Typography variant="body1">{model.description}</Typography>
        {/* Display the list of collaborators with links to their dashboards */}
        <Typography variant="body2" color="textSecondary">
          Collaborators: {(model.collaborators || []).map((c, index) => (
            <CollaboratorLink key={c.id} component={NavLink} to={`/dashboard/${c.id}`} underline="hover">
              {c.name}
              {index < model.collaborators.length - 1 && ', '}
            </CollaboratorLink>
          ))}
        </Typography>
      </Box>
      <Box sx={{ flexShrink: 0, textAlign: 'right' }}>
        {/* Display tags associated with the model */}
        <Box sx={{ mt: 1, mb: 1 }}>
          {(model.tags || []).map((tag, index) => (
            <Chip key={index} label={tag} sx={{ mr: 1, mb: 1, backgroundColor: 'primary.main', color: '#fff' }} />
          ))}
        </Box>
        {/* Display the model's status using the StatusBox component */}
        <StatusBox status={model.status} />
        {/* Display the model's version */}
        <Typography variant="body2">
          Version: {model.version}
        </Typography>
      </Box>
    </Box>
  );
};

export default ModelResult;
