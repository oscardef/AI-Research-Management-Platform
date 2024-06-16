// ResearchPage.js
import React, { useState } from 'react';
import {
  Box, Grid, Typography, TextField, IconButton, Dialog, DialogActions,
  DialogContent, DialogTitle, List, ListItem, ListItemText, Button
} from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import useProject from '../hooks/useProject';
import RelatedProjects from '../components/research-projects/RelatedProjects';
import RelatedModels from '../components/research-projects/RelatedModels';
import RelatedPublications from '../components/research-projects/RelatedPublications';
import { supabase } from '../supabaseClient';

const ResearchPage = () => {
  const { projectId } = useParams();
  const {
    project, loading, relatedProjects, relatedModels, relatedPublications,
    setProject, setRelatedProjects, setRelatedModels, setRelatedPublications
  } = useProject(projectId);
  const [editing, setEditing] = useState({
    title: false,
    description: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState('');

  const handleSearch = async () => {
    if (!searchTerm) return;

    let searchQuery;
    if (searchType === 'project') {
      searchQuery = supabase
        .from('research_projects')
        .select('*')
        .ilike('title', `%${searchTerm}%`)
        .neq('id', projectId)
        .not('id', 'in', `(${relatedProjects.map(proj => proj.id).join(',')})`);
    } else if (searchType === 'model') {
      searchQuery = supabase
        .from('models')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .not('id', 'in', `(${relatedModels.map(model => model.id).join(',')})`);
    } else if (searchType === 'publication') {
      const response = await axios.get(`https://api.crossref.org/works?query=${searchTerm}`);
      searchQuery = response.data.message.items.map(item => ({
        id: item.DOI,
        title: item.title[0],
        description: item['container-title'] ? item['container-title'][0] : 'No description',
        link: item.URL
      }));
      setSearchResults(searchQuery);
      return;
    }

    const { data, error } = await searchQuery;
    if (error) {
      console.error('Error fetching search results:', error);
    } else {
      setSearchResults(data);
    }
  };

  const handleUpdate = async (updatedData) => {
    console.log("Updated data:", updatedData);
    const { data, error } = await supabase
      .from('research_projects')
      .update({
        related_projects: updatedData.related_projects || relatedProjects.map(proj => proj.id),
        related_models: updatedData.related_models || relatedModels.map(model => model.id),
        related_publications: updatedData.related_publications || relatedPublications
      })
      .eq('id', project.id);
    console.log('Update response:', data, error);
    if (error) {
      console.error('Error updating project:', error);
      alert(`Error updating project: ${error.message}`);
    } else {
      console.log('Project updated successfully');
    }
  };

  const toggleEdit = (field) => {
    setEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleAddRelated = async (item) => {
    if (searchType === 'project') {
      const updatedProjects = [...relatedProjects, { id: item.id, title: item.title, description: item.description }];
      setRelatedProjects(updatedProjects);
      await handleUpdate({ related_projects: updatedProjects.map(proj => proj.id) });
    } else if (searchType === 'model') {
      const updatedModels = [...relatedModels, { id: item.id, name: item.name, description: item.description }];
      setRelatedModels(updatedModels);
      await handleUpdate({ related_models: updatedModels.map(model => model.id) });
    } else if (searchType === 'publication') {
      const updatedPublications = [...relatedPublications, { title: item.title, link: item.link }];
      setRelatedPublications(updatedPublications);
      await handleUpdate({ related_publications: updatedPublications });
    }
  };

  const handleDeleteRelated = async (id, type) => {
    if (type === 'project') {
      const updatedProjects = relatedProjects.filter((item) => item.id !== id);
      setRelatedProjects(updatedProjects);
      await handleUpdate({ related_projects: updatedProjects.map(proj => proj.id) });
    } else if (type === 'model') {
      const updatedModels = relatedModels.filter((item) => item.id !== id);
      setRelatedModels(updatedModels);
      await handleUpdate({ related_models: updatedModels.map(model => model.id) });
    } else if (type === 'publication') {
      const updatedPublications = relatedPublications.filter((item) => item.link !== id);
      setRelatedPublications(updatedPublications);
      await handleUpdate({ related_publications: updatedPublications });
    }
  };

  const handleOpenSearch = (type) => {
    setSearchType(type);
    setSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!project) {
    return <Typography>No project found</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ backgroundColor: 'grey', padding: 2 }}>
            <Typography variant="h5" align="center" color="white">
              <TextField
                variant="outlined"
                fullWidth
                value={project.title}
                onChange={handleChange}
                name="title"
                disabled={!editing.title}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => toggleEdit('title')}>
                      {editing.title ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'lightblue', padding: 2 }}>
                <Typography variant="h6">
                  <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    value={project.description}
                    onChange={handleChange}
                    name="description"
                    disabled={!editing.description}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => toggleEdit('description')}>
                          {editing.description ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'lightblue', padding: 2 }}>
                <Typography variant="h6">
                  Project Details
                  <pre>{JSON.stringify(project.details, null, 2)}</pre>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RelatedProjects
                relatedProjects={relatedProjects}
                handleDeleteRelated={handleDeleteRelated}
                handleOpenSearch={handleOpenSearch}
              />
            </Grid>
            <Grid item xs={12}>
              <RelatedModels
                relatedModels={relatedModels}
                handleDeleteRelated={handleDeleteRelated}
                handleOpenSearch={handleOpenSearch}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'red', padding: 2 }}>
                <Typography variant="h6" color="white">Linked Datasets</Typography>
                {/* Linked Datasets implementation */}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <RelatedPublications
                relatedPublications={relatedPublications}
                handleDeleteRelated={handleDeleteRelated}
                handleOpenSearch={handleOpenSearch}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={searchOpen} onClose={handleCloseSearch}>
        <DialogTitle>Search {searchType === 'project' ? 'Research Projects' : searchType === 'model' ? 'AI Models' : 'Publications'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              autoFocus
              margin="dense"
              label="Search"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          </Box>
          <List>
            {searchResults.map((result) => (
              <ListItem key={result.id || result.link}>
                <ListItemText
                  primary={result.title || result.name}
                  secondary={result.description}
                />
                <IconButton onClick={() => handleAddRelated(result)}>
                  <AddIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearch} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Button onClick={() => handleUpdate({})} variant="contained" color="primary" sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
};

export default ResearchPage;
