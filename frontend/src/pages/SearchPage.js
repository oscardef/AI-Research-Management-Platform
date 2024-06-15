import React, { useState } from 'react';
import { TextField, Button, Container, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import supabase from '../supabaseClient';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    console.log('Fetching data from Supabase...');
    const searchTermLower = `%${searchTerm.toLowerCase()}%`;

    try {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .ilike('username', searchTermLower);

      const { data: researchProjects, error: researchProjectsError } = await supabase
        .from('research_projects')
        .select('*')
        .ilike('title', searchTermLower);

      const { data: models, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .ilike('name', searchTermLower); // Make sure 'name' is the correct column name

      const { data: logs, error: logsError } = await supabase
        .from('logs')
        .select('*')
        .ilike('message', searchTermLower);

      if (usersError) throw usersError;
      if (researchProjectsError) throw researchProjectsError;
      if (modelsError) throw modelsError;
      if (logsError) throw logsError;

      setResults([...users, ...researchProjects, ...models, ...logs]);
      console.log('Data fetched:', [...users, ...researchProjects, ...models, ...logs]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <IconButton onClick={handleSearch} color="primary">
          <SearchIcon />
        </IconButton>
        <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Filter By
        </Button>
      </Box>
      <Box mt={4}>
        {results.length > 0 && (
          <div>
            <h2>Search Results:</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>{JSON.stringify(result)}</li>
              ))}
            </ul>
          </div>
        )}
      </Box>
    </Container>
  );
}

export default SearchPage;
