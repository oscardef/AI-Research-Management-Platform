import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, IconButton
} from '@mui/material';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';

const MyModelsPage = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .contains('collaborators', [user.id]);

        if (error) {
          console.error('Error fetching models:', error);
        } else {
          setModels(data);
        }
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDelete = async (id) => {
    const { data, error } = await supabase
      .from('models')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting model:', error);
      alert(`Error deleting model: ${error.message}`);
    } else {
      setModels(models.filter(model => model.id !== id));
    }
  };

  const onSubmit = async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (selectedFile && user) {
      const folderPath = `${user.id}`;
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const filePath = `${folderPath}/${fileName}`;

      // Upload the actual file
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('model-files')
        .upload(filePath, selectedFile);

      if (fileError) {
        console.error('Error uploading file:', fileError);
        alert(`Error uploading file: ${fileError.message}`);
      } else if (fileData) {
        const { data: modelData, error: modelError } = await supabase
          .from('models')
          .insert({
            user_id: user.id,
            name: data.name,
            description: data.description,
            version: data.version,
            performance_metrics: data.performance_metrics,
            file_url: filePath,
            created_at: new Date().toISOString()
          })
          .select(); // Make sure to select the inserted data

        if (modelError) {
          console.error('Error creating model:', modelError);
          alert(`Error creating model: ${modelError.message}`);
        } else if (modelData && modelData.length > 0) {
          setModels([...models, modelData[0]]);
          handleClose();
        }
      }
    } else {
      alert('Please select a file to upload');
    }
  };

  const handleDeploy = async (model) => {
    // Implement deployment logic to UBbiOps here
    alert(`Deploying model: ${model.name}`);
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
      <List>
        {models.map((model) => (
          <ListItem key={model.id}>
            <ListItemText
              primary={model.name}
              secondary={`Version: ${model.version} | Metrics: ${model.performance_metrics}`}
              component={Link} to={`/model/${model.id}`}
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
              {...register('name', { required: true })}
            />
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              variant="outlined"
              {...register('description', { required: true })}
            />
            <TextField
              margin="dense"
              label="Version"
              name="version"
              fullWidth
              variant="outlined"
              {...register('version', { required: true })}
            />
            <TextField
              margin="dense"
              label="Performance Metrics"
              name="performance_metrics"
              fullWidth
              variant="outlined"
              {...register('performance_metrics', { required: true })}
            />
            <Button
              variant="contained"
              component="label"
              sx={{ mt: 2 }}
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Upload
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MyModelsPage;
