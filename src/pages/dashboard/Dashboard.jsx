import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  LocalOffer as CouponIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard
const mockData = {
  stats: {
    activeCoupons: 12,
    totalRedemptions: 156,
    activeInfluencers: 8,
  },
  recentActivity: [
    {
      id: 1,
      type: 'redemption',
      message: 'Coupon SUMMER2023 redeemed by user123',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'new_influencer',
      message: 'New influencer partnership with @techreview',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'expiring',
      message: 'Coupon SPRING2023 expires in 2 days',
      time: '3 hours ago',
    },
  ],
  chartData: [
    { name: 'Mon', redemptions: 12 },
    { name: 'Tue', redemptions: 19 },
    { name: 'Wed', redemptions: 15 },
    { name: 'Thu', redemptions: 25 },
    { name: 'Fri', redemptions: 32 },
    { name: 'Sat', redemptions: 28 },
    { name: 'Sun', redemptions: 20 },
  ],
};

const Dashboard = () => {
  const [data] = useState(mockData);

  const StatCard = ({ title, value, icon }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {/* Stats Section */}
        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Coupons"
            value={data.stats.activeCoupons}
            icon={<CouponIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Redemptions"
            value={data.stats.totalRedemptions}
            icon={<TrendingUpIcon color="primary" />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Influencers"
            value={data.stats.activeInfluencers}
            icon={<PeopleIcon color="primary" />}
          />
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Redemptions Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="redemptions" fill="#2EC4B6" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Activity Feed */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Activity</Typography>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
            <List>
              {data.recentActivity.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < data.recentActivity.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
