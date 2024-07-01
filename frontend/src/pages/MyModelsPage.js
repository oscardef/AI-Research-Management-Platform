import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, IconButton, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient'; // Make sure to import your Supabase client

const MyModelsPage = () => {
  const { session } = useAuth();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('models')
            .select('*')
            .eq('user_id', session.user.id);

          if (error) throw error;
          setModels(data || []);
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
    setSelectedFile(null);
    setSelectedFileName('');
    setUploading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : '');
  };

  const handleDelete = async (id, fileUrl) => {
    try {
      // Delete the file from Supabase Storage
      const { error: storageError } = await supabase
        .storage
        .from('model-files')
        .remove([fileUrl]);

      if (storageError) throw storageError;

      // Delete the model entry from the Supabase database
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      const filePath = `${userId}/${fileName}`;

      setUploading(true);

      try {
        // Upload the file to Supabase Storage
        const { error: uploadError } = await supabase
          .storage
          .from('model-files')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        // Create the model entry in the Supabase database
        const { data: modelData, error: insertError } = await supabase
          .from('models')
          .insert([
            {
              ...data,
              user_id: userId,
              file_url: filePath,
            },
          ])
          .single();

        if (insertError) throw insertError;

        setModels(prevModels => [...prevModels, modelData]); // Update the state with the new model
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
          model && (
            <ListItem key={model.id}>
              <ListItemText
                primary={model.name}
                secondary={`Version: ${model.version} | Metrics: ${model.performance_metrics}`}
                component={Link} to={`/model/${model.id}`}
              />
              <IconButton onClick={() => handleDeploy(model)}>
                <AddIcon color="primary" />
              </IconButton>
              <IconButton onClick={() => handleDelete(model.id, model.file_url)}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItem>
          )
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
              disabled={uploading} // Disable button while uploading
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
    </Box>
  );
};

export default MyModelsPage;
