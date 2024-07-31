import React from 'react';
import { TextField, Typography } from '@mui/material';

/**
 * EditableField Component
 * 
 * This component renders a text field that can switch between an editable 
 * TextField and a static Typography display based on the 'editing' prop.
 * It is designed to allow users to either view the content as text or 
 * edit the content using an input field.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.editing - Determines whether the field is in editing mode.
 * @param {string} props.value - The current value of the field.
 * @param {function} props.onChange - Callback function to handle changes in the input.
 * @param {string} props.name - The name attribute for the input field.
 * @param {string} props.label - The label text for the input field when in editing mode.
 * @param {boolean} [props.multiline=false] - If true, the TextField will allow multiple lines of input.
 * @param {number} [props.rows=1] - The number of rows to display if the TextField is multiline.
 * 
 * @returns {React.Element} The rendered EditableField component.
 */
const EditableField = ({ editing, value, onChange, name, label, multiline = false, rows = 1 }) => (
  editing ? (
    // If editing is true, render a TextField to allow input.
    <TextField
      variant="outlined"
      fullWidth
      multiline={multiline}
      rows={rows}
      value={value}
      onChange={onChange}
      name={name}
      label={label}
    />
  ) : (
    // If not editing, render a Typography component to display the value as plain text.
    <Typography variant="body1" paragraph>{value}</Typography>
  )
);

export default EditableField;
