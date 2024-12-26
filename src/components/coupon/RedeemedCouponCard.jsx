import React from 'react';
import {
    Box,
    Typography,
    Chip,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    Stack,
    Divider,
    useTheme,
    alpha
} from '@mui/material';
import {
    Person,
    Category,
    CalendarToday,
    Phone,
    Email
} from '@mui/icons-material';
import { getStatusConfig } from '../../utils/Status';

const RedeemedCouponCard = ({ redemption }) => {
    const theme = useTheme();

    const statusConfig = getStatusConfig(theme, redemption.status);

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 1,
                background: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                backdropFilter: 'blur(20px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 2px 4px ${alpha(theme.palette.common.black, 0.1)}`
                }
            }}
        >
            <Grid container>
                <Grid item xs={12} md={1.4}>
                    <CardMedia
                        component="img"
                        image={redemption.deal.images?.[0]}
                        alt={redemption.deal.title}
                        sx={{
                            height: '100%',
                            minHeight: 60,
                            objectFit: 'cover'
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={10}>
                    <CardContent sx={{ p: 1 }}>
                        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    {redemption.deal.title}
                                </Typography>
                                <Chip
                                    icon={statusConfig.icon}
                                    label={statusConfig.label}
                                    size="small"
                                    sx={{
                                        backgroundColor: alpha(statusConfig.color, 0.1),
                                        color: statusConfig.color,
                                        fontWeight: 600,
                                        borderRadius: 1,
                                        height: '20px'
                                    }}
                                />
                            </Box>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mb: 1 }}
                        >
                            <Chip
                                icon={<Category sx={{ fontSize: 10 }} />}
                                label={redemption.deal.category.name}
                                size="small"
                                sx={{ borderRadius: 1, height: '20px', fontSize: '0.7rem' }}
                            />
                            <Chip
                                icon={<CalendarToday sx={{ fontSize: 10 }} />}
                                label={new Date(redemption.deal.availableUntil).toLocaleDateString()}
                                size="small"
                                sx={{ borderRadius: 1, height: '20px', fontSize: '0.7rem' }}
                            />
                        </Stack>

                        <Divider sx={{ mb: 1 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        bgcolor: theme.palette.primary.main,
                                        mr: 1
                                    }}
                                >
                                    <Person sx={{ fontSize: 12 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                        Redeemed By
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                                        {redemption.user.name || redemption.user.email}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        bgcolor: theme.palette.primary.main,
                                        mr: 1
                                    }}
                                >
                                    <CalendarToday sx={{ fontSize: 12 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                        Redeemed On
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                                        {new Date(redemption.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>

                            {redemption.user.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            bgcolor: theme.palette.primary.main,
                                            mr: 1
                                        }}
                                    >
                                        <Phone sx={{ fontSize: 12 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                            Phone
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                                            {redemption.user.phone}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                            {redemption.user.email && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            bgcolor: theme.palette.primary.main,
                                            mr: 1
                                        }}
                                    >
                                        <Email sx={{ fontSize: 12 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                            Email
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.75rem' }}>
                                            {redemption.user.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
};

export default RedeemedCouponCard;
