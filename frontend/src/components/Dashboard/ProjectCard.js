import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const ProjectCard = ({ projects, isOwnPage, handleDelete }) => {
  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Research Projects
        </Typography>
        {projects.length === 0 ? (
          <Typography>No projects found.</Typography>
        ) : (
          <List>
            {projects.map((project) => (
              <ListItem key={project.id} component={Link} to={`/research/${project.id}`}>
                <ListItemText
                  primary={project.title}
                  secondary={project.description}
                />
                {isOwnPage && (
                  <IconButton onClick={(event) => { event.preventDefault(); handleDelete(project, 'project'); }}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
