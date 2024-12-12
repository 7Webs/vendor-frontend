import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Box,
    useTheme,
    Grid,
    Chip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccessTime as TimeIcon,
    Store as StoreIcon,
    Category as CategoryIcon,
    LocalOffer as OfferIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CouponCard = ({ coupon, onEdit, onDelete }) => {
    const theme = useTheme();

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <Card
                sx={{
                    maxWidth: 345,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                    position: 'relative',
                    border: '1px solid rgba(0,0,0,0.08)'
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={coupon.images?.[0] || '/placeholder-image.jpg'}
                        alt={coupon.title}
                        sx={{
                            transition: '0.5s',
                            '&:hover': {
                                transform: 'scale(1.1)'
                            }
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)'
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        gap: 1
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(coupon);
                        }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(coupon);
                        }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(8px)',
                            '&:hover': {
                                bgcolor: theme.palette.error.main,
                                color: 'white',
                                transform: 'scale(1.1)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>

                <CardContent sx={{ p: 3 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '1.1rem',
                            color: theme.palette.text.primary,
                            lineHeight: 1.3
                        }}
                    >
                        {coupon.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mb: 2.5,
                            color: theme.palette.text.secondary,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5
                        }}
                    >
                        {coupon.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2
                            }}>
                                <StoreIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {coupon.shop.name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2
                            }}>
                                <CategoryIcon sx={{ fontSize: 20, color: theme.palette.secondary.main }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {coupon.shop.category.name}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 2,
                            borderTop: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: theme.palette.info.main
                        }}>
                            <TimeIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {new Date(coupon.availableUntil).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Chip
                            label={`Limit: ${coupon.maxPurchasePerUser}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CouponCard;
