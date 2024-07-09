import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, DialogActions,
  TextField, CircularProgress, MenuItem
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { pb } from '../services/pocketbaseClient';
import { useAuth } from '../context/AuthContext';

const ModelPage = () => {
  const { session } = useAuth();
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedModel, setUpdatedModel] = useState({
    name: '',
    description: '',
    version: '',
    performance_metrics: '',
    collaborators: [],
    status: 'active',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchModel = async () => {
      if (modelId) {
        try {
          const record = await pb.collection('models').getOne(modelId);
          setModel(record);
          setUpdatedModel({
            name: record.name,
            description: record.description,
            version: record.version,
            performance_metrics: record.performance_metrics,
            collaborators: record.collaborators,
            status: record.status,
            tags: Array.isArray(record.tags) ? record.tags.join(', ') : ''
          });
        } catch (error) {
          console.error('Error fetching model:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchModel();
  }, [modelId]);

  const handleChange = (e) => {
    setUpdatedModel({ ...updatedModel, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      setUploading(true);
      console.log("tags: ", updatedModel.tags)
      const updatedRecord = await pb.collection('models').update(modelId, {
        ...updatedModel,
        tags: updatedModel.tags.split(',').map(tag => tag.trim())
      });
      setModel(updatedRecord);
      setEditMode(false);
      setUploading(false);
      alert('Model updated successfully');
    } catch (error) {
      console.error('Error updating model:', error);
      alert(`Error updating model: ${error.message}`);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await pb.collection('models').delete(modelId);
      alert('Model deleted successfully');
      navigate('/models');
    } catch (error) {
      console.error('Error deleting model:', error);
      alert(`Error deleting model: ${error.message}`);
    }
  };

  const handleDeploy = async () => {
    if (model.files && model.files.length > 0) {
      const fileUrl = pb.getFileUrl(model, model.files[0]); // Get the file URL from PocketBase

      const data = {
        project_name: 'ai-research-management-platform',
        deployment_name: model.name,
        deployment_description: model.description,
        deployment_version: model.version,
        deployment_labels: model.tags,
        file_url: fileUrl
      };

      try {
        const response = await axios.post('http://localhost:5000/deploy', data);
        alert(response.data.message);
      } catch (error) {
        console.error('Error deploying model:', error);
        alert(`Error deploying model: ${error.response ? error.response.data.error : error.message}`);
      }
    } else {
      alert('No files available for deployment');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!model) {
    return <Typography>Model not found.</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">Model Details</Typography>
      {editMode ? (
        <>
          <TextField
            autoFocus
            margin="dense"
            label="Model Name"
            name="name"
            fullWidth
            variant="outlined"
            value={updatedModel.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={updatedModel.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Version"
            name="version"
            fullWidth
            variant="outlined"
            value={updatedModel.version}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Performance Metrics"
            name="performance_metrics"
            fullWidth
            variant="outlined"
            value={updatedModel.performance_metrics}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            label="Status"
            name="status"
            fullWidth
            variant="outlined"
            value={updatedModel.status}
            onChange={handleChange}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="complete">Complete</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Tags (comma separated)"
            name="tags"
            fullWidth
            variant="outlined"
            value={updatedModel.tags}
            onChange={handleChange}
          />
          <DialogActions>
            <Button onClick={() => setEditMode(false)} color="primary" disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary" disabled={uploading}>
              {uploading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <Typography variant="h6">Name: {model.name}</Typography>
          <Typography variant="h6">Description: {model.description}</Typography>
          <Typography variant="h6">Version: {model.version}</Typography>
          <Typography variant="h6">Performance Metrics: {model.performance_metrics}</Typography>
          <Typography variant="h6">Status: {model.status}</Typography>
          <Typography variant="h6">Tags: {Array.isArray(model.tags) ? model.tags.join(', ') : model.tags}</Typography>
          <Typography variant="h6">Collaborators: {model.collaborators.join(', ')}</Typography>
          <Button variant="contained" color="primary" onClick={() => setEditMode(true)} sx={{ mt: 2 }}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} sx={{ mt: 2 }}>
            Delete
          </Button>
          <Button variant="contained" color="secondary" onClick={handleDeploy} sx={{ mt: 2 }}>
            Deploy to UbiOps
          </Button>
        </>
      )}
    </Box>
  );
};

export default ModelPage;
