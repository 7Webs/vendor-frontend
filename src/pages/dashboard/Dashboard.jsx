import { useState, useEffect } from "react";
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
  ListItemAvatar,
  Avatar,
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  LocalOffer as CouponIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Timer,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { apiService } from "../../api/apiwrapper";
import { useAuth } from "../../utils/contexts/AuthContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        if (user?.owen?.id) {
          const response = await apiService.get(`/analytics/${user.owen.id}`);
          setAnalyticsData(response?.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading || !analyticsData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color = "primary" }) => (
    <Card
      elevation={0}
      sx={{
        background: `linear-gradient(135deg, ${alpha(
          theme.palette[color].main,
          0.1
        )}, ${alpha(theme.palette[color].main, 0.2)})`,
        borderRadius: 4,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          {Icon && (
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette[color].main, 0.2),
                color: theme.palette[color].main,
                p: 1,
              }}
            >
              <Icon />
            </Avatar>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ ml: 2, fontWeight: 600 }}
          >
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h3"
          component="div"
          sx={{
            color: theme.palette[color].main,
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  const approvalStatusData =
    analyticsData?.approvalStats?.map((status) => ({
      name: status.redeemedDeal_status.replace("_", " ").toUpperCase(),
      value: parseInt(status.count),
    })) || [];

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: alpha(theme.palette.background.default, 0.98),
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Estadísticas Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Cupones activos"
            value={analyticsData?.totalDeals ?? 0}
            icon={CouponIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Cupones canjeados"
            value={analyticsData?.totalRedeemedDeals ?? 0}
            icon={TrendingUpIcon}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Cupones caducan pronto"
            value={analyticsData?.dealsNearingExpiration?.length ?? 0}
            icon={Timer}
            color="info"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              background: alpha(theme.palette.background.paper, 0.9),
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Estadísticas de uso
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.timeSeriesData ?? []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha(theme.palette.divider, 0.1)}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    date ? new Date(date).toLocaleDateString() : ""
                  }
                  stroke={theme.palette.text.secondary}
                />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    background: theme.palette.background.paper,
                    border: "none",
                    borderRadius: 8,
                    boxShadow: theme.shadows[3],
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="approvals"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="usages"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="redemptions"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={false}
                />
                // Example of updating the LineChart component
                <LineChart data={analyticsData?.timeSeriesData ?? []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(theme.palette.divider, 0.2)}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      date ? new Date(date).toLocaleDateString() : ""
                    }
                    stroke={theme.palette.text.secondary}
                  />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: "none",
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                      padding: "10px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="approvals"
                    stroke={`url(#gradient1)`}
                    strokeWidth={3}
                    dot={{
                      stroke: theme.palette.primary.main,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    animationDuration={500}
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: theme.palette.primary.main,
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: theme.palette.secondary.main,
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                  </defs>
                </LineChart>
                // Example of updating the BarChart component
                <BarChart data={analyticsData?.redemptionRate ?? []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={alpha(theme.palette.divider, 0.2)}
                  />
                  <XAxis
                    dataKey="deal_title"
                    stroke={theme.palette.text.secondary}
                  />
                  <YAxis stroke={theme.palette.text.secondary} />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: "none",
                      borderRadius: 8,
                      boxShadow: theme.shadows[3],
                      padding: "10px",
                    }}
                  />
                  <Bar
                    dataKey="redeemedcount"
                    fill={`url(#gradient2)`}
                    radius={[4, 4, 0, 0]}
                    animationDuration={500}
                  />
                  <defs>
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{
                          stopColor: theme.palette.success.main,
                          stopOpacity: 1,
                        }}
                      />
                      <stop
                        offset="100%"
                        style={{
                          stopColor: theme.palette.info.main,
                          stopOpacity: 1,
                        }}
                      />
                    </linearGradient>
                  </defs>
                </BarChart>
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              background: alpha(theme.palette.background.paper, 0.9),
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Estados cupones canjeados
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={approvalStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                  labelStyle={{
                    fontSize: "6px",
                  }}
                >
                  {approvalStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{
                        filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.2))",
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: theme.palette.background.paper,
                    border: "none",
                    borderRadius: 8,
                    boxShadow: theme.shadows[3],
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              background: alpha(theme.palette.background.paper, 0.9),
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Rendimiento de los cupones
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData?.redemptionRate ?? []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha(theme.palette.divider, 0.2)}
                />
                <XAxis
                  dataKey="deal_title"
                  stroke={theme.palette.text.secondary}
                />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                  contentStyle={{
                    background: theme.palette.background.paper,
                    border: "none",
                    borderRadius: 8,
                    boxShadow: theme.shadows[3],
                    padding: "10px",
                  }}
                />
                <Bar
                  dataKey="redeemedcount"
                  fill={`url(#gradient2)`}
                  radius={[4, 4, 0, 0]}
                  animationDuration={500}
                />
                <defs>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{
                        stopColor: theme.palette.success.main,
                        stopOpacity: 1,
                      }}
                    />
                    <stop
                      offset="100%"
                      style={{
                        stopColor: theme.palette.info.main,
                        stopOpacity: 1,
                      }}
                    />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              background: alpha(theme.palette.background.paper, 0.9),
              maxHeight: 400,
              overflow: "auto",
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Top Influencers
            </Typography>
            <List>
              {analyticsData?.topUsers?.map((user, index) => (
                <Box key={user?.user_id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {user?.user_name?.[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user?.user_name}
                        </Typography>
                      }
                      secondary={`${user?.redeemedcount ?? 0} redemptions`}
                    />
                    <Chip
                      label={`#${index + 1}`}
                      color="primary"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>
                  {index < (analyticsData?.topUsers?.length ?? 0) - 1 && (
                    <Divider sx={{ opacity: 0.5 }} />
                  )}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              boxShadow: theme.shadows[2],
              background: alpha(theme.palette.background.paper, 0.9),
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Caducan pronto
            </Typography>
            <Grid container spacing={2}>
              {analyticsData?.dealsNearingExpiration
                ?.slice(0, 4)
                .map((deal) => (
                  <Grid item xs={12} sm={6} md={3} key={deal?.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        },
                      }}
                      elevation={2}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}
                        >
                          <Avatar
                            variant="rounded"
                            src={deal?.images?.[0]}
                            sx={{
                              width: "100%",
                              height: 140,
                              borderRadius: 2,
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            noWrap
                          >
                            {deal?.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="error"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            Caduca:{" "}
                            {deal?.availableUntil
                              ? new Date(
                                  deal.availableUntil
                                ).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
