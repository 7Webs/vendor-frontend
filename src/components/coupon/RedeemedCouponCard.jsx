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
    alpha,
    Link
} from '@mui/material';
import {
    Person as PersonIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    LocalOffer as CouponIcon,
    CheckCircle as CheckCircleIcon,
    AccessTime as PendingIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon,
    Twitter as TwitterIcon,
    YouTube as YouTubeIcon,
    LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const RedeemedCouponCard = ({ redemption }) => {
    const theme = useTheme();

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending_usage':
                return {
                    color: theme.palette.warning.main,
                    icon: <PendingIcon sx={{ fontSize: 10 }} />,
                    label: 'Pending Usage'
                };
            case 'used':
                return {
                    color: theme.palette.success.main,
                    icon: <CheckCircleIcon sx={{ fontSize: 10 }} />,
                    label: 'Used'
                };
            default:
                return {
                    color: theme.palette.grey[500],
                    icon: null,
                    label: status
                };
        }
    };

    const statusConfig = getStatusConfig(redemption.status);

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
                <Grid item xs={12} md={2}>
                    <CardMedia
                        component="img"
                        image={redemption.deal.images?.[0]}
                        alt={redemption.deal.title}
                        sx={{
                            height: '100%',
                            minHeight: 100,
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
                            <Chip
                                icon={<CouponIcon sx={{ fontSize: 10 }} />}
                                label={redemption.couponCode}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                    borderRadius: 1,
                                    height: '20px'
                                }}
                            />
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: alpha(theme.palette.text.primary, 0.7),
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                fontSize: '0.75rem'
                            }}
                        >
                            {redemption.deal.description}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mb: 1 }}
                        >
                            <Chip
                                icon={<CategoryIcon sx={{ fontSize: 10 }} />}
                                label={redemption.deal.category.name}
                                size="small"
                                sx={{ borderRadius: 1, height: '20px', fontSize: '0.7rem' }}
                            />
                            <Chip
                                icon={<CalendarIcon sx={{ fontSize: 10 }} />}
                                label={new Date(redemption.deal.availableUntil).toLocaleDateString()}
                                size="small"
                                sx={{ borderRadius: 1, height: '20px', fontSize: '0.7rem' }}
                            />
                        </Stack>

                        <Divider sx={{ mb: 1 }} />

                        <Stack direction="column" spacing={1}>
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
                                        <PersonIcon sx={{ fontSize: 12 }} />
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
                                        <CalendarIcon sx={{ fontSize: 12 }} />
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
                                            <PhoneIcon sx={{ fontSize: 12 }} />
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
                                            <EmailIcon sx={{ fontSize: 12 }} />
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

                            {(redemption.user.facebookProfileLink ||
                                redemption.user.instagramProfileLink ||
                                redemption.user.tiktokProfileLink ||
                                redemption.user.twitterProfileLink ||
                                redemption.user.youtubeProfileLink ||
                                redemption.user.linkedinProfileLink) && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        {redemption.user.facebookProfileLink && (
                                            <Link href={redemption.user.facebookProfileLink} target="_blank">
                                                <FacebookIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                            </Link>
                                        )}
                                        {redemption.user.instagramProfileLink && (
                                            <Link href={redemption.user.instagramProfileLink} target="_blank">
                                                <InstagramIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                            </Link>
                                        )}
                                        {redemption.user.tiktokProfileLink && (
                                            <Link href={redemption.user.tiktokProfileLink} target="_blank">
                                                <TwitterIcon style={{ fontSize: 14, color: theme.palette.text.secondary }} />
                                            </Link>
                                        )}
                                        {redemption.user.twitterProfileLink && (
                                            <Link href={redemption.user.twitterProfileLink} target="_blank">
                                                <TwitterIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                            </Link>
                                        )}
                                        {redemption.user.youtubeProfileLink && (
                                            <Link href={redemption.user.youtubeProfileLink} target="_blank">
                                                <YouTubeIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                            </Link>
                                        )}
                                        {redemption.user.linkedinProfileLink && (
                                            <Link href={redemption.user.linkedinProfileLink} target="_blank">
                                                <LinkedInIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                            </Link>
                                        )}
                                    </Stack>
                                )}
                        </Stack>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
};

export default RedeemedCouponCard;
