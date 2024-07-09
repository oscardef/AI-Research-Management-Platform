// ResearchPage.js
import React, { useState } from 'react';
import {
    Box, Grid, Typography, TextField, Button, IconButton, Link, List, ListItem, ListItemText
} from '@mui/material';
import { useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import useProject from '../hooks/useProject';
import { pb } from '../services/pocketbaseClient';

const ResearchPage = () => {
    const { projectId } = useParams();
    const {
        project, loading, relatedProjects, relatedModels, relatedPublications, collaborators,
        setProject
    } = useProject(projectId);
    const [editing, setEditing] = useState(false);
    const [tempProject, setTempProject] = useState({});

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

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!project) {
        return <Typography>No project found</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" align="center">
                <TextField
                    variant="outlined"
                    fullWidth
                    value={editing ? tempProject.title || '' : project.title}
                    onChange={handleChange}
                    name="title"
                    disabled={!editing}
                />
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={8}>
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={editing ? tempProject.description || '' : project.description}
                        onChange={handleChange}
                        name="description"
                        disabled={!editing}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Status"
                        variant="outlined"
                        fullWidth
                        value={editing ? tempProject.status || '' : project.status}
                        onChange={handleChange}
                        name="status"
                        disabled={!editing}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Tags"
                        variant="outlined"
                        fullWidth
                        value={editing ? tempProject.tags || '' : project.tags}
                        onChange={handleChange}
                        name="tags"
                        disabled={!editing}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Details"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={editing ? tempProject.details || '' : project.details}
                        onChange={handleChange}
                        name="details"
                        disabled={!editing}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" sx={{ mb: 1 }}>Collaborators</Typography>
                    <List>
                        {collaborators.map((collaborator) => (
                            <ListItem key={collaborator.id}>
                                <ListItemText primary={collaborator.name} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Related Projects</Typography>
                    <List>
                        {relatedProjects.map((project) => (
                            <ListItem key={project.id}>
                                <ListItemText primary={project.title} />
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Related Models</Typography>
                    <List>
                        {relatedModels.map((model) => (
                            <ListItem key={model.id}>
                                <ListItemText primary={model.name} />
                            </ListItem>
                        ))}
                    </List>
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Related Publications</Typography>
                    <List>
                        {relatedPublications.map((pub, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={
                                        <Link href={pub.url} target="_blank" rel="noopener">
                                            {pub.name}
                                        </Link>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
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
            </Box>
        </Box>
    );
};

export default ResearchPage;
