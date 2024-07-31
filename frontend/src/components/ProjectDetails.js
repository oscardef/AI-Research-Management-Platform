import React from 'react';
import { Card, CardContent, Typography, Box, TextField, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * ProjectDescription Component
 * 
 * This component displays and edits the description of a project.
 * 
 * @param {Object} project - The project object containing its details.
 * @param {Function} handleChange - Function to handle changes in the description field.
 * @param {Boolean} editing - Boolean indicating if the component is in editing mode.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ProjectDescription = ({ project, handleChange, editing }) => (
  <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
      {editing ? (
        // When in editing mode, display a TextField to edit the description
        <TextField
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={project.description || ''}
          onChange={handleChange}
          name="description"
        />
      ) : (
        // When not in editing mode, display the description as text
        <Typography variant="body1" paragraph>{project.description}</Typography>
      )}
    </CardContent>
  </Card>
);

/**
 * ProjectDetails Component
 * 
 * This component displays and manages additional details of a project.
 * It provides functionalities for viewing and editing key-value pairs that describe specific details of the project.
 * 
 * @param {Object} project - The project object containing its details.
 * @param {Function} handleChange - Function to handle changes in the detail fields.
 * @param {Boolean} editing - Boolean indicating if the component is in editing mode.
 * @param {Function} handleAddDetail - Function to add a new detail entry.
 * @param {Function} handleRemoveDetail - Function to remove a detail entry.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const ProjectDetails = ({ project, handleChange, editing, handleAddDetail, handleRemoveDetail }) => (
  <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>Details</Typography>
      {editing ? (
        <>
          {/* When in editing mode, display TextFields to edit details */}
          {(project.details || []).map((detail, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <TextField
                variant="outlined"
                label="Detail Key"
                name={`details.${index}.key`}
                value={detail.key}
                onChange={handleChange}
                sx={{ mr: 2 }}
              />
              <TextField
                variant="outlined"
                label="Detail Value"
                name={`details.${index}.value`}
                value={detail.value}
                onChange={handleChange}
              />
              {/* IconButton to remove a detail entry */}
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDetail(index)} sx={{ ml: 2 }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          {/* Button to add a new detail entry */}
          <Button variant="contained" onClick={handleAddDetail} sx={{ mt: 2 }}>
            Add Detail
          </Button>
        </>
      ) : (
        // When not in editing mode, display the details as text
        <Box>
          {(project.details || []).map((detail, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                <strong>{detail.key}:</strong> {detail.value}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);

export { ProjectDescription, ProjectDetails };
