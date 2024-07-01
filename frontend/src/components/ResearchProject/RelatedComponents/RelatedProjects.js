// RelatedProjects.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const RelatedProjects = ({ relatedProjects, handleDeleteRelated, handleOpenSearch }) => (
  <Box sx={{ backgroundColor: 'red', padding: 2 }}>
    <Typography variant="h6" color="white">
      Related Research Projects
      <IconButton onClick={() => handleOpenSearch('project')} color="inherit">
        <SearchIcon />
      </IconButton>
    </Typography>
    <List>
      {relatedProjects.map((relatedProject) => (
        <ListItem key={relatedProject.id}>
          <ListItemText
            primary={<Link to={`/research/${relatedProject.id}`}>{relatedProject.title}</Link>}
            secondary={relatedProject.description}
          />
          <IconButton onClick={() => handleDeleteRelated(relatedProject.id, 'project')}>
            <DeleteIcon color="error" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default RelatedProjects;
