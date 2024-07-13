import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Box, Autocomplete, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { pb } from '../../services/pocketbaseClient';
const ProjectDialog = ({
  open,
  handleClose,
  handleCreate,
  newProject,
  setNewProject,
  handleAddDetail,
  handleDetailChange,
  handleAddDataSource,
  handleDataSourceChange,
  filteredUsers = [],
  session
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchProjectsAndModels = async () => {
      try {
        const projectsData = await pb.collection('research_projects').getFullList(200, {
          filter: `public=true || collaborators~'${session.id}'`
        });

        const modelsData = await pb.collection('models').getFullList(200, {
          filter: `public=true || collaborators~'${session.id}'`
        });

        setProjects(projectsData);
        setModels(modelsData);
      } catch (error) {
        console.error('Error fetching projects and models:', error);
      }
    };

    if (open) {
      fetchProjectsAndModels();
      setSearchResults([]);
    }
  }, [open, session.id]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.crossref.org/works?query=${searchTerm}&rows=10`);
      const results = response.data.message.items.map(item => ({
        title: item.title[0],
        author: item.author ? item.author.map(a => a.family).join(', ') : 'Unknown Author',
        journal: item['container-title'] ? item['container-title'][0] : 'Unknown Journal',
        url: item.URL
      }));

      const filteredResults = results.filter(result => !newProject.related_publications.some(pub => pub.url === result.url));
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching for publications:', error);
    }
    setLoading(false);
  };

  const handleAddPublication = (publication) => {
    if (!newProject.related_publications.some(pub => pub.url === publication.url)) {
      setNewProject(prevState => ({
        ...prevState,
        related_publications: [...prevState.related_publications, publication]
      }));

      setSearchResults(searchResults.filter(pub => pub.url !== publication.url));
    }
  };

  const handleRemovePublication = (index) => {
    setNewProject(prevState => ({
      ...prevState,
      related_publications: prevState.related_publications.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Research Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Project Title"
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
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={newProject.tags}
          onChange={(event, newValue) => setNewProject({ ...newProject, tags: newValue })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Tags" placeholder="Add Tags" />
          )}
          sx={{ mb: 2 }}
        />
        {newProject.details.map((detail, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="Detail Key"
              value={detail.key}
              onChange={(e) => handleDetailChange(index, 'key', e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label="Detail Value"
              value={detail.value}
              onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
              sx={{ mr: 1 }}
            />
          </Box>
        ))}
        <Button
          variant="contained"
          onClick={handleAddDetail}
          sx={{ mb: 2 }}
        >
          Add Detail
        </Button>
        {newProject.data_sources.map((source, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="Source Key"
              value={source.key}
              onChange={(e) => handleDataSourceChange(index, 'key', e.target.value)}
              sx={{ mr: 1 }}
            />
            <TextField
              label="Source Value"
              value={source.value}
              onChange={(e) => handleDataSourceChange(index, 'value', e.target.value)}
              sx={{ mr: 1 }}
            />
          </Box>
        ))}
        <Button
          variant="contained"
          onClick={handleAddDataSource}
          sx={{ mb: 2 }}
        >
          Add Data Source
        </Button>
        <Autocomplete
          multiple
          options={projects}
          getOptionLabel={(option) => option.title}
          value={newProject.related_projects}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => setNewProject({ ...newProject, related_projects: newValue })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Related Projects" placeholder="Select Projects" />
          )}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          options={models}
          getOptionLabel={(option) => option.name}
          value={newProject.related_models}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => setNewProject({ ...newProject, related_models: newValue })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Related Models" placeholder="Select Models" />
          )}
          sx={{ mb: 2 }}
        />
        <Autocomplete
          multiple
          options={filteredUsers.filter(user => !newProject.collaborators.some(collab => collab.id === user.id))}
          getOptionLabel={(option) => option.name}
          value={newProject.collaborators.filter(collab => collab.id !== session?.id)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(event, newValue) => setNewProject({ ...newProject, collaborators: [{ id: session?.id, name: session?.name }, ...newValue] })}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Collaborators" placeholder="Add Collaborators" />
          )}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Search Publications"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ mb: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
        <Box sx={{ mb: 2 }}>
          {newProject.related_publications.map((pub, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent>
                <Typography
                  component="a"
                  href={pub.url}
                  target="_blank"
                  sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {pub.title.length > 50 ? `${pub.title.substring(0, 50)}...` : pub.title}
                </Typography>
                <Button variant="outlined" onClick={() => handleRemovePublication(index)}>
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
        <Box>
          {searchResults.map((publication, index) => (
            <Card key={index} sx={{ mb: 1 }}>
              <CardContent>
                <Typography
                  component="a"
                  href={publication.url}
                  target="_blank"
                  sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {publication.title.length > 50 ? `${publication.title.substring(0, 50)}...` : publication.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Source: {publication.journal}
                </Typography>
                <Button variant="contained" onClick={() => handleAddPublication(publication)}>
                  Add Publication
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
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
  );
};

export default ProjectDialog;
