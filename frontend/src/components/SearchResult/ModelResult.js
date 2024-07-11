// ModelResult.js
import React from 'react';
import { Box, Typography, Link, Chip } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/system';
import StatusBox from '../StatusBox';

const CollaboratorLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const hashColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `#${((hash >> 24) & 0xff).toString(16)}${((hash >> 16) & 0xff).toString(16)}${((hash >> 8) & 0xff).toString(16)}${(hash & 0xff).toString(16)}`;
  return color.substring(0, 7); // Return a 6-character color code
};

const ModelResult = ({ model }) => {
  const truncateTitle = (title, maxLength) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" component={NavLink} to={`/model/${model.id}`} underline="hover" color="primary">
          {truncateTitle(model.name, 50)}
        </Typography>
        <Typography variant="body1">{model.description}</Typography>
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
        <Box sx={{ mt: 1, mb: 1 }}>
          {(model.tags || []).map((tag, index) => (
            <Chip key={index} label={tag} sx={{ mr: 1, mb: 1, backgroundColor: hashColor(tag), color: '#fff' }} />
          ))}
        </Box>
        <StatusBox status={model.status} />
        <Typography variant="body2">
          Version: {model.version}
        </Typography>
      </Box>
    </Box>
  );
};

export default ModelResult;
