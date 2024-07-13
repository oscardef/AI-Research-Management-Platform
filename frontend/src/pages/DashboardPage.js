import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import { pb } from '../services/pocketbaseClient';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/Dashboard/ProjectCard';
import ModelCard from '../components/Dashboard/ModelCard';
import DeleteConfirmationDialog from '../components/Dashboard/DeleteConfirmationDialog';
import ProjectDialog from '../components/Dashboard/ProjectDialog';
import ModelDialog from '../components/Dashboard/ModelDialog';

const DashboardPage = () => {
  const { session } = useAuth();
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [models, setModels] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: [],
    related_projects: [],
    related_models: [],
    related_publications: [],
    collaborators: [{ id: session?.id, name: session?.name }],
    details: [],
    data_sources: [],
    public: false
  });
  const [newModel, setNewModel] = useState({
    name: '',
    description: '',
    version: '',
    performance_metrics: [],
    hyperparameters: [],
    status: 'active',
    collaborators: [{ id: session?.id, name: session?.name }],
    related_projects: [],
    related_models: [],
    tags: [],
    public: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploading, setUploading] = useState(false);

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
          const projectsData = await pb.collection('research_projects').getFullList(200);
          let filteredProjects;
          if (isOwnPage) {
            filteredProjects = projectsData.filter(project => project.collaborators.includes(userId));
          } else {
            filteredProjects = projectsData.filter(project => project.public && project.collaborators.includes(userId));
          }
          setProjects(filteredProjects);
          setMyProjects(filteredProjects.filter(project => project.collaborators.includes(session?.id)));
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      }
    };

    const fetchModels = async () => {
      if (userId) {
        try {
          const modelsData = await pb.collection('models').getFullList(200);
          let filteredModels;
          if (isOwnPage) {
            filteredModels = modelsData.filter(model => model.collaborators.includes(userId));
          } else {
            filteredModels = modelsData.filter(model => model.public && model.collaborators.includes(userId));
          }
          setModels(filteredModels);
        } catch (error) {
          console.error('Error fetching models:', error);
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await pb.collection('users').getFullList(200);
        setAllUsers(usersData);
        const filtered = usersData.filter(user => user.id !== session?.id);
        setFilteredUsers(filtered);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUserData();
    fetchProjects();
    fetchModels();
    fetchUsers();
    setLoading(false);
  }, [userId, session?.id, isOwnPage]);

  const handleOpenProjectDialog = () => {
    setOpenProjectDialog(true);
  };

  const handleCloseProjectDialog = () => {
    setOpenProjectDialog(false);
    setNewProject({
      title: '',
      description: '',
      status: 'active',
      tags: [],
      related_projects: [],
      related_models: [],
      related_publications: [],
      collaborators: [{ id: session?.id, name: session?.name }],
      details: [],
      data_sources: [],
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
      status: 'active',
      performance_metrics: [],
      hyperparameters: [],
      related_projects: [],
      related_models: [],
      tags: [],
      collaborators: [{ id: session?.id, name: session?.name }],
      public: false
    });
    setSelectedFile(null);
    setSelectedFileName('');
    setUploading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("file: ", file);
    setSelectedFile(file);
    setSelectedFileName(file ? file.name : '');
  };

  const handleDelete = (item, type) => {
    setDeleteItem({ item, type });
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    const { item, type } = deleteItem;
    try {
      if (type === 'model') {
        await pb.collection('models').delete(item.id);
        setModels(models.filter(model => model.id !== item.id));
      } else {
        await pb.collection('research_projects').delete(item.id);
        setProjects(projects.filter(project => project.id !== item.id));
        setMyProjects(myProjects.filter(project => project.id !== item.id));
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      alert(`Error deleting ${type}: ${error.message}`);
    }
    setDeleteItem(null);
    setOpenDeleteDialog(false);
  };

  const handleCreateProject = async () => {
    const projectData = {
      title: newProject.title,
      description: newProject.description,
      status: newProject.status,
      tags: newProject.tags,
      related_projects: newProject.related_projects.map(project => project.id),
      related_models: newProject.related_models.map(model => model.id),
      related_publications: newProject.related_publications,
      collaborators: newProject.collaborators.map(collab => collab.id),
      details: newProject.details,
      data_sources: newProject.data_sources,
      public: newProject.public
    };

    try {
      const createdProject = await pb.collection('research_projects').create(projectData);
      setProjects([...projects, createdProject]);
      setMyProjects([...myProjects, createdProject]);
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
          related_projects: newModel.related_projects.map(project => project.id),
          related_models: newModel.related_models.map(model => model.id),
          tags: newModel.tags,
          collaborators: newModel.collaborators.map(collab => collab.id),
          public: newModel.public,
          status: newModel.status,
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

  const handleAddDetail = () => {
    setNewProject(prevState => ({
      ...prevState,
      details: [...prevState.details, { key: '', value: '' }]
    }));
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...newProject.details];
    newDetails[index][field] = value;
    setNewProject({ ...newProject, details: newDetails });
  };

  const handleAddDataSource = () => {
    setNewProject(prevState => ({
      ...prevState,
      data_sources: [...prevState.data_sources, { key: '', value: '' }]
    }));
  };

  const handleDataSourceChange = (index, field, value) => {
    const newDataSources = [...newProject.data_sources];
    newDataSources[index][field] = value;
    setNewProject({ ...newProject, data_sources: newDataSources });
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
          <ProjectCard
            projects={projects}
            isOwnPage={isOwnPage}
            handleDelete={handleDelete}
          />
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
        </Grid>
        <Grid item xs={12} md={6}>
          <ModelCard
            models={models}
            isOwnPage={isOwnPage}
            handleDelete={handleDelete}
          />
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
        </Grid>
      </Grid>

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        handleConfirm={handleDeleteConfirm}
        deleteItem={deleteItem?.item}
      />

      <ProjectDialog
        open={openProjectDialog}
        handleClose={handleCloseProjectDialog}
        handleCreate={handleCreateProject}
        newProject={newProject}
        setNewProject={setNewProject}
        handleAddDetail={handleAddDetail}
        handleDetailChange={handleDetailChange}
        handleAddDataSource={handleAddDataSource}
        handleDataSourceChange={handleDataSourceChange}
        projects={projects}
        models={models}
        filteredUsers={filteredUsers}
        session={session}
      />

      <ModelDialog
        open={openModelDialog}
        handleClose={handleCloseModelDialog}
        handleCreate={handleCreateModel}
        newModel={newModel}
        setNewModel={setNewModel}
        handleAddPerformanceMetric={handleAddPerformanceMetric}
        handlePerformanceMetricChange={handlePerformanceMetricChange}
        handleAddHyperparameter={handleAddHyperparameter}
        handleHyperparameterChange={handleHyperparameterChange}
        handleFileChange={handleFileChange}
        selectedFileName={selectedFileName}
        uploading={uploading}
        projects={projects}
        models={models}
        filteredUsers={filteredUsers}
        session={session}
      />
    </Box>
  );
};

export default DashboardPage;
