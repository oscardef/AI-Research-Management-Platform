import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

/**
 * ProjectCard Component
 * 
 * This component displays a list of research projects within a card interface. It supports linking to detailed views 
 * of each project and allows deletion of projects if the component is used in the user's own page.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.projects - An array of project objects to display.
 * @param {boolean} props.isOwnPage - A boolean indicating if the card is displayed on the user's own page, 
 * enabling delete functionality.
 * @param {function} props.handleDelete - A function to handle the deletion of a project.
 * 
 * @returns {React.Element} The rendered ProjectCard component.
 */
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
