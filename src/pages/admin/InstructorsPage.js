import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, TextField, CircularProgress, 
  Snackbar, Alert, Button, Pagination
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInstructors,
  searchInstructors,
  toggleInstructorStatus,
  clearError,
  resetSearch,
  toggleInstructorCoursesStatus
} from '../../store/slices/instructorsSlice';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import InstructorCard from '../../components/admin/InstructorCard';

export default function InstructorsPage() {
  const dispatch = useDispatch();
  const { 
    list, 
    loading, 
    error, 
    searchLoading, 
    pagination,
    isSearching 
  } = useSelector(state => state.instructors);
  
  const [confirmState, setConfirmState] = useState({ open: false, data: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentPage, setCurrentPage] = useState(1);

 
  const debouncedSearch = useCallback(
    (query) => {
      if (query.trim() === '') {
        dispatch(resetSearch());
        dispatch(fetchInstructors(1));
        setCurrentPage(1);
      } else {
        dispatch(searchInstructors(query));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchInstructors(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (error) {
      setSnackbar({ 
        open: true, 
        message: error.message || 'An error occurred', 
        severity: 'error' 
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
   
    const timeoutId = setTimeout(() => {
      debouncedSearch(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleToggleDisabled = (instructorId, isDisabled) => {
    const instructor = list.find(inst => inst.id === instructorId);
    setConfirmState({
      open: true,
      data: { 
        instructorId, 
        isDisabled, 
        name: instructor.full_name,
        currentEnabled: !isDisabled
      }
    });
  };
  const handleToggleCourses = (instructorId, enable) => {
    dispatch(toggleInstructorCoursesStatus({instructorId, enable}));
    dispatch(fetchInstructors(currentPage));
    
  };
  const handleConfirmToggle = async () => {
    const { instructorId, isDisabled } = confirmState.data;
    try {
      await dispatch(toggleInstructorStatus({ 
        instructorId, 
        enabled: isDisabled
      })).unwrap();
      
      setSnackbar({ 
        open: true, 
        message: `Instructor ${isDisabled ? 'enabled' : 'disabled'} successfully`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message || 'Failed to update instructor status', 
        severity: 'error' 
      });
    }
    handleCloseDialogs();
  };

  const handleCloseDialogs = () => {
    setConfirmState({ open: false, data: null });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(resetSearch());
    dispatch(fetchInstructors(1));
    setCurrentPage(1);
  };

  const displayedInstructors = list || [];
  const totalCount = isSearching ? displayedInstructors.length : pagination.total;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Instructors ({totalCount})
        </Typography>
      </Box>

      {/* Search bar */}
      <Box sx={{ maxWidth: 550, width: '100%', mx: 'auto', mb: 4, position: 'relative' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search by instructor name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            endAdornment: searchLoading && (
              <CircularProgress size={20} />
            ),
          }}
        />
        {searchQuery && (
          <Button
            size="small"
            onClick={handleClearSearch}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            Clear
          </Button>
        )}
      </Box>

      {/* Loading state */}
      {(loading || searchLoading) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Instructors grid */}
      {!loading && !searchLoading && displayedInstructors.length > 0 ? (
        <>
          <Grid container spacing={4} justifyContent="center">
            {displayedInstructors.map((instructor) => (
              <Grid item key={instructor.id} xs={12} sm={6} md={4} lg={3} sx={{ width: '400px !important' }}>
                <InstructorCard 
                  instructor={{
                    ...instructor,
                    disabled: !instructor.enabled,
                    verified: instructor.verified === 1,
                    rating: parseFloat(instructor.rating) || 0,
                    views: parseInt(instructor.views) || 0
                  }}
                  onToggleDisabled={handleToggleDisabled}
                  onToggleCourses={handleToggleCourses}
                />
              </Grid>
            ))}
          </Grid>

          {!isSearching && pagination.last_page > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.last_page}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        !loading && !searchLoading && (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
            <Box sx={{ py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                {searchQuery ? 'No instructors found matching your search.' : 'No instructors found.'}
              </Typography>
            </Box>
          </Paper>
        )
      )}

      <ConfirmationDialog
        open={confirmState.open}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmToggle}
        title={`${confirmState.data?.isDisabled ? 'Enable' : 'Disable'} Instructor`}
        contentText={`Are you sure you want to ${confirmState.data?.isDisabled ? 'enable' : 'disable'} the instructor "${confirmState.data?.name}"?`}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}