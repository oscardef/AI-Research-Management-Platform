import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem, Autocomplete } from '@mui/material';

const ProjectDialog = ({ open, handleClose, handleCreate, newProject, setNewProject }) => {
  return (
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
        <TextField
          select
          margin="dense"
          label="Public"
          name="public"
          fullWidth
          variant="outlined"
          value={newProject.public}
          onChange={(e) => setNewProject({ ...newProject, public: e.target.value })}
          sx={{ mb: 2 }}
        >
          <MenuItem value={true}>Yes</MenuItem>
          <MenuItem value={false}>No</MenuItem>
        </TextField>
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
