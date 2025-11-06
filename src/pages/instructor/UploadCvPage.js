import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { uploadCv, clearMessages } from '../../store/slices/authSlice';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBack from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadCvPage = () => {
  const [cvFile, setCvFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage } = useSelector((state) => state.auth);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    dispatch(clearMessages());
    
    if (file) {
     
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setFileError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
     
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size must be less than 5MB');
        return;
      }
      
      setCvFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFileError('');
    dispatch(clearMessages());
    
    if (!cvFile) {
      setFileError('Please select a file to upload');
      return;
    }
    
    const formData = new FormData();
    formData.append('cv', cvFile);
    
    try {
      const result = await dispatch(uploadCv(formData));
      
      if (uploadCv.fulfilled.match(result)) {
       
        navigate('/waiting-verification');
      }
    } catch (err) {
     
      console.error('Upload failed:', err);
    }
  };

  const handleBack = () => {
    dispatch(clearMessages());
    navigate(-1);
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
          onClick={handleBack}
          sx={{ position: 'absolute', top: 16, left: 16 }}
        >
          <ArrowBack />
        </IconButton>
        
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 3 }}>
          Upload Your CV
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
          Please upload your CV (PDF, DOC, or DOCX, max 5MB) for admin verification. Your account will be activated once approved.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearMessages())}>
            {error}
          </Alert>
        )}
        
        {fileError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fileError}
          </Alert>
        )}
        
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearMessages())}>
            {successMessage}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            id="cv-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="cv-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={<CloudUploadIcon />}
              sx={{
                py: 2,
                mb: 2,
                borderRadius: 2,
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: '#ccc',
                color: 'black',
                backgroundColor: 'rgba(38, 186, 154, 0.7)',
                '&:hover': {
                  borderColor: '#26BA9A',
                  backgroundColor: 'rgba(38, 186, 154, 0.04)'
                }
              }}
            >
              {fileName || 'Choose CV File'}
            </Button>
          </label>
          
          {fileName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DescriptionIcon sx={{ mr: 1, color: '#888' }} />
              <Typography variant="body2" sx={{ color: '#666' }}>
                {fileName}
              </Typography>
            </Box>
          )}
          
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isLoading || !cvFile}
            sx={{
              py: 1.5,
              mt: 2,
              backgroundColor: '#26BA9A',
              borderRadius: 2,
              '&:hover': { backgroundColor: '#20A88A' },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit for Verification'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UploadCvPage;