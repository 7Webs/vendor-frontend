import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import LoadingScreen from "../../utils/LoadingScreen";
import Register from "../../pages/auth/Register";
import RegisterShop from "../../pages/auth/RegisterShop";

const ProtectedRoute = ({ children }) => {
  // TODO: Implement actual authentication check
  const { user, authChecked, loading } = useAuth();

  if (loading || !authChecked) {
    return <LoadingScreen />;
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.owen) {
    return <RegisterShop />;
  }
  




  return children;
};

export default ProtectedRoute;
