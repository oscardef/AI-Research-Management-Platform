import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pb } from '../services/pocketbaseClient';
import ResearchProjectResult from '../components/SearchResult/ResearchProjectResult';

const ResearchProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [researchProjectResults, setResearchProjectResults] = useState([]);
  const [researchProjectPage, setResearchProjectPage] = useState(1);
  const [totalResearchProjectPages, setTotalResearchProjectPages] = useState(1);
  const RESULTS_PER_PAGE = 20;

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

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchResearchProjects();
    }
  }, [researchProjectPage, searchTerm]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

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
