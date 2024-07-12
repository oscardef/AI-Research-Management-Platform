import React from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditableField from './Common/EditableField';
import EditableList from './Common/EditableList';

const ProjectDescription = ({ project, handleChange, editing }) => (
  <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
      <EditableField
        editing={editing}
        value={project.description || ''}
        onChange={handleChange}
        name="description"
        multiline
        rows={4}
      />
    </CardContent>
  </Card>
);

const ProjectDetails = ({ project, handleChange, editing, handleAddDetail, handleRemoveDetail }) => (
  <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>Details</Typography>
      <EditableList
        items={project.details || []}
        onChange={handleChange}
        onAdd={handleAddDetail}
        onDelete={handleRemoveDetail}
        editing={editing}
        labels={{ key: 'Detail Key', value: 'Detail Value' }}
      />
    </CardContent>
  </Card>
);

export { ProjectDescription, ProjectDetails };
