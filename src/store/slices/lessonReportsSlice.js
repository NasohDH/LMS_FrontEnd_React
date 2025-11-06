// src/store/slices/lessonReportsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const fetchLessonReports = createAsyncThunk(
  'lessonReports/fetchLessonReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/lesson-reports');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchVideoLink = createAsyncThunk(
  'lessonReports/fetchVideoLink',
  async (filename, { rejectWithValue }) => {
    try {
      const response = await api.get(`api/videos/${filename}/link`);
      return { filename, url: response.data.url };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markReportAsReviewed = createAsyncThunk(
  'lessonReports/markReportAsReviewed',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await api.get(`api/${reportId}/mark-as-reviewed`);
      return { reportId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const lessonReportsSlice = createSlice({
  name: 'lessonReports',
  initialState: {
    reports: [],
    videoLinks: {},
    loading: false,
    error: null,
    updating: false,
    videoLoading: {}
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearVideoLink: (state, action) => {
      const filename = action.payload;
      delete state.videoLinks[filename];
    }
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchLessonReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports;
      })
      .addCase(fetchLessonReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(fetchVideoLink.pending, (state, action) => {
        const filename = action.meta.arg;
        state.videoLoading[filename] = true;
      })
      .addCase(fetchVideoLink.fulfilled, (state, action) => {
        const { filename, url } = action.payload;
        state.videoLinks[filename] = url;
        state.videoLoading[filename] = false;
      })
      .addCase(fetchVideoLink.rejected, (state, action) => {
        const filename = action.meta.arg;
        state.videoLoading[filename] = false;
        state.error = action.payload;
      })
     
      .addCase(markReportAsReviewed.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(markReportAsReviewed.fulfilled, (state, action) => {
        state.updating = false;
       
        const reportIndex = state.reports.findIndex(report => report.id === action.payload.reportId);
        if (reportIndex !== -1) {
          state.reports[reportIndex].status = 'reviewed';
        }
      })
      .addCase(markReportAsReviewed.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearVideoLink } = lessonReportsSlice.actions;
export default lessonReportsSlice.reducer;