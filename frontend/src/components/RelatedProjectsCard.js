import React from 'react';
import { Box, Card, CardContent, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * RelatedProjectsCard Component
 * 
 * This component displays a list of related research projects in a card format.
 * It allows for viewing, adding, and removing related projects, depending on the editing state.
 * 
 * @param {Array} relatedProjects - List of related projects.
 * @param {Boolean} editing - Indicates if the component is in editing mode.
 * @param {Function} handleNavigation - Function to navigate to the related project's page.
 * @param {Function} openModal - Function to open a modal for adding related projects.
 * @param {Function} handleRemoveRelatedItem - Function to remove a related project.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const RelatedProjectsCard = ({ relatedProjects, editing, handleNavigation, openModal, handleRemoveRelatedItem }) => {
  return (
    <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
      <CardContent>
        {/* Title of the card */}
        <Typography variant="h6" sx={{ mb: 1 }}>Related Projects</Typography>
        {/* Display related projects or a message if none are found */}
        {relatedProjects.length > 0 ? (
          relatedProjects.map((project, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {/* Project title clickable to navigate to the project's detail page */}
              <Typography variant="body2" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(project.id, 'project')}>
                {project.title}
              </Typography>
              {/* Show delete icon if editing mode is enabled */}
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
        {/* Button to add a new related project if in editing mode */}
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
