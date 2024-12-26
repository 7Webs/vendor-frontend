import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const SubscriptionPending = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 4,
            p: 4,
            textAlign: "center",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          <CircularProgress
            size={80}
            thickness={4}
            sx={{
              color: "#003cbf",
              mb: 3
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#001f7f",
              mb: 2
            }}
          >
            Payment Processing
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#666",
              mb: 3
            }}
          >
            Please wait while we process your payment
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#ff3d00",
              fontWeight: 500
            }}
          >
            Do not refresh or go back! ({seconds}s)
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default SubscriptionPending;
