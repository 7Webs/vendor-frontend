import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Stack,
    Container,
    Paper,
    Fade,
    IconButton,
    Divider
} from '@mui/material';
import { QrCode as QrCodeIcon, ArrowBack as ArrowBackIcon, TextFields as TextFieldsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import QrScanner from '../../components/QR/QrScanner';
import { apiService } from '../../api/apiwrapper';

const CouponScanner = () => {
    const navigate = useNavigate();
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const handleScanQR = () => {
        setShowScanner(true);
        setShowManualEntry(false);
        setIsScanning(true);
    };

    const handleManualEntry = () => {
        setShowManualEntry(true);
        setShowScanner(false);
    };

    const handleScanApi = async (code) => {
        try {
            const response = await apiService.get(`deals/validate/${code}`);
            if (response.data) {
                navigate(`/coupons/view/${response.data.id}`);
            }
        } catch (error) {
            console.error('Invalid or expired coupon code', error);
        }
    };

    const handleManualSubmit = async () => {
        await handleScanApi(manualCode);
        setManualCode('');
        setShowManualEntry(false);
    };

    const handleQRScan = async (code) => {
        if (code && isScanning) {
            setIsScanning(false);
            await handleScanApi(code);
            setShowScanner(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
                <Box sx={{ position: 'relative' }}>
                    {(showManualEntry || showScanner) && (
                        <IconButton 
                            sx={{ position: 'absolute', left: -12, top: -12 }}
                            onClick={() => {
                                setShowManualEntry(false);
                                setShowScanner(false);
                                setIsScanning(false);
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        gutterBottom 
                        align="center"
                        sx={{ fontWeight: 700 }}
                    >
                        Redeem Coupon
                    </Typography>

                    {!showManualEntry && !showScanner && (
                        <Fade in timeout={500}>
                            <Stack spacing={3} sx={{ mt: 6 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<QrCodeIcon />}
                                    onClick={handleScanQR}
                                    fullWidth
                                    size="large"
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    Scan QR Code
                                </Button>
                                
                                <Divider sx={{ my: 2 }}>OR</Divider>
                                
                                <Button
                                    variant="outlined"
                                    startIcon={<TextFieldsIcon />}
                                    onClick={handleManualEntry}
                                    fullWidth
                                    size="large"
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        borderWidth: 2,
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'scale(1.02)'
                                        }
                                    }}
                                >
                                    Enter Code Manually
                                </Button>
                            </Stack>
                        </Fade>
                    )}

                    {showManualEntry && (
                        <Fade in timeout={500}>
                            <Box sx={{ mt: 4 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Enter Coupon Code"
                                    fullWidth
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleManualSubmit}
                                        disabled={!manualCode}
                                        sx={{
                                            borderRadius: 2,
                                            px: 4
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        </Fade>
                    )}

                    {showScanner && (
                        <Fade in timeout={500}>
                            <Box sx={{ mt: 4 }}>
                                <QrScanner
                                    onScan={handleQRScan}
                                    onBack={() => {
                                        setShowScanner(false);
                                        setIsScanning(false);
                                    }}
                                />
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default CouponScanner;
