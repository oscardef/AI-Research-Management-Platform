import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const ModelCard = ({ models, isOwnPage, handleDelete }) => {
  return (
    <Card sx={{ boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Models
        </Typography>
        {models.length === 0 ? (
          <Typography>No models found.</Typography>
        ) : (
          <List>
            {models.map((model) => (
              <ListItem key={model.id} component={Link} to={`/model/${model.id}`}>
                <ListItemText
                  primary={model.name}
                  secondary={`${model.description}`}
                />
                {isOwnPage && (
                  <IconButton onClick={(event) => { event.preventDefault(); handleDelete(model, 'model'); }}>
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
