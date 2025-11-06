// src/store/slices/instructorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const fetchInstructors = createAsyncThunk(
  'instructors/fetchInstructors',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/instructors?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchInstructors = createAsyncThunk(
  'instructors/searchInstructors',
  async (searchKey, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/search?key=${searchKey}&type=instructors`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleInstructorStatus = createAsyncThunk(
  'instructors/toggleStatus',
  async ({ instructorId, enabled }, { rejectWithValue }) => {
    try {
      const endpoint = enabled ? 'enable' : 'disable';
      const response = await api.post(`/api/instructors/${instructorId}/${endpoint}`);
      return { 
        instructorId, 
        enabled: !enabled,
        instructor: response.data.instructor
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleInstructorCoursesStatus = createAsyncThunk(
  'instructors/toggleCoursesStatus',
  async ({ instructorId, enable }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/instructor/${instructorId}/courses/${enable}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
const instructorsSlice = createSlice({
  name: 'instructors',
  initialState: {
    list: [],
    loading: false,
    error: null,
    searchLoading: false,
    searchError: null,
    isSearching: false,
    pagination: {
      current_page: 1,
      total: 0,
      per_page: 10,
      last_page: 1
    }
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.searchError = null;
    },
    resetSearch: (state) => {
      state.isSearching = false;
      state.list = state.originalList || [];
    },
    loadMoreInstructors: (state, action) => {
     
      state.list = [...state.list, ...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSearching = false;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.data;
        state.pagination = {
          current_page: action.payload.data.current_page,
          total: action.payload.data.total,
          per_page: action.payload.data.per_page,
          last_page: action.payload.data.last_page
        };
       
        if (!state.originalList) {
          state.originalList = action.payload.data.data;
        }
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isSearching = false;
      })
     
      .addCase(searchInstructors.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.isSearching = true;
      })
      .addCase(searchInstructors.fulfilled, (state, action) => {
        state.searchLoading = false;
       
        if (action.payload.instructors) {
          state.list = action.payload.instructors;
        } else if (action.payload.data) {
          state.list = action.payload.data;
        } else {
          state.list = action.payload;
        }
      })
      .addCase(searchInstructors.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.isSearching = false;
      })
     
      .addCase(toggleInstructorStatus.fulfilled, (state, action) => {
        const { instructorId, enabled, instructor: updatedInstructor } = action.payload;
        
       
        state.list = state.list.map(instructor =>
          instructor.id === instructorId
            ? { 
                ...instructor, 
                enabled: enabled,
                ...updatedInstructor
              }
            : instructor
        );
      });
  }
});

export const { clearError, resetSearch, loadMoreInstructors } = instructorsSlice.actions;
export default instructorsSlice.reducer;