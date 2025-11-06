import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/common/auth/LoginPage';
import SignUpPage from './pages/common/auth/SignUpPage';
import ForgotPasswordPage from './pages/common/auth/ForgotPasswordPage';
import CoursesPage from './pages/common/CoursesPage';
import CourseDetailsPage from './pages/instructor/CourseDetailsPage';
import CouponsPage from './pages/instructor/CouponsPage';
import ProfilePage from './pages/common/ProfilePage';
import PaymentsPage from './pages/common/PaymentsPage';
import HomePage from './pages/common/HomePage';
import VerifyEmailPage  from './pages/common/auth/VerifyEmailPage';
import UploadCvPage from './pages/instructor/UploadCvPage';
import AuthWrapper from './components/AuthWrapper';
import InstructorsPage from './pages/admin/InstructorsPage'
import WaitingVerificationPage from './pages/instructor/WaitingVerificationPage';
import CvReviewPage from './pages/admin/CvReviewPage';
import LessonReportsPage from './pages/admin/LessonReportsPage';
import NotFound from './pages/common/NotFound';
import StudentHomePage from './pages/student/StudentHomePage';
import StudentCoursesPage from './pages/student/CoursesPage';
import StudentProfilePage from './pages/student/ProfilePage';
import CourseViewPage from './pages/student/CourseViewPage';

function App() {
  return (
    // <AuthWrapper>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="upload-cv" element={<UploadCvPage />} />
        <Route path="waiting-verification" element={<WaitingVerificationPage />} />

        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="reports" element={<LessonReportsPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="cv-review" element={<CvReviewPage />} />
          <Route path="instructors" element={<InstructorsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/instructor" element={<DashboardLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="coupons" element={<CouponsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<StudentHomePage />} />
          <Route path="courses" element={<StudentCoursesPage />} />
          <Route path="profile" element={<StudentProfilePage />} />
        </Route>
        <Route path="" element={<DashboardLayout />}>
        <Route path="/instructor/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/student/course/:courseId" element={<CourseViewPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    ///* </AuthWrapper> */}

  );
}

export default App;