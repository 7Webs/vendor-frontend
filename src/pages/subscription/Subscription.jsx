import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Button, Grid, Divider, IconButton } from '@mui/material';
import { keyframes } from '@mui/system';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { apiService } from '../../api/apiwrapper';
import SkeletonLoader from '../../components/loaders/SkeletonLoader';
import { useAuth } from '../../utils/contexts/AuthContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Subscription = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiService.get('subscriptions');
        setList(response.data);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleSubscribe = async (id) => {
    try {
      const response = await apiService.get(`subscriptions/pay/${id}`);
      window.open(response.data, '_blank');
    } catch (error) {
      console.error("Error processing subscription payment:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #001f7f20, #003cbf40)",
      }}
    >
      <IconButton
        onClick={logout}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#003cbf',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        <LogoutIcon />
      </IconButton>

      <Container
        component="main"
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 800,
              marginBottom: 1,
              color: "#001f7f",
              textAlign: "center",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Choose Your Plan
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              color: "#666",
              mb: 4
            }}
          >
            Select the perfect plan for your business needs
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {loading ? (
              <>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <SkeletonLoader />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <SkeletonLoader />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <SkeletonLoader />
                </Grid>
              </>
            ) : (
              list.map((plan) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={plan.id}>
                  <Paper
                    elevation={4}
                    sx={{
                      padding: 2.5,
                      borderRadius: 3,
                      boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
                      textAlign: "center",
                      animation: `${fadeIn} 0.6s ease-out`,
                      background: "linear-gradient(to bottom, #ffffff, #f8f9ff)",
                      maxWidth: '320px',
                      margin: '0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.12)",
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "#001f7f",
                        mb: 2
                      }}
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        mb: 1,
                        color: "#003cbf"
                      }}
                    >
                      €{plan.amount}
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{ color: '#666', ml: 1 }}
                      >
                        per {plan.interval}
                      </Typography>
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 2,
                        color: '#444',
                        fontSize: '0.95rem',
                        lineHeight: 1.5,
                        flexGrow: 1
                      }}
                    >
                      {plan.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ color: '#444' }}>
                          {plan.trialDays} days free trial
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <CheckCircleIcon sx={{ color: '#4CAF50', mr: 1, fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ color: '#444' }}>
                          {plan.maxDeals} deals per month
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => handleSubscribe(plan.id)}
                      sx={{
                        backgroundColor: "#003cbf",
                        '&:hover': {
                          backgroundColor: "#001f7f"
                        },
                        borderRadius: 2,
                        py: 1,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(0, 60, 191, 0.2)'
                      }}
                    >
                      Get Started
                    </Button>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default Subscription;
