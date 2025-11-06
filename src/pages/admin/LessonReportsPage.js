import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Paper, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import ReportCard from '../../components/admin/ReportCard';
import { fetchLessonReports, markReportAsReviewed, clearError } from '../../store/slices/lessonReportsSlice';

export default function LessonReportsPage() {
  const dispatch = useDispatch();
  const { reports, loading, error, updating } = useSelector(state => state.lessonReports);
  const [tab, setTab] = useState('pending');
  const [confirmState, setConfirmState] = useState({ open: false, data: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchLessonReports());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: typeof error === 'string' ? error : (error.message || 'An error occurred'),
        severity: 'error'
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleMarkAsReviewed = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setConfirmState({ open: true, data: report });
  };

  const handleConfirmAction = () => {
    const { data } = confirmState;
    if (data) {
      dispatch(markReportAsReviewed(data.id))
        .unwrap()
        .then(() => {
          setSnackbar({
            open: true,
            message: 'Report marked as reviewed successfully!',
            severity: 'success'
          });
        })
        .catch((error) => {
          setSnackbar({
            open: true,
            message: error.message || 'Failed to mark report as reviewed',
            severity: 'error'
          });
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

  const filteredReports = reports.filter(report => report.status === tab);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography>Loading reports...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Lesson Reports
        </Typography>
        <Typography color="text.secondary">
          Review and take action on lessons reported by students.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Pending" value="pending" />
          <Tab label="Reviewed" value="reviewed" />
        </Tabs>
      </Box>

      {filteredReports.length > 0 ? (
        filteredReports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onMarkAsReviewed={handleMarkAsReviewed}
            updating={updating}
          />
        ))
      ) : (
        <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
          <Typography variant="h6" color="text.secondary">
            No {tab} reports to show.
          </Typography>
        </Paper>
      )}

      <ConfirmationDialog
        open={confirmState.open}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmAction}
        title="Confirm Action"
        contentText={`Are you sure you want to mark the report for lesson "${confirmState.data?.lesson?.title}" as reviewed?`}
        loading={updating}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}