import React from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * RelatedModelsCard Component
 * 
 * This component displays a list of related models in a card format.
 * It allows for viewing, adding, and removing related models, depending on the editing state.
 * 
 * @param {Array} relatedModels - List of related models.
 * @param {Boolean} editing - Indicates if the component is in editing mode.
 * @param {Function} handleNavigation - Function to navigate to the related model's page.
 * @param {Function} openModal - Function to open a modal for adding related models.
 * @param {Function} handleRemoveRelatedItem - Function to remove a related model.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const RelatedModelsCard = ({ relatedModels, editing, handleNavigation, openModal, handleRemoveRelatedItem }) => {
  return (
    <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
      <CardContent>
        {/* Title of the card */}
        <Typography variant="h6" sx={{ mb: 1 }}>Related Models</Typography>
        {/* Display related models or a message if none are found */}
        {relatedModels.length > 0 ? (
          relatedModels.map((model, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {/* Model name clickable to navigate to the model's detail page */}
              <Typography variant="body2" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(model.id, 'model')}>
                {model.name}
              </Typography>
              {/* Show delete icon if editing mode is enabled */}
              {editing && (
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveRelatedItem('related_models', model.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2">No related models found.</Typography>
        )}
        {/* Button to add a new related model if in editing mode */}
        {editing && (
          <IconButton onClick={() => openModal('related_models')} sx={{ mt: 1 }}>
            <AddIcon />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedModelsCard;
