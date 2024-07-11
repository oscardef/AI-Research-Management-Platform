import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Box, Autocomplete, CircularProgress, Typography } from '@mui/material';

const ModelDialog = ({ 
  open, 
  handleClose, 
  handleCreate, 
  newModel, 
  setNewModel, 
  handleAddPerformanceMetric, 
  handlePerformanceMetricChange, 
  handleAddHyperparameter, 
  handleHyperparameterChange, 
  handleFileChange, 
  selectedFileName, 
  uploading, 
  projects, 
  models, 
  filteredUsers,
  session 
}) => {
  // Filter out the authenticated user and already selected collaborators
  const collaboratorOptions = filteredUsers.filter(
    (user) => user.id !== session?.id && !newModel.collaborators.some(collaborator => collaborator.id === user.id)
  );

  const handleCollaboratorChange = (event, newValue) => {
    // Ensure the authenticated user is always in the list
    const filteredNewValue = newValue.filter(collaborator => collaborator.id !== session?.id);
    setNewModel({ ...newModel, collaborators: [{ id: session?.id, name: session?.name }, ...filteredNewValue] });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Upload New Model</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Model Name"
          name="name"
          fullWidth
          variant="outlined"
          value={newModel.name}
          onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={newModel.description}
          onChange={(e) => setNewModel({ ...newModel, description: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Version"
          name="version"
          fullWidth
          variant="outlined"
          value={newModel.version}
          onChange={(e) => setNewModel({ ...newModel, version: e.target.value })}
          sx={{ mb: 2 }}
        />
        {newModel.performance_metrics.map((metric, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="Metric Key"
              value={metric.key}
              onChange={(e) => handlePerformanceMetricChange(index, 'key', e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label="Metric Value"
              value={metric.value}
              onChange={(e) => handlePerformanceMetricChange(index, 'value', e.target.value)}
              sx={{ mr: 1 }}
            />
          </Box>
        ))}
        <Button
          variant="contained"
          onClick={handleAddPerformanceMetric}
          sx={{ mb: 2 }}
        >
          Add Performance Metric
        </Button>
        {newModel.hyperparameters.map((param, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="Parameter Key"
              value={param.key}
              onChange={(e) => handleHyperparameterChange(index, 'key', e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label="Parameter Value"
              value={param.value}
              onChange={(e) => handleHyperparameterChange(index, 'value', e.target.value)}
              sx={{ mr: 1 }}
            />
          </Box>
        ))}
        <Button
          variant="contained"
          onClick={handleAddHyperparameter}
          sx={{ mb: 2 }}
        >
          Add Hyperparameter
        </Button>
        <TextField
          select
          margin="dense"
          label="Status"
          name="status"
          fullWidth
          variant="outlined"
          value={newModel.status}
          onChange={(e) => setNewModel({ ...newModel, status: e.target.value })}
          sx={{ mb: 2 }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="complete">Complete</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>
        <Autocomplete
          multiple
          options={projects}
          getOptionLabel={(option) => option.title}
          value={newModel.related_projects}
          onChange={(event, newValue) => setNewModel({ ...newModel, related_projects: newValue })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Related Projects" placeholder="Select Projects" />
          )}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          options={models}
          getOptionLabel={(option) => option.name}
          value={newModel.related_models}
          onChange={(event, newValue) => setNewModel({ ...newModel, related_models: newValue })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Related Models" placeholder="Select Models" />
          )}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          options={collaboratorOptions}
          getOptionLabel={(option) => option.name}
          value={newModel.collaborators.filter(collaborator => collaborator.id !== session?.id)}
          onChange={handleCollaboratorChange}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Collaborators" placeholder="Add Collaborators" />
          )}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={newModel.tags}
          onChange={(event, newValue) => setNewModel({ ...newModel, tags: newValue })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Tags" placeholder="Add Tags" />
          )}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          component="label"
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {selectedFileName && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {selectedFileName}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={uploading}>
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelDialog;
