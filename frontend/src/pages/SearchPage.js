import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Button, Menu, MenuItem, Checkbox, FormControlLabel, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pb } from '../services/pocketbaseClient';
import axios from 'axios';
import ProfileResult from '../components/SearchResult/ProfileResult';
import ModelResult from '../components/SearchResult/ModelResult';
import ResearchProjectResult from '../components/SearchResult/ResearchProjectResult';
import PublicationResult from '../components/SearchResult/PublicationResult';

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
  const [profilePage, setProfilePage] = useState(1);
  const [modelPage, setModelPage] = useState(1);
  const [researchProjectPage, setResearchProjectPage] = useState(1);
  const [publicationPage, setPublicationPage] = useState(1);
  const [totalProfilePages, setTotalProfilePages] = useState(1);
  const [totalModelPages, setTotalModelPages] = useState(1);
  const [totalResearchProjectPages, setTotalResearchProjectPages] = useState(1);
  const [totalPublicationPages, setTotalPublicationPages] = useState(1);
  const RESULTS_PER_PAGE = 10; // Number of results per page

  const handleSearch = async () => {
    if (!searchTerm) {
      return; // Do not perform search if the search term is empty
    }

    try {
      const promises = [];

      if (filters.profiles) {
        promises.push(
          pb.collection('profiles').getList(profilePage, RESULTS_PER_PAGE, {
            filter: `user.name ~ "${searchTerm}" || department ~ "${searchTerm}" || research_interests ~ "${searchTerm}" || institution ~ "${searchTerm}"`,
            expand: 'user'
          }).then(response => {
            return {
              items: response.items.map(profile => {
                const user = profile.expand.user;
                return {
                  ...profile,
                  name: user.name,
                  profile_picture: user.profile_picture,
                  institution: profile.institution,
                  department: profile.department,
                  user: user.id // Add the user ID here
                };
              }),
              totalItems: response.totalItems
            };
          })
        );
      }
      if (filters.models) {
        promises.push(
          pb.collection('models').getList(modelPage, RESULTS_PER_PAGE, {
            filter: `name ~ "${searchTerm}" || tags ~ "${searchTerm}" || collaborators.name ~ "${searchTerm}"`,
            expand: 'collaborators'
          }).then(response => ({
            items: response.items.map(model => ({
              ...model,
              collaborators: model.expand?.collaborators ? model.expand.collaborators.map(c => ({ id: c.id, name: c.name })) : [],
            })),
            totalItems: response.totalItems
          }))
        );
      }
      if (filters.researchProjects) {
        promises.push(
          pb.collection('research_projects').getList(researchProjectPage, RESULTS_PER_PAGE, {
            filter: `title ~ "${searchTerm}" || tags ~ "${searchTerm}" || collaborators.name ~ "${searchTerm}"`,
            expand: 'collaborators'
          }).then(response => ({
            items: response.items.map(project => ({
              ...project,
              collaborators: project.expand?.collaborators ? project.expand.collaborators.map(c => ({ id: c.id, name: c.name })) : [],
            })),
            totalItems: response.totalItems
          }))
        );
      }
      if (filters.publications) {
        promises.push(
          axios.get(`https://api.crossref.org/works?query=${searchTerm}&rows=${RESULTS_PER_PAGE}&offset=${(publicationPage - 1) * RESULTS_PER_PAGE}`)
            .then(response => ({
              items: response.data.message.items ? response.data.message.items.map(item => ({
                title: item.title ? item.title[0] : 'No Title',
                author: item.author ? item.author.map(a => a.family).join(', ') : 'Unknown Author',
                journal: item['container-title'] ? item['container-title'][0] : 'Unknown Journal',
                url: item.URL
              })) : [],
              totalResults: response.data.message['total-results']
            }))
        );
      }

      const results = await Promise.all(promises);

      const profileResults = filters.profiles ? results[0].items : [];
      const totalProfilePages = filters.profiles ? Math.ceil(results[0].totalItems / RESULTS_PER_PAGE) : 1;
      const modelResults = filters.models ? results[filters.profiles ? 1 : 0].items : [];
      const totalModelPages = filters.models ? Math.ceil(results[filters.profiles ? 1 : 0].totalItems / RESULTS_PER_PAGE) : 1;
      const researchProjectResults = filters.researchProjects ? results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0)].items : [];
      const totalResearchProjectPages = filters.researchProjects ? Math.ceil(results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0)].totalItems / RESULTS_PER_PAGE) : 1;
      const publicationResults = filters.publications ? results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0) + (filters.researchProjects ? 1 : 0)].items : [];
      const totalPublicationPages = filters.publications ? Math.ceil(results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0) + (filters.researchProjects ? 1 : 0)].totalResults / RESULTS_PER_PAGE) : 1;

      setProfileResults(profileResults);
      setTotalProfilePages(totalProfilePages);
      setModelResults(modelResults);
      setTotalModelPages(totalModelPages);
      setResearchProjectResults(researchProjectResults);
      setTotalResearchProjectPages(totalResearchProjectPages);
      setPublicationResults(publicationResults);
      setTotalPublicationPages(totalPublicationPages);

      console.log('Data fetched:', { profileResults, modelResults, researchProjectResults, publicationResults });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [filters, profilePage, modelPage, researchProjectPage, publicationPage]);

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

  const handlePageChange = (type, direction) => {
    switch (type) {
      case 'profiles':
        setProfilePage(prev => Math.max(1, prev + direction));
        break;
      case 'models':
        setModelPage(prev => Math.max(1, prev + direction));
        break;
      case 'researchProjects':
        setResearchProjectPage(prev => Math.max(1, prev + direction));
        break;
      case 'publications':
        setPublicationPage(prev => Math.max(1, prev + direction));
        break;
      default:
        break;
    }
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Profiles</Typography>
              <Box>
                <IconButton
                  onClick={() => handlePageChange('profiles', -1)}
                  disabled={profilePage === 1}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{profilePage} / {totalProfilePages}</Typography>
                <IconButton
                  onClick={() => handlePageChange('profiles', 1)}
                  disabled={profilePage === totalProfilePages}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {profileResults.map((profile) => (
              <ProfileResult key={profile.id} profile={profile} />
            ))}
          </Box>
        )}
        {modelResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Models</Typography>
              <Box>
                <IconButton
                  onClick={() => handlePageChange('models', -1)}
                  disabled={modelPage === 1}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{modelPage} / {totalModelPages}</Typography>
                <IconButton
                  onClick={() => handlePageChange('models', 1)}
                  disabled={modelPage === totalModelPages}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {modelResults.map((model) => (
              <ModelResult key={model.id} model={model} />
            ))}
          </Box>
        )}
        {researchProjectResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Research Projects</Typography>
              <Box>
                <IconButton
                  onClick={() => handlePageChange('researchProjects', -1)}
                  disabled={researchProjectPage === 1}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{researchProjectPage} / {totalResearchProjectPages}</Typography>
                <IconButton
                  onClick={() => handlePageChange('researchProjects', 1)}
                  disabled={researchProjectPage === totalResearchProjectPages}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {researchProjectResults.map((project) => (
              <ResearchProjectResult key={project.id} project={project} />
            ))}
          </Box>
        )}
        {publicationResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Publications</Typography>
              <Box>
                <IconButton
                  onClick={() => handlePageChange('publications', -1)}
                  disabled={publicationPage === 1}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{publicationPage} / {totalPublicationPages}</Typography>
                <IconButton
                  onClick={() => handlePageChange('publications', 1)}
                  disabled={publicationPage === totalPublicationPages}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
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
