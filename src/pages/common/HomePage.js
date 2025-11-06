import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Grid, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Divider, CircularProgress
} from '@mui/material';
import { 
    MonetizationOn, People, School, Star, 
    ConfirmationNumber as ConfirmationNumberIcon, Person as PersonIcon,
    Description as DescriptionIcon, Report as ReportIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { fetchAdminDashboard, fetchInstructorDashboard } from '../../store/slices/homeSlice';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StatCard = ({ title, value, icon, color }) => (
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, height: '100%' }}>
        <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: (theme) => theme.palette[color]?.light || theme.palette.grey[100], display: 'inline-flex' }}>
            {React.cloneElement(icon, { sx: { color: `${color}.main` } })}
        </Box>
        <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);

const ActionCard = ({ title, description, icon, onClick }) => (
    <Paper 
        variant="outlined" onClick={onClick}
        sx={{
            p: 3, height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: (theme) => theme.shadows[4], borderColor: 'primary.main' }
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon}
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
            </Box>
        </Box>
    </Paper>
);

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { stats, chartData, topCourses, loading } = useSelector(state => state.home);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (isAdmin) {
            dispatch(fetchAdminDashboard());
        } else {
            dispatch(fetchInstructorDashboard());
        }
    }, [dispatch, isAdmin]);

   
    const INSTRUCTOR_ACTIONS = [
        { title: 'Manage Courses', description: 'Edit, add, or view your courses', icon: <School color="primary" sx={{ fontSize: 40 }}/>, path: '/instructor/courses' },
        { title: 'View Earnings', description: 'Track your revenue and payouts', icon: <MonetizationOn color="success" sx={{ fontSize: 40 }}/>, path: '/instructor/payments' },
        { title: 'Manage Coupons', description: 'Create & manage discount codes', icon: <ConfirmationNumberIcon color="warning" sx={{ fontSize: 40 }}/>, path: '/instructor/coupons' },
        { title: 'Edit Profile', description: 'Update your account details', icon: <PersonIcon color="info" sx={{ fontSize: 40 }}/>, path: '/instructor/profile' },
    ];

    const ADMIN_ACTIONS = [
        { title: 'Manage Courses', description: 'View and manage all courses', icon: <School color="primary" sx={{ fontSize: 40 }}/>, path: '/admin/courses' },
        { title: 'View Payments', description: 'Track your revenue and payouts', icon: <MonetizationOn color="success" sx={{ fontSize: 40 }}/>, path: '/admin/payments' },
        { title: 'CV Review', description: 'Review instructor CV submissions', icon: <DescriptionIcon color="warning" sx={{ fontSize: 40 }}/>, path: '/admin/cv-review' },
        { title: 'User Reports', description: 'View platform reports by the users', icon: <ReportIcon color="success" sx={{ fontSize: 40 }}/>, path: '/admin/reports' },
    ];

    const QUICK_ACTIONS = isAdmin ? ADMIN_ACTIONS : INSTRUCTOR_ACTIONS;

   
    const formatNumber = (num) => {
        if (typeof num !== 'number') return '0';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

   
    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box sx={{ p: 4 , display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            
            {/* --- QUICK ACTIONS SECTION --- */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Quick Actions</Typography>
                <Grid container spacing={2}>
                    {QUICK_ACTIONS.map(action => (
                        <Grid item xs={12} sm={6} md={3} key={action.title}>
                            <ActionCard {...action} onClick={() => navigate(action.path)} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            
            <Grid container spacing={4} sx={{display: 'flex', justifyContent: 'center'}}>
                <Grid item xs={12} width={isAdmin ? '82%' : '84%'}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center'}}>
                            {isAdmin ? 'Platform Statistics' : 'Key Statistics'}
                        </Typography>
                        <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Grid item xs={12} sm={6} lg={12} width='19%'>
                                <StatCard  title="Total Revenue" value={`$${formatNumber(stats.totalRevenue)}`} icon={<MonetizationOn />} color="success" />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={12} width='19%'>
                                <StatCard title="Total Students" value={formatNumber(stats.totalStudents)} icon={<People />} color="info" />
                            </Grid>
                            <Grid item xs={12} sm={6} lg={12} width='19%'>
                                <StatCard title="Total Courses" value={formatNumber(stats.totalCourses)} icon={<School />} color="warning" />
                            </Grid>
                            {isAdmin ? (
                                <Grid item xs={12} sm={6} lg={12} width='19%'>
                                    <StatCard title="Total Instructors" value={formatNumber(stats.totalInstructors)} icon={<PersonIcon />} color="primary" />
                                </Grid>
                            ) : (
                                <>
                                    <Grid item xs={12} sm={6} lg={12} width='19%'>
                                        <StatCard title="Your Rating" value={stats.yourRating || 0} icon={<Star />} color="error" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} lg={12} width='19%'>
                                        <StatCard title="Courses Rating" value={stats.coursesRating || 0} icon={<Star />} color="primary" />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} width={'82%'}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, justifyContent: 'space-between'}}>
                        {/* Sales Chart */}
                        <Paper variant="outlined" sx={{ p: 3, height: 'auto', width: '60%'}}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                {isAdmin ? 'Platform Revenue' : 'Sales Overview'}
                            </Typography>
                            <Box sx={{ height: 350, position: 'relative' }}>
                                <Line 
                                options={{ 
                                    responsive: true, 
                                    maintainAspectRatio: false, 
                                    plugins: { 
                                    legend: { display: false },
                                    tooltip: {
                                        callbacks: {
                                        label: function(context) {
                                            return `$${context.raw.toFixed(2)}`;
                                        }}}
                                    },
                                    scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: Math.max(...chartData.datasets[0].data),
                                    }
                                    }
                                }} 
                                data={chartData} 
                                />
                            </Box>
                        </Paper>
                        
                        <Paper variant="outlined" sx={{ p: 3, height: 'auto', width: '60%'}}>
                            <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }} >
                                {isAdmin ? 'Top Performing Courses' : 'Your Top Courses'}
                            </Typography>
                            <Divider />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Course</TableCell>
                                            {isAdmin && <TableCell>Instructor</TableCell>}
                                            <TableCell align="right">Revenue</TableCell>
                                            {!isAdmin && <TableCell align="right">Rating</TableCell>}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topCourses.length > 0 ? (
                                            topCourses.map((course, index) => (
                                                <TableRow hover key={index}>
                                                    <TableCell sx={{ fontWeight: 'medium' }}>{course.title}</TableCell>
                                                    {isAdmin && <TableCell>{course.instructor || 'N/A'}</TableCell>}
                                                    <TableCell align="right">${formatNumber(course.revenue)}</TableCell>
                                                    {!isAdmin && (
                                                        <TableCell align="right">
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                                                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                                                                {course.rating || 0}
                                                            </Box>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={isAdmin ? 3 : 4} align="center">
                                                    No courses data available
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>                        
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HomePage;