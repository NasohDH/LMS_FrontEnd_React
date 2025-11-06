import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { verifyEmail, clearMessages } from '../../../store/slices/authSlice';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBack from '@mui/icons-material/ArrowBack';

const VerifyEmailPage = () => {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage, user, signinEmail } = useSelector((state) => state.auth);


 
  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  if (!signinEmail) {
    return <Navigate to="/signup" replace />;
  }
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    dispatch(clearMessages());
    
    if (!code || code.length !== 6) 
      return;
    
    dispatch(verifyEmail({ code })).unwrap();
      if (user?.role === 'instructor') {
        navigate('/upload-cv');
      } else {
         navigate('/');
      }
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
          Verify Your Email
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          We've sent a verification code to your email address. Please enter the 6-digit code below.
        </Typography>
        
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
        
        <form onSubmit={handleVerifyCode}>
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
            disabled={isLoading || code.length !== 6}
            sx={{
              py: 1.5,
              mt: 2,
              backgroundColor: '#26BA9A',
              borderRadius: 2,
              '&:hover': { backgroundColor: '#20A88A' },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Verify Email'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage;