import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ImageOutlined as ImageIcon,
  StorefrontOutlined as ShopIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { apiService } from '../../api/apiwrapper';
import { motion } from 'framer-motion';

const DealManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["deals", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await apiService.get(
        `deals/my-deals?take=20&skip=${pageParam}&search=${searchQuery}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length * 20 : undefined;
    },
  });

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
      } catch (error) {
        console.error('Failed to delete deal', error);
      }
    }
  };

  const renderDealDetails = (deal) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ListItem
        alignItems="flex-start"
        secondaryAction={
          <Box>
            <Tooltip title="Edit Deal">
              <IconButton
                edge="end"
                onClick={() => handleEdit(deal)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Deal">
              <IconButton
                edge="end"
                onClick={() => confirmDelete(deal)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      >
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            src={deal.images?.[0] || ''}
            alt={deal.title}
            sx={{
              width: 120,
              height: 120,
              mr: 2,
              borderRadius: 2
            }}
          >
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 2 }}>
                {deal.title}
              </Typography>
            </Box>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="text.secondary">
                {deal.description}
              </Typography>
              <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1
              }}>
                <Chip
                  icon={<ShopIcon />}
                  label={deal.shop.name}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Category: ${deal.shop.category.name}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Available Until: ${new Date(deal.availableUntil).toLocaleDateString()}`}
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Max Purchase Limit: {deal.maxPurchaseLimit}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Max Purchase Per User: {deal.maxPurchasePerUser}
                </Typography>
              </Box>
              {deal.features && (
                <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                  Features: {deal.features}
                </Typography>
              )}
            </Box>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </motion.div>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{
        mb: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h4" component="h1">
          Coupon Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/coupons/create')}
        >
          Create Coupon
        </Button>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
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
        />
        <Button
          startIcon={<FilterIcon />}
          variant="outlined"
        >
          Filter
        </Button>
      </Box>

      <List>
        {data?.pages.map((page) =>
          Array.isArray(page) ? page.map(renderDealDetails) : null
        )}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Deal?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the deal "{selectedDeal?.title}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load More Section */}
      {hasNextPage && (
        <Box
          ref={loadMoreRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 4
          }}
        >
          <Button
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default DealManagement;