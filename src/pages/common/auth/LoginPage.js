import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, Button, Paper, 
  Link, CircularProgress, Alert, Snackbar 
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timeoutError, setTimeoutError] = useState(false);
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  // Get auth state from Redux store
  const { isLoading, isAuthenticated, error, user } = useSelector((state) => state.auth);

  // Clear errors when component unmounts or when user starts typing
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Set up request timeout
  useEffect(() => {
    let timeoutId;
    
    if (isLoading) {
      // Set a timeout to abort the request after 10 seconds
      timeoutId = setTimeout(() => {
        if (isLoading) {
          setTimeoutError(true);
          setShowTimeoutAlert(true);
          // We can't directly abort the request from here, but we can show a message
          // The actual abort will be handled in the authSlice
        }
      }, 10000); // 10 seconds
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      setTimeoutError(false);
    };
  }, [isLoading]);

  // Redirect user if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'instructor'){
        navigate('/instructor');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setTimeoutError(false); // Reset timeout error
    dispatch(loginUser({ email, password }));
  };

  const handleCloseAlert = () => {
    setShowTimeoutAlert(false);
  };

  const validEmail = /^\S+@\S+\.\S+$/.test(email);
  const isLoginValid = validEmail && password.length >= 8 && !isLoading;
  const emailError = email.length > 0 && !validEmail;
  const passwordError = password.length > 0 && password.length < 8;

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Paper elevation={3} sx={{
        position: 'relative', p: 4, width: '100%', maxWidth: 400,
        borderRadius: 16,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#26BA9A' }}>
            MyCourse.io
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Welcome back again.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        )}

        {/* Timeout Alert */}
        <Snackbar 
          open={showTimeoutAlert} 
          autoHideDuration={6000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="warning" onClose={handleCloseAlert}>
            Request is taking too long. Please check your connection and try again.
          </Alert>
        </Snackbar>

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Email Address"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            disabled={isLoading}
            helperText={emailError ? 'Enter a valid email address' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                backgroundColor: '#F7F7F7',
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
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
          
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Password"
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            error={passwordError}
            helperText={passwordError ? 'Password must be at least 8 characters' : ''}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                backgroundColor: '#F7F7F7',
                '& fieldset': { borderColor: '#ccc' },
                '&:hover fieldset': { borderColor: '#888' },
                '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockIcon style={{ color: '#888' }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            fullWidth
            variant="contained"
            disabled={!isLoginValid || timeoutError}
            type="submit"
            sx={{
              py: 1.5,
              mt: 2,
              backgroundColor: '#26BA9A',
              borderRadius: 8,
              '&:hover': { backgroundColor: '#20A88A' },
              '&:disabled': { backgroundColor: '#cccccc' },
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        <Typography align="center" sx={{ my: 2, color: '#888' }}>
          or
        </Typography>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />} 
          sx={{
            mt: 2,
            borderRadius: 8,
            borderColor: '#ccc',
            color: '#000',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          Continue with Google
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/signup" underline="none" sx={{ color: '#26BA9A', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </Typography>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link href="/forgot-password" underline="none" sx={{ color: '#666' }}>
              Forgot your password?
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;