import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, IconButton, TextField, Button, List, ListItem, ListItemText,
  Chip, Divider, CircularProgress, Alert
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  DragIndicator as DragIndicatorIcon, 
  Videocam as VideocamIcon, 
  Timer as TimerIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { updateLesson, fetchSubtitles, addSubtitles, deleteSubtitle } from '../../store/slices/courseSlice';

const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const CourseLesson = ({ lesson, onUpdate, onDelete }) => {
  const dispatch = useDispatch();
  const [newSubtitleLang, setNewSubtitleLang] = useState('');
  const [newSubtitleFile, setNewSubtitleFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
 
  const { subtitles, subtitlesLoading, subtitlesError } = useSelector(state => state.course);
  const lessonSubtitles = subtitles[lesson.file_name] || [];

  useEffect(() => {
    if (lesson.file_name) {
      dispatch(fetchSubtitles(lesson.file_name));
    }
  }, [lesson.file_name, dispatch]);

  const handleVideoUpload = async (file) => {
    if (!file || !lesson.id) return;

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', lesson.title);
      
      await dispatch(updateLesson({
        lessonId: lesson.id,
        title: lesson.title,
        video: file
      })).unwrap();

      setUploadSuccess(true);
      setVideoFile(null);
      
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      
    } catch (error) {
      setUploadError('Failed to upload video');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError('File size must be less than 500MB');
        return;
      }
      
      const validTypes = ['video/mp4', 'video/x-m4v', 'video/quicktime', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Please select a valid video file (MP4, MOV, WebM, or OGG)');
        return;
      }
      
      setVideoFile(file);
      setUploadError('');
      setUploadSuccess(false);
      handleVideoUpload(file);
    }
  };

  const handleAddSubtitle = async () => {
    if (newSubtitleLang && newSubtitleFile) {
      try {
        await dispatch(addSubtitles({
          lessonId: lesson.id,
          subtitles: { [newSubtitleLang]: newSubtitleFile }
        })).unwrap();
        
        setNewSubtitleLang('');
        setNewSubtitleFile(null);
       
        dispatch(fetchSubtitles(lesson.file_name));
      } catch (error) {
        setUploadError('Failed to add subtitle');
      }
    }
  };

  const handleRemoveSubtitle = async (lang) => {
    try {
      await dispatch(deleteSubtitle({
        lessonId: lesson.id,
        lang
      })).unwrap();
      
     
      dispatch(fetchSubtitles(lesson.file_name));
    } catch (error) {
      setUploadError('Failed to remove subtitle');
    }
  };

  const getUploadStatusText = () => {
    if (uploadSuccess) return 'Upload completed successfully!';
    if (uploadError) return 'Upload failed';
    return lesson.file_name ? 'Video is uploaded' : 'No video uploaded';
  };

  const getUploadStatusColor = () => {
    if (uploadSuccess) return 'success.main';
    if (uploadError) return 'error.main';
    if (videoFile) return 'text.primary';
    return lesson.file_name ? 'text.primary' : 'text.secondary';
  };

  const getUploadIcon = () => {
    if (uploadError) return <ErrorIcon color="error" />;
    return <VideocamIcon color={lesson.file_name ? 'primary' : 'action'} />;
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
      <DragIndicatorIcon sx={{ cursor: 'grab', color: 'text.secondary', mt: 1 }} />
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">{lesson.title}</Typography>
            <Box>
                <IconButton onClick={onUpdate} size="small" title="Rename Lesson">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={onDelete} size="small" title="Delete Lesson">
                  <DeleteIcon />
                </IconButton>
            </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, color: 'text.secondary' }}>
          <TimerIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption">Duration: {formatDuration(lesson.duration)}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
            <Typography variant="subtitle2" gutterBottom>Video Content</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getUploadIcon()}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" color={getUploadStatusColor()}>
                        {getUploadStatusText()}
                      </Typography>
                    </Box>
                    
                    {!uploadSuccess && (
                      <Button variant="outlined" component="label" size="small">
                        {lesson.file_name ? 'Change Video' : 'Upload Video'}
                        <input 
                          type="file" 
                          accept="video/mp4,video/x-m4v,video/*,video/quicktime,video/webm,video/ogg" 
                          hidden 
                          onChange={handleFileSelect}
                        />
                      </Button>
                    )}
                </Box>

                {uploadError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {uploadError}
                  </Alert>
                )}

                {uploadSuccess && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    Video uploaded successfully! The changes will be reflected shortly.
                  </Alert>
                )}
            </Box>
        </Box>

        <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>Manage Subtitles</Typography>
            {subtitlesLoading ? (
                <CircularProgress size={24} />
            ) : subtitlesError ? (
                <Alert severity="error" sx={{ mt: 1 }}>
                  Failed to load subtitles
                </Alert>
            ) : (
                <List dense>
                    {lessonSubtitles ? lessonSubtitles.map(sub => (
                        <ListItem key={sub.lang} disableGutters secondaryAction={
                          <Button 
                            size="small" 
                            color="error" 
                            onClick={() => handleRemoveSubtitle(sub.lang)}
                          >
                            Remove
                          </Button>
                        }>
                            <ListItemText primary={sub.label} secondary={sub.fileName} />
                        </ListItem>
                    )):''}
                    {lessonSubtitles.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        No subtitles found for this video.
                      </Typography>
                    )}
                </List>
            )}
            <Box display="flex" gap={2} alignItems="center" mt={1}>
                <TextField 
                  size="small" 
                  label="Language Code (e.g., en)" 
                  value={newSubtitleLang} 
                  onChange={e => setNewSubtitleLang(e.target.value)}
                  placeholder="en, fr, es, etc."
                />
                <Button variant="outlined" component="label" size="small">
                  Upload .vtt
                  <input 
                    type="file" 
                    accept=".vtt" 
                    hidden 
                    onChange={e => setNewSubtitleFile(e.target.files[0])}
                  />
                </Button>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={handleAddSubtitle} 
                  disabled={!newSubtitleLang || !newSubtitleFile}
                >
                  Add
                </Button>
            </Box>
            {newSubtitleFile && (
              <Chip 
                label={`New: ${newSubtitleFile.name}`} 
                onDelete={() => setNewSubtitleFile(null)} 
                size="small" 
                sx={{mt: 1}} 
              />
            )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CourseLesson;