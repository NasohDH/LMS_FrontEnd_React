// src/store/slices/cvReviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const fetchPendingCvs = createAsyncThunk(
  'cvReview/fetchPendingCvs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/admin/pending-cvs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const acceptCv = createAsyncThunk(
  'cvReview/acceptCv',
  async (instructorId, { rejectWithValue }) => {
    try {
      const response = await api.post(`api/instructors/${instructorId}/accept-cv`);
      return { instructorId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const rejectCv = createAsyncThunk(
  'cvReview/rejectCv',
  async (instructorId, { rejectWithValue }) => {
    try {
      const response = await api.post(`api/instructors/${instructorId}/reject-cv`);
      return { instructorId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cvReviewSlice = createSlice({
  name: 'cvReview',
  initialState: {
    instructors: [],
    loading: false,
    error: null,
    actionLoading: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    removeInstructor: (state, action) => {
      state.instructors = state.instructors.filter(
        inst => inst.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchPendingCvs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingCvs.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload.instructors;
      })
      .addCase(fetchPendingCvs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(acceptCv.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(acceptCv.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.instructors = state.instructors.filter(
          inst => inst.id !== action.payload.instructorId
        );
      })
      .addCase(acceptCv.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      })
     
      .addCase(rejectCv.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(rejectCv.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.instructors = state.instructors.filter(
          inst => inst.id !== action.payload.instructorId
        );
      })
      .addCase(rejectCv.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, removeInstructor } = cvReviewSlice.actions;
export default cvReviewSlice.reducer;