import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Box, Autocomplete, CircularProgress, Typography } from '@mui/material';
import { pb } from '../../services/pocketbaseClient'; 

/**
 * ModelDialog Component
 * 
 * This component provides a modal dialog interface for uploading and configuring new AI models. 
 * It includes fields for model details, performance metrics, hyperparameters, related projects, related models, 
 * collaborators, and tags. Users can also upload a file associated with the model.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Boolean indicating if the dialog is open.
 * @param {function} props.handleClose - Function to handle closing the dialog.
 * @param {function} props.handleCreate - Function to handle creating a new model.
 * @param {Object} props.newModel - The state object containing the new model's data.
 * @param {function} props.setNewModel - Function to update the new model's data.
 * @param {function} props.handleAddPerformanceMetric - Function to add a new performance metric.
 * @param {function} props.handlePerformanceMetricChange - Function to handle changes to performance metrics.
 * @param {function} props.handleAddHyperparameter - Function to add a new hyperparameter.
 * @param {function} props.handleHyperparameterChange - Function to handle changes to hyperparameters.
 * @param {function} props.handleFileChange - Function to handle file selection.
 * @param {string} props.selectedFileName - The name of the selected file.
 * @param {boolean} props.uploading - Boolean indicating if a file is currently being uploaded.
 * @param {Object} props.session - The current user session data.
 * 
 * @returns {React.Element} The rendered ModelDialog component.
 */
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
  session
}) => {
  const [projects, setProjects] = useState([]);
  const [models, setModels] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Fetch projects, models, and users when the dialog opens
  useEffect(() => {
    const fetchProjectsAndModels = async () => {
      try {
        // Fetch public or user-collaborated projects
        const projectsData = await pb.collection('research_projects').getFullList(200, {
          filter: `public=true || collaborators~'${session?.id}'`
        });
        // Fetch public or user-collaborated models
        const modelsData = await pb.collection('models').getFullList(200, {
          filter: `public=true || collaborators~'${session?.id}'`
        });

        setProjects(projectsData);
        setModels(modelsData);
      } catch (error) {
        console.error('Error fetching projects and models:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        // Fetch all users and filter out the current session user
        const usersData = await pb.collection('users').getFullList(200);
        setFilteredUsers(usersData.filter(user => user.id !== session?.id));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (open) {
      fetchProjectsAndModels();
      fetchUsers();
    }
  }, [open, session?.id]);

  // Filter out the current user and already selected collaborators from collaborator options
  const collaboratorOptions = filteredUsers.filter(
    (user) => user.id !== session?.id && !newModel.collaborators.some(collaborator => collaborator.id === user.id)
  );

  // Update the model's collaborators, ensuring the current user is always included
  const handleCollaboratorChange = (event, newValue) => {
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
        {/* Performance metrics input fields */}
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
        {/* Hyperparameters input fields */}
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
        {/* Model status dropdown */}
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
        {/* Autocomplete for related projects */}
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
        {/* Autocomplete for related models */}
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
        {/* Autocomplete for adding collaborators */}
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
        {/* Autocomplete for adding tags */}
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
        {/* File upload button */}
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
        {/* Display selected file name */}
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
