import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, Typography, IconButton, Avatar, List, ListItem, ListItemText, Link } from '@mui/material';
import { pb } from '../services/pocketbaseClient';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';

/**
 * MyAccountPage component handles the user's profile management.
 * Users can view, edit, and update their profile information, including
 * personal details, research interests, and publications.
 */
const MyAccountPage = () => {
  // State for profile data and backup for canceling edits
  const [profile, setProfile] = useState({
    research_interests: [],
    publications: [],
    name: '',
    username: '',
    institution: '',
    department: '',
  });
  const [backupProfile, setBackupProfile] = useState(null);

  // States for managing new research interests and publications
  const [newResearchInterest, setNewResearchInterest] = useState('');
  const [newPublicationName, setNewPublicationName] = useState('');
  const [newPublicationUrl, setNewPublicationUrl] = useState('');

  // State to handle editing mode
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Current authenticated user
  const user = pb.authStore.model;

  // Fetch the user's profile data from PocketBase
  const fetchProfile = async () => {
    if (user) {
      try {
        const profiles = await pb.collection('profiles').getFullList({
          filter: `user='${user.id}'`,
          expand: 'user'
        });
        if (profiles.length > 0) {
          const profileData = profiles[0];
          const userData = profileData.expand.user;
          const updatedProfile = {
            ...profileData,
            name: userData.name || '',
            username: userData.username || '',
            profile_picture: userData.profile_picture || '',
            verified: userData.verified,
            emailVisibility: userData.emailVisibility,
            created: userData.created,
            updated: userData.updated,
            research_interests: profileData.research_interests || [],
            publications: profileData.publications || [],
          };
          setProfile(updatedProfile);
          setBackupProfile(updatedProfile);
        } else {
          const newProfile = {
            name: user.name || '',
            username: user.username || '',
            profile_picture: user.profile_picture || '',
            verified: user.verified,
            emailVisibility: user.emailVisibility,
            created: user.created,
            updated: user.updated,
            institution: '',
            department: '',
            research_interests: [],
            publications: [],
            user: user.id,
          };
          setProfile(newProfile);
          setBackupProfile(newProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle change in text fields
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle profile update
  const handleUpdate = async () => {
    console.log('Profile data before update:', profile);
    try {
      let data;
      if (profile.id) {
        data = await pb.collection('profiles').update(profile.id, {
          ...profile,
          research_interests: profile.research_interests,
          publications: JSON.stringify(profile.publications),
        });
      } else {
        data = await pb.collection('profiles').create({
          ...profile,
          research_interests: profile.research_interests,
          publications: JSON.stringify(profile.publications),
        });
      }
      console.log('Profile data after update:', data);

      // Update user data if necessary
      await pb.collection('users').update(user.id, {
        name: profile.name,
        username: profile.username,
      });

      alert('Profile updated successfully');
      fetchProfile(); // Fetch the updated profile after update
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  // Handle cancel edit action
  const handleCancel = () => {
    setProfile(backupProfile);
    setEditing(false);
  };

  // Toggle between edit and view mode
  const toggleEdit = () => {
    if (editing) {
      handleCancel();
    } else {
      setEditing(true);
    }
  };

  // Handle profile picture drop and upload
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await pb.collection('users').update(user.id, formData);
      console.log('Profile picture updated successfully in the backend');
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
    }
  }, [user]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*'
  });

  // Add a new research interest
  const addResearchInterest = () => {
    if (newResearchInterest.trim()) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        research_interests: [...prevProfile.research_interests, newResearchInterest],
      }));
      setNewResearchInterest('');
    }
  };

  // Remove an existing research interest
  const removeResearchInterest = (index) => {
    const updatedInterests = profile.research_interests.filter((_, i) => i !== index);
    setProfile({ ...profile, research_interests: updatedInterests });
  };

  // Add a new publication
  const addPublication = () => {
    if (newPublicationName.trim() && newPublicationUrl.trim()) {
      const newPublication = { name: newPublicationName, url: newPublicationUrl };
      setProfile((prevProfile) => ({
        ...prevProfile,
        publications: [...prevProfile.publications, newPublication],
      }));
      setNewPublicationName('');
      setNewPublicationUrl('');
    }
  };

  // Remove an existing publication
  const removePublication = (index) => {
    const updatedPublications = profile.publications.filter((_, i) => i !== index);
    setProfile({ ...profile, publications: updatedPublications });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4">My Account</Typography>
      <Box sx={{ mt: 2 }}>
        {profile && (
          <>
            <Box {...getRootProps()} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input {...getInputProps()} />
              <Avatar
                src={profile.profile_picture
                  ? `http://127.0.0.1:8090/api/files/_pb_users_auth_/${user.id}/${profile.profile_picture}`
                  : ''}
                sx={{ width: 80, height: 80 }}
              />
              <Button variant="contained" color="primary" sx={{ ml: 2 }} disabled={!editing}>
                Change Profile Picture
              </Button>
            </Box>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              name="username"
              value={profile.username}
              onChange={handleChange}
              disabled={!editing}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Institution"
              variant="outlined"
              fullWidth
              name="institution"
              value={profile.institution}
              onChange={handleChange}
              disabled={!editing}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Department"
              variant="outlined"
              fullWidth
              name="department"
              value={profile.department}
              onChange={handleChange}
              disabled={!editing}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Research Interests</Typography>
              <List>
                {Array.isArray(profile.research_interests) && profile.research_interests.map((interest, index) => (
                  <ListItem key={index} secondaryAction={
                    editing && (
                      <IconButton edge="end" aria-label="delete" onClick={() => removeResearchInterest(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }>
                    <ListItemText primary={interest} />
                  </ListItem>
                ))}
              </List>
              {editing && (
                <>
                  <TextField
                    label="New Research Interest"
                    variant="outlined"
                    fullWidth
                    value={newResearchInterest}
                    onChange={(e) => setNewResearchInterest(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="primary" onClick={addResearchInterest}>
                    Add Research Interest
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Publications</Typography>
              <List>
                {Array.isArray(profile.publications) && profile.publications.map((publication, index) => (
                  <ListItem key={index} secondaryAction={
                    editing && (
                      <IconButton edge="end" aria-label="delete" onClick={() => removePublication(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }>
                    <ListItemText
                      primary={<Link href={publication.url} target="_blank">{publication.name}</Link>}
                    />
                  </ListItem>
                ))}
              </List>
              {editing && (
                <>
                  <TextField
                    label="New Publication Name"
                    variant="outlined"
                    fullWidth
                    value={newPublicationName}
                    onChange={(e) => setNewPublicationName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="New Publication URL"
                    variant="outlined"
                    fullWidth
                    value={newPublicationUrl}
                    onChange={(e) => setNewPublicationUrl(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button variant="contained" color="primary" onClick={addPublication}>
                    Add Publication
                  </Button>
                </>
              )}
            </Box>
            {editing ? (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Save Changes
                </Button>
                <Button variant="contained" color="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button variant="contained" color="primary" onClick={toggleEdit}>
                Edit Profile
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default MyAccountPage;
