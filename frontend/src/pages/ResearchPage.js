import React, { useState } from 'react';
import { pb } from '../services/pocketbaseClient';
import {
  Box, Grid, Typography, TextField, Button, IconButton, Link, List, ListItem, ListItemText, Card, CardContent, CardActions, Chip, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import useProject from '../hooks/useProject';
import SearchModal from '../components/SearchModal';

const statusColors = {
  active: 'green',
  complete: 'blue',
  inactive: 'grey',
  pending: 'orange',
};

const ResearchPage = () => {
  const { projectId } = useParams();
  const {
    project, loading, relatedProjects = [], relatedModels = [], relatedPublications = [], collaborators = [],
    setProject, fetchProject
  } = useProject(projectId);
  const [editing, setEditing] = useState(false);
  const [tempProject, setTempProject] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();

  const toggleEdit = () => {
    setEditing(!editing);
    if (!editing) {
      setTempProject({ ...project });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setTempProject({});
  };

  const handleSave = async () => {
    try {
      await pb.collection('research_projects').update(project.id, tempProject);
      setProject(tempProject);
      setEditing(false);
      setTempProject({});
    } catch (error) {
      console.error('Error updating project:', error);
      alert(`Error updating project: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [field, index, key] = name.split('.');
      setTempProject(prevState => {
        const updatedArray = [...prevState[field] || []];
        updatedArray[parseInt(index)][key] = value;
        return { ...prevState, [field]: updatedArray };
      });
    } else {
      setTempProject({ ...tempProject, [name]: value });
    }
  };

  const handleAdd = (item) => {
    setTempProject(prevState => {
      const updatedField = [...(prevState[modalType] || []), item];
      return { ...prevState, [modalType]: updatedField };
    });
    setModalOpen(false);
  };

  const handleRemove = (item) => {
    setTempProject(prevState => {
      const updatedField = prevState[modalType].filter(i => i.id !== item.id);
      return { ...prevState, [modalType]: updatedField };
    });
    setModalOpen(false);
  };

  const handleAddDetail = () => {
    setTempProject(prevState => ({
      ...prevState,
      details: [...(prevState.details || []), { key: '', value: '' }]
    }));
  };

  const handleAddDataSource = () => {
    setTempProject(prevState => ({
      ...prevState,
      data_sources: [...(prevState.data_sources || []), { key: '', value: '' }]
    }));
  };

  const handleNavigation = async (id, type) => {
    if (type === 'project') {
      navigate(`/research/${id}`);
    } else if (type === 'model') {
      navigate(`/model/${id}`);
    }
    await fetchProject(id); // Fetch the project data when navigating
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!project) {
    return <Typography>No project found</Typography>;
  }

  const getProfilePictureUrl = (collaborator) => {
    return collaborator.profile_picture ? 
      `http://127.0.0.1:8090/api/files/_pb_users_auth_/${collaborator.id}/${collaborator.profile_picture}` : '';
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <SearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        onRemove={handleRemove}
        type={modalType}
        currentItems={tempProject[modalType] || []}
        projects={relatedProjects}
        models={relatedModels}
        collaborators={collaborators}
      />
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            {editing ? (
              <TextField
                variant="outlined"
                fullWidth
                value={tempProject.title || ''}
                onChange={handleChange}
                name="title"
              />
            ) : (
              project.title
            )}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
                  {editing ? (
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={tempProject.description || ''}
                      onChange={handleChange}
                      name="description"
                    />
                  ) : (
                    <Typography variant="body1" paragraph>{project.description}</Typography>
                  )}
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Details</Typography>
                  {editing ? (
                    <>
                      {tempProject.details?.map((detail, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                          <TextField
                            variant="outlined"
                            label="Detail Key"
                            name={`details.${index}.key`}
                            value={detail.key}
                            onChange={handleChange}
                            sx={{ mr: 2 }}
                          />
                          <TextField
                            variant="outlined"
                            label="Detail Value"
                            name={`details.${index}.value`}
                            value={detail.value}
                            onChange={handleChange}
                          />
                        </Box>
                      ))}
                      <Button variant="contained" onClick={handleAddDetail}>
                        Add Detail
                      </Button>
                    </>
                  ) : (
                    <Box>
                      {Array.isArray(project.details) && project.details.map((detail, index) => (
                        <Typography key={index} variant="body1" paragraph>{`${detail.key}: ${detail.value}`}</Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Data Sources</Typography>
                  {editing ? (
                    <>
                      {tempProject.data_sources?.map((source, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                          <TextField
                            variant="outlined"
                            label="Source Key"
                            name={`data_sources.${index}.key`}
                            value={source.key}
                            onChange={handleChange}
                            sx={{ mr: 2 }}
                          />
                          <TextField
                            variant="outlined"
                            label="Source Value"
                            name={`data_sources.${index}.value`}
                            value={source.value}
                            onChange={handleChange}
                          />
                        </Box>
                      ))}
                      <Button variant="contained" onClick={handleAddDataSource}>
                        Add Data Source
                      </Button>
                    </>
                  ) : (
                    <Box>
                      {Array.isArray(project.data_sources) && project.data_sources.map((source, index) => (
                        <Typography key={index} variant="body1" paragraph>{`${source.key}: ${source.value}`}</Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Collaborators</Typography>
                  <List>
                    {editing && (
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => { setModalType('collaborators'); setModalOpen(true); }}
                          startIcon={<AddIcon />}
                        >
                          Add Collaborator
                        </Button>
                      </ListItem>
                    )}
                    {collaborators.map((collaborator) => (
                      <ListItem key={collaborator.id} button component={NavLink} to={`/dashboard/${collaborator.id}`}>
                        <Avatar alt={collaborator.name} src={getProfilePictureUrl(collaborator)} sx={{ mr: 2 }} />
                        <ListItemText
                          primary={collaborator.name}
                          secondary={collaborator.institution}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Status</Typography>
                  <Chip
                    label={project.status}
                    sx={{
                      bgcolor: statusColors[project.status],
                      color: 'white',
                      mb: 1,
                    }}
                  />
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
                  <Box>
                    {Array.isArray(project.tags) && project.tags.map((tag, index) => (
                      <Chip key={index} label={tag} sx={{ mr: 1, mb: 1, bgcolor: 'primary.main', color: 'white' }} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Related Projects</Typography>
                  <List>
                    {editing && (
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => { setModalType('related_projects'); setModalOpen(true); }}
                          startIcon={<AddIcon />}
                        >
                          Add Project
                        </Button>
                      </ListItem>
                    )}
                    {relatedProjects.map((relatedProject) => (
                      <ListItem key={relatedProject.id} button onClick={() => handleNavigation(relatedProject.id, 'project')}>
                        <ListItemText
                          primary={relatedProject.title}
                          secondary={relatedProject.description ? `${relatedProject.description.substring(0, 50)}...` : ''}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Related Models</Typography>
                  <List>
                    {editing && (
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => { setModalType('related_models'); setModalOpen(true); }}
                          startIcon={<AddIcon />}
                        >
                          Add Model
                        </Button>
                      </ListItem>
                    )}
                    {relatedModels.map((model) => (
                      <ListItem key={model.id} button onClick={() => handleNavigation(model.id, 'model')}>
                        <ListItemText
                          primary={model.name}
                          secondary={model.description ? `${model.description.substring(0, 50)}...` : ''}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Related Publications</Typography>
                  <List>
                    {editing && (
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => { setModalType('related_publications'); setModalOpen(true); }}
                          startIcon={<AddIcon />}
                        >
                          Add Publication
                        </Button>
                      </ListItem>
                    )}
                    {relatedPublications.map((pub, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={
                            <Link href={pub.url} target="_blank" rel="noopener">
                              {pub.title.length > 50 ? `${pub.title.substring(0, 50)}...` : pub.title}
                            </Link>
                          }
                          secondary={`Source: ${pub.journal}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          {editing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save Changes
              </Button>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={toggleEdit}
            >
              Edit Page
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default ResearchPage;
