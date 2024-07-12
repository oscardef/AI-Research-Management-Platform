import React from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const RelatedProjectsCard = ({ relatedProjects, editing, handleNavigation, openModal, handleRemoveRelatedItem }) => {
  return (
    <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Related Projects</Typography>
        {relatedProjects.length > 0 ? (
          relatedProjects.map((project, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(project.id, 'project')}>
                {project.title}
              </Typography>
              {editing && (
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveRelatedItem('related_projects', project.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body2">No related projects found.</Typography>
        )}
        {editing && (
          <IconButton onClick={() => openModal('related_projects')} sx={{ mt: 1 }}>
            <AddIcon />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedProjectsCard;
