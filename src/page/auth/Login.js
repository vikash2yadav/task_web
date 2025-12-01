import React, { useContext, useState, useEffect } from "react";
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
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useInputValidation } from "6pp";
import { newUserApi, loginApi, sendOtpApi } from "../../apis/users.js";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CommonContext } from "../../context/CommonContext.js";
import Loader from "../../components/Loader/index.js";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State for Password Visibility
  const [showPassword, setShowPassword] = useState(false);

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { loading, setLoading } = useContext(CommonContext);

  const email = useInputValidation("");
  const password = useInputValidation("");
  const name = useInputValidation("");

  // Function to toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSwitchMode = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setCountdown(0);
    localStorage.removeItem("otp");
    setShowPassword(false); // Reset password visibility on switch

    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleLogin = async (emailValue, passwordValue) => {
    setLoading(true); // Start loader
    try {
      let response = await loginApi(`user/login`, {
        email: emailValue,
        password: passwordValue,
      });

      if (response?.data?.success === true) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        toast.success(response?.data?.message);
        navigate("/dashboard");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error("Login failed!");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleSendOtp = async () => {
    if (!name.value || !email.value || !password.value) {
      toast.error("Please fill all fields before sending OTP");
      return;
    }

    setLoading(true); // Start loader
    try {
      let response = await sendOtpApi(`user/sent/otp`, {
        email: email.value,
        name: name.value,
      });

      if (response?.data?.success === true) {
        setOtpSent(true);
        localStorage.setItem("otp", response?.data?.data);
        
        toast.success("OTP sent to your email!");
        setCountdown(60); 
      } else {
        toast.error(response?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log('error', error);
      toast.error("Failed to send OTP!");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    const storeOtp = localStorage.getItem('otp');
    
    if (String(otp).trim() === String(storeOtp).trim()) {
      setOtpVerified(true);
      toast.success("OTP verified! Click Create Account to finish.");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!otpVerified) {
      toast.error("Please verify OTP first");
      return;
    }

    setLoading(true); // Start loader
    try {
      let response = await newUserApi(`user/new`, {
        name: name.value,
        email: email.value,
        password: password.value,
        otp: otp,
      });

      if (response?.data?.success === true) {
        toast.success(response?.data?.message);

        localStorage.removeItem("otp");
        setOtpSent(false);
        setOtpVerified(false);
        setOtp("");

        if (response?.data?.token) {
           localStorage.setItem("token", response.data.token);
           localStorage.setItem("user", JSON.stringify(response.data.user));
           navigate("/dashboard");
        } else {
           toast.success("Please login with your credentials.");
           setIsLogin(true);
        }

      } else {
        toast.error(response?.data?.message || 'Something Went Wrong.');
      }
    } catch (error) {
      console.log('error', error);
      toast.error("Registration failed!");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true); // Start loader
    try {
      let response = await sendOtpApi(`user/sent/otp`, {
        email: email.value,
        name: name.value,
      });

      if (response?.data?.success === true) {
        localStorage.setItem("otp", response?.data?.data);
        toast.success("OTP resent to your email!");
        setCountdown(60);
      } else {
        toast.error(response?.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.log('error', error);
      toast.error("Failed to resend OTP!");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin(email.value, password.value);
    } else {
      if (!otpSent) {
        handleSendOtp();
      } else if (otpSent && !otpVerified) {
        handleVerifyOtp();
      } else if (otpVerified) {
        handleRegister();
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

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
            minHeight: isLogin ? "400px" : otpSent ? "550px" : "500px",
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
          <Fade in={!isAnimating} timeout={300}>
            <Box sx={{ width: "100%" }}>
              {/* Header Section */}
              <Box textAlign="center" mb={4}>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  {isLogin ? "Login" : "Register Now"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  {isLogin
                    ? "Sign in to continue your journey"
                    : "Join us and get started today"}
                </Typography>
              </Box>

              {/* OTP Status Alert */}
              {!isLogin && otpSent && (
                <Alert
                  severity={otpVerified ? "success" : "info"}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {otpVerified
                    ? "OTP Verified! Click 'Create Account' to finish."
                    : `OTP sent to ${email.value}. Please verify.`
                  }
                </Alert>
              )}

              {/* Form Section */}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  
                  {/* Name Field */}
                  {!isLogin && (
                    <TextField
                      required
                      fullWidth
                      label="Full Name"
                      variant="outlined"
                      value={name.value}
                      onChange={name.changeHandler}
                      disabled={otpSent} 
                      sx={textFieldStyle}
                    />
                  )}

                  {/* Email Field */}
                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email Address"
                    variant="outlined"
                    value={email.value}
                    onChange={email.changeHandler}
                    disabled={(!isLogin && otpSent)}
                    sx={textFieldStyle}
                  />

                  {/* Password Field (Updated with Show/Hide Logic) */}
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"} // Dynamic Type
                    variant="outlined"
                    value={password.value}
                    onChange={password.changeHandler}
                    disabled={(!isLogin && otpSent)}
                    sx={textFieldStyle}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                    }}
                  />

                  {/* Change Password Button */}
                  {isLogin && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px' }}>
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => navigate("/change-password")}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                color: "primary.main",
                                minWidth: 0,
                                padding: 0,
                                "&:hover": {
                                    backgroundColor: "transparent",
                                    textDecoration: "underline"
                                }
                            }}
                        >
                            Change Password?
                        </Button>
                    </Box>
                  )}

                  {/* OTP Field */}
                  {!isLogin && otpSent && !otpVerified && (
                    <Stack spacing={1}>
                       <TextField
                        required
                        fullWidth
                        label="Enter OTP"
                        variant="outlined"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        sx={textFieldStyle}
                      />
                       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                          onClick={handleResendOtp} 
                          disabled={countdown > 0}
                          size="small"
                          sx={{ textTransform: 'none' }}
                        >
                          {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                        </Button>
                      </Box>
                    </Stack>
                  )}

                  {/* Submit Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={loading} // Disable button when loading
                    sx={{
                      borderRadius: "12px",
                      padding: "12px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                      },
                      "&:disabled": {
                        background: "grey",
                        transform: "none",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                      marginTop: 1,
                    }}
                  >
                    {isLogin
                      ? "Sign In"
                      : !otpSent
                        ? "Send OTP"
                        : otpVerified
                          ? "Create Account"
                          : "Verify OTP"
                    }
                  </Button>
                </Stack>
              </Box>

              {/* Switch Mode Section */}
              <Box textAlign="center" mt={4}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ opacity: 0.8 }}
                >
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleSwitchMode}
                  disabled={isAnimating || loading} // Disable during loading
                  sx={{
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                    "&:disabled": {
                      color: "grey",
                    },
                  }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Paper>
      </Container>
    </Box>
  );
};

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
  },
};

export default Login;