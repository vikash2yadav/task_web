import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { purpleGradient } from "../../constants/color";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: purpleGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ color: "white" }}>
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "6rem", md: "8rem" },
              fontWeight: "bold",
              marginBottom: 1,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            404
          </Typography>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Page Not Found!
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              marginBottom: 4,
              opacity: 0.9,
              lineHeight: 1.6,
              maxWidth: "400px",
              margin: "0 auto 3rem",
            }}
          >
            Sorry, we couldn't find the page you're looking for.
          </Typography>

          {/* Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            component={Link}
            to="/dashboard"
            sx={{
              padding: "12px 40px",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "none",
              border: "2px solid white",
              color: "white",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              minWidth: "160px",
              "&:hover": {
                backgroundColor: "white",
                color: "#667eea",
                transform: "translateY(-3px)",
                boxShadow: "0 10px 25px rgba(255,255,255,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
