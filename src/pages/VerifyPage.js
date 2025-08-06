import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Link } from '@mui/material';
// import bgImage from '../assets/bg.jpg';

const VerifyPage = () => {
  const [code, setCode] = useState('');
  const isVerifyValid = code.trim().length > 0;

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    //   backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 16, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5">Verify Your Account</Typography>
          <Typography variant="body2" color="textSecondary">Enter the verification code sent to your email.</Typography>
        </Box>
        <TextField
          fullWidth
          variant="outlined"
          margin="normal"
          label="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: '#F7F7F7',
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#888' },
              '&.Mui-focused fieldset': { borderColor: '#26BA9A' },
            },
          }}
        />
        <Button fullWidth variant="contained" disabled={!isVerifyValid} sx={{ py: 1.5, mt: 2, backgroundColor: '#26BA9A', borderRadius: 8, '&:hover': { backgroundColor: '#20A88A' } }}>
          Verify
        </Button>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">Have an account?{' '}<Link href="/" underline="none" sx={{ color: '#26BA9A', fontWeight: 'bold' }}>Login</Link></Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyPage; 