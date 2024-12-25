import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiService } from "../../api/apiwrapper";
import { useAuth } from "./AuthContext";

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user?.owen?.id) return;

            try {
                const response = await apiService.get(`analytics/${user.owen.id}`);
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Error fetching analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [user]);

    return (
        <AnalyticsContext.Provider
            value={{
                analytics,
                loading,
            }}
        >
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => useContext(AnalyticsContext);
