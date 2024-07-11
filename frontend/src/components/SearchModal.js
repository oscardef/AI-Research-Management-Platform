import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { pb } from '../services/pocketbaseClient';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const SearchModal = ({ open, onClose, onAdd, onRemove, type, currentItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) return;

      try {
        let items = [];
        if (type === 'collaborators') {
          const response = await pb.collection('users').getList(1, 10, {
            filter: `name ~ "${searchTerm}"`,
          });
          items = response.items;
        } else {
          const response = await pb.collection(type).getList(1, 10, {
            filter: `title ~ "${searchTerm}" || name ~ "${searchTerm}"`,
          });
          items = response.items;
        }
        setResults(items);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [searchTerm, type]);

  const handleAdd = (item) => {
    onAdd(item);
  };

  const handleRemove = (item) => {
    onRemove(item);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, maxWidth: 600, mx: 'auto', my: '10%' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <List>
          {results.map((item) => (
            <ListItem key={item.id} secondaryAction={
              currentItems.find(i => i.id === item.id) ? (
                <IconButton edge="end" aria-label="remove" onClick={() => handleRemove(item)}>
                  <RemoveIcon />
                </IconButton>
              ) : (
                <IconButton edge="end" aria-label="add" onClick={() => handleAdd(item)}>
                  <AddIcon />
                </IconButton>
              )
            }>
              <ListItemText primary={item.name || item.title} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>
  );
};

export default SearchModal;
