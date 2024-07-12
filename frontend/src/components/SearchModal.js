import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, CircularProgress, Typography, IconButton, Divider } from '@mui/material';
import useSearch from '../hooks/useSearch';
import DeleteIcon from '@mui/icons-material/Delete';

const SearchModal = ({ open, onClose, onAdd, type, currentItems }) => {
  const { searchTerm, setSearchTerm, searchResults, loading, handleSearch } = useSearch(type);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems([]); // Clear selected items when modal opens
  }, [open]);

  const handleAdd = (item) => {
    if (!selectedItems.some(selectedItem => selectedItem.url === item.url)) {
      setSelectedItems(prevItems => [...prevItems, item]);
    }
  };

  const handleRemove = (item) => {
    setSelectedItems(prevItems => prevItems.filter(i => i.url !== item.url));
  };

  const handleSave = () => {
    const itemsToAdd = selectedItems.map(item => {
      if (type === 'related_publications') {
        return {
          title: item.title,
          url: item.url,
          journal: item.journal,
          author: item.author,
        };
      }
      return item;
    });
    onAdd(itemsToAdd); // Save the selected items
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add {type.replace('_', ' ')}</DialogTitle>
      <DialogContent>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading} fullWidth sx={{ mb: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
        <List>
          {searchResults
            .filter(result => !currentItems.some(item => item.url === result.url))
            .map((result, index) => (
              <ListItem key={index} button onClick={() => handleAdd(result)}>
                <ListItemText
                  primary={result.title || result.name}
                  secondary={result.description || result.journal}
                />
              </ListItem>
            ))}
        </List>
        <Typography variant="h6">Selected Items:</Typography>
        <List>
          {selectedItems.map((item, index) => (
            <ListItem key={index} secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemove(item)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={item.title || item.name} secondary={item.description} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchModal;
