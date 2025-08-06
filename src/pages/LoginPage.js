import React from 'react';
import { Box, Typography, TextField, InputAdornment, Button, RadioGroup, FormControlLabel, Radio, IconButton, Paper, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import GoogleIcon from '@mui/icons-material/Google';
import { useSelector, useDispatch } from 'react-redux';
import { setEmail, setPassword, setUserType } from '../store/slices/authSlice';
// import bgImage from '../assets/bg.jpg';
// import logo from '../assets/logo.png';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { email, password, userType } = useSelector((state) => state.auth);

  const validEmail = /^\S+@\S+\.\S+$/.test(email);
  const isLoginValid = validEmail && password.length >= 8;
  const emailError = email.length > 0 && !validEmail;
  const passwordError = password.length > 0 && password.length < 8;

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Paper elevation={3} sx={{
        position: 'relative', p: 4, width: '100%', maxWidth: 400,
        borderRadius: 16,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          {/* <img src={logo} alt="MyCourse.io" style={{ width: 80, marginBottom: 8 }} /> */}
          <Typography variant="subtitle1" color="textSecondary">
            Join us and get more benefits. We promise to keep your data safely.
          </Typography>
        </Box>
        <RadioGroup
          row
          value={userType}
          onChange={(e) => dispatch(setUserType(e.target.value))}
          sx={{ mb: 2, justifyContent: 'space-evenly' }}
        >
          <FormControlLabel value="student" control={<Radio />} label="Student" />
          <FormControlLabel value="instructor" control={<Radio />} label="Instructor" />
        </RadioGroup>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Email Address"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          error={emailError}
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
          onChange={(e) => dispatch(setPassword(e.target.value))}
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
          disabled={!isLoginValid}
          sx={{
            py: 1.5,
            mt: 2,
            backgroundColor: '#26BA9A',
            borderRadius: 8,
            '&:hover': { backgroundColor: '#20A88A' },
          }}
        >
          Login
        </Button>
        <Typography align="center" sx={{ my: 2, color: '#888' }}>
          or
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
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
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage; 