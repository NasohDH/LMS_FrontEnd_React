import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import CourseSection from '../../components/instructor/CourseSection';
import SimpleFormDialog from '../../components/common/SimpleFormDialog';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import LessonFormDialog from '../../components/instructor/LessonFormDialog';
import {
  fetchCourseDetails,
  addSection,
  updateSection,
  deleteSection,
  addLesson,
  updateLesson,
  deleteLesson,
  addSubtitles,
  deleteSubtitle,
  clearError,
} from '../../store/slices/courseSlice';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course, loading, error } = useSelector((state) => state.course);
  
  const [sectionDialog, setSectionDialog] = useState({ open: false, mode: '', data: null });
  const [lessonDialog, setLessonDialog] = useState({ open: false, mode: '', data: null });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, mode: '', data: null });

  useEffect(() => {
    dispatch(fetchCourseDetails(courseId));
  }, [courseId, dispatch]);

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const handleOpenDialog = (type, mode, data = null) => {
    if (type === 'section') setSectionDialog({ open: true, mode, data });
    if (type === 'lesson') setLessonDialog({ open: true, mode, data });
  };
  
  const handleCloseDialogs = () => {
    setSectionDialog({ open: false, mode: '', data: null });
    setLessonDialog({ open: false, mode: '', data: null });
    setConfirmDialog({ open: false, mode: '', data: null });
  };
  
  const handleOpenConfirm = (mode, data) => setConfirmDialog({ open: true, mode, data });

  const handleSaveSection = (newTitle) => {
    const { mode, data } = sectionDialog;
    if (mode === 'addSection') {
      dispatch(addSection({ courseId, title: newTitle }));
    } else if (mode === 'updateSection') {
      dispatch(updateSection({ sectionId: data.id, title: newTitle }));
    }
    handleCloseDialogs();
  };

  const handleSaveLesson = ({ title, videoFile }) => {
    const { mode, data } = lessonDialog;
    if (mode === 'addLesson') {
      dispatch(addLesson({ sectionId: data.sectionId, title, video: videoFile }));
    } else if (mode === 'updateLesson') {
      dispatch(updateLesson({ lessonId: data.id, title, video: videoFile }));
    }
    handleCloseDialogs();
  };

  const handleConfirmDelete = () => {
    const { mode, data } = confirmDialog;
    if (mode === 'deleteSection') {
      dispatch(deleteSection(data.id));
    } else if (mode === 'deleteLesson') {
      dispatch(deleteLesson(data.lessonId));
    }
    handleCloseDialogs();
  };

  const handleAddSubtitles = (lessonId, subtitles) => {
    dispatch(addSubtitles({ lessonId, subtitles }));
  };

  const handleDeleteSubtitle = (lessonId, lang) => {
    dispatch(deleteSubtitle({ lessonId, lang }));
  };

 
  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Course not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/instructor/courses')}>Back to My Courses</Button>
      <Typography variant="h4" sx={{ my: 2 }}>{course.title} - Content</Typography>

      <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
        {course.sections.map(section => (
          <CourseSection 
            key={section.id} 
            section={section}
            onUpdateSection={() => handleOpenDialog('section', 'updateSection', section)}
            onDeleteSection={() => handleOpenConfirm('deleteSection', section)}
            onAddLesson={() => handleOpenDialog('lesson', 'addLesson', { sectionId: section.id })}
            onUpdateLesson={(lesson) => handleOpenDialog('lesson', 'updateLesson', lesson)}
            onDeleteLesson={(lessonId) => handleOpenConfirm('deleteLesson', { lessonId })}
            onAddSubtitles={handleAddSubtitles}
            onDeleteSubtitle={handleDeleteSubtitle}
          />
        ))}
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog('section', 'addSection')} fullWidth sx={{ mt: 2, py: 1.5 }}>Add Section</Button>
      </Paper>

      <SimpleFormDialog 
        open={sectionDialog.open} onClose={handleCloseDialogs} onSubmit={handleSaveSection}
        title={sectionDialog.mode === 'addSection' ? 'Add New Section' : 'Rename Section'}
        label="Section Title" initialValue={sectionDialog.data?.title || ''}
      />
      <LessonFormDialog 
        open={lessonDialog.open} onClose={handleCloseDialogs} onSubmit={handleSaveLesson}
        initialData={lessonDialog.data}
      />
      <ConfirmationDialog
        open={confirmDialog.open} onClose={handleCloseDialogs} onConfirm={handleConfirmDelete}
        title={`Confirm Deletion`}
        contentText="Are you sure you want to delete this item? This action cannot be undone."
      />

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'An error occurred'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseDetailsPage;