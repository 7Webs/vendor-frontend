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
    Grid,
    Paper
} from '@mui/material';
import {
    Search as SearchIcon
} from '@mui/icons-material';
import { useInfiniteQuery } from 'react-query';
import { apiService } from '../../api/apiwrapper';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';
import RedeemedCouponCard from '../../components/coupon/RedeemedCouponCard';

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
                `/deals-redeem/shop?take=5&skip=${pageParam}&q=${searchTerm}`
            );
            return response.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 5 ? allPages.length * 5 : undefined;
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const allRedeemedDeals = data?.pages.flatMap(page => page) || [];

    return (
        <Container maxWidth="xl">
            <Box sx={{
                py: 0,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                background: theme.palette.background.default,
                borderRadius: 2,
                mb: 4
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

            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 4,
                    borderRadius: 2,
                    background: `linear-gradient(to right, ${theme.palette.background.paper}, ${theme.palette.background.default})`
                }}
            >
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by coupon code, title or customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.paper,
                                '&:hover': {
                                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                }
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                            minWidth: '120px',
                            borderRadius: 2,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                            }
                        }}
                    >
                        <SearchIcon sx={{ mr: 1 }} />
                        Search
                    </Button>
                </Box>
            </Paper>

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
                            <RedeemedCouponCard redemption={redemption} />
                        </Grid>
                    ))
                )}
            </Grid>

            {isFetchingNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress size={40} thickness={4} />
                </Box>
            )}

            {!hasNextPage && allRedeemedDeals.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
                    <Typography
                        variant="body1"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontStyle: 'italic'
                        }}
                    >
                        No more redeemed coupons to load
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default RedeemedCoupons;
