import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        // background: "linear-gradient(135deg, #84fab0, #8fd3f4)",
      }}
    >
      <CircularProgress
        sx={{
          color: "#003cbf",
          mb: 2,
          animation: "rotate 1.2s linear infinite",
        }}
      />
      <Typography
        variant="h6"
        sx={{
          color: "#003cbf",
          fontWeight: "bold",
          textAlign: "center",
          opacity: 0.9,
        }}
      >
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
