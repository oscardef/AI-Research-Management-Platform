// StatusBox.js
import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledStatusBox = styled(Box)(({ statusColor }) => ({
  backgroundColor: statusColor,
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  marginTop: '8px',
  marginBottom: '8px',
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return '#4caf50';
    case 'inactive':
      return '#ff9800';
    case 'complete':
      return '#2196f3';
    case 'pending':
      return '#9c27b0';
    default:
      return '#757575';
  }
};

const StatusBox = ({ status }) => (
  <StyledStatusBox statusColor={getStatusColor(status)}>
    <Typography variant="body2">Status: {status}</Typography>
  </StyledStatusBox>
);

export default StatusBox;
