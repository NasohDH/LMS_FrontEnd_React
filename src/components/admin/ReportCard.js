import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Paper, Typography, Button, Avatar, Grid, Divider, Chip, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { fetchVideoLink } from '../../store/slices/lessonReportsSlice';

const ReportCard = ({ report, onMarkAsReviewed, updating }) => {
  const dispatch = useDispatch();
  const { videoLinks, videoLoading } = useSelector(state => state.lessonReports);
  
  const filename = report.lesson.file_name;
  const videoUrl = videoLinks[filename];
  const isLoading = videoLoading[filename];

  useEffect(() => {
   
    if (filename && !videoUrl && !isLoading) {
      dispatch(fetchVideoLink(filename));
    }
  }, [filename, videoUrl, isLoading, dispatch]);

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Chip
        label={report.status} 
        color={report.status === 'pending' ? 'warning' : 'success'} 
        size="small"
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16,
          zIndex: 1
        }} 
      />
      
      {report.status === 'pending' && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: 16, 
          right: 16,
          zIndex: 1
        }}>
          <Button 
            variant="contained" 
            onClick={() => onMarkAsReviewed(report.id)}
            disabled={updating}
            sx={{ 
              backgroundColor: '#26BA9A', 
              '&:hover': { backgroundColor: '#20A88A' },
              '&:disabled': { backgroundColor: '#cccccc' }
            }}
          >
            {updating ? 'Processing...' : 'Mark as Reviewed'}
          </Button>
        </Box>
      )}

        <Grid container spacing={3} sx={{display: 'flex', justifyContent: 'space-between', maxWidth: '50%'}}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>Report Details</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar src={report.student.user.avatar} />
            <Box>
              <Typography fontWeight="bold">{report.student.full_name}</Typography>
              <Typography variant="body2" color="text.secondary">{report.student.user.email}</Typography>
            </Box>
          </Box>
          <Typography variant="subtitle2" color="text.secondary">Report Message:</Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100', fontStyle: 'italic', mb: 2 }}>
            "{report.message}"
          </Paper>
          <Typography variant="caption" color="text.secondary">
            Reported on: {report.created_at ? dayjs(report.created_at).format('MMM D, YYYY h:mm A') : 'N/A'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" color="text.secondary">Course:</Typography>
          <Typography fontWeight="bold">{report.course.title}</Typography>
          <Typography variant="body2" color="text.secondary">by {report.course.instructor.full_name}</Typography>
        </Grid>

        {/* Right Column: Lesson Video */}
        <Grid item xs={12} md={8} maxWidth={'50%'}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Lesson: {report.lesson.title}</Typography>
          </Box>
          
          <Box sx={{ 
            height: '100%', 
            minHeight: 300,
            display: 'flex', 
            flexDirection: 'column',
            pb: '30px',
            width: '220%',
          }}>
            {isLoading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 300,
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading video...</Typography>
              </Box>
            ) : videoUrl ? (
              <video 
                controls 
                style={{ 
                  flexGrow: 1,
                  width: '100%',
                  borderRadius: 8, 
                  backgroundColor: '#000',
                  maxHeight: 400,
                  objectFit: 'contain',
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 300,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                flexDirection: 'column'
              }}>
                <Typography color="text.secondary">Video not available</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => dispatch(fetchVideoLink(filename))}
                  sx={{ mt: 2 }}
                >
                  Retry Loading Video
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ReportCard;