import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, IconButton, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { pb } from '../services/pocketbaseClient';

/**
 * ProjectCollaborators Component
 * 
 * This component displays and manages the list of collaborators associated with a specific research project.
 * It provides functionalities for viewing collaborators and, when in editing mode,
 * allows adding or removing collaborators.
 * 
 * @param {Array} collaborators - List of all possible collaborators (users).
 * @param {Object} project - The project object containing information about the current project, including its collaborators.
 * @param {Function} getProfilePictureUrl - Function to retrieve the profile picture URL for a collaborator.
 * @param {Boolean} editing - Boolean indicating if the component is in editing mode.
 * @param {Function} handleRemoveCollaborator - Function to handle the removal of a collaborator from the project.
 * @param {Function} openModal - Function to open a modal for adding collaborators.
 * @param {Function} navigate - Function to navigate to a collaborator's dashboard.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ProjectCollaborators = ({ collaborators, project, getProfilePictureUrl, editing, handleRemoveCollaborator, openModal, navigate }) => {
  // State to store the details of the collaborators currently associated with the project
  const [collaboratorDetails, setCollaboratorDetails] = useState([]);

  // Effect to fetch collaborator details when the component mounts or when the list of project collaborators changes
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch details for each collaborator using their ID
        const collaboratorDetailList = await Promise.all(
          project.collaborators.map(id => pb.collection('users').getOne(id, { expand: 'profile_picture' }))
        );
        // Update state with the fetched collaborator details
        setCollaboratorDetails(collaboratorDetailList);
      } catch (error) {
        console.error('Error fetching collaborator details:', error);
      }
    };
    fetchDetails();
  }, [project.collaborators]);

  // Determine the list of collaborators to display
  // - If editing, display all collaborator details fetched
  // - If not editing, filter to only display those included in the project's collaborator list
  const displayCollaborators = editing ? collaboratorDetails : collaboratorDetails.filter(c => (project.collaborators || []).includes(c.id));

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

export default ProjectCollaborators;
