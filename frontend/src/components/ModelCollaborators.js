import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, IconButton, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { pb } from '../services/pocketbaseClient';

/**
 * ModelCollaborators Component
 * 
 * This component displays and manages the list of collaborators for a specific model.
 * It provides functionalities for viewing collaborators and, when in editing mode,
 * allows adding or removing collaborators.
 * 
 * @param {Array} collaborators - List of all possible collaborators (users).
 * @param {Object} model - The model object containing information about the current model, including its collaborators.
 * @param {Function} getProfilePictureUrl - Function to retrieve the profile picture URL for a collaborator.
 * @param {Boolean} editing - Boolean indicating if the component is in editing mode.
 * @param {Function} handleRemoveCollaborator - Function to handle the removal of a collaborator from the model.
 * @param {Function} openModal - Function to open a modal for adding collaborators.
 * @param {Function} navigate - Function to navigate to a collaborator's dashboard.
 * 
 * @returns {JSX.Element} The rendered component
 */
const ModelCollaborators = ({ collaborators, model, getProfilePictureUrl, editing, handleRemoveCollaborator, openModal, navigate }) => {
  // State to store the details of the collaborators currently associated with the model
  const [collaboratorDetails, setCollaboratorDetails] = useState([]);

  // Effect to fetch collaborator details when editing mode is enabled
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log("collabs: ", model.collaborators); // Log the list of collaborator IDs for debugging
        // Fetch details for each collaborator using their ID
        const collaboratorDetailList = await Promise.all(
          model.collaborators.map(id => pb.collection('users').getOne(id, { expand: 'profile_picture' }))
        );
        // Update state with the fetched collaborator details
        setCollaboratorDetails(collaboratorDetailList);
      } catch (error) {
        console.error('Error fetching collaborator details:', error);
      }
    };
    if (editing) {
      fetchDetails();
    }
  }, [editing, model.collaborators]);

  // Determine the list of collaborators to display, based on editing mode
  const displayCollaborators = editing ? collaboratorDetails : collaborators.filter(c => (model.collaborators || []).includes(c.id));

  return (
    <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Collaborators</Typography>
        <List>
          {editing && (
            <ListItem>
              <Button
                variant="contained"
                color="primary"
                onClick={() => openModal('collaborators')}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add Collaborator
              </Button>
            </ListItem>
          )}
          {displayCollaborators.map((collaborator) => (
            <ListItem key={collaborator.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate(`/dashboard/${collaborator.id}`)}>
                <Avatar alt={collaborator.name} src={getProfilePictureUrl(collaborator)} sx={{ mr: 2 }} />
                <ListItemText
                  primary={collaborator.name}
                  secondary={collaborator.institution}
                />
              </Box>
              {editing && (
                <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleRemoveCollaborator(collaborator.id); }}>
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ModelCollaborators;
