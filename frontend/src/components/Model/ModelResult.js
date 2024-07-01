import React from 'react';
import { Box, Typography } from '@mui/material';

const ModelResult = ({ model }) => {
  return (
    <Box sx={{ mb: 2, p: 2, border: '1px solid #ccc' }}>
      <Typography variant="h6">{model.name}</Typography>
      <Typography variant="body1">{model.description}</Typography>
    </Box>
  );
};

export default ModelResult;
