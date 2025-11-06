import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  ArrowBack
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  sendResetCode,
  resetPassword,
  clearMessages,
  setResetStep,
  setResetEmail
} from '../../../store/slices/authSlice';

const ForgotPasswordPage = () => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    isLoading, 
    error, 
    successMessage,
    resetEmail, 
    resetStep 
  } = useSelector((state) => state.auth);

  const steps = ['Enter Email', 'Reset Password'];

 
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    dispatch(clearMessages());
    
    if (!resetEmail || !/^\S+@\S+\.\S+$/.test(resetEmail)) {
      return;
    }
    
    try {
      await dispatch(sendResetCode(resetEmail)).unwrap();
      setCountdown(60);
    } catch (error) {
     
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(clearMessages());
    
    if (!code || code.length !== 6) {
      return;
    }
    
    if (!password || password.length < 8) {
      return;
    }
    
    if (password !== passwordConfirmation) {
      return;
    }
    
    try {
      await dispatch(resetPassword({ 
        email: resetEmail, 
        code, 
        password, 
        password_confirmation: passwordConfirmation 
      })).unwrap();
      
     
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
     
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToLogin = () => {
    dispatch(clearMessages());
    navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      p: 2
    }}>
      <Paper elevation={3} sx={{
        p: 4,
        width: '100%',
        maxWidth: 450,
        borderRadius: 2,
        position: 'relative'
      }}>
        <IconButton 
          onClick={handleBackToLogin}
          sx={{ position: 'absolute', top: 16, left: 16 }}
        >
          <ArrowBack />
        </IconButton>
        
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Reset Password
        </Typography>
        
        <Stepper activeStep={resetStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearMessages())}>
            {error}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearMessages())}>
            {successMessage}
          </Alert>
        )}
        
        {resetStep === 0 && (
          <form onSubmit={handleSendCode}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter your email address and we'll send you a verification code to reset your password.
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Email Address"
              type="email"
              value={resetEmail || ''}
              onChange={(e) => dispatch(setResetEmail(e.target.value))}
              disabled={isLoading}
              error={resetEmail && !/^\S+@\S+\.\S+$/.test(resetEmail)}
              helperText={resetEmail && !/^\S+@\S+\.\S+$/.test(resetEmail) ? 'Enter a valid email address' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#F7F7F7',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon style={{ color: '#888' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={isLoading || !resetEmail || !/^\S+@\S+\.\S+$/.test(resetEmail)}
              sx={{
                py: 1.5,
                mt: 2,
                backgroundColor: '#26BA9A',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#20A88A' },
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Send Verification Code'}
            </Button>
          </form>
        )}
        
        {resetStep === 1 && (
          <form onSubmit={handleResetPassword}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Enter the verification code sent to {resetEmail} and your new password.
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={isLoading}
              error={code.length > 0 && code.length !== 6}
              helperText={code.length > 0 && code.length !== 6 ? 'Code must be 6 digits' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#F7F7F7',
                },
              }}
            />
            
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              error={password.length > 0 && password.length < 8}
              helperText={password.length > 0 && password.length < 8 ? 'Password must be at least 8 characters' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#F7F7F7',
                },
              }}
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
            
            <TextField
              fullWidth
              variant="outlined"
              margin="normal"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={isLoading}
              error={passwordConfirmation.length > 0 && password !== passwordConfirmation}
              helperText={passwordConfirmation.length > 0 && password !== passwordConfirmation ? 'Passwords do not match' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#F7F7F7',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => dispatch(setResetStep(0))}
                sx={{ flex: 1, color: 'black' }}
                disabled={isLoading}
              >
                Back
              </Button>
              
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading || code.length !== 6 || !password || password.length < 8 || password !== passwordConfirmation}
                sx={{
                  flex: 2,
                  py: 1.5,
                  backgroundColor: '#26BA9A',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#20A88A' },
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Box>
            
            <Button
              fullWidth
              variant="text"
              onClick={handleSendCode}
              disabled={isLoading || countdown > 0}
              sx={{ mt: 1 }}
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;