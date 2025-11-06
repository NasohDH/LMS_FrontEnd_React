import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Button, Paper, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress, CardContent,
  Alert, Snackbar
} from '@mui/material';
import { AccountBalanceWallet as WalletIcon, MonetizationOn as EarningsIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import WithdrawDialog from '../../components/instructor/WithdrawDialog';
import { getPayouts, requestPayout, startExpressOnboarding, clearError, clearOnboardingUrl } from '../../store/slices/paymentSlice';


const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading: authLoading } = useSelector(state => state.auth);
  const { payouts, loading: paymentLoading, error, onboardingUrl } = useSelector(state => state.payment);
  
  const isAdmin = user?.role === 'admin';
  const instructor = user?.instructor;
  
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

 
  const isStripeOnboarded = instructor?.stripe_account_id !== null;

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getPayouts());
    }
  }, [dispatch, isAuthenticated, user, isWithdrawDialogOpen]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (onboardingUrl) {
      window.location.href = onboardingUrl;
      dispatch(clearOnboardingUrl());
    }
  }, [onboardingUrl, dispatch]);

  const handleSetupPayouts = () => {
    dispatch(startExpressOnboarding());
  };

  const handleConfirmWithdrawal = async (amount) => {
      try {
        await dispatch(requestPayout({ amount, note: 'Withdrawal request' })).unwrap();
        setWithdrawDialogOpen(false);
        setSnackbarMessage(`Your withdrawal request for $${(+amount).toFixed(2)} has been submitted successfully!`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
      }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    dispatch(clearError());
  };

 
  if (authLoading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb:'10px' }}>
          {isAdmin ? 'Payout History' : 'Earnings'}
        </Typography>
        
        {!isAdmin && (
          isStripeOnboarded ? (
            <Button 
                variant="contained" 
                size="large" 
                onClick={() => setWithdrawDialogOpen(true)} 
                disabled={!instructor || instructor?.current_balance <= 0}
                sx={{ backgroundColor: '#26BA9A', '&:hover': { backgroundColor: '#20A88A' } }}
            >
                Withdraw Funds
            </Button>
          ) : (
            <Button 
                variant="contained" 
                size="large" 
                onClick={handleSetupPayouts} 
                disabled={paymentLoading}
                sx={{ backgroundColor: '#26BA9A', '&:hover': { backgroundColor: '#20A88A' } }}
            >
                {paymentLoading ? <CircularProgress size={24} color="inherit" /> : 'Setup Payouts'}
            </Button>
          )
        )}
      </Box>
      
      {!isAdmin && instructor && (
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
              <Paper variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <WalletIcon color="primary" sx={{ fontSize: 40 }}/>
                          <Box>
                              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                ${instructor.current_balance ? (+instructor.current_balance).toFixed(2) : '0.00'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">Current Balance</Typography>
                          </Box>
                      </Box>
                  </CardContent>
              </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
              <Paper variant="outlined">
                  <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <EarningsIcon color="action" sx={{ fontSize: 40 }}/>
                          <Box>
                              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                ${instructor.total_earnings ? (+instructor.current_balance).toFixed(2) : '0.00'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">Total Earnings (All Time)</Typography>
                          </Box>
                      </Box>
                  </CardContent>
              </Paper>
          </Grid>
        </Grid>
      )}
      
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        {!isAdmin ? 'Withdrawal History': ''}
      </Typography>
      
      {paymentLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  {isAdmin && <TableCell>Instructor</TableCell>}
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payouts && payouts.length > 0 ? (
                  payouts.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell>{dayjs(row.created_at).format('MMM D, YYYY')}</TableCell>
                      {isAdmin && <TableCell>{row.instructor?.full_name || 'N/A'}</TableCell>}
                      <TableCell>${row.amount ? row.amount.toFixed(2) : '0.00'}</TableCell>
                      <TableCell>
                        <Chip 
                            label={row.status} 
                            color={row.status === 'paid' ? 'success' : 'warning'} 
                            size="small" 
                        />
                      </TableCell>
                      <TableCell><code>{row.stripe_transfer_id || row.id}</code></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} align="center">
                      No payout history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {!isAdmin && (
        <WithdrawDialog
          open={isWithdrawDialogOpen}
          onClose={() => setWithdrawDialogOpen(false)}
          onConfirm={handleConfirmWithdrawal}
          currentBalance={instructor?.current_balance || 0}
          isLoading={paymentLoading}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentsPage;