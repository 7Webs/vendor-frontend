import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Tooltip,
    Box,
    useTheme,
    Grid,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccessTime as TimeIcon,
    Store as StoreIcon,
    Category as CategoryIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const CouponCard = ({ coupon, onEdit, onDelete }) => {
    const theme = useTheme();

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                sx={{
                    maxWidth: 320,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    background: theme.palette.background.paper,
                    position: 'relative'
                }}
            >
                <CardMedia
                    component="img"
                    height="140"
                    image={coupon.images?.[0] || '/placeholder-image.jpg'}
                    alt={coupon.title}
                    sx={{
                        transition: '0.3s',
                        '&:hover': {
                            transform: 'scale(1.05)'
                        }
                    }}
                />
                
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        gap: 0.5
                    }}
                >
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={() => onEdit(coupon)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': { bgcolor: 'white' }
                            }}
                        >
                            <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            size="small"
                            onClick={() => onDelete(coupon)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(4px)',
                                '&:hover': { bgcolor: 'white', color: theme.palette.error.main }
                            }}
                        >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <CardContent sx={{ p: 2 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: theme.palette.text.primary,
                            fontSize: '0.95rem'
                        }}
                    >
                        {coupon.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: '0.8rem',
                            lineHeight: 1.4
                        }}
                    >
                        {coupon.description}
                    </Typography>

                    <Grid container spacing={1} sx={{ mb: 1.5 }}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StoreIcon sx={{ fontSize: 16 }} color="primary" />
                                <Typography variant="caption">{coupon.shop.name}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CategoryIcon sx={{ fontSize: 16 }} color="secondary" />
                                <Typography variant="caption">{coupon.shop.category.name}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 1,
                            pt: 1,
                            borderTop: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon sx={{ fontSize: 16 }} color="info" />
                            <Typography variant="caption">
                                {new Date(coupon.availableUntil).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: theme.palette.primary.main,
                                fontWeight: 600 
                            }}
                        >
                            Limit: {coupon.maxPurchasePerUser}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CouponCard;
