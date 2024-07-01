// RelatedPublications.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

const RelatedPublications = ({ relatedPublications, handleDeleteRelated, handleOpenSearch }) => (
    <Box sx={{ backgroundColor: 'red', padding: 2 }}>
        <Typography variant="h6" color="white">
            Related Publications
            < IconButton onClick={() => handleOpenSearch('publication')} color="inherit">
                <SearchIcon />
            </IconButton>
        </Typography>
        <List>
            {relatedPublications.map((publication, index) => (
                <ListItem key={index}>
                    <ListItemText
                        primary={<a href={publication.link} target="_blank" rel="noopener noreferrer">{publication.title}</a>}
                    />
                    <IconButton onClick={() => handleDeleteRelated(publication.link, 'publication')}>
                        <DeleteIcon color="error" />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    </Box>
);

export default RelatedPublications;
