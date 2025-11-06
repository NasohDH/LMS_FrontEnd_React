import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Box, Typography, Chip } from '@mui/material';

const LessonFormDialog = ({ open, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  
 
 
  const isUpdateMode = Boolean(initialData && initialData.id);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '');
      setVideoFile(null);
    }
  }, [initialData, open]);
  
  const isFormValid = () => {
   
    const videoRequirement = isUpdateMode ? true : !!videoFile;
    return title.trim() && videoRequirement;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    onSubmit({ title, videoFile });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isUpdateMode ? 'Update Lesson' : 'Add New Lesson'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Lesson Title" type="text"
            fullWidth required variant="outlined" value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Lesson Video {isUpdateMode ? '(Optional: only if changing)' : '(Required)'}
            </Typography>
            <Button variant="outlined" component="label" fullWidth sx={{mt: 1}}>
              Upload Video
              <input type="file" accept="video/mp4,video/x-m4v,video/*" hidden onChange={(e) => setVideoFile(e.target.files[0])} />
            </Button>
            {videoFile && <Chip label={videoFile.name} onDelete={() => setVideoFile(null)} sx={{mt: 1}} />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isFormValid()}>
            {isUpdateMode ? 'Save Changes' : 'Add Lesson'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LessonFormDialog;