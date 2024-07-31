import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, List, ListItem, ListItemText, Button, CircularProgress, Box, Typography } from '@mui/material';
import { pb } from '../../services/pocketbaseClient';

/**
 * SearchModal Component
 * 
 * This component provides a modal dialog for searching and selecting items. It supports searching for related publications,
 * related projects, related models, and collaborators, allowing users to add selected items to their current context.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Controls whether the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onAdd - Function to handle adding the selected item.
 * @param {string} props.type - The type of items being searched for (e.g., 'related_publications', 'related_projects').
 * @param {Array} props.currentItems - The list of currently selected items to exclude from search results.
 * @param {string} props.excludeId - An ID to exclude from the search results, typically the ID of the current item being edited.
 * 
 * @returns {React.Element} The rendered SearchModal component.
 */
const SearchModal = ({ open, onClose, onAdd, type, currentItems, excludeId }) => {
  // State hooks for managing search results, loading state, and search query
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // useEffect hook to fetch data whenever searchQuery, type, currentItems, or excludeId changes
  useEffect(() => {
    const fetchData = async () => {
      if (searchQuery) {
        setLoading(true); // Set loading state to true while fetching data
        try {
          let results = [];
          if (type === 'related_publications') {
            // Fetch from CrossRef API for publications
            const response = await fetch(`https://api.crossref.org/works?query=${searchQuery}&rows=20`);
            if (!response.ok) throw new Error('Error fetching publications');
            const data = await response.json();
            if (data.message && Array.isArray(data.message.items)) {
              // Map API response to desired structure
              results = data.message.items.map(item => ({
                title: item.title ? item.title[0] : 'No title',
                url: item.URL,
                journal: item['container-title'] ? item['container-title'][0] : 'No journal',
                author: item.author ? item.author.map(a => `${a.given} ${a.family}`).join(', ') : 'Unknown'
              }));
            }
          } else {
            // Determine collection name and filter field based on type
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
            // Fetch from PocketBase using the filter
            const filter = `${filterField}~"${searchQuery}"`;
            const res = await pb.collection(collectionName).getList(1, 20, { filter });
            results = res.items;
          }

          // Filter results to exclude already selected items
          const filteredResults = results.filter(item => {
            if (type === 'related_publications') {
              return !currentItems.some(existingItem => existingItem.url === item.url);
            }
            return item.id !== excludeId && !currentItems.some(existingItem => existingItem === item.id);
          });

          setSearchResults(filteredResults); // Update search results state
        } catch (error) {
          console.error('Error fetching search results:', error); // Log errors
        } finally {
          setLoading(false); // Set loading state to false after fetching
        }
      } else {
        setSearchResults([]); // Clear search results if query is empty
      }
    };

    fetchData();
  }, [searchQuery, type, currentItems, excludeId]);

  // Handler for updating the search query state
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handler for adding an item to the current context
  const handleAdd = (item) => {
    onAdd([item]);
    onClose(); // Close the modal after adding
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Search {type.replace('_', ' ')}</DialogTitle>
      <DialogContent>
        {/* Input field for entering search query */}
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

