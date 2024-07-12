import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, CardContent, CardActions, Divider } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { pb } from '../services/pocketbaseClient';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import useProject from '../hooks/useProject';
import SearchModal from '../components/Common/SearchModal';
import { ProjectDescription, ProjectDetails } from '../components/ProjectDetails';
import ProjectCollaborators from '../components/ProjectCollaborators';
import RelatedItems from '../components/RelatedItems';

const ResearchPage = () => {
  const { projectId } = useParams();
  const { project, loading, relatedProjects, relatedModels, relatedPublications, collaborators, setProject, fetchProject } = useProject(projectId);
  const [editing, setEditing] = useState(false);
  const [tempProject, setTempProject] = useState({});
  const [originalProject, setOriginalProject] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!editing) {
      setTempProject({ ...project });
      setOriginalProject({ ...project });
    }
  }, [editing, project]);

  const toggleEdit = () => setEditing(!editing);

  const handleCancel = () => {
    setEditing(false);
    setTempProject({ ...originalProject });
  };

  const handleSave = async () => {
    try {
      await pb.collection('research_projects').update(project.id, tempProject);
      await fetchProject(project.id); // Refresh the project data
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
        const updatedArray = [...(prevState[field] || [])];
        if (!updatedArray[index]) {
          updatedArray[index] = {};
        }
        updatedArray[parseInt(index)][key] = value;
        return { ...prevState, [field]: updatedArray };
      });
    } else {
      setTempProject({ ...tempProject, [name]: value });
    }
  };

  const handleAddDetail = () => {
    setTempProject(prevState => ({
      ...prevState,
      details: [...(prevState.details || []), { key: '', value: '' }]
    }));
  };

  const handleRemoveDetail = (index) => {
    setTempProject(prevState => {
      const updatedDetails = prevState.details.filter((_, i) => i !== index);
      return { ...prevState, details: updatedDetails };
    });
  };

  const handleAdd = (items) => {
    setTempProject(prevState => {
      let updatedField;
      if (modalType === 'related_publications') {
        updatedField = [
          ...new Set([
            ...(prevState[modalType] || []),
            ...items.map(item => ({
              title: item.title,
              url: item.url,
              journal: item.journal,
              author: item.author
            }))
          ])
        ];
      } else {
        updatedField = [...new Set([...(prevState[modalType] || []), ...items.map(item => item.id)])];
      }
      return { ...prevState, [modalType]: updatedField };
    });
  };

  const handleRemoveRelatedItem = (type, id) => {
    setTempProject(prevState => {
      const updatedField = prevState[type].filter(item => {
        if (type === 'related_publications') {
          return item.url !== id;
        }
        return item !== id;
      });
      return { ...prevState, [type]: updatedField };
    });
  };

  const handleRemoveCollaborator = (id) => {
    setTempProject(prevState => ({
      ...prevState,
      collaborators: prevState.collaborators.filter(collabId => collabId !== id)
    }));
  };

  const handleAddTag = (tag) => {
    setTempProject(prevState => ({
      ...prevState,
      tags: [...(prevState.tags || []), tag]
    }));
  };

  const handleRemoveTag = (tag) => {
    setTempProject(prevState => ({
      ...prevState,
      tags: prevState.tags.filter(t => t !== tag)
    }));
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNavigation = async (id, type) => {
    navigate(type === 'project' ? `/research/${id}` : `/model/${id}`);
    await fetchProject(id); // Fetch the project data when navigating
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
        onClose={closeModal}
        onAdd={handleAdd}
        type={modalType}
        currentItems={tempProject[modalType] || []}
        excludeId={projectId}
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
              <ProjectDescription project={tempProject} handleChange={handleChange} editing={editing} />
              <ProjectDetails project={tempProject} handleChange={handleChange} editing={editing} handleAddDetail={handleAddDetail} handleRemoveDetail={handleRemoveDetail} />
              <ProjectCollaborators
                collaborators={collaborators}
                project={tempProject}
                getProfilePictureUrl={(collaborator) => collaborator.profile_picture ? `http://127.0.0.1:8090/api/files/_pb_users_auth_/${collaborator.id}/${collaborator.profile_picture}` : ''}
                editing={editing}
                handleRemoveCollaborator={handleRemoveCollaborator}
                openModal={openModal}
                navigate={navigate}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RelatedItems
                relatedProjects={relatedProjects}
                relatedModels={relatedModels}
                relatedPublications={relatedPublications}
                project={tempProject}
                editing={editing}
                handleNavigation={handleNavigation}
                openModal={openModal}
                handleRemoveRelatedItem={handleRemoveRelatedItem}
                handleChange={handleChange}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'center', p: 2 }}>
          {editing ? (
            <>
              <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave} sx={{ mr: 1 }}>
                Save Changes
              </Button>
              <Button variant="contained" color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={toggleEdit}>
              Edit Page
            </Button>
          )}
        </CardActions>
      </Card>
    </Box>
  );
};

export default ResearchPage;
