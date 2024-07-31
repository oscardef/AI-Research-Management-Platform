import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button, Chip, Link, IconButton, Box, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { pb } from '../services/pocketbaseClient';
import StatusBox from './StatusBox';

/**
 * RelatedItems Component
 * 
 * This component manages and displays related items for a project, including related projects, models, and publications.
 * It also handles the project's status and tags.
 * 
 * @param {Array} relatedProjects - List of related project IDs.
 * @param {Array} relatedModels - List of related model IDs.
 * @param {Array} relatedPublications - List of related publication objects.
 * @param {Object} project - The current project object.
 * @param {Boolean} editing - Whether the component is in editing mode.
 * @param {Function} handleNavigation - Function to navigate to a specific project or model page.
 * @param {Function} openModal - Function to open the modal for adding related items.
 * @param {Function} handleRemoveRelatedItem - Function to remove a related item.
 * @param {Function} handleChange - Function to handle changes to the project's status or tags.
 * @param {Function} handleAddTag - Function to add a new tag.
 * @param {Function} handleRemoveTag - Function to remove a tag.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const RelatedItems = ({
  relatedProjects,
  relatedModels,
  relatedPublications,
  project,
  editing,
  handleNavigation,
  openModal,
  handleRemoveRelatedItem,
  handleChange,
  handleAddTag,
  handleRemoveTag
}) => {
  // State variables for storing detailed information about related items
  const [projectDetails, setProjectDetails] = useState([]);
  const [modelDetails, setModelDetails] = useState([]);
  const [publicationDetails, setPublicationDetails] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Fetch detailed information about related projects, models, and publications
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch details for related projects and models using their IDs
        const projects = await Promise.all(
          relatedProjects.map(id => pb.collection('research_projects').getOne(id))
        );
        const models = await Promise.all(
          relatedModels.map(id => pb.collection('models').getOne(id))
        );
        setProjectDetails(projects);
        setModelDetails(models);
        setPublicationDetails(relatedPublications); // Directly use provided relatedPublications
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, [relatedProjects, relatedModels, relatedPublications]);

  // Handle change in new tag input field
  const handleTagChange = (event) => {
    setNewTag(event.target.value);
  };

  // Add new tag to the project
  const handleAddNewTag = () => {
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
      setNewTag(''); // Reset the input field
    }
  };

  // Determine which items to display based on editing mode
  const getDisplayItems = (items, details) => {
    if (editing) {
      return items.map(id => details.find(item => item.id === id)).filter(item => item);
    }
    return details;
  };

  // Get the displayable items for related projects, models, and publications
  const displayProjects = getDisplayItems(project.related_projects, projectDetails);
  const displayModels = getDisplayItems(project.related_models, modelDetails);
  const displayPublications = getDisplayItems(project.related_publications, publicationDetails);

  return (
    <>
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Status</Typography>
          <StatusBox status={project.status} handleChange={handleChange} editing={editing} />
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
          <Box>
            {Array.isArray(project.tags) && project.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                sx={{ mr: 1, mb: 1, bgcolor: 'primary.main', color: 'white' }}
                onDelete={editing ? () => handleRemoveTag(tag) : undefined}
              />
            ))}
            {editing && (
              <Box sx={{ display: 'flex', mt: 2 }}>
                <TextField
                  variant="outlined"
                  label="New Tag"
                  value={newTag}
                  onChange={handleTagChange}
                  sx={{ mr: 2 }}
                />
                <Button variant="contained" onClick={handleAddNewTag}>
                  Add Tag
                </Button>
              </Box>
            )}
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
                  onClick={() => openModal('related_projects')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Project
                </Button>
              </ListItem>
            )}
            {displayProjects.map((relatedProject) => (
              <ListItem key={relatedProject.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flexGrow: 1 }} onClick={() => handleNavigation(relatedProject.id, 'project')} style={{ cursor: 'pointer' }}>
                  <ListItemText
                    primary={relatedProject.title}
                    secondary={relatedProject.description ? `${relatedProject.description.substring(0, 50)}...` : ''}
                  />
                </Box>
                {editing && (
                  <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleRemoveRelatedItem('related_projects', relatedProject.id); }}>
                    <DeleteIcon />
                  </IconButton>
                )}
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
                  onClick={() => openModal('related_models')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Model
                </Button>
              </ListItem>
            )}
            {displayModels.map((model) => (
              <ListItem key={model.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flexGrow: 1 }} onClick={() => handleNavigation(model.id, 'model')} style={{ cursor: 'pointer' }}>
                  <ListItemText
                    primary={model.name}
                    secondary={model.description ? `${model.description.substring(0, 50)}...` : ''}
                  />
                </Box>
                {editing && (
                  <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleRemoveRelatedItem('related_models', model.id); }}>
                    <DeleteIcon />
                  </IconButton>
                )}
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
                  onClick={() => openModal('related_publications')}
                  startIcon={<AddIcon />}
                  fullWidth
                >
                  Add Publication
                </Button>
              </ListItem>
            )}
            {displayPublications.map((pub, index) => (
              pub && pub.title ? (
                <ListItem key={pub.url} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <ListItemText
                      primary={
                        pub.url ? (
                          <Link href={pub.url} target="_blank" rel="noopener">
                            {pub.title.length > 50 ? `${pub.title.substring(0, 50)}...` : pub.title}
                          </Link>
                        ) : (
                          pub.title.length > 50 ? `${pub.title.substring(0, 50)}...` : pub.title
                        )
                      }
                      secondary={`Source: ${pub.journal}`}
                    />
                  </Box>
                  {editing && (
                    <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleRemoveRelatedItem('related_publications', pub.url); }}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ) : null
            ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
};

export default RelatedItems;
