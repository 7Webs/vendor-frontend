import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../api/apiwrapper';

const SubscriptionPaymentPending = () => {
  const [seconds, setSeconds] = useState(60);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        await apiService.get(`subscriptions/payment-success/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });

      checkPaymentStatus();
    }, 1000);

    return () => clearInterval(timer);
  }, [id, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7ff 0%, #ffffff 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            p: 6,
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ position: "relative", mb: 4 }}>
            <CircularProgress
              size={100}
              thickness={3}
              sx={{
                color: "#4f46e5",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#4f46e5",
                fontWeight: 600,
              }}
            >
              {seconds}s
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
            }}
          >
            Processing Payment
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Your payment is being processed securely. Please keep this window open.
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              color: "#ef4444",
              fontWeight: 500,
              p: 1,
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            }}
          >
            Please do not refresh or navigate away
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default SubscriptionPaymentPending;
