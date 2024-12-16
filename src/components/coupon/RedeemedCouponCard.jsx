import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Grid,
    Paper,
    Fade,
    Tooltip,
    useTheme
} from '@mui/material';
import {
    Person as PersonIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    LocalOffer as CouponIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as PendingIcon
} from '@mui/icons-material';

const RedeemedCouponCard = ({ redemption }) => {
    const theme = useTheme();

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_usage':
                return 'warning';
            case 'used':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending_usage':
                return <PendingIcon />;
            case 'used':
                return <CheckCircleIcon />;
            default:
                return null;
        }
    };

    return (
        <Fade in timeout={500}>
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                        <Box
                            component="img"
                            src={redemption.deal.images?.[0]}
                            alt={redemption.deal.title}
                            sx={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary
                                }}
                            >
                                {redemption.deal.title}
                            </Typography>
                            <Tooltip title={`Status: ${redemption.status.replace('_', ' ')}`}>
                                <Chip
                                    icon={getStatusIcon(redemption.status)}
                                    label={redemption.status.replace('_', ' ').toUpperCase()}
                                    color={getStatusColor(redemption.status)}
                                    sx={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </Tooltip>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                            <Tooltip title="Coupon Code">
                                <Chip
                                    icon={<CouponIcon />}
                                    label={redemption.couponCode}
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                />
                            </Tooltip>
                            <Tooltip title="Expiry Date">
                                <Chip
                                    icon={<CalendarIcon />}
                                    label={new Date(redemption.deal.availableUntil).toLocaleDateString()}
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                />
                            </Tooltip>
                            <Tooltip title="Category">
                                <Chip
                                    icon={<CategoryIcon />}
                                    label={redemption.deal.category.name}
                                    variant="outlined"
                                    sx={{ fontWeight: 500 }}
                                />
                            </Tooltip>
                        </Box>

                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.text.secondary,
                                mb: 3,
                                lineHeight: 1.6
                            }}
                        >
                            {redemption.deal.description}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                gap: 4,
                                flexWrap: 'wrap',
                                mt: 2
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        mb: 0.5,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Redeemed By
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {redemption.user.name || redemption.user.email}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        mb: 0.5,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <CalendarIcon sx={{ mr: 1 }} />
                                    Redeemed On
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {new Date(redemption.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Fade>
    );
};

export default RedeemedCouponCard;
