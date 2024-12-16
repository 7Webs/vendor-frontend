import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    InputAdornment,
    Container,
    CircularProgress,
    useTheme,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Chip,
    Grid,
    Divider,
    Paper
} from '@mui/material';
import {
    Search as SearchIcon,
    Person as PersonIcon,
    Store as StoreIcon,
    Category as CategoryIcon,
    CalendarToday as CalendarIcon,
    LocalOffer as CouponIcon
} from '@mui/icons-material';
import { useInfiniteQuery } from 'react-query';
import { apiService } from '../../api/apiwrapper';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';

const RedeemedCoupons = () => {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch
    } = useInfiniteQuery({
        queryKey: ["redeemedDeals", searchTerm],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await apiService.get(
                `/deals-redeem/shop?take=10&skip=${pageParam}&q=${searchTerm}`
            );
            return response.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length * 10 : undefined;
        },
    });

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    const handleSearch = () => {
        setSearchTerm(searchQuery);
        refetch();
    };

    const allRedeemedDeals = data?.pages.flatMap(page => page) || [];

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

    return (
        <Container maxWidth="xl">
            <Box sx={{
                py: 4,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: theme.palette.primary.main
                    }}
                >
                    Redeemed Coupons
                </Typography>
            </Box>

            <Box sx={{
                mb: 4,
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search redeemed coupons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <Button
                    startIcon={<SearchIcon />}
                    variant="contained"
                    onClick={handleSearch}
                    sx={{
                        minWidth: '120px',
                        borderRadius: 2
                    }}
                >
                    Search
                </Button>
            </Box>

            <Grid container spacing={3}>
                {isFetching && !isFetchingNextPage ? (
                    [...Array(6)].map((_, index) => (
                        <Grid item xs={12} key={index}>
                            <SkeletonLoader />
                        </Grid>
                    ))
                ) : (
                    allRedeemedDeals.map((redemption) => (
                        <Grid item xs={12} key={redemption.id}>
                            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
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
                                                borderRadius: 2
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={9}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h5" gutterBottom>
                                                {redemption.deal.title}
                                            </Typography>
                                            <Chip
                                                label={redemption.status.replace('_', ' ').toUpperCase()}
                                                color={getStatusColor(redemption.status)}
                                                sx={{ textTransform: 'capitalize' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                                            <Chip
                                                icon={<CouponIcon />}
                                                label={`Code: ${redemption.couponCode}`}
                                                variant="outlined"
                                            />
                                            <Chip
                                                icon={<CalendarIcon />}
                                                label={`Valid until: ${new Date(redemption.deal.availableUntil).toLocaleDateString()}`}
                                                variant="outlined"
                                            />
                                            <Chip
                                                icon={<CategoryIcon />}
                                                label={redemption.deal.category.name}
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Typography variant="body1" color="text.secondary" paragraph>
                                            {redemption.deal.description}
                                        </Typography>

                                        <Divider sx={{ my: 2 }} />

                                        <Box sx={{ display: 'flex', gap: 4 }}>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Redeemed By
                                                </Typography>
                                                <Typography variant="body2">
                                                    {redemption.user.name || redemption.user.email}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Redeemed On
                                                </Typography>
                                                <Typography variant="body2">
                                                    {new Date(redemption.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>

            {isFetchingNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!hasNextPage && allRedeemedDeals.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Typography>No more redeemed coupons to load</Typography>
                </Box>
            )}
        </Container>
    );
};

export default RedeemedCoupons;
