import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Card, CardContent, CardActions, Grid, Divider, CircularProgress, IconButton, Chip, Dialog, DialogContent, DialogTitle, DialogActions, Radio, RadioGroup, FormControlLabel, Switch, ListItem, List, ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { pb } from '../services/pocketbaseClient';
import { useAuth } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchModal from '../components/Common/SearchModal';
import ModelCollaborators from '../components/ModelCollaborators';
import RelatedItemsModel from '../components/RelatedItemsModel';
import StatusBox from '../components/StatusBox';
import useModel from '../hooks/useModel';

/**
 * ModelPage component displays detailed information about a specific AI model.
 * It allows users to view and edit the model details, manage related projects and models, 
 * handle model deployment, and update the model's status, tags, collaborators, and files.
 */
const ModelPage = () => {
  const { session } = useAuth(); // Get the current session from the AuthContext
  const { modelId } = useParams(); // Extract modelId from URL parameters
  const navigate = useNavigate(); // Hook to navigate programmatically
  const {
    model, loading, relatedProjects, relatedModels, collaborators, setModel, fetchModel
  } = useModel(modelId); // Custom hook to manage model data

  const [editMode, setEditMode] = useState(false); // State for toggling edit mode
  const [tempModel, setTempModel] = useState({
    name: '',
    description: '',
    version: '',
    performance_metrics: [],
    collaborators: [],
    status: 'active',
    tags: [],
    related_projects: [],
    related_models: [],
    data_sources: [],
    hyperparameters: [],
    files: []
  }); // Temporary state for model data when editing
  const [newTag, setNewTag] = useState(''); // State for new tag input
  const [uploading, setUploading] = useState(false); // State for file upload progress
  const [deployOpen, setDeployOpen] = useState(false); // State for deployment dialog visibility
  const [deployData, setDeployData] = useState({ file_url: '' }); // State for deployment data
  const [deployLoading, setDeployLoading] = useState(false); // State for deployment loading
  const [modalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [modalType, setModalType] = useState(''); // State for modal type

  // Update temporary model data when editMode or model changes
  useEffect(() => {
    if (!editMode) {
      setTempModel({ ...model });
    }
  }, [editMode, model]);

  // Handle input changes for model fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setTempModel({ ...tempModel, [name]: newValue });
  };

  // Save changes made to the model
  const handleSaveChanges = async () => {
    try {
      setUploading(true);
      const updatedRecord = await pb.collection('models').update(modelId, {
        ...tempModel,
        tags: tempModel.tags.map(tag => tag.trim())
      });
      setModel(updatedRecord);
      setEditMode(false);
      setUploading(false);
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error updating model:', error);
      alert(`Error updating model: ${error.message}`);
      setUploading(false);
    }
  };

  // Handle the deployment of the model
  const handleDeploy = async () => {
    if (model.files && model.files.length > 0) {
      const fileUrl = pb.getFileUrl(model, deployData.file_url); // Get the file URL from PocketBase
      setDeployLoading(true);
      const data = {
        project_name: 'ai-research-management-platform',
        deployment_name: model.name.replace(/[^a-z0-9-]/gi, '').toLowerCase(),
        deployment_description: model.description,
        deployment_version: model.version,
        file_url: fileUrl
      };

      try {
        const response = await axios.post('http://localhost:5000/deploy', data);
        alert(response.data.message);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          const override = window.confirm('Deployment already exists. Do you want to override it?');
          if (override) {
            try {
              const response = await axios.post('http://localhost:5000/override_deployment', data);
              alert(response.data.message);
            } catch (overrideError) {
              console.error('Error overriding deployment:', overrideError);
              alert(`Error overriding deployment: ${overrideError.response ? overrideError.response.data.error : overrideError.message}`);
            }
          }
        } else {
          console.error('Error deploying model:', error);
          alert(`Error deploying model: ${error.response ? error.response.data.error : error.message}`);
        }
      } finally {
        setDeployLoading(false);
        handleDeployClose();
      }
    } else {
      alert('No files available for deployment');
    }
  };

  // Open the deployment dialog
  const handleDeployOpen = () => {
    setDeployOpen(true);
  };

  // Close the deployment dialog
  const handleDeployClose = () => {
    setDeployOpen(false);
    setDeployData({
      file_url: ''
    });
  };

  // Handle selection of a file for deployment
  const handleFileSelect = (e) => {
    setDeployData({ ...deployData, file_url: e.target.value });
  };

  // Add a new tag to the model
  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setTempModel(prevState => ({
        ...prevState,
        tags: [...(prevState.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove a tag from the model
  const handleRemoveTag = (tag) => {
    setTempModel(prevState => ({
      ...prevState,
      tags: prevState.tags.filter(t => t !== tag)
    }));
  };

  // Add a new performance metric
  const handleAddPerformanceMetric = () => {
    setTempModel(prevState => ({
      ...prevState,
      performance_metrics: [...prevState.performance_metrics, { key: '', value: '' }]
    }));
  };

  // Remove a performance metric
  const handleRemovePerformanceMetric = (index) => {
    setTempModel(prevState => ({
      ...prevState,
      performance_metrics: prevState.performance_metrics.filter((_, i) => i !== index)
    }));
  };

  // Handle changes to performance metrics
  const handlePerformanceMetricChange = (e, index) => {
    const { name, value } = e.target;
    setTempModel(prevState => {
      const updatedMetrics = [...prevState.performance_metrics];
      updatedMetrics[index][name] = value;
      return { ...prevState, performance_metrics: updatedMetrics };
    });
  };

  // Add a new data source
  const handleAddDataSource = () => {
    setTempModel(prevState => ({
      ...prevState,
      data_sources: [...prevState.data_sources, { key: '', value: '' }]
    }));
  };

  // Remove a data source
  const handleRemoveDataSource = (index) => {
    setTempModel(prevState => ({
      ...prevState,
      data_sources: prevState.data_sources.filter((_, i) => i !== index)
    }));
  };

  // Handle changes to data sources
  const handleDataSourceChange = (e, index) => {
    const { name, value } = e.target;
    setTempModel(prevState => {
      const updatedSources = [...prevState.data_sources];
      updatedSources[index][name] = value;
      return { ...prevState, data_sources: updatedSources };
    });
  };

  // Add a new hyperparameter
  const handleAddHyperparameter = () => {
    setTempModel(prevState => ({
      ...prevState,
      hyperparameters: [...prevState.hyperparameters, { key: '', value: '' }]
    }));
  };

  // Remove a hyperparameter
  const handleRemoveHyperparameter = (index) => {
    setTempModel(prevState => ({
      ...prevState,
      hyperparameters: prevState.hyperparameters.filter((_, i) => i !== index)
    }));
  };

  // Handle changes to hyperparameters
  const handleHyperparameterChange = (e, index) => {
    const { name, value } = e.target;
    setTempModel(prevState => {
      const updatedParams = [...prevState.hyperparameters];
      updatedParams[index][name] = value;
      return { ...prevState, hyperparameters: updatedParams };
    });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = file.name;

    if (!tempModel.files.includes(fileName)) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await pb.collection('models').update(modelId, formData);

        setTempModel(prevState => ({
          ...prevState,
          files: [...prevState.files, fileName]
        }));
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    } else {
      console.log('File already exists in the database.');
    }
  };

  // Remove a file from the model
  const handleFileRemove = (fileName) => {
    try {
      setTempModel(prevState => ({
        ...prevState,
        files: prevState.files.filter(file => file !== fileName)
      }));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  // Add a new collaborator
  const handleAddCollaborator = (collaborator) => {
    setTempModel(prevState => ({
      ...prevState,
      collaborators: [...prevState.collaborators, collaborator[0].id]
    }));
  };

  // Remove a collaborator
  const handleRemoveCollaborator = (id) => {
    setTempModel(prevState => ({
      ...prevState,
      collaborators: prevState.collaborators.filter(collabId => collabId !== id)
    }));
  };

  // Open a modal for adding related items
  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // Handle navigation to a related project or model
  const handleNavigation = async (id, type) => {
    navigate(type === 'project' ? `/research/${id}` : `/model/${id}`);
  };

  // Add items to the temporary model data
  const handleAdd = (items) => {
    setTempModel(prevState => {
      let updatedField = [...new Set([...(prevState[modalType] || []), ...items.map(item => item.id)])];
      return { ...prevState, [modalType]: updatedField };
    });
  };

  // Remove a related item
  const handleRemoveRelatedItem = (type, id) => {
    setTempModel(prevState => {
      const updatedField = prevState[type].filter(item => item !== id);
      return { ...prevState, [type]: updatedField };
    });
  };

  // Render loading state
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // Render model not found state
  if (!model) {
    return <Typography>Model not found.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Modal for searching and adding related items */}
      <SearchModal
        open={modalOpen}
        onClose={closeModal}
        onAdd={handleAdd}
        type={modalType}
        currentItems={tempModel[modalType] || []}
        excludeId={modelId}
      />
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          {/* Model name field */}
          <Typography variant="h4" align="center" gutterBottom>
            {editMode ? (
              <TextField
                variant="outlined"
                fullWidth
                value={tempModel.name || ''}
                onChange={handleChange}
                name="name"
              />
            ) : (
              model.name
            )}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              {/* Model description field */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
                  {editMode ? (
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={tempModel.description || ''}
                      onChange={handleChange}
                      name="description"
                    />
                  ) : (
                    <Typography variant="body1" paragraph>{model.description}</Typography>
                  )}
                </CardContent>
              </Card>
              {/* Model version field */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Version</Typography>
                  {editMode ? (
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={tempModel.version || ''}
                      onChange={handleChange}
                      name="version"
                    />
                  ) : (
                    <Typography variant="body1" paragraph>{model.version}</Typography>
                  )}
                </CardContent>
              </Card>
              {/* Performance metrics management */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Performance Metrics</Typography>
                  {editMode ? (
                    <>
                      {tempModel.performance_metrics.map((metric, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                          <TextField
                            variant="outlined"
                            label="Metric Key"
                            name="key"
                            value={metric.key}
                            onChange={(e) => handlePerformanceMetricChange(e, index)}
                            sx={{ mr: 2 }}
                          />
                          <TextField
                            variant="outlined"
                            label="Metric Value"
                            name="value"
                            value={metric.value}
                            onChange={(e) => handlePerformanceMetricChange(e, index)}
                          />
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePerformanceMetric(index)} sx={{ ml: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button variant="contained" onClick={handleAddPerformanceMetric} sx={{ mt: 2 }}>
                        Add Metric
                      </Button>
                    </>
                  ) : (
                    <Box>
                      {model.performance_metrics.map((metric, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ mr: 2 }}>
                            <strong>{metric.key}:</strong> {metric.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
              {/* Hyperparameters management */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Hyperparameters</Typography>
                  {editMode ? (
                    <>
                      {tempModel.hyperparameters.map((param, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                          <TextField
                            variant="outlined"
                            label="Parameter Key"
                            name="key"
                            value={param.key}
                            onChange={(e) => handleHyperparameterChange(e, index)}
                            sx={{ mr: 2 }}
                          />
                          <TextField
                            variant="outlined"
                            label="Parameter Value"
                            name="value"
                            value={param.value}
                            onChange={(e) => handleHyperparameterChange(e, index)}
                          />
                          <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveHyperparameter(index)} sx={{ ml: 2 }}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button variant="contained" onClick={handleAddHyperparameter} sx={{ mt: 2 }}>
                        Add Parameter
                      </Button>
                    </>
                  ) : (
                    <Box>
                      {model.hyperparameters.map((param, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ mr: 2 }}>
                            <strong>{param.key}:</strong> {param.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
              {/* File management for model */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Files</Typography>
                  {editMode ? (
                    <>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                      />
                      <List>
                        {tempModel.files.map((file, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={file} />
                            <IconButton edge="end" aria-label="delete" onClick={() => handleFileRemove(file)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        ))}
                      </List>
                    </>
                  ) : (
                    <List>
                      {model.files.map((file, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={file} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              {/* Status management */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Status</Typography>
                  <StatusBox status={tempModel.status} handleChange={handleChange} editing={editMode} />
                </CardContent>
              </Card>
              {/* Tags management */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
                  <Box>
                    {Array.isArray(tempModel.tags) && tempModel.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        sx={{ mr: 1, mb: 1, bgcolor: 'primary.main', color: 'white' }}
                        onDelete={editMode ? () => handleRemoveTag(tag) : undefined}
                      />
                    ))}
                    {editMode && (
                      <Box sx={{ display: 'flex', mt: 2 }}>
                        <TextField
                          variant="outlined"
                          label="New Tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          sx={{ mr: 2 }}
                        />
                        <Button variant="contained" onClick={handleAddTag}>
                          Add Tag
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
              {/* Collaborators management */}
              <ModelCollaborators
                collaborators={collaborators}
                model={tempModel}
                getProfilePictureUrl={(collaborator) => collaborator.profile_picture ? `http://127.0.0.1:8090/api/files/_pb_users_auth_/${collaborator.id}/${collaborator.profile_picture}` : ''}
                editing={editMode}
                handleRemoveCollaborator={handleRemoveCollaborator}
                openModal={openModal}
                navigate={navigate}
              />
              {/* Related projects and models management */}
              <RelatedItemsModel
                relatedProjects={relatedProjects}
                relatedModels={relatedModels}
                editing={editMode}
                handleNavigation={handleNavigation}
                openModal={openModal}
                handleRemoveRelatedItem={handleRemoveRelatedItem}
                tempModel={tempModel}
              />
              {/* Visibility management */}
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Visibility</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tempModel.public}
                        onChange={(e) => handleChange({ target: { name: 'public', value: e.target.checked, type: 'checkbox' } })}
                        name="public"
                        color="primary"
                      />
                    }
                    label={tempModel.public ? 'Public' : 'Private'}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'center', p: 2 }}>
          {editMode ? (
            <>
              <Button variant="contained" color="primary" onClick={handleSaveChanges} disabled={uploading}>
                {uploading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button variant="contained" color='primary' onClick={() => setEditMode(false)} disabled={uploading}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Edit Page
              </Button>
              <Button variant="contained" color="secondary" onClick={handleDeployOpen}>
                Deploy to UbiOps
              </Button>
            </>
          )}
        </CardActions>
      </Card>

      {/* Dialog for deployment */}
      <Dialog open={deployOpen} onClose={handleDeployClose}>
        <DialogTitle>Deploy to UbiOps</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Version: {model.version}</Typography>
          <RadioGroup name="file_url" value={deployData.file_url} onChange={handleFileSelect}>
            {model.files.map((file, index) => (
              <FormControlLabel key={index} value={file} control={<Radio />} label={file} />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeployClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeploy} color="primary" disabled={deployLoading}>
            {deployLoading ? <CircularProgress size={24} /> : 'Deploy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModelPage;
