// src/store/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const getPayouts = createAsyncThunk(
  'payment/getPayouts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/payouts');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch payouts' });
    }
  }
);

export const requestPayout = createAsyncThunk(
  'payment/requestPayout',
  async (payoutData, { rejectWithValue }) => {
    try {
      const response = await api.post('api/payouts', payoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to process payout' });
    }
  }
);

export const startExpressOnboarding = createAsyncThunk(
  'payment/startExpressOnboarding',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('api/payouts/connect');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to start onboarding' });
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payouts: [],
    loading: false,
    error: null,
    stripeOnboardingStatus: 'idle',
    onboardingUrl: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStripeOnboardingStatus: (state, action) => {
      state.stripeOnboardingStatus = action.payload;
    },
    clearOnboardingUrl: (state) => {
      state.onboardingUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(getPayouts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPayouts.fulfilled, (state, action) => {
        state.loading = false;
        state.payouts = action.payload.payouts;
      })
      .addCase(getPayouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch payouts';
      })
     
      .addCase(requestPayout.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestPayout.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to process payout';
      })
     
      .addCase(startExpressOnboarding.pending, (state) => {
        state.stripeOnboardingStatus = 'loading';
        state.loading = true;
      })
      .addCase(startExpressOnboarding.fulfilled, (state, action) => {
        state.stripeOnboardingStatus = 'succeeded';
        state.loading = false;
        state.onboardingUrl = action.payload.url;
      })
      .addCase(startExpressOnboarding.rejected, (state, action) => {
        state.stripeOnboardingStatus = 'failed';
        state.loading = false;
        state.error = action.payload?.error || 'Failed to start onboarding';
      });
  },
});

export const { clearError, setStripeOnboardingStatus, clearOnboardingUrl } = paymentSlice.actions;
export default paymentSlice.reducer;