import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, IconButton, CircularProgress,
  Card, CardContent, Grid, Chip, Autocomplete
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { pb } from '../services/pocketbaseClient';
import { useAuth } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const DashboardPage = () => {
  const { session } = useAuth();
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: '',
    related_projects: [],
    related_models: [],
    related_publications: [],
    public: false
  });
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    version: '',
    performance_metrics: [],
    hyperparameters: [],
    status: 'active',
    collaborators: [session?.id || ''],
    related_projects: [],
    tags: [],
    public: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);

  const isOwnPage = session?.id === userId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await pb.collection('users').getOne(userId);
        setUserName(user.name);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchProjects = async () => {
      if (userId) {
        try {
          const projectsData = await pb.collection('research_projects').getFullList(200, {
            filter: `(public=true || collaborators~'${userId}')`
          });
          setProjects(projectsData);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };

    const fetchAllProjects = async () => {
      try {
        const projectsData = await pb.collection('research_projects').getFullList(200, {
          filter: `(public=true)`
        });
        setAllProjects(projectsData);
      } catch (error) {
        console.error('Error fetching all projects:', error);
      }
    };

    const fetchModels = async () => {
      if (userId) {
        try {
          const records = await pb.collection('models').getFullList(200, {
            filter: `(public=true || collaborators~'${userId}')`
          });
          setModels(records || []);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      }
    };

    fetchUserData();
    fetchProjects();
    fetchAllProjects();
    fetchModels();
    setLoading(false);
  }, [userId]);

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
      related_publications: [],
      public: false
    });
  };

  const handleOpenModelDialog = () => {
    setOpenModelDialog(true);
  };

  const handleCloseModelDialog = () => {
    setOpenModelDialog(false);
    setNewModel({
      name: '',
      description: '',
      version: '',
      performance_metrics: [],
      hyperparameters: [],
      status: 'active',
      collaborators: [session?.id || ''],
      related_projects: [],
      tags: [],
      public: false
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
      public: newProject.public
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

  const handleCreateModel = async () => {
    if (selectedFile && session) {
      setUploading(true);

      try {
        const modelData = {
          name: newModel.name,
          description: newModel.description,
          version: newModel.version,
          performance_metrics: JSON.stringify(newModel.performance_metrics),
          hyperparameters: JSON.stringify(newModel.hyperparameters),
          status: newModel.status,
          collaborators: newModel.collaborators,
          related_projects: newModel.related_projects.map(project => project.id),
          tags: newModel.tags,
          public: newModel.public,
          files: selectedFile
        };

        const record = await pb.collection('models').create(modelData);

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

  const handleAddHyperparameter = () => {
    setNewModel(prevState => ({
      ...prevState,
      hyperparameters: [...prevState.hyperparameters, { key: '', value: '' }]
    }));
  };

  const handleHyperparameterChange = (index, field, value) => {
    const newHyperparameters = [...newModel.hyperparameters];
    newHyperparameters[index][field] = value;
    setNewModel({ ...newModel, hyperparameters: newHyperparameters });
  };

  const handleAddPerformanceMetric = () => {
    setNewModel(prevState => ({
      ...prevState,
      performance_metrics: [...prevState.performance_metrics, { key: '', value: '' }]
    }));
  };

  const handlePerformanceMetricChange = (index, field, value) => {
    const newPerformanceMetrics = [...newModel.performance_metrics];
    newPerformanceMetrics[index][field] = value;
    setNewModel({ ...newModel, performance_metrics: newPerformanceMetrics });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        {isOwnPage ? 'My Dashboard' : `${userName}'s Dashboard`}
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Research Projects
              </Typography>
              {isOwnPage && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenProjectDialog}
                  startIcon={<AddIcon />}
                  sx={{ mb: 2 }}
                >
                  Create Research Project
                </Button>
              )}
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
                      {isOwnPage && (
                        <IconButton onClick={() => handleDeleteProject(project.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Models
              </Typography>
              {isOwnPage && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenModelDialog}
                  startIcon={<AddIcon />}
                  sx={{ mb: 2 }}
                >
                  Upload New Model
                </Button>
              )}
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
                      {isOwnPage && (
                        <IconButton onClick={() => handleDeleteModel(model.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="Public"
            name="public"
            fullWidth
            variant="outlined"
            value={newProject.public}
            onChange={(e) => setNewProject({ ...newProject, public: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value={true}>Yes</MenuItem>
            <MenuItem value={false}>No</MenuItem>
          </TextField>
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
            options={allProjects}
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
          <Button onClick={handleCloseModelDialog} color="primary" disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleCreateModel} color="primary" disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
