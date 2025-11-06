import React from 'react';
import { Box, Paper, Typography, Button, Avatar, Grid, Divider, CircularProgress } from '@mui/material';

const InstructorCvCard = ({ instructor, onAccept, onReject, loading = false }) => {
 
  if (!instructor) {
    return (
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography color="text.secondary">Instructor data not available</Typography>
      </Paper>
    );
  }

 
  const cvUrl = `${process.env.REACT_APP_API_BASE_URL}/${instructor.cv_path}`;

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar 
            src={`${process.env.REACT_APP_API_BASE_URL}${instructor.vatar}`}
            sx={{ width: 120, height: 120, mb: 2 }} 
          />
          <Typography variant="h6" fontWeight="bold">
            {instructor.full_name || 'Unknown Instructor'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {instructor.user?.email || 'No email available'}
          </Typography>
        </Grid>

        <Grid item xs={12} md={10} width={'85%'}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Biography
          </Typography>
          <Typography variant="body1" paragraph sx={{ minHeight: '60px' }}>
            {instructor.bio || 'No biography provided.'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Button
              variant="outlined"
              component="a"
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!instructor.cv_path}
            >
              View CV (.pdf)
            </Button>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="error"
                onClick={onReject}
                disabled={loading}
                startIcon={loading && <CircularProgress size={16} />}
              >
                {loading ? 'Processing...' : 'Reject'}
              </Button>
              <Button 
                variant="contained" 
                onClick={onAccept}
                disabled={loading}
                startIcon={loading && <CircularProgress size={16} />}
                sx={{ 
                  backgroundColor: '#26BA9A', 
                  '&:hover': { backgroundColor: '#20A88A' },
                  '&:disabled': { backgroundColor: '#cccccc' }
                }}
              >
                {loading ? 'Processing...' : 'Accept'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InstructorCvCard;