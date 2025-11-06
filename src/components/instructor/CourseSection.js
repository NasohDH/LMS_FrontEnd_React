import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CourseLesson from './CourseLesson';

const CourseSection = ({ 
  section, 
  onUpdateSection, 
  onDeleteSection, 
  onAddLesson, 
  onUpdateLesson, 
  onDeleteLesson,
  onAddSubtitles,
  onDeleteSubtitle
}) => {
  return (
    <Accordion defaultExpanded sx={{ mb: 2, '&:before': { display: 'none' }, boxShadow: 3, borderRadius: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.50', borderRadius: '8px 8px 0 0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{section.title}</Typography>
          <IconButton title="Add Lesson" onClick={(e) => { e.stopPropagation(); onAddLesson(); }}><AddIcon /></IconButton>
          <IconButton title="Rename Section" onClick={(e) => { e.stopPropagation(); onUpdateSection(); }}><EditIcon /></IconButton>
          <IconButton title="Delete Section" onClick={(e) => { e.stopPropagation(); onDeleteSection(); }}><DeleteIcon /></IconButton>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1, bgcolor: 'grey.100' }}>
      {(!section.lessons||section.lessons.length === 0) ? <Typography sx={{p: 2, textAlign: 'center', color: 'text.secondary'}}>This section has no lessons. Click the '+' icon to add one.</Typography>
       : section.lessons.map(lesson => (
            <CourseLesson 
                key={lesson.id} 
                lesson={lesson}
                onUpdate={() => onUpdateLesson(lesson)}
                onDelete={() => onDeleteLesson(lesson.id)}
                onAddSubtitles={onAddSubtitles}
                onDeleteSubtitle={onDeleteSubtitle}
            />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default CourseSection;