import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';

const WithdrawDialog = ({
  open,
  onClose,
  onConfirm,
  currentBalance,
  isLoading,
}) => {
  const [amount, setAmount] = useState('');

  const handleClose = () => {
    setAmount('');
    onClose();
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (Number(value) >= 0 && Number(value) <= currentBalance)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (amount && Number(amount) >= 10) {
      onConfirm(Number(amount));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Withdraw Funds</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box>
            <Typography variant="body1" gutterBottom>
              Your current balance: ${(+currentBalance).toFixed(2)}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Withdrawal Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={handleAmountChange}
              inputProps={{
                min: 10,
                max: currentBalance,
                step: 0.01,
              }}
              helperText={`Minimum withdrawal: $10.00`}
            />
            {amount && Number(amount) < 10 && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Minimum withdrawal amount is $10.00
              </Alert>
            )}
            {amount && Number(amount) > currentBalance && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Amount exceeds your current balance
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!amount || Number(amount) < 10 || Number(amount) > currentBalance || isLoading}
            sx={{ backgroundColor: '#26BA9A', '&:hover': { backgroundColor: '#20A88A' } }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Withdraw'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WithdrawDialog;