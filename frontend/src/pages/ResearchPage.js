// src/pages/ResearchPage.js

import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';

const ResearchPage = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ backgroundColor: 'grey', padding: 2 }}>
            <Typography variant="h5" align="center" color="white">
              Research Project Title
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'lightblue', padding: 2 }}>
                <Typography variant="h6">
                  Project Description
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'lightblue', padding: 2 }}>
                <Typography variant="h6">
                  Project Details
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'red', padding: 2 }}>
                <Button variant="contained" fullWidth style={{ backgroundColor: 'red', color: 'white' }}>
                  Related Research Projects
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'red', padding: 2 }}>
                <Button variant="contained" fullWidth style={{ backgroundColor: 'red', color: 'white' }}>
                  Linked AI Models
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'red', padding: 2 }}>
                <Button variant="contained" fullWidth style={{ backgroundColor: 'red', color: 'white' }}>
                  Linked Datasets
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ backgroundColor: 'red', padding: 2 }}>
                <Button variant="contained" fullWidth style={{ backgroundColor: 'red', color: 'white' }}>
                  Related Publications (PURE)
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResearchPage;
