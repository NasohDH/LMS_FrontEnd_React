// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Helper function to extract error message
const getErrorMessage = (error) => {
  if (error.response) {
    const responseData = error.response.data.error;
    if (typeof responseData === 'string') 
     
      return responseData;
   
    if (error.response.data?.errors) {
     
      const firstErrorKey = Object.keys(error.response.data.errors)[0];
      const firstErrorMessage = error.response.data.errors[firstErrorKey]?.[0];
      return firstErrorMessage || `Validation error: ${error.response.status}`;
    }
    return error.response.data?.message || `Server error: ${error.response.status}`;
  } else if (error.request) {
   
    return 'Network error. Please check your connection.';
  } else {
   
    return error.message || 'An unexpected error occurred';
  }
};
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await api.get('/api/user', {
        signal,
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
     
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// The Async Thunk for logging in with timeout handling
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue, signal }) => {
    try {
      const response = await api.post('api/login', credentials, {
        signal,
        timeout: 10000,
      });
      
      const { token, user } = response.data;
      
     
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// API calls for forgot password functionality
export const sendResetCode = createAsyncThunk(
  'auth/sendResetCode',
  async (email, { rejectWithValue, signal }) => {
    try {
      const response = await api.post('/api/password/forgot', { email }, {
        signal,
        timeout: 10000,
      });
      
      return response.data;
    } catch (error) {
    return rejectWithValue(getErrorMessage(error));
      }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, code, password, password_confirmation }, { rejectWithValue, signal }) => {
    try {
      const response = await api.post('/api/password/reset', {
        email,
        code,
        password,
        password_confirmation
      }, {
        signal,
        timeout: 10000,
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
// Add this to your authSlice.js file
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue, signal }) => {
    try {
      const response = await api.post('api/register', formData, {
        signal,
        timeout: 10000,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Add these to your authSlice.js file

// Verify email with code
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ code }, { rejectWithValue, signal, getState }) => {
    try {
      const email = getState().auth.signinEmail;

      const response = await api.post('/api/register/verify', { email, code }, {
        signal,
        timeout: 10000,
      });
      localStorage.setItem('token', response.data.token);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Upload CV for instructors
export const uploadCv = createAsyncThunk(
  'auth/uploadCv',
  async (formData, { rejectWithValue, signal }) => {
    try {
      const response = await api.post('/api/instructor/upload-cv', formData, {
        signal,
        timeout: 10000,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Define the initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  resetEmail: null,
  resetStep: 0,
  signinEmail: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setResetStep: (state, action) => {
      state.resetStep = action.payload;
    },
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    },
    clearResetState: (state) => {
      state.resetEmail = null;
      state.resetStep = 0;
      state.error = null;
      state.successMessage = null;
    },
    setSigninEmail: (state, action) => {
      state.signinEmail = action.payload;
    }
  },

 
  extraReducers: (builder) => {
   
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.successMessage = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.successMessage = null;
      });
    
   
    builder
    .addCase(sendResetCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    })
    .addCase(sendResetCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.resetStep = 1;
      state.resetEmail = action.meta.arg;  
      state.error = null;
      state.successMessage = 'Verification code sent to your email.';
    })
    .addCase(sendResetCode.rejected, (state, action) => {
      state.isLoading = false;              
      state.error = action.payload;
      state.successMessage = null;
    });
    
   
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetStep = 0;
        state.resetEmail = null;
        state.error = null;
        state.successMessage = 'Password reset successfully. You can now login with your new password.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
      builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || 'Registration successful!';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.successMessage = null;
      });
     

// Verify email cases
builder
.addCase(verifyEmail.pending, (state) => {
  state.isLoading = true;
  state.error = null;
  state.successMessage = null;
})
.addCase(verifyEmail.fulfilled, (state, action) => {
  state.isLoading = false;
  state.error = null;
  state.successMessage = action.payload.message;
  state.token = action.payload.token;
  state.user = action.payload.user;
})
.addCase(verifyEmail.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
  state.successMessage = null;
});
builder
// Upload CV cases
.addCase(uploadCv.pending, (state) => {
  state.isLoading = true;
  state.error = null;
  state.successMessage = null;
})
.addCase(uploadCv.fulfilled, (state, action) => {
  state.isLoading = false;
  state.successMessage = action.payload.message || 'CV uploaded successfully!';
  state.error = null;
  if (state.user && state.user.instructor) {
    state.user.instructor.cv_path = action.payload.instructor.cv_path;
  }
});
 
builder
  .addCase(fetchUserData.pending, (state) => {
  state.isUserDataLoading = true;
  state.error = null;
})
.addCase(fetchUserData.fulfilled, (state, action) => {
  state.isUserDataLoading = false;
  state.user = action.payload.user;
  state.isAuthenticated = true;
})
.addCase(fetchUserData.rejected, (state, action) => {
  state.isUserDataLoading = false;
  state.error = action.payload;
  state.isAuthenticated = false;
  state.user = null;
  state.token = null;
  localStorage.removeItem('token');
});
builder
.addCase(uploadCv.rejected, (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
  state.successMessage = null;
  if (state.user) {
    state.user.cv_uploaded = true;
    state.user.status = 'pending';
  }
});
  }});

export const { 
  logout, 
  clearError, 
  clearMessages,
  setResetStep, 
  setResetEmail, 
  clearResetState,
  setSigninEmail,
} = authSlice.actions;
export default authSlice.reducer;