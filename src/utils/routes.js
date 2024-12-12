import React from "react";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import CouponManagement from "../pages/coupon/CouponManagement";
import CouponForm from "../pages/coupon/CouponForm";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import CouponDetails from "../pages/coupon/CouponDetails";

export const routes = {
    public: [
        {
            path: "/login",
            element: React.createElement(Login)
        },
        {
            path: "/register",
            element: React.createElement(Register)
        },
        {
            path: "/forgot-password",
            element: React.createElement(ForgotPassword)
        }
    ],
    protected: [
        {
            element: React.createElement(ProtectedRoute, {
                children: React.createElement(DashboardLayout)
            }),
            children: [
                {
                    path: "/",
                    element: React.createElement(Dashboard)
                },
                {
                    path: "/dashboard",
                    element: React.createElement(Dashboard)
                },
                {
                    path: "/analytics",
                    element: React.createElement(Analytics)
                },
                {
                    path: "/coupons",
                    element: React.createElement(CouponManagement)
                },
                {
                    path: "/coupons/create",
                    element: React.createElement(CouponForm)
                },
                {
                    path: "/coupons/edit/:id",
                    element: React.createElement(CouponForm)
                },
                {
                    path: "/coupons/view/:id",
                    element: React.createElement(CouponDetails)
                },
                {
                    path: "/profile",
                    element: React.createElement(Profile)
                }
            ]
        }
    ]
};
