import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AppBar, Tabs, Tab, Box, Typography, Toolbar, 
  Avatar, IconButton, Menu, MenuItem,
} from '@mui/material';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Home as HomeIcon,
    School as SchoolIcon,
    ConfirmationNumber as ConfirmationNumberIcon,
    Person as PersonIcon,
    MonetizationOn as MonetizationOnIcon,
    People as PeopleIcon,
    TaskAlt as TaskAltIcon,
    Report as ReportIcon,
    Logout as LogoutIcon,
    AccountCircle as AccountCircleIcon,
    LibraryBooks as LibraryBooksIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const SERVER_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const INSTRUCTOR_TABS = [
  { label: 'Home', icon: <HomeIcon />, path: '/instructor' },
  { label: 'My Courses', icon: <SchoolIcon />, path: '/instructor/courses' },
  { label: 'Coupons', icon: <ConfirmationNumberIcon />, path: '/instructor/coupons' },
  { label: 'Earnings', icon: <MonetizationOnIcon />, path: '/instructor/payments' },
  { label: 'Profile', icon: <PersonIcon />, path: '/instructor/profile' },
];

const ADMIN_TABS = [
  { label: 'Home', icon: <HomeIcon />, path: '/admin' },
  { label: 'All Courses', icon: <SchoolIcon />, path: '/admin/courses' },
  { label: 'Instructors', icon: <PeopleIcon />, path: '/admin/instructors' },
  { label: 'CV Review', icon: <TaskAltIcon />, path: '/admin/cv-review' },
  { label: 'Reports', icon: <ReportIcon />, path: '/admin/reports' },
  { label: 'Payments', icon: <MonetizationOnIcon />, path: '/admin/payments' },
  { label: 'Profile', icon: <PersonIcon />, path: '/admin/profile' },
];

const STUDENT_TABS = [
  { label: 'Home', icon: <HomeIcon />, path: '/student' },
  { label: 'My Courses', icon: <LibraryBooksIcon />, path: '/student/courses' },
  { label: 'Profile', icon: <PersonIcon />, path: '/student/profile' },
];

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;
  const dispatch = useDispatch();

  const [value, setValue] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const TABS_CONFIG = useMemo(() => {
    if (role === 'admin') return ADMIN_TABS;
    if (role === 'student') return STUDENT_TABS;
    return INSTRUCTOR_TABS;
  }, [role]);

  useEffect(() => {
    const currentPath = location.pathname;
   
    let matchingTab = TABS_CONFIG
      .slice()
      .sort((a, b) => b.path.length - a.path.length)
      .find(tab => currentPath.match(tab.path));
    if (matchingTab) {
      const tabIndex = TABS_CONFIG.findIndex(tab => tab.path === matchingTab.path);
      setValue(tabIndex);
    } else {
      setValue(false);
    }
  }, [location.pathname, TABS_CONFIG]);

  const handleChange = (event, newValue) => {
    navigate(TABS_CONFIG[newValue].path);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  const handleProfile = () => {
    if (role === 'admin') {
      navigate('/admin/profile');
    } else if (role === 'student') {
      navigate('/student/profile');
    } else {
      navigate('/instructor/profile');
    }
    handleMenuClose();
  };

  const avatarUrl = user?.avatar ? `${SERVER_BASE_URL}/${user.avatar.replace(/^\/+/, '')}` : '';
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="static"
        sx={{ 
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
          backgroundColor: 'white',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to={role === 'admin' ? '/admin' : role === 'student' ? '/student' : '/instructor'}
            sx={{ 
              flexGrow: 1, 
              color: 'primary.main', 
              fontWeight: 'bold', 
              textDecoration: 'none', 
              '&:hover': { opacity: 0.9 } 
            }}
          >
            {role === 'admin' ? 'Admin Dashboard' : role === 'student' ? 'Student Dashboard' : 'Instructor Dashboard'}
          </Typography>

          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
          >
            {TABS_CONFIG.map((tab) => (
                <Tab
                    key={tab.path}
                    label={tab.label}
                    icon={tab.icon}
                    iconPosition="start"
                   
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: '8px',
                        mx: 0.3,
                        opacity: 0.7,
                        transition: 'all 0.3s',
                        my: 0.2,
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(38, 186, 154, 0.15)',
                            color: 'primary.main',
                            opacity: 1,
                            boxShadow: '0px 2px 100px rgba(38, 186, 154, 0.05)',
                            borderRadius: '20px'
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            borderRadius: '20px'
                        }
                    }}
                />
            ))}
          </Tabs>

          {/* User Avatar and Menu */}
          <Box sx={{ ml: 2 }}>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ 
                p: 0,
                '&:hover': {
                  opacity: 0.8
                }
              }}
            >
              {avatarUrl ? (
                <Avatar 
                  src={avatarUrl} 
                  alt={user?.name || 'User'} 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    bgcolor: 'primary.main',
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <AccountCircleIcon />
                </Avatar>
              )}
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                }
              }}
            >
              <MenuItem onClick={handleProfile}>
                <PersonIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <main>
        <Outlet />
      </main>
    </Box>
  );
}