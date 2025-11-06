// src/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunk to update profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
     
      Object.keys(profileData).forEach(key => {
        if (key === 'avatarFile' && profileData[key]) {
          formData.append('avatar', profileData[key]);
        } else if (key !== 'avatarFile' && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      
      const response = await api.post('/api/profile', formData, {
        headers: {
          'Accept' : 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

     
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
  },
});

export const { clearError, clearSuccess } = profileSlice.actions;
export default profileSlice.reducer;