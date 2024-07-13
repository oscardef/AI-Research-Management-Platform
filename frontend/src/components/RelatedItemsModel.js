import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { pb } from '../services/pocketbaseClient';

const RelatedItemsModel = ({ relatedProjects, relatedModels, editing, handleNavigation, openModal, handleRemoveRelatedItem, tempModel }) => {
  const [projectDetails, setProjectDetails] = useState([]);
  const [modelDetails, setModelDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const projects = await Promise.all(
          (editing ? tempModel.related_projects : relatedProjects).map(id => pb.collection('research_projects').getOne(id))
        );
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

  const displayProjects = editing ? projectDetails : relatedProjects;
  const displayModels = editing ? modelDetails : relatedModels;

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
