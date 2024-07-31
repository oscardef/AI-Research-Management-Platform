import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { pb } from '../services/pocketbaseClient';

/**
 * RelatedItemsModel Component
 * 
 * This component manages and displays related projects and models for a specific model.
 * It provides functionalities to add, remove, and navigate to related items.
 * 
 * @param {Array} relatedProjects - List of related project IDs.
 * @param {Array} relatedModels - List of related model IDs.
 * @param {Boolean} editing - Whether the component is in editing mode.
 * @param {Function} handleNavigation - Function to navigate to a specific project or model page.
 * @param {Function} openModal - Function to open the modal for adding related items.
 * @param {Function} handleRemoveRelatedItem - Function to remove a related item.
 * @param {Object} tempModel - Temporary state of the model being edited.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const RelatedItemsModel = ({ relatedProjects, relatedModels, editing, handleNavigation, openModal, handleRemoveRelatedItem, tempModel }) => {
  // State variables to store detailed information about related projects and models
  const [projectDetails, setProjectDetails] = useState([]);
  const [modelDetails, setModelDetails] = useState([]);

  // useEffect hook to fetch detailed information about related projects and models when component mounts or dependencies change
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch project details, either from tempModel (if editing) or relatedProjects
        const projects = await Promise.all(
          (editing ? tempModel.related_projects : relatedProjects).map(id => pb.collection('research_projects').getOne(id))
        );
        // Fetch model details, either from tempModel (if editing) or relatedModels
        const models = await Promise.all(
          (editing ? tempModel.related_models : relatedModels).map(id => pb.collection('models').getOne(id))
        );
        setProjectDetails(projects);
        setModelDetails(models);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, [editing, tempModel.related_projects, tempModel.related_models, relatedProjects, relatedModels]);

  // Determine the items to display based on editing mode
  const displayProjects = editing ? projectDetails : relatedProjects;
  const displayModels = editing ? modelDetails : relatedModels;

  // Helper function to render list items for projects or models
  const renderListItem = (item, type) => (
    <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(item.id, type)}>
        <ListItemText
          primary={item.title || item.name}
          secondary={item.description ? item.description.substring(0, 50) + '...' : ''}
        />
      </Box>
      {editing && (
        <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleRemoveRelatedItem(`related_${type}s`, item.id); }}>
          <DeleteIcon />
        </IconButton>
      )}
    </ListItem>
  );

  return (
    <>
      {/* Card for displaying related projects */}
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Related Projects</Typography>
          <List>
            {editing && (
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openModal('related_projects')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Related Project
                </Button>
              </ListItem>
            )}
            {displayProjects.map((project) => renderListItem(project, 'project'))}
          </List>
        </CardContent>
      </Card>

      {/* Card for displaying related models */}
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Related Models</Typography>
          <List>
            {editing && (
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openModal('related_models')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Related Model
                </Button>
              </ListItem>
            )}
            {displayModels.map((model) => renderListItem(model, 'model'))}
          </List>
        </CardContent>
      </Card>
    </>
  );
};

export default RelatedItemsModel;
