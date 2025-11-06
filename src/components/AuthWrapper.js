import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserData } from '../store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { token, user, isUserDataLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      // Fetch user data if token exists but user is not loaded
      if (token && !user) {
        try {
          await dispatch(fetchUserData()).unwrap();
        } catch (error) {
          // If token is invalid, redirect to login
          navigate('/', { replace: true });
        }
      }
      
      // Redirect unauthenticated users to login (except for public pages)
      const publicPaths = ['/', '/signup', '/forgot-password', '/verify-email'];
      if (!token && !publicPaths.includes(location.pathname)) {
        navigate('/', { replace: true });
        return;
      }
      
      // Role-based routing
      if (user && token) {
        const currentPath = location.pathname;
        const userRole = user.role;
        
        // Admin role restrictions
        if (currentPath.startsWith('/admin') && userRole !== 'admin') {
          if(userRole === 'instructor')
            navigate('/instructor', { replace: true });
          else if (userRole === 'student')
            navigate('/student', { replace: true });          
          return;
        }
        
        // Instructor role restrictions
        if (currentPath.startsWith('/instructor') && userRole !== 'instructor') {
          if(userRole === 'admin')
            navigate('/admin', { replace: true });
          else if (userRole === 'student')
            navigate('/student', { replace: true });
          return;
        }
        
        // Student role restrictions
        if (currentPath.startsWith('/student') && userRole !== 'student') {
          if(userRole === 'admin')
            navigate('/admin', { replace: true });
          else if (userRole === 'instructor')
            navigate('/instructor', { replace: true });
          return;
        }
        
        // Redirect instructors to verification if needed
        if (userRole === 'instructor' && !user.instructor?.verified && 
            !currentPath.includes('/upload-cv') && !currentPath.includes('/waiting-verification')) {
          navigate('/upload-cv', { replace: true });
          return;
        }
        
        // Redirect verified instructors away from verification pages
        if (userRole === 'instructor' && user.instructor?.verified && 
          (currentPath.includes('/upload-cv') || currentPath.includes('/waiting-verification'))) {
        navigate('/instructor', { replace: true });
        return;
      }
      
      // Redirect authenticated users from login/signup to their dashboard
      if (userRole && (currentPath === '/' || currentPath === '/signup')) {
        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (userRole === 'instructor') {
          navigate('/instructor', { replace: true });
        } else if (userRole === 'student') {
          navigate('/student', { replace: true });
        }
        return;
      }
      }
    };

    checkAuth();
  }, [token, user, dispatch, navigate, location.pathname]);

  // Show loading spinner while fetching user data
  if (token && !user && isUserDataLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return children;
};

export default AuthWrapper;