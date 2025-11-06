import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import cvReviewReducer from './slices/cvReviewSlice';
import lessonReportsReducer from './slices/lessonReportsSlice';
import instructorsReducer from './slices/instructorsSlice';
import couponReducer from './slices/couponSlice';
import paymentReducer from './slices/paymentSlice';
import coursesReducer from './slices/coursesSlice';
import categoriesReducer from './slices/categoriesSlice';
import courseReducer from './slices/courseSlice';
import homeReducer from './slices/homeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    courses: coursesReducer,
    categories: categoriesReducer,
    cvReview: cvReviewReducer,
    lessonReports: lessonReportsReducer,
    instructors: instructorsReducer,
    coupons: couponReducer,
    payment: paymentReducer,
    course: courseReducer,
    home: homeReducer,

  },
});

export default store; 