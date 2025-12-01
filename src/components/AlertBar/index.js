import { Snackbar } from "@mui/material";
import React from "react";

const AlertBar = ({ open, handleClose, action }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={7000}
      onClose={handleClose}
      message="Note archived"
      action={action}
    />
  );
};

export default AlertBar;
