// src/store/slices/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks for fetching dashboard data
export const fetchAdminDashboard = createAsyncThunk(
  'dashboard/fetchAdminDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/dashboard/admin');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch admin dashboard');
    }
  }
);

export const fetchInstructorDashboard = createAsyncThunk(
  'dashboard/fetchInstructorDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/dashboard/instructor');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch instructor dashboard');
    }
  }
);

export const fetchStudentDashboard = createAsyncThunk(
  'dashboard/fetchStudentDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('api/student/courses?status=enrolled');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch student dashboard');
    }
  }
);

const initialState = {
  stats: {
    totalRevenue: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    yourRating: 0,
    coursesRating: 0,
  },
  chartData: {
    labels: [],
    datasets: [{
      label: 'Monthly Revenue',
      data: [],
      fill: true,
      backgroundColor: 'rgba(38, 186, 154, 0.2)',
      borderColor: '#26BA9A',
      tension: 0.4,
      pointBackgroundColor: '#26BA9A',
    }]
  },
  topCourses: [],
  enrolledCourses: [],
  loading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const { totalRevenue, totalStudents, totalCourses, totalInstructors, topCourses, data } = action.payload;
        
        state.stats = {
          totalRevenue,
          totalStudents,
          totalCourses,
          totalInstructors,
          yourRating: 0,
          coursesRating: 0,
        };
        
        // Generate labels for the last 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const labels = [];
        
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          labels.push(months[monthIndex]);
        }
        
        state.chartData = {
          ...state.chartData,
          labels,
          datasets: [{
            ...state.chartData.datasets[0],
            data,
          }]
        };
        
        // Map top courses data
        state.topCourses = topCourses.map(course => ({
          id: Math.random(),
          title: course.name,
          revenue: course.revenue,
          instructor: course.instructor,
        }));
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(fetchInstructorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const { totalRevenue, totalStudents, totalCourses, yourRating, coursesRating, topCourses, data } = action.payload;
        
        state.stats = {
          totalRevenue,
          totalStudents,
          totalCourses,
          totalInstructors: 0,
          yourRating,
          coursesRating,
        };
        
        // Generate labels for the last 6 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const labels = [];
        
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12;
          labels.push(months[monthIndex]);
        }
        
        state.chartData = {
          ...state.chartData,
          labels,
          datasets: [{
            ...state.chartData.datasets[0],
            data,
          }]
        };
        
        // Map top courses data
        state.topCourses = topCourses.map(course => ({
          id: Math.random(),
          title: course.name,
          revenue: course.revenue,
          rating: course.avg_rating,
        }));
      })
      .addCase(fetchInstructorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const enrolledCourses = action.payload.courses;
        console.log(enrolledCourses);
        state.enrolledCourses = enrolledCourses || [];
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = homeSlice.actions;
export default homeSlice.reducer;