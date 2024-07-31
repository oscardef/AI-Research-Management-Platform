import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

/**
 * ModelCard Component
 * 
 * This component displays a list of AI models within a card UI. It allows users to view details of each model
 * and, if permitted, delete them. The component uses Material-UI for styling and layout.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.models - Array of model objects to be displayed. Each model should have an 'id', 'name', and 'description'.
 * @param {boolean} props.isOwnPage - Indicates if the current page belongs to the user, allowing deletion of models.
 * @param {function} props.handleDelete - Function to handle the deletion of a model, triggered by the delete button.
 * 
 * @returns {React.Element} The rendered ModelCard component.
 */
const ModelCard = ({ models, isOwnPage, handleDelete }) => {
  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Models
        </Typography>
        {/* Display a message if no models are found */}
        {models.length === 0 ? (
          <Typography>No models found.</Typography>
        ) : (
          <List>
            {/* Map over the models array to render each model as a ListItem */}
            {models.map((model) => (
              <ListItem key={model.id} component={Link} to={`/model/${model.id}`}>
                <ListItemText
                  primary={model.name}
                  secondary={`${model.description}`}
                />
                {/* Conditionally render the delete button if isOwnPage is true */}
                {isOwnPage && (
                  <IconButton 
                    onClick={(event) => { 
                      event.preventDefault(); // Prevent the default link navigation
                      handleDelete(model, 'model'); // Call the delete handler
                    }}
                  >
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

export default ModelCard;
