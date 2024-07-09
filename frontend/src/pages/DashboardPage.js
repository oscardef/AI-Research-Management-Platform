import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { pb } from '../services/pocketbaseClient';
import { useAuth } from '../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const DashboardPage = () => {
  const { session } = useAuth();
  const [projects, setProjects] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: '',
    related_projects: [],
    related_models: [],
    related_publications: []
  });
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
    const fetchProjects = async () => {
      if (session) {
        try {
          const projectsData = await pb.collection('research_projects').getFullList(200, {
            filter: `collaborators~'${session.id}'`
          });
          setProjects(projectsData);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };

    const fetchModels = async () => {
      if (session) {
        try {
          const records = await pb.collection('models').getFullList(200, {
            filter: `collaborators~'${session.id}'`
          });
          setModels(records || []);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      }
    };

    fetchProjects();
    fetchModels();
    setLoading(false);
  }, [session]);

  const handleOpenProjectDialog = () => {
    setOpenProjectDialog(true);
  };

  const handleCloseProjectDialog = () => {
    setOpenProjectDialog(false);
    setNewProject({
      title: '',
      description: '',
      status: 'active',
      tags: '',
      related_projects: [],
      related_models: [],
      related_publications: []
    });
  };

  const handleOpenModelDialog = () => {
    setOpenModelDialog(true);
  };

  const handleCloseModelDialog = () => {
    setOpenModelDialog(false);
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

  const handleDeleteModel = async (id) => {
    try {
      await pb.collection('models').delete(id);
      setModels(models.filter(model => model.id !== id));
    } catch (error) {
      console.error('Error deleting model:', error);
      alert(`Error deleting model: ${error.message}`);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await pb.collection('research_projects').delete(id);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`Error deleting project: ${error.message}`);
    }
  };

  const handleCreateProject = async () => {
    const projectData = {
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      tags: newProject.tags.split(',').map(tag => tag.trim()),
      related_projects: newProject.related_projects,
      related_models: newProject.related_models,
      related_publications: newProject.related_publications,
      collaborators: [session.id],
    };

    try {
      const createdProject = await pb.collection('research_projects').create(projectData);
      setProjects([...projects, createdProject]);
      handleCloseProjectDialog();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Error creating project: ${error.message}`);
    }
  };

  const onSubmitModel = async (data) => {
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
        handleCloseModelDialog();
      } catch (error) {
        console.error('Error creating model:', error);
        alert(`Error creating model: ${error.message}`);
        setUploading(false);
      }
    } else {
      alert('Please select a file to upload');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
      <Box sx={{ flexGrow: 1, mr: 2 }}>
        <Typography variant="h4">My Research Projects</Typography>
        <Button variant="contained" color="success" onClick={handleOpenProjectDialog} sx={{ mb: 2 }}>
          Create Research Project
        </Button>
        {projects.length === 0 ? (
          <Typography>No projects found.</Typography>
        ) : (
          <List>
            {projects.map((project) => (
              <ListItem key={project.id} component={Link} to={`/research/${project.id}`}>
                <ListItemText
                  primary={project.title}
                  secondary={project.description}
                />
                <IconButton onClick={() => handleDeleteProject(project.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4">My Models</Typography>
        <Button variant="contained" color="success" onClick={handleOpenModelDialog} sx={{ mb: 2 }}>
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
                <IconButton onClick={() => handleDeleteModel(model.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Project Dialog */}
      <Dialog open={openProjectDialog} onClose={handleCloseProjectDialog}>
        <DialogTitle>Create Research Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            variant="outlined"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <TextField
            select
            margin="dense"
            label="Status"
            name="status"
            fullWidth
            variant="outlined"
            value={newProject.status}
            onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
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
            value={newProject.tags}
            onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateProject} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Model Dialog */}
      <Dialog open={openModelDialog} onClose={handleCloseModelDialog}>
        <DialogTitle>Upload New Model</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmitModel)}>
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
              <Button onClick={handleCloseModelDialog} color="primary" disabled={uploading}>
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

export default DashboardPage;
