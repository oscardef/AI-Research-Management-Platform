import React from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const RelatedModelsCard = ({ relatedModels, editing, handleNavigation, openModal, handleRemoveRelatedItem }) => {
  return (
    <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Related Models</Typography>
        {relatedModels.length > 0 ? (
          relatedModels.map((model, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(model.id, 'model')}>
                {model.name}
              </Typography>
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
