// RelatedPublications.js
import React from 'react';
import { List, ListItem, ListItemText, IconButton, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const RelatedPublications = ({ relatedPublications, handleDeleteRelated, handleOpenSearch }) => {
  return (
    <div>
      <h3>Related Publications</h3>
      <List>
        {relatedPublications.map((publication, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={
                <Link href={publication.link} target="_blank" rel="noopener noreferrer">
                  {publication.title}
                </Link>
              }
            />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRelated(publication.link, 'publication')}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
        <ListItem button onClick={() => handleOpenSearch('publication')}>
          <AddIcon />
          <ListItemText primary="Add Publication" />
        </ListItem>
      </List>
    </div>
  );
};

export default RelatedPublications;
