import React from 'react';
import { Alert, Snackbar } from "@mui/material";

const Notification = ({ open, handleCloseBar, id }) => {
  return (
    <Snackbar open={open} autoHideDuration={1500} onClose={handleCloseBar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert severity="success" sx={{ width: '100%' }}>
        {id} successfuly added to your build
      </Alert>
    </Snackbar>
  )
}

export default Notification;