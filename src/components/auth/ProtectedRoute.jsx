import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import AnimatedLoader from "../loaders/AnimatedLoader";

import RegisterShop from "../../pages/auth/RegisterShop";
import Approval from "../../pages/auth/Approval";
import Subscription from "../../pages/subscription/Subscription";

const ProtectedRoute = ({ children }) => {
  // TODO: Implement actual authentication check
  const { user, authChecked, loading } = useAuth();

  if (loading || !authChecked) {
    return <AnimatedLoader />;
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.owen) {
    return <RegisterShop />;
  }

  if (!user.owen.approved) {
    return <Approval />;
  }

  if (!user.owen.activeSubscriptionPlan) {
    return <Subscription />;
  }

  return children;
};

export default ProtectedRoute;
