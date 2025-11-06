import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  InputAdornment, 
  Button, 
  Link, 
  Avatar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearMessages, setSigninEmail } from '../store/slices/authSlice';

const SignUpPage = () => {
  const [firstName, setFirstNameLocal] = useState('');
  const [lastName, setLastNameLocal] = useState('');
  const [userName, setUserNameLocal] = useState('');
  const [email, setEmailLocal] = useState('');
  const [password, setPasswordLocal] = useState('');
  const [confirmPassword, setConfirmPasswordLocal] = useState('');
  const [role, setRole] = useState('student');
  const [bio, setBio] = useState('');
  const [avatar, setAvatarLocal] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarLocal(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignUpValid) return;
    
    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('user_name', userName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
    formData.append('role', role);
    
    if (role === 'instructor') {
      formData.append('bio', bio);
    }
    
    if (avatar) {
      formData.append('avatar', avatar);
    }
    
     dispatch(registerUser(formData)).unwrap();
      // After successful registration, redirect to email verification
      dispatch(setSigninEmail(email));
      navigate('/verify-email');
    
  };

  const validEmail = /^\S+@\S+\.\S+$/.test(email);
  const isSignUpValid = firstName && 
    lastName && 
    userName && 
    validEmail && 
    password.length >= 6 && 
    password === confirmPassword &&
    (role === 'student' || (role === 'instructor' && bio));

  const emailError = email.length > 0 && !validEmail;
  const passwordError = password.length > 0 && password.length < 8;
  const confirmError = confirmPassword.length > 0 && password !== confirmPassword;
  const bioError = role === 'instructor' && bio.length < 20 && bio.length !==0;

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      p: 2
    }}>
      <Paper elevation={3} sx={{ position:'relative', p:4, width:'100%', maxWidth:450, borderRadius:8, boxShadow:'0px 4px 12px rgba(0,0,0,0.1)' }}>
        <Box sx={{ textAlign:'center', mb:3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Sign Up
          </Typography>
        </Box>

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
            >
              {!avatarPreview && <PersonIcon />}
            </Avatar>
          </label>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display:'flex', gap:2 , flexDirection:'row'}}>
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstNameLocal(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                backgroundColor: '#F7F7F7',
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
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                backgroundColor: '#F7F7F7',
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
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
            },
          }}
        />
        
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmailLocal(e.target.value)}
          error={emailError}
          helperText={emailError ? 'Enter a valid email address' : ''}
          required
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
            },
          }}
        />
        
        {role === 'instructor' && (
          <TextField
            fullWidth
            variant="outlined"
            margin="normal"
            label="Bio"
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            error={bioError}
            helperText={bioError ? 'Bio is too short' : ''}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                backgroundColor: '#F7F7F7',
              },
            }}
          />
        )}
        
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
          required
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
          required
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
            },
          }}
        />
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!isSignUpValid || isLoading}
          sx={{
            py: 1.5,
            mt: 2,
            backgroundColor: '#26BA9A',
            borderRadius: 8,
            '&:hover': { backgroundColor: '#20A88A' },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
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
            '&:hover': { borderColor: '#999', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          }}
        >
          Continue with Google
        </Button>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login" underline="none" sx={{ color: '#26BA9A', fontWeight: 'bold' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUpPage;