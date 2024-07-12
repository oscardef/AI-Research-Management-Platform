import React from 'react';
import { Box, Typography, MenuItem, Select } from '@mui/material';
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

const StatusBox = ({ status, handleChange, editing }) => (
  <StyledStatusBox statusColor={getStatusColor(status)}>
    {editing ? (
      <Select
        value={status}
        onChange={handleChange}
        name="status"
        sx={{ color: '#fff' }}
      >
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="inactive">Inactive</MenuItem>
        <MenuItem value="complete">Complete</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
      </Select>
    ) : (
      <Typography variant="body2">Status: {status}</Typography>
    )}
  </StyledStatusBox>
);

export default StatusBox;
