import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCourseDetails = createAsyncThunk(
  'course/fetchCourseDetails',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSection = createAsyncThunk(
  'course/addSection',
  async ({ courseId, title }, { rejectWithValue }) => {
    try {
      const response = await api.post('api/sections', { course_id: courseId, title });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSection = createAsyncThunk(
  'course/updateSection',
  async ({ sectionId, title }, { rejectWithValue }) => {
    try {
      const response = await api.put(`api/sections/${sectionId}`, { title });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSection = createAsyncThunk(
  'course/deleteSection',
  async (sectionId, { rejectWithValue }) => {
    try {
      await api.delete(`api/sections/${sectionId}`);
      return sectionId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// src/store/slices/courseSlice.js - Update the addLesson thunk
export const addLesson = createAsyncThunk(
  'course/addLesson',
  async ({ sectionId, title, video }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('section_id', sectionId);
      formData.append('video', video);
      
      const response = await api.post('api/lessons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateLesson = createAsyncThunk(
  'course/updateLesson',
  async ({ lessonId, title, video }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (video) {
        formData.append('video', video);
      }
      
      const response = await api.post(`api/lessons/${lessonId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'course/deleteLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      await api.delete(`api/lessons/${lessonId}`);
      return lessonId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addSubtitles = createAsyncThunk(
  'course/addSubtitles',
  async ({ lessonId, subtitles }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(subtitles).forEach(([lang, file]) => {
        formData.append(`subtitles[${lang}]`, file);
      });
      
      const response = await api.post(`api/videos/subtitles/${lessonId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { lessonId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSubtitle = createAsyncThunk(
  'course/deleteSubtitle',
  async ({ lessonId, lang }, { rejectWithValue }) => {
    try {
      await api.delete(`api/videos/subtitles/${lessonId}/${lang}`);
      return { lessonId, lang };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const fetchSubtitles = createAsyncThunk(
  'course/fetchSubtitles',
  async (fileName, { rejectWithValue }) => {
    try {
      const response = await api.get(`api/videos/subtitles/${fileName}/languages`);
      return { fileName, subtitles: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Slice
const courseSlice = createSlice({
  name: 'course',
  initialState: {
    course: null,
    loading: false,
    error: null,
    subtitles: {},
    subtitlesLoading: false,
    subtitlesError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.subtitlesError = null;
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload.data;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     
      .addCase(addSection.fulfilled, (state, action) => {
        state.course.sections.push(action.payload.section);
      })
     
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.course.sections.findIndex(
          (section) => section.id === action.payload.section.id
        );
        if (index !== -1) {
          state.course.sections[index] = action.payload.section;
        }
      })
     
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.course.sections = state.course.sections.filter(
          (section) => section.id !== action.payload
        );
      })
     
      .addCase(addLesson.fulfilled, (state, action) => {
        const sectionIndex = state.course.sections.findIndex(
          (section) => section.id === action.payload.section_id
        );
        if (sectionIndex !== -1) {
          if(!state.course.sections[sectionIndex].lessons)
            state.course.sections[sectionIndex].lessons=[];
          state.course.sections[sectionIndex].lessons.push(action.payload);
        }
      })
     
      .addCase(updateLesson.fulfilled, (state, action) => {
            const updatedLesson = action.payload;
            for (const section of state.course.sections) {
              const lessonIndex = section.lessons.findIndex(
                (lesson) => lesson.id === updatedLesson.id
              );
              if (lessonIndex !== -1) {
                section.lessons[lessonIndex] = updatedLesson;
                break;
              }
            }
          })
     
      .addCase(deleteLesson.fulfilled, (state, action) => {
        for (const section of state.course.sections) {
          section.lessons = section.lessons.filter(
            (lesson) => lesson.id !== action.payload
          );
        }
      })
      .addCase(fetchSubtitles.pending, (state) => {
        state.subtitlesLoading = true;
        state.subtitlesError = null;
      })
      .addCase(fetchSubtitles.fulfilled, (state, action) => {
        state.subtitlesLoading = false;
        const { fileName, subtitles } = action.payload;
        if(!subtitles.data){
        state.subtitles[fileName] = subtitles.map((lang, index) => ({
          id: index + 1,
          lang,
          label: lang.toUpperCase(),
          fileName: `${fileName}-${lang}.vtt`
        }));
      }
      })
      .addCase(fetchSubtitles.rejected, (state, action) => {
        state.subtitlesLoading = false;
        state.subtitlesError = action.payload;
      })
      ;
  },
});

export const { clearError } = courseSlice.actions;
export default courseSlice.reducer;