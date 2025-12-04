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
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
            top: "15%",
            right: "8%",
            animation: "float1 20s infinite ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
            bottom: "20%",
            left: "8%",
            animation: "float2 25s infinite ease-in-out",
            animationDelay: "2s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%)",
            top: "60%",
            left: "20%",
            animation: "float3 18s infinite ease-in-out",
            animationDelay: "4s",
          }}
        />

        {/* Animated Lines */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
            top: "25%",
            animation: "slideLine1 10s infinite linear",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
            bottom: "35%",
            animation: "slideLine2 12s infinite linear",
            animationDelay: "1s",
          }}
        />

        {/* Animated Dots */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255, 255, 255, 0.05) 1%, transparent 1%)`,
            backgroundSize: "40px 40px",
            animation: "moveDots 30s infinite linear",
          }}
        />

        {/* Pulse Rings */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            animation: "pulse1 5s infinite ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            animation: "pulse2 7s infinite ease-in-out",
            animationDelay: "1s",
          }}
        />
      </Box>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(10px, -15px) rotate(2deg); }
            50% { transform: translate(-5px, 10px) rotate(-1deg); }
            75% { transform: translate(15px, -5px) rotate(3deg); }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-10px, 15px) rotate(-2deg); }
            66% { transform: translate(5px, -10px) rotate(1deg); }
          }
          @keyframes float3 {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-8px, 12px) rotate(3deg); }
          }
          @keyframes slideLine1 {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes slideLine2 {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          @keyframes moveDots {
            0% { background-position: 0 0; }
            100% { background-position: 40px 40px; }
          }
          @keyframes pulse1 {
            0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(0.9); }
            50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.1); }
          }
          @keyframes pulse2 {
            0%, 100% { opacity: 0.15; transform: translate(-50%, -50%) scale(0.8); }
            50% { opacity: 0.05; transform: translate(-50%, -50%) scale(1.2); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-150%) rotate(45deg); }
            100% { transform: translateX(150%) rotate(45deg); }
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
            backdropFilter: "blur(15px)",
            borderRadius: "24px",
            boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.25),
              0 0 0 1px rgba(255, 255, 255, 0.15),
              inset 0 0 25px rgba(255, 255, 255, 0.4)
            `,
            border: "1px solid rgba(255, 255, 255, 0.25)",
            overflow: "hidden",
            position: "relative",
            minHeight: isLogin ? "400px" : otpSent ? "550px" : "500px",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `
                0 25px 60px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.2),
                inset 0 0 35px rgba(255, 255, 255, 0.5)
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
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
              transform: "rotate(45deg)",
              animation: "shimmer 4s infinite",
              zIndex: 1,
            },
          }}
        >
          <Fade in={!isAnimating} timeout={500}>
            <Box sx={{ width: "100%" }}>
              {/* Header Section */}
              <Box textAlign="center" mb={4}>
                {/* Animated Icon */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                    marginBottom: 2,
                    border: "2px solid rgba(102, 126, 234, 0.2)",
                    animation: isLogin ? "none" : "float3 4s infinite ease-in-out",
                  }}
                >
                  <Box sx={{ fontSize: "1.8rem", color: "primary.main" }}>
                    {isLogin ? "🔐" : "👤"}
                  </Box>
                </Box>
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
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    animation: otpVerified ? "pulse1 2s infinite ease-in-out" : "none"
                  }}
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

                  {/* Password Field */}
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
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
                              sx={{
                                background: "rgba(102, 126, 234, 0.1)",
                                "&:hover": {
                                  background: "rgba(102, 126, 234, 0.2)",
                                }
                              }}
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
                          sx={{ 
                            textTransform: 'none',
                            position: "relative",
                            overflow: "hidden",
                            "&::before": countdown > 0 ? {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: `${(countdown / 60) * 100}%`,
                              height: "100%",
                              background: "rgba(102, 126, 234, 0.1)",
                              transition: "width 1s linear",
                            } : {}
                          }}
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
                    disabled={loading}
                    sx={{
                      borderRadius: "14px",
                      padding: "14px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      background: loading 
                        ? "grey" 
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: loading 
                        ? "none" 
                        : "0 6px 20px rgba(102, 126, 234, 0.5)",
                      "&:hover": loading ? {} : {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(102, 126, 234, 0.7)",
                      },
                      "&:disabled": {
                        background: "grey",
                        transform: "none",
                        boxShadow: "none",
                      },
                      transition: "all 0.3s ease",
                      marginTop: 1,
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
                      "&:hover::before": loading ? {} : {
                        left: "100%",
                      }
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
                  disabled={isAnimating || loading}
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
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "primary.main",
  },
};

export default Login;