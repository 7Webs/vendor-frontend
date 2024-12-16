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
                        height="140"
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
                        top: 8,
                        right: 8,
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

                <CardContent sx={{ p: 1.5 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 0.5,
                            fontSize: '0.9rem',
                            color: theme.palette.text.primary,
                            lineHeight: 1.2
                        }}
                    >
                        {coupon.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mb: 1,
                            color: theme.palette.text.secondary,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.2,
                            fontSize: '0.75rem'
                        }}
                    >
                        {coupon.description}
                    </Typography>

                    <Grid container spacing={0.5} sx={{ mb: 1 }}>
                        <Grid item xs={12}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 0.5,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 2
                            }}>
                                <CategoryIcon sx={{ fontSize: 14 }} />
                                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
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
                            pt: 1,
                            borderTop: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: theme.palette.info.main
                        }}>
                            <TimeIcon sx={{ fontSize: 14 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                                {new Date(coupon.availableUntil).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Chip
                            label={`Limit: ${coupon.maxPurchasePerUser}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, height: '18px', '& .MuiChip-label': { fontSize: '0.65rem' } }}
                        />
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CouponCard;
