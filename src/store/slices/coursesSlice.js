// src/store/slices/coursesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({ page = 1 } = {}, { getState }) => {
    const { user } = getState().auth;
    let url = `/api/courses?page=${page}`;
    if (user?.role === 'instructor') {
      url += `&instructor=${user.instructor.full_name}`;
    }
  
    const response = await api.get(url);
    return response.data;
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      console.log('Original courseData:', courseData);
      console.log('Image file:', courseData.image);
      console.log('Image file type:', courseData.image?.constructor?.name);
      
      Object.keys(courseData).forEach(key => {
        const value = courseData[key];
        
        if (key === 'category_ids') {
          value.forEach(id => formData.append('category_ids[]', id));
        } else if (key === 'image' && (value instanceof File || value instanceof Blob)) {
          formData.append('image', value); // Make sure this is the correct field name
        } else {
          formData.append(key, value);
        }
      });
      
      // Debug: Check what's in FormData
      for (let [key, val] of formData.entries()) {
        console.log('FormData:', key, val);
      }
      
      const response = await api.post('/api/courses', courseData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ courseId, formData }) => {

    const response = await api.post(`/api/courses/${courseId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }  
);

// export const deleteCourse = createAsyncThunk(
//   'courses/deleteCourse',
//   async (courseId) => {
//     await api.delete(`/api/courses/${courseId}`);
//     return courseId;
//   }
// );

export const disableCourse = createAsyncThunk(
  'courses/disableCourse',
  async (courseId) => {
    const response = await api.post(`/api/courses/${courseId}/disable`);
    return response.data;
  }
);

export const enableCourse = createAsyncThunk(
  'courses/enableCourse',
  async (courseId) => {
    const response = await api.post(`/api/courses/${courseId}/enable`);
    return response.data;
  }
);

export const searchCourses = createAsyncThunk(
  'courses/searchCourses',
  async (searchKey, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/search?key=${searchKey}&type=courses`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchAutocompleteSuggestions = createAsyncThunk(
  'courses/fetchAutocompleteSuggestions',
  async (searchKey) => {
    const response = await api.get(`/api/autocomplete?key=${searchKey}`);
    return response.data.courses || [];
  }
);

// Slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    items: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchQuery: '',
    autocompleteSuggestions: [],
    autocompleteLoading: false,
    updateLoading: false,
    updateError: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearAutocompleteSuggestions: (state) => {
      state.autocompleteSuggestions = [];
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
     
      .addCase(createCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload.course);
      })
     
      builder
     
      .addCase(updateCourse.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updateLoading = false;
       
        const updatedCourse = action.payload.course;
        const index = state.items.findIndex(course => course.id === updatedCourse.id);
        if (index !== -1) {
          state.items[index] = updatedCourse;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      
     
     
     
     
     
      .addCase(disableCourse.fulfilled, (state, action) => {
        const index = state.items.findIndex(course => course.id === action.payload.course.id);
        if (index !== -1) {
          state.items[index].enabled = action.payload.course.enabled;
        }
      })
      .addCase(enableCourse.fulfilled, (state, action) => {
        const index = state.items.findIndex(course => course.id === action.payload.course.id);
        if (index !== -1) {
          state.items[index].enabled = action.payload.course.enabled;
        }
      })
     
     
      .addCase(fetchAutocompleteSuggestions.pending, (state) => {
        state.autocompleteLoading = true;
      })
      .addCase(fetchAutocompleteSuggestions.fulfilled, (state, action) => {
        state.autocompleteLoading = false;
        state.autocompleteSuggestions = action.payload;
      })
      .addCase(fetchAutocompleteSuggestions.rejected, (state) => {
        state.autocompleteLoading = false;
      });
      builder
      .addCase(searchCourses.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchCourses.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.courses;
      })
      .addCase(searchCourses.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchResults = [];
      });
  }
});

export const { clearSearchResults, clearAutocompleteSuggestions, setSearchQuery, clearUpdateError } = coursesSlice.actions;
export default coursesSlice.reducer;