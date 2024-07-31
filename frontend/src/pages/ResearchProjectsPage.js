import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pb } from '../services/pocketbaseClient';
import ResearchProjectResult from '../components/SearchResult/ResearchProjectResult';

/**
 * ResearchProjectsPage component for displaying and searching research projects.
 * This component provides a search bar and paginated results for research projects.
 */
const ResearchProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the current search term
  const [researchProjectResults, setResearchProjectResults] = useState([]); // State to hold the search results for research projects
  const [researchProjectPage, setResearchProjectPage] = useState(1); // State to manage the current page of results
  const [totalResearchProjectPages, setTotalResearchProjectPages] = useState(1); // State to hold the total number of result pages
  const RESULTS_PER_PAGE = 20; // Constant defining the number of results per page

  /**
   * Fetches the list of research projects from the server.
   * Expands the collaborators associated with each project for detailed display.
   */
  const fetchResearchProjects = async () => {
    try {
      const response = await pb.collection('research_projects').getList(researchProjectPage, RESULTS_PER_PAGE, {
        expand: 'collaborators'
      });

      const projects = response.items.map(project => ({
        ...project,
        collaborators: project.expand?.collaborators ? project.expand.collaborators.map(c => ({ id: c.id, name: c.name })) : [],
      }));

      setResearchProjectResults(projects);
      setTotalResearchProjectPages(Math.ceil(response.totalItems / RESULTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching research projects:', error);
    }
  };

  /**
   * Handles search functionality based on the search term.
   * If no search term is provided, fetches all research projects.
   * Otherwise, filters projects by the search term.
   */
  const handleSearch = async () => {
    if (!searchTerm) {
      fetchResearchProjects();
      return;
    }

    try {
      const response = await pb.collection('research_projects').getList(researchProjectPage, RESULTS_PER_PAGE, {
        filter: `title ~ "${searchTerm}" || tags ~ "${searchTerm}" || collaborators.name ~ "${searchTerm}"`,
        expand: 'collaborators'
      });

      const projects = response.items.map(project => ({
        ...project,
        collaborators: project.expand?.collaborators ? project.expand.collaborators.map(c => ({ id: c.id, name: c.name })) : [],
      }));

      setResearchProjectResults(projects);
      setTotalResearchProjectPages(Math.ceil(response.totalItems / RESULTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching research projects:', error);
    }
  };

  // Effect hook to fetch projects when the page number or search term changes
  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchResearchProjects();
    }
  }, [researchProjectPage, searchTerm]);

  /**
   * Handles the Enter key press to trigger the search.
   * @param {object} event - The keypress event object.
   */
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Handles pagination for the project results.
   * @param {number} direction - The direction to change the page (-1 for previous, 1 for next).
   */
  const handlePageChange = (direction) => {
    setResearchProjectPage(prev => Math.max(1, prev + direction));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search Research Projects"
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
        {researchProjectResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Research Projects</Typography>
              <Box>
                <IconButton onClick={() => handlePageChange(-1)} disabled={researchProjectPage === 1}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{researchProjectPage} / {totalResearchProjectPages}</Typography>
                <IconButton onClick={() => handlePageChange(1)} disabled={researchProjectPage === totalResearchProjectPages}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {researchProjectResults.map(project => (
              <ResearchProjectResult key={project.id} project={project} />
            ))}
          </Box>
        )}
        {researchProjectResults.length === 0 && <Typography>No results found</Typography>}
      </Box>
    </Box>
  );
};

export default ResearchProjectsPage;
