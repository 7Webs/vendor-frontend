import React from 'react';
import { AuthProvider } from './AuthContext';
import { CategoryProvider } from './CategoryContext';
import { ShopProvider } from './ShopContext';
import { SubscriptionProvider } from './SubscriptionContext';
import { AnalyticsProvider } from './Analytics';


export const AllProviders = ({ children }) => {
    return (
        <AuthProvider>
            <ShopProvider>
                <CategoryProvider>
                    {/* <AnalyticsProvider> */}
                    {children}
                    {/* </AnalyticsProvider> */}
                </CategoryProvider>
            </ShopProvider>
        </AuthProvider>
    );
};

export default AllProviders;
