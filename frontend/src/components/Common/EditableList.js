import React from 'react';
import { Box, TextField, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EditableList = ({ items, onChange, onAdd, onDelete, editing, labels }) => (
  <Box>
    {items.map((item, index) => (
      <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
        <TextField
          variant="outlined"
          label={labels.key}
          name={`details.${index}.key`}
          value={item.key}
          onChange={onChange}
          sx={{ mr: 2 }}
        />
        <TextField
          variant="outlined"
          label={labels.value}
          name={`details.${index}.value`}
          value={item.value}
          onChange={onChange}
        />
        {editing && (
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(index)} sx={{ ml: 2 }}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    ))}
    {editing && (
      <Button variant="contained" onClick={onAdd} sx={{ mt: 2 }}>
        Add Item
      </Button>
    )}
  </Box>
);

export default EditableList;
