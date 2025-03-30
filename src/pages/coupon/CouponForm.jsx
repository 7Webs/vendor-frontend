import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCategory } from "../../utils/contexts/CategoryContext";
import Select from "react-select";
import { toast } from "react-toastify";
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
  Divider,
  Checkbox,
  FormGroup,
  Menu,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { apiService } from "../../api/apiwrapper";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const influencerOptions = [
  { label: "Instagram post", value: "instagram_post" },
  { label: "Instagram story", value: "instagram_story" },
  { label: "Instagram video post", value: "instagram_video_post" },
  { label: "Instagram video story", value: "instagram_video_story" },
  { label: "TikTok post", value: "tiktok_post" },
  { label: "Google Map Review", value: "google_map_review" },
];

const CouponForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, isLoading } = useCategory();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortTagLine: "",
    keywords: "",
    type: "deal",
    availableUntil: null,
    features: "",
    categoryId: 1,
    maxPurchaseLimit: "",
    maxPurchasePerUser: "",
    video: null,
    imageFiles: [],
    percentOff: 0,
    uptoAmount: 0,
    minSpend: 0,
    maxSpend: 0,
    influencerRequirements: "",
  });

  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [requirementsAnchorEl, setRequirementsAnchorEl] = useState(null);

  const [discountType, setDiscountType] = useState("percentOff");
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
          data.availableUntil = data.availableUntil
            ? new Date(data.availableUntil)
            : null;
          setFormData(data);
          setOriginalData(data);
          setDiscountType(data.percentOff > 0 ? "percentOff" : "uptoAmount");
          if (data.images) {
            setPreviews((prev) => ({
              ...prev,
              imageFiles: Array.isArray(data.images)
                ? data.images
                : [data.images],
            }));
          }
          if (data.influencerRequirements) {
            setSelectedRequirements(data.influencerRequirements.split(","));
          }
        } catch (err) {
          toast.error("Error fetching coupon details");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCoupon();
  }, [id, isEditMode]);

  const handleRequirementsClick = (event) => {
    setRequirementsAnchorEl(event.currentTarget);
  };

  const handleRequirementsClose = () => {
    setRequirementsAnchorEl(null);
  };

  const handleRequirementToggle = (value) => {
    const currentIndex = selectedRequirements.indexOf(value);
    const newRequirements = [...selectedRequirements];

    if (currentIndex === -1) {
      newRequirements.push(value);
    } else {
      newRequirements.splice(currentIndex, 1);
    }

    setSelectedRequirements(newRequirements);
    setFormData((prev) => ({
      ...prev,
      influencerRequirements: newRequirements.join(","),
    }));
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: "56px",
      minHeight: "56px",
      borderRadius: "4px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(0, 0, 0, 0.1)" : "none",
      "&:hover": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 1300,
      backgroundColor: "#ffffff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#f0f0f0" : "white",
      color: "black",
      "&:hover": {
        backgroundColor: "#e0e0e0",
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
    setFormData((prev) => ({
      ...prev,
      percentOff: type === "percentOff" ? prev.percentOff : 0,
      uptoAmount: type === "uptoAmount" ? prev.uptoAmount : 0,
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

    setFormData((prev) => ({
      ...prev,
      imageFiles: [...(prev.imageFiles || []), ...fileArray],
    }));

    const previewPromises = fileArray.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then((previewResults) => {
      setPreviews((prev) => ({
        ...prev,
        imageFiles: [...(prev.imageFiles || []), ...previewResults],
      }));
    });
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles
        ? prev.imageFiles.filter((_, i) => i !== index)
        : [],
    }));
    setPreviews((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles
        ? prev.imageFiles.filter((_, i) => i !== index)
        : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();

      if (isEditMode) {
        Object.keys(formData).forEach((key) => {
          if (key === "imageFiles" && formData[key].length > 0) {
            formData[key].forEach((file) => {
              formDataToSend.append("imageFiles", file);
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
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Coupon updated successfully");
      } else {
        Object.keys(formData).forEach((key) => {
          if (key === "imageFiles") {
            formData[key].forEach((file) => {
              formDataToSend.append("imageFiles", file);
            });
          } else if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        });

        await apiService.post("deals", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Coupon created successfully");
      }
      navigate("/coupons");
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error ${isEditMode ? "updating" : "creating"} coupon`);
    } finally {
      setLoading(false);
    }
  };

  const renderFilePreview = () => {
    const preview = previews.imageFiles;
    if (!preview?.length) return null;

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {Array.isArray(preview) &&
          preview.map((img, index) => (
            <Box
              key={index}
              sx={{ position: "relative", display: "inline-block", m: 1 }}
            >
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(index)}
                sx={{
                  position: "absolute",
                  right: -10,
                  top: -10,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "grey.300" },
                  zIndex: 1,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <img
                src={img}
                alt={`Preview ${index + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
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
          {isEditMode ? "Edit Coupon" : "Crear cupón"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Información básica
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Palabras clave"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Descripciópn en una frase"
                name="shortTagLine"
                value={formData.shortTagLine}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Categoría *
              </Typography>
              <Select
                name="categoryId"
                options={categoryOptions}
                value={categoryOptions.find(
                  (option) => option.value === formData.categoryId
                )}
                onChange={handleCategoryChange}
                placeholder="Select Categoría"
                styles={customStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Descripción"
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
            Requerimientos al influencer
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleRequirementsClick}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{ minWidth: 200 }}
              >
                Select Requirements
              </Button>
              <Menu
                anchorEl={requirementsAnchorEl}
                open={Boolean(requirementsAnchorEl)}
                onClose={handleRequirementsClose}
                PaperProps={{
                  sx: { maxHeight: 300, width: 250 },
                }}
              >
                <FormGroup sx={{ p: 2 }}>
                  {influencerOptions.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox
                          checked={selectedRequirements.includes(option.value)}
                          onChange={() => handleRequirementToggle(option.value)}
                        />
                      }
                      label={option.label}
                    />
                  ))}
                </FormGroup>
              </Menu>
              {selectedRequirements.length > 0 && (
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedRequirements.map((req) => {
                    const option = influencerOptions.find(
                      (opt) => opt.value === req
                    );
                    return (
                      <Chip
                        key={req}
                        label={option?.label}
                        onDelete={() => handleRequirementToggle(req)}
                        sx={{ m: 0.5 }}
                      />
                    );
                  })}
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Reglas y límites
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Máximo de usos del cupón"
                name="maxPurchaseLimit"
                type="number"
                value={formData.maxPurchaseLimit}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Máximo de usos por influencer"
                name="maxPurchasePerUser"
                type="number"
                value={formData.maxPurchasePerUser}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gasto mínimo"
                name="minSpend"
                type="number"
                value={formData.minSpend}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Gasto máximo"
                name="maxSpend"
                type="number"
                value={formData.maxSpend}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Disponible hasta *"
                  value={formData.availableUntil}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={new Date()}
                  sx={{ width: "100%" }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Tipo de descuento</FormLabel>
                <RadioGroup
                  row
                  name="discountType"
                  value={discountType}
                  onChange={handleDiscountTypeChange}
                >
                  <FormControlLabel
                    value="percentOff"
                    control={<Radio />}
                    label="Porcentaje"
                  />
                  <FormControlLabel
                    value="uptoAmount"
                    control={<Radio />}
                    label="Cantidad"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={
                  discountType === "percentOff" ? "Porcentaje" : "Cantidad"
                }
                name={discountType}
                type="number"
                value={
                  discountType === "percentOff"
                    ? formData.percentOff
                    : formData.uptoAmount
                }
                onChange={handleChange}
                disabled={false}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Imágenes
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: "56px" }}
              >
                Subir imagen * (Max 10, 1MB cada)
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
                Asegúrese de revisar todos los detalles antes de crear el cupón.
                Una vez creado, algunas propiedades no se pueden modificar.
              </Alert>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate("/coupons")}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : isEditMode ? (
                    "Update Coupon"
                  ) : (
                    "Crear cupón"
                  )}
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
