import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Button, Menu, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { pb } from '../services/pocketbaseClient';
import axios from 'axios';
import ProfileResult from '../components/Profile/ProfileResult';
import ModelResult from '../components/Model/ModelResult';
import ResearchProjectResult from '../components/ResearchProject/ResearchProjectResult';
import PublicationResult from '../components/Publication/PublicationResult';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profileResults, setProfileResults] = useState([]);
  const [modelResults, setModelResults] = useState([]);
  const [researchProjectResults, setResearchProjectResults] = useState([]);
  const [publicationResults, setPublicationResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilters] = useState({
    profiles: true,
    models: true,
    researchProjects: true,
    publications: true,
  });

  const handleSearch = async () => {
    if (!searchTerm) {
      return; // Do not perform search if the search term is empty
    }

    console.log('Fetching data from PocketBase and external APIs...');
    try {
      const promises = [];
      const searchTerms = searchTerm.split(' ');

      if (filters.profiles) {
        let profileQuery = pb.collection('users').getFullList({
          filter: `name ~ "${searchTerm}"`,
        });
        promises.push(profileQuery);
      }
      if (filters.models) {
        promises.push(
          pb.collection('models').getFullList({
            filter: `name ~ "${searchTerm}"`,
          })
        );
      }
      if (filters.researchProjects) {
        promises.push(
          pb.collection('research_projects').getFullList({
            filter: `title ~ "${searchTerm}"`,
          })
        );
      }
      if (filters.publications) {
        promises.push(
          axios.get(`https://api.crossref.org/works?query=${searchTerm}`)
            .then(response => response.data.message.items ? response.data.message.items.map(item => ({
              title: item.title ? item.title[0] : 'No Title',
              author: item.author ? item.author.map(a => a.family).join(', ') : 'Unknown Author',
              journal: item['container-title'] ? item['container-title'][0] : 'Unknown Journal',
              url: item.URL
            })) : [])
        );
      }

      const results = await Promise.all(promises);

      const profileResults = results[0] || [];
      const modelResults = results[1] || [];
      const researchProjectResults = results[2] || [];
      const publicationResults = results[3] || [];

      setProfileResults(profileResults);
      setModelResults(modelResults);
      setResearchProjectResults(researchProjectResults);
      setPublicationResults(publicationResults);

      console.log('Data fetched:', { profileResults, modelResults, researchProjectResults, publicationResults });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [filters]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
        <Button
          aria-controls="filter-menu"
          aria-haspopup="true"
          onClick={handleFilterMenuClick}
          variant="contained"
        >
          Filter By
        </Button>
        <Menu
          id="filter-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleFilterMenuClose}
        >
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.profiles}
                  onChange={handleFilterChange}
                  name="profiles"
                />
              }
              label="Profiles"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.models}
                  onChange={handleFilterChange}
                  name="models"
                />
              }
              label="Models"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.researchProjects}
                  onChange={handleFilterChange}
                  name="researchProjects"
                />
              }
              label="Research Projects"
            />
          </MenuItem>
          <MenuItem>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.publications}
                  onChange={handleFilterChange}
                  name="publications"
                />
              }
              label="Publications"
            />
          </MenuItem>
        </Menu>
      </Box>
      <Box sx={{ mt: 2 }}>
        {profileResults.length > 0 && (
          <Box>
            <Typography variant="h6">Profiles</Typography>
            {profileResults.map((profile, index) => (
              <ProfileResult key={index} profile={profile} />
            ))}
          </Box>
        )}
        {modelResults.length > 0 && (
          <Box>
            <Typography variant="h6">Models</Typography>
            {modelResults.map((model, index) => (
              <ModelResult key={index} model={model} />
            ))}
          </Box>
        )}
        {researchProjectResults.length > 0 && (
          <Box>
            <Typography variant="h6">Research Projects</Typography>
            {researchProjectResults.map((project, index) => (
              <ResearchProjectResult key={index} project={project} />
            ))}
          </Box>
        )}
        {publicationResults.length > 0 && (
          <Box>
            <Typography variant="h6">Publications</Typography>
            {publicationResults.map((publication, index) => (
              <PublicationResult key={index} publication={publication} />
            ))}
          </Box>
        )}
        {profileResults.length === 0 && modelResults.length === 0 && researchProjectResults.length === 0 && publicationResults.length === 0 && (
          <Typography>No results found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
