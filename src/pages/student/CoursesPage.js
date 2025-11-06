import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Grid, TextField, Autocomplete, CircularProgress,
  Pagination, Snackbar, Alert, Chip
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import CourseCard from '../../components/common/CourseCard';
import {
  fetchCourses,
  fetchAutocompleteSuggestions,
  clearAutocompleteSuggestions,
  searchCourses,
  clearSearchResults,
  setSearchQuery
} from '../../store/slices/coursesSlice';

export default function StudentCoursesPage() {
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
    searchQuery
  } = useSelector(state => state.courses);
  
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      // Fetch all courses for students (no instructor filter)
      dispatch(fetchCourses({ instructorFilter: false }));
    }
  }, [dispatch, user]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, value) => {
    if (searchQuery) {
      dispatch(searchCourses({ query: searchQuery, page: value }));
    } else {
      dispatch(fetchCourses({
        page: value,
        instructorFilter: false,
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

  const displayCourses = searchQuery ? searchResults : 
    selectedValue ? courses.filter(course => course.title === selectedValue) : courses;

  const isLoading = loading || searchLoading;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          All Courses ({displayCourses.length})
          {searchQuery && ` - Search: "${searchQuery}"`}
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 450, mx: 'auto', mb: 4 }}>
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
              placeholder="Search by title, category, or instructor"
              onKeyPress={handleKeyPress}
              InputProps={{
                ...params.InputProps,
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
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
              <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                <CourseCard 
                  course={course} 
                  isAdmin={false}
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
              {searchQuery ? 'No courses found' : 'No courses available'}
            </Typography>
            <Typography color="text.secondary">
              {searchQuery ? "Try a different search term." : "Check back later for new courses."}
            </Typography>
          </Box>
        </Paper>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}