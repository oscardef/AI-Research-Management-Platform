import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { pb } from '../services/pocketbaseClient';
import ModelResult from '../components/SearchResult/ModelResult';

const ModelsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modelResults, setModelResults] = useState([]);
  const [modelPage, setModelPage] = useState(1);
  const [totalModelPages, setTotalModelPages] = useState(1);
  const RESULTS_PER_PAGE = 20;

  const fetchModels = async () => {
    try {
      const response = await pb.collection('models').getList(modelPage, RESULTS_PER_PAGE, {
        expand: 'collaborators'
      });

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

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchModels();
    }
  }, [modelPage, searchTerm]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (direction) => {
    setModelPage(prev => Math.max(1, prev + direction));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
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
        {modelResults.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Models</Typography>
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
