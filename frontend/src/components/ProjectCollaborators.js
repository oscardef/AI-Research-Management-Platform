import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Avatar, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectCollaborators = ({ collaborators, project, getProfilePictureUrl, editing, handleRemoveCollaborator, openModal, navigate }) => (
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
        {(project.collaborators || []).map(collaboratorId => {
          const collaborator = collaborators.find(c => c.id === collaboratorId);
          return collaborator ? (
            <ListItem key={collaborator.id}>
              <Avatar alt={collaborator.name} src={getProfilePictureUrl(collaborator)} sx={{ mr: 2 }} />
              <ListItemText
                primary={collaborator.name}
                secondary={collaborator.institution}
                onClick={() => navigate(`/dashboard/${collaborator.id}`)}
                sx={{ cursor: 'pointer' }}
              />
              {editing && (
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveCollaborator(collaborator.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          ) : null;
        })}
      </List>
    </CardContent>
  </Card>
);

export default ProjectCollaborators;
