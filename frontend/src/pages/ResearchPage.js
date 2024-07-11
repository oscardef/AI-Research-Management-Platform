import React, { useState } from 'react';
import {
  Box, Grid, Typography, TextField, Button, IconButton, Link, List, ListItem, ListItemText, Card, CardContent, CardActions, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { useParams, NavLink } from 'react-router-dom';
import useProject from '../hooks/useProject';
import { pb } from '../services/pocketbaseClient';
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
    project, loading, relatedProjects, relatedModels, relatedPublications, collaborators,
    setProject
  } = useProject(projectId);
  const [editing, setEditing] = useState(false);
  const [tempProject, setTempProject] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

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
    setTempProject({ ...tempProject, [e.target.name]: e.target.value });
  };

  const handleAdd = (item) => {
    if (modalType === 'collaborators') {
      setTempProject({ ...tempProject, collaborators: [...(tempProject.collaborators || []), item] });
    } else if (modalType === 'related_projects') {
      setTempProject({ ...tempProject, relatedProjects: [...(tempProject.relatedProjects || []), item] });
    } else if (modalType === 'related_models') {
      setTempProject({ ...tempProject, relatedModels: [...(tempProject.relatedModels || []), item] });
    } else if (modalType === 'related_publications') {
      setTempProject({ ...tempProject, relatedPublications: [...(tempProject.relatedPublications || []), item] });
    }
    setModalOpen(false);
  };

  const handleRemove = (item) => {
    if (modalType === 'collaborators') {
      setTempProject({ ...tempProject, collaborators: tempProject.collaborators.filter(c => c.id !== item.id) });
    } else if (modalType === 'related_projects') {
      setTempProject({ ...tempProject, relatedProjects: tempProject.relatedProjects.filter(p => p.id !== item.id) });
    } else if (modalType === 'related_models') {
      setTempProject({ ...tempProject, relatedModels: tempProject.relatedModels.filter(m => m.id !== item.id) });
    } else if (modalType === 'related_publications') {
      setTempProject({ ...tempProject, relatedPublications: tempProject.relatedPublications.filter(p => p.id !== item.id) });
    }
    setModalOpen(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!project) {
    return <Typography>No project found</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <SearchModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        onRemove={handleRemove}
        type={modalType}
        currentItems={tempProject[modalType] || []}
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
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={tempProject.details || ''}
                      onChange={handleChange}
                      name="details"
                    />
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
                    <TextField
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={tempProject.data_sources || ''}
                      onChange={handleChange}
                      name="data_sources"
                    />
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
                        <ListItemText primary={collaborator.name} />
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
                      <ListItem key={relatedProject.id}>
                        <ListItemText primary={relatedProject.title} />
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
                      <ListItem key={model.id}>
                        <ListItemText primary={model.name} />
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
