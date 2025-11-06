import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Checkbox,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  ExpandMore, 
  PlayCircleOutline, 
  PlayCircle, 
  Lock,
  CheckCircle
} from '@mui/icons-material';

const CourseContent = ({ isEnrolled }) => {
  const [expandedSections, setExpandedSections] = useState([0]);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Track currently playing lesson

  // Mock data for sections and lessons (only video lessons now)
  const sections = [
    {
      id: 1,
      title: "Introduction to Vue.js",
      duration: "1hr 20min",
      lessons: [
        { id: 1, title: "Course Introduction", duration: "05:30", type: "video", isPreview: true },
        { id: 2, title: "Setting up Development Environment", duration: "15:45", type: "video" },
        { id: 3, title: "Vue.js Basics", duration: "22:10", type: "video" },
        { id: 4, title: "Vue.js Directives", duration: "18:20", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Vue Components",
      duration: "2hr 15min",
      lessons: [
        { id: 6, title: "Component Basics", duration: "25:10", type: "video" },
        { id: 7, title: "Props and Events", duration: "30:15", type: "video" },
        { id: 8, title: "Component Communication", duration: "22:40", type: "video" },
        { id: 9, title: "Slots and Scoped Slots", duration: "28:30", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Vue Router",
      duration: "1hr 45min",
      lessons: [
        { id: 11, title: "Introduction to Vue Router", duration: "20:15", type: "video" },
        { id: 12, title: "Dynamic Routing", duration: "25:30", type: "video" },
        { id: 13, title: "Navigation Guards", duration: "22:45", type: "video" },
        { id: 15, title: "Vue Router - Summary", duration: "19:50", type: "video" }
      ]
    }
  ];

  const handleSectionToggle = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleLessonToggle = (lessonId) => {
    if (!isEnrolled) return;
    
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  // Function to set a lesson as currently playing
  const handlePlayLesson = (lessonId) => {
    setCurrentlyPlaying(lessonId);
  };

  const getLessonIcon = (type, lessonId) => {
    // If this lesson is currently playing, show the filled play icon
    if (lessonId === currentlyPlaying) {
      return <PlayCircle color="primary" />;
    }
    
    // Otherwise show the outlined play icon
    return <PlayCircleOutline />;
  };

  const getTotalLessons = () => {
    return sections.reduce((total, section) => total + section.lessons.length, 0);
  };

  const getCompletedLessonsCount = () => {
    return completedLessons.size;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Course Content
        </Typography>
        {isEnrolled && (
          <Typography variant="body2" color="text.secondary">
            {getCompletedLessonsCount()} of {getTotalLessons()} lessons completed
          </Typography>
        )}
      </Box>

      {sections.map((section, index) => (
        <Accordion 
          key={section.id}
          expanded={expandedSections.includes(index)}
          onChange={() => handleSectionToggle(index)}
          sx={{ mb: 1, borderRadius: '8px', overflow: 'hidden' }}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ 
              backgroundColor: '#f5f5f5',
              flexDirection: 'row-reverse',
              '& .MuiAccordionSummary-expandIconWrapper': {
                marginRight: 1
              },
              '& .MuiAccordionSummary-content': {
                marginLeft: 1
              }
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold' }}>
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {section.lessons.length} lectures • {section.duration}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List>
              {section.lessons.map((lesson) => (
                <ListItem 
                  key={lesson.id}
                  sx={{ 
                    py: 1, 
                    borderBottom: '1px solid #eee',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    {isEnrolled ? (
                      <>
                        <Checkbox
                          checked={completedLessons.has(lesson.id)}
                          onChange={() => handleLessonToggle(lesson.id)}
                          icon={getLessonIcon(lesson.type, lesson.id)}
                          checkedIcon={<CheckCircle color="success" />}
                          disabled={!isEnrolled}
                        />
                        {/* Add play button next to checkbox for enrolled users */}
                        <Tooltip title="Play lesson">
                          <IconButton 
                            size="small" 
                            onClick={() => handlePlayLesson(lesson.id)}
                            sx={{ ml: 1 }}
                          >
                            {getLessonIcon(lesson.type, lesson.id)}
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : lesson.isPreview ? (
                      <Tooltip title="Preview available">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handlePlayLesson(lesson.id)}
                        >
                          {getLessonIcon(lesson.type, lesson.id)}
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <IconButton size="small" disabled>
                        <Lock fontSize="small" />
                      </IconButton>
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={lesson.title}
                    secondary={`${lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} • ${lesson.duration}`}
                  />
                  {!isEnrolled && !lesson.isPreview && (
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <Lock fontSize="small" color="disabled" />
                    </ListItemIcon>
                  )}
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CourseContent;