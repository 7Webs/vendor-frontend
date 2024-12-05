import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

// Mock data for coupons
const mockCoupons = [
  {
    id: 1,
    code: 'SUMMER2023',
    discount: '20%',
    status: 'active',
    usage: '156/500',
    expiry: '2023-08-31',
    redemptionRate: '31.2%',
  },
  {
    id: 2,
    code: 'WELCOME',
    discount: '15%',
    status: 'active',
    usage: '89/200',
    expiry: '2023-12-31',
    redemptionRate: '44.5%',
  },
  {
    id: 3,
    code: 'SPRING2023',
    discount: '25%',
    status: 'expired',
    usage: '423/450',
    expiry: '2023-05-31',
    redemptionRate: '94%',
  },
  {
    id: 4,
    code: 'FLASH20',
    discount: '20%',
    status: 'scheduled',
    usage: '0/300',
    expiry: '2023-09-15',
    redemptionRate: '0%',
  },
];

const CouponManagement = () => {
  const navigate = useNavigate();
  const [coupons] = useState(mockCoupons);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'scheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleEdit = (couponId) => {
    // TODO: Implement edit functionality
    console.log('Edit coupon:', couponId);
  };

  const handleDelete = (couponId) => {
    // TODO: Implement delete functionality
    console.log('Delete coupon:', couponId);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Coupon Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/coupons/create')}
        >
          Create Coupon
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search coupons..."
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
          <Button startIcon={<FilterIcon />} variant="outlined">
            Filter
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Coupon Code</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Usage</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Redemption Rate</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell component="th" scope="row">
                  {coupon.code}
                </TableCell>
                <TableCell>{coupon.discount}</TableCell>
                <TableCell>
                  <Chip
                    label={coupon.status}
                    color={getStatusColor(coupon.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{coupon.usage}</TableCell>
                <TableCell>{coupon.expiry}</TableCell>
                <TableCell>{coupon.redemptionRate}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(coupon.id)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(coupon.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CouponManagement;
