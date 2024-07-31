// RelatedProjects.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * RelatedProjects Component
 * 
 * This component displays a list of related research projects associated with a particular project or entity.
 * It provides functionalities to search for additional projects to link and to remove existing linked projects.
 * 
 * @param {Object} props - The component props
 * @param {Array} props.relatedProjects - List of related projects to display
 * @param {Function} props.handleDeleteRelated - Function to handle the deletion of a related project
 * @param {Function} props.handleOpenSearch - Function to handle opening the search dialog for linking projects
 * @returns {JSX.Element} The rendered component
 */
const RelatedProjects = ({ relatedProjects, handleDeleteRelated, handleOpenSearch }) => (
  <Box sx={{ backgroundColor: 'red', padding: 2 }}>
    <Typography variant="h6" color="white">
      Related Research Projects
      {/* Button to open the search dialog for adding new related projects */}
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
          {/* Button to delete a linked project */}
          <IconButton onClick={() => handleDeleteRelated(relatedProject.id, 'project')}>
            <DeleteIcon color="error" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default RelatedProjects;
