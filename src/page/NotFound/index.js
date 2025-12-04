import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import RefreshIcon from "@mui/icons-material/Refresh";
import { purpleGradient } from "../../constants/color";

const NotFound = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Add animation classes on mount
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        background: purpleGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {/* Floating 404 Numbers */}
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            fontSize: { xs: "8rem", md: "12rem" },
            fontWeight: "bold",
            opacity: 0.05,
            color: "white",
            top: "10%",
            left: "5%",
            animation: "float404 25s infinite ease-in-out",
            userSelect: "none",
          }}
        >
          404
        </Typography>
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            fontSize: { xs: "6rem", md: "10rem" },
            fontWeight: "bold",
            opacity: 0.03,
            color: "white",
            bottom: "15%",
            right: "10%",
            animation: "float404 30s infinite ease-in-out reverse",
            userSelect: "none",
          }}
        >
          404
        </Typography>

        {/* Animated Circles */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,255,255,${0.03 + i * 0.01}) 0%, transparent 70%)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `floatCircle${i % 3 + 1} ${15 + i * 3}s infinite ease-in-out`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        {/* Moving Lines */}
        <Box
          sx={{
            position: "absolute",
            width: "150%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            top: "30%",
            left: "-50%",
            transform: "rotate(45deg)",
            animation: "slideLine 8s infinite linear",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "150%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            bottom: "40%",
            left: "-50%",
            transform: "rotate(-45deg)",
            animation: "slideLine 10s infinite linear reverse",
          }}
        />

        {/* Pulse Effect */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(80vw, 600px)",
            height: "min(80vw, 600px)",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
            animation: "pulse404 6s infinite ease-in-out",
          }}
        />
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float404 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.05; }
            25% { transform: translate(20px, -15px) rotate(1deg); opacity: 0.03; }
            50% { transform: translate(-10px, 10px) rotate(-1deg); opacity: 0.07; }
            75% { transform: translate(15px, 20px) rotate(2deg); opacity: 0.02; }
          }
          @keyframes floatCircle1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -20px) scale(1.1); }
            66% { transform: translate(-20px, 15px) scale(0.9); }
          }
          @keyframes floatCircle2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-25px, -25px) scale(1.2); }
          }
          @keyframes floatCircle3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(15px, 25px) scale(0.8); }
            75% { transform: translate(-25px, 15px) scale(1.3); }
          }
          @keyframes slideLine {
            0% { transform: rotate(45deg) translateX(-100%); }
            100% { transform: rotate(45deg) translateX(100%); }
          }
          @keyframes pulse404 {
            0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(0.95); }
            50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.05); }
          }
          @keyframes shake404 {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow404 {
            0%, 100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 0 rgba(255,255,255,0); }
            50% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.3); }
          }
        `}
      </style>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ color: "white" }}>
          {/* 404 Number with Animation */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "8rem", md: "10rem" },
              fontWeight: "bold",
              marginBottom: 1,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              animation: `
                ${isAnimating ? "shake404 0.5s ease-in-out" : ""},
                glow404 3s infinite ease-in-out
              `,
              opacity: isAnimating ? 1 : 0,
              transform: isAnimating ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            404
          </Typography>

          {/* Title with Animation */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "0.1s",
              animationFillMode: "both",
              opacity: isAnimating ? 1 : 0,
              transform: isAnimating ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
            }}
          >
            Page Not Found!
          </Typography>

          {/* Description with Animation */}
          <Typography
            variant="h6"
            sx={{
              marginBottom: 4,
              opacity: 0.9,
              lineHeight: 1.6,
              maxWidth: "400px",
              margin: "0 auto 3rem",
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "0.2s",
              animationFillMode: "both",
              opacity: isAnimating ? 0.9 : 0,
              transform: isAnimating ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
            }}
          >
            Sorry, we couldn't find the page you're looking for.
          </Typography>

          {/* Button Group with Animation */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "0.3s",
              animationFillMode: "both",
              opacity: isAnimating ? 1 : 0,
              transform: isAnimating ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease 0.3s, transform 0.5s ease 0.3s",
            }}
          >
            {/* Go Back Button */}
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              component={Link}
              to="/dashboard"
              sx={{
                padding: "12px 32px",
                borderRadius: "30px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                border: "2px solid white",
                color: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                minWidth: "140px",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#667eea",
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 25px rgba(255,255,255,0.3)",
                  "&::before": {
                    left: "100%",
                  }
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  transition: "left 0.5s ease",
                },
                transition: "all 0.3s ease",
              }}
            >
              Go Back
            </Button>

            {/* Refresh Button */}
            <IconButton
              onClick={handleRefresh}
              sx={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#667eea",
                  transform: "rotate(180deg) scale(1.1)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Additional Message */}
          <Typography
            variant="body2"
            sx={{
              marginTop: 4,
              opacity: 0.7,
              fontStyle: "italic",
              animation: "fadeInUp 0.5s ease-out",
              animationDelay: "0.4s",
              animationFillMode: "both",
              opacity: isAnimating ? 0.7 : 0,
              transform: isAnimating ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s",
            }}
          >
            The page may have been moved or doesn't exist anymore
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;