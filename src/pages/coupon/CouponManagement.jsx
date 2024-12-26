import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  CircularProgress,
  useTheme,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { apiService } from '../../api/apiwrapper';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';
import CouponCard from '../../components/coupon/CouponCard';
import CouponScanner from './CouponScanner';

const DealManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ["deals", searchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get(
        `deals/my-deals?take=6&skip=${pageParam}&q=${searchTerm}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 6 ? allPages.length * 6 : undefined;
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

  const handleEdit = (deal) => {
    navigate(`/coupons/edit/${deal.id}`, { state: { deal } });
  };

  const confirmDelete = (deal) => {
    setSelectedDeal(deal);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedDeal) {
      setIsLoading(true);
      try {
        await apiService.delete(`deals/${selectedDeal.id}`);
        setDeleteDialogOpen(false);
        refetch();
      } catch (error) {
        console.error('Failed to delete deal', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchQuery);
    refetch();
  };

  const handleCardClick = (deal) => {
    navigate(`/coupons/view/${deal.id}`);
  };

  const renderDealCard = (deal) => (
    <Fade in timeout={500} key={deal.id}>
      <Grid item xs={12} sm={6} md={4}>
        <Box onClick={() => handleCardClick(deal)} sx={{ cursor: 'pointer' }}>
          <CouponCard
            coupon={deal}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        </Box>
      </Grid>
    </Fade>
  );

  const allDeals = data?.pages.flat() || [];

  if (showScanner) {
    return <CouponScanner />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{
        py: 2,
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1
      }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          Coupon Management
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            startIcon={<QrCodeIcon />}
            onClick={() => setShowScanner(true)}
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            Scan Coupon
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/coupons/create')}
            sx={{
              borderRadius: 2,
              px: 3
            }}
          >
            Create Coupon
          </Button>
        </Stack>
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
          placeholder="Search deals..."
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

      {isFetching && !isFetchingNextPage ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <SkeletonLoader />
            </Grid>
          ))}
        </Grid>
      ) : allDeals.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No coupons found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {allDeals.map(renderDealCard)}
          </Grid>

          {isFetchingNextPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {!hasNextPage && allDeals.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography>No more deals to load</Typography>
            </Box>
          )}
        </>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Delete Deal?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the deal "{selectedDeal?.title}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DealManagement;