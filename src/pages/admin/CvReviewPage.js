import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import InstructorCvCard from '../../components/admin/InstructorCvCard';
import {
  fetchPendingCvs,
  acceptCv,
  rejectCv,
  clearError,
} from '../../store/slices/cvReviewSlice';

export default function CvReviewPage() {
  const dispatch = useDispatch();
  const { instructors, loading, error, actionLoading } = useSelector(
    (state) => state.cvReview
  );
  const [confirmState, setConfirmState] = useState({ 
    open: false, 
    data: null, 
    action: null 
  });

  useEffect(() => {
    dispatch(fetchPendingCvs());
  }, [dispatch]);

  const handleAcceptClick = (instructor) => {
    setConfirmState({
      open: true,
      data: instructor,
      action: 'accept',
    });
  };

  const handleRejectClick = (instructor) => {
    setConfirmState({
      open: true,
      data: instructor,
      action: 'reject',
    });
  };

  const handleConfirmAction = async () => {
    const { data, action } = confirmState;
    
    try {
      if (action === 'accept') {
        await dispatch(acceptCv(data.id)).unwrap();
      } else {
        await dispatch(rejectCv(data.id)).unwrap();
      }
      
      handleCloseDialogs();
    } catch (error) {
      console.error('Action failed:', error);
     
      handleCloseDialogs();
    }
  };

  const handleCloseDialogs = () => {
    setConfirmState({ open: false, data: null, action: null });
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const getConfirmationText = () => {
    if (!confirmState.data) return {};
    const actionText = confirmState.action === 'accept' ? 'Accept' : 'Reject';
    return {
      title: `Confirm Application ${actionText}`,
      contentText: `Are you sure you want to ${actionText.toLowerCase()} the application for "${confirmState.data.full_name}"?`
    };
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading pending CVs...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          CV Review
        </Typography>
        <Typography color="text.secondary">
          Review and approve pending instructor applications.
        </Typography>
      </Box>

      {instructors.length > 0 ? (
        instructors.map((instructor) => (
          <InstructorCvCard
            key={instructor.id}
            instructor={instructor}
            onAccept={() => handleAcceptClick(instructor)}
            onReject={() => handleRejectClick(instructor)}
            loading={actionLoading === instructor.id}
          />
        ))
      ) : (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No pending CVs to review.
            </Typography>
          </Box>
        </Paper>
      )}

      <ConfirmationDialog
        open={confirmState.open}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmAction}
        title={getConfirmationText().title}
        contentText={getConfirmationText().contentText}
        loading={actionLoading === confirmState.data?.id}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error?.message || 'An error occurred'}
        </Alert>
      </Snackbar>
    </Box>
  );
}