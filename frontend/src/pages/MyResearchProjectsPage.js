import React, { useState, useEffect } from 'react';
import {
  Box, Typography, List, ListItem, ListItemText,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const MyResearchProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'active',
    tags: ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Authenticated user:', user);
      if (user) {
        const { data, error } = await supabase
          .from('research_projects')
          .select('*')
          .contains('collaborators', [user.id]);

        if (error) {
          console.error('Error fetching projects:', error);
        } else {
          console.log('Fetched projects:', data);
          setProjects(data);
        }
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewProject({
      title: '',
      description: '',
      status: 'active',
      tags: ''
    });
  };

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const projectData = {
      ...newProject,
      collaborators: [user.id],
      tags: newProject.tags.split(',').map(tag => tag.trim()),
      created_at: new Date().toISOString()
    };
    console.log('Project data to be inserted:', projectData);

    const { data, error } = await supabase
      .from('research_projects')
      .insert([projectData]);

    if (error) {
      console.error('Error creating project:', error);
      alert(`Error creating project: ${error.message}`);
    } else {
      console.log('Insert response data:', data);
      if (data && data.length > 0) {
        alert('Project created successfully');
        setProjects([...projects, data[0]]);
      } else {
        console.error('Unexpected insert response:', data);
      }
      handleClose();
    }
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
    </Box>
  );
};

export default MyResearchProjectsPage;
