import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, IconButton, InputAdornment
} from '@mui/material';
import { Link } from 'react-router-dom';
import { pb } from '../services/pocketbaseClient';
import { useAuth } from '../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';

const MyResearchProjectsPage = () => {
  const { session } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: '',
    related_projects: [],
    related_models: [],
    related_publications: []
  });
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      console.log('Authenticated user:', session);
      if (session) {
        try {
          const projectsData = await pb.collection('research_projects').getFullList(200, {
            filter: `collaborators~'${session.id}'`
          });
          console.log('Fetched projects:', projectsData);
          setProjects(projectsData);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
        setLoading(false);
      }
    };

    fetchProjects();
  }, [session]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
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
    console.log('Project data to be inserted:', projectData);

    try {
      const createdProject = await pb.collection('research_projects').create(projectData);
      console.log('Created project:', createdProject);
      alert('Project created successfully');
      setProjects([...projects, createdProject]);
      handleClose();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Error creating project: ${error.message}`);
    }
  };

  const handleSearchOpen = (type) => {
    setSearchType(type);
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
      let results = [];
      if (searchType === 'projects') {
        results = await pb.collection('research_projects').getFullList(200, {
          filter: `title~'${e.target.value}'`
        });
      } else if (searchType === 'models') {
        results = await pb.collection('models').getFullList(200, {
          filter: `name~'${e.target.value}'`
        });
      } else if (searchType === 'publications') {
        const response = await fetch(`https://api.crossref.org/works?query=${e.target.value}`);
        const data = await response.json();
        if (data.message && data.message.items) {
          results = data.message.items.map(item => ({
            name: item.title ? item.title[0] : 'No Title',
            url: item.URL
          }));
        } else {
          console.error('Unexpected response structure:', data);
        }
      }
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddResult = (result) => {
    if (searchType === 'projects') {
      setNewProject({ ...newProject, related_projects: [...newProject.related_projects, result.id] });
    } else if (searchType === 'models') {
      setNewProject({ ...newProject, related_models: [...newProject.related_models, result.id] });
    } else if (searchType === 'publications') {
      setNewProject({ ...newProject, related_publications: [...newProject.related_publications, { name: result.name, url: result.url }] });
    }
    handleSearchClose();
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">My Research Projects</Typography>
      <Button variant="contained" color="success" onClick={handleClickOpen} sx={{ mb: 2 }}>
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
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={handleClose}>
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
            value={newProject.description}
            onChange={handleChange}
          />
          <TextField
            select
            margin="dense"
            label="Status"
            name="status"
            fullWidth
            variant="outlined"
            value={newProject.status}
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
            value={newProject.tags}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Related Projects"
            name="related_projects"
            fullWidth
            variant="outlined"
            value={newProject.related_projects.join(', ')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearchOpen('projects')}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setNewProject({ ...newProject, related_projects: e.target.value.split(',').map(id => id.trim()) })}
          />
          <TextField
            margin="dense"
            label="Related Models"
            name="related_models"
            fullWidth
            variant="outlined"
            value={newProject.related_models.join(', ')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearchOpen('models')}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setNewProject({ ...newProject, related_models: e.target.value.split(',').map(id => id.trim()) })}
          />
          <TextField
            margin="dense"
            label="Related Publications"
            name="related_publications"
            fullWidth
            variant="outlined"
            value={newProject.related_publications.map(pub => pub.name).join(', ')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearchOpen('publications')}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setNewProject({ ...newProject, related_publications: e.target.value.split(',').map(name => ({ name, url: '' })) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={searchOpen} onClose={handleSearchClose}>
        <DialogTitle>Search {searchType === 'projects' ? 'Related Projects' : searchType === 'models' ? 'Related Models' : 'Publications'}</DialogTitle>
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
                  primary={searchType === 'publications' ? result.name : result.title || result.name}
                  secondary={searchType === 'publications' ? result.url : ''}
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

export default MyResearchProjectsPage;
