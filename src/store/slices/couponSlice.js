import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/instructor/coupons');
      return response.data.coupons;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch coupons');
    }
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
     
      const apiData = {
        ...couponData,
        value: couponData.value
      };
      
      const response = await api.post('api/instructor/coupon', apiData);
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create coupon');
    }
  }
);

export const toggleCouponStatus = createAsyncThunk(
  'coupons/toggleStatus',
  async (couponId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const coupon = state.coupons.coupons.find(c => c.id === couponId);
      const endpoint = `api/coupons/${couponId}/${coupon.is_active ? 'disable' : 'enable'}`;
      
      const response = await api.post(endpoint);
      return response.data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update coupon status');
    }
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState: {
    coupons: [],
    loading: false,
    error: null,
    formLoading: false,
    formError: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.formError = null;
    }
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(createCoupon.pending, (state) => {
        state.formLoading = true;
        state.formError = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.formLoading = false;
        state.coupons.unshift(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.formLoading = false;
        state.formError = action.payload;
      })
     
      .addCase(toggleCouponStatus.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      });
  }
});

export const { clearError } = couponSlice.actions;
export default couponSlice.reducer;