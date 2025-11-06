import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Snackbar, Alert
} from '@mui/material';
import { Add as AddIcon, ToggleOn as ToggleOnIcon, ToggleOff as ToggleOffIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import CouponFormDialog from '../../components/instructor/CouponFormDialog';
import dayjs from 'dayjs';
import { fetchCoupons, createCoupon, toggleCouponStatus, clearError } from '../../store/slices/couponSlice';

const isCouponExpired = (coupon) => {
  return coupon.expires_at && dayjs(coupon.expires_at).isBefore(dayjs(), 'day');
};

const CouponsPage = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error, formLoading, formError } = useSelector(state => state.coupons);
  const [isFormOpen, setFormOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (error || formError) {
     
    }
  }, [error, formError]);

  const handleOpenForm = () => setFormOpen(true);
  
  const handleCloseDialogs = () => {
    setFormOpen(false);
    dispatch(clearError());
  };

  const handleSaveCoupon = (newCouponData) => {
   
    const couponData = {
      ...newCouponData,
      value: Number(newCouponData.value)
    };
    
    dispatch(createCoupon(couponData))
      .unwrap()
      .then(() => {
        setFormOpen(false);
      })
      .catch(() => {
       
      });
  };

  const handleToggleStatus = (couponId) => {
    dispatch(toggleCouponStatus(couponId));
  };

  const handleCloseSnackbar = () => {
    dispatch(clearError());
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Coupons ({coupons?.length})
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenForm}>
          New Coupon
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="coupons table">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell align="right">Discount (%)</TableCell>
                <TableCell>Expires At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading coupons...
                  </TableCell>
                </TableRow>
              ) : (coupons ? (coupons.map((coupon) => {
               
                const displayValue = Math.round(coupon.value);
                const isExpired = isCouponExpired(coupon);
                const isEffectivelyActive = coupon.is_active && !isExpired;

                return (
                  <TableRow hover key={coupon.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">{coupon.code}</Typography>
                    </TableCell>
                    <TableCell align="right">{displayValue}%</TableCell>
                    <TableCell>
                      {coupon.expires_at ? dayjs(coupon.expires_at).format('MMM D, YYYY') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isExpired ? 'Expired' : (isEffectivelyActive ? 'Active' : 'Inactive')}
                        color={isExpired ? 'error' : (isEffectivelyActive ? 'success' : 'default')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleToggleStatus(coupon.id)}
                        disabled={isExpired}
                        title={isExpired ? 'Cannot modify expired coupon' : (coupon.is_active ? 'Disable Coupon' : 'Enable Coupon')}
                        color={coupon.is_active ? 'success' : 'default'}
                      >
                        {coupon.is_active ? <ToggleOnIcon /> : <ToggleOffIcon />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })):'')}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <CouponFormDialog
      open={isFormOpen}
      onClose={handleCloseDialogs}
      onSave={handleSaveCoupon}
      loading={formLoading}
  />

      <Snackbar 
        open={!!error || !!formError} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
      <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
        {error?.message || error || formError?.message || formError}
      </Alert>
      </Snackbar>
    </Box>
  );
};

export default CouponsPage;