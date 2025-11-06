import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Rating,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import { FavoriteBorder, School, Book, Schedule, Visibility, Create, ArrowBack } from '@mui/icons-material';
import CourseContent from '../../components/student/CourseContent';

const reviews = [
  {
    name: 'Leonardo Da Vinci',
    avatar: 'L',
    review: "Loved the course. I've learned some very subtle tecniques, expecially on leaves.",
  },
  {
    name: 'Titania S',
    avatar: 'T',
    review: 'I loved the course, it had been a long time since I had experimented with watercolors and now I will do it more often thanks to Kitani Studio',
  },
  {
    name: 'Zhirkov',
    avatar: 'Z',
    review: 'Yes. I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. What requires a course to master it. Safe and very didactic teacher.',
  },
    {
    name: 'Miphoska',
    avatar: 'M',
    review: "I haven't finished the course yet, as I would like to have some feedback from the teacher, about the comments I shared on the forum 3 months ago, and I still haven't had any answer. I think the course is well structured, however the explanations and videos are very quick for beginners. However, it is good to go practicing.",
  },
];

const CourseViewPage = () => {
  // For demonstration, we'll use a state to toggle between enrolled and not enrolled
  const [isEnrolled, setIsEnrolled] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setReviewText('');
    setReviewRating(0);
  };

  const handleSubmitReview = () => {
    // Implement review submission logic here
    console.log("Review submitted:", { rating: reviewRating, text: reviewText });
    handleCloseReviewDialog();
  };

  return (
    <Box>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ mb: 4, borderRadius: 0 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Course Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, backgroundColor: '#f8f9fa', display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Main content area (left side) */}
        <Box sx={{ flex: '0 0 66%', maxWidth: '66%', pr: { xs: 0, md: 3 }, width: '100%' }}>
          {/* Video Player */}
          <Box sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: 'black',
            marginBottom: 2,
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <img src="https://i.imgur.com/Am54h62.png" alt="course video" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            VUE JS SCRATCH COURSE
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'teal', mr: 1 }}>KS</Avatar>
              <Typography variant="subtitle1">
                Kitani Studio
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>
                <Visibility sx={{ fontSize: '1rem', mr: 0.5 }} />
                <Typography variant="body2">15.2k views</Typography>
              </Box>
            </Box>
            <Button 
              variant="outlined" 
              startIcon={<Create />}
              onClick={handleOpenReviewDialog}
              size="small"
            >
              Rate & Review
            </Button>
          </Box>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
            About Course
          </Typography>
          <Typography variant="body1" paragraph>
            Vue (pronounced /vju:/, like view) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries.
          </Typography>

          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
            Review
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating name="half-rating-read" defaultValue={4.5} precision={0.5} readOnly />
            <Typography sx={{ ml: 1 }}>2.3k ratings</Typography>
            <Button 
              variant="outlined" 
              startIcon={<Create />}
              onClick={handleOpenReviewDialog}
              size="small"
              sx={{ ml: 2 }}
            >
              Rate & Review
            </Button>
          </Box>
          {reviews.map((review, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 3, alignItems: 'flex-start' }}>
              <Avatar sx={{ mt: 0.5, mr: 2 }}>{review.avatar}</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{review.name}</Typography>
                <Typography variant="body2" color="text.secondary">{review.review}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right side - Conditional content */}
        <Box sx={{ 
          flex: '0 0 33%', 
          maxWidth: '33%',
          position: { xs: 'static', md: 'sticky' },
          alignSelf: 'flex-start',
          top: '20px',
          height: 'fit-content',
          mt: { xs: 4, md: 0 },
          width: '100%'
        }}>
          {/* Price card - Only show if not enrolled */}
          {!isEnrolled ? (
            <Card sx={{ borderRadius: '8px' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                  <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>
                    US$22.40
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ ml: 1, textDecoration: 'line-through' }}>
                    $30.13
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Button size="small" sx={{ backgroundColor: '#d1c4e9', color: '#4527a0', fontWeight: 'bold' }}>20% OFF</Button>
                </Box>
                <Button variant="contained" fullWidth sx={{ mb: 2, py: 1.5, backgroundColor: '#26a69a', '&:hover': { backgroundColor: '#00796b' } }}>
                  Buy
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<FavoriteBorder />} 
                  sx={{ py: 1.5 }}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <School />
                    </ListItemIcon>
                    <ListItemText primary="22 Section" />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <Book />
                    </ListItemIcon>
                    <ListItemText primary="152 Lectures" />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <Schedule />
                    </ListItemIcon>
                    <ListItemText primary="21h 33m total lenghts" />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <Visibility />
                    </ListItemIcon>
                    <ListItemText primary="15.2k views" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ) : (
            // Course Content - Show when enrolled (instead of progress card)
            <CourseContent isEnrolled={true} />
          )}
        </Box>
      </Box>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Rate & Review</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Rating
              name="review-rating"
              value={reviewRating}
              onChange={(event, newValue) => setReviewRating(newValue)}
              size="large"
            />
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseViewPage;