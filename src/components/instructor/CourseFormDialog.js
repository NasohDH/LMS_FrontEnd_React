import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, Box, Typography, IconButton, InputLabel, Select, MenuItem,
  Chip, OutlinedInput, FormControl, FormHelperText, CircularProgress
} from '@mui/material';
import { AddPhotoAlternate as AddPhotoAlternateIcon, Close as CloseIcon } from '@mui/icons-material';
import { fetchCategories } from '../../store/slices/categoriesSlice';

const CourseFormDialog = ({ open, onClose, onSave, initialData }) => {
  const dispatch = useDispatch();
  const { items: categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { loading: coursesLoading } = useSelector(state => state.courses);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [level, setLevel] = useState('');
  const [discount, setDiscount] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const isUpdateMode = Boolean(initialData);

  useEffect(() => {
    if (open) {
      dispatch(fetchCategories());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (isUpdateMode && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setLevel(initialData.level || '');
      setDiscount(initialData.discount || '');
      const categoryIds = initialData.categories.map(cat => cat.id);
      setSelectedCategories(categoryIds || []);
      
      setImagePreview(initialData.image ? `https://placehold.co/600x400?text=${initialData.title.split(' ').join('+')}` : ''); 
      setCourseImage(null);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setLevel('');
      setDiscount('');
      setSelectedCategories([]);
      setImagePreview('');
      setCourseImage(null);
    }
  }, [initialData, isUpdateMode, open]);

  const handleCategoryChange = (event) => {
    const { target: { value } } = event;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setCourseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const isFormValid = () => {
    const imageRequirement = isUpdateMode ? true : !!courseImage;
    return title && description && price > 0 && level > 0 && selectedCategories.length > 0 && imageRequirement;
  };

 
  const prepareFormData = () => {
    const formData = new FormData();
    let hasChanges = false;

    if (isUpdateMode && initialData) {
     
      if (title !== initialData.title) {
        formData.append('title', title);
        hasChanges = true;
      }

      if (description !== initialData.description) {
        formData.append('description', description);
        hasChanges = true;
      }

      if (parseFloat(price) !== parseFloat(initialData.price)) {
        formData.append('price', price);
        hasChanges = true;
      }

      if (parseInt(level) !== parseInt(initialData.level)) {
        formData.append('level', level);
        hasChanges = true;
      }
      if (parseInt(discount) !== parseInt(initialData.discount)) {
        formData.append('discount', discount);
        hasChanges = true;
      }
     
      const currentCategories = initialData.categories?.map(cat => cat.id) || [];
      const newCategories = selectedCategories || [];
      
      const categoriesChanged = 
        currentCategories.length !== newCategories.length ||
        !currentCategories.every((cat, index) => cat === newCategories[index]);
      
      if (categoriesChanged) {
        newCategories.forEach(catId => formData.append('category_ids[]', catId));
        hasChanges = true;
      }

     
      if (courseImage && courseImage instanceof File) {
        formData.append('image', courseImage);
        hasChanges = true;
      }
    } else {
     
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('level', level);
      selectedCategories.forEach(catId => formData.append('category_ids[]', catId));
      if (courseImage) {
        formData.append('image', courseImage);
      }
      hasChanges = true;
    }

    return { formData, hasChanges };
  };

 
  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const { formData, hasChanges } = prepareFormData();
    
    if (!hasChanges) {
      onClose();
      return;
    }
    console.log(formData);
    await onSave(formData, initialData?.id);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isUpdateMode ? 'Update Course' : 'Create a New Course'}
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} sx={{ pt: 1 }}>
          <Grid item xs={12} md={8} maxWidth={'65%'}>
            <TextField fullWidth required margin="normal" label="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <TextField fullWidth required margin="normal" label="Course Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField fullWidth required margin="normal" label="Price ($)" type="number" value={price} onChange={(e) => {if(e.target.value>=0) setPrice(e.target.value)}} />
              </Grid>
              <Grid item xs={4}>
              <TextField fullWidth margin="normal" label="Course Discount" type="number" value={discount} onChange={(e) => {if(e.target.value>=0) setDiscount(e.target.value)}} />
              </Grid>
              <Grid item xs={4}>
              <TextField fullWidth margin="normal" label="Course Level" type="number" value={level} onChange={(e) => {if(e.target.value>=0) setLevel(e.target.value)}} />
              </Grid>
            </Grid>
            <FormControl fullWidth required margin="normal">
              <InputLabel id="category-multiple-chip-label">Categories</InputLabel>
              <Select
                labelId="category-multiple-chip-label"
                multiple
                value={selectedCategories}
                onChange={handleCategoryChange}
                input={<OutlinedInput id="select-multiple-chip" label="Categories" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const category = categories.find(c => c.id === value);
                      return <Chip key={value} label={category?.name || ''} />;
                    })}
                  </Box>
                )}
              >
                {categoriesLoading ? (
                  <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                ) : (
                  categories.map((category) => ( 
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>Select one or more categories</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Course Image</Typography>
            <Box
              sx={{ border: '2px dashed grey', borderRadius: 2, p: 2, textAlign: 'center', cursor: 'pointer', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${imagePreview})`, backgroundSize: 'cover', backgroundPosition: 'center', color: imagePreview ? 'transparent' : 'text.secondary' }}
              component="label"
              htmlFor="course-image-upload"
            >
              {!imagePreview && (<><AddPhotoAlternateIcon sx={{ fontSize: 40, mb: 1 }} /><Typography>Click to upload</Typography><Typography variant="caption">PNG, JPG {isUpdateMode && '(Optional)'}</Typography></>)}
              <input id="course-image-upload" type="file" accept="image/png, image/jpeg" hidden onChange={handleImageChange} />
            </Box>
            {courseImage && <Typography variant="caption" display="block" sx={{mt: 1, textAlign: 'center'}}>{courseImage.name}</Typography>}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose} variant="outlined" color="secondary">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={!isFormValid() || coursesLoading}
        >
          {coursesLoading ? <CircularProgress size={24} /> : (isUpdateMode ? 'Save Changes' : 'Create Course')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseFormDialog;