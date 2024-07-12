import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, IconButton, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { pb } from '../services/pocketbaseClient';

const ModelCollaborators = ({ collaborators, model, getProfilePictureUrl, editing, handleRemoveCollaborator, openModal, navigate }) => {
  const [collaboratorDetails, setCollaboratorDetails] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log("collabs: ", model.collaborators);
        const collaboratorDetailList = await Promise.all(
          model.collaborators.map(id => pb.collection('users').getOne(id, { expand: 'profile_picture' }))
        );
        setCollaboratorDetails(collaboratorDetailList);
      } catch (error) {
        console.error('Error fetching collaborator details:', error);
      }
    };
    if (editing) {
      fetchDetails();
    }
  }, [editing, model.collaborators]);

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
