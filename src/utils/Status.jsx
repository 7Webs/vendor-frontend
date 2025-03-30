import React from 'react';
import {
    CheckCircle as CheckCircleIcon,
    AccessTime as PendingIcon,
    HourglassEmpty as PendingApprovalIcon,
    Refresh as ResubmitIcon,
    ThumbUp as ApprovedIcon,
    ThumbDown as RejectedIcon,
    Cancel as CanceledIcon
} from '@mui/icons-material';

export const getStatusConfig = (_, status) => {
    switch (status) {
        case 'pending_usage':
            return {
                color: '#ED6C02', // warning
                icon: <PendingIcon sx={{ fontSize: 16 }} />,
                label: 'Pending Usage'
            };
        case 'pending_approval':
            return {
                color: '#0288D1', // info
                icon: <PendingApprovalIcon sx={{ fontSize: 16 }} />,
                label: 'Pending Approval'
            };
        case 're_submission_requested':
            return {
                color: '#ED6C02', // warning
                icon: <ResubmitIcon sx={{ fontSize: 16 }} />,
                label: 'Resubmission Requested'
            };
        case 'approved':
            return {
              color: "#2E7D32", // success
              icon: <ApprovedIcon sx={{ fontSize: 16 }} />,
              label: "Aprobados",
            };
        case 'rejected':
            return {
                color: '#D32F2F', // error
                icon: <RejectedIcon sx={{ fontSize: 16 }} />,
                label: 'Rejected'
            };
        case 'canceled':
            return {
              color: "#C62828", // error dark
              icon: <CanceledIcon sx={{ fontSize: 16 }} />,
              label: "Cancelados",
            };
        case 'used':
            return {
              color: "#2E7D32", // success
              icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
              label: "Usado",
            };
        default:
            return {
                color: '#9E9E9E', // grey
                icon: null,
                label: status
            };
    }
};
