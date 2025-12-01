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
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
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
        backgroundImage: purpleGradient,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            padding: { xs: 3, sm: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            position: "relative",
            transition: "all 0.3s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            },
          }}
        >
          <Fade in={true} timeout={300}>
            <Box sx={{ width: "100%" }}>
              
              {/* Back Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton 
                  onClick={() => navigate(-1)} 
                  sx={{ mr: 1 }}
                  disabled={loading} // Disable during loading
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

              {/* Header */}
              <Box textAlign="center" mb={4}>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  Change Password
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
                    disabled={loading} // Disable during loading
                    sx={textFieldStyle}
                  />

                  {/* Current Password */}
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="oldPassword" // Matches API req.body.oldPassword
                    type={showPassword.current ? "text" : "password"}
                    variant="outlined"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    disabled={loading} // Disable during loading
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => togglePassword('current')} 
                              edge="end"
                              disabled={loading} // Disable during loading
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
                    name="newPassword" // Matches API req.body.newPassword
                    type={showPassword.new ? "text" : "password"}
                    variant="outlined"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    disabled={loading} // Disable during loading
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => togglePassword('new')} 
                              edge="end"
                              disabled={loading} // Disable during loading
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
                    name="confirmPassword" // Matches API req.body.confirmPassword
                    type={showPassword.confirm ? "text" : "password"}
                    variant="outlined"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={loading} // Disable during loading
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => togglePassword('confirm')} 
                              edge="end"
                              disabled={loading} // Disable during loading
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
                    disabled={loading} // Disable during loading
                    sx={{
                      borderRadius: "12px",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      background: loading 
                        ? "grey" 
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: loading 
                        ? "none" 
                        : "0 4px 15px rgba(102, 126, 234, 0.4)",
                      "&:hover": loading ? {} : {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                      },
                      transition: "all 0.3s ease",
                      marginTop: 2,
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
    borderRadius: "12px",
    backgroundColor: "white",
    "&:hover fieldset": {
      borderColor: "primary.main",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      borderWidth: "2px",
    },
    "&.Mui-disabled": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
};

export default ChangePassword;