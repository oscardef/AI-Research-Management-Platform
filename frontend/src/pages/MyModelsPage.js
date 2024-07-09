import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { pb } from '../services/pocketbaseClient';

const MyModelsPage = () => {
  const { session } = useAuth();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    version: '',
    performance_metrics: '',
    collaborators: [session?.id || ''],
    file_url: ''
  });
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      if (session) {
        try {
          const records = await pb.collection('models').getFullList(200, {
            filter: `collaborators~'${session.id}'`
          });
          setModels(records || []);
        } catch (error) {
          console.error('Error fetching models:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchModels();
  }, [session]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setNewModel({
      name: '',
      description: '',
      version: '',
      performance_metrics: '',
      collaborators: [session?.id || ''],
      file_url: ''
    });
    setSelectedFile(null);
    setSelectedFileName('');
    setUploading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : '');
  };

  const handleDelete = async (id) => {
    try {
      await pb.collection('models').delete(id);
      setModels(models.filter(model => model.id !== id));
    } catch (error) {
      console.error('Error deleting model:', error);
      alert(`Error deleting model: ${error.message}`);
    }
  };

  const onSubmit = async (data) => {
    if (selectedFile && session) {
      const userId = session.user.id;
      const fileName = `${Date.now()}_${selectedFile.name}`;

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const record = await pb.collection('models').create({
          ...data,
          collaborators: [userId],
          file_url: fileName
        }, formData);

        setModels(prevModels => [...prevModels, record]);
        handleClose();
      } catch (error) {
        console.error('Error creating model:', error);
        alert(`Error creating model: ${error.message}`);
        setUploading(false);
      }
    } else {
      alert('Please select a file to upload');
    }
  };

  const handleDeploy = async (model) => {
    alert(`Deploying model: ${model.name}`);
  };

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 2) {
      const results = await pb.collection('models').getFullList(200, {
        filter: `name~'${e.target.value}'`
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddResult = (result) => {
    setNewModel({ ...newModel, related_models: [...newModel.related_models, result.id] });
    handleSearchClose();
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">My Models</Typography>
      <Button variant="contained" color="success" onClick={handleOpen} sx={{ mb: 2 }}>
        Upload New Model
      </Button>
      {models.length === 0 ? (
        <Typography>No models found.</Typography>
      ) : (
        <List>
          {models.map((model) => (
            <ListItem key={model.id} component={Link} to={`/model/${model.id}`}>
              <ListItemText
                primary={model.name}
                secondary={`Version: ${model.version} | Metrics: ${model.performance_metrics}`}
              />
              <IconButton onClick={() => handleDeploy(model)}>
                <AddIcon color="primary" />
              </IconButton>
              <IconButton onClick={() => handleDelete(model.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload New Model</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              autoFocus
              margin="dense"
              label="Model Name"
              name="name"
              fullWidth
              variant="outlined"
              value={newModel.name}
              onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
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
            />
            <TextField
              margin="dense"
              label="Version"
              name="version"
              fullWidth
              variant="outlined"
              value={newModel.version}
              onChange={(e) => setNewModel({ ...newModel, version: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Performance Metrics"
              name="performance_metrics"
              fullWidth
              variant="outlined"
              value={newModel.performance_metrics}
              onChange={(e) => setNewModel({ ...newModel, performance_metrics: e.target.value })}
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
            <DialogActions>
              <Button onClick={handleClose} color="primary" disabled={uploading}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={uploading}>
                {uploading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={searchOpen} onClose={handleSearchClose}>
        <DialogTitle>Search Models</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <List>
            {searchResults.map((result, index) => (
              <ListItem button key={index} onClick={() => handleAddResult(result)}>
                <ListItemText
                  primary={result.name}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyModelsPage;
