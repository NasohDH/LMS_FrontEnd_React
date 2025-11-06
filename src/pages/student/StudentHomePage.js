import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Typography, Paper, Grid, Divider, CircularProgress, Chip, Button
} from '@mui/material';
import { 
    School, Star, TrendingUp, Person, PlayCircle
} from '@mui/icons-material';
import CourseCard from '../../components/common/CourseCard';
import EnrolledCourseCard from '../../components/student/EnrolledCourseCard';
import { fetchStudentDashboard } from '../../store/slices/homeSlice';

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

const SectionHeader = ({ title, actionText, onAction }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        {onAction && (
            <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                onClick={onAction}
            >
                {actionText}
            </Typography>
        )}
    </Box>
);

const InstructorCard = ({ instructor }) => (
    <Paper variant="outlined" sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box 
                sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: '50%', 
                    backgroundColor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main'
                }}
            >
                <Person sx={{ fontSize: 32 }} />
            </Box>
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {instructor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {instructor.specialty}
                </Typography>
            </Box>
        </Box>
        <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="body2">
                    {instructor.rating} ({instructor.students.toLocaleString()} students)
                </Typography>
            </Box>
            <Chip 
                label={`${instructor.courses} courses`} 
                size="small" 
                variant="outlined" 
            />
        </Box>
    </Paper>
);

const StudentHomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { stats, enrolledCourses, loading } = useSelector(state => state.home);

    // Mock data for student home page sections
    // In a real implementation, this would come from API calls
    const mostViewedCourses = [
        {
            id: 1,
            title: "Complete Web Development Bootcamp",
            description: "Learn HTML, CSS, JavaScript, React, Node.js and more!",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 99.99,
            discount: 20,
            level: "Beginner",
            views: 1250,
            sales: 89,
            rating: 4.8,
            categories: [{ name: "Web Development" }],
            instructor: { full_name: "Alex Johnson" },
            created_at: "2023-01-15",
            enabled: true
        },
        {
            id: 2,
            title: "Advanced React and Redux",
            description: "Master React, Redux, and modern JavaScript with advanced patterns.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 79.99,
            discount: 0,
            level: "Advanced",
            views: 980,
            sales: 65,
            rating: 4.7,
            categories: [{ name: "React" }, { name: "JavaScript" }],
            instructor: { full_name: "Sarah Williams" },
            created_at: "2023-03-22",
            enabled: true
        },
        {
            id: 3,
            title: "UI/UX Design Masterclass",
            description: "Complete guide to user interface and user experience design.",
            image: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 89.99,
            discount: 10,
            level: "Beginner",
            views: 1100,
            sales: 95,
            rating: 4.9,
            categories: [{ name: "Design" }, { name: "UI/UX" }],
            instructor: { full_name: "Emma Rodriguez" },
            created_at: "2023-04-05",
            enabled: true
        },
        {
            id: 4,
            title: "Data Science with Python",
            description: "Learn data analysis, visualization, and machine learning with Python.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 129.99,
            discount: 15,
            level: "Intermediate",
            views: 750,
            sales: 120,
            rating: 4.8,
            categories: [{ name: "Data Science" }, { name: "Python" }],
            instructor: { full_name: "Michael Chen" },
            created_at: "2023-02-10",
            enabled: true
        }
    ];

    const topRatedCourses = [
        {
            id: 5,
            title: "Machine Learning A-Z",
            description: "Learn to create Machine Learning Algorithms in Python and R from two experts.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 149.99,
            discount: 25,
            level: "Intermediate",
            views: 2100,
            sales: 320,
            rating: 4.9,
            categories: [{ name: "Machine Learning" }, { name: "Python" }, { name: "R" }],
            instructor: { full_name: "Dr. Robert Smith" },
            created_at: "2023-01-20",
            enabled: true
        },
        {
            id: 6,
            title: "AWS Cloud Practitioner",
            description: "Master Amazon Web Services with hands-on labs and real-world examples.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 99.99,
            discount: 0,
            level: "Beginner",
            views: 1850,
            sales: 275,
            rating: 4.8,
            categories: [{ name: "Cloud Computing" }, { name: "AWS" }],
            instructor: { full_name: "Michael Chen" },
            created_at: "2023-03-15",
            enabled: true
        },
        {
            id: 7,
            title: "Mobile App Development with Flutter",
            description: "Build cross-platform mobile apps with Flutter and Dart.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 109.99,
            discount: 25,
            level: "Intermediate",
            views: 1650,
            sales: 178,
            rating: 4.7,
            categories: [{ name: "Mobile Development" }, { name: "Flutter" }],
            instructor: { full_name: "James Wilson" },
            created_at: "2023-05-12",
            enabled: true
        },
        {
            id: 8,
            title: "Cybersecurity Fundamentals",
            description: "Learn the fundamentals of cybersecurity and protect your digital assets.",
            image: "https://images.unsplash.com/photo-1563017840-9da95b44699b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 79.99,
            discount: 15,
            level: "Beginner",
            views: 1420,
            sales: 195,
            rating: 4.8,
            categories: [{ name: "Cybersecurity" }],
            instructor: { full_name: "Sarah Williams" },
            created_at: "2023-06-18",
            enabled: true
        }
    ];

    const popularInstructors = [
        {
            id: 1,
            name: "Alex Johnson",
            specialty: "Web Development",
            rating: 4.9,
            students: 12500,
            courses: 12
        },
        {
            id: 2,
            name: "Sarah Williams",
            specialty: "Data Science",
            rating: 4.8,
            students: 9800,
            courses: 8
        },
        {
            id: 3,
            name: "Michael Chen",
            specialty: "Cloud Computing",
            rating: 4.9,
            students: 15200,
            courses: 15
        },
        {
            id: 4,
            name: "Emma Rodriguez",
            specialty: "UI/UX Design",
            rating: 4.7,
            students: 8700,
            courses: 6
        }
    ];

    const pickedForYou = [
        {
            id: 9,
            title: "Blockchain and Cryptocurrency",
            description: "Understand blockchain technology and cryptocurrency fundamentals.",
            image: "https://images.unsplash.com/photo-1620336655052-b57986f5a26a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 129.99,
            discount: 30,
            level: "Intermediate",
            views: 950,
            sales: 142,
            rating: 4.6,
            categories: [{ name: "Blockchain" }, { name: "Cryptocurrency" }],
            instructor: { full_name: "David Brown" },
            created_at: "2023-07-22",
            enabled: true
        },
        {
            id: 10,
            title: "Digital Marketing Masterclass",
            description: "Learn SEO, social media marketing, and content strategy.",
            image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 89.99,
            discount: 20,
            level: "Beginner",
            views: 1250,
            sales: 210,
            rating: 4.7,
            categories: [{ name: "Marketing" }, { name: "SEO" }],
            instructor: { full_name: "Lisa Anderson" },
            created_at: "2023-08-05",
            enabled: true
        },
        {
            id: 11,
            title: "Game Development with Unity",
            description: "Create 2D and 3D games using Unity game engine.",
            image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 139.99,
            discount: 0,
            level: "Intermediate",
            views: 870,
            sales: 95,
            rating: 4.5,
            categories: [{ name: "Game Development" }, { name: "Unity" }],
            instructor: { full_name: "Mark Thompson" },
            created_at: "2023-09-12",
            enabled: true
        },
        {
            id: 12,
            title: "Photography Fundamentals",
            description: "Master photography techniques with hands-on projects.",
            image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            price: 69.99,
            discount: 10,
            level: "Beginner",
            views: 1520,
            sales: 275,
            rating: 4.8,
            categories: [{ name: "Photography" }],
            instructor: { full_name: "Jennifer Parker" },
            created_at: "2023-10-01",
            enabled: true
        }
    ];

    const formatNumber = (num) => {
        if (typeof num !== 'number') return '0';
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    const handleViewAllCourses = () => {
        navigate('/student/courses');
    };

    const handleViewAllInstructors = () => {
        // Navigate to instructors page when implemented
    };

    const w = (courseId) => {
        navigate(`/student/course/${courseId}`);
    };

    const handleEnrolledCourseClick = (courseId) => {
        navigate(`/student/course/${courseId}`);
    };

    useEffect(() => {
        if (user?.role === 'student') {
            dispatch(fetchStudentDashboard());
        }
    }, [dispatch, user]);

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Welcome back, {user?.first_name || 'Student'}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Continue your learning journey with our curated courses
                </Typography>
            </Box>

            {/* Continue Learning - Updated Section */}
            {enrolledCourses && enrolledCourses.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <SectionHeader 
                        title="Continue Learning" 
                        actionText="View All" 
                        onAction={handleViewAllCourses} 
                    />
                    <Grid container spacing={2}>
                        {enrolledCourses.slice(0, 2).map(course => (
                            <Grid item xs={12} sm={6} md={6} key={course.id}>
                                <EnrolledCourseCard 
                                    course={course} 
                                    onClick={handleEnrolledCourseClick}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Most Viewed Courses */}
            <Box sx={{ mb: 4 }}>
                <SectionHeader 
                    title="Most Viewed Courses" 
                    actionText="View All" 
                    onAction={handleViewAllCourses} 
                />
                <Grid container spacing={3}>
                    {mostViewedCourses.slice(0, 4).map(course => (
                        <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                            <CourseCard 
                                course={course} 
                                isAdmin={false}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Top Rated Courses */}
            <Box sx={{ mb: 4 }}>
                <SectionHeader 
                    title="Top Rated Courses" 
                    actionText="View All" 
                    onAction={handleViewAllCourses} 
                />
                <Grid container spacing={3}>
                    {topRatedCourses.slice(0, 4).map(course => (
                        <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                            <CourseCard 
                                course={course} 
                                isAdmin={false}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Popular Instructors */}
            <Box sx={{ mb: 4 }}>
                <SectionHeader 
                    title="Popular Instructors" 
                    actionText="View All" 
                    onAction={handleViewAllInstructors} 
                />
                <Grid container spacing={3}>
                    {popularInstructors.slice(0, 4).map(instructor => (
                        <Grid item key={instructor.id} xs={12} sm={6} md={4} lg={3}>
                            <InstructorCard instructor={instructor} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Picked For You */}
            <Box sx={{ mb: 4 }}>
                <SectionHeader 
                    title="Picked For You" 
                    actionText="View All" 
                    onAction={handleViewAllCourses} 
                />
                <Grid container spacing={3}>
                    {pickedForYou.slice(0, 4).map(course => (
                        <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                            <CourseCard 
                                course={course} 
                                isAdmin={false}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default StudentHomePage;