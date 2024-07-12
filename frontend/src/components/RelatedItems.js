import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, Chip, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const RelatedItems = ({ relatedProjects, relatedModels, relatedPublications, project, editing, handleNavigation, openModal }) => {
  const statusColors = {
    active: 'green',
    complete: 'blue',
    inactive: 'grey',
    pending: 'orange',
  };

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Status</Typography>
          <Chip
            label={project.status}
            sx={{
              bgcolor: statusColors[project.status],
              color: 'white',
              mb: 1,
            }}
          />
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
          <List>
            {Array.isArray(project.tags) && project.tags.map((tag, index) => (
              <Chip key={index} label={tag} sx={{ mr: 1, mb: 1, bgcolor: 'primary.main', color: 'white' }} />
            ))}
          </List>
        </CardContent>
      </Card>
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
                  Add Project
                </Button>
              </ListItem>
            )}
            {relatedProjects.map((relatedProject) => (
              <ListItem key={relatedProject.id} button onClick={() => handleNavigation(relatedProject.id, 'project')}>
                <ListItemText
                  primary={relatedProject.title}
                  secondary={relatedProject.description ? `${relatedProject.description.substring(0, 50)}...` : ''}
                />
              </ListItem>
            ))}
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
                  Add Model
                </Button>
              </ListItem>
            )}
            {relatedModels.map((model) => (
              <ListItem key={model.id} button onClick={() => handleNavigation(model.id, 'model')}>
                <ListItemText
                  primary={model.name}
                  secondary={model.description ? `${model.description.substring(0, 50)}...` : ''}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Related Publications</Typography>
          <List>
            {editing && (
              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => openModal('related_publications')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Publication
                </Button>
              </ListItem>
            )}
            {relatedPublications.map((pub, index) => (
              pub && pub.title ? (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      pub.url ? (
                        <Link href={pub.url} target="_blank" rel="noopener">
                          {pub.title.length > 50 ? `${pub.title.substring(0, 50)}...` : pub.title}
                        </Link>
                      ) : (
                        pub.title.length > 50 ? `${pub.title.substring(0, 50)}...` : pub.title
                      )
                    }
                    secondary={`Source: ${pub.journal}`}
                  />
                </ListItem>
              ) : null
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
};

export default RelatedItems;
