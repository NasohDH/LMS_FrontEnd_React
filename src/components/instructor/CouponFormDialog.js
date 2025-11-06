import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, FormControlLabel, Checkbox, InputAdornment
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const CouponFormDialog = ({ open, onClose, onSave, loading }) => {
  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  
 
  const [errors, setErrors] = useState({});
  
 
  const coupons = useSelector(state => state.coupons.coupons);
  const existingCodes = coupons.map(c => c.code.toLowerCase());

 
  useEffect(() => {
    if (open) {
      setCode('');
      setValue('');
      setHasExpiry(false);
      setExpiresAt(null);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const tempErrors = {};
   
    if (!code) {
      tempErrors.code = "Coupon code is required.";
    } else if (existingCodes.includes(code.toLowerCase())) {
      tempErrors.code = "This coupon code already exists.";
    }
   
    if (!value) {
      tempErrors.value = "Discount value is required.";
    } else if (parseInt(value, 10) <= 0) {
      tempErrors.value = "Discount must be greater than 0.";
    } else if (parseInt(value, 10) > 100) {
      tempErrors.value = "Discount cannot exceed 100%.";
    }
   
    if (hasExpiry && expiresAt && dayjs(expiresAt).isBefore(dayjs(), 'day')) {
      tempErrors.expiresAt = "Expiry date must be in the future.";
    }

    setErrors(tempErrors);
   
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave({
        code: code.toUpperCase(),
        value: parseInt(value, 10),
        expires_at: hasExpiry && expiresAt ? expiresAt.format('YYYY-MM-DD') : null,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Coupon</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus margin="dense" label="Coupon Code" type="text"
          fullWidth variant="outlined" value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          error={!!errors.code}
          helperText={errors.code}
          sx={{ mt: 1 }}
        />
        <TextField
          margin="dense" label="Discount Value" type="number"
          fullWidth variant="outlined" value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          error={!!errors.value}
          helperText={errors.value}
          InputProps={{ 
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputProps: { min: 1, max: 100 } 
          }}
        />
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={<Checkbox checked={hasExpiry} onChange={(e) => setHasExpiry(e.target.checked)} />}
              label="Has Expiry Date"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Expires At"
                    value={expiresAt}
                    onChange={(newValue) => setExpiresAt(newValue)}
                    disabled={!hasExpiry}
                    disablePast
                    slotProps={{
                        textField: {
                            size: 'small',
                            error: !!errors.expiresAt,
                            helperText: errors.expiresAt,
                        }
                    }}
                />
            </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CouponFormDialog;