import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pb } from '../services/pocketbaseClient';
import ProfileResult from '../components/SearchResult/ProfileResult';

const ProfilesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileResults, setProfileResults] = useState([]);
  const [profilePage, setProfilePage] = useState(1);
  const [totalProfilePages, setTotalProfilePages] = useState(1);
  const RESULTS_PER_PAGE = 20;

  const fetchProfiles = async () => {
    try {
      const response = await pb.collection('profiles').getList(profilePage, RESULTS_PER_PAGE, {
        expand: 'user'
      });

      const profiles = response.items.map(profile => {
        const user = profile.expand.user;
        return {
          ...profile,
          name: user.name,
          profile_picture: user.profile_picture,
          institution: profile.institution,
          department: profile.department,
          user: user.id
        };
      });

      setProfileResults(profiles);
      setTotalProfilePages(Math.ceil(response.totalItems / RESULTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchProfiles();
      return;
    }

    try {
      const response = await pb.collection('profiles').getList(profilePage, RESULTS_PER_PAGE, {
        filter: `user.name ~ "${searchTerm}" || department ~ "${searchTerm}" || research_interests ~ "${searchTerm}" || institution ~ "${searchTerm}"`,
        expand: 'user'
      });

      const profiles = response.items.map(profile => {
        const user = profile.expand.user;
        return {
          ...profile,
          name: user.name,
          profile_picture: user.profile_picture,
          institution: profile.institution,
          department: profile.department,
          user: user.id
        };
      });

      setProfileResults(profiles);
      setTotalProfilePages(Math.ceil(response.totalItems / RESULTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchProfiles();
    }
  }, [profilePage, searchTerm]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (direction) => {
    setProfilePage(prev => Math.max(1, prev + direction));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search Profiles"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box sx={{ mt: 2 }}>
        {profileResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Profiles</Typography>
              <Box>
                <IconButton onClick={() => handlePageChange(-1)} disabled={profilePage === 1}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{profilePage} / {totalProfilePages}</Typography>
                <IconButton onClick={() => handlePageChange(1)} disabled={profilePage === totalProfilePages}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {profileResults.map(profile => (
              <ProfileResult key={profile.id} profile={profile} />
            ))}
          </Box>
        )}
        {profileResults.length === 0 && <Typography>No results found</Typography>}
      </Box>
    </Box>
  );
};

export default ProfilesPage;
