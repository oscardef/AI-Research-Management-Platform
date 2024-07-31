import React from 'react';
import { Box, TextField, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * EditableList Component
 * 
 * This component renders a list of items that can be edited, added to, or removed from.
 * It provides an interface for displaying a list of key-value pairs, with options for editing
 * each pair, deleting pairs, and adding new pairs.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.items - The list of items to display. Each item should be an object with 'key' and 'value' properties.
 * @param {function} props.onChange - Callback function to handle changes to the items.
 * @param {function} props.onAdd - Callback function to handle adding a new item to the list.
 * @param {function} props.onDelete - Callback function to handle deleting an item from the list.
 * @param {boolean} props.editing - Indicates if the list is in editing mode.
 * @param {Object} props.labels - Labels for the TextField components, should contain 'key' and 'value' properties.
 * 
 * @returns {React.Element} The rendered EditableList component.
 */
const EditableList = ({ items, onChange, onAdd, onDelete, editing, labels }) => (
  <Box>
    {items.map((item, index) => (
      <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
        {/* TextField for the 'key' of the item */}
        <TextField
          variant="outlined"
          label={labels.key} // Label for the key TextField
          name={`details.${index}.key`} // Name attribute for form handling
          value={item.key} // The current value of the key
          onChange={onChange} // Function to call when the key value changes
          sx={{ mr: 2 }}
        />
        {/* TextField for the 'value' of the item */}
        <TextField
          variant="outlined"
          label={labels.value} // Label for the value TextField
          name={`details.${index}.value`} // Name attribute for form handling
          value={item.value} // The current value of the value
          onChange={onChange} // Function to call when the value changes
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
