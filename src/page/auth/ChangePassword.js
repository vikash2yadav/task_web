import React, { useState } from "react";
import { purpleGradient } from "../../constants/color";
import {
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { changePasswordApi } from "../../apis/users.js"; 
import Loader from "../../components/Loader/index.js";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Visibility States
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Form State - Matches your API req.body exactly
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Error State
  const [errors, setErrors] = useState({});

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for that field when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, oldPassword, newPassword, confirmPassword } = formData;

    // 1. Email Validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // 2. Current Password Validation
    if (!oldPassword) newErrors.oldPassword = "Old password is required";

    // 3. New Password Validation
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    // 4. Confirm Password Validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New password and confirm password do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true); // Start loader
    try {
      const response = await changePasswordApi("user/change-password", formData);

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        navigate("/");
      } else {
        toast.error(response?.data?.message || "Failed to update password");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        overflow: "hidden",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
        {/* Floating Circles */}
        <Box
          sx={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            top: "10%",
            right: "10%",
            animation: "float 20s infinite ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)",
            bottom: "15%",
            left: "5%",
            animation: "float 25s infinite ease-in-out",
            animationDelay: "2s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
            top: "50%",
            left: "15%",
            animation: "float 18s infinite ease-in-out",
            animationDelay: "4s",
          }}
        />

        {/* Animated Lines */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
            top: "30%",
            animation: "slideLine 8s infinite linear",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
            bottom: "40%",
            animation: "slideLine 10s infinite linear",
            animationDelay: "1s",
          }}
        />

        {/* Animated Dots Grid */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 2%)`,
            backgroundSize: "50px 50px",
            animation: "moveGrid 20s infinite linear",
          }}
        />

        {/* Pulse Animation */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.1)",
            animation: "pulse 4s infinite ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            animation: "pulse 6s infinite ease-in-out",
            animationDelay: "1s",
          }}
        />
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes slideLine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes moveGrid {
            0% { background-position: 0 0; }
            100% { background-position: 50px 50px; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.2); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
          }
        `}
      </style>

      <Container component="main" maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            padding: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 0 30px rgba(255, 255, 255, 0.5)
            `,
            border: "1px solid rgba(255, 255, 255, 0.3)",
            overflow: "hidden",
            position: "relative",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `
                0 30px 80px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 0 40px rgba(255, 255, 255, 0.6)
              `,
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              zIndex: 2,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-150%",
              width: "300%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
              transform: "rotate(45deg)",
              animation: "shimmer 3s infinite",
              zIndex: 1,
            },
          }}
        >
          <Fade in={true} timeout={500}>
            <Box sx={{ width: "100%" }}>
              
              {/* Back Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton 
                  onClick={() => navigate(-1)} 
                  sx={{ 
                    mr: 1,
                    background: "rgba(102, 126, 234, 0.1)",
                    "&:hover": {
                      background: "rgba(102, 126, 234, 0.2)",
                    }
                  }}
                  disabled={loading}
                >
                    <ArrowBack color={loading ? "disabled" : "primary"} />
                </IconButton>
                <Typography 
                  variant="body2" 
                  color={loading ? "text.disabled" : "text.secondary"} 
                  sx={{ fontWeight: 600 }}
                >
                    Back
                </Typography>
              </Box>

              {/* Header with Icon */}
              <Box textAlign="center" mb={4}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                    marginBottom: 2,
                    border: "2px solid rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <Box sx={{ fontSize: "2rem", color: "primary.main" }}>🔒</Box>
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  Update Password
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  Enter your details below to update your password
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  
                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={loading}
                    sx={textFieldStyle}
                  />

                  {/* Current Password */}
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="oldPassword"
                    type={showPassword.current ? "text" : "password"}
                    variant="outlined"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    disabled={loading}
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => togglePassword('current')} 
                              edge="end"
                              disabled={loading}
                              sx={{
                                background: "rgba(102, 126, 234, 0.1)",
                                "&:hover": {
                                  background: "rgba(102, 126, 234, 0.2)",
                                }
                              }}
                            >
                              {showPassword.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                  />

                  {/* New Password */}
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    variant="outlined"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    disabled={loading}
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => togglePassword('new')} 
                              edge="end"
                              disabled={loading}
                              sx={{
                                background: "rgba(102, 126, 234, 0.1)",
                                "&:hover": {
                                  background: "rgba(102, 126, 234, 0.2)",
                                }
                              }}
                            >
                              {showPassword.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                  />

                  {/* Confirm Password */}
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={loading}
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => togglePassword('confirm')} 
                              edge="end"
                              disabled={loading}
                              sx={{
                                background: "rgba(102, 126, 234, 0.1)",
                                "&:hover": {
                                  background: "rgba(102, 126, 234, 0.2)",
                                }
                              }}
                            >
                              {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                  />

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={loading}
                    sx={{
                      borderRadius: "16px",
                      padding: "14px",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      background: loading 
                        ? "grey" 
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: loading 
                        ? "none" 
                        : "0 8px 25px rgba(102, 126, 234, 0.5)",
                      "&:hover": loading ? {} : {
                        transform: "translateY(-3px)",
                        boxShadow: "0 12px 30px rgba(102, 126, 234, 0.7)",
                      },
                      transition: "all 0.3s ease",
                      marginTop: 2,
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                        transition: "left 0.5s ease",
                      },
                      "&:hover::before": {
                        left: "100%",
                      }
                    }}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Paper>
      </Container>
    </Box>
  );
};

// Reusable Style for TextFields
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(102, 126, 234, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "primary.main",
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: "2px",
      boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },
};

export default ChangePassword;