import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Button, Paper, Grid, TextField, Autocomplete, CircularProgress,
  Pagination, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import CourseFormDialog from '../../components/instructor/CourseFormDialog';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import CourseCard from '../../components/common/CourseCard';
import {
  fetchCourses,
  disableCourse,
  enableCourse,
  fetchAutocompleteSuggestions,
  clearAutocompleteSuggestions,
  searchCourses,
  clearSearchResults,
  setSearchQuery,
  updateCourse,
  clearUpdateError,
  createCourse
} from '../../store/slices/coursesSlice';

export default function CoursesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { 
    items: courses, 
    loading, 
    currentPage, 
    totalPages, 
    autocompleteSuggestions, 
    autocompleteLoading,
    searchResults,
    searchLoading,
    searchQuery,
    updateLoading,
    updateError
  } = useSelector(state => state.courses);
  const isAdmin = user?.role === 'admin';
  
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      dispatch(fetchCourses({
        instructorFilter: !isAdmin,
      }));
    }
  }, [dispatch, user, isAdmin]);

 
  useEffect(() => {
    if (updateError) {
      setSnackbar({ open: true, message: updateError, severity: 'error' });
      dispatch(clearUpdateError());
    }
  }, [updateError, dispatch]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, value) => {
    if (searchQuery) {
      dispatch(searchCourses({ query: searchQuery, page: value }));
    } else {
      dispatch(fetchCourses({
        page: value,
        instructorFilter: !isAdmin,
      }));
    }
  };

  const handleSearchInputChange = (event, newInputValue) => {
    setSearchInputValue(newInputValue);
    
    if (newInputValue.length > 1) {
      dispatch(fetchAutocompleteSuggestions(newInputValue));
    } else {
      dispatch(clearAutocompleteSuggestions());
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedValue(newValue);
    
    if (newValue) {
      dispatch(setSearchQuery(newValue));
      dispatch(searchCourses(newValue));
    } else if (searchQuery) {
      dispatch(clearSearchResults());
      dispatch(fetchCourses());
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchInputValue.trim()) {
      event.preventDefault();
      dispatch(setSearchQuery(searchInputValue.trim()));
      dispatch(searchCourses(searchInputValue.trim()));
    }
  };

  const handleCreateClick = () => {
    setCourseToEdit(null);
    setFormOpen(true);
  };

  const handleUpdateClick = (course) => {
    setCourseToEdit(course);
    setFormOpen(true);
  };
  
  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setConfirmOpen(true);
  };

  const handleDisableCourse = (course) => {
    dispatch(disableCourse(course.id));
  };

  const handleEnableCourse = (course) => {
    dispatch(enableCourse(course.id));
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      dispatch(disableCourse(courseToDelete.id));
    }
    handleCloseDialogs();
  };

  const handleCloseDialogs = () => {
    setFormOpen(false);
    setConfirmOpen(false);
    setCourseToEdit(null);
    setCourseToDelete(null);
  };
  
  const handleSaveCourse = async (formData, courseId) => {
    try {
      if (courseId) {
        await dispatch(updateCourse({ courseId, formData })).unwrap();
        setSnackbar({ open: true, message: 'Course updated successfully!', severity: 'success' });
      } else {
        console.log(formData);
        await dispatch(createCourse(formData)).unwrap();
        setSnackbar({ open: true, message: 'Course created successfully!', severity: 'success' });
      }
      handleCloseDialogs();
      
     
      if (searchQuery) {
        dispatch(searchCourses(searchQuery));
      } else {
        dispatch(fetchCourses({ instructorFilter: !isAdmin }));
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Failed to save course', severity: 'error' });
    }
  };

  const handleManageContent = (courseId) => {
    navigate(`/instructor/course/${courseId}`);
  };

  const displayCourses = searchQuery ? searchResults : 
    selectedValue ? courses.filter(course => course.title === selectedValue) : courses;

  const isLoading = loading || searchLoading || updateLoading;

  return (
    <Box sx={{ p: 4 }} >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {isAdmin ? 'Courses' : 'My Courses'} ({displayCourses.length})
          {searchQuery && ` - Search: "${searchQuery}"`}
        </Typography>
        
        {!isAdmin && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateClick}>
            New Course
          </Button>
        )}
      </Box>

      <Box sx={{ maxWidth: 450, mx: 'auto', mb: 4}}>
        <Autocomplete
          freeSolo
          id="course-autocomplete"
          options={autocompleteSuggestions}
          value={selectedValue}
          onChange={handleAutocompleteChange}
          inputValue={searchInputValue}
          onInputChange={handleSearchInputChange}
          loading={autocompleteLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search courses..."
              onKeyPress={handleKeyPress}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {autocompleteLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayCourses.length > 0 ? (
        <>
          <Grid container spacing={4} justifyContent="center">
            {displayCourses.map((course) => (
              <Grid item key={course.id} xs={12} sm={6} md={4} lg={3} sx={{ width: '410px !important' }}>
                <CourseCard 
                  course={course} 
                  onUpdate={isAdmin ? null : () => handleUpdateClick(course)} 
                  onDelete={isAdmin ? null : () => handleDeleteClick(course)}
                  onManageContent={isAdmin ? null : () => handleManageContent(course.id)}
                  onDisableCourse={() => handleDisableCourse(course)}
                  onEnableCourse={isAdmin ? () => handleEnableCourse(course) : null}
                  isAdmin={isAdmin}
                />
              </Grid>
            ))}
          </Grid>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      ) : (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              {searchQuery ? 'No courses found' : 'No courses to display'}
            </Typography>
            <Typography color="text.secondary">
              {searchQuery ? "Try a different search term." : (selectedValue ? "Clear your selection to see all courses." : "Create a new course to get started.")}
            </Typography>
          </Box>
        </Paper>
      )}

      <CourseFormDialog
        open={isFormOpen} 
        onClose={handleCloseDialogs} 
        onSave={handleSaveCourse} 
        initialData={courseToEdit} 
        loading={updateLoading}
      />
      
      <ConfirmationDialog 
        open={isConfirmOpen} 
        onClose={handleCloseDialogs} 
        onConfirm={handleConfirmDelete} 
        title="Delete Course" 
        contentText={`Are you sure you want to permanently delete "${courseToDelete?.title}"? This action cannot be undone.`} 
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}