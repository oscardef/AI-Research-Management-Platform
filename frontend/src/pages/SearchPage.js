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

/**
 * SearchPage component for conducting searches across profiles, models, research projects, and publications.
 * Allows filtering of search results and supports pagination.
 */
const SearchPage = () => {
  // State variables
  const [searchTerm, setSearchTerm] = useState(''); // The search input value
  const [profileResults, setProfileResults] = useState([]); // Profile search results
  const [modelResults, setModelResults] = useState([]); // Model search results
  const [researchProjectResults, setResearchProjectResults] = useState([]); // Research project search results
  const [publicationResults, setPublicationResults] = useState([]); // Publication search results
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for filter menu
  const [filters, setFilters] = useState({
    profiles: true,
    models: true,
    researchProjects: true,
    publications: true,
  }); // Filter states
  const [profilePage, setProfilePage] = useState(1); // Current page for profile results
  const [modelPage, setModelPage] = useState(1); // Current page for model results
  const [researchProjectPage, setResearchProjectPage] = useState(1); // Current page for research project results
  const [publicationPage, setPublicationPage] = useState(1); // Current page for publication results
  const [totalProfilePages, setTotalProfilePages] = useState(1); // Total pages for profile results
  const [totalModelPages, setTotalModelPages] = useState(1); // Total pages for model results
  const [totalResearchProjectPages, setTotalResearchProjectPages] = useState(1); // Total pages for research project results
  const [totalPublicationPages, setTotalPublicationPages] = useState(1); // Total pages for publication results
  const RESULTS_PER_PAGE = 10; // Number of results per page

  /**
   * Executes the search operation based on the current filters and search term.
   * Fetches data from PocketBase for profiles, models, and research projects, and from CrossRef for publications.
   */
  const handleSearch = async () => {
    if (!searchTerm) {
      return; // Do not perform search if the search term is empty
    }

    try {
      const promises = [];

      // Fetch profile results if the filter is active
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

      // Fetch model results if the filter is active
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

      // Fetch research project results if the filter is active
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

      // Fetch publication results if the filter is active
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

      // Await all promises and process results
      const results = await Promise.all(promises);

      // Process and set the results for each type
      const profileResults = filters.profiles ? results[0].items : [];
      const totalProfilePages = filters.profiles ? Math.ceil(results[0].totalItems / RESULTS_PER_PAGE) : 1;
      const modelResults = filters.models ? results[filters.profiles ? 1 : 0].items : [];
      const totalModelPages = filters.models ? Math.ceil(results[filters.profiles ? 1 : 0].totalItems / RESULTS_PER_PAGE) : 1;
      const researchProjectResults = filters.researchProjects ? results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0)].items : [];
      const totalResearchProjectPages = filters.researchProjects ? Math.ceil(results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0)].totalItems / RESULTS_PER_PAGE) : 1;
      const publicationResults = filters.publications ? results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0) + (filters.researchProjects ? 1 : 0)].items : [];
      const totalPublicationPages = filters.publications ? Math.ceil(results[(filters.profiles ? 1 : 0) + (filters.models ? 1 : 0) + (filters.researchProjects ? 1 : 0)].totalResults / RESULTS_PER_PAGE) : 1;

      // Update state with the fetched data
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

  // Effect hook to fetch data when filters or page numbers change
  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    }
  }, [filters, profilePage, modelPage, researchProjectPage, publicationPage]);

  /**
   * Handles key press events, triggering the search if the Enter key is pressed.
   * @param {object} event - The event object from the key press.
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Opens the filter menu.
   * @param {object} event - The event object from the button click.
   */
  const handleFilterMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the filter menu.
   */
  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Updates the filter state when a filter option is changed.
   * @param {object} event - The event object from the checkbox change.
   */
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.checked,
    });
  };

  /**
   * Handles pagination changes for the various result types.
   * @param {string} type - The type of result to paginate (profiles, models, researchProjects, publications).
   * @param {number} direction - The direction to paginate (-1 for previous, 1 for next).
   */
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
