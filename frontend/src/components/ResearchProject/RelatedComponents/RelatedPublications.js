// RelatedPublications.js
import React from 'react';
import { List, ListItem, ListItemText, IconButton, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

/**
 * RelatedPublications Component
 * 
 * This component displays a list of related publications associated with a particular project or entity.
 * It provides functionalities to search for additional publications to link and to remove existing linked publications.
 * 
 * @param {Object} props - The component props
 * @param {Array} props.relatedPublications - List of related publications to display
 * @param {Function} props.handleDeleteRelated - Function to handle the deletion of a related publication
 * @param {Function} props.handleOpenSearch - Function to handle opening the search dialog for linking publications
 * @returns {JSX.Element} The rendered component
 */
const RelatedPublications = ({ relatedPublications, handleDeleteRelated, handleOpenSearch }) => {
  return (
    <div>
      <h3>Related Publications</h3>
      <List>
        {relatedPublications.map((publication, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={
                // Renders the title of the publication as a clickable link that opens in a new tab
                <Link href={publication.link} target="_blank" rel="noopener noreferrer">
                  {publication.title}
                </Link>
              }
            />
            {/* Button to delete a linked publication */}
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRelated(publication.link, 'publication')}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
        {/* Button to open the search dialog for adding new related publications */}
        <ListItem button onClick={() => handleOpenSearch('publication')}>
          <AddIcon />
          <ListItemText primary="Add Publication" />
        </ListItem>
      </List>
    </div>
  );
};

export default RelatedPublications;
