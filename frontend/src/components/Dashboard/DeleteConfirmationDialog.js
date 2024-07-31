import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

/**
 * DeleteConfirmationDialog Component
 * 
 * This component renders a confirmation dialog that prompts the user to confirm or cancel a delete action. 
 * It is designed to be reusable for various types of items that may require deletion.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.open - Controls whether the dialog is open.
 * @param {function} props.handleClose - Function to handle closing the dialog without confirming.
 * @param {function} props.handleConfirm - Function to handle confirming the delete action.
 * @param {Object} props.deleteItem - The item to be deleted, used to display a confirmation message. Should have 'name' or 'title' property.
 * 
 * @returns {React.Element} The rendered DeleteConfirmationDialog component.
 */
const DeleteConfirmationDialog = ({ open, handleClose, handleConfirm, deleteItem }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        {/* Display a confirmation message, using either the name or title of the deleteItem */}
        <Typography>Are you sure you wish to delete {deleteItem?.name || deleteItem?.title}?</Typography>
      </DialogContent>
      <DialogActions>
        {/* Button to cancel the delete action and close the dialog */}
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        {/* Button to confirm the delete action and close the dialog */}
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
