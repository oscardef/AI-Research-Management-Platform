import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, CircularProgress, Typography, IconButton } from '@mui/material';
import useSearch from '../hooks/useSearch';
import DeleteIcon from '@mui/icons-material/Delete';

const SearchModal = ({ open, onClose, onSave, type, initialItems }) => {
  const { searchTerm, setSearchTerm, searchResults, loading, handleSearch } = useSearch(type);
  const [selectedItems, setSelectedItems] = useState(initialItems || []);

  useEffect(() => {
    setSelectedItems(initialItems || []);
  }, [initialItems]);

  const handleAdd = (item) => {
    if (!selectedItems.some(selectedItem => selectedItem.id === item.id)) {
      setSelectedItems(prevItems => [...prevItems, item]);
    }
  };

  const handleRemove = (item) => {
    setSelectedItems(prevItems => prevItems.filter(i => i.id !== item.id));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(selectedItems);
    }
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
        <Button variant="contained" onClick={handleSearch} disabled={loading} sx={{ mb: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
        <List>
          {searchResults.map((result, index) => (
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
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchModal;
