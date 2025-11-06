import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Grid, TextField, Button, Avatar,
  CircularProgress, Divider, IconButton, InputAdornment, Alert, Snackbar
} from '@mui/material';
import { 
    FileUploadOutlined as FileUploadIcon,
    Visibility, VisibilityOff, Star, VisibilityOutlined as ViewsIcon
} from '@mui/icons-material';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { updateProfile, clearError, clearSuccess } from '../../store/slices/profileSlice';

const SERVER_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const FieldLabel = ({ children }) => (
    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
        {children}
    </Typography>
);

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return '';
  
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }
    return `${SERVER_BASE_URL}/${avatarPath.replace(/^\/+/, '')}`;
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.profile);
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [passwords, setPasswords] = useState({ old_password: '', password: '', password_confirmation: '' });
  const [showPassword, setShowPassword] = useState({ old_password: false, password: false, password_confirmation: false });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isPasswordChangeDisabled, setIsPasswordChangeDisabled] = useState(true);
  const [confirmState, setConfirmState] = useState({ open: false, onConfirm: null, title: '', contentText: '' });

 
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        user_name: user.user_name || '',
        bio: user.role === 'instructor' && user.instructor ? user.instructor.bio : '',
      });
      
     
      if (user.avatar) {
        setAvatarPreview(getAvatarUrl(user.avatar));
      }
    }
  }, [user]);

  useEffect(() => {
   
    if (user) {
      const hasChanges = 
        user.first_name !== profileData.first_name ||
        user.last_name !== profileData.last_name ||
        user.user_name !== profileData.user_name ||
        (user.role === 'instructor' && user.instructor && user.instructor.bio !== profileData.bio) ||
        avatarFile !== null;
      
      setIsSaveDisabled(!hasChanges);
    }
  }, [user, profileData, avatarFile]);

  useEffect(() => {
   
    const { old_password, password, password_confirmation } = passwords;
    const isInvalid = !old_password || !password || password.length < 8 || password !== password_confirmation;
    setIsPasswordChangeDisabled(isInvalid);
  }, [passwords]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
     
      if (file.size > 1024 * 1024) {
        alert('Image size should be under 1MB');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  const toggleShowPassword = (field) => {
      setShowPassword(prev => ({...prev, [field]: !prev[field]}));
  };

  const handleSaveChanges = () => {
    setConfirmState({
      open: true,
      onConfirm: () => {
        const updateData = {
          ...profileData,
          avatarFile,
          full_name: `${profileData.first_name} ${profileData.last_name}`,
        };
        
       
        if (user.role !== 'instructor') {
          delete updateData.bio;
        }
        
        dispatch(updateProfile(updateData));
        
        handleCloseConfirm();
      },
      title: "Confirm Profile Changes",
      contentText: "Are you sure you want to save these changes to your profile?"
    });
  };

  const handleChangePassword = () => {
    setConfirmState({
      open: true,
      onConfirm: () => {
        dispatch(updateProfile(passwords));
        handleCloseConfirm();
      },
      title: "Confirm Password Change",
      contentText: "Are you sure you want to change your password? This action is irreversible."
    });
  };

  const handleCloseConfirm = () => {
    setConfirmState({ open: false, onConfirm: null, title: '', contentText: '' });
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  if (!user) {
    return ( <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box> );
  }

  return (
    <Box sx={{ p: 4, width: "90%", mx: 'auto'}}>
      {/* Success/Error Snackbars */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'An error occurred'}
        </Alert>
      </Snackbar>
      
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Operation completed successfully!
        </Alert>
      </Snackbar>

      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
          Account settings
        </Typography>
        
        <Grid container spacing={8} sx={{ mb: 4 }} alignItems="center">
          <Grid item xs={12} md="auto">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 180, height: 180, border: '2px dashed', borderColor: 'divider', borderRadius: '50%', p: 1 }}>
                <Avatar src={avatarPreview} sx={{ width: '100%', height: '100%' }} />
              </Box>
              <Button variant="contained" component="label" startIcon={<FileUploadIcon />} sx={{ backgroundColor: '#26BA9A', '&:hover': { backgroundColor: '#20A88A' } }}>
                Upload Photo
                <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
              </Button>
              <Typography variant="caption" color="text.secondary">Image size should be under 1MB</Typography>
            </Box>
          </Grid>

          <Grid item sx={{display:'flex', width:'80%', justifyContent:'flex-end'}} xs={12} md >
            <Grid container spacing={2} width='100%' >
              <Grid item xs={12} sm={6} minWidth='45%' hidden={user.role !== 'instructor'}>
                <Paper variant="outlined" sx={{ py: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <ViewsIcon color="action" sx={{ fontSize: 70 }}/>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{user.instructor?.views || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">Profile Views</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} minWidth='45%' hidden={user.role !== 'instructor'}>
                <Paper variant="outlined" sx={{ py: 7, display: 'flex', alignItems: 'center', justifyContent:'center', gap: 2 }}>
                  <Star color="action" sx={{ fontSize: 70 }}/>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{user.instructor?.rate || 0}</Typography>
                    <Typography variant="body2" color="text.secondary">Avg. Rating</Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FieldLabel>First Name</FieldLabel>
            <TextField 
              placeholder="First name" 
              name="first_name" 
              value={profileData.first_name} 
              onChange={handleProfileChange} 
              fullWidth 
              required 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel>Last Name</FieldLabel>
            <TextField 
              placeholder="Last name" 
              name="last_name" 
              value={profileData.last_name} 
              onChange={handleProfileChange} 
              fullWidth 
              required 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel>Username</FieldLabel>
            <TextField 
              placeholder="Username" 
              name="user_name" 
              value={profileData.user_name} 
              onChange={handleProfileChange}
              fullWidth 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FieldLabel>Email</FieldLabel>
            <TextField 
              placeholder="Email" 
              value={user.email || ''} 
              fullWidth 
              disabled 
            />
          </Grid>
          <Grid item xs={12} hidden={user.role !== 'instructor'}>
            <FieldLabel>Bio</FieldLabel>
            <TextField
              placeholder="Your Bio, profession or biography"
              name="bio" 
              value={profileData.bio} 
              onChange={handleProfileChange}
              fullWidth 
              multiline 
              rows={4} 
              inputProps={{ maxLength: 150 }}
              helperText={`${profileData.bio.length}/150`}
              FormHelperTextProps={{ sx: { textAlign: 'right' } }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleSaveChanges} 
            size="large" 
            sx={{ backgroundColor: '#26BA9A', '&:hover': { backgroundColor: '#20A88A' } }} 
            disabled={isSaveDisabled || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
      
      <Divider sx={{ my: 1, borderColor: 'transparent' }} />

      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Change password</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <FieldLabel>Current Password</FieldLabel>
            <TextField 
              fullWidth 
              type={showPassword.old_password ? 'text' : 'password'} 
              placeholder="Enter current password" 
              name="old_password" 
              value={passwords.old_password} 
              onChange={handlePasswordChange} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShowPassword('old_password')} edge="end">
                      {showPassword.old_password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }} 
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <FieldLabel>New Password</FieldLabel>
            <TextField
              fullWidth 
              type={showPassword.password ? 'text' : 'password'}
              placeholder="Enter new password" 
              name="password" 
              value={passwords.password} 
              onChange={handlePasswordChange}
              helperText={passwords.password.length > 0 && passwords.password.length < 8 ? "Password must be at least 8 characters" : ""}
              error={passwords.password.length > 0 && passwords.password.length < 8}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShowPassword('password')} edge="end">
                      {showPassword.password ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <FieldLabel>Confirm Password</FieldLabel>
            <TextField
              fullWidth 
              type={showPassword.password_confirmation ? 'text' : 'password'}
              placeholder="Confirm new password" 
              name="password_confirmation" 
              value={passwords.password_confirmation} 
              onChange={handlePasswordChange}
              helperText={passwords.password_confirmation.length > 0 && passwords.password !== passwords.password_confirmation ? "Passwords do not match" : ""}
              error={passwords.password_confirmation.length > 0 && passwords.password !== passwords.password_confirmation}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => toggleShowPassword('password_confirmation')} edge="end">
                      {showPassword.password_confirmation ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleChangePassword} 
            size="large" 
            sx={{ backgroundColor: '#26BA9A', '&:hover': { backgroundColor: '#20A88A' } }} 
            disabled={isPasswordChangeDisabled || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Change Password'}
          </Button>
        </Box>
      </Paper>

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        open={confirmState.open}
        onClose={handleCloseConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        contentText={confirmState.contentText}
      />
    </Box>
  );
};

export default ProfilePage;