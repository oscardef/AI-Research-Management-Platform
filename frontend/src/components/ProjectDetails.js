import React from 'react';
import { Card, CardContent, Typography, Box, TextField, Button } from '@mui/material';

const ProjectDescription = ({ project, handleChange, editing }) => (
  <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
      {editing ? (
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
        <Typography variant="body1" paragraph>{project.description}</Typography>
      )}
    </CardContent>
  </Card>
);

const ProjectDetails = ({ project, handleChange, editing, handleAddDetail }) => (
  <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 1 }}>Details</Typography>
      {editing ? (
        <>
          {project.details?.map((detail, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2 }}>
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
            </Box>
          ))}
          <Button variant="contained" onClick={handleAddDetail} sx={{ mt: 2 }}>
            Add Detail
          </Button>
        </>
      ) : (
        <Box>
          {Array.isArray(project.details) && project.details.map((detail, index) => (
            <Typography key={index} variant="body1" paragraph>{`${detail.key}: ${detail.value}`}</Typography>
          ))}
        </Box>
      )}
    </CardContent>
  </Card>
);

export { ProjectDescription, ProjectDetails };
