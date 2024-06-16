// RelatedModels.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const RelatedModels = ({ relatedModels, handleDeleteRelated, handleOpenSearch }) => (
  <Box sx={{ backgroundColor: 'red', padding: 2 }}>
    <Typography variant="h6" color="white">
      Linked AI Models
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
          <IconButton onClick={() => handleDeleteRelated(relatedModel.id, 'model')}>
            <DeleteIcon color="error" />
          </IconButton>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default RelatedModels;
