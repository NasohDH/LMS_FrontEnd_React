import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardHeader, CardMedia, CardContent, Typography, Box, Chip,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  CalendarToday as CalendarTodayIcon,
  ListAlt as ListAltIcon,
  Block as BlockIcon,
  Star as StarIcon
} from '@mui/icons-material';
import ConfirmationDialog from './ConfirmationDialog';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const CourseCard = ({ course, onUpdate, onManageContent, onDisableCourse, onEnableCourse, isAdmin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const open = Boolean(anchorEl);
  
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleUpdateClick = () => { onUpdate && onUpdate(); handleClose(); };
  const handleManageContentClick = () => { onManageContent && onManageContent(); handleClose(); };
 
  const handleViewDetails = () => {
    // For students, navigate to course details page
    if (user?.role === 'student') {
      navigate(`/student/course/${course.id}`);
    }
    handleClose();
  };
  
  const handleDisableCourseClick = () => { 
    if(user.role==='admin'){
    onDisableCourse && onDisableCourse();
    }
    else{
    setActionType('disable');
    setConfirmDialogOpen(true);
    }
    handleClose();

  };

  const handleEnableCourseClick = () => { 
   
    onEnableCourse && onEnableCourse();
    handleClose();
  };

  const handleConfirmAction = () => {
    if (actionType === 'disable' && onDisableCourse) {
      onDisableCourse();
    }
    setConfirmDialogOpen(false);
    setActionType('');
  };

  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
    setActionType('');
  };

  const discountedPrice = course.price * (1 - (course.discount || 0) / 100);

  const getDialogContent = () => {
    if (actionType === 'disable') {
      return {
        title: 'Disable Course',
        content: `Are you sure you want to disable "${course.title}"? Students will no longer be able to enroll in this course. This action cannot be undone.`,
        confirmText: 'Disable Course',
        confirmColor: 'error'
      };
    }
    return { title: '', content: '', confirmText: '', confirmColor: 'primary' };
  };

  const dialogContent = getDialogContent();

  // For student role, we show a simplified card without action buttons
  if (user?.role === 'student') {
    return (
      <Card 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%', 
          cursor: 'pointer',
          minHeight: '300px'
        }}
        onClick={handleViewDetails}
      >
        <CardHeader
          title={<Typography variant="h6" noWrap>{course.title}</Typography>}
          sx={{ pb: 0 }}
        />
        <CardMedia
          component="img"
          height="160"
          image={`${process.env.REACT_APP_API_BASE_URL}/${course.image}`}
          alt={course.title}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ minHeight: '40px' }}>
            {course.description}
          </Typography>
          
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />
            <Typography variant="caption">{course.rating || 'N/A'}</Typography>
          </Box>
          
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {course.categories && course.categories.map((cat, index) => (
              <Chip key={index} label={cat.name} size="small" variant="outlined" />
            ))}
          </Box>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Instructor: {course.instructor?.full_name || 'N/A'}
            </Typography>
          </Box>
        </CardContent>

        <Divider sx={{ mx: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <VisibilityIcon sx={{ fontSize: '1rem' }} />
            <Typography variant="caption">{course.views || 0} Views</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="h6" color="primary">${discountedPrice.toFixed(2)}</Typography>
            {course.discount > 0 && (
              <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                ${course.price.toFixed(2)}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ p: 2, pt: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip 
              label={course.level ? `Level ${course.level}` : 'No level'} 
              color={course.enabled ? "primary" : "default"} 
              variant="filled" 
              size="small" 
            />
          </Box>
        </Box>
      </Card>
    );
  }

  // For instructor and admin roles, show the full card with actions
  return (
    <>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardHeader
          action={
            <>
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              {isAdmin ? (
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  {course.enabled ? (
                    <MenuItem onClick={handleDisableCourseClick} sx={{ color: 'error.main' }}>
                      <ListItemIcon><BlockIcon fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Disable Course</ListItemText>
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={handleEnableCourseClick} sx={{ color: 'success.main' }}>
                      <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
                      <ListItemText>Enable Course</ListItemText>
                    </MenuItem>
                  )}
                </Menu>
              ) : (
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem onClick={handleManageContentClick}>
                    <ListItemIcon><ListAltIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Manage Content</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleUpdateClick}>
                    <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Update Details</ListItemText>
                  </MenuItem>
                  {/* {onDelete && (
                    <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                      <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Delete Course</ListItemText>
                    </MenuItem>
                  )} */}
                  {course.enabled ? (  
                    <MenuItem onClick={handleDisableCourseClick} sx={{ color: 'error.main' }}>
                      <ListItemIcon><BlockIcon fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Disable Course</ListItemText>
                    </MenuItem>
                  ) : null}
                </Menu>
              )}
            </>
          }
          title={<Typography variant="h6" noWrap overflow={'hidden'} maxWidth={'360px'} mb={1}>{course.title}</Typography>}
          sx={{ pb: 0 }}
        />
        <CardMedia
          component="img"
          height="160"
          image={`${process.env.REACT_APP_API_BASE_URL}/${course.image}`}
          alt={course.title}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, minHeight: '40px' }}>
            {course.description}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {course.categories.map((cat, index) => (
              <Chip key={index} label={cat.name} size="small" variant="outlined" />
            ))}
          </Box>
          
          {isAdmin && course.instructor && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Instructor: {course.instructor.full_name}
              </Typography>
            </Box>
          )}
        </CardContent>

        <Divider sx={{ mx: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <VisibilityIcon sx={{ fontSize: '1rem' }} />
            <Typography variant="caption">{course.views} Views</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <SchoolIcon sx={{ fontSize: '1rem' }} />
            <Typography variant="caption">{course.sales} Sales</Typography>
          </Box>
        </Box>

        <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography variant="h6" color="primary">${discountedPrice.toFixed(2)}</Typography>
              {course.discount > 0 && 
                <Typography variant="body2" sx={{ textDecoration: 'line-through' }} color="text.secondary">${course.price.toFixed(2)}</Typography>
              }
            </Box>
            <Chip 
              label={course.level ? `Level ${course.level}` : 'No level'} 
              color={course.enabled ? "primary" : "default"} 
              variant="filled" 
              size="small" 
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <CalendarTodayIcon sx={{ fontSize: '0.875rem' }} />
            <Typography variant="caption">Created: {formatDate(course.created_at)}</Typography>
          </Box>
          {!course.enabled && (
            <Box sx={{ mt: 1 }}>
              <Chip 
                label="Disabled" 
                color="error" 
                variant="outlined" 
                size="small" 
              />
            </Box>
          )}
        </Box>
      </Card>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={handleCancelAction}
        onConfirm={handleConfirmAction}
        title={dialogContent.title}
        contentText={dialogContent.content}
        confirmText={dialogContent.confirmText}
        confirmColor={dialogContent.confirmColor}
        cancelText="Cancel"
      />
    </>
  );
};

export default CourseCard;