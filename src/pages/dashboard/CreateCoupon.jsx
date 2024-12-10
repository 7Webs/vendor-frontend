import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategory } from '../../utils/CategoryContext';
import Select from 'react-select';

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { apiService } from '../../api/apiwrapper';


const CreateCoupon = () => {
  const navigate = useNavigate();
  const { categories, isLoading } = useCategory();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortTagLine: '',
    keywords: '',
    type: 'deal',
    availableUntil: null,
    features: '',
    categoryId: 1,
    maxPurchaseLimit: '',
    maxPurchasePerUser: '',
    video: null,
    imageFiles: null,
  });

  const [previews, setPreviews] = useState({
    video: null,
    imageFiles: null,
  });

  // Transform categories for react-select
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '56px',
      minHeight: '56px',
      borderRadius: '4px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(0, 0, 0, 0.1)' : 'none',
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1300, // Ensure it's above other elements
      backgroundColor: '#ffffff', // White background for dropdown
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#f0f0f0' : 'white',
      color: 'black',
      '&:hover': {
        backgroundColor: '#e0e0e0',
      },
    }),
  };

  // Set first category as default when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories, formData.categoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: selectedOption ? selectedOption.value : null,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      availableUntil: date,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Create preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.post('deals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Creating coupon:', formData);
      navigate('/coupons');
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const renderFilePreview = (type) => {
    const preview = previews[type];
    if (!preview) return null;

    return (
      <Box sx={{ mt: 2, maxWidth: '100%' }}>
        {type === 'video' ? (
          <video
            src={preview}
            controls
            style={{ maxWidth: '100%', maxHeight: '200px' }}
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Coupon
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Available Until *"
                  value={formData.availableUntil}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={new Date()}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Short Tag Line"
                name="shortTagLine"
                value={formData.shortTagLine}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Features"
                name="features"
                value={formData.features}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Category *</Typography>
              <Select
                name="categoryId"
                options={categoryOptions}
                value={formData.selectedOption}
                onChange={handleCategoryChange}
                placeholder="Select Category"
                styles={customStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Purchase Limit"
                name="maxPurchaseLimit"
                type="number"
                value={formData.maxPurchaseLimit}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Purchase Per User"
                name="maxPurchasePerUser"
                type="number"
                value={formData.maxPurchasePerUser}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                Upload Video
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {renderFilePreview('video')}
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                Upload Image Files *
                <input
                  type="file"
                  name="imageFiles"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {renderFilePreview('imageFiles')}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Make sure to review all details before creating the coupon. Once created, some properties cannot be modified.
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/coupons')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                >
                  Create Coupon
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateCoupon;
