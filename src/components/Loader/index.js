import React from "react";
import { Box, Typography } from "@mui/material";

const MorphingLoader = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          mb: 2,
          animation: 'morph 3s ease-in-out infinite',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          '@keyframes morph': {
            '0%': {
              borderRadius: '50%',
              transform: 'rotate(0deg) scale(1)',
            },
            '25%': {
              borderRadius: '30%',
              transform: 'rotate(90deg) scale(1.1)',
            },
            '50%': {
              borderRadius: '5%',
              transform: 'rotate(180deg) scale(1)',
            },
            '75%': {
              borderRadius: '30%',
              transform: 'rotate(270deg) scale(1.1)',
            },
            '100%': {
              borderRadius: '50%',
              transform: 'rotate(360deg) scale(1)',
            },
          },
        }}
      />
      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default MorphingLoader;
