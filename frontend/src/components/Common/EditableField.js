import React from 'react';
import { TextField, Typography } from '@mui/material';

const EditableField = ({ editing, value, onChange, name, label, multiline = false, rows = 1 }) => (
  editing ? (
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
    <Typography variant="body1" paragraph>{value}</Typography>
  )
);

export default EditableField;
