import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemText, Button, CircularProgress, Box, Typography } from '@mui/material';
import { pb } from '../services/pocketbaseClient';

const SearchModal = ({ open, onClose, onAdd, type, currentItems, excludeId }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        setLoading(true);
        try {
          let results = [];
          if (type === 'related_publications') {
            // Fetch from CrossRef API for publications
            const response = await fetch(`https://api.crossref.org/works?query=${searchQuery}&rows=20`);
            if (!response.ok) throw new Error('Error fetching publications');
            const data = await response.json();
            if (data.message && Array.isArray(data.message.items)) {
              results = data.message.items.map(item => ({
                title: item.title ? item.title[0] : 'No title',
                url: item.URL,
                journal: item['container-title'] ? item['container-title'][0] : 'No journal',
                author: item.author ? item.author.map(a => `${a.given} ${a.family}`).join(', ') : 'Unknown'
              }));
            }
          } else {
            let collectionName = '';
            let filterField = '';
            
            switch (type) {
              case 'related_projects':
                collectionName = 'research_projects';
                filterField = 'title';
                break;
              case 'related_models':
                collectionName = 'models';
                filterField = 'name';
                break;
              case 'collaborators':
                collectionName = 'users';
                filterField = 'name';
                break;
              default:
                collectionName = type;
            }
            const filter = `${filterField}~"${searchQuery}"`;
            const res = await pb.collection(collectionName).getList(1, 20, { filter });
            results = res.items;
          }

          const filteredResults = results.filter(item => {
            if (type === 'related_publications') {
              return !currentItems.some(existingItem => existingItem.url === item.url);
            }
            return item.id !== excludeId && !currentItems.some(existingItem => existingItem === item.id);
          });

          setSearchResults(filteredResults);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchData();
  }, [searchQuery, type, currentItems, excludeId]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAdd = (item) => {
    onAdd([item]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Search {type.replace('_', ' ')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search"
          type="text"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {searchResults.map((result) => (
              <ListItem button onClick={() => handleAdd(result)} key={result.id || result.url}>
                <ListItemText
                  primary={result.title || result.name || result.username || result.url}
                  secondary={
                    type === 'related_publications'
                      ? <>
                          <Typography variant="body2">Author: {result.author}</Typography>
                          <Typography variant="body2">Journal: {result.journal}</Typography>
                        </>
                      : result.description
                        ? `${result.description.substring(0, 50)}...`
                        : null
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
