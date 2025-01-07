import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategory } from '../../utils/contexts/CategoryContext';
import Select from 'react-select';
import { toast } from 'react-toastify';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { apiService } from '../../api/apiwrapper';
import CloseIcon from '@mui/icons-material/Close';

const CouponForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, isLoading } = useCategory();
  const isEditMode = !!id;

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
    imageFiles: [],
    percentOff: 0,
    uptoAmount: 0,
    minSpend: 0,
    maxSpend: 0
  });

  const [discountType, setDiscountType] = useState('percentOff');
  const [originalData, setOriginalData] = useState(null);
  const [previews, setPreviews] = useState({
    video: null,
    imageFiles: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoupon = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const response = await apiService.get(`deals/${id}`);
          const data = response.data;
          data.availableUntil = data.availableUntil ? new Date(data.availableUntil) : null;
          setFormData(data);
          setOriginalData(data);
          setDiscountType(data.percentOff > 0 ? 'percentOff' : 'uptoAmount');
          if (data.images) {
            setPreviews(prev => ({
              ...prev,
              imageFiles: Array.isArray(data.images) ? data.images : [data.images]
            }));
          }
        } catch (err) {
          toast.error('Error fetching coupon details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCoupon();
  }, [id, isEditMode]);

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
      zIndex: 1300,
      backgroundColor: '#ffffff',
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

  const handleDiscountTypeChange = (e) => {
    const type = e.target.value;
    setDiscountType(type);
    setFormData(prev => ({
      ...prev,
      percentOff: type === 'percentOff' ? prev.percentOff : 0,
      uptoAmount: type === 'uptoAmount' ? prev.uptoAmount : 0
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
    const { files } = e.target;
    const fileArray = Array.from(files);

    setFormData(prev => ({
      ...prev,
      imageFiles: [...(prev.imageFiles || []), ...fileArray]
    }));

    const previewPromises = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(previewResults => {
      setPreviews(prev => ({
        ...prev,
        imageFiles: [...(prev.imageFiles || []), ...previewResults]
      }));
    });
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles ? prev.imageFiles.filter((_, i) => i !== index) : []
    }));
    setPreviews(prev => ({
      ...prev,
      imageFiles: prev.imageFiles ? prev.imageFiles.filter((_, i) => i !== index) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();

      if (isEditMode) {
        Object.keys(formData).forEach(key => {
          if (key === 'imageFiles' && formData[key].length > 0) {
            formData[key].forEach(file => {
              formDataToSend.append('imageFiles', file);
            });
          } else if (
            formData[key] !== null &&
            JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])
          ) {
            formDataToSend.append(key, formData[key]);
          }
        });

        await apiService.patch(`deals/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Coupon updated successfully');
      } else {
        Object.keys(formData).forEach(key => {
          if (key === 'imageFiles') {
            formData[key].forEach(file => {
              formDataToSend.append('imageFiles', file);
            });
          } else if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });

        await apiService.post('deals', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Coupon created successfully');
      }
      navigate('/coupons');
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error ${isEditMode ? 'updating' : 'creating'} coupon`);
    } finally {
      setLoading(false);
    }
  };

  const renderFilePreview = () => {
    const preview = previews.imageFiles;
    if (!preview?.length) return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {Array.isArray(preview) && preview.map((img, index) => (
          <Box key={index} sx={{ position: 'relative', display: 'inline-block', m: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleRemoveFile(index)}
              sx={{
                position: 'absolute',
                right: -10,
                top: -10,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'grey.300' },
                zIndex: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <img
              src={img}
              alt={`Preview ${index + 1}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? 'Edit Coupon' : 'Create New Coupon'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Basic Information
          </Typography>
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
              <TextField
                fullWidth
                label="Short Tag Line"
                name="shortTagLine"
                value={formData.shortTagLine}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>Category *</Typography>
              <Select
                name="categoryId"
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === formData.categoryId)}
                onChange={handleCategoryChange}
                placeholder="Select Category"
                styles={customStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Rules and Limitations
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usage Limit Per Coupon"
                name="maxPurchaseLimit"
                type="number"
                value={formData.maxPurchaseLimit}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Usage Limit Per User"
                name="maxPurchasePerUser"
                type="number"
                value={formData.maxPurchasePerUser}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Min Spend"
                name="minSpend"
                type="number"
                value={formData.minSpend}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Max Spend"
                name="maxSpend"
                type="number"
                value={formData.maxSpend}
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

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Discount Type</FormLabel>
                <RadioGroup
                  row
                  name="discountType"
                  value={discountType}
                  onChange={handleDiscountTypeChange}
                >
                  <FormControlLabel value="percentOff" control={<Radio />} label="Percentage Off" />
                  <FormControlLabel value="uptoAmount" control={<Radio />} label="Up to Amount" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={discountType === 'percentOff' ? 'Percentage Off' : 'Up to Amount'}
                name={discountType}
                type="number"
                value={discountType === 'percentOff' ? formData.percentOff : formData.uptoAmount}
                onChange={handleChange}
                disabled={false}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Images
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                Upload Image Files * (Max 10, 1MB each)
                <input
                  type="file"
                  name="imageFiles"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              {previews.imageFiles.length > 0 && renderFilePreview()}
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Make sure to review all details before {isEditMode ? 'updating' : 'creating'} the coupon. Once created, some properties cannot be modified.
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
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update Coupon' : 'Create Coupon')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default CouponForm;
