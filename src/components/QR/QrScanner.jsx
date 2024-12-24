import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { QrReader } from 'react-qr-reader';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const QrScanner = ({ onScan, onBack }) => {
    const [error, setError] = useState(null);
    const [scanning, setScanning] = useState(true);

    const handleScan = (result) => {
        if (result) {
            onScan(result?.text);
        }
    };

    const handleError = (err) => {
        setError('Failed to access camera');
        console.error(err);
    };

    const handleBack = () => {
        setScanning(false);
        onBack();
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            {error ? (
                <Typography color="error" align="center" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            ) : (
                scanning && (
                    <QrReader
                        constraints={{ facingMode: 'environment' }}
                        onResult={handleScan}
                        onError={handleError}
                        style={{ width: '100%' }}
                    />
                )
            )}

            <Button
                fullWidth
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ mt: 2 }}
            >
                Back
            </Button>
        </Box>
    );
};

export default QrScanner;
