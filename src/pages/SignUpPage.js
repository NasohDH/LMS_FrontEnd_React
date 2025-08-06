import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, InputAdornment, Button, RadioGroup, FormControlLabel, Radio, Link, Avatar } from '@mui/material';
// import bgImage from '../assets/bg.jpg';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const SignUpPage = () => {
  const [firstName, setFirstNameLocal] = useState('');
  const [lastName, setLastNameLocal] = useState('');
  const [userName, setUserNameLocal] = useState('');
  const [email, setEmailLocal] = useState('');
  const [password, setPasswordLocal] = useState('');
  const [confirmPassword, setConfirmPasswordLocal] = useState('');
  const [userType, setUserTypeLocal] = useState('student');
  const [avatar, setAvatarLocal] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarLocal(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const validEmail = /^\S+@\S+\.\S+$/.test(email);
  const isSignUpValid = firstName && lastName && userName && validEmail && password.length >= 8 && password === confirmPassword;
  const emailError = email.length > 0 && !validEmail;
  const passwordError = password.length > 0 && password.length < 8;
  const confirmError = confirmPassword.length > 0 && password !== confirmPassword;

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
      <Paper elevation={3} sx={{ position:'relative', p:4, width:'100%', maxWidth:400, borderRadius:16, boxShadow:'0px 4px 12px rgba(0,0,0,0.1)' }}>
        <Box sx={{ textAlign:'center', mb:3 }}>
          <Typography variant="h5">Sign Up</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <Avatar
              src={avatarPreview}
              sx={{ width: 80, height: 80, margin: '0 auto', cursor: 'pointer' }}
            />
          </label>
        </Box>
        <RadioGroup row value={userType} onChange={(e) => setUserTypeLocal(e.target.value)} sx={{ mb:2, justifyContent:'space-evenly' }}>
          <FormControlLabel value="student" control={<Radio />} label="Student" />
          <FormControlLabel value="instructor" control={<Radio />} label="Instructor" />
        </RadioGroup>
        <Box sx={{ display:'flex', gap:2 , flexDirection:'row'}}>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstNameLocal(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastNameLocal(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Username"
          value={userName}
          onChange={(e) => setUserNameLocal(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Email Address"
          value={email}
          onChange={(e) => setEmailLocal(e.target.value)}
          error={emailError}
          helperText={emailError ? 'Enter a valid email address' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EmailIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPasswordLocal(e.target.value)}
          error={passwordError}
          helperText={passwordError ? 'Password must be at least 8 characters' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPasswordLocal(e.target.value)}
          error={confirmError}
          helperText={confirmError ? 'Passwords do not match' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockIcon style={{ color: '#888' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        <Button
          fullWidth
          variant="contained"
          disabled={!isSignUpValid}
          sx={{
            py: 1.5,
            mt: 2,
            backgroundColor: '#26BA9A',
            borderRadius: 8,
            '&:hover': { backgroundColor: '#20A88A' },
          }}
        >
          Sign Up
        </Button>
        <Typography align="center" sx={{ my: 2, color: '#888' }}>
          or
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon sx={{ color: '#DB4437' }} />} 
          sx={{
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
            Already have an account?{' '}
            <Link href="/" underline="none" sx={{ color: '#26BA9A', fontWeight: 'bold' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUpPage; 