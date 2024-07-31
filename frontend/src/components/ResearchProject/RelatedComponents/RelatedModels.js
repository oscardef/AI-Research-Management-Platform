// RelatedModels.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * RelatedModels Component
 * 
 * This component displays a list of related AI models associated with a project or another entity.
 * It provides functionalities to search for additional models to link and to remove existing linked models.
 * 
 * @param {Object} props - The component props
 * @param {Array} props.relatedModels - List of related models to display
 * @param {Function} props.handleDeleteRelated - Function to handle the deletion of a related model
 * @param {Function} props.handleOpenSearch - Function to handle opening the search dialog for linking models
 * @returns {JSX.Element} The rendered component
 */
const RelatedModels = ({ relatedModels, handleDeleteRelated, handleOpenSearch }) => (
  <Box sx={{ backgroundColor: 'red', padding: 2 }}>
    <Typography variant="h6" color="white">
      Linked AI Models
      {/* Button to open the search dialog for adding new related models */}
      <IconButton onClick={() => handleOpenSearch('model')} color="inherit">
        <SearchIcon />
      </IconButton>
    </Typography>
    <List>
      {relatedModels.map((relatedModel) => (
        <ListItem key={relatedModel.id}>
          <ListItemText
            primary={<Link to={`/model/${relatedModel.id}`}>{relatedModel.name}</Link>}
            secondary={relatedModel.description}
          />
          {/* Button to delete a linked model */}
          <IconButton onClick={() => handleDeleteRelated(relatedModel.id, 'model')}>
            <DeleteIcon color="error" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default RelatedModels;
