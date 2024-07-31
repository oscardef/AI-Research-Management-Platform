import React from 'react';
import { Box, Typography, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/system';

/**
 * StyledStatusBox Component
 * 
 * A styled box component to display the status with appropriate background color.
 * 
 * @param {Object} statusColor - The background color based on the status.
 * 
 * @returns {JSX.Element} The styled box component.
 */
const StyledStatusBox = styled(Box)(({ statusColor }) => ({
  backgroundColor: statusColor,
  color: '#fff',
  padding: '4px 8px',
  borderRadius: '4px',
  display: 'inline-block',
  marginTop: '8px',
  marginBottom: '8px',
}));

/**
 * getStatusColor Function
 * 
 * Determines the color associated with a specific status.
 * 
 * @param {string} status - The status string.
 * @returns {string} The corresponding color for the status.
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return '#4caf50'; // Green color for active status
    case 'inactive':
      return '#ff9800'; // Orange color for inactive status
    case 'complete':
      return '#2196f3'; // Blue color for complete status
    case 'pending':
      return '#9c27b0'; // Purple color for pending status
    default:
      return '#757575'; // Default gray color
  }
};

/**
 * StatusBox Component
 * 
 * Displays the status of an item, with an option to edit if in editing mode.
 * 
 * @param {string} status - The current status of the item.
 * @param {Function} handleChange - Function to handle status changes.
 * @param {boolean} editing - Indicates if the component is in editing mode.
 * 
 * @returns {JSX.Element} The rendered StatusBox component.
 */
const StatusBox = ({ status, handleChange, editing }) => (
  <StyledStatusBox statusColor={getStatusColor(status)}>
    {editing ? (
      <Select
        value={status}
        onChange={handleChange}
        name="status"
        sx={{ color: '#fff' }}
      >
        {/* Dropdown menu items for selecting status */}
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
