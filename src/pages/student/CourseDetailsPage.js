import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, Grid, Box, Typography, Card, CardContent, CardMedia, 
  Button, Rating, Avatar, Stack, IconButton, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import { 
  PlayArrow, VolumeUp, Settings, Fullscreen, ThumbUp, 
  Share, ListAlt, Book, AccessTime, FavoriteBorder, Visibility, Create, ArrowBack
} from '@mui/icons-material';
import CourseContent from '../../components/student/CourseContent';

// Review component
const Review = ({ imgSrc, name, text }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
    <Avatar src={imgSrc} />
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {text}
      </Typography>
      <Rating name="review-rating" value={5} readOnly size="small" />
    </Box>
  </Box>
);

const reviewsData = [
  { 
    imgSrc: "https://i.imgur.com/I7y4Mno.png", 
    name: "Leonardo Da Vinci", 
    text: "Loved the course. I've learned some very subtle techniques, especially on leaves." 
  },
  { 
    imgSrc: "https://i.imgur.com/Z319x4M.png", 
    name: "Titania S", 
    text: "I loved the course, it had been a long time since I had experimented with watercolors and now I will do it more often thanks to Kitani Studio." 
  },
  { 
    imgSrc: "https://i.imgur.com/5Dk2d0G.png", 
    name: "Zhirkov", 
    text: "Yes. I just emphasize that the use of Photoshop, for non-users, becomes difficult to follow. What requires a course to master it. Safe and very didactic teacher." 
  }
];

const StudentCourseDetailsPage = () => {
  const { courseId } = useParams();
  // For demonstration, we'll use a state to toggle between enrolled and not enrolled
  const [isEnrolled, setIsEnrolled] = useState(false);
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
    <Container maxWidth="xl" sx={{ mt: 4 }}>
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

      <Grid container spacing={4}>
        {/* Left Column - Video Player and Course Info */}
        <Grid item xs={12} md={8}>
          {/* Video Player - Full Width */}
          <Card sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 4 }}>
            <CardMedia
              component="img"
              image="https://i.imgur.com/uD4J1rW.png"
              alt="Vue JS Course"
              sx={{ width: '100%', height: 'auto' }}
            />
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 2, 
              color: 'white', 
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' 
            }}>
              <Box sx={{ 
                width: '100%', 
                height: '4px', 
                bgcolor: 'rgba(255,255,255,0.3)', 
                borderRadius: 2, 
                mb: 1 
              }}>
                <Box sx={{ 
                  width: '20%', 
                  height: '100%', 
                  bgcolor: 'white', 
                  borderRadius: 2 
                }}></Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PlayArrow />
                  <VolumeUp />
                  <Typography variant="caption">12:00 / 59:00</Typography>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Settings />
                  <Fullscreen />
                </Stack>
              </Box>
            </Box>
          </Card>

          {/* Course Title */}
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            VUE JS SCRATCH COURSE
          </Typography>

          {/* Meta Info */}
          <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar src="https://i.imgur.com/pB9nU4j.png" />
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Kitani Studio</Typography>
                <Typography variant="body2" color="text.secondary">Design Studio</Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Rating name="read-only" value={4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">4.8 (2.3k)</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
              <ThumbUp fontSize="small" /> <Typography variant="body2">2.3k</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
              <Visibility fontSize="small" /> <Typography variant="body2">15.2k views</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
              <Share fontSize="small" /> <Typography variant="body2">1.4k</Typography>
            </Stack>
          </Stack>

          {/* About Course */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>About Course</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. 
              Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. 
              The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. 
              On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries.
            </Typography>
          </Box>

          {/* Reviews */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Reviews</Typography>
              <Button 
                variant="outlined" 
                startIcon={<Create />}
                onClick={handleOpenReviewDialog}
                size="small"
              >
                Rate & Review
              </Button>
            </Stack>
            {reviewsData.map((review, index) => (
              <Review key={index} {...review} />
            ))}
          </Box>
        </Grid>

        {/* Right Column - Conditional content */}
        <Grid item xs={12} md={4}>
          {/* Price Card - Only show if not enrolled */}
          {!isEnrolled ? (
            <Card variant="outlined" sx={{ borderRadius: 2, position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>US$22.40</Typography>
                  <Typography sx={{ textDecoration: 'line-through' }} color="text.secondary">$30.13</Typography>
                  <Box sx={{ 
                    bgcolor: '#e5d9ff', 
                    color: '#8c52ff', 
                    p: '4px 8px', 
                    borderRadius: 1, 
                    fontWeight: 'bold' 
                  }}>
                    20% OFF
                  </Box>
                </Stack>
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  sx={{ 
                    mb: 1, 
                    py: 1.5, 
                    textTransform: 'none', 
                    fontSize: '1rem', 
                    bgcolor: '#20c997', 
                    '&:hover': { bgcolor: '#1ba980' } 
                  }}
                >
                  Buy
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  size="large" 
                  sx={{ 
                    py: 1.5, 
                    textTransform: 'none', 
                    fontSize: '1rem' 
                  }} 
                  startIcon={<FavoriteBorder />}
                  onClick={handleWishlist}
                >
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
                
                <Stack spacing={2} sx={{ 
                  mt: 3, 
                  pt: 2, 
                  borderTop: '1px solid #e0e0e0' 
                }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} color="text.secondary">
                    <ListAlt />
                    <Typography>22 Sections</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1.5} color="text.secondary">
                    <Book />
                    <Typography>152 Lectures</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1.5} color="text.secondary">
                    <AccessTime />
                    <Typography>21h 33m total length</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1.5} color="text.secondary">
                    <Visibility />
                    <Typography>15.2k views</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            // Course Content - Show when enrolled (instead of progress card)
            <CourseContent isEnrolled={true} />
          )}
          
          {/* Webinar Ad - Only show if not enrolled */}
          {!isEnrolled && (
            <Box sx={{ 
              mt: 3, 
              borderRadius: 2, 
              overflow: 'hidden' 
            }}>
              <img 
                src="https://i.imgur.com/R38g5g5.png" 
                alt="Webinar Ad" 
                style={{ width: '100%', display: 'block' }} 
              />
            </Box>
          )}
        </Grid>
      </Grid>

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
    </Container>
  );
};

export default StudentCourseDetailsPage;