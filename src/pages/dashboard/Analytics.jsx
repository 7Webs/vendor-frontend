import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Mock data for analytics
const mockData = {
  timeSeriesData: [
    { date: '2023-01', views: 1200, redemptions: 350 },
    { date: '2023-02', views: 1800, redemptions: 420 },
    { date: '2023-03', views: 2400, redemptions: 580 },
    { date: '2023-04', views: 2100, redemptions: 490 },
    { date: '2023-05', views: 2800, redemptions: 650 },
    { date: '2023-06', views: 3200, redemptions: 780 },
  ],
  couponPerformance: [
    { name: 'SUMMER2023', value: 35 },
    { name: 'SPRING2023', value: 25 },
    { name: 'WELCOME', value: 20 },
    { name: 'FLASH20', value: 20 },
  ],
  topInfluencers: [
    { name: '@techreview', redemptions: 245, engagement: '8.5%' },
    { name: '@gadgetpro', redemptions: 189, engagement: '7.2%' },
    { name: '@digitaltrends', redemptions: 156, engagement: '6.8%' },
    { name: '@techinsider', redemptions: 134, engagement: '6.1%' },
  ],
};

const COLORS = ['#2EC4B6', '#011627', '#FF9F1C', '#E71D36'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [data] = useState(mockData);

  const handleExport = (format) => {
    // TODO: Implement export functionality
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Analytics Overview</Typography>
        <Box>
          <FormControl sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="1m">Last month</MenuItem>
              <MenuItem value="3m">Last 3 months</MenuItem>
              <MenuItem value="6m">Last 6 months</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Views and Redemptions Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Views vs Redemptions
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="views"
                    stroke="#011627"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="redemptions"
                    stroke="#2EC4B6"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Coupon Performance Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Coupon Performance
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.couponPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.couponPerformance.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Influencers Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Performing Influencers
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Influencer</TableCell>
                    <TableCell align="right">Total Redemptions</TableCell>
                    <TableCell align="right">Engagement Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.topInfluencers.map((influencer) => (
                    <TableRow key={influencer.name}>
                      <TableCell component="th" scope="row">
                        {influencer.name}
                      </TableCell>
                      <TableCell align="right">{influencer.redemptions}</TableCell>
                      <TableCell align="right">{influencer.engagement}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
