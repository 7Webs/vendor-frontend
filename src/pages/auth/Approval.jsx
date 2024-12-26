import { Container, Typography, Paper, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Approval = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                background: "linear-gradient(135deg, #001f7f40, #003cbf60)",
            }}
        >
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    py: 6,
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        padding: 6,
                        borderRadius: 4,
                        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
                        width: "100%",
                        maxWidth: 600,
                        textAlign: "center",
                        animation: `${fadeIn} 0.6s ease-out`,
                        background: "linear-gradient(to bottom, #ffffff, #f8f9ff)",
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <CheckCircleIcon 
                            sx={{ 
                                fontSize: 80, 
                                color: "#4CAF50",
                                mb: 2
                            }} 
                        />
                    </Box>
                    <Typography
                        component="h1"
                        variant="h3"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 3,
                            color: "#003cbf",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        Congratulations!
                    </Typography>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            marginBottom: 3,
                            color: "#666",
                            lineHeight: 1.6
                        }}
                    >
                        You have successfully registered your shop.
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: "#555",
                            backgroundColor: "#f5f5f5",
                            padding: 3,
                            borderRadius: 2,
                            border: "1px solid #eee"
                        }}
                    >
                        Please wait for the Admin to review your request. 
                        We'll notify you once your shop is approved.
                    </Typography>
                </Paper>
            </Container>
        </div>
    );
};

export default Approval;
