import React, { useState, useEffect, useRef } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { apiService } from '../../api/apiwrapper';
import { motion } from 'framer-motion';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';
import CouponCard from '../../components/coupon/CouponCard';

const DealManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

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
        `deals/my-deals?take=5&skip=${pageParam}&q=${searchTerm}`
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

  const handleEdit = (deal) => {
    navigate(`/deals/edit/${deal.id}`, { state: { deal } });
  };

  const confirmDelete = (deal) => {
    setSelectedDeal(deal);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (selectedDeal) {
      try {
        await apiService.delete(`deals/${selectedDeal.id}`);
        setDeleteDialogOpen(false);
        refetch();
      } catch (error) {
        console.error('Failed to delete deal', error);
      }
    }
  };

  const handleSearch = () => {
    setSearchTerm(searchQuery);
    refetch();
  };

  const renderDealCard = (deal) => (
    <Fade in timeout={500}>
      <Grid item xs={12} sm={6} md={4} key={deal.id}>
        <CouponCard
          coupon={deal}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
      </Grid>
    </Fade>
  );

  const allDeals = data?.pages.flat() || [];

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
          Coupon Management
        </Typography>
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

      <Grid container spacing={3}>
        {isFetching && !isFetchingNextPage ? (
          [...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SkeletonLoader />
            </Grid>
          ))
        ) : (
          // Show actual data once loaded
          allDeals.map(renderDealCard)
        )}
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
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DealManagement;