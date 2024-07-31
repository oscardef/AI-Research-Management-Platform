import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pb } from '../services/pocketbaseClient';
import ModelResult from '../components/SearchResult/ModelResult';

/**
 * ModelsPage component is responsible for displaying and managing the list of AI models.
 * It includes functionalities for searching, pagination, and displaying model details.
 */
const ModelsPage = () => {
  // State to store the current search term entered by the user
  const [searchTerm, setSearchTerm] = useState('');
  // State to store the list of model results fetched from the API
  const [modelResults, setModelResults] = useState([]);
  // State to manage the current page number in the pagination
  const [modelPage, setModelPage] = useState(1);
  // State to store the total number of pages available for the model results
  const [totalModelPages, setTotalModelPages] = useState(1);

  // Constant defining the number of results to show per page
  const RESULTS_PER_PAGE = 20;

  // Function to fetch models from the PocketBase API
  const fetchModels = async () => {
    try {
      const response = await pb.collection('models').getList(modelPage, RESULTS_PER_PAGE, {
        expand: 'collaborators'
      });

      // Map the fetched models to include collaborators
      const models = response.items.map(model => ({
        ...model,
        collaborators: model.expand?.collaborators ? model.expand.collaborators.map(c => ({ id: c.id, name: c.name })) : [],
      }));

      setModelResults(models);
      setTotalModelPages(Math.ceil(response.totalItems / RESULTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  // Function to handle the search functionality
  const handleSearch = async () => {
    if (!searchTerm) {
      fetchModels();
      return;
    }

    try {
      const response = await pb.collection('models').getList(modelPage, RESULTS_PER_PAGE, {
        filter: `name ~ "${searchTerm}" || tags ~ "${searchTerm}" || collaborators.name ~ "${searchTerm}"`,
        expand: 'collaborators'
      });

      // Map the fetched models to include collaborators
      const models = response.items.map(model => ({
        ...model,
        collaborators: model.expand?.collaborators ? model.expand.collaborators.map(c => ({ id: c.id, name: c.name })) : [],
      }));

      setModelResults(models);
      setTotalModelPages(Math.ceil(response.totalItems / RESULTS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  // Effect hook to fetch models whenever the page or search term changes
  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchModels();
    }
  }, [modelPage, searchTerm]);

  // Handle the Enter key press for initiating the search
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle page changes for pagination
  const handlePageChange = (direction) => {
    setModelPage(prev => Math.max(1, prev + direction));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Search box and button */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search Models"
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
        {/* Display model results */}
        {modelResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Models</Typography>
              {/* Pagination controls */}
              <Box>
                <IconButton onClick={() => handlePageChange(-1)} disabled={modelPage === 1}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="body2" display="inline">{modelPage} / {totalModelPages}</Typography>
                <IconButton onClick={() => handlePageChange(1)} disabled={modelPage === totalModelPages}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>
            </Box>
            {/* Render each model result */}
            {modelResults.map(model => (
              <ModelResult key={model.id} model={model} />
            ))}
          </Box>
        )}
        {modelResults.length === 0 && <Typography>No results found</Typography>}
      </Box>
    </Box>
  );
};

export default ModelsPage;

