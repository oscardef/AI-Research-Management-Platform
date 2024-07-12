import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Card, CardContent, CardActions, Grid, Divider, CircularProgress, IconButton, Chip, Dialog, DialogContent, DialogTitle, DialogActions, Radio, RadioGroup, FormControlLabel
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

const ModelPage = () => {
  const { session } = useAuth();
  const { modelId } = useParams();
  const navigate = useNavigate();
  const {
    model,
    loading,
    relatedProjects,
    relatedModels,
    collaborators,
    setModel,
    fetchModel
  } = useModel(modelId);

  const [editMode, setEditMode] = useState(false);
  const [tempModel, setTempModel] = useState({
    name: '',
    description: '',
    version: '',
    performance_metrics: [],
    collaborators: [],
    status: 'active',
    tags: [],
    related_projects: [],
    related_models: []
  });
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [deployData, setDeployData] = useState({
    file_url: ''
  });
  const [deployLoading, setDeployLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    if (!editMode) {
      setTempModel({ ...model });
    }
  }, [editMode, model]);

  const handleChange = (e) => {
    setTempModel({ ...tempModel, [e.target.name]: e.target.value });
  };

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

  const handleDelete = async () => {
    try {
      await pb.collection('models').delete(modelId);
      navigate('/models');
    } catch (error) {
      console.error('Error deleting model:', error);
      alert(`Error deleting model: ${error.message}`);
    }
  };

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

  const handleDeployOpen = () => {
    setDeployOpen(true);
  };

  const handleDeployClose = () => {
    setDeployOpen(false);
    setDeployData({
      file_url: ''
    });
  };

  const handleFileSelect = (e) => {
    setDeployData({ ...deployData, file_url: e.target.value });
  };

  const handleAddTag = (tag) => {
    setTempModel(prevState => ({
      ...prevState,
      tags: [...(prevState.tags || []), tag]
    }));
  };

  const handleRemoveTag = (tag) => {
    setTempModel(prevState => ({
      ...prevState,
      tags: prevState.tags.filter(t => t !== tag)
    }));
  };

  const handleAddPerformanceMetric = () => {
    setTempModel(prevState => ({
      ...prevState,
      performance_metrics: [...prevState.performance_metrics, { key: '', value: '' }]
    }));
  };

  const handleRemovePerformanceMetric = (index) => {
    setTempModel(prevState => ({
      ...prevState,
      performance_metrics: prevState.performance_metrics.filter((_, i) => i !== index)
    }));
  };

  const handlePerformanceMetricChange = (e, index) => {
    const { name, value } = e.target;
    setTempModel(prevState => {
      const updatedMetrics = [...prevState.performance_metrics];
      updatedMetrics[index][name] = value;
      return { ...prevState, performance_metrics: updatedMetrics };
    });
  };

  const handleAddCollaborator = (collaborator) => {
    setTempModel(prevState => ({
      ...prevState,
      collaborators: [...prevState.collaborators, collaborator[0].id]
    }));
  };

  const handleRemoveCollaborator = (id) => {
    setTempModel(prevState => ({
      ...prevState,
      collaborators: prevState.collaborators.filter(collabId => collabId !== id)
    }));
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNavigation = async (id, type) => {
    navigate(type === 'project' ? `/research/${id}` : `/model/${id}`);
  };

  const handleAdd = (items) => {
    setTempModel(prevState => {
      let updatedField = [...new Set([...(prevState[modalType] || []), ...items.map(item => item.id)])];
      return { ...prevState, [modalType]: updatedField };
    });
  };

  const handleRemoveRelatedItem = (type, id) => {
    setTempModel(prevState => {
      const updatedField = prevState[type].filter(item => item !== id);
      return { ...prevState, [type]: updatedField };
    });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!model) {
    return <Typography>Model not found.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
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
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Status</Typography>
                  <StatusBox status={tempModel.status} handleChange={handleChange} editing={editMode} />
                </CardContent>
              </Card>
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
              <ModelCollaborators
                collaborators={collaborators}
                model={tempModel}
                getProfilePictureUrl={(collaborator) => collaborator.profile_picture ? `http://127.0.0.1:8090/api/files/_pb_users_auth_/${collaborator.id}/${collaborator.profile_picture}` : ''}
                editing={editMode}
                handleRemoveCollaborator={handleRemoveCollaborator}
                openModal={openModal}
                navigate={navigate}
              />
              <RelatedItemsModel
                relatedProjects={relatedProjects}
                relatedModels={relatedModels}
                editing={editMode}
                handleNavigation={handleNavigation}
                openModal={openModal}
                handleRemoveRelatedItem={handleRemoveRelatedItem}
                tempModel={tempModel}
              />
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
              <Button variant="contained" color="secondary" onClick={() => setEditMode(false)} disabled={uploading}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                Edit Page
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="contained" color="secondary" onClick={handleDeployOpen}>
                Deploy to UbiOps
              </Button>
            </>
          )}
        </CardActions>
      </Card>

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
