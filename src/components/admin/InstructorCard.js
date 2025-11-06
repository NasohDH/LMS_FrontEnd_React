import React, { useState } from 'react';
import {
  Card, CardHeader, Avatar, CardContent, Typography, Box, Chip,
  IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

const InstructorCard = ({ instructor, onToggleDisabled, onToggleCourses }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleToggleClick = (handle, action) => {
    if(handle ==='instructor')
      onToggleDisabled(instructor.id, instructor.disabled);
    else
      onToggleCourses(instructor.id, action);
    handleClose();
  };

  const avatarUrl = instructor.avatar;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar 
            src={avatarUrl}
            sx={{ width: 56, height: 56 }}
          />
        }
        action={
          <>
            <IconButton onClick={handleClick}><MoreVertIcon /></IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>

              <MenuItem onClick={() => handleToggleClick('instructor', '')}>
                <ListItemIcon>
                  {instructor.disabled
                    ? <CheckCircleIcon fontSize="small" color="success" />
                    : <BlockIcon fontSize="small" color="error" />
                  }
                </ListItemIcon>
                <ListItemText>{instructor.disabled ? 'Enable' : 'Disable'}</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => handleToggleClick('course', 'disable')}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Disable all courses</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => handleToggleClick('course', 'enable')}>
                <ListItemIcon>
                  <CheckCircleIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Enable all courses</ListItemText>
              </MenuItem>

            </Menu>
          </>
        }
        title={<Typography variant="h6" noWrap>{instructor.full_name}</Typography>}
        subheader={`Joined: ${dayjs(instructor.created_at).format('MMM YYYY')}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Chip 
                icon={<VerifiedUserIcon />} 
                label={instructor.verified ? 'Verified' : 'Not Verified'} 
                color={instructor.verified ? 'success' : 'default'}
                size="small" 
            />
             <Chip 
                label={instructor.disabled ? 'Disabled' : 'Active'} 
                color={instructor.disabled ? 'error' : 'success'}
                variant="outlined"
                size="small" 
            />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3, minHeight: '60px'
        }}>
          {instructor.bio || 'No biography provided.'}
        </Typography>
      </CardContent>
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', p: 2 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">{instructor.views}</Typography>
          <Typography variant="caption" color="text.secondary">Profile Views</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ fontSize: 18, color: 'warning.main', mr: 0.5 }} /> {instructor.rating.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary">Avg. Rating</Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default InstructorCard;