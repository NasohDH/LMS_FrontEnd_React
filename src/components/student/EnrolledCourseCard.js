import React from 'react';
import { Box, Typography, Paper, Chip, LinearProgress, Avatar } from '@mui/material';
import { PlayCircle as PlayCircleIcon, AccessTime as AccessTimeIcon, Star as StarIcon } from '@mui/icons-material';

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const EnrolledCourseCard = ({ course, onClick }) => {
  const levelLabels = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced'
  };

  const levelLabel = levelLabels[course.level] || 'Beginner';
  
  // Get instructor avatar or use default
  const instructorAvatar = course.instructor?.avatar 
    ? `${process.env.REACT_APP_API_BASE_URL}/${course.instructor.avatar}`
    : null;

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        height: '100%', 
        display: 'flex',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          borderColor: 'primary.main',
          transform: 'translateY(-4px)'
        }
      }}
      onClick={() => onClick(course.id)}
    >
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Course Image */}
        <Box 
          component="img" 
          src={`${process.env.REACT_APP_API_BASE_URL}/${course.image}`} 
          alt={course.title}
          sx={{ 
            width: 140, 
            height: 90, 
            objectFit: 'cover', 
            borderRadius: 2,
            mr: 2
          }}
        />
        
        {/* Course Details */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }} noWrap>
            {course.title}
          </Typography>
          
          {/* Instructor Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            {instructorAvatar ? (
              <Avatar 
                src={instructorAvatar} 
                alt={course.instructor.full_name}
                sx={{ width: 20, height: 20, fontSize: 12 }}
              />
            ) : (
              <Avatar sx={{ width: 20, height: 20, fontSize: 12 }}>
                {course.instructor?.full_name?.charAt(0) || 'I'}
              </Avatar>
            )}
            <Typography variant="body2" color="text.secondary">
              {course.instructor?.full_name || 'Instructor'}
            </Typography>
          </Box>
          
          {/* Course Meta Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {formatDuration(course.total_duration)}
              </Typography>
            </Box>
            
            <Chip 
              label={levelLabel} 
              size="small" 
              variant="outlined" 
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
            
            {course.rating > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 14, color: 'warning.main' }} />
                <Typography variant="caption" color="text.secondary">
                  {course.rating}
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Progress Bar */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {course.progress || 0}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={course.progress || 0} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'primary.main'
                }
              }}
            />
          </Box>
        </Box>
        
        {/* Play Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
          <PlayCircleIcon sx={{ color: 'primary.main', fontSize: 32 }} />
        </Box>
      </Box>
    </Paper>
  );
};

export default EnrolledCourseCard;