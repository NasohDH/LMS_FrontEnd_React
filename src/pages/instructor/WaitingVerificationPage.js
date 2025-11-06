import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import LogoutIcon from '@mui/icons-material/Logout';

const WaitingVerificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
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
        maxWidth: 500,
        borderRadius: 2,
        textAlign: 'center'
      }}>
        
        <HourglassEmptyIcon sx={{ fontSize: 60, color: '#26BA9A', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Account Under Review
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
            Your account account is currently being reviewed by our admin team. If this is an old account then it is closed due to Violation of site standards for more info contact support at support@email.com.
        </Typography>
        
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: '#ccc',
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(38, 186, 154, 0.7)' },
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default WaitingVerificationPage;